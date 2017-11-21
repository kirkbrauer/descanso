import 'mocha';
import { expect, assert } from 'chai';
import * as portscanner from 'portscanner';

import { App } from '../src';

describe('App', () => {
  let testApp: App;

  before(() => {
    testApp = new App(4000);
  });

  describe('#config', () => {
    it('values are returned by #get()', () => {
      expect(testApp.get('port')).to.equal(4000);
    });

    it('values can be set by #set()', () => {
      testApp.set('https', false);
      expect(testApp.get('https')).to.equal(false);
    });

    it('values can be set by #set()', () => {
      testApp.set('https', false);
      expect(testApp.get('https')).to.equal(false);
    });

    it('values cannot be of an incorrect type', () => {
      expect(() => {
        testApp.set('port', 'bar');
      }).to.throw(Error);
    });

    it('invalid values cannot be set', () => {
      expect(() => {
        testApp.set('foo', 'bar');
      }).to.throw(Error);
    });
  });

  testApp = new App(4000);

  describe('#http()', () => {
    it('should return an HTTP server', () => {
      expect(testApp.http()).to.haveOwnProperty('domain');
    });

    it('should set the #httpServer property on the App', () => {
      assert.isDefined(testApp.httpServer);
    });
  });

  testApp = new App(4000);

  describe('#https()', () => {
    it('requires HTTPS options', () => {
      expect(() => {
        (testApp as any).https();
      }).to.throw(Error);
    });

    it('should return a HTTPS server', () => {
      expect(testApp.https({})).to.haveOwnProperty('timeout');
    });

    it('should set the #httpsServer property on the App', () => {
      assert.isDefined(testApp.httpsServer);
    });

    it('should trigger the #http() function', () => {
      assert.isDefined(testApp.httpServer);
    });
  });
});
