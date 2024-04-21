<template>
	<n-modal
		v-model:show="showModal"
		style="width: 1080px; position: fixed; top: 20vh"
		:title="title"
		:show-icon="false"
		preset="dialog"
		positive-text="保存"
    negative-text="取消"
	>
		<div v-if="current === 1" class="dialog-content mt-0">
			<n-tabs type="line" animated>
				<n-tab-pane name="word" tab="文档">
					<div class="tabs-content">
						<n-upload
							:multiple="false"
							directory-dnd
							action="#"
							accept=".xlsx, .doc, .docx, .txt, .pdf"
							:max="1"
							:default-upload="false"
							:show-file-list="false"
							v-model:file-list="fileList"
							@change="handleUploadChange"
						>
							<n-upload-dragger>
								<div style="margin-bottom: 12px">
									<n-icon size="48" :depth="3">
										<icon-local-fa-upload />
									</n-icon>
								</div>
								<n-p depth="3" style="margin: 8px 0 0 0; display: inline-flex;align-items: center;">
									<n-icon size="16" :depth="3" style="margin-right: 8px;">
										<CloudUploadIcon />
									</n-icon>
									<n-text style="color: #1890ff;">点击上传</n-text>
									<n-text style="color: #767c82;">，或拖放文件置此处</n-text>
								</n-p>
								<n-p depth="3" style="margin-top: 0;">目前仅支持上传Doc、Docx、PDF、Xlsx、txt文件 </n-p>
							</n-upload-dragger>
						</n-upload>
						<div class="file-list mt-20">
							<div class="file-item" v-for="(item, index) in fileList" :key="item.id">
								<div class="item-left">
									<img src="@/assets/images/xlsx.png" />
								</div>
								<div class="item-mid">
									<p style="font-size: 14px;">{{ item.name }}</p>
									<p style="font-size: 12px;">{{ countFileSize(item.file) }}MB</p>
								</div>
								<div class="item-right">
									<span class="pre-btn" @click="previewFileClick(item.file)">预览</span>
									<n-divider vertical />
									<n-icon class="del-btn" size="16" @click="delFileClick(index)">
										<TrashIcon />
									</n-icon>
								</div>
							</div>
						</div>
					</div>
				</n-tab-pane>
				<n-tab-pane name="url" tab="URL">
					<div class="tabs-content form-list">
						<n-form
							ref="formRef"
							:model="formValue"
						>
							<n-form-item
								v-for="(item, index) in formValue.urlList"
								:key="index"
								:label="`URL${index + 1}`"
								:path="`urlList[${index}].url`"
								:rule="rules.url"
							>
								<n-input v-model:value="item.url" clearable placeholder="请输入URL" />
								<n-popover v-if="formValue.urlList.length > 1" trigger="hover">
									<template #trigger>
										<n-icon size="20" style="margin-left: 20px;cursor: pointer;" :style="{'margin-right': index === formValue.urlList.length - 1 ? '0' : '40px'}" @click="removeUrlClick(index)">
											<TrashIcon />
										</n-icon>
									</template>
									<span>删除</span>
								</n-popover>
								<n-popover v-if="formValue.urlList.length - 1 === index" trigger="hover">
									<template #trigger>
										<n-icon size="20" style="margin-left: 20px;cursor: pointer;" @click="addUrlClick()">
											<AddIcon />
										</n-icon>
									</template>
									<span>添加</span>
								</n-popover>
							</n-form-item>
						</n-form>
					</div>
				</n-tab-pane>
			</n-tabs>
		</div>
		<div v-else class="dialog-content mt-0">
			<n-alert type="info" closable>
				您可切换知识类型，以达到更好的知识提取效果，点击进入"知识预览"，查看知识提取效果
			</n-alert>
			<div class="knowledge-box">
				<div class="knowledge-left">
					<h5 class="k-title">
						知识类型
						<n-popover trigger="hover">
							<template #trigger>
								<n-icon size="20" style="margin-left: 4px;cursor: pointer;">
									<HelpIcon />
								</n-icon>
							</template>
							<span>您可以为每个知识标记<br/>对应的知识类型，以达到更好<br/>的知识提取效果</span>
						</n-popover>
					</h5>
					<div class="file-list k-list">
						<div class="file-item" v-for="(item, index) in fileList" :key="item.id">
							<div class="item-left">
								<img src="@/assets/images/xlsx.png" />
							</div>
							<div class="item-mid">
								<p style="font-size: 14px;">{{ item.name }}</p>
								<p style="font-size: 12px;">{{ countFileSize(item.file) }}MB</p>
							</div>
							<div class="item-right">
								<div class="select-box">
									<n-select v-model:value="kbType" :consistent-menu-width="false" size="small" :options="typeOpts" />
								</div>
								<div class="ellipsis-box">
									<n-popover
										ref="more"
										style="padding: 4px"
										trigger="hover"
										:show-arrow="false"
										placement="bottom"
									>
										<template #trigger>
											<n-icon style="margin-left: 12px;"><EllipsisIcon /></n-icon>
										</template>
										<div class="r-more">
											<n-button
												size="small"
												quaternary
											>
												<span>预览</span>
											</n-button>
											<n-button size="small" quaternary>
												<span style="color: #d4425f;">删除</span>
											</n-button>
										</div>
									</n-popover>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="knowledge-right">
					<h5 class="k-title">
						知识说明
						<n-popover trigger="hover">
							<template #trigger>
								<n-icon size="20" style="margin-left: 4px;cursor: pointer;">
									<HelpIcon />
								</n-icon>
							</template>
							<span>您可以为每个知识标记<br/>对应的知识类型，以达到更好<br/>的知识提取效果</span>
						</n-popover>
					</h5>
				</div>
			</div>
		</div>
		<template #action>
			<div class="dialog-footer">
				<div class="footer-left">
					<div class="step-box">
						<n-steps :current="(current as number)" :status="currentStatus">
							<n-step
								title="上传知识"
							/>
							<n-step
								title="知识配置"
							/>
						</n-steps>
					</div>
				</div>
				<div class="footer-right">
					<n-button @click="cancelClick">{{ current === 1 ? '取消' : '上一步'}}</n-button>
					<n-button type="info" style="margin-left: 20px;" @click="saveClick">{{ current === 1 ? '确认添加' : '完成配置'}}</n-button>
				</div>
			</div>
		</template>
	</n-modal>
