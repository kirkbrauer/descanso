/*!
 * descanso
 * Copyright(c) 2017 Kirk Brauer
 * MIT Licensed
 */

/**
 * Represents a server status
 * @export
 * @class ServerStatus
 */
export class ServerStatus {

  /**
   * Creates an instance of ServerStatus
   * @param {*} [value] 
   * @param {*} [metadata] 
   * @memberof ServerStatus
   */
  constructor(value?: any, metadata?: any) {
    if (value !== undefined) this.value = value;
    if (metadata !== undefined) this.metadata = metadata;
  }

  /**
   * The HTTP status code
   * @static
   * @type {number}
   * @memberof ServerStatus
   */
  public static status: number = 200;

  /**
   * The code of the status (primarily used in error statuses)
   * @static
   * @type {string}
   * @memberof ServerStatus
   */
  public static code: string = 'Ok';

  /**
   * The data value to return to the client
   * @type {*}
   * @memberof ServerStatus
   */
  public value: any;

  /**
   * Metadata about the server status
   * @type {*}
   * @memberof ServerStatus
   */
  public metadata: any;

  /**
   * Converts the status into a returnable object
   * @returns {*} 
   * @memberof ServerStatus
   */
  public toObject(): any {
    return {
      ...this.metadata,
      value: this.value
    };
  }

}

/**
 * An inner error to explain an issue
 * @export
 * @interface InnerError
 */
export interface InnerError {
  code: string;
  innererror: InnerError;
}

/**
 * A server error
 * @export
 * @class ServerError
 * @extends {ServerStatus}
 */
export class ServerError extends ServerStatus {

  /**
   * Creates an instance of ServerError
   * @param {string} message The error message
   * @param {(Error | Error[])} [details] A specific error produced by the server
   * @param {InnerError} [innererror] An inner error for explanation
   * @param {string} [target] The target of the error
   * @memberof ServerError
   */
  constructor(message: string, details?: Error | Error[], innererror?: InnerError, target?: string) {
    super();
    this.message = message;
    if (details !== undefined) this.details = details;
    if (innererror !== undefined) this.innererror = innererror;
    if (target !== undefined) this.target = target;
  }

  /**
   * The error message
   * @type {string}
   * @memberof ServerError
   */
  public message: string;

  /**
   * The error target
   * @type {string}
   * @memberof ServerError
   */
  public target: string;

  /**
   * The specific server error object
   * @type {(Error | Error[])}
   * @memberof ServerError
   */
  public details: Error | Error[];

  /**
   * An inner error for explanation
   * @type {InnerError}
   * @memberof ServerError
   */
  public innererror: InnerError;

  /**
   * Converts the error into a returnable object
   * @returns {*} 
   * @memberof ServerError
   */
  public toObject(): any {
    let details;
    if (this.details !== undefined) {
      // Convert the details to a string
      details = this.details.toString();
    }
    return {
      error: {
        // Get the error code from the prototype
        code: Object.getPrototypeOf(this).constructor.code,
        message: this.message,
        target: this.target,
        details,
        innererror: this.innererror
      }
    };
  }

}
