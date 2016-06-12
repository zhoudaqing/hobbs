'use strict';

/**
 * hobbs test
 *
 * @author Zongmin Lei <leizongmin@gmail.com>
 */

import assert from 'assert';
import '../test';

$.test.describe('Login', function () {

  it('success', async function () {

    const session = $.test.session();

    {
      const ret = await session.post('/login')
                          .input({email: 'test1@example.com', password: '123456'})
                          .output.success();
      assert.equal(ret.email, 'test1@example.com');
      assert.equal(ret.role, 'user');
    }

    {
      const ret = await session.get('/my/info').output.success();
      assert.equal(ret.email, 'test1@example.com');
    }

  });

  it('fail', async function () {

    const err = await $.test.post('/login')
                       .input({email: 'test1@example.com', password: '12345678'})
                       .output.error();
    assert.equal(err.status, -1);
    assert.equal(err.message, 'invalid password');

  });

});