</template>

<script lang="ts">
import {
	HelpCircleOutline as HelpIcon,
	AddCircleOutline as AddIcon,
	TrashOutline as TrashIcon,
	CloudUploadOutline as CloudUploadIcon,
	EllipsisVerticalOutline as EllipsisIcon
} from "@vicons/ionicons5";
import { ref, defineComponent } from 'vue';
import type { UploadFileInfo, FormInst, FormItemRule, StepsProps  } from "naive-ui";
import { REGEXP_URL } from '@/config';

let typeOpts = [
	{
		label: '文章知识',
		value: 1
	},
	{
		label: '问答知识-文档',
		value: 2
	},
	{
		label: '问答知识-表格',
		value: 3
	},
	{
		label: '商品库-表格',
		value: 4
	},
	{
		label: '自定义格式',
		value: 5
	},
]

export default defineComponent({
	components: {
		HelpIcon,
		AddIcon,
		CloudUploadIcon,
		TrashIcon,
		EllipsisIcon
	},
	setup() {
		const showModal = ref(false);
		const title = ref('上传知识');
		const currentRef = ref<number | null>(1);
		const fileListRef = ref<UploadFileInfo[]>([]);
		const formRef = ref<FormInst | null>(null);
		const formValue = ref({
			urlList: [
				{
					url: ''
				}
			]
		});
		const kbType = ref(1)


				// methods
		const onShow = (data: any) => {
			showModal.value = true;
		};

		const onHide = () => {
			showModal.value = false;
		};

		const handleUploadChange = (options: {
			file: UploadFileInfo;
			fileList: Array<UploadFileInfo>;
			event?: Event;
		}) => {
			console.log("handleUploadChange---options-----", options);
		};

		const countFileSize = (file: any) => {
			if (!file) {
				return '-'
			}

			let size = 0
			if (file.size) {
				size = file.size / 1024 / 1024
			}

			return size.toFixed(2)
		}

		const delFileClick = (index: number) => {
			fileListRef.value.splice(index, 1)
		}

		const previewFileClick = (file: any) => {
			const url = URL.createObjectURL(file)
			// window.open('https://view.officeapps.live.com/op/view.aspx?src=' + url)
		}

		const addUrlClick = () => {
			formValue.value.urlList.push({
				url: ''
			})
		}

		const removeUrlClick = (index: number) => {
			formValue.value.urlList.splice(index, 1)
		}

		const cancelClick = () => {
			switch(currentRef.value) {
				case 1:
					showModal.value = false;
					break
				case 2:
					currentRef.value = 1;
					title.value = '上传知识';
					break
			}
		}

		const saveClick = () => {
			switch(currentRef.value) {
				case 1:
					currentRef.value = 2;
					title.value = '知识配置';
					break
				case 2:
					showModal.value = false;
					break
			}
		}

		return {
			showModal,
			title,
			current: currentRef,
			currentStatus: ref<StepsProps['status']>('process'),
			fileList: fileListRef,
			form: formRef,
			formValue,
			rules: {
				url: {
					required: true,
					validator (rule: FormItemRule, value: string) {
						if (!value) {
							return new Error(`请输入URL`)
						} else if (!REGEXP_URL.test(value)) {
							return new Error('请输入合法URL')
						}
						return true
					},
					trigger: ['input', 'blur']
				}
			},
			kbType,
			typeOpts,
			onShow,
			onHide,
			handleUploadChange,
			countFileSize,
			delFileClick,
			previewFileClick,
			addUrlClick,
			removeUrlClick,
			cancelClick,
			saveClick
		}
	}
})
</script>

