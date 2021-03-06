module.exports = function (set, get, has, conf) {

  set('debug', true);

  set('web.port', null);

  // 数据库
  set('mysql.connection.database', 'hobbs_test');
  set('mysql.cache.connection.db', 1);
  set('mysql.cache.ttl', 60);

  // 虚拟的用户帐号
  conf.push('mock.users', {
    name: 'test1',
    email: 'test1@example.com',
    password: '123456',
    team_name: 'AA',
  });
  conf.push('mock.users', {
    name: 'test2',
    email: 'test2@example.com',
    password: '1234567',
    team_name: 'BB',
  });
  conf.push('mock.users', {
    name: 'test3',
    email: 'test3@example.com',
    password: '12345678',
    team_name: 'CC',
  });

};
