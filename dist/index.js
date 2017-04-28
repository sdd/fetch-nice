'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

exports.default = fetchNice;

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _boom = require('boom');

var _boom2 = _interopRequireDefault(_boom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var d = (0, _debug2.default)('fetch-nice');

var defaults = {
    headers: {
        'Accept': 'application/json'
    },
    credentials: 'include'
};
var methods = ['get', 'post', 'put', 'delete'];

function fetchNice(url, options) {
    return doFetchNice(url, options);
};

methods.forEach(function (method) {
    fetchNice[method] = function (url) {
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        return doFetchNice(url, (0, _assign2.default)({}, options, { method: method }));
    };
});

function doFetchNice(url, options) {
    var requestOptions, response;
    return Promise.resolve().then(function () {
        requestOptions = (0, _assign2.default)({}, defaults, options);


        if (requestOptions.body && !requestOptions.formData) {
            requestOptions.body = (0, _stringify2.default)(requestOptions.body);
            requestOptions.headers['Content-Type'] = 'application/json';
        }

        d('url:', url);
        d('options:', requestOptions);

        return fetch(url, requestOptions);
    }).then(function (_resp) {
        response = _resp;

        d('response: ', response);

        if (!response.ok) {
            return Promise.resolve().then(function () {
                return createFetchError(response);
            }).then(function (_resp) {
                throw _resp;
            });
        }
    }).then(function () {
        if (response.status === 204) {
            return undefined;
        } else {

            return response.json();
        }
    });
}

function createFetchError(response) {
    var message, data;
    return Promise.resolve().then(function () {
        message = void 0;
        data = void 0;
        return Promise.resolve().then(function () {
            return response.json();
        }).then(function (_resp) {
            data = _resp;
            message = data.message || data.error;
        }).catch(function (e) {
            return Promise.resolve();
        });
    }).then(function () {

        return _boom2.default.create(response.status, message, data);
    });
}