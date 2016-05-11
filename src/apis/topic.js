'use strict';

/**
 * hobbs
 *
 * @author Zongmin Lei <leizongmin@gmail.com>
 */

export default function () {


  const TAGS_COMMENT = '标签（数组）：top:置顶, good:精华, ask:新手提问, share:交流讨论, activity:活动推荐, notice:公告通知, top和good仅管理员能设置，其他用户设置时会被自动忽略';


  $.api
  .post('/topic/new')
  .group('topic')
  .title('发表新主题')
  .param('$user', {type: 'UserSession'})
  .param('title', {type: 'TopicTitle', comment: '标题'})
  .param('content', {type: 'MarkdownContent', comment: '内容'})
  .param('tags', {type: 'Tags', comment: TAGS_COMMENT, default: []})
  .param('sort_order', {type: 'SortOrder', comment: '仅管理员可设置，其他用户设置本参数会被忽略', default: 0})
  .required('$user' ,'title', 'content')
  .use('check_param_sort_order_only_admin')
  .register(async function (params) {

    const id = await $.model.Topic.add({
      author_id: params.$user.id,
      title: params.title,
      tags: params.tags.join(','),
      sort_order: params.sort_order,
    });

    await $.model.TopicContent.updateById(id, params.content);
    await $.model.Tag.reset(id, params.tags);

    const topic = await $.model.Topic.getById(id);
    const {content} = await $.model.TopicContent.getById(id);
    topic.content = content;

    return $.model.Topic.formatPublic(topic);

  });


  $.api
  .get('/topic/list')
  .group('topic')
  .title('查询主题列表')
  .param('$user', {type: 'UserSession'})
  .param('tags', {type: 'Tags', comment: TAGS_COMMENT})
  .param('keyword', {type: 'String', comment: '搜索关键字'})
  .param('skip', {type: 'Number', comment: '查询主题的偏移量', default: 0})
  .param('limit', {type: 'Number', comment: '查询主题的数量', default: 20})
  .param('order_by', {
    type: 'ListOrderBy',
    params: {columns: ['id', 'created_at', 'updated_at', 'last_commented_at']},
    default: 'id:desc',
    comment: '有效的排序字段有`id`, `created_at`, `updated_at`, `last_commented_at`',
  })
  .register(async function (params) {

    const query = {is_removed: 0};
    if (params.tags && params.tags.length > 0) query.tags = params.tags;
    if (params.keyword) query.title = params.keyword;

    const count = await $.model.Topic.count(query);
    let list = await $.model.Topic.list(query, params);
    list = list.map($.model.Topic.formatPublic);

    await $.model.User.fillUserInfo(list, 'author_id', 'author');
    await $.model.TopicLike.fillLikesCount(list, 'id', 'like_count');

    if (params.$user && params.$user.id) {
      await $.model.TopicLike.fillLikedStatus(list, 'id', 'is_liked', params.$user.id);
    }

    await $.model.Comment.fillCount(list, 'id', 'comment_count');

    return {count, list};

  });


  $.api
  .get('/topic/item/:id')
  .group('topic')
  .title('查询指定主题的详细信息')
  .param('$user', {type: 'UserSession'})
  .param('id', {type: 'TopicId', comment: '通过URL参数指定'})
  .param('show_comments', {type: 'Boolean', comment: '是否显示评论列表', default: false})
  .param('comments_skip', {type: 'Number', comment: '显示的评论起始位置', default:0})
  .param('comments_limit', {type: 'Number', comment: '显示的评论数量', default: 50})
  .param('comments_order_by', {
    type: 'ListOrderBy',
    params: {columns: ['id', 'created_at', 'updated_at']},
    default: 'id:desc',
    comment: '有效的排序字段有`id`, `created_at`, `updated_at`',
  })
  .required('id')
  .use('check_topic_exists')
  .register(async function (params) {

    const topic = await $.model.Topic.getById(params.id);

    if (topic.is_removed) {
      throw $.api.error('data_has_been_removed', `topic #${params.id}`);
    }

    const output = {};

    const {content} = await $.model.TopicContent.getById(params.id);
    topic.content = content;
    output.topic = $.model.Topic.formatPublic(topic);

    await $.model.User.fillUserInfo(output.topic, 'author_id', 'author');

    if (params.show_comments) {
      output.comments = await $.model.Comment.list({topic_id: params.id}, {
        skip: params.comments_skip,
        limit: params.comments_limit,
        order_by: params.comments_order_by,
      });
      await $.model.CommentLike.fillLikesCount(output.comments, 'id', 'like_count');
      await $.model.Comment.fillReplyComment(output.comments, 'reply_id', 'reply');
    }

    output.like_count = await $.model.TopicLike.countById(params.id);

    if (params.$user && params.$user.id) {
      await $.model.TopicLike.fillLikedStatus(output.topic, 'id', 'is_liked', params.$user.id);
      if (output.comments) {
        await $.model.CommentLike.fillLikedStatus(output.comments, 'id', 'is_liked', params.$user.id);
      }
    }

    return output;

  });


  $.api
  .put('/topic/item/:id')
  .group('topic')
  .title('更新主题内容')
  .description('仅管理员或作者可操作')
  .param('$user', {type: 'UserSession'})
  .param('id', {type: 'TopicId', comment: '通过URL参数指定'})
  .param('title', {type: 'TopicTitle', comment: '标题'})
  .param('content', {type: 'MarkdownContent', comment: '内容'})
  .param('tags', {type: 'Tags', comment: TAGS_COMMENT})
  .param('sort_order', {type: 'SortOrder', comment: '仅管理员可设置，其他用户设置本参数会被忽略', default: 0})
  .required('$user')
  .use('check_topic_author_or_admin')
  .use('check_param_sort_order_only_admin')
  .register(async function (params) {

    const id = params.id;
    const update = {};
    if (params.title) update.title = params.title;
    if (params.tags) update.tags = params.tags.join(',');
    if (params.sort_order) update.sort_order = params.sort_order;

    await $.model.Topic.updateById(id, update);

    if ('content' in params) {
      await $.model.TopicContent.updateById(id, params.content);
    }
    if ('tags' in params) {
      await $.model.Tag.reset(id, params.tags);
    }

    const topic = await $.model.Topic.getById(id);
    const {content} = await $.model.TopicContent.getById(id);
    topic.content = content;

    return $.model.Topic.formatPublic(topic);

  });


  $.api
  .delete('/topic/item/:id')
  .group('topic')
  .title('删除主题')
  .description('仅管理员或作者可操作')
  .param('$user', {type: 'UserSession'})
  .param('id', {type: 'TopicId', comment: '通过URL参数指定'})
  .required('$user')
  .use('check_topic_author_or_admin')
  .register(async function (params) {

    await $.model.Topic.removeById(params.id);

    return {id: params.id};

  });


  $.api
  .post('/topic/item/:id/like')
  .group('topic')
  .title('给主题点赞')
  .param('$user', {type: 'UserSession'})
  .param('id', {type: 'TopicId', comment: '通过URL参数指定'})
  .required('$user', 'id')
  .use('check_topic_exists')
  .register(async function (params) {

    await $.model.TopicLike.add(params.id, params.$user.id);

    return {ok: true};

  });


  $.api
  .delete('/topic/item/:id/like')
  .group('topic')
  .title('取消给主题点赞')
  .param('$user', {type: 'UserSession'})
  .param('id', {type: 'TopicId', comment: '通过URL参数指定'})
  .required('$user', 'id')
  .use('check_topic_exists')
  .register(async function (params) {

    await $.model.TopicLike.delete(params.id, params.$user.id);

    return {ok: true};

  });


  $.api
  .get('/topic/item/:id/likes')
  .group('topic')
  .title('给主题点赞的用户列表')
  .param('$user', {type: 'UserSession'})
  .param('id', {type: 'TopicId', comment: '通过URL参数指定'})
  .required('id')
  .use('check_topic_exists')
  .register(async function (params) {

    const ret = await $.model.TopicLike.listById(params.id);

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
