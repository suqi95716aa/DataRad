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

/* 数据助手问答 */
export function fetchGetDhQuery(data: FormData) {
	return request.post(`${baseURL}/dh/query`, data)
}

/* 知识助手问答 */
export function fetchGetKbqaQuery(data: FormData) {
	return request.post(`${baseURL}/kbqa/query`, data)
}
