'use strict';

/**
 * hobbs
 *
 * @author Zongmin Lei <leizongmin@gmail.com>
 */

import path from 'path';
import knex from 'knex';
import '../base';


$.init(err => {
  if (err) throw err;

  const name = process.argv[2];
  if (!name) {
    console.log('please specified a migrate name');
    process.exit();
  }

  $.mysql.migrate.make(name, {
    directory: path.resolve(__dirname, '../../setup/migrations'),
  })
  .then(ret => {
    console.log('success: %s', ret);
  })
  .catch(err => {
    console.log('fail: %s', err);
  })
  .finally(() => process.exit());
});
