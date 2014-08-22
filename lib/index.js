var Boom = require('boom');

module.exports = function(err, data, options) {
  if(err) {
    if(err.isBoom) {
      return err
    } else {
      return {
        statusCode: err.statusCode ? err.statusCode : 500,
        error: err.name ? err.name : 'Undefined Error',
        message: err.message ? err.message : 'Internal Server Error'
      };
    } 
  } else if(data === null || data === undefined){
    return Boom.notFound();
  } else {
    return {
      statusCode: 200,
      data: data
    };
  };
};