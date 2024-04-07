import { defineStore } from "pinia";
import { nanoid } from "nanoid";
import moment from 'moment';
import { getChatbotList, getActiveChatbotId, getChatbotRecords } from "./helpers";
import { localStg } from "@/utils";
import { fetchGetScreenList, fetchAddScreen, fetchDeleteScreen, fetchUpdateScreen, fetchGetWdQuery } from "@/service";
import { useAuthStore } from '../auth';
import { toRaw } from 'vue';
import { EventBus } from '@/utils';

type updateType = 'default' | 'settings' | 'basicConfig' | 'sourceConfig'

type RecordParamsType = {
	value: string
}

type RightType = 'sql' | 'chart'

interface RobotState {
	/* 会话列表 */
	chatbotList: Robot.ChatbotItemType[],
	/* 选中的聊天窗口id */
	chatbotId: string | undefined,
	/* 会话记录 */
	chatbotRecords: Robot.ChatbotRecordsType[],
	/* 选中的会话记录id */
	chatbotRecordId: string,
	showBackBom: Boolean,
	showSettings: Boolean,
	/** 展示右侧详情区域 */
	showRightContent: Boolean,
	/** 展示右侧详情内容类型 */
	chatbotRightContentType: RightType
}

export const useRobotStore = defineStore("robot-store", {
	state: (): RobotState => ({
		chatbotList: getChatbotList(),
		chatbotId: getActiveChatbotId(),
		chatbotRecords: getChatbotRecords(),
		showBackBom: false,
		showSettings: false,
		showRightContent: false,
		chatbotRecordId: '',
		chatbotRightContentType: 'chart'
	}),
	getters: {
		chatbotItem(state) {
			let list = state.chatbotList;
			let id = state.chatbotId;
			const chatbotItem: any = list.find((item) => item.ScreenId === id) || {}
			return chatbotItem
		},
		currentChatbotRecords(state) {
			let list = state.chatbotRecords;
			let id = state.chatbotId;
			const item: any = list.find((item) => item.id === id) || {}
			return item?.list || []
		},
		chatbotSettings(state) {
			let list = state.chatbotList;
			let id = state.chatbotId;
			const chatbotItem: any = list.find((item) => item.ScreenId === id) || {}
			return chatbotItem?.settings || {}
		},
		// 判断是否分组
		checkGroup() {
			let res = false
			const settings = this.chatbotSettings
			const groupList = settings.ScreenQAConfig?.GroupList || []

			const check = groupList.some((item: any) => item.checked === 1)

			if (check) {
				res = true
			}

			return res
		}
	},
	actions: {
		async getScreenList() {
			const { userInfo } = useAuthStore()
			this.setChatbotId("")
			let results
			try {
				const formData = new FormData();
				formData.append("Uid", userInfo.userId);
				results = await fetchGetScreenList(formData);
			} catch (error) {
				console.log('error', error)
			}

			if (!results) return

			if (!Array.isArray(results.data)) return

			let list = results.data as Robot.ChatbotItemType[] || []

			list = list.map((item: any) => {
				item.screenName = item?.settings?.ScreenBasicConfig?.ScreenName || ""
				return item
			}) as []

			this.chatbotList = list
			localStg.set('chatbotList', list)
		},
		async addChatbot(data: Robot.UpdateChatbotItemType) {
			const { userInfo } = useAuthStore()
			let results
			const formData = new FormData()
			formData.append("Uid", userInfo.userId)
			formData.append("ScreenName", data.ScreenName || "")
			formData.append("ScreenDesc", data.ScreenDesc || "")
			formData.append("ConfigId", data.ConfigId || "")
			formData.append("ConfigName", data.ConfigName || "")
			formData.append("GroupList", JSON.stringify(data.GroupList))
			try {
				results = await fetchAddScreen(formData)
			} catch (error) {
				console.log('error', error)
			}

			if (!results) return

			const resData: any = results.data

			if (!resData) return
			resData.screenName = data.ScreenName

			this.chatbotList = [resData, ...this.chatbotList];
			this.chatbotId = resData.ScreenId;
			this.chatbotRecords.push({
				id: resData.ScreenId || "",
				list: []
			})
			localStg.set("chatbotList", this.chatbotList);
			localStg.set("chatbotId", resData.ScreenId || "");
			localStg.set("chatbotRecords", this.chatbotRecords);
		},
		async updateChatbot(id: string = "", data?: Robot.UpdateChatbotItemType, type: updateType = 'default') { // type default 更新所有 settings 更新settings
			const { userInfo } = useAuthStore()
			let chatbotList = toRaw(this.chatbotList)
			let results
			let chatbotItem = chatbotList.find(item => item.ScreenId === id) || {}
			let settings = chatbotItem.settings || {}
			let screenBasicConfig = settings.ScreenBasicConfig || {}
			let screenQAConfig = settings.ScreenQAConfig || {}
			if (type === 'default') {
				chatbotItem = { ...chatbotItem, ...data }
			} else if (type === 'settings') {
				settings = { ...settings, ...data }
				chatbotItem = { ...chatbotItem, settings }
			} else if (type === 'basicConfig') {
				screenBasicConfig = { ...screenBasicConfig, ...data }
				settings = { ...settings, ScreenBasicConfig: screenBasicConfig }
				chatbotItem = { ...chatbotItem, settings }
			} else if (type === 'sourceConfig') {
				screenQAConfig = { ...screenQAConfig, ...data }
				settings = { ...settings, ScreenQAConfig: screenQAConfig }
				chatbotItem = { ...chatbotItem, settings }
			}

			const newSettings = chatbotItem.settings || {}
			const newScreenBasicConfig = newSettings.ScreenBasicConfig || {}
			const newScreenQAConfig = newSettings.ScreenQAConfig || {}

			const formData = new FormData()
			formData.append("Uid", userInfo.userId)
			formData.append("ScreenId", id || "")
			formData.append("ScreenName", newScreenBasicConfig.ScreenName || "")
			formData.append("ScreenDesc", newScreenBasicConfig.ScreenDesc || "")
			formData.append("ConfigId", newScreenQAConfig.ConfigId || "")
			formData.append("ConfigName", newScreenQAConfig.ConfigName || "")
			formData.append("GroupList", JSON.stringify(newScreenQAConfig.GroupList) || "[]")
			try {
				results = await fetchUpdateScreen(formData)
			} catch (error) {
				console.log('error', error)
			}

			if (!results) return false

			const resData = results.data

			if (!resData) return false

			this.chatbotList = chatbotList.map((item) => {
				if (id === item.ScreenId) {
					item = chatbotItem
				}
				return item
			})
			localStg.set("chatbotList", this.chatbotList);
			return true
		},
		async delChatbot(id: string = "") {
			const { userInfo } = useAuthStore()
			let results
			const formData = new FormData()
			formData.append("Uid", userInfo.userId)
			formData.append("ScreenId", id)
			try {
				results = await fetchDeleteScreen(formData)
			} catch (error) {
				console.log('error', error)
			}

			if (!results) return

			const data: any = results.data || {}

			if (!data.isDel) return window.$message?.error("删除失败")

			const fIndex = this.chatbotList.findIndex(item => item.ScreenId === id)
			const len = this.chatbotList.length
			if (fIndex !== -1) {
				if (len === 1) {
					this.setChatbotId("")
				} else if (len > 1) {
					if (id === this.chatbotId) {
						if (fIndex === 0) {
							const item = this.chatbotList[fIndex + 1]
							this.setChatbotId(item.ScreenId)
						} else if (len === fIndex + 1) {
							const item = this.chatbotList[fIndex - 1]
							this.setChatbotId(item.ScreenId)
						} else {
							const item = this.chatbotList[fIndex - 1]
							this.setChatbotId(item.ScreenId)
						}
					}
				}
				this.chatbotList.splice(fIndex, 1);
				const fIndex2 = this.chatbotRecords.findIndex((item) => item.id === id)
				if (fIndex2 !== -1) {
					this.chatbotRecords.splice(fIndex2, 1)
				}
				localStg.set("chatbotList", this.chatbotList);
				localStg.set("chatbotRecords", this.chatbotRecords);
				this.checkChatbotSettings();
			}
		},
		setChatbotId(id: string = "") {
			this.chatbotId = id;
			localStg.set("chatbotId", id);
		},
		addRobotReplyRecord(params: RecordParamsType, type: number = 1) {
			const obj = {
				id: nanoid(),
				userType: 2, // 1 用户 2 机器人
				value: params.value, // 输入的文本内容
				type: 1, // 1 文本
				datetime: moment().format('YYYY/MM/DD HH:mm:ss'), // 日期时间
				state: -2, // 状态
				loaded: true,
				loading: false,
				data: {} as Robot.ChatbotRecordDataType
			};
			this.chatbotRecords.forEach(item => {
				if (item.id === this.chatbotId) {
					if (!item.list) {
						item.list = []
					}
					item.list.push(obj)
				}
			})
		},
		/* 添加一条聊天记录*/
		async addChatbotRecord(params: RecordParamsType) {
			const { userInfo } = useAuthStore()
			let results
			const id1 = nanoid();
			const id2 = nanoid();
			const datetime = moment().format('YYYY/MM/DD HH:mm:ss');
			const obj1 = {
				id: id1,
				userType: 1, // 1 用户 2 机器人
				value: params.value, // 输入的文本内容
				type: 1, // 1 文本
				datetime, // 日期时间
				state: 1, // 状态
				loaded: true,
				data: {} as Robot.ChatbotRecordDataType
			};
			const obj2 = {
				id: id2,
				userType: 2, // 1 用户 2 机器人
				value: "", // 输入的文本内容
				type: 1, // 1 文本
				datetime, // 日期时间
				state: 1, // 状态
				loaded: false,
				loading: true,
				data: {} as Robot.ChatbotRecordDataType
			};

			const fIndex = this.chatbotRecords.findIndex((item) => item.id === this.chatbotId)
			if (fIndex === -1) {
				this.chatbotRecords.push({
					id: this.chatbotId || "",
					list: []
				})
			}
			const recordObj = this.chatbotRecords.find((item: Robot.ChatbotRecordsType) => item.id === this.chatbotId)

			recordObj?.list.push(obj1, obj2)
			// this.chatbotList = this.chatbotList.map((item) => {
			// 	if (item.ScreenId === this.chatbotId) {
			// 		let records = item.records || []
			// 		item.records = [...records, obj1, obj2]
			// 	}
			// 	return item
			// })

			// let records: Robot.ChatbotRecordType[] = []
			// this.chatbotList.forEach((item) => {
			// 	if (item.ScreenId === this.chatbotId) {
			// 		records = item.records as Robot.ChatbotRecordType[]
			// 	}
			// })

			let record1: Robot.ChatbotRecordType = {} as Robot.ChatbotRecordType
			let record2: Robot.ChatbotRecordType = {} as Robot.ChatbotRecordType
			recordObj?.list.forEach((record) => {
				if (record.id === id1) {
					record1 = record as Robot.ChatbotRecordType
				} else if (record.id === id2) {
					record2 = record as Robot.ChatbotRecordType
				}
			})

			EventBus.emit('chatbot-content-scroll-to', { type: 'bom', behavior: 'smooth' })

			const formData = new FormData()
			formData.append("UserId", userInfo.userId)
			formData.append("ScreenId", this.chatbotId || "")
			formData.append("Query", params.value || "")
			formData.append("ByGroup", "1")
			try {
				results = await fetchGetWdQuery(formData)
			} catch (err) {
				console.log('error', err)
				record2.state = -2;
				record2.value = "";
			} finally {
				record2.loading = false;
				record2.loaded = true;
			}

			if (!results) {
				record2.state = -2;
				record2.value = "";
				localStg.set("chatbotList", this.chatbotList);
				return false;
			}

			const resData = results.data as Robot.ChatbotRecordDataType
			const resError = results.error

			if (resError && resError.code === 400) {
				record2.type = 2;
				record2.state = -2;
				record2.value = "";
				localStg.set("chatbotRecords", this.chatbotRecords);
				return false
			}

			if (!resData) {
				record2.type = 1;
				record2.state = -2;
				record2.value = "";
				localStg.set("chatbotRecords", this.chatbotRecords);
				return false
			}

			const sourceData = resData?.sourceData || []
			const sourceType = resData?.sourceType || {}

			record2.type = 2;
			record2.data = {
				sourceData,
				sourceType,
				sql: resData?.sql || '',
				spss_reasoning: resData?.spss_reasoning || ''
			}

			if (sourceData.length === 0) {
				record2.type = 1;
				record2.state = -2;
				record2.value = "";
			}

			localStg.set("chatbotRecords", this.chatbotRecords);
			return true;
		},
		// 更新聊天记录
		updateChatbotRecord(rid: string, data: Robot.ChatbotRecordType) {
			const recordObj = this.chatbotRecords.find((item: Robot.ChatbotRecordsType) => item.id === this.chatbotId);
			const list: Robot.ChatbotRecordType[] = recordObj?.list as Robot.ChatbotRecordType[];
			list.forEach(item => {
				if (item.id === rid) {
					item = Object.assign(item, data)
				}
			})
			// this.chatbotList = this.chatbotList.map((item) => {
			// 	if (item.ScreenId === id) {
			// 		let records = item.records || []
			// 		records.forEach(sItem => {
			// 			if (sItem.id === rid) {
			// 				sItem = Object.assign(sItem, data)
			// 			}
			// 		})
			// 	}
			// 	return item
			// })
			localStg.set("chatbotRecords", this.chatbotRecords);
		},
		// 删除聊天记录
		delChatbotRecord(rid: string) {
			const recordObj = this.chatbotRecords.find((item: Robot.ChatbotRecordsType) => item.id === this.chatbotId);
			const list: Robot.ChatbotRecordType[] = recordObj?.list as Robot.ChatbotRecordType[];
			const fIndex = list.findIndex(i => i.id === rid) || -1;
			if (fIndex !== -1) {
				list[fIndex].isDelete = true
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

			this.chatbotRecords.forEach((item: Robot.ChatbotRecordsType) => {
				if (item.id === this.chatbotId) {
					item.list = []
				}
			})

			localStg.set("chatbotRecords", this.chatbotRecords);

		},
		setChatbotSettings(data: Robot.ChatbotSettingsType) {
			let id = this.chatbotId;
			this.chatbotList = this.chatbotList.map((item) => {
				if (item.ScreenId === id) {
					item.settings = Object.assign({}, item.settings, data)
				}
				return item
			})
			localStg.set("chatbotList", this.chatbotList);
		},
		/* 校验是否已配置数据源信息 */
		checkChatbotSettings() {
			const auth = useAuthStore();
			const settings = this.chatbotSettings
			const screenQAConfig = settings.ScreenQAConfig || {}

			// if (this.chatbotId && screenQAConfig.ConfigId) {
			// 	const list = auth.wdConfigInfo
			// 	const index = list.findIndex(i => i.ConfigId === screenQAConfig.ConfigId)
			// 	if (index === -1) {
			// 		this.setShowSettings(true)
			// 		return false
			// 	}
			// }

			if (this.chatbotId && !screenQAConfig.ConfigId) {
				this.setShowSettings(true)
				return false
			} else {
				this.setShowSettings(false)
			}
			return true
		},
		setShowBackBom(status: boolean) {
			this.showBackBom = status
		},
		setShowSettings(status: boolean) {
			this.showSettings = status
		}
	}
})
