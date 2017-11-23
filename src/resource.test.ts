import 'mocha';
import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);

import { Resource } from './resource';
import { ServerStatus } from './status';

describe('Resource', () => {
  class TestResource extends Resource { }
  let testResource: TestResource;
  let promise: Promise<ServerStatus>;
  describe('constructor()', () => {
    it('sets the path of the resource', () => {
      testResource = new TestResource('/test');
      chai.expect(testResource.path).to.equal('/test');
    });
  });

  beforeEach(() => {
    testResource = new TestResource();
    promise = new Promise((resolve, reject) => { });
  });
  describe('#list()', () => {
    it('returns a rejected promise if not properly configured', () => {
      chai.expect(testResource.list()).to.be.rejected;
    });
    it('returns a promise if provided one', () => {
      chai.expect(testResource.list(promise)).to.be.an.instanceOf(Promise);
    });
  });
  describe('#get()', () => {
    it('returns a rejected promise if not properly configured', () => {
      chai.expect(testResource.get()).to.be.rejected;
    });
    it('returns a promise if provided one', () => {
      chai.expect(testResource.get(promise)).to.be.an.instanceOf(Promise);
    });
  });
  describe('#post()', () => {
    it('returns a rejected promise if not properly configured', () => {
      chai.expect(testResource.post()).to.be.rejected;
    });
    it('returns a promise if provided one', () => {
      chai.expect(testResource.post(promise)).to.be.an.instanceOf(Promise);
    });
  });
  describe('#put()', () => {
    it('returns a rejected promise if not properly configured', () => {
      chai.expect(testResource.put()).to.be.rejected;
    });
    it('returns a promise if provided one', () => {
      chai.expect(testResource.put(promise)).to.be.an.instanceOf(Promise);
    });
  });
  describe('#del()', () => {
    it('returns a rejected promise if not properly configured', () => {
      chai.expect(testResource.del()).to.be.rejected;
    });
    it('returns a promise if provided one', () => {
      chai.expect(testResource.del(promise)).to.be.an.instanceOf(Promise);
    });
  });
  describe('#patch()', () => {
    it('returns a rejected promise if not properly configured', () => {
      chai.expect(testResource.patch()).to.be.rejected;
    });
    it('returns a promise if provided one', () => {
      chai.expect(testResource.patch(promise)).to.be.an.instanceOf(Promise);
    });
  });
});
