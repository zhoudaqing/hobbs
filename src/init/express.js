'use strict';

/**
 * hobbs
 *
 * @author Zongmin Lei <leizongmin@gmail.com>
 */

import expressSession from 'express-session';
import _RedisStore from 'connect-redis';
const RedisStore = _RedisStore(expressSession);

export default function () {

  $.api.use(expressSession({
    store: new RedisStore($.config.get('web.session.redis')),
    secret: $.config.get('web.session.secret'),
    name: $.config.get('web.session.name'),
    resave: true,
    saveUninitialized: true,
    cookie: {
      maxAge: $.config.get('web.cookie.maxAge'),
    },
  }));

  // 如果session中存在user，则作为$user参数传递进去
  $.api.use(function (req, res, next) {
    if (req.session && req.session.user && req.session.user.id && req.session.user.email) {
      req.apiParams.$user = req.session.user;
    }
    next();
  });

};
