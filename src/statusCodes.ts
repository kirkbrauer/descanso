/*!
 * descanso
 * Copyright(c) 2017 Kirk Brauer
 * MIT Licensed
 */

import { ServerStatus, ServerError, InnerError } from './status';
import * as HTTPStatus from 'http-status';

/**
 * 100 Continue
 * @export
 * @class Continue
 * @extends {ServerStatus}
 */
export class Continue extends ServerStatus {
  public static status = 100;
  public static code = 'Continue';
}

/**
 * 101 Switching Protocols
 * @export
 * @class SwitchingProtocols
 * @extends {ServerStatus}
 */
export class SwitchingProtocols extends ServerStatus {
  public static status = 101;
  public static code = 'SwitchingProtocols';
}

/**
 * 200 OK
 * @export
 * @class Ok
 * @extends {ServerStatus}
 */
export class Ok extends ServerStatus {
  public static status = 200;
  public static code = 'Ok';
}

/**
 * 201 Created
 * @export
 * @class Created
 * @extends {ServerStatus}
 */
export class Created extends ServerStatus {
  public static status = 201;
  public static code = 'Created';
}

/**
 * 202 Accepted
 * @export
 * @class Accepted
 * @extends {ServerStatus}
 */
export class Accepted extends ServerStatus {
  public static status = 202;
  public static code = 'Accepted';
}

/**
 * 203 Non-Authoritative Information
 * @export
 * @class NonAuthoritativeInformation
 * @extends {ServerStatus}
 */
export class NonAuthoritativeInformation extends ServerStatus {
  public static status = 203;
  public static code = 'NonAuthoritativeInformation';
}

/**
 * 204 No Content
 * @export
 * @class NoContent
 * @extends {ServerStatus}
 */
export class NoContent extends ServerStatus {
  public static status = 204;
  public static code = 'NoContent';
}

/**
 * 205 Reset Content
 * @export
 * @class ResetContent
 * @extends {ServerStatus}
 */
export class ResetContent extends ServerStatus {
  public static status = 205;
  public static code = 'ResetContent';
}

/**
 * 206 Partial Content
 * @export
 * @class PartialContent
 * @extends {ServerStatus}
 */
export class PartialContent extends ServerStatus {
  public static status = 206;
  public static code = 'PartialContent';
}

/**
 * 207 Multi Status
 * @export
 * @class MultiStatus
 * @extends {ServerStatus}
 */
export class MultiStatus extends ServerStatus {
  public static status = 207;
  public static code = 'MultiStatus';
}

/**
 * 208 Already Reported
 * @export
 * @class AlreadyReported
 * @extends {ServerStatus}
 */
export class AlreadyReported extends ServerStatus {
  public static status = 208;
  public static code = 'AlreadyReported';
}

/**
 * 226 IM Used
 * @export
 * @class IMUsed
 * @extends {ServerStatus}
 */
export class IMUsed extends ServerStatus {
  public static status = 226;
  public static code = 'IMUsed';
}

/**
 * 226 Multiple Choices
 * @export
 * @class MultipleChoices
 * @extends {ServerStatus}
 */
export class MultipleChoices extends ServerStatus {
  public static status = 300;
  public static code = 'MultipleChoices';
}

/**
 * 301 Moved Permanently
 * @export
 * @class MovedPermanently
 * @extends {ServerStatus}
 */
export class MovedPermanently extends ServerStatus {
  public static status = 301;
  public static code = 'MovedPermanently';
}

/**
 * 302 Found
 * @export
 * @class Found
 * @extends {ServerStatus}
 */
export class Found extends ServerStatus {
  public static status = 302;
  public static code = 'Found';
}

/**
 * 303 See Other
 * @export
 * @class SeeOther
 * @extends {ServerStatus}
 */
export class SeeOther extends ServerStatus {
  public static status = 303;
  public static code = 'SeeOther';
}

/**
 * 304 Not Modified
 * @export
 * @class NotModified
 * @extends {ServerStatus}
 */
export class NotModified extends ServerStatus {
  public static status = 304;
  public static code = 'NotModified';
}

/**
 * 305 Use Proxy
 * @export
 * @class UseProxy
 * @extends {ServerStatus}
 */
export class UseProxy extends ServerStatus {
  public static status = 305;
  public static code = 'UseProxy';
}

/**
 * 306 Switch Proxy
 * @export
 * @class SwitchProxy
 * @extends {ServerStatus}
 */
export class SwitchProxy extends ServerStatus {
  public static status = 306;
  public static code = 'SwitchProxy';
}

export class TemporaryRedirect extends ServerStatus {
  public static status = 307;
  public static code = 'TemporaryRedirect';
}

