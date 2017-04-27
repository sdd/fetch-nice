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

var _marked = [doFetchNice, createFetchError].map(regeneratorRuntime.mark);

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

function doFetchNice(url, options) {
    var requestOptions, response;
    return regeneratorRuntime.wrap(function doFetchNice$(_context) {
        while (1) {
            switch (_context.prev = _context.next) {
                case 0:
                    requestOptions = Object.assign({}, defaults, options);


                    if (requestOptions.body && !requestOptions.formData) {
                        requestOptions.body = JSON.stringify(requestOptions.body);
                        requestOptions.headers['Content-Type'] = 'application/json';
                    }

                    d('url:', url);
                    d('options:', requestOptions);

                    _context.next = 6;
                    return fetch(url, requestOptions);

                case 6:
                    response = _context.sent;

                    d('response: ', response);

                    if (response.ok) {
                        _context.next = 12;
                        break;
                    }

                    _context.next = 11;
                    return createFetchError(response);

                case 11:
                    throw _context.sent;

                case 12:
                    if (!(response.status === 204)) {
                        _context.next = 14;
                        break;
                    }

                    return _context.abrupt('return', undefined);

                case 14:
                    _context.next = 16;
                    return response.json();

                case 16:
                    return _context.abrupt('return', _context.sent);

                case 17:
                case 'end':
                    return _context.stop();
            }
        }
    }, _marked[0], this);
};

function createFetchError(response) {
    var message, data;
    return regeneratorRuntime.wrap(function createFetchError$(_context2) {
        while (1) {
            switch (_context2.prev = _context2.next) {
                case 0:
                    message = void 0, data = void 0;
                    _context2.prev = 1;
                    _context2.next = 4;
                    return response.json();

                case 4:
                    data = _context2.sent;

                    message = data.message || data.error;
                    _context2.next = 10;
                    break;

                case 8:
                    _context2.prev = 8;
                    _context2.t0 = _context2['catch'](1);

                case 10:
                    return _context2.abrupt('return', _boom2.default.create(response.status, message, data));

                case 11:
                case 'end':
                    return _context2.stop();
            }
        }
    }, _marked[1], this, [[1, 8]]);
}