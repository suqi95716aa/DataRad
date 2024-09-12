<template>
	<n-modal
		v-model:show="showModal"
		style="width: 800px; position: fixed; top: 20vh"
		:title="title"
		:show-icon="false"
		:loading="loading"
		preset="dialog"
		positive-text="保存"
    negative-text="取消"
		:on-after-leave="onAfterLeaveDialog"
		:on-positive-click="onPositiveClick"
	>
		<div class="dialog-content mt-20">
			<n-form ref="formRef" :model="model" :rules="rules">
				<n-form-item path="name" label="知识库名称">
					<n-input v-model:value="model.name" :maxlength="20" placeholder="请输入" @keydown.enter.prevent />
				</n-form-item>
				<n-form-item path="desc" label="知识库描述">
					<n-input
						v-model:value="model.desc"
						type="textarea"
						:maxlength="200"
						show-count
						clearable
						:autosize="{
							minRows: 3,
							maxRows: 5
						}"
						placeholder="为更好区分不同知识库数据，请填写提升描述检索概率"
						@keydown.enter.prevent
					/>
				</n-form-item>
				<n-form-item ref="formItemRef" path="tags" :label="`知识库标签（最多${tagsMax}个）`">
					<n-space vertical>
						<n-dynamic-tags v-model:value="model.tags" :max="tagsMax" :input-props="{ maxlength: 8 }" type="info" :on-update:value="dynamicTagsUpdate">
							<template #trigger="{ activate, disabled }">
								<n-button
									size="small"
									type="primary"
									dashed
									:disabled="disabled"
									@click="activate()"
								>
									<template #icon>
										<n-icon>
											<AddIcon />
										</n-icon>
									</template>
									添加
								</n-button>
							</template>
						</n-dynamic-tags>
						<n-space style="gap: 8px 0;">
							<span style="line-height: 28px;">可选标签：</span>
							<n-space>
								<n-tag v-for="tag in tagsList" :key="tag.id" v-model:checked="tag.checked" :type="tag.checked ? 'success' : 'default'" :disabled="tag.disabled" checkable @click="tagClick(tag)">
									{{ tag.name }}
								</n-tag>
							</n-space>
						</n-space>
					</n-space>
				</n-form-item>
				<n-form-item path="kbIcon" label="知识库图标">
					<div class="kb-content">
						<div class="kb-left">
							<div class="icon-box" :style="{ backgroundColor: activeColor }">
								<img :src="getKbIcon(activeIconKey)" />
							</div>
						</div>
						<div class="kb-right">
							<div class="color-content">
								<p class="color-title">选择背景色</p>
								<div class="color-list">
									<div
										v-for="(color, index) in colorList"
										:key="index"
										class="color-item"
										:style="{ backgroundColor: color}"
										@click="colorClick(color)"
									>
										<icon-local-kb-selected v-if="color === activeColor" class="active-icon" />
									</div>
								</div>
							</div>
							<div class="icon-content">
								<p class="icon-title">选择图标</p>
								<div class="icon-list">
									<div
										v-for="item in iconList"
										:key="item.id"
										class="icon-item"
										:style="{ backgroundColor: item.key === activeIconKey ? activeColor : ''}"
										@click="iconClick(item.key)"
									>
										<img :src="item.icon" alt="" />
									</div>
								</div>
							</div>
						</div>
					</div>
				</n-form-item>
			</n-form>
		</div>
	</n-modal>
</template>

<script lang="ts">
import {
	Add as AddIcon
} from "@vicons/ionicons5";
import { ref, watch, nextTick, defineComponent } from 'vue';
import {
  FormInst,
  FormItemInst,
  FormItemRule,
  useMessage,
  FormRules
} from 'naive-ui';
import { getKbIcon, kbIconList, kbColorList } from '@/config';
import { isArray } from "lodash-es";
import { useKnowledgeStore } from '@/store';


interface ModelType {
  name: string | null
	desc: string | null
	kbIcon: string | null,
	tags: string[]
}

