<template>
	<div class="setting-box">
		<div class="inner-content">
			<n-tabs
				class="s-tabs"
				size="large"
				animated
				justify-content="center"
				pane-wrapper-style="margin: 0 -4px"
				pane-style="padding-left: 4px; padding-right: 4px; box-sizing: border-box;"
				v-model:value="tabIndex"
			>
				<n-tab-pane name="1" tab="基础配置">
					<n-form ref="formRef1" :model="form" :rules="rules">
						<n-form-item-row
							label="会话名称"
							style="padding: 0 16px"
							path="name"
						>
							<n-input
								v-model:value="form.name"
								type="text"
								:maxlength="20"
								placeholder="请输入会话名称"
							/>
						</n-form-item-row>
						<n-form-item-row label="描述" style="padding: 0 16px">
							<n-input
								v-model:value="form.desc"
								placeholder="请输入一段描述"
								type="textarea"
								:maxlength="200"
								:autosize="{
									minRows: 3,
									maxRows: 5,
								}"
							/>
						</n-form-item-row>
					</n-form>
					<!-- <div class="tabs-footer-btns">
						<n-button type="primary" :loading="submitLoading" block secondary strong @click="saveClick">
							保存
						</n-button>
						<n-button
							v-if="!isNotConfig"
							style="margin-top: 10px"
							type="default"
							block
							secondary
							strong
							@click.stop="cancelClick"
						>
							关闭
						</n-button>
					</div> -->
				</n-tab-pane>
				<n-tab-pane name="2" tab="高级配置">
					<n-form
						ref="formRef2"
						:model="form"
						:rules="rules"
						class="tabs-inner-form"
					>
						<div v-if="Number(ScreenType) === 1">
							<n-form-item-row
								style="padding: 0 16px"
								label="选择数据源"
								path="configId"
							>
								<n-select
									:value="form.configId || undefined"
									placeholder="请选择数据源"
									:options="sourceOpts"
									:on-update:value="(value) => selectSourceChange(value)"
								/>
							</n-form-item-row>
							<n-divider dashed style="padding: 0 16px; margin-top: 0" />
							<div class="tips-box">
								<div class="b-left">
									<p class="mr-10">添加分组可以让您的数据匹配更精确哦!</p>
									<n-button
										tertiary
										type="info"
										size="tiny"
										:disabled="form.groupList.length >= 3"
										@click="addGroupClick"
										>添加分组</n-button
									>
								</div>
								<n-switch
									v-if="form.groupList.length"
									v-model:value="isSpread"
									size="small"
								>
									<template #checked> 展开 </template>
									<template #unchecked> 收起 </template>
								</n-switch>
							</div>
							<n-collapse-transition :show="isSpread">
								<n-scrollbar
									style="max-height: 300px; padding: 0 16px; margin-bottom: 24px"
								>
									<n-form-item
										class="form-item-group"
										:show-feedback="false"
										v-for="(group, groupIndex) in form.groupList"
										:key="group.id"
										@click.stop.prevent
									>
										<template #label>
											<div class="f-label">
												<div class="f-label-left">
													<n-checkbox
														v-model:checked="group.checked"
														class="mr-10"
														size="large"
													/>
													<span class="mr-10"
														>分组{{ Number(groupIndex) + 1 }}</span
													>
													<!-- <n-button tertiary type="info" size="tiny" >
														添加子分组
													</n-button> -->
												</div>
												<div class="f-label-right">
													<n-popconfirm
														positive-text="删除"
														@positive-click="() => delGroupClick(groupIndex)"
													>
														<template #trigger>
															<n-button size="small" tertiary circle quaternary>
																<template #icon>
																	<n-icon :size="16">
																		<TrashIcon />
																	</n-icon>
																</template>
															</n-button>
														</template>
														<span style="white-space: nowrap">删除该分组？</span>
													</n-popconfirm>
												</div>
											</div>
											<n-divider
												style="padding: 0; margin-top: 5px; margin-bottom: 0"
											/>
										</template>
										<div class="group-list">
											<div class="group-item">
												<n-dynamic-input
													v-model:value="group.children"
													item-style="margin-bottom: 0;"
													#="{ index }"
													:min="2"
													:max="3"
													:on-create="addChildGroup"
												>
													<div style="display: flex">
														<n-form-item
															ignore-path-change
															:show-label="false"
															:path="`groupList[${groupIndex}].children[${index}].sheetName`"
															:rule="rules.sheetName"
														>
															<n-select
																:value="
																	group.children[index].sheetName || undefined
																"
																placeholder="请选择"
																:options="group.sheets"
																clearable
																style="width: 228px"
																:on-update:show="
																	(show) =>
																		onUpdateShowSheetSelect(
																			show,
																			group.sheets,
																			group.children
																		)
																"
																:on-update:value="
																	(value) =>
																		selectSheetChange(
																			value,
																			group.sheets,
																			group.children[index],
																			group.children
																		)
																"
															/>
														</n-form-item>
														<div
															style="
																height: 34px;
																line-height: 34px;
																margin: 0 8px;
															"
														></div>
														<n-form-item
															ignore-path-change
															:show-label="false"
															:path="`groupList[${groupIndex}].children[${index}].fieldName`"
															:rule="rules.fieldName"
														>
															<n-select
																:value="group.children[index].fieldName"
																placeholder="请选择"
																clearable
																:options="
																	getFieldOpts(
																		group.children[index].sheetName || '',
																		group.sheets,
																		group.children
																	)
																"
																style="width: 228px"
																:on-update:value="
																	(value) =>
																		selectFieldChange(
																			value,
																			group.sheets,
																			group.children,
																			index
																		)
																"
															/>
														</n-form-item>
													</div>
												</n-dynamic-input>
											</div>
										</div>
									</n-form-item>
								</n-scrollbar>
							</n-collapse-transition>
						</div>
						<div v-if="Number(ScreenType) === 2">
							<!-- <div class="mb-23px flex justify-between" :class="{'mb-23px': !form.openkbset, 'mb-6px': form.openkbset}">
								<span>配置知识库</span>
								<n-switch v-model:value="form.openkbset" />
							</div> -->
							<n-form-item-row
								v-show="form.openkbset"
								label="配置知识库"
								class="form-item-kb"
							>
								<n-tree-select
									multiple
									cascade
									checkable
									clearable
									check-strategy="all"
									v-model:value="form.kbListVal"
									:options="kbOpts"
									@update:value="handleKbListUpdateValue"
								/>
							</n-form-item-row>
							<n-form-item-row label="最大召回的个数" path="RelevantHits">
								<n-input-number v-model:value="form.RelevantHits" style="width: 600px;" :min="1" :max="6" />
							</n-form-item-row>
							<n-form-item-row label="相似度阈值" path="SimilarityThreshold">
								<n-input-number v-model:value="form.SimilarityThreshold" style="width: 600px;" :min="0" :max="100" />
							</n-form-item-row>
						</div>
					</n-form>
					<!-- <div class="tabs-footer-btns">
						<n-button
							style="margin-top: 10px"
							type="primary"
							block
							secondary
							strong
							:loading="submitLoading"
							@click.stop="saveClick"
						>
							{{ isNotConfig ? "开始会话" : "保存" }}
						</n-button>
						<n-button
							v-if="!isNotConfig"
							style="margin-top: 10px"
							type="default"
							block
							secondary
							strong
							@click.stop="cancelClick"
						>
							关闭
						</n-button>
					</div> -->
				</n-tab-pane>
			</n-tabs>
		</div>
		<div class="footer-action">
			<div class="f-btn mr-20">
				<n-button
					type="default"
					block
					secondary
					strong
					@click.stop="cancelClick"
				>
					关闭
				</n-button>
			</div>
			<div class="f-btn">
				<n-button
					type="primary"
					block
					secondary
					strong
					:loading="submitLoading"
					@click.stop="saveClick"
				>
					{{ confirmBtnName }}
				</n-button>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import {
	TrashOutline as TrashIcon,
	RemoveCircle as RemoveIcon,
	AddCircle as AddIcon,
	AddOutline as AddOutlineIcon,
	RemoveOutline as RemoveOutlineIcon
} from "@vicons/ionicons5";
import { nanoid } from "nanoid";
import { FormInst } from "naive-ui";
import {
	ref,
	reactive,
	defineComponent,
	nextTick,
	watch,
	computed,
	onMounted
} from "vue";
import { TreeSelectOption } from 'naive-ui';
import { useRobotStore, useAuthStore, useKnowledgeStore } from "@/store";
import { EventBus } from "@/utils";

