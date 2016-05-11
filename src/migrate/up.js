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

  $.mysql.migrate.latest({
    directory: path.resolve(__dirname, '../../setup/migrations'),
  })
  .then(ret => {
    console.log('success: ', ret);
  })
  .catch(err => {
    console.log('fail: %s', err);
  })
  .finally(() => process.exit());
});
