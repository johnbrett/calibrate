'use strict';

const Boom = require('@hapi/boom');
const Defined = require('isdefined').has_value;

const internals = {};

/**
 * Evaluates data as to whether it is an error or not and calls error or response as appropriate
 * @param data
 * @param meta
 * @param options
 * @returns {*}
 */
internals.calibrate = function (data, meta, options) {

    if (data instanceof Error) {
        return internals.error(data);
    }

    return internals.response(data, meta, options);
};

/**
 * If error is a Boom error object, return as is
 * Else return a Boom badImplementation error object
 */
internals.error = function (err) {

    if (err.isBoom) {
        return err;
    }

    return Boom.badImplementation(err);
};

/**
 * If data is defined and non-null, wrap with statusCode and meta object properties
 * Else return Boom notFound error object
 */
internals.response = function (data, _meta, _options) {

    const meta = _meta || {};
    const options = _options || {};

    if (Defined(data)) {
        return {
            statusCode: 200,
            data,
            meta
        };
    }

    const context = options.context ? `${options.context} ` : '';
    const returnString =
        options.return_string ||
        options.returnString ||
        `The ${context}resource with that ID does not exist or has already been deleted.`;

    return Boom.notFound(returnString);
};

module.exports = internals.calibrate;

module.exports.error = internals.error;

module.exports.response = internals.response;

module.exports.hapi = {
    name: 'calibrate',
    register(server, { onResponse = true }) {

        if (onResponse) {
            const preResponse = function (request, h) {

                const data = request.response.isBoom ? request.response : request.response.source;
                return internals.calibrate(data);
            };

            server.ext('onPreResponse', preResponse);

            return;
        }

        const calibrateDecorator = function (data, meta) {

            return internals.calibrate(data, meta);
        };

        server.decorate('toolkit', 'calibrate', calibrateDecorator);
    }
};
