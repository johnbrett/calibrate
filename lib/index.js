var Boom = require('boom')
var Defined = require('isdefined').has_value

module.exports = function (data, meta, options) {

    var meta = meta || {}
    var options = options || {}

    if (data && data.isBoom) {

        return data

    } else if(data instanceof Error) {

        return Boom.badImplementation();

    } else if (Defined(data)) {

        return {
            statusCode: 200,
            data: data,
            meta: meta
        }

    } else {

        var context = options.context ? options.context + " " : ""
        var return_string = options.return_string || "The " + context + "resource with that ID does not exist or has already been deleted."
        return Boom.notFound(return_string)

    }
}