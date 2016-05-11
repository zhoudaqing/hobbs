'use strict';

/**
 * hobbs
 *
 * @author Zongmin Lei <leizongmin@gmail.com>
 */

export default function () {

  const model = $.model.Tag = $.model.create('tags');

  model.add = function (topic_id, tag) {
    $.utils.checkNotEmpty(topic_id, 'topic_id');
    $.utils.checkNotEmpty(tag, 'tag');
    return model.super.add({topic_id, tag, created_at: false, updated_at: false});
  };

  model.delete = function (topic_id, tag) {
    $.utils.checkNotEmpty(topic_id, 'topic_id');
    $.utils.checkNotEmpty(tag, 'tag');
    return model.super.delete({topic_id, tag});
  };

  model.reset = async function (topic_id, tags) {
    $.utils.checkNotEmpty(topic_id, 'topic_id');
    $.utils.checkNotEmpty(tags, 'tags');
    await model.super.delete({topic_id});
    for (const tag of tags) {
      await model.add(topic_id, tag);
    }
  };

};
