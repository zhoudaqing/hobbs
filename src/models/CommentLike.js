'use strict';

/**
 * hobbs
 *
 * @author Zongmin Lei <leizongmin@gmail.com>
 */

export default function () {

  const model = $.model.CommentLike = {} = $.model.create('comment_likes');

  model.get = function (id, user_id) {
    return model.super.get({id, user_id});
  };

  model.add = async function (id, user_id) {
    $.utils.checkNotEmpty(id, 'id');
    $.utils.checkNotEmpty(user_id, 'user_id');
    const exists = await model.get(id, user_id);
    if (exists) return exists;
    return model.super.add({id, user_id, updated_at: false});
  };

  model.delete = function (id, user_id) {
    $.utils.checkNotEmpty(id, 'id');
    $.utils.checkNotEmpty(user_id, 'user_id');
    return model.super.delete({id, user_id});
  };

  model.listById = function (id) {
    $.utils.checkNotEmpty(id, 'id');
    return model.table().select().where({id}).orderBy('created_at', 'asc');
  };

  model.countById = async function (id) {
    $.utils.checkNotEmpty(id, 'id');
    return model.count({id});
  };

  model.fillLikesCount = $.utils.fillDataFunction(function (id) {
    return model.countById(id);
  });

  model.fillLikedStatus = $.utils.fillDataFunction(async function (id, user_id) {
    const ret = await model.get(id, user_id);
    return !!ret;
  });

};
