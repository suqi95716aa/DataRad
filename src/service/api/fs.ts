import { request } from '../request';

/* 获取URL_生成 */
export function fetchGetFsUrl(data: FormData) {
	return request.post('/fs/link', data)
}
