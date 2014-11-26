Calibrate [![Build Status](https://travis-ci.org/johnbrett/calibrate.svg?branch=master)](https://travis-ci.org/johnbrett/calibrate) [![Dependency Status](https://david-dm.org/johnbrett/calibrate.svg)](https://david-dm.org/johnbrett/calibrate)
=========

Micro library for providing uniform json output for RESTful APIs, with error handling. 

**API Change: Error parameter has been removed. Instead, pass error in as data parameter if error and it will be wrapped or output if Boom as before. Check promise example below. Any questions on this please raise an issue.**

If you're using this module feel free to raise an issue or contact me on twitter if you have any questions @\_johnbrett\_. Feature requests and bug reports are welcomed.

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
    calibrate(data [, meta, options]) - returns calibrated json object

Behaviour:
- Always returns a response in the form:
````
{
    "statusCode": ...,
    "data":       ...,
    "meta":       ...
}
````
- If instance of the Error object:
    - If it is a [Boom](https://www.npmjs.org/package/boom) object, it will return as is.
    - Else it will wrap with a [Boom](https://www.npmjs.org/package/boom) internal server object.
        - If using Hapi, this will log a stack trace to console for easier debugging.
- Data: 
    - Null or undefined: Returns a [Boom](https://www.npmjs.org/package/boom) 404 error object
    - Non-null value: Will wrap value in object with statusCode and meta properties.
- Options accepts
    - context: adds context to notFound error message

Example:
```javascript
var Hapi = require('hapi');
var Calibrate = require('calibrate');
var server = new Hapi.Server(3000);

server.route([
    {
        method: 'GET',
        path: '/user/{id}',
        handler: function(request, reply) {  // Using Calibrate Promises
            User
                .findById(request.params.id) 
                .then(Calibrate)             // Formats if data, 404 if null or undefined
                .catch(Calibrate)            // Any errors will be caught and wrapped if needed
                .then(reply)                 // Return Calibrated Response
        }
    },
    {
        method: 'GET',
        path: '/user',
        handler: function (request, reply) { // Using Callbacks
            User.findbyId(request.params.id, function returnUser(err, user) {
                if(err) {                    // Catch any errors
                    reply(Calibrate(err))    // Any errors will be wrapped if needed 
                } else {
                    reply(Calibrate(user)    // Return Calibrate Response
                }
            })
        }
    }
]);

server.start(function () {
    console.log('Server running at:', server.info.uri);
});
```

License MIT
