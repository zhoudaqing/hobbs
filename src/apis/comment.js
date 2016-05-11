'use strict';

/**
 * hobbs
 *
 * @author Zongmin Lei <leizongmin@gmail.com>
 */

export default function () {


  async function notifyCommentAndTopicAuthor(comment) {

    const topic = await $.model.Topic.getById(comment.topic_id);
    const reply = comment.reply;

    // 如果是回复自己的评论，不发送通知
    if (reply && reply.author_id !== comment.author_id) {
      await $.model.Notification.add({
        user_id: reply.author_id,
        type: 'reply',
        data: {
          topic_id: topic.id,
          comment_id: comment.id,
          reply_id: reply.id,
          reply_comment: true,
        },
      });
    }

    // 如果被回复的评论和主题的作者都是同一个人，则不重复发送通知
    if (reply && reply.author_id === topic.author_id) return;

    await $.model.Notification.add({
      user_id: topic.author_id,
      type: 'reply',
      data: {
        topic_id: topic.id,
        comment_id: comment.id,
        reply_topic: true,
      }
    });
  }


  $.api
  .get('/topic/item/:id/comments')
  .group('comment')
  .title('获取主题的评论列表')
  .param('$user', {type: 'UserSession'})
  .param('id', {type: 'TopicId', comment: '通过URL参数指定'})
  .param('skip', {type: 'Number', comment: '查询评论的偏移量', default: 0})
  .param('limit', {type: 'Number', comment: '查询评论的数量', default: 50})
  .param('order_by', {
    type: 'ListOrderBy',
    params: {columns: ['id', 'created_at', 'updated_at']},
    default: 'id:desc',
    comment: '有效的排序字段有`id`, `created_at`, `updated_at`',
  })
  .use('check_topic_exists')
  .register(async function (params) {

    const query = {topic_id: params.id, is_removed: 0};

    const count = await $.model.Comment.count(query);
    let list = await $.model.Comment.list(query, params);
    list = list.map($.model.Comment.formatPublic);

    await $.model.User.fillUserInfo(list, 'author_id', 'author');
    await $.model.CommentLike.fillLikesCount(list, 'id', 'like_count');
    await $.model.Comment.fillReplyComment(list, 'reply_id', 'reply');

    if (params.$user && params.$user.id) {
      await $.model.CommentLike.fillLikedStatus(list, 'id', 'is_liked', params.$user.id);
    }

    return {count, list};

  });


  $.api
  .post('/topic/item/:id/comments')
  .group('comment')
  .title('添加评论')
  .param('$user', {type: 'UserSession'})
  .param('id', {type: 'TopicId', comment: '通过URL参数指定'})
  .param('reply_id', {type: 'CommentId', comment: '回复的评论ID，如果设置此参数，则被回复的评论的作者将收到通知'})
  .param('content', {type: 'MarkdownContent', comment: '内容'})
  .required('$user', 'content')
  .use('check_topic_exists')
  .use('check_reply_comment_exists')
  .register(async function (params) {

    const id = await $.model.Comment.add({
      topic_id: params.id,
      author_id: params.$user.id,
      reply_id: params.reply_id || 0,
      content: params.content,
    });

    await $.model.Topic.updateLastCommentedAtById(params.id);

    let comment = await $.model.Comment.getById(id);
    comment = $.model.Comment.formatPublic(comment);

    await $.model.Comment.fillReplyComment(comment, 'reply_id', 'reply');

    await notifyCommentAndTopicAuthor(comment);

    return comment;

  });


  $.api
  .put('/topic/item/:id/comment/:comment_id')
  .group('comment')
  .title('更新评论')
  .description('仅管理员或评论作者可操作')
  .param('$user', {type: 'UserSession'})
  .param('id', {type: 'TopicId', comment: '通过URL参数指定'})
  .param('comment_id', {type: 'CommentId', comment: '通过URL参数指定'})
  .param('content', {type: 'MarkdownContent', comment: '评论内容'})
  .required('$user', 'content')
  .use('check_topic_exists', 'check_comment_author_or_admin')
  .register(async function (params) {

    await $.model.Comment.updateById(params.comment_id, {content: params.content});

    let comment = await $.model.Comment.getById(params.comment_id);
    comment = $.model.Comment.formatPublic(comment);

    await $.model.Comment.fillReplyComment(comment, 'reply_id', 'reply');

    return comment;

  });


  $.api
  .delete('/topic/item/:id/comment/:comment_id')
  .group('comment')
  .title('删除评论')
  .description('仅管理员或评论作者可操作')
  .param('$user', {type: 'UserSession'})
  .param('id', {type: 'TopicId', comment: '通过URL参数指定'})
  .param('comment_id', {type: 'CommentId', comment: '通过URL参数指定'})
  .required('$user')
  .use('check_topic_exists', 'check_comment_author_or_admin')
  .register(async function (params) {

    await $.model.Comment.removeById(params.comment_id);

    return {comment_id: params.comment_id};

  });


  $.api
  .post('/topic/item/:id/comment/:comment_id/like')
  .group('comment')
  .title('评论点赞')
  .param('$user', {type: 'UserSession'})
  .param('id', {type: 'TopicId', comment: '通过URL参数指定'})
  .param('comment_id', {type: 'CommentId', comment: '通过URL参数指定'})
  .required('$user', 'id', 'comment_id')
  .use('check_topic_exists', 'check_comment_exists')
  .register(async function (params) {

    await $.model.CommentLike.add(params.comment_id, params.$user.id);

    return {ok: true};

  });


  $.api
  .delete('/topic/item/:id/comment/:comment_id/like')
  .group('comment')
  .title('取消评论点赞')
  .param('$user', {type: 'UserSession'})
  .param('id', {type: 'TopicId', comment: '通过URL参数指定'})
  .param('comment_id', {type: 'CommentId', comment: '通过URL参数指定'})
  .required('$user', 'id', 'comment_id')
  .use('check_topic_exists', 'check_comment_exists')
  .register(async function (params) {

    await $.model.CommentLike.delete(params.comment_id, params.$user.id);

    return {ok: true};

  });


  $.api
  .get('/topic/item/:id/comment/:comment_id/likes')
  .group('topic')
  .title('给主题点赞的用户列表')
  .param('$user', {type: 'UserSession'})
  .param('id', {type: 'TopicId', comment: '通过URL参数指定'})
  .param('comment_id', {type: 'CommentId', comment: '通过URL参数指定'})
  .use('check_topic_exists', 'check_comment_exists')
  .required('id', 'comment_id')
  .register(async function (params) {

    const ret = await $.model.CommentLike.listById(params.comment_id);

    const list = [];
    for (const item of ret) {

      const user = await $.model.User.getById(item.user_id);
      if (user) {
        list.push({
          user: $.model.User.formatPublic(user),
          created_at: item.created_at,
        });
      }

    }

    return list;

  });


};
