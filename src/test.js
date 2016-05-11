'use strict';

/**
 * hobbs
 *
 * @author Zongmin Lei <leizongmin@gmail.com>
 */

import {resolve as resolvePath} from 'path';
import hobbs from '../';

// 载入hobbs
hobbs.load();

// 初始化服务
$.init(err => {
  if (err) throw err;
  console.log('server started');
});
