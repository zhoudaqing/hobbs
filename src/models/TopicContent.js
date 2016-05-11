'use strict';

/**
 * hobbs
 *
 * @author Zongmin Lei <leizongmin@gmail.com>
 */

export default function () {

  const model = $.model.TopicContent = $.model.create('topic_contents');

  model.updateById = function (id, content) {
    return model.super.addOrUpdateById(id, {content, created_at: false, updated_at: false});
  };

};
