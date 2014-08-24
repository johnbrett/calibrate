var Boom = require('boom');

module.exports = function(err, data, options) {

  if(err) {

    if(err.isBoom) {
      return err;
    } else {
      return Boom.badImplementation( err.message ? err.message : null )
    }

  }

  if(data !== null) {

    return {
      statusCode: 200,
      data: data,
      meta: {}
    };

  } else {
    
    return Boom.notFound()

  }

};