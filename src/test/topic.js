'use strict';

/**
 * hobbs test
 *
 * @author Zongmin Lei <leizongmin@gmail.com>
 */

import assert from 'assert';
import '../test';

$.test.suite('Topic', function () {

  const session = $.test.session();
  const status = {};

  before(async function () {

    const ret = await session.post('/login')
                        .input({email: 'test1@example.com', password: '123456'})
                        .output.success();
    assert.equal(ret.email, 'test1@example.com');
    assert.equal(ret.role, 'user');
    status.userId = ret.id;

  });

  it('post', async function () {

    const ret = await session.post('/topic/new')
                        .input({
                          title: '这是第一篇文章',
                          content: '这里是内容',
                          tags: 'test,first',
                        })
                        .output.success();
    console.log(ret);
    assert.equal(ret.author_id, status.userId);
    assert.equal(ret.title, '这是第一篇文章');
    assert.equal(ret.content, '这里是内容');

  });

});
