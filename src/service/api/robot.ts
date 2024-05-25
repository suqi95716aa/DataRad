import { request } from '../request';

/* 添加场景 */
export function fetchAddScreen(data: FormData) {
	return request.post(`/screen/add`, data)
}

/* 删除场景 */
export function fetchDeleteScreen(data: FormData) {
	return request.post(`/screen/delete`, data)
}

/* 更新场景 */
export function fetchUpdateScreen(data: FormData) {
	return request.post(`/screen/update`, data)
}

/* 数据助手问答 */
export function fetchGetDhQuery(data: FormData) {
	return request.post(`/dh/query`, data)
}

/* 知识助手问答 */
export function fetchGetKbqaQuery(data: FormData) {
	return request.post(`/kbqa/query`, data)
}
