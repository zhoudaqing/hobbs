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

  const tables = [
    'comment_likes',
    'comments',
    'notifications',
    'tags',
    'topic_contents',
    'topic_likes',
    'topics',
    'users',
  ];
  const list = tables.map(name => $.mysql.schema.dropTableIfExists(name));


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
