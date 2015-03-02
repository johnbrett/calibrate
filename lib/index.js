var Boom = require('boom');
var Defined = require('isdefined').has_value;

/**
 * Evaluates data as to whether it is an error or not and calls error or response as appropriate
 * @param data
 * @param meta
 * @param options
 * @returns {*}
 */
var calibrate = module.exports = function (data, meta, options) {

    if (data instanceof Error) {
        return error(data);
    }

    return response(data, meta, options);
};

/**
 * If error is a Boom error object, return as is
 * Else return a Boom badImplementation error object
 */
var error = module.exports.error = function(err) {

    if (err.isBoom) {
        return err;
    }

    return Boom.badImplementation(err);
};

/**
 * If data is defined and non-null, wrap with statusCode and meta object properties
 * Else return Boom notFound error object
 */
var response = module.exports.response = function(data, _meta, _options) {

    var meta = _meta || {};
    var options = _options || {};

    if (Defined(data)) {
        return {
            statusCode: 200,
            data: data,
            meta: meta
        };
    }

    var context = options.context ? options.context + ' ' : '';
    var returnString = (options.return_string || options.returnString)
                        || 'The ' + context + 'resource with that ID does not exist or has already been deleted.';
    return Boom.notFound(returnString);
};

/**
 * When used in plugin.register, will decorate the reply interface with the calibrate method
 * so reply.calibrate() can be called
 */
var decorate = module.exports.decorate = function(server, options, next) {

    server.decorate('reply', 'calibrate', function(response) {
        return this.response(calibrate(response));
    });

    next();
};
decorate.attributes = require('../package.json');
