'use strict';

/**
 * hobbs
 *
 * @author Zongmin Lei <leizongmin@gmail.com>
 */

import assert from 'assert';
import knex from 'knex';
import SuperCache from 'super-cache';

export default function () {

  $.mysql = knex({
    client: 'mysql',
    connection: $.config.get('mysql.connection'),
    pool: $.config.get('mysql.pool'),
  });

  $.cache = new SuperCache({
    store: $.config.get('mysql.cache.store'),
    storeConfig: $.config.get('mysql.cache.connection'),
    ttl: $.config.get('mysql.cache.ttl'),
  });


  $.cache.define(/^db_item ([a-zA-Z0-9_]+) (.+)$/, (name, callback) => {
    const s = name.match(/^db_item ([a-zA-Z0-9_]+) (.+)$/);
    if (!s) return callback(new Error(`cannot get cache ${name}`));
    const modelName = s[1];
    const query = JSON.parse(s[2])
    const model = $.modelTables[modelName];
    if (!model) return callback(new Error(`invalid model ${modelName} in cache key ${name}`));
    model.table().first('*').where(query)
      .then(ret => callback(null, ret))
      .catch(err => callback(err));
  });

  function getDataItemCacheKey(model, query) {
    const newQuery = {};
    const keys = Object.keys(query).sort().forEach(k => {
      newQuery[k] = query[k];
    });
    return `db_item ${model} ${JSON.stringify(newQuery)}`;
  }

  function getCache(key) {
    return new Promise((resolve, reject) => {
      $.cache.get(key, (err, ret) => {
        if (err) {
          reject(err);
        } else {
          resolve(ret);
        }
      });
    });
  }

  function deleteCache(key) {
    return new Promise((resolve, reject) => {
      $.cache.delete(key, (err, ret) => {
        if (err) {
          reject(err);
        } else {
          resolve(ret);
        }
      });
    });
  }


  $.model = {};
  $.modelTables = {};

  $.model.create = function (tableName) {
    assert(tableName && typeof tableName === 'string', 'tableName must be string');

    const superModel = {
      tableName: tableName,
    };
    const model = {
      super: superModel,
    };

    process.nextTick(() => {
      for (const name in $.model) {
        if ($.model[name].tableName === tableName) {
          $.model[name].name = superModel.name = name;
          $.modelTables[tableName] = $.model[name];
        }
      }
    });


    superModel.table = function () {
      return $.mysql.table(superModel.tableName);
    };

    superModel.merge = function (...args) {
      return Object.assign({}, ...args);
    };


    superModel.get = function (query, disableCache = false) {
      $.utils.checkNotEmpty(query, 'query');
      $.utils.checkNotEmpty(Object.keys(query), 'query');
      if (disableCache) {
        return model.table().first('*').where(query);
      } else {
        return getCache(getDataItemCacheKey(superModel.tableName, query));
      }
    }

    superModel.getById = function (id) {
      $.utils.checkNotEmpty(id, 'id');
      return superModel.get({id});
    };

    superModel.add = async function (data) {
      $.utils.checkNotEmpty(data, 'data');
      const newData = superModel.merge(data);
      newData.created_at = new Date();
      newData.updated_at = new Date();
      if (data.created_at === false) delete newData.created_at;
      if (data.updated_at === false) delete newData.updated_at;
      const [id] = await model.table().insert(newData, 'id');
      return id;
    };

    superModel.update = async function (query, data) {
      $.utils.checkNotEmpty(query, 'query');
      $.utils.checkNotEmpty(Object.keys(query), 'query');
      $.utils.checkNotEmpty(data, 'data');
      $.utils.checkNotEmpty(Object.keys(data), 'data');
      const newData = superModel.merge(data);
      newData.updated_at = new Date();
      if (data.created_at === false) delete newData.created_at;
      if (data.updated_at === false) delete newData.updated_at;
      await deleteCache(getDataItemCacheKey(superModel.tableName, query))
      return model.table().update(newData).where(query);
    };

    superModel.updateById = function (id, data) {
      $.utils.checkNotEmpty(id, 'id');
      return superModel.update({id}, data);
    };

    superModel.addOrUpdate = async function (query, data) {
      const ret = await superModel.get(query, true);
      if (ret) {
        return superModel.update(query, data);
      } else {
        return superModel.add(superModel.merge(query, data));
      }
    };

    superModel.addOrUpdateById = function (id, data) {
      $.utils.checkNotEmpty(id, 'id');
      return superModel.addOrUpdate({id}, data);
    };

    superModel.remove = async function (query, all = false) {
      $.utils.checkNotEmpty(query, 'query');
      $.utils.checkNotEmpty(Object.keys(query), 'query');
      const data = {
        is_removed: 1,
        removed_at: new Date(),
      };
      await deleteCache(getDataItemCacheKey(superModel.tableName, query));
      const p = model.table().update(data).where(query);
      if (!all) p.limit(1);
      return p;
    };

    superModel.removeAll = function (query) {
      return superModel.remove(query, true);
    };

    superModel.removeById = function (id) {
      $.utils.checkNotEmpty(id, 'id');
      return superModel.remove({id});
    };

    superModel.delete = async function (query, all = false) {
      $.utils.checkNotEmpty(query, 'query');
      $.utils.checkNotEmpty(Object.keys(query), 'query');
      await deleteCache(getDataItemCacheKey(superModel.tableName, query));
      const p = model.table().delete().where(query);
      if (!all) p.limit(1);
      return p;
    };

    superModel.deleteAll = function (query) {
      return superModel.delete(query, true);
    };

    superModel.deleteById = function (id) {
      $.utils.checkNotEmpty(id, 'id');
      return superModel.delete({id});
    };

    superModel.count = function (query) {
      $.utils.checkNotEmpty(query, 'query');
      return superModel.countAdv(model.table().where(query));
    };

    superModel.countAdv = async function (table) {
      const ret = await table.count('*');
      return ret && ret[0] && ret[0]['count(*)'] || 0;
    };

    superModel.list = function (query, options) {
      $.utils.checkNotEmpty(query, 'query');
      return superModel.listAdv(model.table().where(query), options);
    };

    superModel.listAdv = function (table, {
      columns = '*',
      skip = 0,
      limit = 0,
      order_by = [],
    } = {}) {
      for (const item of order_by) {
        table.orderBy(item.column, item.direction);
      }
      return table.select(columns).offset(skip).limit(limit);
    };


    Object.assign(model, superModel);

    return model;

  };

};
