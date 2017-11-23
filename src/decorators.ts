/*!
 * descanso
 * Copyright(c) 2017 Kirk Brauer
 * MIT Licensed
 */

 /**
 * Module dependencies.
 */
import * as express from 'express';

import { App, Request, Response } from './app';
import { ServerStatus, ServerError } from './status';
import { Resource } from './resource';
import * as status from './statusCodes';

/*
 * The request types
 */
export declare type RequestType = 'get' | 'post' | 'put' | 'delete' | 'patch' | 'options' | 'head';

/*
 * The path types
 */
export declare type PathType = string | RegExp | string[] | RegExp[];

/**
 * The route class and method decorator
 * @export
 * @param {PathType} path
 * @param {RequestType} [type='get'] 
 * @returns {*} 
 */
export function route(path: PathType, type: RequestType = 'get'): any {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor): any => {
    // Check the what kind of decorator is being used
    if (propertyKey === undefined && descriptor === undefined) {
      // This is a class decorator
      Object.defineProperty(target.prototype, 'path', {
        value: path,
        writable: true
      });
    } else if (descriptor === undefined) {
      // This is a static constant decorator
      target[propertyKey].path = path;
    } else {
      // This is a handler method decorator
      // Set the default handler as the decorated function
      let newHandlers: any = [descriptor.value];
      let value: any = {};
      // Check if the route has already be initilized
      if (descriptor.value.length === 0) {
        value = descriptor.value();
        // Check if they route already has middleware
        if (value._handlers) {
          // Combine the default handler with the middleware
          newHandlers = value._handlers.concat([value._routeHandler]);
        }
      }
      // Replace the existing method with the following:
      return {
        value: () => {
          // Return the metadata required to connect the route later
          return {
            _path: path,
            _type: type,
            _handlers: newHandlers
          };
        }
      };
    }
  };
}

/**
 * Route decorator for a GET request
 * @export
 * @param {PathType} path 
 * @returns {*} 
 */
export function get(path: PathType): any {
  return route(path, 'get');
}

/**
 * Route decorator for a POST request
 * @export
 * @param {PathType} path 
 * @returns {*} 
 */
export function post(path: PathType): any {
  return route(path, 'post');
}

/**
 * Route decorator for a PATH request
 * @export
 * @param {PathType} path 
 * @returns {*} 
 */
export function put(path: PathType): any {
  return route(path, 'put');
}

/**
 * Route decorator for a DELETE request
 * @export
 * @param {PathType} path 
 * @returns {*} 
 */
export function del(path: PathType): any {
  return route(path, 'delete');
}

/**
 * Route decorator for a PATCH request
 * @export
 * @param {PathType} path 
 * @returns {*} 
 */
export function patch(path: PathType): any {
  return route(path, 'patch');
}

/**
 * Route decorator for a OPTIONS request
 * @export
 * @param {PathType} path 
 * @returns {*} 
 */
export function options(path: PathType): any {
  return route(path, 'options');
}

/**
 * Route decorator for a HEAD request
 * @export
 * @param {PathType} path 
 * @returns {*} 
 */
export function head(path: PathType): any {
  return route(path, 'head');
}

/**
 * Converts a method from a regular handler to a promise responder
 * @export
 * @param {*} [successResponse] The default successful ServerStatus
 * @param {*} [metadata] Any metadata to add to the response
 * @returns {*} 
 */
export function respond(successResponse?: any, metadata?: any): any {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor): any => {
    return {
      // Set the value of the method to a traditional handler
      value: (req: Request, res: Response) => {
        let promise: any;
        // Catch any errors that result from an invalid return type
        try {
          // Trigger the original method, which should return a promise
          promise = descriptor.value(req, res).then((data: any) => {
            let response;
            // Check if the data is actually a ServerStatus
            if (data instanceof ServerStatus) {
              response = data;
            } else {
              // Check if a success response has been provided
              if (response !== undefined) {
                response = new successResponse(data, metadata);
              } else {
                // Respond with the default Ok response
                response = new status.Ok(data, metadata);
              }
            }
            res.respond(response);
            return data;
          }).catch((error: ServerError) => {
            res.respond(error);
          }).catch((error: any) => {
            console.error(error);
          });
          return promise as Promise<ServerStatus>;
        } catch (error) {
          if (promise === undefined) {
            throw new Error('The @respond decorator can only be applied to methods that return a Promise');
          } else {
            throw error;
          }
        }
      }
    };
  };
}

