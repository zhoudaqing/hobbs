'use strict';

/**
 * hobbs
 *
 * @author Zongmin Lei <leizongmin@gmail.com>
 */

export default function () {

  const registerMiddleware = $.api.registerMiddleware;


  function isAdminRole(user) {
    return user && user.role === 'admin';
  }

  function isAuthorOrAdmin(user, item) {
    return item.author_id === user.id || isAdminRole(user);
  }


  registerMiddleware('check_topic_author_or_admin', async function (req, res) {

    const params = req.apiParams;

    if (!(params.$user && params.$user.id)) {
      throw $.api.error('permission_denied', '请先登录');
    }

    const topic = params.$originTopic || await $.model.Topic.getById(params.id);
    if (!topic) {
      throw $.api.error('data_has_been_removed', `topic #${params.id}`);
    }
    if (topic.is_removed) {
      throw $.api.error('data_has_been_removed', `topic #${params.id}`);
    }

    if (!isAuthorOrAdmin(params.$user, topic)) {
      throw $.api.error('permission_denied', '只有作者或管理员可操作');
    }

    params.$originTopic = topic;

  });


  registerMiddleware('check_topic_exists', async function (req, res) {

    const params = req.apiParams;

    const topic = params.$originTopic || await $.model.Topic.getById(params.id);
    if (!topic) {
      throw $.api.error('data_has_been_removed', `topic #${params.id}`);
    }
    if (topic.is_removed) {
      throw $.api.error('data_has_been_removed', `topic #${params.id}`);
    }

    params.$originTopic = topic;

  });


  registerMiddleware('check_comment_author_or_admin', async function (req, res) {

    const params = req.apiParams;

    if (!(params.$user && params.$user.id)) {
      throw $.api.error('permission_denied', '请先登录');
    }

    const comment = params.$originComment || await $.model.Comment.getById(params.comment_id);
    if (!comment) {
      throw $.api.error('data_has_been_removed', `comment #${params.comment_id}`);
    }
    if (comment.is_removed) {
      throw $.api.error('data_has_been_removed', `comment #${params.comment_id}`);
    }

    if (!isAuthorOrAdmin(params.$user, comment)) {
      throw $.api.error('permission_denied', '只有作者或管理员可操作');
    }

    params.$originComment = comment;

  });


  registerMiddleware('check_comment_exists', async function (req, res) {

    const params = req.apiParams;

    const comment = params.$originComment || await $.model.Comment.getById(params.comment_id);
    if (!comment) {
      throw $.api.error('data_has_been_removed', `comment #${params.comment_id}`);
    }
    if (comment.is_removed) {
      throw $.api.error('data_has_been_removed', `comment #${params.comment_id}`);
    }

    params.$originComment = comment;

  });


  registerMiddleware('check_reply_comment_exists', async function (req, res) {

    const params = req.apiParams;

    if (params.reply_id > 0) {

      const comment = params.$originReplyComment || await $.model.Comment.getById(params.reply_id);
      if (!comment) {
        throw $.api.error('data_has_been_removed', `comment #${params.reply_id}`);
      }
      if (comment.is_removed) {
        throw $.api.error('data_has_been_removed', `comment #${params.reply_id}`);
      }

      params.$originReplyComment = comment;

    }

  });


  registerMiddleware('check_notification_owner', async function (req, res) {

    const params = req.apiParams;

    if (params.id > 0) {

      const notification = params.$originReplyNotification || await $.model.Notification.getById(params.id);
      if (!notification) {
        throw $.api.error('data_has_been_removed', `notification #${params.id}`);
      }
      if (notification.user_id !== params.$user.id) {
        throw $.api.error('permission_denied', '只有该用户可操作');
      }

      params.$originReplyNotification = notification;

    }

  });


  registerMiddleware('check_param_sort_order_only_admin', async function (req, res) {

    const params = req.apiParams;

    if (params.$user && params.$user.id && isAdminRole(params.$user)) {
      // 仅仅允许管理员设置该参数
    } else {
      delete params.sort_order;
    }

  });


};