const intOpts = ['int64', 'int32', 'float64', 'float32'];

export default defineComponent({
	components: {
		RemoveIcon,
		AddIcon,
		TrashIcon,
		AddOutlineIcon,
		RemoveOutlineIcon
	},
	setup() {
		const formRef1 = ref<FormInst | null>(null);
		const formRef2 = ref<FormInst | null>(null);
		const tabIndex = ref("2");
		const isSpread = ref(false); // 是否展示分组数据
		const isNotConfig = ref(false); // 是否未配置
		const submitLoading = ref(false);
		const kbMax = ref(3);
		const form = reactive({
			name: "",
			desc: "",
			configId: "",
			configName: "",
			groupList: [] as Robot.GroupList[],
			RelevantHits: 4,
			SimilarityThreshold: 0,
			kbListVal: [] as string[],
			openkbset: true
		});

		const auth = useAuthStore();
		const robot = useRobotStore();
		const knowledge = useKnowledgeStore();

		const ScreenType = computed(() => robot.chatbotItem?.ScreenType);

		const sourceOpts = computed(() => {
			return (
				auth.wdConfigInfo.map((item) => {
					const data: any = item.Data || [];
					const sheetOpts = data.map((sheet: any) => {
						const colsInfo = sheet.colsInfo || [];
						const fieldOpts = colsInfo.map((col: any) => {
							return {
								label: col.colName,
								value: col.colName,
								type: col.colType,
							};
						});
						return {
							label: sheet.sheetName,
							value: sheet.sheetName,
							fieldOpts,
						};
					});
					return {
						label: item.SourceName,
						value: item.ConfigId,
						sheetOpts,
					};
				}) || []
			);
		});

		const getKbOpts = () => {
			const kbList = knowledge.knowledgeBaseList || []
			const options: TreeSelectOption[] = []
			for(let i = 0; i < kbList.length; i++) {
				const data = kbList[i].data || []
				const children: TreeSelectOption[] = []
				for (let j = 0; j < data.length; j++) {
					children.push({
						label: data[j].KName,
						key: data[j].KID
					})
				}
				const obj: TreeSelectOption  = {
					label: kbList[i].KBName,
					key: kbList[i].KBID
				}
				if (children.length > 0) {
					obj.children = children
				}
				options.push(obj)
			}
			return options
		}

		const kbOpts = ref<TreeSelectOption[]>([])
		kbOpts.value = getKbOpts()

		const confirmBtnName = computed(() => {
			let res = '保存'
			// switch(tabIndex.value) {
			// 	case '1':
			// 		if (isNotConfig.value) {
			// 			// res = '下一步'
			// 			res = '开始会话'
			// 		}
			// 		break
			// 	case '2':
			// 		if (isNotConfig.value) {
			// 			res = '开始会话'
			// 		}
			// 		break
			// }
			return res
		})

		onMounted(() => {
			setChatbotSettings(2);
			EventBus.on("init-chatbot-settings", () => {
				init();
			});
			EventBus.on("set-chatbot-settings", (type: any = 1) => {
				setChatbotSettings(type);
			});
		});

		const init = () => {
			form.name = "";
			form.desc = "";
			form.configId = "";
			form.configName = "";
			form.groupList =  [] as Robot.GroupList[];
			isSpread.value = false;
			tabIndex.value = "2";
			isNotConfig.value = true;
		}

		const setChatbotSettings = (type: number = 1) => {
			const settings = JSON.parse(JSON.stringify(robot.chatbotSettings));
			console.log('settings-----aaa', settings)
			console.log('ScreenType-----', ScreenType.value)
			// const settings: Robot.Settings = robot.chatbotSettings
			const ScreenQAConfig = settings.ScreenQAConfig || ({} as Robot.ScreenQAConfig)

			const sourceItem = sourceOpts.value.find(
				(i) => i.value === settings.ScreenQAConfig?.ConfigId
			);

			form.name = settings.ScreenBasicConfig?.ScreenName;
			form.desc = settings.ScreenBasicConfig?.ScreenDesc;
			tabIndex.value = type === 1 ? "1" : "2";

			const GroupList = settings.ScreenQAConfig?.GroupList || []
			if (sourceItem) {
				form.configId = settings.ScreenQAConfig?.ConfigId;
				form.configName = settings.ScreenQAConfig?.ConfigName;
				form.groupList = GroupList.map((item: Robot.GroupList) => {
					item.checked = item.checked === 1 ? true : false;
					item.sheets = sourceItem?.sheetOpts || [];
					return item;
				});
				isNotConfig.value = settings.ScreenQAConfig?.ConfigId ? false : true;
				isSpread.value = GroupList.length > 0 ? true : false;
			} else {
				isNotConfig.value = true;
			}

			if (ScreenType.value === '2') {
				form.RelevantHits = Number(ScreenQAConfig.RelevantHits)
				form.SimilarityThreshold = Number(ScreenQAConfig.SimilarityThreshold)
				form.kbListVal = getResKBIDS(ScreenQAConfig.KBIDS)
			}
		};

		watch(
			() => robot.chatbotId,
			(newVal) => {
				if (newVal) {
					setChatbotSettings();
				}
			}
		);

		watch(
			() => robot.showSettings,
			(newVal) => {
				if (newVal) {
					tabIndex.value = "1";
					const settings = robot.chatbotSettings;
					const screenQAConfig = settings.ScreenQAConfig || {};
					const sourceItem = sourceOpts.value.find(
						(i) => i.value === screenQAConfig.ConfigId
					);
					if (sourceItem) {
						isNotConfig.value = screenQAConfig?.ConfigId ? false : true;
					} else {
						isNotConfig.value = true;
					}
				}
			}
		);

		// methods
		const getResKBIDS = (list: any) => {
			let res: string[] = []
			if (Array.isArray(list)) {
				list.forEach(item => {
					const keys = Object.keys(item)
					keys.forEach(k => {
						res.push(k)
						const children = item[k] || []
						if (children) {
							children.forEach((c: any) => {
								const keys = Object.keys(c) || []
								res.push(...keys)
							})
						}
					})
				})
			}

			return res
		}

		const handleKbListUpdateValue = (values: string | number | Array<string | number> | null, option: TreeSelectOption | null | Array<TreeSelectOption | null>) => {
			let selectedParentKeys: string[] = []

			if (Array.isArray(values)) {
				for(let i = 0; i < kbOpts.value.length; i++) {
					const item = kbOpts.value[i] || {}
					const children = item.children || []
					const check = children.some((v) => values.includes(String(v.key)))
					if (check) {
						selectedParentKeys.push(String(item.key))
					}
				}
			}

			if (selectedParentKeys.length >= kbMax.value) {
				kbOpts.value.forEach((item) => {
					const children = item.children
					if (!selectedParentKeys.includes(String(item.key))) {
						item.disabled = true
						if (children) {
							children.forEach((v) => {
								v.disabled = true
							})
						}
					}
				})
			} else {
				kbOpts.value.forEach((item) => {
					item.disabled = false
					if (item.children) {
						item.children.forEach((v) => {
							v.disabled = false
						})
					}
				})
			}
		}

		const selectSourceChange = (value: string) => {
			const settings = JSON.parse(JSON.stringify(robot.chatbotSettings));
			const screenQAConfig = settings.ScreenQAConfig || {};
			form.configId = value;
			let groupList: any = [];
			if (screenQAConfig.ConfigId && screenQAConfig.ConfigId === value) {
				const sourceItem = sourceOpts.value.find((i) => i.value === screenQAConfig.ConfigId);
				form.configName = sourceItem?.label;
				groupList = screenQAConfig.GroupList?.map((item: any) => {
					(item.checked = item.checked === 1 ? true : false),
					(item.sheets = sourceItem?.sheetOpts || []);
					return item;
				}) || [];
				isSpread.value = groupList.length ? true : false;
			} else {
				const sourceItem = sourceOpts.value.find((i) => i.value === value);
				form.configName = sourceItem?.label;
				isSpread.value = false;
				groupList = form.groupList.map((item) => {
					item.sheets = sourceItem?.sheetOpts || [];
					return item;
				});
			}
			form.groupList = groupList;
		};

		const onUpdateShowSheetSelect = (
			show: boolean,
			sheets: any = [],
			children: any = []
		) => {
			if (show) {
				sheets.forEach((item: any) => {
					item.disabled = children.some(
						(el: any) => el.sheetName === item.value
					);
				});
			}
		};

		const selectSheetChange = async (
			value: string,
			sheets: any = [],
			children: any = {},
			childrenList: any = []
		) => {
			children.sheetName = value;
			children.fieldName = null;
			children.fieldType = null;

			let arr: string[] = childrenList.filter((item: any) => {
				return item?.sheetName
			}).map((item: any) => item.sheetName) || []

			sheets.forEach((item: any) => {
				item.disabled = arr.includes(item.value);
			});
		};

		const selectFieldChange = (
			value: string,
			sheets: any,
			children: any,
			cIndex: number
		) => {
			children.forEach((item: any, idx: number) => {
				if (idx === cIndex) {
					const sheet = sheets.find((s: any) => s.value === item.sheetName) || {};
					const fieldOpts = sheet.fieldOpts || [];
					const field = fieldOpts.find((f: any) => f.value === value) || {};
					item.fieldName = value;
					item.fieldType = field.type;
				}
			});
		};

		const getFieldOpts = (
			name: string,
			sheets: any = [],
			children: any = []
		) => {
			let res = [];
			let fieldType = "";
			let sheetName = "";
			let num = 0;
			for (let i in children) {
				if (children[i].fieldType) {
					if (!fieldType) {
						fieldType = children[i].fieldType;
						sheetName = children[i].sheetName;
					}
					num += 1;
					if (num > 1) {
						continue;
					}
				}
			}
			const obj: any = sheets.find((item: any) => item.value === name) || {};
			let fieldOpts = obj.fieldOpts || [];
			if (fieldType) {
				if (num === 1 && obj.value === sheetName) {
					fieldOpts.map((item: any) => {
						item.disabled = false;
						return item;
					});
				} else {
					fieldOpts.map((item: any) => {
						if (intOpts.includes(fieldType)) {
							if (intOpts.includes(item.type)) {
								item.disabled = false;
							} else {
								item.disabled = true;
							}
						} else {
							if (item.type !== fieldType) {
								item.disabled = true;
							} else {
								item.disabled = false;
							}
						}
						return item;
					});
				}
			} else {
				fieldOpts.map((item: any) => {
					item.disabled = false;
					return item;
				});
			}
			res = fieldOpts;
			return res;
		};

		// 添加分组
		const addGroupClick = () => {
			if (form.groupList.length >= 3) return;
			isSpread.value = true;
			const obj = {
				id: nanoid(),
				checked: true,
				sheets: [],
				children: [
					{
						sheetName: undefined,
						fieldName: undefined,
						fieldType: undefined,
					},
					{
						sheetName: undefined,
						fieldName: undefined,
						fieldType: undefined,
					},
				],
			};
			form.groupList.push(obj);
			// 设置数据表下拉
			const sourceItem = sourceOpts.value.find(
				(i) => i.value === form.configId
			);
			form.groupList = form.groupList.map((item) => {
				item.sheets = sourceItem?.sheetOpts || [];
				return item;
			});
		};

		// 添加子分组
		const addChildGroup = () => {
			return {
				sheetName: undefined,
				fieldName: undefined,
				fieldType: null,
			};
		};

		const delGroupClick = (index: number) => {
			form.groupList.splice(index, 1);
			if (form.groupList.length === 0) {
				isSpread.value = false;
			}
		};

		const nextStepClick = (e: MouseEvent) => {
			e.preventDefault();
			formRef1.value?.validate((errors) => {
				if (!errors) {
					tabIndex.value = "2";
				} else {
					console.log("errors", errors);
				}
			});
		};

		const saveClick = (e: MouseEvent) => {
			e.preventDefault();

			if (!form.name) {
				tabIndex.value = "1";
				nextTick(() => {
					formRef1.value?.validate();
				});
				return;
			}

			if (tabIndex.value === "1") {
				if (isNotConfig.value) {
					tabIndex.value = "2";
					return
				} else {
					if (!form.configId) {
						tabIndex.value = "2";
						nextTick(() => {
							formRef2.value?.validate();
						});
						return
					}
					if (!robot.chatbotId) {
						addSubmit();
					} else {
						editSubmit();
					}
				}
			}

			formRef2.value?.validate((errors) => {
				if (!errors) {
					if (!robot.chatbotId) {
						addSubmit();
					} else {
						editSubmit();
					}
				} else {
					console.log("errors", errors);
				}
			});
		};

		const handleKBIDS = () => {
			const values = form.kbListVal
			const opts = kbOpts.value
			let parents = []
			for(let i = 0; i < opts.length; i++) {
				const item = opts[i] || {}
				const children = item.children || []
				const check = children.some((v) => values.includes(String(v.key)))
				if (check) {
					let key: string = item.key + ''
					let arr = children.map(v => {
						let k: string = String(v.key)
						return {
							[k]: {
								status: values.includes(k),
								kName: v.label
							}
						}
					}) || []
					parents.push({
						[key]: arr
					})
				}
			}
			return parents
		}

		const addSubmit = async () => {
			const groupList = form.groupList.map((item) => {
				return {
					id: item.id,
					checked: item.checked ? 1 : 0,
					children: item.children,
				};
			}) || [];
			const params = {
				ScreenDesc: form.desc,
				ScreenName: form.name,
				ConfigId: form.configId || "",
				ConfigName: form.configName || "",
				GroupList: groupList
			}
			submitLoading.value = true;
			await robot.addChatbot(params);
			submitLoading.value = false;
			robot.setShowSettings(false);
		};

		const editSubmit = async () => {
			const checkGroupList = form.groupList.some((item) => {
				const children = item?.children || [];
				const checkChildren = children.some((sItem) => {
					return !sItem?.sheetName;
				});
				return checkChildren;
			});

			// 存在空的分组数据
			if (checkGroupList) {
				isSpread.value = true;
				tabIndex.value = "2";
				nextTick(() => {
					formRef2.value?.validate();
				});
				return;
			}

			const chatbotItem = robot.chatbotItem

			const groupList = form.groupList.map((item) => {
					return {
						id: item.id,
						checked: item.checked ? 1 : 0,
						children: item.children,
					};
				}) || [];

			submitLoading.value = true;

			const kbids = handleKBIDS()

			const params = {
				ScreenId: robot.chatbotId,
				ScreenName: form.name,
				ScreenDesc: form.desc,
				ConfigId: form.configId,
				ConfigName: form.configName,
				ScreenType: Number(chatbotItem.ScreenType),
				GroupList: groupList,
				SimilarityThreshold: Number(form.SimilarityThreshold),
				RelevantHits: Number(form.RelevantHits),
				KBIDS: kbids
			}

			const results = await robot.updateChatbot(params)

			submitLoading.value = false;

			if (!results) return;

			robot.setShowSettings(false);
		};

		const cancelClick = () => {
			robot.setShowSettings(false);
		};

		return {
			formRef1,
			formRef2,
			isNotConfig,
			tabIndex,
			isSpread,
			submitLoading,
			ScreenType,
			form,
			sourceOpts,
			kbOpts,
			rules: {
				name: {
					required: true,
					trigger: ["blur", "input"],
					message: "会话名称不能为空",
				},
				configId: {
					required: true,
					trigger: ["blur", "input"],
					message: "请选择数据源",
				},
				sheetName: {
					required: true,
					trigger: ["blur", "input"],
					message: "请选择",
				},
				fieldName: {
					required: true,
					trigger: ["blur", "input"],
					message: "请选择",
				},
				RelevantHits: {
					required: true,
					type: 'number',
					trigger: ["blur", "input"],
					message: "不能为空",
				},
				SimilarityThreshold: {
					required: true,
					type: 'number',
					trigger: ["blur", "input"],
					message: "不能为空",
				}
			},
			confirmBtnName,
			nextStepClick,
			saveClick,
			cancelClick,
			addGroupClick,
			addChildGroup,
			delGroupClick,
			selectSourceChange,
			selectSheetChange,
			onUpdateShowSheetSelect,
			getFieldOpts,
			selectFieldChange,
			handleKbListUpdateValue
		};
	},
});
</script>

