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

const sampleError = JSON.stringify(Boom.badImplementation().output.payload);
const boomNotFound = JSON.stringify(Boom.notFound().output.payload);
const boomNotFoundWithMessage = JSON.stringify(Boom.notFound('The resource with that ID does not exist or has already been deleted.').output.payload);
const validOutput = JSON.stringify({
    statusCode: 200,
    data: {
        'message': 'test'
    },
    meta: {}
});

describe('Calibrate', () => {

    it('returns a function when reuired', () => {

        expect(typeof Calibrate).to.equal('function');
    });

    it('wraps non-boom errors', () => {

        const response = Calibrate(new Error());
        expect(JSON.stringify(response.output.payload)).to.equal(sampleError);
    });

    it('doesn\'t wrap boom errors', () => {

        const response = Calibrate(Boom.notFound());
        expect(JSON.stringify(response.output.payload)).to.equal(boomNotFound);
    });

    it('formats valid responses', () => {

        expect(JSON.stringify(Calibrate({ 'message': 'test' }))).to.equal(validOutput);
    });

    it('returns not found for null data', () => {

        expect(JSON.stringify(Calibrate(null).output.payload)).to.equal(boomNotFoundWithMessage);
    });

    it('accepts a default return string', () => {

        expect(JSON.stringify(Calibrate(null, null, { 'return_string': 'test' }).output))
            .to
            .equal(JSON.stringify(Boom.notFound('test').output));
    });

    it('accepts a default return string in camelcase', () => {

        expect(JSON.stringify(Calibrate(null, null, { returnString: 'test' }).output))
            .to
            .equal(JSON.stringify(Boom.notFound('test').output));
    });

    it('accepts a default context for not found errors', () => {

        expect(JSON.stringify(Calibrate(null, null, { context: 'user' }).output))
            .to
            .equal(JSON.stringify(Boom.notFound('The user resource with that ID does not exist or has already been deleted.').output));
    });

    it('adds meta if defined', () => {

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
    });

    it('adds accepts an object parameter', () => {

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
    });

    it('decorates the hapi reply interface', async () => {

        const server = new Hapi.Server();

        await server.register({
            plugin: Calibrate.hapi,
            options: { onResponse: false }
        });

        server.route({
            method: 'GET',
            path: '/',
            config: {
                handler: function (request, h) {

                    return h.calibrate({ message: 'test' });
                }
            }
        });

        const res = await server.inject({ method: 'GET', url: '/' });

        expect(res.payload).to.equal(validOutput);
    });

    it('adds default calibrate wrapper to response', async () => {

        const server = new Hapi.Server();

        await server.register({
            plugin: Calibrate.hapi
        });

        server.route({
            method: 'GET',
            path: '/',
            config: {
                handler: function (request, h) {

                    return { message: 'test' };
                }
            }
        });

        const res = await server.inject({ method: 'GET', url: '/' });

        expect(res.payload).to.equal(validOutput);
    });

    it('should return response error', async () => {

        const server = new Hapi.Server();

        await server.register({
            plugin: Calibrate.hapi
        });

        server.route({
            method: 'GET',
            path: '/',
            config: {
                handler: function (request, h) {

                    return new Error();
                }
            }
        });

        const res = await server.inject({ method: 'GET', url: '/' });

        expect(res.payload).to.equal(sampleError);
    });

});
