global.fetch = require('node-fetch');

import { describe } from 'ava-spec';
import nock from 'nock';
import niceFetch from '../index';

const url = `http://test.com/`;

const EXPECTED_DEFAULT_HEADERS = {
    accept: [ 'application/json' ],
    'accept-encoding': [ 'gzip,deflate' ],
    connection: [ 'close' ],
    host: 'test.com',
    'user-agent': [ "node-fetch/1.0 (+https://github.com/bitinn/node-fetch)" ]
};

describe('niceFetch()', it => {

    it('performs a basic get request', async t => {

        t.plan(1);

        nock(url)
        .get('/get')
        .reply(200, function (uri, requestBody) {
            return {
                method: 'get',
                uri,
                requestBody,
                headers: this.req.headers
            }
        });

        const result = await niceFetch(url + 'get');

        t.deepEqual(result, {
            method: 'get',
            uri: '/get',
            requestBody: '',
            headers: EXPECTED_DEFAULT_HEADERS
        });
    });

    it('performs a basic get request using .get() method', async t => {

        t.plan(1);

        nock(url)
        .get('/get')
        .reply(200, function (uri, requestBody) {
            return {
                method: 'get',
                uri,
                requestBody,
                headers: this.req.headers
            }
        });

        const result = await niceFetch.get(url + 'get');

        t.deepEqual(result, {
            method: 'get',
            uri: '/get',
            requestBody: '',
            headers: EXPECTED_DEFAULT_HEADERS
        });
    });

    it('performs a basic post request', async t => {

        t.plan(1);

        nock(url)
        .post('/post')
        .reply(200, function (uri, requestBody) {
            return {
                method: 'post',
                uri,
                requestBody,
                headers: this.req.headers
            }
        });

        const result = await niceFetch.post(url + 'post');

        t.deepEqual(result, {
            method: 'post',
            uri: '/post',
            requestBody: '',
            headers: Object.assign({},
                EXPECTED_DEFAULT_HEADERS,
                { 'content-length': [ '0' ]  }
            )
        });
    });

    it('performs a basic post request', async t => {

        t.plan(1);

        nock(url)
        .post('/post2')
        .reply(200, function (uri, requestBody) {
            return {
                method: 'post',
                uri,
                requestBody,
                headers: this.req.headers
            }
        });

        const result = await niceFetch.post(url + 'post2', { body: { example: 'object' } });

        t.deepEqual(result, {
            method: 'post',
            uri: '/post2',
            requestBody: {
                example: 'object'
            },
            headers: Object.assign({},
                EXPECTED_DEFAULT_HEADERS,
                {
                    'content-length': [ 20 ],
                    'content-type': [ 'application/json' ]
                }
            )
        });
    });

    it('performs a basic put request', async t => {

        t.plan(1);

        nock(url)
        .put('/put')
        .reply(200, function (uri, requestBody) {
            return {
                method: 'put',
                uri,
                requestBody,
                headers: this.req.headers
            }
        });

        const result = await niceFetch.put(url + 'put');

        t.deepEqual(result, {
            method: 'put',
            uri: '/put',
            requestBody: '',
            headers: Object.assign({},
                EXPECTED_DEFAULT_HEADERS,
                {
                    'content-length': [ '0' ],
                    'content-type': [ 'application/json' ]  //TODO: why?
                }
            )
        });
    });

    it('performs a basic delete request', async t => {

        t.plan(1);

        nock(url)
        .delete('/delete')
        .reply(200, function (uri, requestBody) {
            return {
                method: 'delete',
                uri,
                requestBody,
                headers: this.req.headers
            }
        });

        const result = await niceFetch.delete(url + 'delete', {
            formData: ' '
        });

        t.deepEqual(result, {
            method: 'delete',
            uri: '/delete',
            requestBody: '',
            headers: Object.assign({},
                EXPECTED_DEFAULT_HEADERS,
                {
                    'content-length': [ '0' ],
                    'content-type': [ 'application/json' ]  //TODO: why?
                }
            )
        });
    });

    it('handles 204 responses', async t => {

        t.plan(1);

        nock(url)
        .get('/get_204')
        .reply(204);

        const result = await niceFetch(url + 'get_204');

        t.deepEqual(result, undefined);
    });

    it('handles error responses with no body', async t => {

        t.plan(2);

        nock(url)
        .get('/get_404')
        .reply(404);

        const error = await t.throws(
            niceFetch.get(url + 'get_404')
        );

        t.is(error.message, 'Not Found');
    });

    it('handles error responses with a body', async t => {

        t.plan(2);

        nock(url)
        .get('/get_403')
        .reply(403, { error: 'No way, Busta!' });

        const error = await t.throws(
            niceFetch.get(url + 'get_403')
        );

        t.is(error.message, 'No way, Busta!');
    });

});
