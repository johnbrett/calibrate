var Code = require('code');
var Lab = require('lab');
var Calibrate = require('../index.js');
var Boom = require('boom')
var lab = exports.lab = Lab.script();

var expect = Code.expect;
var before = lab.before;
var after = lab.after;
var describe = lab.describe;
var it = lab.it;

describe('Calibrate', function () {

  var sampleError = JSON.stringify(Boom.badImplementation().output);
  var sampleErrorWithMessage = JSON.stringify(Boom.badImplementation('sample message').output);
  var boomNotFound = JSON.stringify(Boom.notFound().output);
  var boomNotFoundWithMessage = JSON.stringify(Boom.notFound("The resource with that ID does not exist or has already been deleted.").output);
  var validOutput = JSON.stringify({
    statusCode: 200,
    data: {
      'message': 'test'
    },
    meta: {}
  });

  it('returns a function when reuired', function(done) {
    expect(typeof Calibrate === 'function');
    done();
  });

  it('handles errors', function(done) {
    var response = Calibrate(new Error, null)
    expect(JSON.stringify(response.output)).to.equal(sampleError)
    done();
  });

  it('doesn\'t wrap boom errors', function(done) {
    var response = Calibrate(Boom.notFound());
    expect(JSON.stringify(response.output)).to.equal(boomNotFound);
    done();
  });

  it('wraps non boom errors', function(done) {
    var response = Calibrate(new Error('message'), null);
    expect(JSON.stringify(response.output)).to.equal(sampleErrorWithMessage);
    done();
  });

  it('formats valid responses', function(done) {
    expect(JSON.stringify(Calibrate(null, {'message': 'test'}))).to.equal(validOutput);
    done()
  })

  it('returns not found for null data', function(done) {
    expect(JSON.stringify(Calibrate(null, null).output)).to.equal(boomNotFoundWithMessage);
    done()
  })

  it('accepts a default return string', function(done) {
    expect(JSON.stringify(Calibrate(null, null, null, {return_string: 'test'}).output))
    .to
    .equal(JSON.stringify(Boom.notFound('test').output));
    done()
  })

  it('accepts a default context for not found errors', function(done) {
    expect(JSON.stringify(Calibrate(null, null, null, {context: 'user'}).output))
    .to
    .equal(JSON.stringify(Boom.notFound('The user resource with that ID does not exist or has already been deleted.').output));
    done()
  })

  it('adds meta if defined', function(done) {

    var expected_response = JSON.stringify({
      statusCode: 200,
      data: {
        message: 'test'
      },
      meta: {
        items: 1
      }
    });

    expect(JSON.stringify(Calibrate(null, { message: 'test'}, {items: 1 }))).to.equal(expected_response);
    done()
  })

  it('adds accepts an object parameter', function(done) {

    var expected_response = JSON.stringify({
      statusCode: 200,
      data: {
        message: 'test'
      },
      meta: {
        items: 1
      }
    });

    expect(JSON.stringify(Calibrate(null, { message: 'test'}, {items: 1 }, {}))).to.equal(expected_response);
    done()
  })

});