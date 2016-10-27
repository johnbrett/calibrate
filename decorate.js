'use strict';

const Calibrate = require('./index');

module.exports = function (server, options, next) {

    const decorator = function (res, meta, options){

        return this.response(Calibrate(res, meta, options));
    };
    server.decorate('reply', 'calibrate', decorator);

    next();
};

module.exports.attributes = {
    pkg: require('./package.json')
};
