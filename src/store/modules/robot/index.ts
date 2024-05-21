import { defineStore } from "pinia";
import { nanoid } from "nanoid";
import moment from "moment";
import querystring from 'querystring';
import qs from 'qs';
import {
	getChatbotList,
	getActiveChatbotId,
	getChatbotRecords,
	ChatbotResData,
} from "./helpers";
import { localStg } from "@/utils";
import {
	fetchGetScreenList,
	fetchAddScreen,
	fetchDeleteScreen,
	fetchUpdateScreen,
	fetchGetDhQuery,
	fetchGetKbqaQuery
} from "@/service";
import { useAuthStore } from "../auth";
import { EventBus } from "@/utils";

type RecordParamsType = {
	value: string;
};

type RightType = "sql" | "chart";

interface RobotState {
	/* 会话列表 */
	chatbotList: Robot.Chatbot[];
	/* 选中的聊天窗口id */
	chatbotId: string | undefined;
	/* 会话记录 */
	chatbotRecords: Robot.Records[];
	/* 选中的会话记录id */
	chatbotRecordId: string;
	showBackBom: Boolean;
	showSettings: Boolean;
	showCreate: Boolean;
	/** 展示右侧详情区域 */
	showRightContent: Boolean;
	/** 展示右侧详情内容类型 */
	chatbotRightContentType: RightType;
}

