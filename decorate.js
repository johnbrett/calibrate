'use strict';

const Calibrate = require('./index');

module.exports = function (server, options, next) {

    const decorator = function (res, _meta, _options){

        return this.response(Calibrate(res, _meta, _options));
    };
    server.decorate('reply', 'calibrate', decorator);

    next();
};

module.exports.attributes = {
    pkg: require('./package.json')
};
