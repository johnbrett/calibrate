Calibrate [![Build Status](https://travis-ci.org/johnbrett/calibrate.svg?branch=master)](https://travis-ci.org/johnbrett/calibrate) [![Dependency Status](https://david-dm.org/johnbrett/calibrate.svg)](https://david-dm.org/johnbrett/calibrate)
=========

Micro library for providing uniform json output for RESTful APIs, with error handling.

Feel free to raise an issue or contact me on twitter if you have any questions [@johnbrett_](https://www.twitter.com/johnbrett_). Beginners, feature requests and bug reports are welcomed.

*Please star if you using this module so I know where to focus my time spent on open source work.*

**Usage:**
```javascript
const Calibrate = require('calibrate')

/**
* Checks whether data is an error, calls either Calibrate.error or Calibrate.reponse
**/
Calibrate(data [, meta])

// Valid response structure:
{
    "statusCode": ...,
    "data":       ...,
    "meta":       ...
}

// Error response structure:
{
    "statusCode": ...,
    "error":      ...,
    "message":    ...
}

/**
* If data is non-null and defined:
*  -  wraps value in object with statusCode and meta properties
* If null or undefined
*  -  returns a Boom notFound error object
**/
Calibrate.response(data [, meta])

/**
* If is a Boom Error object
*  - returns object as is
* If is a non Boom Error Object
*  - returns a Boom badImplementaion Error Object
**/
Calibrate.error(data)

/**
* **For use with Hapi.js framework (http://hapijs.com)**
* Decorates the reply interface with the calibrate method
**/
Calibrate.decorate // register as a hapijs plugin

```

Example in Hapijs:
```javascript
const Hapi = require('hapi');
const Calibrate = require('calibrate');
const server = new Hapi.Server();
server.connection({ port: 3000 });

server.register([
    { register: Calibrate.decorate }    // Register decorator, used in third example
], (err) => {

    if (err) {
        throw err;
    }

    server.route([
        {
            method: 'GET',
            path: '/user/{id}',
            handler: function (request, reply) {            // Using Promises
                
                const promise = User.findById(request.params.id)
                    .then(Calibrate.response)               // Formats Response
                    .catch(Calibrate.error);                // Errors caught and wrapped
                return reply(promise);                      // Return Calibrated Response
            }
        },
        {
            method: 'GET',
            path: '/team/{id}',
            handler: function (request, reply) {            // Using Callbacks

                Team.findById(request.params.id, (err, team) => {
                    
                    if (err) {                              // Catch any errors
                        return reply(Calibrate.error(err)); // Errors caught and wrapped
                    }
                    
                    return reply(Calibrate.response(team)); // Return Calibrate Response
                });
            }
        },
        {
            method: 'GET',
            path: '/team/{id}',
            handler: function (request, reply) {            // Using new decorator function

                Team.findById(request.params.id, (err, team) => {
                    
                    if(err) {                               // Catch any errors
                        return reply.calibrate(err);        // Using decorator function
                    }
                    
                    return reply.calibrate(team);           // Using decorator function
                });
            }
        }
    ]);

    server.start((err) => {
    
        if (err) {
            throw err;
        }
        console.log('Server running at:', server.info.uri);
    });
});
```

License MIT @ John Brett
