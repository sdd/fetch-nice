import { describe } from 'ava-spec';
import { expect } from 'chai';

describe('niceFetch()', it => {

    it('performs a basic get request', async t => {

        t.plan(1);

        const result = await niceFetch(url);

        t.equal(result, {
            method: 'GET'
        })
    });
});
