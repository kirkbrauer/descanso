import 'mocha';
import * as chai from 'chai';
import chaiHttp = require('chai-http');
chai.use(chaiHttp);

import { Router } from './router';
import { get, route, connect } from './decorators';
import { Request, Response, App } from './app';

describe('Router', () => {
  const testApp: App = new App();
  class AnotherRouter extends Router {

    @get('/')
    default(req: Request, res: Response) {
      res.json({ it: 'worked' });
    }

    @get('/hello')
    hello(req: Request, res: Response) {
      res.json({ deep: 'route' });
    }

  }
  @connect(testApp)
  class TestRouter extends Router {
    static another: AnotherRouter = new AnotherRouter();
    @route('/diff')
    static differentPath: AnotherRouter = new AnotherRouter();
    @get('/')
    default(req: Request, res: Response) {
      res.json({ foo: 'bar' });
    }
  }
  after(() => {
    testApp.close();
  });
  describe('constructor', () => {
    it('creates an express router', () => {
      const testRouter: TestRouter = new TestRouter();
      chai.expect(testRouter.expressRouter).to.be.a('function');
    });
    it('connects basic route handler functions', (done: Function) => {
      chai.request(testApp).get('/').end((err, res) => {
        chai.expect(res).to.have.status(200);
        chai.expect(res.body).to.deep.equal({ foo: 'bar' });
        done();
      });
    });
    it('connects static routers with an explicitly defined route', (done: Function) => {
      chai.request(testApp).get('/diff').end((err, res) => {
        chai.expect(res).to.have.status(200);
        chai.expect(res.body).to.deep.equal({ it: 'worked' });
        done();
      });
    });
    it('connects static routers with an implicity defined route', (done: Function) => {
      chai.request(testApp).get('/another').end((err, res) => {
        chai.expect(res).to.have.status(200);
        chai.expect(res.body).to.deep.equal({ it: 'worked' });
        done();
      });
    });
    it('works deeply with static routers', (done: Function) => {
      chai.request(testApp).get('/another/hello').end((err, res) => {
        chai.expect(res).to.have.status(200);
        chai.expect(res.body).to.deep.equal({ deep: 'route' });
        done();
      });
    });
  });
});
