# Descanso
Define [express][express] routes with ES6 classes and decorators.

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
With express building multiple versions of an API and spreading routes across multiple files can be a complicated and time consuming process. The goal of Descanso is to simplify this process by making express routes into inheritable ES6 classes.

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
    // Use the built-in responder function with the default status code
    res.respond({ hello: 'world' });
  }

}

app.listen(); // Start listening on port 8080
```

## Usage
### Create an app


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