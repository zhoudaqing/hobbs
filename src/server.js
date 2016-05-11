'use strict';

/**
 * hobbs
 *
 * @author Zongmin Lei <leizongmin@gmail.com>
 */

import './base';

$.init.add(() => {
  $.api.setOption('port', $.config.get('web.port'));
  if ($.config.has('debug') && $.config.get('debug')) {

  }
});

$.init(err => {
  if (err) throw err;
  console.log('server started');
});
