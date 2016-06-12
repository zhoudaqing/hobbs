## 查询当前登录用户的通知消息数量

源文件：`apis/notification.js:15:9`

请求地址：**GET** **/my/notifications/count**

中间件：



参数名 | 类型 | 格式化 | 必填 | 说明
------|-----|-------|------|-----
$user | UserSession | 是 | 否 | 通过`/login`接口登录后即自动包含该信息，无需手动设置参数
type | TrimString | 是 | 否 | 消息类型，目前可选的值是`reply`，不提供此参数表示全部
is_read | Boolean | 是 | 否 | `true`表示只返回已读消息，默认`false`表示只返回未读消息

## 查询当前登录用户的通知消息

源文件：`apis/notification.js:34:9`

请求地址：**GET** **/my/notifications**

中间件：



参数名 | 类型 | 格式化 | 必填 | 说明
------|-----|-------|------|-----
$user | UserSession | 是 | 否 | 通过`/login`接口登录后即自动包含该信息，无需手动设置参数
type | TrimString | 是 | 否 | 消息类型，目前可选的值是`reply`，不提供此参数表示全部
is_read | Boolean | 是 | 否 | `true`表示只返回已读消息，默认`false`表示只返回未读消息
skip | Number | 是 | 否 | 返回结果的偏移量
limit | Integer | 是 | 否 | 仅返回前N条结果
order_by | ListOrderBy | 是 | 否 | 有效的排序字段有`id`, `created_at`, `updated_at`

## 将指定ID的通知设置为已读

源文件：`apis/notification.js:75:9`

请求地址：**POST** **/my/notification/:id/read**

中间件：

+ **check_notification_owner**

参数名 | 类型 | 格式化 | 必填 | 说明
------|-----|-------|------|-----
$user | UserSession | 是 | 否 | 通过`/login`接口登录后即自动包含该信息，无需手动设置参数
id | NotificationId | 是 | 否 | 通过URL参数指定