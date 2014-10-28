var Boom = require('boom');

module.exports = function(err, data, meta, options) {

  var meta = meta || {};
  var options = options || {};

  var get_return_string = function() {

    var context = " "+options.context+" " || "";
    var return_string = options.return_string || "The"+context+"resource with that ID does not exist or was already deleted.";

    return return_string;
  }

  if(err) {
    if(err.isBoom) {
      return err;
    } else {
      return Boom.badImplementation( err.message ? err.message : null )
    }
  }

  if(data !== null && typeof data !== 'undefined') {
    return {
      statusCode: 200,
      data: data,
      meta: meta
    };
  } else {
    return Boom.notFound(get_return_string());
  }
};