# hobbs

## 安装

```bash
$ npm install hobbs --save
```

**要求在 Node.js v4.0 及以上版本上运行**


## 使用

新建文件`server.js`：

```javascript
'use strict';

const path = require('path');
const hobbs = require('hobbs');


// 载入hobbs
hobbs.load();

// 初始化服务
$.init(err => {
  if (err) throw err;
  console.log('server started');
});
```

新建配置文件`config/dev.js`：

```javascript
module.exports = function (set, get, has, conf) {

  // 服务器监听端口
  set('web.port', 3000);

};
```

启动：

```bash
$ HOBBS_ENV=dev node server.js
```


## License

```
The MIT License (MIT)

Copyright (c) 2016 Zongmin Lei <leizongmin@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
