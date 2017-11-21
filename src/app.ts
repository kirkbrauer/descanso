/*!
 * descanso
 * Copyright(c) 2017 Kirk Brauer
 * MIT Licensed
 */

/**
 * Module dependencies.
 */
import * as http from 'http';
import * as https from 'https';
import * as express from 'express';
import * as _ from 'underscore';

import { Router } from './router';
import { Api } from './api';
import { getLatest } from './utils';
import { ServerStatus, ServerError } from './status';

export interface Request extends express.Request {
  application: App;
}

export interface Response extends express.Response {
  respond(response?: ServerStatus | any): void;
  application: App;
}

export interface NextFunction extends express.NextFunction { }

export function descansoMiddleware(app: App): any {
  return (req: Request, res: Response, next: NextFunction) => {
    res.respond = (response?: ServerStatus | any) => {
      app.responder(req, res, response);
    };
    req.application = app;
    res.application = app;
    return next();
  };
}

/**
 * A configuration option for the App
 * @interface ConfigOption
 */
interface ConfigOption {
  key: string;
  type: string;
}

/*
 * An array of allowed config options
 */
const configOptions: ConfigOption[] = [
  { key: 'debug', type: 'boolean' },
  { key: 'port', type: 'number' },
  { key: 'httpsPort', type: 'number' },
  { key: 'httpsOptions', type: 'object' },
  { key: 'hostname', type: 'string' },
  { key: 'https', type: 'boolean' }
];

/**
 * The app configuration interface
 * @export
 * @interface AppConfig
 */
export interface AppConfig {
  debug?: boolean;
  port?: number;
  httpsPort?: number;
  httpsOptions?: https.ServerOptions;
  hostname?: string;
  https?: boolean;
}

/**
 * The main App class
 * @export
 * @class App
 */
export class App {

  /**
   * An instance of a HTTP server
   * @type {https.Server}
   * @memberof App
   */
  public httpServer: http.Server;

  /**
   * An instance of a HTTPS server
   * @type {https.Server}
   * @memberof App
   */
  public httpsServer: https.Server;

  /**
   * The wrapped express application
   * @type {express.Application}
   * @memberof App
   */
  public expressApp: express.Application;

  /**
   * The app config
   * @private
   * @type {AppConfig}
   * @memberof App
   */
  private config: AppConfig;

  private apis: Api[] = [];
  private versionedApis: Api[] = [];

  /**
   * Creates an instance of App
   * @param {number} [port] 
   * @param {boolean} [https] 
   * @param {number} [httpsPort] 
   * @param {string} [hostname] 
   * @memberof App
   */
  constructor(
    port?: number,
    https?: boolean,
    httpsPort?: number,
    httpsOptions?: https.ServerOptions,
    hostname?: string) {
    this.config = {};
    // Set config values if specified
    if (port !== undefined) this.set('port', port);
    if (https !== undefined) this.set('https', https);
    if (httpsOptions !== undefined) this.set('httpsOptions', httpsOptions);
    if (httpsPort !== undefined) this.set('httpsPort', httpsPort);
    if (hostname !== undefined) this.set('hostname', hostname);
    // Create the express server
    this.http();
    if (this.config.https === true) {
      if (this.config.httpsPort === undefined || this.config.httpsOptions === undefined) {
        throw new Error('A HTTPS port, key, and cert must be defined to use HTTPS');
      } else {
        this.https(this.config.httpsOptions);
      }
    }
  }

  /**
   * Sets a config value
   * @param {string} key 
   * @param {*} value 
   * @memberof App
   */
  public set(key: string, value: any): void {
    // Search for config value in available options
    if (configOptions.find((opt: ConfigOption) => {
      if (opt.key === key) {
        // Check the type of the config value
        if (typeof value === opt.type) return true;
        else throw new Error(
          '\'' + key + '\' is of an incorrect type, it must be a \'' + opt.type + '\'.',
        );
      }
      return false;
    }) === undefined) {
      throw new Error(
        '\'' + key +
        '\' is not a server configuration option, please make sure that it is spelled correctly.',
      );
    }
    // Set the value
    (this.config as any)[key] = value;
  }

  /**
   * Gets a config value
   * @param {string} key
   * @returns {*}
   * @memberof App
   */
  public get(key: string): any {
    return (this.config as any)[key];
  }

  /**
   * Create the HTTP express app
   * @returns {express.Application} 
   * @memberof App
   */
  public http(): http.Server {
    this.expressApp = express();
    this.httpServer = http.createServer(this.expressApp as any);
    this.configureMiddleware();
    return this.httpServer;
  }

  /**
   * Configure the default descanso middleware
   * @private
   * @memberof App
   */
  private configureMiddleware(): void {
    this.expressApp.use(descansoMiddleware(this));
  }

  /**
   * Creates a HTTPS server
   * @param {https.ServerOptions} options
   * @returns {https.Server}
   * @memberof App
   */
  public https(options: https.ServerOptions): https.Server {
    if (options === undefined) throw new Error('HTTPS options are required');
    // Create the HTTP server first
    this.http();
    // Create the HTTPS server
    this.httpsServer = https.createServer(options, this.expressApp as any);
    return this.httpsServer;
  }

