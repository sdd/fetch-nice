import debug from 'debug';
import Boom from 'boom';
const d = debug('fetch-nice');

const defaults = {
    headers: {
        'Accept': 'application/json'
    },
    credentials: 'include'
};
const methods = ['get', 'post', 'put', 'delete'];

export default function fetchNice(url, options) {
    return doFetchNice(url, options);
};

methods.forEach(method => {
    fetchNice[method] = (url, options = {}) =>
        doFetchNice(url, { ...options, method })
});

async function doFetchNice(url, options) {
    const requestOptions = { ...defaults, ...options };

    if (requestOptions.body && !requestOptions.formData) {
        requestOptions.body = JSON.stringify(requestOptions.body);
        requestOptions.headers['Content-Type'] = 'application/json';
    }

    d('url:', url);
    d('options:', requestOptions);

    const response = await fetch(url, requestOptions);
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

    let message, data;
    try {
        data = await response.json();
        message = data.message || data.error;
    } catch(e) {

    }

    return Boom.create(response.status, message, data);
}
