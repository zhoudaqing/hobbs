'use strict';

/**
 * hobbs
 *
 * @author Zongmin Lei <leizongmin@gmail.com>
 */

import path from 'path';
import {resolve as resolvePath} from 'path';
import hobbs from '../';

// 载入hobbs
hobbs.load();

// 初始化服务
$.init(err => {
  if (err) throw err;
  console.log('server started');
});

// 生成文档
$.api.docs.takeSample().saveOnExit(path.resolve(__dirname, '../docs'));