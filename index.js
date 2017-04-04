'use strict';

const Boom = require('boom');
const Defined = require('isdefined').has_value;

const internals = {};

/**
 * Evaluates data as to whether it is an error or not and calls error or response as appropriate
 * @param data
 * @param meta
 * @param options
 * @returns {*}
 */
internals.calibrate = module.exports = function (data, meta, options) {

    if (data instanceof Error) {
        return internals.error(data);
    }

    return internals.response(data, meta, options);
};

/**
 * If error is a Boom error object, return as is
 * Else return a Boom badImplementation error object
 */
internals.error = module.exports.error = function (err) {

    if (err.isBoom) {
        return err;
    }

    return Boom.badImplementation(err);
};

/**
 * If data is defined and non-null, wrap with statusCode and meta object properties
 * Else return Boom notFound error object
 */
internals.response = module.exports.response = function (data, _meta, _options) {

    const meta = _meta || {};
    const options = _options || {};

    if (Defined(data)) {
        return {
            statusCode: 200,
            data,
            meta
        };
    }

    const context = options.context ? options.context + ' ' : '';
    const returnString = (options.return_string || options.returnString)
                        || 'The ' + context + 'resource with that ID does not exist or has already been deleted.';
    return Boom.notFound(returnString);
};

/**
 * When used in plugin.register, will decorate the reply interface with the calibrate method
 * so reply.calibrate() can be called
 */
const Decorate = require('./decorate');
internals.decorate = module.exports.decorate = Decorate;

internals.decorate.attributes = Decorate.attributes;
