'use strict';

/**
 * hobbs
 *
 * @author Zongmin Lei <leizongmin@gmail.com>
 */

export default function () {

  const model = $.model.Notification = $.model.create('notifications');

  model.formatPublic = function (item) {
    if (item) {
      return {
        id: item.id,
        type: item.type,
        user_id: item.user_id,
        reply_id: item.reply_id,
        created_at: item.created_at,
        updated_at: item.updated_at,
        is_read: item.is_read,
        data: item.data,
      };
    }
  };

  model.fixOutputItemJSONFields = function (item) {
    if (item) {
      if (typeof item.data === 'string') {
        item.data = JSON.parse(item.data);
      }
    }
    return item;
  };

  model.fixOutputListJSONFields = function (list) {
    if (!list) return list;
    return list.map(model.fixOutputItemJSONFields);
  };

  model.fixInputItemJSONFields = function (item) {
    if ('data' in item) {
      item.data = JSON.stringify(item.data);
    }
    return item;
  };

  model.getById = function (id) {
    return model.super.getById(id).then(v => Promise.resolve(model.fixOutputItemJSONFields(v)));
  };

  model.add = function (data) {
    $.utils.checkNotEmpty(data, 'data');
    $.utils.checkNotEmpty(data.user_id, 'data.user_id');
    $.utils.checkNotEmpty(data.data, 'data.data');
    $.utils.checkNotEmpty(data.type, 'data.type');
    return model.super.add(model.fixInputItemJSONFields(data));
  };

  model.list = function (...args) {
    return model.super.list(...args)
      .then(v => Promise.resolve(model.fixOutputListJSONFields(v)));
  };

};
