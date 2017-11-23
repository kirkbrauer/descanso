import 'mocha';
import * as spies from 'chai-spies';
import * as chaiAsPromised from 'chai-as-promised';
import chaiHttp = require('chai-http');
import * as chai from 'chai';
chai.use(spies);
chai.use(chaiAsPromised);
chai.use(chaiHttp);

import { Router } from '../src/router';
import { Api } from '../src/api';
import { Resource } from '../src/resource';
import { ServerStatus } from '../src/status';
import * as status from '../src/statusCodes';
import { Request, Response, App } from '../src/app';
import {
  route,
  middleware,
  get,
  post,
  put,
  del,
  patch,
  options,
  head,
  action,
  respond,
  connect,
  connectApi,
  version,
  versionQuery
} from '../src/decorators';

describe('decorators', () => {
  let testApp: App;
  describe('@route', () => {
    it('works on a Router', () => {
      @route('/test')
      class RouteTestRouter extends Router { }
      chai.expect(new RouteTestRouter().path).to.equal('/test');
    });
    it('works on a method', () => {
      class RouteTestRouter2 extends Router {
        @route('/', 'get')
        default(req: any, res: any) { }
      }
      const instance = new RouteTestRouter2();
      chai.expect((instance.default({}, {}) as any)._path).to.equal('/');
      chai.expect((instance.default({}, {}) as any)._type).to.equal('get');
      chai.expect((instance.default({}, {}) as any)._handlers.length).to.equal(1);
      chai.expect((instance.default({}, {}) as any)._handlers[0]).to.be.a('function');
      chai.expect((instance.default({}, {}) as any)._handlers[0].length).to.equal(2);
    });
    it('works on a static property', () => {
      class TestStaticRouter extends Router {}
      class RouteTestRouter3 extends Router {
        @route('/test', 'get')
        public static test = new TestStaticRouter();
      }
      const instance = new RouteTestRouter3();
      chai.expect((instance.constructor as any).test).to.be.a('object');
      chai.expect((instance.constructor as any).test.path).to.equal('/test');
    });
  });
  describe('@connect', () => {
    before(() => {
      testApp = new App();
      @connect(testApp)
      @route('/')
      class ConnectTestRouter extends Router {
        @route('/', 'get')
        default(req: Request, res: Response) {
          res.json({ it: 'worked' });
        }
      }
    });
    after(() => {
      testApp.close();
    });
    it('should connect a Router to the app', (done: Function) => {
      chai.request(testApp).get('/').end((err, res) => {
        chai.expect(res).to.have.status(200);
        chai.expect(res.body).to.deep.equal({ it: 'worked' });
        done();
      });
    });
  });
  describe('@middleware', () => {
    it('works below the @route decorator', () => {
      @route('/')  
      class RouteTestRouter4 extends Router {
        @route('/test', 'get')
        @middleware((req, res, next) => { })
        default(req: any, res: any) {
          res.json({});
        }
      }
      const instance = new RouteTestRouter4();
      chai.expect((instance.default({}, {}) as any)._path).to.equal('/test');
      chai.expect((instance.default({}, {}) as any)._type).to.equal('get');
      chai.expect((instance.default({}, {}) as any)._handlers.length).to.equal(2);
      chai.expect((instance.default({}, {}) as any)._handlers[0]).to.be.a('function');
      chai.expect((instance.default({}, {}) as any)._handlers[1]).to.be.a('function');
      chai.expect((instance.default({}, {}) as any)._handlers[0].length).to.equal(3);
      chai.expect((instance.default({}, {}) as any)._handlers[1].length).to.equal(2);
    });
    it('works above the @route decorator', () => {
      @route('/')    
      class RouteTestRouter5 extends Router {
        @middleware((req, res, next) => { })
        @route('/test', 'get')
        default(req: any, res: any) {
          res.json({});
        }
      }
      const instance = new RouteTestRouter5();
      chai.expect((instance.default({}, {}) as any)._path).to.equal('/test');
      chai.expect((instance.default({}, {}) as any)._type).to.equal('get');
      chai.expect((instance.default({}, {}) as any)._handlers.length).to.equal(2);
      chai.expect((instance.default({}, {}) as any)._handlers[0]).to.be.a('function');
      chai.expect((instance.default({}, {}) as any)._handlers[1]).to.be.a('function');
      chai.expect((instance.default({}, {}) as any)._handlers[0].length).to.equal(3);
      chai.expect((instance.default({}, {}) as any)._handlers[1].length).to.equal(2);
    });
    it('works with a Router', () => {
      @middleware((req, res, next) => { })
      @route('/')
      class RouteTestRouter6 extends Router {
        @route('/test', 'get')
        default(req: any, res: any) {
          res.json({});
        }
      }
      const instance = new RouteTestRouter6();
      chai.expect(instance.middleware.length).to.equal(1);
      chai.expect(instance.middleware[0]).to.be.a('function');
      chai.expect(instance.middleware[0].length).to.equal(3);
    });
  });
  class RouteTypeTestRouter extends Router {
    @get('/')
    get(req: Request, res: Response) { }
    
    @post('/')
    post(req: Request, res: Response) { }

    @put('/')
    put(req: Request, res: Response) { }
    
    @del('/')
    del(req: Request, res: Response) { }
   
    @patch('/')
    patch(req: Request, res: Response) { }

    @options('/')
    options(req: Request, res: Response) { }

    @head('/')
    head(req: Request, res: Response) { }
  }
  const routeTypeTest = new RouteTypeTestRouter();
  describe('@get', () => {
    it('sets the request type to GET', () => {
      chai.expect((routeTypeTest.get({} as Request, {} as Response) as any)._type).to.equal('get');
    });
  });
  describe('@post', () => {
    it('sets the request type to POST', () => {
      chai.expect((routeTypeTest.post({} as Request, {} as Response) as any)._type).to.equal('post');
    });
  });
  describe('@put', () => {
    it('sets the request type to PUT', () => {
      chai.expect((routeTypeTest.put({} as Request, {} as Response) as any)._type).to.equal('put');
    });
  });
  describe('@del', () => {
    it('sets the request type to DELETE', () => {
      chai.expect((routeTypeTest.del({} as Request, {} as Response) as any)._type).to.equal('delete');
    });
  });
  describe('@patch', () => {
    it('sets the request type to PATCH', () => {
      chai.expect((routeTypeTest.patch({} as Request, {} as Response) as any)._type).to.equal('patch');
    });
  });
  describe('@options', () => {
    it('sets the request type to OPTIONS', () => {
      chai.expect((routeTypeTest.options({} as Request, {} as Response) as any)._type).to.equal('options');
    });
  });
  describe('@head', () => {
    it('sets the request type to HEAD', () => {
      chai.expect((routeTypeTest.head({} as Request, {} as Response) as any)._type).to.equal('head');
    });
  });
  describe('@respond', () => {
    it('takes a function that returns a Promise and converts it into a handler', (done: Function) => {
      class RespondTestRouter extends Router {
        @route('/', 'get')
        @respond()
        default(req: Request): Promise<ServerStatus> {
          return new Promise((resolve, reject) => {
            resolve(new status.Ok({ some: 'data' }, { id: req.params.id }));
          });
        }
      }
      const instance = new RespondTestRouter();
      chai.expect((instance.default as any)()._type).to.equal('get');
      chai.expect((instance.default as any)()._path).to.equal('/');
      chai.expect((instance.default as any)()._handlers.length).to.equal(1);
      chai.expect((instance.default as any)()._handlers[0]).to.be.a('function');
      function fakeRespond(response: any) { }
      const responseSpy = chai.spy(fakeRespond);
      (instance.default as any)()._handlers[0]({ params: { id: '1234' } }, { respond: responseSpy }).then((data: any) => {
        chai.expect(responseSpy).to.have.been.called.with.exactly({ value: { some: 'data' }, metadata: { id: '1234' } });
        done();
      });
    });
    it('cannot be applied to methods that don\'t return a Promise', () => {
      class RespondErrorTestRouter extends Router {
        @route('/', 'get')
        @respond(status.Ok)
        default(): any {
          return undefined;
        }
      }
      const instance = new RespondErrorTestRouter();
      chai.expect(() => {
        (instance.default() as any)._handlers[0]({}, {});
      }).to.throw(Error);
    });
  });
  describe('@action', () => {
    it('decorates the method with @route and @respond', (done: any) => {
      class ActionTestResource extends Resource {
        @action get(): Promise<ServerStatus> {
          return new Promise((resolve, reject) => {
            resolve(new status.Ok({ resource: 'friendly' }));
          });
        }
      }
      const instance = new ActionTestResource();
      chai.expect((instance.get() as any)._type).to.equal('get');
      chai.expect((instance.get() as any)._handlers.length).to.equal(1);
      chai.expect((instance.get() as any)._handlers[0]).to.be.a('function');
      function fakeRespond(response: any) { }
      const responseSpy = chai.spy(fakeRespond);
      (instance.get() as any)._handlers[0]({}, { respond: responseSpy }).then((data: any) => {
        chai.expect(responseSpy).to.have.been.called.with.exactly({ value: { resource: 'friendly' } });
        done();
      });
    });
  });
  describe('@connectApi', () => {
    testApp = new App(4000);
    before(() => {
      testApp = new App();
      @connectApi(testApp)
      class TestConnectApi extends Api {
        @route('/', 'get')
        default(req: Request, res: Response) {
          res.json({ it: 'worked' });
        }
      }
    });
    after(() => {
      testApp.close();
    });
    it('should connect an Api to the app', (done: Function) => {
      chai.request(testApp).get('/').end((err, res) => {
        chai.expect(res).to.have.status(200);
        chai.expect(res.body).to.deep.equal({ it: 'worked' });
        done();
      });
    });
  });
  describe('@version', () => {
    it('should set the api version', () => {
      @version('1.0')
      class VersionTestApi extends Api { }
      const instance = new VersionTestApi();
      chai.expect(instance.version).to.equal('1.0');
    });
  });
  describe('@versionQuery', () => {
    it('should set the api version and the query property to true', () => {
      @versionQuery('1.0')
      class VersionTestApi extends Api { }
      const instance = new VersionTestApi();
      chai.expect(instance.version).to.equal('1.0');
      chai.expect(instance.versionQuery).to.equal(true);
    });
  });
});
