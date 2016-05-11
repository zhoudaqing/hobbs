'use strict';

/**
 * hobbs
 *
 * @author Zongmin Lei <leizongmin@gmail.com>
 */

export default function () {

  const registerError = $.api.registerError;

  registerError('invalid_logout_token', {
    description: '注销token错误',
    status: 1,
    message: (msg, data) => `注销token无效：${msg}`,
  });

  registerError('data_has_been_removed', {
    description: '该数据已经被删除',
    status: 2,
    message: (msg, data) => `该数据已经被删除：${msg}`,
  });

  registerError('permission_denied', {
    description: '没有权限操作',
    status: 3,
    message: (msg, data) => `没有权限操作：${msg}`,
  });

};
