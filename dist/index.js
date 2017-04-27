'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
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
        return doFetchNice(url, Object.assign({}, options, { method: method }));
    };
});

async function doFetchNice(url, options) {
    var requestOptions = Object.assign({}, defaults, options);

    if (requestOptions.body && !requestOptions.formData) {
        requestOptions.body = JSON.stringify(requestOptions.body);
        requestOptions.headers['Content-Type'] = 'application/json';
    }

    d('url:', url);
    d('options:', requestOptions);

    var response = await fetch(url, requestOptions);
    d('response: ', response);

    if (!response.ok) {
        throw await createFetchError(response);
    }

    if (response.status === 204) {
        return undefined;
    }

    return await response.json();
};

async function createFetchError(response) {

    var message = void 0,
        data = void 0;
    try {
        data = await response.json();
        message = data.message || data.error;
    } catch (e) {}

    return _boom2.default.create(response.status, message, data);
}