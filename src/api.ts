/*!
 * descanso
 * Copyright(c) 2017 Kirk Brauer
 * MIT Licensed
 */

import * as express from 'express';

import { Router } from './router';

/**
 * The API router
 * @export
 * @class Api
 * @extends {Router}
 */
export class Api extends Router {

  /**
   * The API version, usually defined by the version decorator
   * @type {string}
   * @memberof Api
   */
  public version: string;

  /**
   * Whether the API should be accessible via a URL query
   * @type {boolean}
   * @memberof Api
   */
  public versionQuery: boolean;

  /**
   * The name of the API
   * @type {string}
   * @memberof Api
   */
  public name: string;

}
