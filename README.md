Calibrate [![Build Status](https://travis-ci.org/johnbrett/calibrate.svg?branch=master)](https://travis-ci.org/johnbrett/calibrate) [![Dependency Status](https://david-dm.org/johnbrett/calibrate.svg)](https://david-dm.org/johnbrett/calibrate)
=========

Micro library for providing uniform json output for RESTful APIs, with error handling. 

*Status: Still in early stages, but will adhere to Semver when ready and will remain 100% unit tested at all times. Please allow some time for API to stablise, and I recommend waiting til 1.0.0 for production use. Any feature requests / bug notifications please open and issues, or a pull request with a failing unit test would be great.* 

*Please star if you using this module so I know where to focus my time spent on open source work.*


Use Calibrate to keep your json output consistent:

e.g common APIs.

```javascript
//returning data:
[{
    "id": 1,
    "name": "John"
}]

//returning error
{
    "statusCode": 500,
    "error": 'Implementation Error'
}

// Calibrate forces consistency, so every API using it will always return a similar route:
{
    "statusCode": 200,
    "data": [{
        "id": 1,
        "name": "John"
    }],
    "meta": {
        "items": 1
    }
}
```

Usage: just call to calibrate your response object, no config required. 

API:
    calibrate([error], [data], [meta], [options]) - returns calibrated json object

Behaviour:
- [Boom](https://www.npmjs.org/package/boom) error object: Passed object as is
- JS Error object: Will wrap error with statusCode and message before output
- Data (No error): Will wrap with statusCode before output. If null or undefined, will return a 'not found' 404 error.
- Adds empty meta object if not specified
- Options accepts
    - context: adds context to notFound error message

Example:
```javascript
var Hapi = require('hapi');
var Calibrate = require('calibrate');
var server = new Hapi.Server(3000);

server.route({
    method: 'GET',
    path: '/',
    handler: function (request, reply) {
        reply(Calibrate(null, 'Hello, world!', { items: 1 })); //
    }
});

server.route({
    method: 'GET',
    path: '/user',
    handler: function (request, reply) {
        var user;
        
        // Will return 404 with message:
        //      "The user resource with that ID does not exist or was already deleted." 
        // since user is undefined, Calibrate handles the error.
        reply(Calibrate(null, user, {}, {context: 'user')); 
    }
});

server.start(function () {
    console.log('Server running at:', server.info.uri);
});
```

Additional Features (to be added):
- Better formatting of non-Boom error objects

License MIT
