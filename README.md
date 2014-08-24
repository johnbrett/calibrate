Calibrate [![Build Status](https://travis-ci.org/johnbrett/calibrate.svg?branch=master)](https://travis-ci.org/johnbrett/calibrate) [![Dependency Status](https://david-dm.org/johnbrett/calibrate.svg)](https://david-dm.org/johnbrett/calibrate)
=========

Simple plugin for providing uniform json output for RESTful APIs.

*Status: Still in very early stages, allow a week or two for API to stabilise.* 

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
        "items":1
    }
}
```

Usage: just call to calibrate your response object, no config required. 

API:
    calibrate([error], [data], [options]) - returns calibrated json object

Behaviour:
- [Boom](https://www.npmjs.org/package/boom) error object: Passed object as is
- JS Error object: Will wrap error with statusCode and message before output
- Data (No error): Will wrap with statusCode before output

Example:
```javascript
var Hapi = require('hapi');
var Calibrate = require('calibrate');
var server = new Hapi.Server(3000);

server.route({
    method: 'GET',
    path: '/',
    handler: function (request, reply) {
        reply(Calibrate(null, 'Hello, world!'));
    }
});

server.start(function () {
    console.log('Server running at:', server.info.uri);
});
```

Additional Features (to be added):
- Escape all data by default
- Better formatting of non-Boom error objects

License MIT
