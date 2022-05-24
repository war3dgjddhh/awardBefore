import { extend } from 'umi-request';
import type { ResponseInterceptor } from 'umi-request';
import qs from 'qs';
// // 配置响应拦截器
// const responseInterceptor: ResponseInterceptor = (
//   response: Response & { loading?: boolean },
//   options,
// ) => {
//   console.log('请求拦截器已经生效了');
//   return response;
// };
const request = extend({
  timeout: 3000,
});
// request.interceptors.response.use(responseInterceptor);

/** 登录接口 POST /api/login/account */
export async function login(body: API.LoginResult, options?: { [key: string]: any }) {
  return request<User.LoginResult>('/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 获取当前的用户 GET /api/currentUser */
export async function currentUser(options?: { [key: string]: any }) {
  return request<{
    data: User.CurrentUser;
  }>('/api/getCurrentUser', {
    method: 'GET',
    ...(options || {}),
  });
}

// 查询用户列表
export function listUser(query: object) {
  return request('/api/user/list', {
    method: 'get',
    params: query,
    // 这个地方默认的转换有问题,换成这样就好了
    paramsSerializer: function (params) {
      return qs.stringify(params, { arrayFormat: 'brackets' });
    },
  });
}

// 查询用户详细
export function getUser(userId: number) {
  return request(`/api/user/${userId}`, {
    method: 'get',
  });
}

// 新增用户
export function addUser(data: object) {
  return request('/api/user', {
    method: 'post',
    data: data,
  });
}

// 修改用户
/**
 *
 * @param data 里面必须包含userId
 * @returns
 */
export function updateUser(data: object) {
  return request(`/api/user`, {
    method: 'put',
    data: data,
  });
}

// 删除用户
export function delUser(userIds: number[]) {
  return request(`/api/user/${userIds}`, {
    method: 'delete',
    data: {
      deleteUserId: 1, // getCurrentUserId,
    },
  });
}

// // 用户密码重置
// export function resetUserPwd(userId, password) {
//   const data = {
//     userId,
//     password,
//   };
//   return request({
//     url: '/api/user/resetPwd',
//     method: 'put',
//     data: data,
//   });
// }

// // 用户状态修改
// export function changeUserStatus(userId, status) {
//   const data = {
//     userId,
//     status,
//   };
//   return request({
//     url: '/api/user/changeStatus',
//     method: 'put',
//     data: data,
//   });
// }

// // 查询用户个人信息
// export function getUserProfile() {
//   return request({
//     url: '/api/user/profile',
//     method: 'get',
//   });
// }

// // 修改用户个人信息
// export function updateUserProfile(data) {
//   return request({
//     url: '/api/user/profile',
//     method: 'put',
//     data: data,
//   });
// }

// // 用户密码重置
// export function updateUserPwd(oldPassword, newPassword) {
//   const data = {
//     oldPassword,
//     newPassword,
//   };
//   return request({
//     url: '/api/user/profile/updatePwd',
//     method: 'put',
//     params: data,
//   });
// }

// // 用户头像上传
// export function uploadAvatar(data) {
//   return request({
//     url: '/api/user/profile/avatar',
//     method: 'post',
//     data: data,
//   });
// }

// // 查询授权角色
// export function getAuthRole(userId) {
//   return request({
//     url: '/api/user/authRole/' + userId,
//     method: 'get',
//   });
// }

// // 保存授权角色
// export function updateAuthRole(data) {
//   return request({
//     url: '/api/user/authRole',
//     method: 'put',
//     params: data,
//   });
// }
