import { localStg } from '@/utils';

/** 获取token */
export function getToken() {
  return localStg.get('token') || '';
}

/** 获取用户信息 */
export function getUserInfo() {
  const emptyInfo: Auth.UserInfo = {
    userId: '',
    userName: '',
    userRole: 'user'
  };
  const userInfo: Auth.UserInfo = localStg.get('userInfo') || emptyInfo;

  return userInfo;
}

/** 获取用户密码 */
export function getPwd() {
	const pwd = localStg.get('pwd') || "";
	return pwd;
}

/** 获取记住用户账密 */
export function getUpInfo() {
	const emptyInfo: Auth.UpInfoType = {
		name: '',
		pwd: ''
	}
	const info: Auth.UpInfoType = localStg.get('upInfo') || emptyInfo;
	return info;
}

/** 获取用户数据源配置信息 */
export function getUserConfigInfo() {
	const configInfo: Auth.wdConfigInfo = localStg.get('wdConfigInfo') || [];
	return configInfo;
}

/** 去除用户相关缓存 */
export function clearAuthStorage() {
  localStg.remove('token');
  localStg.remove('refreshToken');
  localStg.remove('userInfo');
	localStg.remove('wdConfigInfo');
}