  /**
   * Connects a router and it's middleware to app
   * @param {Router | Api} router The router to connect
   * @memberof App
   */
  public connect(...routers: (Router | Api)[]): void {
    // Add all connected routers
    for (const router of routers) {
      // Connect the api at a version if it has one
      if (router.version !== undefined && !router.versionQuery) {
        const path: string = router.path + '/v' + router.version;
        router.path = path.replace('//', '/');
      }
      // Check to see if there are path or versioning conflicts
      for (let i = 0; i < this.apis.length; i += 1) {
        if (this.apis[i].path === router.path &&
          !(router.versionQuery || this.apis[i].versionQuery)) {
          throw new Error('Apis cannot share a path');
        } else if (this.apis[i].path === router.path) {
          if (this.apis[i].version === router.version) {
            throw new Error('Apis cannot share a path and have the same version number');
          }
        }
      }
      if (router.versionQuery && router.version) {
        // Add to the versioned APIs to be processed later
        this.versionedApis.push(router as Api);
      } else {
        // Add to the app router
        this.expressApp.use(router.path, router.middleware, router.expressRouter);
      }
      this.apis.push(router as Api);
    }
  }

  /**
   * Dynamically connect all the versioned APIs
   * @private
   * @memberof App
   */
  private connectVersionedApis(): void {
    // The APIs sorted by path
    let apiPaths: _.Dictionary<Api[]>;
    // Sort the versioned APIs by version number
    apiPaths = _.groupBy(this.versionedApis, 'path');
    // Loop through the different versions
    for (const path in apiPaths) {
      this.expressApp.use(
        path,
        (req: express.Request, res: express.Response, next: express.NextFunction) => {
          // Check for the URL query
          if (req.query['api-version']) {
            // Search for an api by that version
            const api: Api | undefined = apiPaths[path].find((v) => {
              return v.version === req.query['api-version'];
            });
            if (api !== undefined) {
              // If found, use the api
              this.useVersionedApi(api, req, res, next);
            } else {
              // Otherwise use the latest version
              this.useVersionedApi(getLatest(apiPaths[path]), req, res, next);
            }
          } else {
            // Otherwise use the latest version
            this.useVersionedApi(getLatest(apiPaths[path]), req, res, next);
          }
        }
      );
    }
  }

  /**
   * Dynamically use a versioned API and it's middleware
   * @param {Api} api 
   * @param {express.Request} req 
   * @param {express.Response} res 
   * @param {express.NextFunction} next 
   * @memberof App
   */
  public useVersionedApi(api: Api, req: express.Request, res: express.Response, next: express.NextFunction): void {
    // Check if middleware exists
    if (api.middleware !== undefined) {
      // Recursive function to use the middleware
      function assumedNext(index: number) {
        if (index === 0) {
          // Start with the first middleware
          api.middleware[index](req, res, assumedNext(index + 1) as any);
        } else if (index < api.middleware.length) {
          // Return a next function that triggers the recursion again
          return (err?: any) => {
            api.middleware[index](req, res, assumedNext(index + 1) as any);
          };
        } else {
          // End the recursion
          return (err?: any) => {
            api.expressRouter(req, res, next);
          };
        }
      }
      // Start the recursion
      assumedNext(0);
    } else {
      // Otherwise, just use the router
      api.expressRouter(req, res, next);
    }
  }

  /**
   * An automatic responder that takes a descanso ServerStatus
   * @param {Request} req 
   * @param {Response} res 
   * @param {(ServerStatus | any)} response 
   * @memberof App
   */
  public responder(req: Request, res: Response, response: ServerStatus | any) {
    if (response instanceof ServerStatus) {
      res.status(Object.getPrototypeOf(response).constructor.status).json(response.toObject());
    } else {
      res.status(200).json(response);
    }
  }
  
  /**
   * Adds middleware handlers
   * @param {...express.RequestHandler[]} handlers
   * @memberof App
   */
  public addMiddleware(...handlers: express.RequestHandler[]): void {
    this.expressApp.use(handlers);
  }

  /**
   * Starts the HTTP & HTTPS servers
   * @param {number} [port]
   * @param {boolean} [https]
   * @param {number} [httpsPort]
   * @param {https.ServerOptions} [httpsOptions]
   * @param {string} [hostname]
   * @returns {Promise<express.Application>}
   * @memberof App
   */
  public listen(): Promise<express.Application> {
    if (this.versionedApis.length > 0) this.connectVersionedApis();
    return new Promise((resolve, reject) => {
      // Begin listening
      this.httpServer.listen(this.config.port, (err: Error) => {
        if (err === undefined) {
          if (this.config.https === undefined || this.config.https === false) {
            resolve(this.expressApp);
          } else {
            // Listen on the HTTPS port
            this.httpsServer.listen(this.config.httpsPort, this.config.hostname, (err: Error) => {
              if (err === undefined) {
                resolve(this.expressApp);
              } else reject(err);
            });
          }
        } else reject(err);
      });
    });
  }

  public address(): { port: number; family: string; address: string; } {
    return this.httpServer.address();
  }

  public close(): void {
    if (this.httpServer !== undefined) this.httpServer.close();
    if (this.httpsServer !== undefined) this.httpsServer.close();
  }

}
