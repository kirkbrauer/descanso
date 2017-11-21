/*!
 * descanso
 * Copyright(c) 2017 Kirk Brauer
 * MIT Licensed
 */

import * as express from 'express';

import { get, post, put, del, patch, respond } from './decorators';
import { Router } from './router';
import { status } from './';
import { ServerStatus } from './status';

/**
 * A resource class represents a type of resource like a user or file
 * @class Resource
 * @extends {Router}
 */
export abstract class Resource extends Router {

  /**
   * Creates an instance of Resource
   * @param {string} [path] 
   * @memberof Resource
   */
  constructor(path?: string) {
    super(path);
  }

  /**
   * List all objects of the resource type
   * @param {Promise<ServerStatus>} [promise] 
   * @returns {Promise<ServerStatus>} 
   * @memberof Resource
   */
  public list(promise?: Promise<ServerStatus>): Promise<ServerStatus> {
    if (promise === undefined) {
      console.warn('You haven\'t configured the GET @ \'/\' method for this resource');
      return Promise.reject(new status.NotImplemented('You haven\'t configured the GET method for this resource'));
    } else {
      return promise;
    }
  }

  /**
   * Get an object by id
   * @param {Promise<ServerStatus>} [promise] 
   * @returns {Promise<ServerStatus>} 
   * @memberof Resource
   */
  public get(promise?: Promise<ServerStatus>): Promise<ServerStatus> {
    if (promise === undefined) {
      console.warn('You haven\'t configured the GET method for this resource');
      return Promise.reject(new status.NotImplemented('You haven\'t configured the GET method for this resource'));
    } else {
      return promise;
    }
  }

  /**
   * Create a new object of the resource type
   * @param {Promise<ServerStatus>} [promise] 
   * @returns {Promise<ServerStatus>} 
   * @memberof Resource
   */
  public post(promise?: Promise<ServerStatus>): Promise<ServerStatus> {
    if (promise === undefined) {
      console.warn('You haven\'t configured the POST method for this resource');
      return Promise.reject(new status.NotImplemented('You haven\'t configured the GET method for this resource'));
    } else {
      return promise;
    }
  }

  /**
   * Replace an object
   * @param {Promise<ServerStatus>} [promise] 
   * @returns {Promise<ServerStatus>} 
   * @memberof Resource
   */
  public put(promise?: Promise<ServerStatus>): Promise<ServerStatus> {
    if (promise === undefined) {
      console.warn('You haven\'t configured the PUT method for this resource');
      return Promise.reject(new status.NotImplemented('You haven\'t configured the GET method for this resource'));
    } else {
      return promise;
    }
  }

  /**
   * Delete an object
   * @param {Promise<ServerStatus>} [promise] 
   * @returns {Promise <ServerStatus>} 
   * @memberof Resource
   */
  public del(promise ?: Promise<ServerStatus>): Promise <ServerStatus> {
    if (promise === undefined) {
      console.warn('You haven\'t configured the DELETE method for this resource');
      return Promise.reject(new status.NotImplemented('You haven\'t configured the GET method for this resource'));
    } else {
      return promise;
    }
  }

  /**
   * Update an object
   * @param {Promise<ServerStatus>} [promise] 
   * @returns {Promise <ServerStatus>} 
   * @memberof Resource
   */
  public patch(promise ?: Promise<ServerStatus>): Promise <ServerStatus> {
    if (promise === undefined) {
      console.warn('You haven\'t configured the PATCH method for this resource');
      return Promise.reject(new status.NotImplemented('You haven\'t configured the GET method for this resource'));
    } else {
      return promise;
    }    
  }

}