/**
 * The action decorator for Resource methods
 * @export
 * @param {*} target 
 * @param {string} propertyKey 
 * @param {PropertyDescriptor} descriptor 
 * @returns {*} 
 */
export function action(target: any, propertyKey: string, descriptor: PropertyDescriptor): any {
  // Check to make sure the decorated function has a valid name
  if (['list','get', 'post', 'put', 'del', 'path'].indexOf(propertyKey) > -1) {
    let decorated;
    // Make the decorated method a responder
    decorated = respond()(target, propertyKey, descriptor);
    let path;
    // Check if the path should be the index URL for the resource (only for POST requests)
    if (propertyKey === 'post' || propertyKey === 'list') {
      path = '/';
    } else {
      path = '/:id';
    }
    // Mount the decorated method as a route
    decorated = route(path, (propertyKey as any))(target, propertyKey, decorated);
    // Return the final property descriptor
    return decorated;
  }
  // Throw an error if the decorator is used on a method with an invalid name
  throw new Error('The @action decorator cannot be applied to non-standard resource actions');
}

/**
 * The connect decorator connects the router/api to the app
 * @export
 * @param {App} app 
 * @returns 
 */
export function connect(app: App, path?: string) {
  return (target: any) => {
    if (path !== undefined) route(path)(target);
    if (target.prototype.path === undefined) {
      console.warn(
        'DESCANSO WARN: It is dangerous to allow router paths to default to \'/\', you should ' +
        'specify a base path for the router by using the @route decorator.'
      );
      // Default to the base path anyways
      route('/')(target);
    }
    // Instanciate the router
    const router = new target(path);
    // Connect the router to the app
    app.connect(router);
  };
}

/**
 * The middleware decorator
 * allows you to add middleware to any decorated route
 * @export
 * @param {...express.RequestHandler[]} handlers 
 * @returns {*} 
 */
export function middleware(...handlers: express.RequestHandler[]): any {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor): any => {
    // Check if the middleware is being applied to a method, property or class
    if (propertyKey === undefined && descriptor === undefined) {
      // It is being applied to a class
      // Check if the class already has middleware
      if (target.prototype.middleware !== undefined) {
        // Combine existing middleware with new middleware
        Object.defineProperty(target.prototype, 'middleware', {
          value: handlers.concat(target.prototype.middleware),
          writable: true
        });
      } else {
        Object.defineProperty(target.prototype, 'middleware', {
          value: handlers,
          writable: true
        });
      }
    } else if (descriptor === undefined) {
      // It is being applied to a static property
      let newHandlers = handlers;
      // Check if the target property has middleware
      if (target[propertyKey].middleware) {
        // Combine with existing handlers
        newHandlers = handlers.concat(target[propertyKey].middleware);
      }
      target[propertyKey].middleware = newHandlers;
    } else {
      let newHandlers = handlers;
      let value: any = {};
      // Set the routeHandler temp to the actual method's value
      let routeHandler = descriptor.value;
      // Check if the route has already be initilized
      if (descriptor.value.length === 0) {
        // Use the existing initilized value
        value = descriptor.value();
        // Check if there are existing handlers
        if (value._handlers) {
          // Combine with existing handlers
          newHandlers = handlers.concat(value._handlers);
          // Use the existing route handler
          routeHandler = value._routeHandler;
        }
      }
      return {
        value: () => {
          // Return all the required data and the new handlers
          return {
            _path: value._path,
            _type: value._type,
            _handlers: newHandlers,
            // This should be removed by the @route decorator
            _routeHandler: routeHandler
          };
        }
      };
    }
  };
}

/**
 * Connect an Api at the root of the app
 * @export
 * @param {App} app 
 * @returns {*} 
 */
export function connectApi(app: App): any {
  return connect(app, '/');
}

/**
 * Set the version number for an Api class
 * @export
 * @param {string} ver 
 * @param {boolean} [versionQuery=false] 
 * @returns {*} 
 */
export function version(ver: string, versionQuery: boolean = false): any {
  return (target: any) => {
    // Define the version property
    Object.defineProperty(target.prototype, 'version', {
      value: ver,
      writable: true
    });
    // Define whether this version should be accessed by a query string
    Object.defineProperty(target.prototype, 'versionQuery', {
      value: versionQuery,
      writable: true
    });
  };
}

/**
 * Set the version number for an Api and set the versionQuery to true
 * @export
 * @param {string} ver 
 * @returns {*} 
 */
export function versionQuery(ver: string): any {
  return version(ver, true);
}
