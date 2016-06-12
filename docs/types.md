# 默认类型

## Any

## Boolean

## Base64

## Ascii

## AlphaNumeric

## Alpha

## Array

## Domain

## Object

## Date

## MongoId

## Email

## JSON

## Float

## Integer

## Number

## String

## URL

# 自定义类型

## Any

can be any type

检查：

```
v => true
```

格式化：

```
v => v
```

## Boolean

boolean

检查：

```
v => typeof v === 'boolean' || typeof v === 'string' && _validator2.default.isBoolean(v)
```

格式化：

```
v => String(v).toLowerCase() === 'true' ? true : false
```

## Base64

string is base64 encoded

检查：

```
v => typeof v === 'string' && _validator2.default.isBase64(v)
```

格式化：

```
v => v.trim()
```

## Ascii

string contains ASCII chars only

检查：

```
v => typeof v === 'string' && _validator2.default.isAscii(v)
```

格式化：

```
v => v
```

## AlphaNumeric

string contains only letters and numbers

检查：

```
v => typeof v === 'string' && _validator2.default.isAlphanumeric(v)
```

格式化：

```
v => v
```

## Alpha

string contains only letters (a-zA-Z).

检查：

```
v => typeof v === 'string' && _validator2.default.isAlpha(v)
```

格式化：

```
v => v
```

## Array

array

检查：

```
v => Array.isArray(v)
```

格式化：

```
v => v
```

## Domain

string is a fully qualified domain name (e.g. domain.com)

检查：

```
v => typeof v === 'string' && _validator2.default.isFQDN(v)
```

格式化：

```
v => v.trim()
```

## Object

object

检查：

```
v => v && typeof v === 'object'
```

格式化：

```
v => v
```

## Date

date

检查：

```
v => v instanceof Date || typeof v === 'string' && _validator2.default.isDate(v)
```

格式化：

```
v => new Date(v)
```

## MongoId

string is a valid hex-encoded representation of a MongoDB ObjectId

检查：

```
v => _validator2.default.isMongoId(String(v))
```

格式化：

```
v => v
```

## Email

string is an email

检查：

```
v => typeof v === 'string' && _validator2.default.isEmail(v)
```

格式化：

```
v => v.trim()
```

## JSON

string is valid JSON

检查：

```
v => typeof v === 'string' && _validator2.default.isJSON(v)
```

格式化：

```
v => v.trim()
```

## Float

float

检查：

```
v => _validator2.default.isFloat(String(v))
```

格式化：

```
v => Number(v)
```

## Integer

integer

检查：

```
v => _validator2.default.isInt(String(v))
```

格式化：

```
v => Number(v)
```

## Number

number

检查：

```
(v, p) => {
      const ok = !isNaN(v);
      if (ok && p) {
        if ('min' in p && !(v >= p.min)) return false;
        if ('max' in p && !(v <= p.max)) return false;
      }
      return ok;
    }
```

格式化：

```
v => Number(v)
```

## String

string

检查：

```
v => typeof v === 'string'
```

格式化：

```
v => v
```

## URL

string is an URL

检查：

```
v => typeof v === 'string' && _validator2.default.isURL(v)
```

格式化：

```
v => v.trim()
```