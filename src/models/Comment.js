'use strict';

/**
 * hobbs
 *
 * @author Zongmin Lei <leizongmin@gmail.com>
 */

export default function () {

  const model = $.model.Comment = $.model.create('comments');

  model.formatPublic = function (comment) {
    if (comment) {
      return {
        id: comment.id,
        topic_id: comment.topic_id,
        author_id: comment.author_id,
        reply_id: comment.reply_id,
        content: comment.content,
        created_at: comment.created_at,
        updated_at: comment.updated_at,
      };
    }
  };

  model.add = function (data) {
    $.utils.checkNotEmpty(data, 'data');
    $.utils.checkNotEmpty(data.author_id, 'data.author_id');
    $.utils.checkNotEmpty(data.topic_id, 'data.topic_id');
    return model.super.add(data);
  };

  model.fillReplyComment = $.utils.fillDataFunction(function (id) {
    return id > 0 ? model.getById(id) : Promise.resolve(null);
  });

  model.fillCount = $.utils.fillDataFunction(function (id) {
    return model.count({topic_id: id});
  });

};
