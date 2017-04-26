const d = require('debug')('fetch-nice');

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

methods.forEach(function(method) {
    fetchNice[method] = function(url, options) {
        const optionsToMerge = options || {};
        return doFetchNice(url, Object.assign(optionsToMerge, { method: method }));
    }
});

module.exports = fetchNice;

function doFetchNice(url, options) {
    var requestOptions = Object.assign({}, defaults, options);

    if (requestOptions.body && !requestOptions.formData) {
        requestOptions.body = JSON.stringify(requestOptions.body);
        requestOptions.headers['Content-Type'] = 'application/json';
    }

    d('url:', url);
    d('options:', requestOptions);

    return fetch(url, requestOptions)
        .then(function(response) {

            d('response: ', response);

            if (!response.ok) {
                throw createFetchError(response);
            }

            if (response.status === 204) {
                return Object.assign(response,
                    { json: function() { return Promise.resolve(undefined); } }
                );
            }
            return response;
        })
        .then(function(response) {
            return response.json();
        });
};

function createFetchError(response) {
    var error;
    switch(response.status) {
        case 404:
            error = new NotFoundError();
            break;
        case 401:
            error = new UnauthorizedError();
            break;
        case 403:
            error = new ForbiddenError();
            break;
        case 500:
            error = new ServerError();
            break;
        default:
            error = new Error();
    }

    return error;
}
