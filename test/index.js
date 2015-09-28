var Code = require('code');
var Lab = require('lab');
var Calibrate = require('../index.js');
var Boom = require('boom');
var Hapi = require('hapi');
var lab = exports.lab = Lab.script();

var expect = Code.expect;
var describe = lab.describe;
var it = lab.it;

var sampleError = JSON.stringify(Boom.badImplementation().output);
var boomNotFound = JSON.stringify(Boom.notFound().output);
var boomNotFoundWithMessage = JSON.stringify(Boom.notFound('The resource with that ID does not exist or has already been deleted.').output);
var validOutput = JSON.stringify({
    statusCode: 200,
    data: {
        'message': 'test'
    },
    meta: {}
});

describe('Calibrate', function () {

    it('returns a function when reuired', function (done) {

        expect(typeof Calibrate).to.equal('function');
        done();
    });

    it('wraps non-boom errors', function (done) {

        var response = Calibrate(new Error());
        expect(JSON.stringify(response.output)).to.equal(sampleError);
        done();
    });

    it('doesn\'t wrap boom errors', function (done) {

        var response = Calibrate(Boom.notFound());
        expect(JSON.stringify(response.output)).to.equal(boomNotFound);
        done();
    });

    it('formats valid responses', function (done) {

        expect(JSON.stringify(Calibrate({ 'message': 'test' }))).to.equal(validOutput);
        done();
    });

    it('returns not found for null data', function (done) {

        expect(JSON.stringify(Calibrate(null).output)).to.equal(boomNotFoundWithMessage);
        done();
    });

    it('accepts a default return string', function (done) {

        expect(JSON.stringify(Calibrate(null, null, { 'return_string': 'test' }).output))
        .to
        .equal(JSON.stringify(Boom.notFound('test').output));
        done();
    });

    it('accepts a default return string in camelcase', function (done) {

        expect(JSON.stringify(Calibrate(null, null, { returnString: 'test' }).output))
        .to
        .equal(JSON.stringify(Boom.notFound('test').output));
        done();
    });

    it('accepts a default context for not found errors', function (done) {

        expect(JSON.stringify(Calibrate(null, null, { context: 'user' }).output))
        .to
        .equal(JSON.stringify(Boom.notFound('The user resource with that ID does not exist or has already been deleted.').output));
        done();
    });

    it('adds meta if defined', function (done) {

        var expectedResponse = JSON.stringify({
            statusCode: 200,
            data: {
                message: 'test'
            },
            meta: {
                items: 1
            }
        });

        expect(JSON.stringify(Calibrate({ message: 'test' }, { items: 1 }))).to.equal(expectedResponse);
        done();
    });

    it('adds accepts an object parameter', function (done) {

        var expectedResponse = JSON.stringify({
            statusCode: 200,
            data: {
                message: 'test'
            },
            meta: {
                items: 1
            }
        });

        expect(JSON.stringify(Calibrate({ message: 'test' }, { items: 1 }, {}))).to.equal(expectedResponse);
        done();
    });

    it('decorates the hapi reply interface', function (done) {

        var server = new Hapi.Server();
        server.connection();
        server.register({
            register: Calibrate.decorate
        }, function () {

            server.route({
                method: 'GET',
                path: '/',
                config: {
                    handler: function (response, reply) {

                        reply.calibrate({ message: 'test' });
                    }
                }
            });

            server.inject({ method: 'GET', url: '/' }, function (res) {

                expect(res.payload).to.equal(validOutput);
                done();
            });
        });
    });

});
