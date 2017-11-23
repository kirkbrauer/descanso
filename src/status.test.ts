import 'mocha';
import * as chai from 'chai';

import { ServerStatus, ServerError } from './status';

let serverStatus: ServerStatus;
describe('ServerStatus', () => {
  beforeEach(() => {
    serverStatus = new ServerStatus({ some: 'data' }, { foo: 'bar' });
  });
  describe('constructor()', () => {
    it('sets the status value', () => {
      chai.expect(serverStatus.value).to.deep.equal({ some: 'data' });
    });
    it('sets the status metadata', () => {
      chai.expect(serverStatus.metadata).to.deep.equal({ foo: 'bar' });
    });
  });
  describe('#toObject()', () => {
    it('returns an object', () => {
      chai.expect(serverStatus.toObject()).to.be.an('object');
    });
    it('includes metadata', () => {
      chai.expect(serverStatus.toObject()).to.haveOwnProperty('foo');
    });
    it('includes the value', () => {
      chai.expect(serverStatus.toObject()).to.haveOwnProperty('value');
      chai.expect(serverStatus.toObject().value).to.be.an('object');
      chai.expect(serverStatus.toObject().value).to.deep.equal({ some: 'data' });
    });
  });
});

describe('ServerError', () => {
  let serverError: ServerError;
  beforeEach(() => {
    serverError = new ServerError({
      message: 'message',
      error: new Error('error'),
      innererror: { code: 'Error' },
      target: 'target'
    });
  });
  describe('constructor()', () => {
    it(('sets the error message'), () => {
      chai.expect(serverError.message).to.equal('message');
    });
    it(('sets the internal error'), () => {
      chai.expect(serverError.error).to.be.an('error');
      chai.expect(serverError.error).to.be.an.instanceOf(Error);
    });
    it(('sets the innererror'), () => {
      chai.expect(serverError.innererror).to.deep.equal({ code: 'Error' });
    });
    it(('sets the target'), () => {
      chai.expect(serverError.target).to.equal('target');
    });
  });
  describe('#toObject()', () => {
    it('returns an object', () => {
      chai.expect(serverError.toObject().error).to.be.an('object');
    });
    it('includes the code', () => {
      chai.expect(serverError.toObject().error).to.haveOwnProperty('code');
      chai.expect(serverError.toObject().error.code).to.equal('InternalServerError');
    });
    it('includes the message', () => {
      chai.expect(serverError.toObject().error).to.haveOwnProperty('message');
      chai.expect(serverError.toObject().error.message).to.equal('message');
    });
    it('includes the target', () => {
      chai.expect(serverError.toObject().error).to.haveOwnProperty('target');
      chai.expect(serverError.toObject().error.target).to.deep.equal('target');
    });
    it('includes the error', () => {
      chai.expect(serverError.toObject().error).to.haveOwnProperty('error');
      chai.expect(serverError.toObject().error.error).to.be.a('string');
    });
    it('works with an array of errors', () => {
      serverError = new ServerError({
        message: 'message',
        error: [new Error('error'), new Error('another')],
        innererror: { code: 'Error' },
        target: 'target'
      });
      chai.expect(serverError.toObject().error).to.haveOwnProperty('error');
      chai.expect(serverError.toObject().error.error).to.be.an('array');
      chai.expect(serverError.toObject().error.error.length).to.equal(2);
    });
  });
});