const mxOptions: any = [
	{
		label: '通用模型1',
		value: '1'
	},
	{
		label: '通用模型2',
		value: '2'
	}
]

const tagsOpts = [
	{
		id: 1,
		name: '金融',
		checked: false,
		disabled: false
	},
	{
		id: 2,
		name: '财务',
		checked: false,
		disabled: false
	},
	{
		id: 3,
		name: '科技',
		checked: false,
		disabled: false
	},
	{
		id: 4,
		name: '汽车',
		checked: false,
		disabled: false
	}
]

export default defineComponent({
	components: {
		AddIcon
	},
	emits: ['change'],
	setup (props, ctx) {
		const showModal = ref(false);
		const title = ref('新建知识库');
		const formRef = ref<FormInst | null>(null);
		const formItemRef = ref<FormItemInst | null>(null);
		const activeColor = ref('#1890ff');
		const activeIconKey = ref('help');
		const loading = ref(false);
		const tagsMax = 2;
		const KBID = ref('');
		const kbDetails = ref<Knowledge.Base>();
		const model = ref<ModelType>({
      name: null,
			desc: null,
			kbIcon: activeIconKey.value,
			tags: []
    })
		const tagsList = ref(tagsOpts);


		// hooks
		const message = useMessage()
		const { addKB, updateKB } = useKnowledgeStore()


		// watch
		watch(() => model.value.tags, (newTags) => {
			if (newTags.length >= tagsMax) {
				tagsList.value = tagsList.value.map((item) => {
					item.disabled = true
					return item
				})
			} else {
				tagsList.value = tagsList.value.map((item) => {
					item.disabled = false
					return item
				})
			}

			tagsList.value.forEach(item => {
				const fIndex = newTags.findIndex(tag => tag === item.name)
				if (fIndex === -1) {
					item.checked = false
				} else {
					item.checked = true
				}
				if (newTags.length >= tagsMax) {
					if (fIndex !== -1) {
						item.disabled = false
					} else {
						item.disabled = true
					}
				}
			})
		})

		// methods
		const onShow = (data: any) => {
			showModal.value = true;
			KBID.value = '';
			kbDetails.value = {} as Knowledge.Base;
			if (data) {
				let tags = handleTags(data.KBLabel);
				KBID.value = data.KBID;
				model.value.name = data.KBName;
				model.value.desc = data.KBDesc;
				activeColor.value = data.KBColor;
				activeIconKey.value = data.KBBGImg;
				model.value.tags = tags;
				kbDetails.value = data;
			}
		};

		const onHide = () => {
			showModal.value = false;
		};

		const setTitle = (val: string) => {
			title.value = val
		}

		const colorClick = (color: string) => {
			activeColor.value = color
		}

		const iconClick = (name: string) => {
			activeIconKey.value = name
		}

		const rules: FormRules = {
      name: [
        {
          required: true,
          validator (rule: FormItemRule, value: string) {
            if (!value) {
              return new Error('请输入知识库名称')
            }
            return true
          },
          trigger: ['input', 'blur']
        }
      ],
			desc: [
        {
          required: true,
          validator (rule: FormItemRule, value: string) {
            if (!value) {
              return new Error('请输入知识库描述')
            }
            return true
          },
          trigger: ['input', 'blur']
        }
      ],
			tags: [
        {
          required: true,
          validator (rule: FormItemRule, value: string) {
            if (isArray(value) && value.length === 0) {
              return new Error('请添加标签')
            }
            return true
          },
          trigger: ['input', 'blur']
        }
      ],
			kbIcon: [
        {
          required: true,
          validator (rule: FormItemRule, value: string) {
            if (!value) {
              return new Error('请选择图标')
            }
            return true
          },
          trigger: ['input', 'blur']
        }
      ],
    }

		// methods
		const handleTags = (val: string) => {
			let res = []
			try {
				res = JSON.parse(val)
			} catch (error) {}
			return res
		}

		const tagClick = (tag: any) => {
			const tags = model.value.tags
			const fIndex = tags.findIndex((t: any) => t === tag.name)
			const list = tags.map(i => i) || []

			if (tag.disabled) return

			if (tag.checked && fIndex === -1) {
				if (list.length >= 3) return
				list.push(tag.name)
				model.value.tags = list
			} else {
				list.splice(fIndex, 1)
				model.value.tags = list
			}
			formItemRef.value?.validate()
		}

		const dynamicTagsUpdate = (value: string[]) => {
			model.value.tags = Array.from(new Set(value))
		}

		const onAfterLeaveDialog = () => {
			model.value.name = null;
			model.value.desc = null;
			model.value.tags = [];
			activeColor.value = '#1890ff';
			activeIconKey.value = 'help';
			tagsList.value = tagsOpts;
		}

		const onPositiveClick = () => {
			if (loading.value) return false;
			loading.value = true
			return new Promise((resolve, reject) => {
				formRef.value?.validate(async (errors) => {
					if (!errors) {
						let results
						const params = {
							KBID: '',
							KBName: model.value.name,
							KBDesc: model.value.desc,
							KBLabel: JSON.stringify(model.value.tags),
							KBColor: activeColor.value,
							KBBGImg: activeIconKey.value,
							data: [] as Knowledge.K[]
						}
						if (KBID.value) {
							params.KBID = KBID.value
							params.data = kbDetails.value?.data || []
							results = await updateKB(params)
						} else {
							results = await addKB(params)
						}
						loading.value = false
						if (results) {
							resolve(true);
							message.success(KBID.value ? '更新成功' : '添加成功');
							ctx.emit('change', true)
							return false;
						}
					}
					loading.value = false
					resolve(false)
				})
			})
		}

		return {
			showModal,
			formRef,
			formItemRef,
			model,
			rules,
			title,
			loading,
			mxOptions,
			activeColor,
			activeIconKey,
			colorList: kbColorList,
			iconList: kbIconList,
			tagsList,
			tagsMax,
			onShow,
			onHide,
			setTitle,
			getKbIcon,
			colorClick,
			iconClick,
			tagClick,
			dynamicTagsUpdate,
			onPositiveClick,
			onAfterLeaveDialog
		}
	}
})
</script>

