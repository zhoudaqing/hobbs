'use strict';

/**
 * hobbs
 *
 * @author Zongmin Lei <leizongmin@gmail.com>
 */

export default function () {

  const model = $.model.Topic = $.model.create('topics');

  model.formatPublic = function (topic) {
    if (topic) {
      return {
        id: topic.id,
        author_id: topic.author_id,
        title: topic.title,
        tags: topic.tags && topic.tags.split(','),
        content: topic.content,
        created_at: topic.created_at,
        updated_at: topic.updated_at,
        last_commented_at: topic.last_commented_at,
        sort_order: topic.sort_order,
      };
    }
  };

  model.add = function (data) {
    $.utils.checkNotEmpty(data, 'data');
    $.utils.checkNotEmpty(data.author_id, 'data.author_id');
    $.utils.checkNotEmpty(data.title, 'data.title');
    data.last_commented_at = new Date();
    return model.super.add(data);
  };

  model.updateLastCommentedAtById = function (id) {
    $.utils.checkNotEmpty(id, 'id');
    return model.updateById(id, {last_commented_at: new Date()});
  };

  function queryByTags(p, query) {
    query = $.utils.merge(query);
    p.whereRaw('1');
    if (query.tags) {
      p.leftJoin('tags', 'topics.id', 'tags.topic_id');
      for (const tag of query.tags) {
        p.andWhere('tags.tag', '=', tag);
      }
      delete query.tags;
    }
    if (query.title) {
      p.andWhere('title', 'LIKE', `%${query.title}%`);
      delete query.title;
    }
    p.andWhere(query);
    return p;
  }

  model.count = async function (query) {
    $.utils.checkNotEmpty(query, 'query');
    return model.super.countAdv(queryByTags(model.table(), query));
  };

  model.list = function (query, options) {
    $.utils.checkNotEmpty(query, 'query');
    $.utils.checkNotEmpty(options, 'options');
    options.columns = options.columns || 'topics.*';
    options.order_by = options.order_by || [];
    options.order_by.unshift({column: 'sort_order', direction: 'desc'});
    return model.super.listAdv(queryByTags(model.table(), query), options);
  };

};
