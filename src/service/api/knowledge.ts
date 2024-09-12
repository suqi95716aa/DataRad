import { request } from '../request';

/* 获取知识库 */
export function fetchGetKnowledgeBase(data: FormData) {
	return request.post(`/kb/get`, data)
}

/* 添加知识库 */
export function fetchAddKnowledgeBase(data: FormData) {
	return request.post(`/kb/add`, data)
}

/* 更新知识库 */
export function fetchUpdateKnowledgeBase(data: FormData) {
	return request.post(`/kb/update`, data)
}

/* 删除知识库 */
export function fetchDeleteKnowledgeBase(data: FormData) {
	return request.post(`/kb/delete`, data)
}

/* 知识预览 */
export function fetchPreviewsKnowledge(data: FormData) {
	return request.post(`/k/previews`, data)
}

/* 知识预览上传 */
export function fetchPreviewsUploadKnowledge(data: FormData) {
	return request.post(`/k/previews/upload`, data)
}

/* 知识预览删除 */
export function fetchPreviewsRemoveKnowledge(data: FormData) {
	return request.post(`/k/previews/rm`, data)
}

/* 知识添加 */
export function fetchAddKnowledge(data: FormData) {
	return request.post(`/k/add`, data)
}

/* 知识删除 */
export function fetchDeleteKnowledge(data: FormData) {
	return request.post(`/k/delete`, data)
}

/* 知识获取 */
export function fetchGetKnowledge(data: FormData) {
	return request.post(`/k/data`, data)
}
