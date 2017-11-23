import 'mocha';
import * as chai from 'chai';
import * as portscanner from 'portscanner';
import chaiHttp = require('chai-http');
chai.use(chaiHttp);

import { App, Request, Response } from './app';
import { Router } from './router';
import { Api } from './api';
import { get, connect, route, versionQuery, version, middleware } from './decorators';

describe('App', () => {
  let testApp: App;
  describe('constructor()', () => {
    before(() => {
      testApp = new App(4000);
    });
    it('sets the port if a number is the argument', () => {
      chai.expect(testApp.config.port).to.equal(4000);
    });
    before(() => {
      testApp = new App({
        port: 4000,
        httpsPort: 4433,
        httpsOptions: {},
        https: false,
        hostname: 'test.com'
      });
    });
    it('sets the config values if an object is provided', () => {
      chai.expect(testApp.config).to.deep.equal({
        port: 4000,
        httpsPort: 4433,
        httpsOptions: {},
        https: false,
        hostname: 'test.com'
      });
    });
    it('should work with HTTPS', () => {
      testApp = new App({
        port: 4000,
        https: true,
        httpsOptions: {},
        httpsPort: 4433,
        hostname: 'test.com'
      });
    });
    it('should not allow HTTPS if a port or options are missing', () => {
      chai.expect(() => {
        testApp = new App({
          port: 4000,
          https: true,
          hostname: 'test.com'
        });
      }).to.throw(Error);
    });
  });
  describe('#set()', () => {
    before(() => {
      testApp = new App();
    });
    it('sets config values', () => {
      testApp.set('https', false);
      chai.expect(testApp.config.https).to.equal(false);
    });
    it('cannot set config values with an incorrect type', () => {
      chai.expect(() => {
        testApp.set('port', 'bar');
      }).to.throw(Error);
    });
    it('cannot set invalid options', () => {
      chai.expect(() => {
        testApp.set('foo', 'bar');
      }).to.throw(Error);
    });
  });
  describe('#get()', () => {
    before(() => {
      testApp = new App(4000);
    });
    it('returns a config value', () => {
      chai.expect(testApp.get('port')).to.equal(4000);
    });
  });
  describe('#http()', () => {
    before(() => {
      testApp = new App(4000);
    });
    it('should return an HTTP server', () => {
      chai.expect(testApp.http()).to.haveOwnProperty('domain');
    });
    it('should set the #httpServer property on the App', () => {
      chai.assert.isDefined(testApp.httpServer);
    });
  });
  describe('#https()', () => {
    before(() => {
      testApp = new App(4000);
    });
    it('should return a HTTPS server', () => {
      chai.expect(testApp.https({})).to.haveOwnProperty('timeout');
    });
    it('should set the #httpsServer property on the App', () => {
      chai.assert.isDefined(testApp.httpsServer);
    });
    it('should trigger the #http() function', () => {
      chai.assert.isDefined(testApp.httpServer);
    });
    it('should require that httpsOptions are set', () => {
      chai.expect(() => {
        testApp.https();
      }).to.throw(Error);
    });
    it('should use the app httpsOptions when none are specified', () => {
      testApp.set('httpsOptions', {});
      testApp.https();
    });
  });
  describe('#connect()', () => {
    @route('/')
    class TestRouter extends Router {
      @get('/')
      default(req: Request, res: Response) {
        res.json({ foo: 'bar' });
      }
    }
    @versionQuery('1.0')
    @route('/')
    class TestQueryApi extends Api {
      @get('/')
      default(req: Request, res: Response) {
        res.json({ foo: 'bar' });
      }
    }
    @version('1.0')
    @route('/')
    class TestApi extends Api {
      @get('/')
      default(req: Request, res: Response) {
        res.json({ foo: 'bar' });
      }
    }
    beforeEach(() => {
      testApp = new App();
    });
    afterEach(() => {
      testApp.close();
    });
    it('connects a router', () => {
      testApp.connect(new TestRouter());
      chai.request(testApp).get('/').end((err, res) => {
        chai.expect(res).to.have.status(200);
        chai.expect(res.body).to.deep.equal({ foo: 'bar' });
      });
    });
    it('does not connect two routes with the same path', () => {
      chai.expect(() => {
        testApp.connect(new TestRouter());
        testApp.connect(new TestRouter());
      }).to.throw(Error);
    });
    it('does not connect two APIs with the same query version', () => {
      chai.expect(() => {
        testApp.connect(new TestQueryApi());
        testApp.connect(new TestQueryApi());
      }).to.throw(Error);
    });
    it('connects URL versioned APIs', () => {
      testApp.connect(new TestApi());
      chai.expect(testApp.routers.length).to.equal(1);
      chai.expect(testApp.routers[0]).to.be.an('object');
      chai.request(testApp).get('/v1.0/').end((err, res) => {
        chai.expect(res).to.have.status(200);
        chai.expect(res.body).to.deep.equal({ foo: 'bar' });
      });
    });
  });
  describe(('#connectVersionedApis()'), () => {
    @versionQuery('1.0')
    @route('/')
    class TestQueryApi extends Api {
      @get('/')
      default(req: Request, res: Response) {
        res.json({ foo: 'bar' });
      }
    }
    @versionQuery('2.0')
    @route('/')
    @middleware((req, res, next) => {
      next();
    })
    @middleware((req, res, next) => {
      next();
    })    
    class TestQueryApi2 extends Api {
      @get('/')
      default(req: Request, res: Response) {
        res.json({ version: 'two' });
      }
    }
    before(() => {
      testApp = new App();
      testApp.connect(new TestQueryApi());
      testApp.connect(new TestQueryApi2());
    });
    it('connects query versioned APIs', () => {
      testApp.connectVersionedApis();
      chai.request(testApp).get('/?api-version=1.0').end((err, res) => {
        chai.expect(res).to.have.status(200);
        chai.expect(res.body).to.deep.equal({ foo: 'bar' });
      });
      chai.request(testApp).get('/?api-version=2.0').end((err, res) => {
        chai.expect(res).to.have.status(200);
        chai.expect(res.body).to.deep.equal({ version: 'two' });
      });
    });
  });
  describe('versioned API handler', () => {
    after(() => {
      testApp.close();
    });
    it('uses the latest version if none is specified', () => {
      chai.request(testApp).get('/').end((err, res) => {
        chai.expect(res).to.have.status(200);
        chai.expect(res.body).to.deep.equal({ version: 'two' });
      });
    });
    it('uses the latest version if an invalid version is specified', () => {
      chai.request(testApp).get('/?api-version=4.0').end((err, res) => {
        chai.expect(res).to.have.status(200);
        chai.expect(res.body).to.deep.equal({ version: 'two' });
      });
    });
  });
});
