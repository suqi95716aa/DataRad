import { kbRequest } from '../request';

const baseURL = ''

/* 获取知识库 */
export function fetchGetKnowledgeBase(data: FormData) {
	return kbRequest.post(`${baseURL}/kb/get`, data)
}

/* 添加知识库 */
export function fetchAddKnowledgeBase(data: FormData) {
	return kbRequest.post(`${baseURL}/kb/add`, data)
}

/* 更新知识库 */
export function fetchUpdateKnowledgeBase(data: FormData) {
	return kbRequest.post(`${baseURL}/kb/update`, data)
}

/* 删除知识库 */
export function fetchDeleteKnowledgeBase(data: FormData) {
	return kbRequest.post(`${baseURL}/kb/delete`, data)
}

/* 知识预览 */
export function fetchPreviewsKnowledge(data: FormData) {
	return kbRequest.post(`${baseURL}/k/previews`, data)
}

/* 知识预览上传 */
export function fetchPreviewsUploadKnowledge(data: FormData) {
	return kbRequest.post(`${baseURL}/k/previews/upload`, data)
}

/* 知识预览删除 */
export function fetchPreviewsRemoveKnowledge(data: FormData) {
	return kbRequest.post(`${baseURL}/k/previews/rm`, data)
}

/* 知识添加 */
export function fetchAddKnowledge(data: FormData) {
	return kbRequest.post(`${baseURL}/k/add`, data)
}

/* 知识删除 */
export function fetchDeleteKnowledge(data: FormData) {
	return kbRequest.post(`${baseURL}/k/delete`, data)
}

/* 知识获取 */
export function fetchGetKnowledge(data: FormData) {
	return kbRequest.post(`${baseURL}/k/data`, data)
}
