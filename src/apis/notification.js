'use strict';

/**
 * hobbs
 *
 * @author Zongmin Lei <leizongmin@gmail.com>
 */

export default function () {


  $.api
  .get('/my/notifications/count')
  .group('notification')
  .title('查询当前登录用户的通知消息数量')
  .param('$user', {type: 'UserSession', comment: '通过`/login`接口登录后即自动包含该信息，无需手动设置参数'})
  .param('type', {type: 'TrimString', comment: '消息类型，目前可选的值是`reply`，不提供此参数表示全部'})
  .param('is_read', {type: 'Boolean', comment: '`true`表示只返回已读消息，默认`false`表示只返回未读消息', default: false})
  .register(async function (params) {

    const query = {
      user_id: params.$user.id,
      is_read: params.is_read ? 1 : 0,
    };
    if (params.type) query.type = params.type;

    const count = await $.model.Notification.count(query);

    return {count};

  });


  $.api
  .get('/my/notifications')
  .group('notification')
  .title('查询当前登录用户的通知消息')
  .param('$user', {type: 'UserSession', comment: '通过`/login`接口登录后即自动包含该信息，无需手动设置参数'})
  .param('type', {type: 'TrimString', comment: '消息类型，目前可选的值是`reply`，不提供此参数表示全部'})
  .param('is_read', {type: 'Boolean', comment: '`true`表示只返回已读消息，默认`false`表示只返回未读消息', default: false})
  .param('skip', {type: 'Number', comment: '返回结果的偏移量', default: 0})
  .param('limit', {type: 'Integer', comment: '仅返回前N条结果', default: 10})
  .param('order_by', {
    type: 'ListOrderBy',
    params: {columns: ['id', 'created_at', 'updated_at']},
    default: 'id:desc',
    comment: '有效的排序字段有`id`, `created_at`, `updated_at`',
  })
  .register(async function (params) {

    const query = {
      user_id: params.$user.id,
      is_read: params.is_read ? 1 : 0,
    };
    if (params.type) query.type = params.type;

    const list = await $.model.Notification.list(query, params);
    const count = await $.model.Notification.count(query);

    for (const item of list) {
      if (item.type === 'reply') {

        item.topic = $.model.Topic.formatPublic(await $.model.Topic.getById(item.data.topic_id));
        await $.model.User.fillUserInfo(item.topic, 'author_id', 'author');

        item.comment = $.model.Comment.formatPublic(await $.model.Comment.getById(item.data.comment_id));
        await $.model.User.fillUserInfo(item.comment, 'author_id', 'author');

        if (item.data.reply_id) {
          item.reply = $.model.Comment.formatPublic(await $.model.Comment.getById(item.data.reply_id));
          await $.model.User.fillUserInfo(item.reply, 'author_id', 'author');
        }
      }
    }

    return {count, list};

  });


  $.api
  .post('/my/notification/:id/read')
  .group('notification')
  .title('将指定ID的通知设置为已读')
  .param('$user', {type: 'UserSession', comment: '通过`/login`接口登录后即自动包含该信息，无需手动设置参数'})
  .param('id', {type: 'NotificationId', comment: '通过URL参数指定'})
  .use('check_notification_owner')
  .register(async function (params) {

    await $.model.Notification.updateById(params.id, {is_read: 1});

    return {id: params.id};

  });


};
