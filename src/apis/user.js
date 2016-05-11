'use strict';

/**
 * hobbs
 *
 * @author Zongmin Lei <leizongmin@gmail.com>
 */

export default function () {


  async function remoteLogin(email, password) {

    if ($.config.has('mock.users')) {
      for (const item of $.config.get('mock.users')) {
        if (item.email === email) {
          if (item.password === password) {
            return Object.assign({}, item);
          } else {
            throw new Error('invalid password');
          }
        }
      }
    }

    // TODO: login

  }


  $.api
  .post('/login')
  .group('user')
  .title('登录')
  .param('email', {type: 'Email'})
  .param('password', {type: 'Password'})
  .required('email', 'password')
  .register(async function (params) {

    const {name, team_name} = await remoteLogin(params.email, params.password);
    const email = params.email;

    const existsUser = await $.model.User.getByEmail(email);
    if (!existsUser) {
      await $.model.User.updateByEmail(email, {
        name,
        about: `来自${team_name}`,
        role: 'user',
        last_logined_at: new Date(),
      });
    } else {
      await $.model.User.updateByEmail(email, {last_logined_at: new Date()});
    }

    const user = await $.model.User.getByEmail(email);
    const logout_token = $.utils.randomString(10);

    return $.utils.merge($.model.User.formatPublic(user), {
      logout_token,
      $session: {
        user: $.utils.merge(user, {logout_token}),
      }
    });

  });


  $.api
  .get('/logout')
  .group('user')
  .title('注销')
  .param('$user', {type: 'UserSession', comment: '通过`/login`接口登录后即自动包含该信息，无需手动设置参数'})
  .param('token', {type: 'String', comment: '为了避免恶意被注销登录，每次登录均会生成唯一的`token`，注销时需要验证'})
  .required('$user', 'token')
  .register(async function (params) {

    if (params.$user.logout_token && params.token !== params.$user.logout_token) {
      throw $.api.error('invalid_logout_token', params.token);
    }

    return {ok: true, $removeSession: ['user']};

  });


  $.api
  .post('/logout')
  .group('user')
  .title('注销')
  .param('$user', {type: 'UserSession', comment: '通过`/login`接口登录后即自动包含该信息，无需手动设置参数'})
  .required('$user')
  .register(async function (params) {

    return {ok: true, $removeSession: ['user']};

  });


  $.api
  .get('/my/info')
  .group('user')
  .title('当前登录用户的信息')
  .param('$user', {type: 'UserSession', comment: '通过`/login`接口登录后即自动包含该信息，无需手动设置参数'})
  .required('$user')
  .register(async function (params) {

    const user = await $.model.User.getById(params.$user.id);

    return $.utils.merge($.model.User.formatPublic(user), {logout_token: params.$user.logout_token});

  });


  $.api
  .post('/my/info')
  .group('user')
  .title('更新当前登录用户信息')
  .param('$user', {type: 'UserSession', comment: '通过`/login`接口登录后即自动包含该信息，无需手动设置参数'})
  .param('name', {type: 'TrimString', comment: '昵称'})
  .param('about', {type: 'TrimString', comment: '个人简介'})
  .required('$user')
  .register(async function (params) {

    const update = {};
    if ('name' in params) update.name = params.name;
    if ('about' in params) update.about = params.about;

    await $.model.User.updateById(params.$user.id, update);

    const user = await $.model.User.getById(params.$user.id);

    return $.utils.merge($.model.User.formatPublic(user), {logout_token: params.$user.logout_token});

  });


};
