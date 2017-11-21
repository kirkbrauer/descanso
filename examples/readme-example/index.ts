import {
  App, 
  Router,
  Api,
  connect,
  middleware, 
  status,
  version,
  route,
  get
} from '../../lib';

const app = new App(8080); // Create a new app

class MyRouter extends Router {

  @get('/') // Receive GET requests at /
  default(req, res) {
    res.json({ bar: 'baz' });
  }

}

@connect(app) // Connect the API to the app at /
@version('1.0') // Set the version to 1.0
@route('/') // Make this version accessible at /v2.0/
@middleware((req, res, next) => { 
  // Do something...
  next();
}) // Add some middleware to the API router
class MyApi extends Api {
  
  @route('/foobar') // Mount MyRouter at /v1.0/foobar
  static foo = new MyRouter();

  @get('/') // Receive GET requests at /v1.0/
  @middleware((req, res, next) => {
    // Do something else...
    next();
  }) // Add some route-specific middleware
  default(req, res) {
    // Use the built-in responder function
    res.respond(new status.Ok({ foo: 'bar' }));
  }

}

@connect(app) // Connect the API to the app at /
@version('2.0') // Set the version to 2.0
@route('/') // Make this version accessible at /v2.0/
class MyApiV2 extends MyApi {

  @get('/') // Override the default route
  default(req, res) {
    // Use the built-in responder function
    res.respond({ hello: 'world' });
  }

}

app.listen(); // Start listening on port 8080
