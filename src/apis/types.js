'use strict';

/**
 * hobbs
 *
 * @author Zongmin Lei <leizongmin@gmail.com>
 */

export default function () {

  const registerType = $.api.registerType;

  registerType('Password', {
    checker: (v) => typeof v === 'string' && v.length >= 5 && v.length <= 100,
    description: '密码长度为6~100个字符',
  });

  const ALLOW_TAGS = ['good', 'ask', 'share', 'activity', 'notice'];
  registerType('Tags', {
    checker: (v) => Array.isArray(v) || typeof v === 'string',
    formatter: (v) => {
      if (typeof v === 'string') v = v.split(',');
      return v.map(v => String(v).trim().toLowerCase()).filter(v => v && ALLOW_TAGS.indexOf(v) !== -1);
    },
    description: '标签，可以为数组或逗号分隔的字符串，如"share,good"',
  });

  registerType('TopicId', {
    checker: (v) => $.validator.isInt(v),
    formatter: (v) => Number(v),
    description: '主题ID',
  });

  registerType('TopicTitle', {
    checker: (v) => {
      if (typeof v === 'string') {
        v = v.trim();
        return v.length >=6 && v.length <= 100;
      } else {
        return false;
      }
    },
    formatter: (v) => v.trim(),
    description: '标题为5~100个字符',
  });

  registerType('CommentId', {
    checker: (v) => $.validator.isInt(v),
    formatter: (v) => Number(v),
    description: '评论ID',
  });

  registerType('MarkdownContent', {
    checker: (v) => {
      if (typeof v === 'string') {
        v = v.trim();
        return v.length > 0 && v.length < 32 * 1024;
      } else {
        return false;
      }
    },
    formatter: (v) => v.trim(),
    description: 'Markdown格式的内容，不能为空，长度不超过32K',
  });

  registerType('UserSession', {
    checker: (v) => v.id && v.email,
    description: '登录用户信息，在登录状态下无需手动提交参数',
  });

  registerType('NotificationId', {
    checker: (v) => $.validator.isInt(v),
    formatter: (v) => Number(v),
    description: '通知消息ID',
  });

  registerType('ListOrderBy', {
    checker: (v) => v && typeof v === 'string',
    formatter: (v, params) => $.utils.parseOrderBy(v, params.columns),
    paramsChecker: (v) => Array.isArray(v.columns) && v.columns.length > 0,
    description: '查询结果的排序方向，示例：`id:asc`表示按照`id`从小到大排序（`desc`表示从大到小）',
  });

  registerType('SortOrder', {
    checker: (v) => $.validator.isInt(v),
    formatter: (v) => Number(v),
    description: '排序优先级，默认0，数字越大优先级越高，为了达到置顶效果，可以将其值设置为1',
  });

};