export class PermanentRedirect extends ServerStatus {
  public static status = 308;
  public static code = 'PermanentRedirect';
}

export class BadRequest extends ServerStatus {
  public static status = 400;
  public static code = 'BadRequest';
}

export class Unauthorized extends ServerStatus {
  public static status = 401;
  public static code = 'Unauthorized';
}

export class PaymentRequired extends ServerStatus {
  public static status = 402;
  public static code = 'PaymentRequired';
}

export class Forbidden extends ServerStatus {
  public static status = 403;
  public static code = 'Forbidden';
}

export class NotFound extends ServerStatus {
  public static status = 404;
  public static code = 'NotFound';
}

export class MethodNotAllowed extends ServerStatus {
  public static status = 405;
  public static code = 'MethodNotAllowed';
}

export class NotAcceptable extends ServerStatus {
  public static status = 406;
  public static code = 'NotAcceptable';
}

export class ProxyAuthenticationRequired extends ServerStatus {
  public static status = 407;
  public static code = 'NotAcceptable';
}

export class RequestTimeout extends ServerStatus {
  public static status = 408;
  public static code = 'RequestTimeout';
}

export class Conflict extends ServerStatus {
  public static status = 409;
  public static code = 'Conflict';
}

export class Gone extends ServerStatus {
  public static status = 410;
  public static code = 'Gone';
}

export class LengthRequired extends ServerStatus {
  public static status = 411;
  public static code = 'LengthRequired';
}

export class PreconditionFailed extends ServerStatus {
  public static status = 412;
  public static code = 'PreconditionFailed';
}

export class RequestEntityTooLarge extends ServerStatus {
  public static status = 413;
  public static code = 'RequestEntityTooLarge';
}

export class RequestURITooLarge extends ServerStatus {
  public static status = 414;
  public static code = 'RequestURITooLarge';
}

export class UnsupportedMediaType extends ServerStatus {
  public static status = 415;
  public static code = 'UnsupportedMediaType';
}

export class RequestedRangeNotSatisfiable extends ServerStatus {
  public static status = 416;
  public static code = 'RequestedRangeNotSatisfiable';
}

export class ExpectationFailed extends ServerStatus {
  public static status = 417;
  public static code = 'ExpectationFailed';
}

export class ImATeapot extends ServerStatus {
  public static status = 418;
  public static code = 'ImATeapot';
}

export class MisdirectedRequest extends ServerStatus {
  public static status = 421;
  public static code = 'MisdirectedRequest';
}

export class UnprocessableEntity extends ServerStatus {
  public static status = 422;
  public static code = 'UnprocessableEntity';
}

export class Locked extends ServerStatus {
  public static status = 423;
  public static code = 'Locked';
}

export class FailedDependency extends ServerStatus {
  public static status = 424;
  public static code = 'FailedDependency';
}

export class UpgradeRequired extends ServerStatus {
  public static status = 426;
  public static code = 'UpgradeRequired';
}

export class PreconditionRequired extends ServerStatus {
  public static status = 428;
  public static code = 'PreconditionRequired';
}

export class TooManyRequests extends ServerStatus {
  public static status = 429;
  public static code = 'TooManyRequests';
}

export class RequestHeaderFieldsTooLarge extends ServerStatus {
  public static status = 431;
  public static code = 'RequestHeaderFieldsTooLarge';
}

export class UnavailableForLegalReasons extends ServerStatus {
  public static status = 451;
  public static code = 'UnavailableForLegalReasons';
}

export class InternalServerError extends ServerError {
  public static status = 500;
  public static code = 'InternalServerError';
}

export class NotImplemented extends ServerError {
  public static status = 501;
  public static code = 'NotImplemented';
}

export class BadGateway extends ServerError {
  public static status = 502;
  public static code = 'BadGateway';
}

export class ServiceUnavailable extends ServerError {
  public static status = 503;
  public static code = 'ServiceUnavailable';
}

export class GatewayTimeout extends ServerError {
  public static status = 504;
  public static code = 'GatewayTimeout';
}

export class HTTPVersionNotSupported extends ServerError {
  public static status = 505;
  public static code = 'HTTPVersionNotSupported';
}

export class VariantAlsoNegotiates extends ServerError {
  public static status = 506;
  public static code = 'VariantAlsoNegotiates';
}

export class InsufficientStorage extends ServerError {
  public static status = 507;
  public static code = 'InsufficientStorage';
}

export class LoopDetected extends ServerError {
  public static status = 508;
  public static code = 'LoopDetected';
}

export class NotExtended extends ServerError {
  public static status = 510;
  public static code = 'NotExtended';
}

export class NetworkAuthenticationRequired extends ServerError {
  public static status = 511;
  public static code = 'NetworkAuthenticationRequired';
}
