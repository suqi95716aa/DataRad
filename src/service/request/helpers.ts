import type { AxiosRequestConfig } from 'axios';
import { useAuthStore } from '@/store';
import { localStg } from '@/utils';
import { fetchUpdateToken, fetchLogin } from '../api';

/**
 * 刷新token
 * @param axiosConfig - token失效时的请求配置
 */
export async function handleRefreshToken(axiosConfig: AxiosRequestConfig) {
  const { resetAuthStore, userInfo, pwd } = useAuthStore();
  // const refreshToken = localStg.get('refreshToken') || '';
  // const { data } = await fetchUpdateToken(refreshToken);
  // if (data) {
  //   localStg.set('token', data.token);
  //   localStg.set('refreshToken', data.refreshToken);

  //   const config = { ...axiosConfig };
  //   if (config.headers) {
  //     config.headers.Authorization = data.token;
  //   }
  //   return config;
  // }

	const formData = new FormData();
	formData.append("password", pwd);
	formData.append("loginType", "1");
	formData.append("userphone", userInfo.userPhone || "");

	const { data } = await fetchLogin(formData) as any;
	let token = data?.access_token;
	if (token) {
		localStg.set('token', token);
		const config = { ...axiosConfig };
    if (config.headers) {
      config.headers['access_token'] = token;
    }
    return config;
	}

  resetAuthStore();
  return null;
}
