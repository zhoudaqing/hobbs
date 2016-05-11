'use strict';

/**
 * hobbs
 *
 * @author Zongmin Lei <leizongmin@gmail.com>
 */

import {resolve as resolvePath} from 'path';
import Ho from 'hojs';
import hobbs from '../';

global.$ = new Ho({
  path: __dirname,
});

$.api.enable(
  'inputHeaders',
  'inputCookies',
  'inputSession',
  'outputHeaders',
  'outputCookies',
  'outputSession'
);

$.api.use(function (req, res, next) {
  for (const item of $.config.get('web.headers')) {
    res.setHeader(item[0], item[1]);
  }
  next();
});

$.init.add(() => {
  for (const file of hobbs.config.files) {
    $.config.load(file);
  }
});

$.init.load(resolvePath(__dirname, 'init'));
$.init.load(resolvePath(__dirname, 'models'));
$.init.load(resolvePath(__dirname, 'apis'));

