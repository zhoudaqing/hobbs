'use strict';

/**
 * hobbs
 *
 * @author Zongmin Lei <leizongmin@gmail.com>
 */

export default function () {


  $.api
  .get('/')
  .group('test')
  .title('测试服务是否正常')
  .param('$headers', 'Object')
  .register(async function (params) {

    return {
      time: new Date(),
      headers: params.$headers,
    };

  });


};
