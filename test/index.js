'use strict';

const Code = require('code');
const Lab = require('lab');
const Calibrate = require('../index.js');
const Boom = require('boom');
const Hapi = require('hapi');
const lab = exports.lab = Lab.script();

const expect = Code.expect;
const describe = lab.describe;
const it = lab.it;

const sampleError = JSON.stringify(Boom.badImplementation().output);
//const sampleErrorWithMessage = JSON.stringify(Boom.badImplementation('sample message').output);
const boomNotFound = JSON.stringify(Boom.notFound().output);
const boomNotFoundWithMessage = JSON.stringify(Boom.notFound('The resource with that ID does not exist or has already been deleted.').output);
const validOutput = JSON.stringify({
    statusCode: 200,
    data: {
        'message': 'test'
    },
    meta: {}
});

describe('Calibrate', () => {

    it('returns a function when reuired', (done) => {

        expect(typeof Calibrate).to.equal('function');
        done();
    });

    it('wraps non-boom errors', (done) => {

        const response = Calibrate(new Error());
        expect(JSON.stringify(response.output)).to.equal(sampleError);
        done();
    });

    it('doesn\'t wrap boom errors', (done) => {

        const response = Calibrate(Boom.notFound());
        expect(JSON.stringify(response.output)).to.equal(boomNotFound);
        done();
    });

    it('formats valid responses', (done) => {

        expect(JSON.stringify(Calibrate({ 'message': 'test' }))).to.equal(validOutput);
        done();
    });

    it('returns not found for null data', (done) => {

        expect(JSON.stringify(Calibrate(null).output)).to.equal(boomNotFoundWithMessage);
        done();
    });

    it('accepts a default return string', (done) => {

        expect(JSON.stringify(Calibrate(null, null, { 'return_string': 'test' }).output))
        .to
        .equal(JSON.stringify(Boom.notFound('test').output));
        done();
    });

    it('accepts a default return string in camelcase', (done) => {

        expect(JSON.stringify(Calibrate(null, null, { returnString: 'test' }).output))
        .to
        .equal(JSON.stringify(Boom.notFound('test').output));
        done();
    });

    it('accepts a default context for not found errors', (done) => {

        expect(JSON.stringify(Calibrate(null, null, { context: 'user' }).output))
        .to
        .equal(JSON.stringify(Boom.notFound('The user resource with that ID does not exist or has already been deleted.').output));
        done();
    });

    it('adds meta if defined', (done) => {

        const expectedResponse = JSON.stringify({
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

    it('adds accepts an object parameter', (done) => {

        const expectedResponse = JSON.stringify({
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

    it('decorates the hapi reply interface', (done) => {

        const server = new Hapi.Server();
        server.connection();
        server.register({
            register: Calibrate.decorate
        }, () => {

            server.route({
                method: 'GET',
                path: '/',
                config: {
                    handler: (response, reply) => {

                        reply.calibrate({ message: 'test' });
                    }
                }
            });

            server.inject({ method: 'GET', url: '/' }, (res) => {

                expect(res.payload).to.equal(validOutput);
                done();
            });
        });
    });

});