export const useRobotStore = defineStore("robot-store", {
	state: (): RobotState => ({
		chatbotList: getChatbotList(),
		chatbotId: getActiveChatbotId(),
		chatbotRecords: getChatbotRecords(),
		showBackBom: false,
		showSettings: false,
		showCreate: false, // 是否开启新会话
		showRightContent: false,
		chatbotRecordId: "",
		chatbotRightContentType: "chart",
	}),
	getters: {
		chatbotItem(state) {
			let list = state.chatbotList;
			let id = state.chatbotId;
			const chatbotItem: Robot.Chatbot = list.find(
				(item: Robot.Chatbot) => item.ScreenId === id
			) || ({} as Robot.Chatbot);
			return chatbotItem || {};
		},
		currentChatbotRecords(state) {
			let list = state.chatbotRecords;
			let id = state.chatbotId;
			const item: Robot.Records = list.find(
				(item: Robot.Records) => item.id === id
			) || ({} as Robot.Records);
			return item.list || [];
		},
		chatbotSettings(state) {
			let list = state.chatbotList;
			let id = state.chatbotId;
			const chatbotItem: Robot.Chatbot = list.find((item: Robot.Chatbot) => item.ScreenId === id) || ({} as Robot.Chatbot);

			return chatbotItem.settings || {};
		},
		// 判断是否分组
		checkGroup() {
			let res = false;
			const settings = this.chatbotSettings;
			const groupList = settings.ScreenQAConfig?.GroupList || [];

			const check = groupList.some(
				(item: Robot.GroupList) => item.checked === 1
			);

			if (check) {
				res = true;
			}

			return res;
		},
	},
	actions: {
		async getScreenList() {
			const { userInfo } = useAuthStore();
			this.setChatbotId("");
			let results;
			try {
				const formData = new FormData();
				formData.append("Uid", userInfo.userId);
				results = await fetchGetScreenList(formData);
			} catch (error) {
				console.log("error", error);
			}

			if (!results) return;

			if (!Array.isArray(results.data)) return;

			let list = (results.data as Robot.Chatbot[]) || [];

			list = list.map((item: Robot.Chatbot) => {
				item.screenName = item?.settings?.ScreenBasicConfig?.ScreenName || "";
				return item;
			}) as [];

			this.chatbotList = list;
			localStg.set("chatbotList", list);
		},
		async addChatbot(params: any) {
			const { userInfo } = useAuthStore();
			const formData = new FormData();
			formData.append("Uid", userInfo.userId);
			formData.append("ScreenName", params.ScreenName);
			formData.append("ScreenDesc", params.ScreenDesc);
			formData.append("ScreenType", params.ScreenType);

			switch (params.ScreenType) {
				case 1:
					formData.append("ConfigId", params.ConfigId);
					formData.append("ConfigName", params.ConfigName);
					formData.append("GroupList", JSON.stringify(params.GroupList));
					break;
				case 2:
					formData.append("SimilarityThreshold", "0");
					formData.append("RelevantHits", "4");
					formData.append("KBIDS", "[]");
					break;
			}

			const results = await fetchAddScreen(formData);

			if (results.error) return false;

			const resData: any = results.data;

			if (!resData) return false;
			resData.screenName = params.ScreenName;

			this.chatbotList = [resData, ...this.chatbotList];
			this.chatbotId = resData.ScreenId;
			const welcomeObj = {
				id: nanoid(),
				screenType: params.ScreenType, // 场景类型
				userType: 2, // 1 用户 2 机器人
				value: "", // 输入的文本内容
				datetime: moment().format("YYYY/MM/DD HH:mm:ss"), // 日期时间
				isWelcome: true,
				replyType: 0,
				state: 1,
				type: 0,
				loaded: true,
				loading: false,
				data: {} as Robot.RecordData,
			};
			this.chatbotRecords.push({
				id: resData.ScreenId || "",
				list: [welcomeObj],
			});
			localStg.set("chatbotList", this.chatbotList);
			localStg.set("chatbotId", resData.ScreenId || "");
			localStg.set("chatbotRecords", this.chatbotRecords);

			return true;
		},
		async updateChatbot(params: any) {
			const { userInfo } = useAuthStore();

			const formData = new FormData();
			formData.append("Uid", userInfo.userId);
			formData.append("ScreenId", params.ScreenId);
			formData.append("ScreenName", params.ScreenName);
			formData.append("ScreenDesc", params.ScreenDesc);
			formData.append("ScreenType", params.ScreenType);

			switch (params.ScreenType) {
				case 1:
					formData.append("ConfigId", params.ConfigId);
					formData.append("ConfigName", params.ConfigName);
					formData.append("GroupList", JSON.stringify(params.GroupList));
					break;
				case 2:
					formData.append("SimilarityThreshold", params.SimilarityThreshold);
					formData.append("RelevantHits", params.RelevantHits);
					formData.append("KBIDS", JSON.stringify(params.KBIDS));
					break;
			}

			try {
				const results = await fetchUpdateScreen(formData);

				if (results.error) return false;

				const resData: ChatbotResData = (results.data || {}) as ChatbotResData;

				if (!resData.ScreenId) return false;

				const chatbotItem: Robot.Chatbot =
					this.chatbotList.find((item) => item.ScreenId === params.ScreenId) ||
					({} as Robot.Chatbot);

				chatbotItem.screenName = resData.ScreenName;
				chatbotItem.settings.ScreenQAConfig = resData.ScreenQAConfig;
				chatbotItem.UpdateTime = resData.UpdateTime;
				chatbotItem.settings.ScreenBasicConfig.ScreenName = resData.ScreenName;
				chatbotItem.settings.ScreenBasicConfig.ScreenDesc = resData.ScreenDesc;

				localStg.set("chatbotList", this.chatbotList);
			} catch (error) {
				console.log("error----", error);
				return false;
			}
			return true;
		},
		async delChatbot(id: string = "") {
			const { userInfo } = useAuthStore();
			const formData = new FormData();
			formData.append("Uid", userInfo.userId);
			formData.append("ScreenId", id);

			const results = await fetchDeleteScreen(formData);

			if (results.error) return false;

			const fIndex = this.chatbotList.findIndex((item) => item.ScreenId === id);
			const len = this.chatbotList.length;
			if (fIndex !== -1) {
				if (len === 1) {
					this.setChatbotId("");
				} else if (len > 1) {
					if (id === this.chatbotId) {
						if (fIndex === 0) {
							const item = this.chatbotList[fIndex + 1];
							this.setChatbotId(item.ScreenId);
						} else if (len === fIndex + 1) {
							const item = this.chatbotList[fIndex - 1];
							this.setChatbotId(item.ScreenId);
						} else {
							const item = this.chatbotList[fIndex - 1];
							this.setChatbotId(item.ScreenId);
						}
					}
				}
				this.chatbotList.splice(fIndex, 1);
				const fIndex2 = this.chatbotRecords.findIndex((item) => item.id === id);
				if (fIndex2 !== -1) {
					this.chatbotRecords.splice(fIndex2, 1);
				}
				localStg.set("chatbotList", this.chatbotList);
				localStg.set("chatbotRecords", this.chatbotRecords);

				return true;
			}
		},
		setChatbotId(id: string = "") {
			this.chatbotId = id;
			localStg.set("chatbotId", id);
		},
		/* 添加一条聊天记录*/
		async addChatbotRecord(params: RecordParamsType) {
			const { userInfo } = useAuthStore();
			const id1 = nanoid();
			const id2 = nanoid();
			const datetime = moment().format("YYYY/MM/DD HH:mm:ss");
			const ScreenType = this.chatbotItem?.ScreenType

			const obj1 = {
				id: id1,
				screenType: Number(ScreenType),
				userType: 1, // 1 用户 2 机器人
				value: params.value, // 输入的文本内容
				type: 1, // 1 文本
				datetime, // 日期时间
				state: 1, // 状态
				loaded: true,
				loading: false,
				data: {} as Robot.RecordData,
			};
			const obj2 = {
				id: id2,
				screenType: Number(ScreenType),
				userType: 2, // 1 用户 2 机器人
				value: "", // 输入的文本内容
				type: 1, // 1 文本
				datetime, // 日期时间
				state: 1, // 状态
				loaded: false,
				loading: true,
				data: {} as Robot.RecordData,
			};

			const fIndex = this.chatbotRecords.findIndex(
				(item) => item.id === this.chatbotId
			);
			if (fIndex === -1) {
				this.chatbotRecords.push({
					id: this.chatbotId || "",
					list: [],
				});
			}
			const recordObj = this.chatbotRecords.find(
				(item: Robot.Records) => item.id === this.chatbotId
			);

			recordObj?.list.push(obj1, obj2);

			let record1: Robot.Record = {} as Robot.Record;
			let record2: Robot.Record = {} as Robot.Record;
			recordObj?.list.forEach((record) => {
				if (record.id === id1) {
					record1 = record as Robot.Record;
				} else if (record.id === id2) {
					record2 = record as Robot.Record;
				}
			});

			EventBus.emit("chatbot-content-scroll-to", {
				type: "bom",
				behavior: "smooth",
			});

			const groupList = this.chatbotItem?.settings?.ScreenQAConfig?.GroupList || []

			const formData = new FormData();
			formData.append("UserId", userInfo.userId);
			formData.append("ScreenId", this.chatbotId + "");
			formData.append("Query", params.value);
			formData.append("ScreenType", ScreenType);

			// 数据助手问答
			if (Number(ScreenType) === 1) {
				formData.append("ByGroup", groupList.length ? '1' : '0');
			}

			const results = Number(ScreenType) === 1 ? await fetchGetDhQuery(formData) : await fetchGetKbqaQuery(formData);

			record2.loading = false;
			record2.loaded = true;

			if (results.error) {
				const code = results.error.code;
				record2.replyType = 1;
				if (code === 400) {
					record2.replyType = 2;
				}
				record2.isTipsReply = true;
				localStg.set("chatbotRecords", this.chatbotRecords);
				return false;
			}

			const resData: any = results.data

			if (!resData) {
				record2.isTipsReply = true;
				record2.replyType = 2;
				localStg.set("chatbotRecords", this.chatbotRecords);
				return false;
			}

			let sourceData = [];
			let sourceType = {};

			if (Number(ScreenType) === 1) {
				sourceData = resData?.sourceData || []
				sourceType = resData?.sourceType || {}
				record2.isDhReply = true
				if (sourceData.length === 0) {
					record2.replyType = 1;
					record2.isTipsReply = true;
					localStg.set("chatbotRecords", this.chatbotRecords);
					return false;
				}

				record2.data = {
					sourceData,
					sourceType,
					sql: resData?.sql || "",
					spss_reasoning: resData?.spss_reasoning || "",
				};
			} else if (Number(ScreenType) === 2) {
				record2.isKbReply = true
				record2.data = {
					answer: resData?.answer,
					chunks: resData?.chunks || [],
				};
			}

			localStg.set("chatbotRecords", this.chatbotRecords);
			return true;
		},
		// 删除聊天记录
		delChatbotRecord(rid: string) {
			const recordObj = this.chatbotRecords.find(
				(item: Robot.Records) => item.id === this.chatbotId
			);
			const list: Robot.Record[] = recordObj?.list as Robot.Record[];
			const fIndex = list.findIndex((i) => i.id === rid);
			if (fIndex !== -1) {
				list[fIndex].isDelete = true;
			}

			// this.chatbotList = this.chatbotList.map((item) => {
			// 	if (item.ScreenId === id) {
			// 		const fIndex = item.records && item.records.findIndex(i => i.id === rid) || -1
			// 		if (fIndex !== -1) {
			// 			const records = item.records || []
			// 			records[fIndex].isDelete = true
			// 		}
			// 	}
			// 	return item
			// })
			localStg.set("chatbotRecords", this.chatbotRecords);
		},
		// 清空聊天记录
		clearChatbotRecord() {
			// let id = this.chatbotId;
			// this.chatbotList = this.chatbotList.map((item) => {
			// 	if (item.ScreenId === id) {
			// 		item.records = []
			// 	}
			// 	return item
			// })

			this.chatbotRecords.forEach((item: Robot.Records) => {
				if (item.id === this.chatbotId) {
					item.list = [];
				}
			});

			localStg.set("chatbotRecords", this.chatbotRecords);
		},
		setChatbotSettings(data: Robot.Settings) {
			let id = this.chatbotId;
			this.chatbotList = this.chatbotList.map((item) => {
				if (item.ScreenId === id) {
					item.settings = Object.assign({}, item.settings, data);
				}
				return item;
			});
			localStg.set("chatbotList", this.chatbotList);
		},
		/* 校验是否已配置数据源信息 */
		checkChatbotSettings() {
			const auth = useAuthStore();
			const settings = this.chatbotSettings;
			const screenQAConfig = settings.ScreenQAConfig || {};

			// if (this.chatbotId && screenQAConfig.ConfigId) {
			// 	const list = auth.wdConfigInfo
			// 	const index = list.findIndex(i => i.ConfigId === screenQAConfig.ConfigId)
			// 	if (index === -1) {
			// 		this.setShowSettings(true)
			// 		return false
			// 	}
			// }

			if (this.chatbotId && !screenQAConfig.ConfigId) {
				this.setShowSettings(true);
				return false;
			} else {
				this.setShowSettings(false);
			}
			return true;
		},
		setShowBackBom(status: boolean) {
			this.showBackBom = status;
		},
		setShowSettings(status: boolean) {
			this.showSettings = status;
		},
		setShowCreate(status: boolean) {
			this.showCreate = status;
		},
	},
});
