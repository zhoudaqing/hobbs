## 登录

源文件：`apis/user.js:37:9`

请求地址：**POST** **/login**

中间件：



参数名 | 类型 | 格式化 | 必填 | 说明
------|-----|-------|------|-----
email | Email | 是 | 是 | undefined
password | Password | 是 | 是 | undefined
    
使用示例：

```
input = {
  "email": "test1@example.com",
  "password": "123456"
};
output = {
  "status": 0,
  "result": {
    "status": 0,
    "result": {
      "id": 1,
      "email": "test1@example.com",
      "name": "test1",
      "about": "来自AA",
      "role": "user",
      "last_logined_at": "2016-06-12T13:18:57.000Z",
      "logout_token": "hsgHXsCpI8"
    }
  }
};

//------------------

input = {
  "email": "test1@example.com",
  "password": "12345678"
};
output = {
  "status": 0,
  "result": {
    "error": {},
    "status": -1,
    "message": "invalid password"
  }
};

//------------------

input = {
  "email": "test1@example.com",
  "password": "123456"
};
output = {
  "status": 0,
  "result": {
    "status": 0,
    "result": {
      "id": 1,
      "email": "test1@example.com",
      "name": "test1",
      "about": "来自AA",
      "role": "user",
      "last_logined_at": "2016-06-12T13:18:57.000Z",
      "logout_token": "Mb5Bva81Pi"
    }
  }
};
```

## 注销

源文件：`apis/user.js:74:9`

请求地址：**GET** **/logout**

中间件：



参数名 | 类型 | 格式化 | 必填 | 说明
------|-----|-------|------|-----
$user | UserSession | 是 | 是 | 通过`/login`接口登录后即自动包含该信息，无需手动设置参数
token | String | 是 | 是 | 为了避免恶意被注销登录，每次登录均会生成唯一的`token`，注销时需要验证

## 注销

源文件：`apis/user.js:89:9`

请求地址：**POST** **/logout**

中间件：



参数名 | 类型 | 格式化 | 必填 | 说明
------|-----|-------|------|-----
$user | UserSession | 是 | 是 | 通过`/login`接口登录后即自动包含该信息，无需手动设置参数

## 当前登录用户的信息

源文件：`apis/user.js:100:9`

请求地址：**GET** **/my/info**

中间件：



参数名 | 类型 | 格式化 | 必填 | 说明
------|-----|-------|------|-----
$user | UserSession | 是 | 是 | 通过`/login`接口登录后即自动包含该信息，无需手动设置参数
    
使用示例：

```
input = {};
output = {
  "status": 0,
  "result": {
    "status": 0,
    "result": {
      "id": 1,
      "email": "test1@example.com",
      "name": "test1",
      "about": "来自AA",
      "role": "user",
      "last_logined_at": "2016-06-12T13:18:57.000Z",
      "logout_token": "hsgHXsCpI8"
    }
  }
};
```

## 更新当前登录用户信息

源文件：`apis/user.js:113:9`

请求地址：**POST** **/my/info**

中间件：



参数名 | 类型 | 格式化 | 必填 | 说明
------|-----|-------|------|-----
$user | UserSession | 是 | 是 | 通过`/login`接口登录后即自动包含该信息，无需手动设置参数
name | TrimString | 是 | 否 | 昵称
about | TrimString | 是 | 否 | 个人简介