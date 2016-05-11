'use strict';

/**
 * hobbs
 *
 * @author Zongmin Lei <leizongmin@gmail.com>
 */

const path = require('path');
const hobbs = module.exports;

function lazyLoad(name, file) {
  Object.defineProperty(hobbs, name, {
    get: function () {
      const m = require(file);
      return m.default || m;
    },
  });
}

lazyLoad('base', './dist/base');
lazyLoad('server', './dist/server');

hobbs.version = require('./package.json').version;

hobbs.config = function (files) {
  if (Array.isArray(files)) {
    for (const file of files) {
      hobbs.config.files.push(path.resolve(file));
    }
  } else {
    const args = Array.prototype.slice.call(arguments);
    for (const file of args) {
      hobbs.config.files.push(path.resolve(file));
    }
  }
  return hobbs;
};
hobbs.config.files = [path.resolve(__dirname, 'config/default')];

hobbs.load = function (name) {
  name = name || 'server';
  hobbs[name];
  return $;
};