<style lang="scss" scoped>
.mt-0 {
	margin-top: 0;
}
.mt-20 {
	margin-top: 20px;
}
.dialog-content {
	height: 600px;
	overflow: hidden;
	display: flex;
	flex-direction: column;
}
.dialog-footer {
	display: flex;
	width: 100%;
	.footer-left {
		flex: 1;
		overflow: hidden;
		padding: 10px 0;
		.step-box {
			width: 380px;
			margin-left: 2px;
		}
	}
	.footer-right {
		display: flex;
    align-items: flex-end;
	}
}
.tabs-content {
	flex: 1;
	overflow: hidden;
	&.form-list {
		max-height: 540px;
		overflow-y: auto;
	}
}
.file-list {
	display: flex;
	flex-direction: column;
	max-height: 360px;
	overflow-y: auto;
	.file-item {
		display: flex;
		padding: 20px;
		border-radius: 10px;
		border: 1px solid #e0e0e0;
		margin-bottom: 20px;
		box-sizing: border-box;
		&:hover {
			border: 1px solid #1890ff;
		}
		.item-left {
			flex: 0 0 36px;
			margin-right: 10px;
			img {
				width: 36px;
			}
		}
		.item-mid {
			flex: 1;
			overflow: hidden;
		}
		.item-right {
			display: flex;
			align-items: center;
			justify-content: center;
			.select-box {
				width: 160px;
			}
			.pre-btn {
				cursor: pointer;
				&:hover {
					color: #1890ff;
				}
			}
			.del-btn {
				cursor: pointer;
				&:hover {
					color: #1890ff;
				}
			}
		}
	}
}
.url-box {
	display: flex;
	.input-box {
		flex: 1;
		overflow: hidden;
	}
	.action-box {}
}

.knowledge-box {
	flex: 1;
	overflow: hidden;
	display: flex;
	.knowledge-left {
		flex: 1;
		overflow: hidden;
		padding-right: 20px;
		display: flex;
		flex-direction: column;
		.k-title {
			padding: 10px 0;
			display: flex;
			align-items: center;
		}
		.k-list {
			flex: 1;
			overflow-y: auto;
			max-height: initial;
		}
	}
	.knowledge-right {
		flex: 0 0 380px;
		// border-left: 1px solid #e2e2e2;
		.k-title {
			padding: 10px 0;
			display: flex;
			align-items: center;
		}
	}
}

</style>
