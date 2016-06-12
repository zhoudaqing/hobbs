## 获取主题的评论列表

源文件：`apis/comment.js:53:9`

请求地址：**GET** **/topic/item/:id/comments**

中间件：

+ **check_topic_exists**

参数名 | 类型 | 格式化 | 必填 | 说明
------|-----|-------|------|-----
$user | UserSession | 是 | 否 | undefined
id | TopicId | 是 | 否 | 通过URL参数指定
skip | Number | 是 | 否 | 查询评论的偏移量
limit | Number | 是 | 否 | 查询评论的数量
order_by | ListOrderBy | 是 | 否 | 有效的排序字段有`id`, `created_at`, `updated_at`

## 添加评论

源文件：`apis/comment.js:83:9`

请求地址：**POST** **/topic/item/:id/comments**

中间件：

+ **check_topic_exists**
+ **check_reply_comment_exists**

参数名 | 类型 | 格式化 | 必填 | 说明
------|-----|-------|------|-----
$user | UserSession | 是 | 是 | undefined
id | TopicId | 是 | 否 | 通过URL参数指定
reply_id | CommentId | 是 | 否 | 回复的评论ID，如果设置此参数，则被回复的评论的作者将收到通知
content | MarkdownContent | 是 | 是 | 内容

## 更新评论

源文件：`apis/comment.js:110:9`

请求地址：**PUT** **/topic/item/:id/comment/:comment_id**

中间件：

+ **check_topic_exists**
+ **check_comment_author_or_admin**

参数名 | 类型 | 格式化 | 必填 | 说明
------|-----|-------|------|-----
$user | UserSession | 是 | 是 | undefined
id | TopicId | 是 | 否 | 通过URL参数指定
comment_id | CommentId | 是 | 否 | 通过URL参数指定
content | MarkdownContent | 是 | 是 | 评论内容

## 删除评论

源文件：`apis/comment.js:128:15`

请求地址：**DELETE** **/topic/item/:id/comment/:comment_id**

中间件：

+ **check_topic_exists**
+ **check_comment_author_or_admin**

参数名 | 类型 | 格式化 | 必填 | 说明
------|-----|-------|------|-----
$user | UserSession | 是 | 是 | undefined
id | TopicId | 是 | 否 | 通过URL参数指定
comment_id | CommentId | 是 | 否 | 通过URL参数指定

## 评论点赞

源文件：`apis/comment.js:141:9`

请求地址：**POST** **/topic/item/:id/comment/:comment_id/like**

中间件：

+ **check_topic_exists**
+ **check_comment_exists**

参数名 | 类型 | 格式化 | 必填 | 说明
------|-----|-------|------|-----
$user | UserSession | 是 | 是 | undefined
id | TopicId | 是 | 是 | 通过URL参数指定
comment_id | CommentId | 是 | 是 | 通过URL参数指定

## 取消评论点赞

源文件：`apis/comment.js:154:15`

请求地址：**DELETE** **/topic/item/:id/comment/:comment_id/like**

中间件：

+ **check_topic_exists**
+ **check_comment_exists**

参数名 | 类型 | 格式化 | 必填 | 说明
------|-----|-------|------|-----
$user | UserSession | 是 | 是 | undefined
id | TopicId | 是 | 是 | 通过URL参数指定
comment_id | CommentId | 是 | 是 | 通过URL参数指定