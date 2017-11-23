# Descanso [![Build Status](https://travis-ci.org/kirkbrauer/descanso.svg)](https://travis-ci.org/kirkbrauer/descanso)
Define [express][express] routes using ES6 classes and decorators.

## Basic Usage
```typescript
import { App, Router, connect } from 'descanso';

const app = new App(8080);

@connect(app)
class MyRouter extends Router {

  @get('/')
  default(req, res) {
    res.json({ hello: 'world' });
  }

}

app.listen();
```
## Motivation
With express, building multiple versions of an API or spreading routes across multiple files can be a complicated and time consuming process. The goal of Descanso is to simplify this process by defining express routes with ES6 classes.

Whenever you want to create a new version of your API, simply inherit the old one and override the modified methods.

## Features
- Use existing express middleware and plugins
- Easy access to the underlying express API
- Small overhead cost
- Written in [Typescript][typescript]
- Useful utility functions to reduce boilerplate code

## Requirements
- [Typescript][typescript] 2.1+ or [Babel][babel]
- ```emitDecoratorMetadata``` and ```experimentalDecorators``` must be enabled in your [```tsconfig.json```][tsconfig.json]

## Installation
```bash
$ npm install descanso --save
```

## Example
Create a quick API with two different versions hosted at ```/v1.0``` and ```/v2.0```.
```typescript
// Import Descanso
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
} from 'descanso';

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
    // Use the built-in responder function with the default status code
    res.respond({ hello: 'world' });
  }

}

app.listen(); // Start listening on port 8080
```

## Usage
### Create an app
```typescript
import { App } from 'descanso';
// Create a simple app on port 80
const httpApp = new App(80);
// Create a HTTPS app on port 443
const httpsApp = new App(443, true, {
  ca: YOUR_CA,
  key: YOUR_KEY,
  cert: YOUR_CERT
}, 'example.com');
```
#### Starting the app
```typescript
// ...
app.listen().then(() => {
  console.log('App listening on port 8080');
}).catch((error) => {
  console.error('Error listening on port 8080');
});
```
### Create a router
```typescript
import { 
  Router, 
  Request, 
  Response, 
  get, 
  post, 
  connect
} from 'descanso';

import { app } from '../myapp.ts';

@connect(app) // Connect to the app
class MyRouter extends Router {

  @get('/foo') // GET request
  handler(req: Request, res: Response) {
    res.json({ foo: 'bar' });
  }

  @post('/bar') // POST request
  handler(req: Request, res: Response) {
    res.json({ foo: 'bar' });
  }

}
```
### Middleware
Descanso supports all existing express middleware and custom route-specific middleware.
#### Adding middleware to an app
```typescript
import { App } from 'descanso';
import * as bodyParser from 'body-parser';
// Create a simple app on port 80
const app = new App(80);
// Add the body parser middleware
app.addMiddleware(bodyParser.json());
```
#### Adding middleware to router or API
```typescript
import {
  Router, 
  Request, 
  Response, 
  NextFunction, 
  get, 
  middleware, 
  connect, 
  route 
} from 'descanso';
import * as bodyParser from 'body-parser';

import { app } from '../myapp.ts';
import { AnotherRouter } from './another';

@connect(app)
@route('/')
@middleware(bodyParser.json()) // Sets middleware for all routes in the router
class MyRouter extends Router {

  @middleware((req: Request, res: Response, next: NextFunction) => {
    console.log('Subrouter middleware called!');
    next();
  }) // Middleware for the subrouter
  static another = new AnotherRouter();

  @get('/')
  @middleware((req: Request, res: Response, next: NextFunction) => {
    console.log('Middleware called!');
    next();
  }) // Middleware for only this route
  default(req: Request, res: Response) {
    res.json({ foo: 'bar' })
  }

}
```
### API versioning
Descanso allows you to define multiple versions of an api and dynamically switch between them with either a URL query or a fixed route.

When using a URL query, Descanso will default to the latest version if none is provided.
```typescript
import { version, versionQuery, connect } from 'descanso';

import { app } from '../myapp.ts';
import { VersionOneApi } from './versionOne';

@connect(app)
@route('/')
@version('2.0') // The API is hosted at /v2.0/
class VersionTwoApi extends VersionOneApi {}

// ----------------------------------------

@connect(app)
@route('/')
@versionQuery('2.0') // The API is hosted at /?api-version=2.0
class VersionTwoQueryApi extends VersionOneApi {}
```
### Using responders
Descanso provides responders as a simple alternative to the standard express handler structure. When a handler function is decorated with the ```@respond()``` decorator, it will then be able to return a promise. When this promise is fulfilled, Descanso will respond with the appropriate success response. This is especially useful when dealing with async tasks such as database operations.

To use the ```@respond()``` decorator, your function must return a promise that is eventually fufilled with a descanso ```ServerStatus```.
```typescript
import { Router, respond, status, post, get, route, connect } from 'descanso';

import { app } from '../myapp.ts';

@connect(app)
@route('/')
class MyRouter extends Router {

  @get('/')
  @respond()
  getResource() {
    return new Promise((resolve, reject) => {
      // The OK status can be constructed with a JSON value to return and metadata to place outside the value
      resolve(new status.Ok({
        foo: 'bar' 
      }, {
        created: '14 Aug 2017'
      }));
    });
  }

  @post('/')
  @respond(status.Created)
  createResource() {
    return new Promise((resolve, reject) => {
      // If no status is specified, Descanso will default to the specified success status or status.Ok
      resolve({ foo: 'bar' });
    });
  }

}
```
The responses from the example above will look like:
```bash
$ curl http://localhost:8080
{
  "created": "14 Aug 2017",
  "value": {
    "foo": "bar"
  }
}
```
```bash
$ curl http://localhost:8080 -XPOST
{
  "value": {
    "foo": "bar"
  }
}
```
### Using resources
In Descanso, a resource is any object that can be created, accessed, or modified by an API. The standard use case for a resource is to connect it with a database model and define all the required actions. Each action on a resource must override one of the default actions and be decorated by the ```@action``` decorator.
```typescript
import { Resource, Request, ServerStatus, action, status } from 'descanso';

import { UserModel } from '../models';
import { app } from '../myapp.ts';

@connect(app)
@route('/user')
class UserResource extends Resource {
  // Define the GET action
  @action get(req: Request): Promise<ServerStatus> {
    return User.findById(req.params.id).then((user) => {
      return new status.Ok(user);
    });
  }

}
```
### Error handling
Descanso provides several different types of errors that can be used with the ```@respond()``` decorator or the ```req.respond()`` method.
```typescript
import { ServerError } from 'descanso';
// The ServerError class
const error = new ServerError({ message: 'Something went wrong!' });
// Add a system error
const error = new ServerError({ message: 'Something went wrong!', error: err });
// Inner errors allow you to add specific details about an error
const error = new ServerError({
  innererror: {
    code: 'PasswordError',
    innererror: {
      code: 'PasswordDoesNotMeetPolicy',
      minLength: 6,
      maxLength: 64,
    }
  } 
});
```

## Tests
Simply run:
```bash
$ npm install
$ npm test
```

## License
[MIT](LICENSE)

[express]: https://expressjs.com/
[typescript]: https://www.typescriptlang.org/
[babel]: https://babeljs.io/
[tsconfig.json]: https://www.typescriptlang.org/docs/handbook/tsconfig-json.html