import { defineStore } from "pinia";
import { nanoid } from "nanoid";
import {
	fetchGetKnowledgeBase,
	fetchAddKnowledgeBase,
	fetchUpdateKnowledgeBase,
	fetchDeleteKnowledgeBase,
	fetchAddKnowledge,
	fetchDeleteKnowledge,
	fetchPreviewsKnowledge,
	fetchPreviewsRemoveKnowledge,
	fetchGetKnowledge
} from "@/service";
import { useAuthStore } from "../auth";
import { localStg } from "@/utils";
import { getKnowledgeBaseList } from "./helpers";

interface KnowledgeState {
	knowledgeBaseList: Knowledge.Base[];
}

export const useKnowledgeStore = defineStore("knowledge-store", {
	state: (): KnowledgeState => ({
		knowledgeBaseList: getKnowledgeBaseList(),
	}),
	getters: {},
	actions: {
		async getKBList() {
			const { userInfo } = useAuthStore();
			const formData = new FormData();
			formData.append("Uid", userInfo.userId);
			if (this.knowledgeBaseList.length) return false;
			const	results = await fetchGetKnowledgeBase(formData);
			if (results.error) return false;

			this.knowledgeBaseList = results.data as Knowledge.Base[];

			localStg.set("knowledgeBaseList", this.knowledgeBaseList);
			return true;
		},
		// 添加知识库
		async addKB(params: any) {
			const { userInfo } = useAuthStore();
			const formData = new FormData();
			formData.append("KBName", params.KBName);
			formData.append("KBDesc", params.KBDesc);
			formData.append("KBLabel", params.KBLabel);
			formData.append("KBColor", params.KBColor);
			formData.append("KBBGImg", params.KBBGImg);
			formData.append("Uid", userInfo.userId);

			const results = await fetchAddKnowledgeBase(formData);

			if (results.error) return false;

			const resData = results.data as Knowledge.Base;
			if (resData) {
				this.knowledgeBaseList.unshift(resData);
				localStg.set("knowledgeBaseList", this.knowledgeBaseList);
			}
			return true;
		},
		// 更新知识库
		async updateKB(params: any) {
			const { userInfo } = useAuthStore();
			const formData = new FormData();
			formData.append("KBID", params.KBID);
			formData.append("KBName", params.KBName);
			formData.append("KBDesc", params.KBDesc);
			formData.append("KBLabel", params.KBLabel);
			formData.append("KBColor", params.KBColor);
			formData.append("KBBGImg", params.KBBGImg);
			formData.append("Uid", userInfo.userId);
			const results = await fetchUpdateKnowledgeBase(formData);

			if (results.error) return false;

			const fIndex = this.knowledgeBaseList.findIndex(
				(item) => item.KBID === params.KBID
			);
			if (fIndex !== -1) {
				const obj = results.data as Knowledge.Base;
				this.knowledgeBaseList.splice(fIndex, 1, obj);
				localStg.set("knowledgeBaseList", this.knowledgeBaseList);
			}
			return true;
		},
		// 删除知识库
		async deleteKB(id: string) {
			const { userInfo } = useAuthStore();
			const formData = new FormData();
			formData.append("Uid", userInfo.userId);
			formData.append("KBID", id);
			const results = await fetchDeleteKnowledgeBase(formData);

			if (results.error) return false;

			const fIndex = this.knowledgeBaseList.findIndex(
				(item) => item.KBID === id
			);

			if (fIndex !== -1) {
				this.knowledgeBaseList.splice(fIndex, 1);
				localStg.set("knowledgeBaseList", this.knowledgeBaseList);
				return true;
			}
			return false;
		},
		// 预览知识
		async previewsK(params: any) {
			const { userInfo } = useAuthStore();
			let resObj = {} as Knowledge.Previews
			const formData = new FormData();
			formData.append("Uid", userInfo.userId);
			formData.append("FileName", params.FileName);
			formData.append("Type", params.Type);
			formData.append("Kconfig", JSON.stringify(params.Kconfig));
			const results = await fetchPreviewsKnowledge(formData);

			if (results.error) return false;

			if (results.data) {
				resObj = results.data as Knowledge.Previews
			}

			return resObj
		},
		async removePreviewsK(params: any) {
			const { userInfo } = useAuthStore();
			const formData = new FormData();
			formData.append("Uid", userInfo.userId);
			formData.append("FileName", params.FileName);
			const results = await fetchPreviewsRemoveKnowledge(formData);

			if (results.error) return false;

			return true;
		},
		// 添加知识
		async addK(params: any) {
			const { userInfo } = useAuthStore();
			const formData = new FormData();
			formData.append("KBID", params.KBID);
			formData.append("Uid", userInfo.userId);
			formData.append("FileName", params.FileName);
			formData.append("Type", params.Type);
			formData.append("Kconfig", JSON.stringify(params.Kconfig));
			const results = await fetchAddKnowledge(formData);

			if (results.error) return false;

			this.knowledgeBaseList.forEach(item => {
				if (item.KBID === params.KBID) {
					const obj = results.data as Knowledge.K
					if (!item.data) {
						item.data = []
					}
					item.data.unshift(obj)
				}
			})
			localStg.set("knowledgeBaseList", this.knowledgeBaseList);
			return true
		},
		// 删除知识
		async delK(kbid: string, kid: string) {
			const { userInfo } = useAuthStore();
			const formData = new FormData();
			formData.append("Uid", userInfo.userId);
			formData.append("KBID", kbid);
			formData.append("KID", kid);
			const results = await fetchDeleteKnowledge(formData);

			if (results.error) return false;

			let status = false

			this.knowledgeBaseList.forEach(item => {
				if (item.KBID === kbid) {
					const data = item.data as Knowledge.K[]
					const fIndex = data.findIndex(i => i.KID === kid)
					if (fIndex !== -1) {
						status = true
						data.splice(fIndex, 1)
					}
				}
			})

			if (status) {
				localStg.set("knowledgeBaseList", this.knowledgeBaseList);
				return true;
			}
			return false;
		},
		// 获取知识详情
		async getKDetails(params: any) {
			const { userInfo } = useAuthStore();
			const formData = new FormData();
			let resObj = {
				total: 0,
				chunks_info: [] as Knowledge.Chunks_info[]
			};
			formData.append("Uid", userInfo.userId);
			formData.append("KBID", params.KBID);
			formData.append("KID", params.KID);
			formData.append("Limit", params.Limit);
			formData.append("Offset", params.Offset);
			const	results = await fetchGetKnowledge(formData);
			if (results.error) return resObj;

			if (results.data) {
				resObj = results.data as Knowledge.KDetails
			}
			return resObj;
		},
		/** 去除知识库相关缓存 */
		clearKnowledgeStorage() {
			this.knowledgeBaseList = [];
			localStg.remove('knowledgeBaseList');
		}
	},
});
