var Boom = require('boom')
var Defined = require('isdefined').has_value

/**
 * Evaluates data as to whether it is an error or not and calls error or response as appropriate
 * @param data
 * @param meta
 * @param options
 * @returns {*}
 */
module.exports = function (data, meta, options) {

    if(data instanceof Error) {
        return error(data)
    } else {
        return response(data, meta, options)
    }
}

/**
 * If error is a Boom error object, return as is
 * Else return a Boom badImplementation error object
 * @type {error}
 */
var error = module.exports.error = function(err) {

    if(err.isBoom) {
        return err
    } else {
        return Boom.badImplementation(err)
    }
}

/**
 * If data is defined and non-null, wrap with statusCode and meta object properties
 * Else return Boom notFound error object
 * @type {response}
 */
var response = module.exports.response = function(data, meta, options) {

    var meta = meta || {}
    var options = options || {}

    if (Defined(data)) {
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