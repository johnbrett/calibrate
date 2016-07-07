'use strict';

const Calibrate = require('./index');

module.exports = function (server, options, next) {

    const decorator = function (res){

        return this.response(Calibrate(res));
    };
    server.decorate('reply', 'calibrate', decorator);

    next();
};

module.exports.attributes = {
    pkg: require('./package.json')
};
