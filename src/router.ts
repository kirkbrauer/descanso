/*!
 * descanso
 * Copyright(c) 2017 Kirk Brauer
 * MIT Licensed
 */

/**
 * Module dependencies.
 */
import * as express from 'express';

/**
 * The primary router class
 * @export
 * @class Router
 */
export class Router {

  /**
   * The path the router will be connected to
   * @type {string}
   * @memberof Router
   */
  public path: string;

  /**
   * The express router to handle all the routing
   * @type {(express.Router & { [key:string]: any; })}
   * @memberof Router
   */
  public expressRouter: express.Router & { [key: string]: any; };

  /**
   * An array of middleware for the router to use
   * @type {express.RequestHandler[]}
   * @memberof Router
   */
  public middleware: express.RequestHandler[];

  /* Define the index property */
  [key: string]: any;
  
  /**
   * Creates an instance of Router
   * @param {string} [path] The base path - (usually defined by a decorator)
   * @memberof Router
   */
  constructor(path?: string) {
    if (path !== undefined) this.path = path;
    if (this.middleware === undefined) this.middleware = [];
    // Create the local express router
    this.expressRouter = express.Router();
    // Get the handlers of the route
    for (const value of Object.getOwnPropertyNames(Object.getPrototypeOf(this))) {
      // Make sure the property is a function and not the constructor
      if (typeof this[value] === 'function' && value !== 'constructor') {
        // Check if the function has a handler
        if (this[value]() !== undefined) {
          if (this[value]()._handlers !== undefined) {
            // This is really a route handler function
            const opts = this[value]();
            // Setup the route on the express router
            this.expressRouter[opts._type](opts._path, opts._handlers);
          }
        }
      }
    }
    // Loop through all the static properties of the route
    for (const value of Object.getOwnPropertyNames(this.constructor)) {
      // Make sure the property is a Router
      if (typeof (this.constructor as any)[value] === 'object'
        && (this.constructor as any)[value] instanceof Router
        && value !== 'prototype') {
        const router = (this.constructor as any)[value];
        let path;
        // Check if a path is defined for the property
        if (router.path !== undefined) {
          path = router.path;
        } else {
          // Default to the property name
          path = '/' + value;
        }
        // Connect the properties to the express router
        this.expressRouter.use(path, router.middleware, router.expressRouter);
      }
    }
  }

}
