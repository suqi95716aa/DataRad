import { request, mockRequest } from '../request';

interface ConfigInfo {
	[key: string]: any
}

/**
 * 获取验证码
 * @param phone - 手机号
 * @returns - 返回boolean值表示是否发送成功
 */
export function fetchSmsCode(phone: string) {
  return mockRequest.post<boolean>('/getSmsCode', { phone });
}

/**
 * 注册
 */
export function fetchRegister(data: FormData) {
	return request.post('/user/add', data)
}

/**
 * 登录
 * @param userName - 用户名
 * @param password - 密码
 */
// export function fetchLogin(userName: string, password: string) {
//   return mockRequest.post<ApiAuth.Token>('/login', { userName, password });
// }
export function fetchLogin(data: FormData) {
  // return mockRequest.post<ApiAuth.Token>('/login', { userName, password });
	return request.post('/user/login', data)
}

/** 获取用户信息 */
export function fetchUserInfo() {
  return mockRequest.get<ApiAuth.UserInfo>('/getUserInfo');
}

/**
 * 获取用户路由数据
 * @param userId - 用户id
 * @description 后端根据用户id查询到对应的角色类型，并将路由筛选出对应角色的路由数据返回前端
 */
export function fetchUserRoutes(userId: string) {
  return mockRequest.post<ApiRoute.Route>('/getUserRoutes', { userId });
}

/**
 * 刷新token
 * @param refreshToken
 */
export function fetchUpdateToken(refreshToken: string) {
  return mockRequest.post<ApiAuth.Token>('/updateToken', { refreshToken });
}

/** 获取用户数据源配置信息 */
export function fetchUserConfigInfo (data: any): Promise<ConfigInfo> {
	return request.post('/config/get', data);
}

/* 获取用户数据源对应的表数据 */
export async function fetchGetConfigData(data: FormData) {
  return request.post('/config/data', data);
}

/* 获取用户场景 */
export function fetchGetScreenList(data: FormData) {
	return request.post('/screen/list', data)
}
