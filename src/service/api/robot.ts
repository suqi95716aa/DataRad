import { request } from '../request';

const baseURL = import.meta.env.DEV ? '/api' : ''

/* 添加场景 */
export function fetchAddScreen(data: FormData) {
	return request.post(`${baseURL}/screen/add`, data)
}

/* 删除场景 */
export function fetchDeleteScreen(data: FormData) {
	return request.post(`${baseURL}/screen/delete`, data)
}

/* 更新场景 */
export function fetchUpdateScreen(data: FormData) {
	return request.post(`${baseURL}/screen/update`, data)
}

/* 问答 */
export function fetchGetWdQuery(data: FormData) {
	return request.post(`${baseURL}/query`, data)
}