<style lang="scss" scoped>
.mt-20 {
	margin-top: 20px;
}
.dialog-content {
	.kb-content {
		display: flex;
		width: 100%;
		.kb-left {
			flex: 0 0 80px;
			margin-right: 20px;
			.icon-box {
				width: 64px;
				height: 64px;
				border-radius: 6px;
				background-color: #d1d3d6;
				display: flex;
				align-items: center;
				justify-content: center;
				img {
					width: 36px;
				}
			}
		}
		.kb-right {
			flex: 1;
			padding: 20px;
			background-color: #f4f5f7;
			border-radius: 8px;
			padding-bottom: 0;
			.color-content {
				.color-title {
					margin-bottom: 10px;
					font-weight: 600;
					font-size: 14px;
				}
				.color-list {
					display: flex;
					flex-wrap: wrap;
					.color-item {
						width: 42px;
						height: 42px;
						background-color: #2454ff;
						margin-right: 20px;
						margin-bottom: 20px;
						border-radius: 6px;
						cursor: pointer;
						display: flex;
						align-items: center;
						justify-content: center;
						.active-icon {
							font-size: 22px;
						}
					}
				}
			}
			.icon-content {
				.icon-title {
					margin-bottom: 10px;
					font-weight: 600;
					font-size: 14px;
				}
				.icon-list {
					display: flex;
					flex-wrap: wrap;
					.icon-item {
						width: 42px;
						height: 42px;
						background-color: #d1d3d6;
						margin-right: 20px;
						margin-bottom: 20px;
						border-radius: 6px;
						cursor: pointer;
						display: flex;
						align-items: center;
						justify-content: center;
						img {
							width: 22px;
						}
					}
				}
			}
		}
	}
}
</style>
