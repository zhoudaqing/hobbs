## 给主题点赞的用户列表

源文件：`apis/comment.js:167:9`

请求地址：**GET** **/topic/item/:id/comment/:comment_id/likes**

中间件：

+ **check_topic_exists**
+ **check_comment_exists**

参数名 | 类型 | 格式化 | 必填 | 说明
------|-----|-------|------|-----
$user | UserSession | 是 | 否 | undefined
id | TopicId | 是 | 是 | 通过URL参数指定
comment_id | CommentId | 是 | 是 | 通过URL参数指定

## 发表新主题

源文件：`apis/topic.js:17:9`

请求地址：**POST** **/topic/new**

中间件：

+ **check_param_sort_order_only_admin**

参数名 | 类型 | 格式化 | 必填 | 说明
------|-----|-------|------|-----
$user | UserSession | 是 | 是 | undefined
title | TopicTitle | 是 | 是 | 标题
content | MarkdownContent | 是 | 是 | 内容
tags | Tags | 是 | 否 | 标签（数组）：top:置顶, good:精华, ask:新手提问, share:交流讨论, activity:活动推荐, notice:公告通知, top和good仅管理员能设置，其他用户设置时会被自动忽略
sort_order | SortOrder | 是 | 否 | 仅管理员可设置，其他用户设置本参数会被忽略
    
使用示例：

```
input = {
  "title": "这是第一篇文章",
  "content": "这里是内容",
  "tags": "test,first"
};
output = {
  "status": 0,
  "result": {
    "status": 0,
    "result": {
      "id": 1,
      "author_id": 1,
      "title": "这是第一篇文章",
      "tags": "",
      "content": "这里是内容",
      "created_at": "2016-06-12T13:18:57.000Z",
      "updated_at": "2016-06-12T13:18:57.000Z",
      "last_commented_at": "2016-06-12T13:18:57.000Z",
      "sort_order": 0
    }
  }
};
```

## 查询主题列表

源文件：`apis/topic.js:46:9`

请求地址：**GET** **/topic/list**

中间件：



参数名 | 类型 | 格式化 | 必填 | 说明
------|-----|-------|------|-----
$user | UserSession | 是 | 否 | undefined
tags | Tags | 是 | 否 | 标签（数组）：top:置顶, good:精华, ask:新手提问, share:交流讨论, activity:活动推荐, notice:公告通知, top和good仅管理员能设置，其他用户设置时会被自动忽略
keyword | String | 是 | 否 | 搜索关键字
skip | Number | 是 | 否 | 查询主题的偏移量
limit | Number | 是 | 否 | 查询主题的数量
order_by | ListOrderBy | 是 | 否 | 有效的排序字段有`id`, `created_at`, `updated_at`, `last_commented_at`

## 查询指定主题的详细信息

源文件：`apis/topic.js:79:9`

请求地址：**GET** **/topic/item/:id**

中间件：

+ **check_topic_exists**

参数名 | 类型 | 格式化 | 必填 | 说明
------|-----|-------|------|-----
$user | UserSession | 是 | 否 | undefined
id | TopicId | 是 | 是 | 通过URL参数指定
show_comments | Boolean | 是 | 否 | 是否显示评论列表
comments_skip | Number | 是 | 否 | 显示的评论起始位置
comments_limit | Number | 是 | 否 | 显示的评论数量
comments_order_by | ListOrderBy | 是 | 否 | 有效的排序字段有`id`, `created_at`, `updated_at`

## 更新主题内容

源文件：`apis/topic.js:131:9`

请求地址：**PUT** **/topic/item/:id**

中间件：

+ **check_topic_author_or_admin**
+ **check_param_sort_order_only_admin**

参数名 | 类型 | 格式化 | 必填 | 说明
------|-----|-------|------|-----
$user | UserSession | 是 | 是 | undefined
id | TopicId | 是 | 否 | 通过URL参数指定
title | TopicTitle | 是 | 否 | 标题
content | MarkdownContent | 是 | 否 | 内容
tags | Tags | 是 | 否 | 标签（数组）：top:置顶, good:精华, ask:新手提问, share:交流讨论, activity:活动推荐, notice:公告通知, top和good仅管理员能设置，其他用户设置时会被自动忽略
sort_order | SortOrder | 是 | 否 | 仅管理员可设置，其他用户设置本参数会被忽略

## 删除主题

源文件：`apis/topic.js:165:15`

请求地址：**DELETE** **/topic/item/:id**

中间件：

+ **check_topic_author_or_admin**

参数名 | 类型 | 格式化 | 必填 | 说明
------|-----|-------|------|-----
$user | UserSession | 是 | 是 | undefined
id | TopicId | 是 | 否 | 通过URL参数指定

## 给主题点赞

源文件：`apis/topic.js:178:9`

请求地址：**POST** **/topic/item/:id/like**

中间件：

+ **check_topic_exists**

参数名 | 类型 | 格式化 | 必填 | 说明
------|-----|-------|------|-----
$user | UserSession | 是 | 是 | undefined
id | TopicId | 是 | 是 | 通过URL参数指定

## 取消给主题点赞

源文件：`apis/topic.js:191:15`

请求地址：**DELETE** **/topic/item/:id/like**

中间件：

+ **check_topic_exists**

参数名 | 类型 | 格式化 | 必填 | 说明
------|-----|-------|------|-----
$user | UserSession | 是 | 是 | undefined
id | TopicId | 是 | 是 | 通过URL参数指定

## 给主题点赞的用户列表

源文件：`apis/topic.js:204:9`

请求地址：**GET** **/topic/item/:id/likes**

中间件：

+ **check_topic_exists**

参数名 | 类型 | 格式化 | 必填 | 说明
------|-----|-------|------|-----
$user | UserSession | 是 | 否 | undefined
id | TopicId | 是 | 是 | 通过URL参数指定