# 错误类型

## data_has_been_removed

内容：

```
(msg, data) => `该数据已经被删除：${ msg }`
```

数据：

```
{
  "description": "该数据已经被删除",
  "status": 2,
  "type": "data_has_been_removed"
}
```

## invalid_logout_token

内容：

```
(msg, data) => `注销token无效：${ msg }`
```

数据：

```
{
  "description": "注销token错误",
  "status": 1,
  "type": "invalid_logout_token"
}
```

## missing_required_parameter

内容：

```
(msg, data) => `missing required parameter ${ data.name }${ msg ? ': ' + msg : '' }`
```

数据：

```
{
  "description": "missing required parameter error",
  "status": -2,
  "type": "missing_required_parameter"
}
```

## other_error

内容：

```
msg => msg
```

数据：

```
{
  "description": "other error",
  "status": -1,
  "type": "other_error"
}
```

## parameter_error

内容：

```
(msg, data) => `incorrect parameter ${ data.name }${ msg ? ': ' + msg : '' }`
```

数据：

```
{
  "description": "parameter error",
  "status": -3,
  "type": "parameter_error"
}
```

## permission_denied

内容：

```
(msg, data) => `没有权限操作：${ msg }`
```

数据：

```
{
  "description": "没有权限操作",
  "status": 3,
  "type": "permission_denied"
}
```