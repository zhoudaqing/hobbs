'use strict';

/**
 * hobbs
 *
 * @author Zongmin Lei <leizongmin@gmail.com>
 */

export default function () {

  const model = $.model.User = {};
  const table = () => $.mysql.table('users');

  model.formatPublic = function (user) {
    if (user) {
      return {
        id: user.id,
        email: user.email,
        name: user.name,
        about: user.about,
        role: user.role,
        last_logined_at: user.last_logined_at,
      };
    }
  };

  model.getById = function (id) {
    $.utils.checkNotEmpty(id, 'id');
    return table().first('*').where({id});
  };

  model.getByEmail = function (email) {
    $.utils.checkNotEmpty(email, 'email');
    return table().first('*').where({email});
  };

  model.updateById = function (id, data) {
    $.utils.checkNotEmpty(id, 'id');
    data.updated_at = new Date();
    return table().update(data).where({id});
  };

  model.updateByEmail = async function (email, data) {
    $.utils.checkNotEmpty(email, 'id');
    const user = await model.getByEmail(email);
    if (user) {
      return model.updateById(user.id, data);
    } else {
      data.email = email;
      data.updated_at = new Date();
      return table().insert(data);
    }
  };

  model.fillUserInfo = $.utils.fillDataFunction(function (id) {
    return model.getById(id);
  });

};
