# fetch-nice

A thin wrapper around fetch to take care of some common use cases in the browser.

NB This does not handle polyfilling fetch. If you are using this in a browser that does not implement HTML5 Fetch API
 then you will need to polyfill with something like `whatwg-fetch` or it will not work.
 
## Installation

```bash
npm i fetch-nice
```

## Usage

The examples below are written using ES7 async/await for clarity. Of course you can still use fetch-nice without async/await since it returns a promise as per HTML5 fetch.

fetchNice assumes that your request is for JSON and sets headers accordingly. It also defaults to using fetch's `credentials: 'include'` setting so that any cookies are sent in order to make authenticated API requests.

The response object is JSON parsed automatically. If the response was a 204 (no content), fetch-nice returns `undefined`.

fetch-nice returns a rejected promise for error responses. If the error response contained a JSON body, this is added to the rejected Error.
fetch-nice uses [`boom`](https://www.npmjs.com/package/boom) for it's errors.

```js

import fetchNice from 'fetch-nice';

// make a GET request

const result = await fetchNice('http://myapi.com/user/me');


// make a POST request

const body = { name: 'Onion McOnionFace' };
const result = await fetchNice.post('http://myapi.com/users', { body });

// PUT and DELETE follow the same pattern.

```
