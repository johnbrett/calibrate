var Lab = require('lab');
var Calibrate = require('../');
var lab = exports.lab = Lab.script();

var expect = Lab.expect;
var before = lab.before;
var after = lab.after;
var describe = lab.describe;
var it = lab.it;

describe('Calibrate', function () {

  it('returns a function when reuired', function(done) {
    expect(typeof Calibrate === 'function');
    done();
  });

});