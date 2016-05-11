'use strict';

/**
 * hobbs
 *
 * @author Zongmin Lei <leizongmin@gmail.com>
 */

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

hobbs.load = function (name) {
  name = name || 'server';
  hobbs[name];
  return $;
};
