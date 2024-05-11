import { defineStore } from "pinia";
import { nanoid } from "nanoid";
import {
	fetchGetKnowledgeBase,
	fetchAddKnowledgeBase,
	fetchUpdateKnowledgeBase,
	fetchDeleteKnowledgeBase,
	fetchAddKnowledge
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

			const obj = results.data as Knowledge.Base;
			this.knowledgeBaseList.unshift(obj);
			localStg.set("knowledgeBaseList", this.knowledgeBaseList);
			return true;
		},
		// 更新知识库
		async updateKB(params: any) {
			console.log("params----", params);
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

			console.log('results-----fasf', results)

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
			formData.append("KBID", id);
			formData.append("Uid", userInfo.userId);
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
		// 添加知识
		async addK(params: any) {
			const { userInfo } = useAuthStore();
			const obj = {
				KID: nanoid(),
				KName: "新建文本文档.txt",
				KType: "1",
				KConfig: null,
				KCreateTime: "2024-05-02 14:37:10",
				KUpdateTime: "2024-05-02 14:37:10",
			};
			let results
			try {
				const formData = new FormData();
				formData.append("KBID", params.KBID);
				formData.append("Uid", userInfo.userId);
				formData.append("FileName", params.FileName);
				formData.append("Type", params.Type);
				formData.append("Kconfig", JSON.stringify(params.Kconfig));
				results = await fetchAddKnowledge(formData);
			} catch (error) {}

			// if (!results || (results && results.error)) return false;

			this.knowledgeBaseList.forEach(item => {
				if (item.KBID === params.KBID) {
					item.data.push(obj)
				}
			})

			return true

		},
		/** 去除知识库相关缓存 */
		clearKnowledgeStorage() {
			this.knowledgeBaseList = [];
			localStg.remove('knowledgeBaseList');
		}
	},
});