<style lang="scss" scoped>
.n-tabs-pane-wrapper {
	overflow: initial;
}
.setting-box {
	position: absolute;
	top: 0;
	left: 16px;
	right: 0;
	bottom: 0;
	z-index: 100;
	// background-color: var(--baseColor);
	background-color: #f5f5f6;
	display: flex;
	flex-direction: column;
	align-items: center;
	padding-top: 5vh;
	.mr-10 {
		margin-right: 10px;
	}
	.pb-24 {
		padding-bottom: 24px;
	}
	.inner-content {
		width: 600px;
		.s-tabs {
			.tips-box {
				display: flex;
				align-items: center;
				padding: 0 16px;
				margin-bottom: 24px;
				.b-left {
					flex: 1;
					overflow: hidden;
					display: flex;
					align-items: center;
				}
			}
			.tabs-inner-form {
				margin-top: 20px;
				padding: 0 50px;
				:deep(.n-form-item--top-labelled) {
					grid-template-rows: initial;
				}

				.form-item-group {
					:deep(.n-form-item-label__text) {
						width: 100%;
					}
				}

				.f-label {
					width: 100%;
					display: flex;
					align-items: center;
					.f-label-left {
						flex: 1;
						overflow: hidden;
					}
				}
				.group-list {
					position: relative;
					width: 100%;
					display: flex;
					flex-direction: column;
					padding-left: 8px;
					&::before {
						content: "";
						position: absolute;
						top: 0;
						bottom: 24px;
						left: 0;
						width: 2px;
						background-color: #1890ff;
					}
				}

				.kb-wrapper {
					width: 100%;
					display: flex;
					flex-direction: column;
					.kb-list {
						position: relative;
						width: 100%;
						display: flex;
						align-items: center;
						.kb-list-action {
							position: absolute;
							right: -50px;
							top: 0;
							width: 40px;
							height: 34px;
							display: flex;
							align-items: center;
							z-index: 10;
						}
						.kb-list-left {
							flex: 1;
							overflow: hidden;
						}
						.kb-list-right {

						}
					}
				}
			}
			.tabs-footer-btns {
				padding: 0 16px;
			}
		}
	}
	.footer-action {
		position: absolute;
		bottom: 30px;
		left: 0;
		right: 30px;
		display: flex;
		align-items: center;
		justify-content: flex-end;
		.mr-20 {
			margin-right: 20px;
		}
	}
}
</style>
