var Calibrate = require('../');

var Promise = require('bluebird');

var resolver = function(){
  return new Promise(function(resolve, reject) {
    resolve({key: 'value'});
  })
}

console.log(Calibrate(resolver()))

