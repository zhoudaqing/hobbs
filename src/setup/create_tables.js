'use strict';

/**
 * hobbs
 *
 * @author Zongmin Lei <leizongmin@gmail.com>
 */

const fs = require('fs');
const path = require('path');
const Promise = require('bluebird');
const hobbs = require('../../');

hobbs.load('base');

$.init(err => {
  if (err) throw err;

  const tables = fs.readFileSync(path.resolve(__dirname, '../../setup/tables.sql'))
                   .toString()
                   .split(/;\s*\r?\n\r?\n/mg)
                   .filter(v => v.trim());

  const list = tables.map(sql => $.mysql.raw(sql));
  Promise.all(list)
    .then(ret => {
      //console.log(ret);
      console.log('success');
    })
    .catch(err => {
      console.error(err);
    })
    .finally(() => {
      console.log('done');
      process.exit();
    });

});
