module.exports = function (set, get, has) {

  // 服务器监听端口
  set('web.port', 3000);

  // Session连接
  set('web.session.redis.host', '127.0.0.1');
  set('web.session.redis.port', 6379);
  set('web.session.redis.db', 0);
  set('web.session.redis.pass', '');
  set('web.session.redis.prefix', 'sess:');
  // Session有效期
  set('web.session.redis.ttl', 3600 * 24 * 30);
  // Session的Cookie名称
  set('web.session.name', 'hojs.sid');
  // Session密钥
  set('web.session.secret', 'test');
  // Cookie有效期
  set('web.cookie.maxAge', 3600000 * 24 * 365);

  // MySQL数据库
  set('mysql.connection.host', '127.0.0.1');
  set('mysql.connection.port', 3306);
  set('mysql.connection.user', 'root');
  set('mysql.connection.password', '');
  set('mysql.connection.charset', 'utf8mb4');
  set('mysql.connection.database', 'hobbs');
  // 连接池
  set('mysql.pool.min', 0);
  set('mysql.pool.max', 10);
  // MySQL缓存
  set('mysql.cache.store', 'redis');
  set('mysql.cache.connection.host', '127.0.0.1');
  set('mysql.cache.connection.port', 6379);
  set('mysql.cache.connection.db', 0);
  set('mysql.cache.connection.password', '');
  set('mysql.cache.connection.prefix', 'cache:');
  set('mysql.cache.connection.pool', 5);
  set('mysql.cache.ttl', 600);

  // 跨域设置
  set('web.headers', [
    ['X-hobbs-Version', require('../package.json').version],
  ]);

};
