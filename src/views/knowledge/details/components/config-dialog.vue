<template>
	<n-modal
		v-model:show="showModal"
		style="width: 1080px; position: fixed; top: 20vh"
		:title="title"
		:show-icon="false"
		preset="dialog"
		positive-text="保存"
    negative-text="取消"
		:on-after-leave="onAfterLeaveDialog"
	>
		<div class="dialog-content mt-0">
			<div class="tabs-content">
				<div class="tabs-top">
					<n-radio-group v-model:value="kType" :disabled="fileList.length > 0" name="radiogroup">
						<div class="type-list">
							<div class="type-item">
								<n-icon size="28" :depth="3">
									<icon-local-k-type1 />
								</n-icon>
								<div class="type-item-info">
									<p>直接分段</p>
									<p>选择文本文件，将其分块进行处理</p>
								</div>
								<n-radio :value="1" />
							</div>
							<div class="type-item">
								<n-icon size="32" :depth="3">
									<icon-local-k-type2 />
								</n-icon>
								<div class="type-item-info">
									<p>特定类型标题分段</p>
									<p>将具有预设标题样式的知识进行分段</p>
								</div>
								<n-radio :value="2" />
							</div>
							<div class="type-item">
								<n-icon size="32" :depth="3">
									<icon-local-k-type3 />
								</n-icon>
								<div class="type-item-info">
									<p>自定义类型标题分段</p>
									<p>将具有自定义标题样式的知识进行分段</p>
								</div>
								<n-radio :value="3" />
							</div>
							<div class="type-item">
								<n-icon size="36" :depth="3">
									<icon-local-k-type4 />
								</n-icon>
								<div class="type-item-info">
									<p>表格类型分段</p>
									<p>将具有结构化表格信息分段</p>
								</div>
								<n-radio :value="4" />
							</div>
						</div>
					</n-radio-group>
				</div>
				<div class="tabs-main">
					<div class="tabs-main-left">
						<div class="upload-box">
							<n-upload
								:multiple="false"
								directory-dnd
								action="#"
								:accept="fileAccept"
								:max="1"
								:default-upload="false"
								:show-file-list="false"
								v-model:file-list="fileList"
								@change="uploadChange"
							>
								<n-upload-dragger>
									<div style="margin-bottom: 12px">
										<n-icon size="32" :depth="3">
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
									<n-p depth="3" style="margin-top: 0;">目前仅支持上传 {{ fileAcceptText }} 文件 </n-p>
								</n-upload-dragger>
							</n-upload>
						</div>
						<div class="file-list mt-20">
							<div class="file-item" :class="{ 'disabled': uploading, 'error': uploadFail }" v-for="(item, index) in fileList" :key="item.id">
								<div v-if="uploading" class="file-progress" @click.stop.prevent>
									<n-progress
										type="line"
										:border-radius="0"
										:percentage="percentage"
										:indicator-placement="'inside'"
										processing
									/>
								</div>
								<div class="item-left">
									<img src="@/assets/images/xlsx.png" />
								</div>
								<div class="item-mid">
									<p style="font-size: 14px;">{{ item.name }}</p>
									<p style="font-size: 12px;">{{ countFileSize(item.file) }}MB</p>
								</div>
								<div class="item-right">
									<span v-if="uploadSuccess" class="pre-btn" @click="previewFileClick(item.file)">预览</span>
									<span v-if="uploadFail" class="pre-btn" @click="resetUploadFileClick(item.file)">重新上传</span>
									<n-divider v-if="uploadFail || uploadSuccess" vertical />
									<n-icon class="del-btn" size="16" @click="delFileClick(index)">
										<TrashIcon />
									</n-icon>
								</div>
							</div>
						</div>
						<div class="tabs-form">
							<n-form
								ref="form"
								:inline="false"
								:model="formVal"
								:rules="rules"
								size="small"
							>
								<n-form-item v-if="[1].includes(kType)" label="分块长度" path="size">
									<n-input-number v-model:value="formVal.size" :min="1000" :max="2000" />
									<n-popover trigger="hover">
										<template #trigger>
											<n-icon size="20" style="margin-left: 10px;cursor: pointer;" color="#8d8e99">
												<HelpIcon />
											</n-icon>
										</template>
										<span>您可以为每个知识标记<br/>对应的知识类型，以达到更好<br/>的知识提取效果</span>
									</n-popover>
									<span class="k-def-text" @click="formVal.size = 2000">恢复默认值</span>
								</n-form-item>
								<n-form-item v-if="[1].includes(kType)" label="分块重合数" path="overlap">
									<n-input-number v-model:value="formVal.overlap" :min="50" :max="200" />
									<n-popover trigger="hover">
										<template #trigger>
											<n-icon size="20" style="margin-left: 10px;cursor: pointer;" color="#8d8e99">
												<HelpIcon />
											</n-icon>
										</template>
										<span>您可以为每个知识标记<br/>对应的知识类型，以达到更好<br/>的知识提取效果</span>
									</n-popover>
									<span class="k-def-text" @click="formVal.overlap = 100">恢复默认值</span>
								</n-form-item>
								<n-form-item v-if="[4].includes(kType) && isCsv" label="自定义分割类型" path="delimiter">
									<n-input v-model:value="formVal.delimiter" :maxlength="5" style="width: 217px;" placeholder="请输入" />
									<n-popover trigger="hover">
										<template #trigger>
											<n-icon size="20" style="margin-left: 10px;cursor: pointer;" color="#8d8e99">
												<HelpIcon />
											</n-icon>
										</template>
										<span>您可以为每个知识标记<br/>对应的知识类型，以达到更好<br/>的知识提取效果</span>
									</n-popover>
									<span class="k-def-text" @click="formVal.delimiter = ','">恢复默认值</span>
								</n-form-item>
								<n-form-item v-if="[3].includes(kType)" label="自定义头部类型" path="splitHeadersType">
									<n-select v-model:value="formVal.splitHeadersType" :options="splitTypeOpts" style="width: 300px;" placeholder="请选择" />
									<n-popover trigger="hover">
										<template #trigger>
											<n-icon size="20" style="margin-left: 10px;cursor: pointer;" color="#8d8e99">
												<HelpIcon />
											</n-icon>
										</template>
										<span>您可以为每个知识标记<br/>对应的知识类型，以达到更好<br/>的知识提取效果</span>
									</n-popover>
									<span class="k-def-text" @click="formVal.splitHeadersType = '1'">恢复默认值</span>
								</n-form-item>
							</n-form>
							<n-button type="info" :loading="addLoading" @click="previewsKClick">确定导入</n-button>
						</div>
					</div>
					<div class="tabs-main-right">
						<p class="k-title">
							<span>
								<span>{{ showPreview ? `知识预览（${previewsInfo?.chunk_num}组）` : '类型说明' }}</span>
								<!-- <n-popover trigger="hover">
									<template #trigger>
										<n-icon size="20" style="margin-left: 4px;cursor: pointer;vertical-align: text-bottom;" color="#8d8e99">
											<HelpIcon />
										</n-icon>
									</template>
									<span>您可以为每个知识标记<br/>对应的知识类型，以达到更好<br/>的知识提取效果</span>
								</n-popover> -->
							</span>
							<span v-if="previewsInfo?.file_name" @click="showPreview = !showPreview">{{ showPreview ?  '展示模板' : '展示预览' }}</span>
						</p>
						<div class="k-preview">
							<div v-show="showPreview" class="k-preview-content">
								<div v-if="previewsInfo?.file_name" class="k-preview-list">
									<div v-for="(item, index) in previewsInfo?.chunk_info" :key="index" class="k-preview-item">
										<p class="k-t-1 mb-10"><span class="k-num mr-8">{{ item.chunk_num }}</span>{{ previewsInfo?.file_name }}</p>
										<p class="k-p-2">
											<n-ellipsis expand-trigger="click" line-clamp="5" :tooltip="false">
												{{ item.text }}
											</n-ellipsis>
										</p>
									</div>
								</div>
								<div v-else class="k-preview-empty">暂无可预览内容</div>
							</div>
							<div v-show="!showPreview" class="k-preview-template">
								<KTemplate />
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<template #action>
			<div class="dialog-footer">
				<div class="footer-left">
				</div>
				<div class="footer-right">
					<n-button @click="cancelClick">取消</n-button>
					<n-button type="info" style="margin-left: 20px;" :loading="saveLoading" @click="saveClick">确定保存</n-button>
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
import KTemplate from './k-template.vue';
import { ref, computed, defineComponent } from 'vue';
import { useRoute } from "vue-router";
import type { UploadFileInfo, FormInst, FormItemRule, StepsProps } from "naive-ui";
import { useMessage } from 'naive-ui';
import { useAuthStore, useKnowledgeStore } from '@/store';
import { fetchPreviewsUploadKnowledge } from '@/service';
import { REGEXP_URL } from '@/config';

let splitTypeOpts = [
	{
		label: '连续的数字点分隔符，如 1.1.1.1',
		value: '1'
	},
	{
		label: '圆括号数字样式,，如(1)',
		value: '2'
	},
]

type InfoType = {
	name: string
}

export default defineComponent({
	components: {
		HelpIcon,
		AddIcon,
		CloudUploadIcon,
		TrashIcon,
		EllipsisIcon,
		KTemplate
	},
	emits: ['change'],
	setup(props, ctx) {
		const showModal = ref(false);
		const title = ref('上传知识');
		const fileListRef = ref<UploadFileInfo[]>([]);
		const formRef = ref<FormInst | null>(null);
		const formVal = ref({
			size: 2000,
			overlap:100,
			delimiter: ',',
			splitHeadersType: '1',
			urlList: [
				{
					url: ''
				}
			]
		});
		const showPreview = ref(false);
		const kType = ref(1); // 知识分割类型
		const uploading = ref(false);
		const addLoading = ref(false);
		const saveLoading = ref(false);
		const uploadSuccess = ref(false); // 上传文件成功
		const uploadFail = ref(false); // 上传文件失败
		const fileInfo = ref<InfoType>();
		const KBID = ref("");
		const previewsInfo = ref<Knowledge.Previews>();
		const percentageRef = ref(0); // 上传进度值

		// hooks
		const message = useMessage()
		const { userInfo } = useAuthStore();
		const knowledge = useKnowledgeStore();
		const route = useRoute();
		KBID.value = route.query.id + "";

		// computed
		const fileAccept = computed(() => {
			let res: string = '.xlsx, .docx, .txt, .pdf, .csv, .md'
			switch(kType.value) {
				case 1:
					res = '.docx, .txt, .pdf, .md'
					break
				case 2:
					res = '.docx, .md'
					break
				case 3:
					res = '.docx, .txt, .pdf, .md'
					break
				case 4:
					res = '.xlsx, .csv'
					break
			}
			return res
		})

		const fileAcceptText = computed(() => {
			let res: string = ''
			switch(kType.value) {
				case 1:
					res = 'txt、docx、pdf、md'
					break
				case 2:
					res = 'doc、docx、md'
					break
				case 3:
					res = 'txt、docx、pdf、md'
					break
				case 4:
					res = 'xlsx、csv'
					break
			}
			return res
		})

		const isCsv = computed(() => {
			let res = false
			if (fileListRef.value.length > 0) {
				const obj: UploadFileInfo = fileListRef.value[0]
				if (obj.type === 'text/csv') {
					res = true
				}
			}

			return res
		})

		// methods
		const onShow = (data: any) => {
			showModal.value = true;
		};

		const onHide = () => {
			showModal.value = false;
		};

		const onAfterLeaveDialog = () => {
			console.log('onAfterLeaveDialog-----')
			formVal.value.size = 2000
			formVal.value.overlap = 100
			formVal.value.delimiter = ','
			formVal.value.splitHeadersType = '1'
			formVal.value.urlList = [
				{
					url: ''
				}
			]
			kType.value = 1;
			previewsInfo.value = {} as Knowledge.Previews;
			showPreview.value = false;
			fileListRef.value = [];
		}

		let timer: any = null
		type statusType = 'loading' | 'fail' | 'success'
		const handlePercentageVal = (type?: statusType) => {
			if (type === 'fail') {
				clearInterval(timer)
				return
			} else if (type === 'success') {
				clearInterval(timer)
				percentageRef.value = 100
				return
			}
			percentageRef.value = 10
			timer = setInterval(() => {
				percentageRef.value += 10
				if (percentageRef.value >= 99) {
					percentageRef.value = 99
					clearInterval(timer)
				}
			}, 1000)
		}

		const confirmUploadFile = async (file: any) => {
			uploading.value = true
			uploadSuccess.value = false
			uploadFail.value = false
			const formData = new FormData()
			formData.append('Uid', userInfo.userId)
			formData.append('File', file)
			handlePercentageVal()
			const results = await fetchPreviewsUploadKnowledge(formData)

			if (results.error) {
				uploadFail.value = true
				uploading.value = false
				handlePercentageVal('fail')
				return false;
			}
			const resData: any = results.data || {}

			handlePercentageVal('success')

			setTimeout(() => {
				uploadSuccess.value = true
				uploading.value = false
			}, 500)

			fileInfo.value = {
				name: resData.file_name
			}
			message.success('上传成功')
		}

		const uploadChange = (options: {
			file: UploadFileInfo;
			fileList: Array<UploadFileInfo>;
			event?: Event;
		}) => {
			const file: any = options.file
			confirmUploadFile(file.file)
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
			previewsInfo.value = {} as Knowledge.Previews
			showPreview.value = false
		}

		const previewFileClick = (file: any) => {
			// const url = URL.createObjectURL(file)
			// window.open('https://view.officeapps.live.com/op/view.aspx?src=' + url)
		}

		const addUrlClick = () => {
			formVal.value.urlList.push({
				url: ''
			})
		}

		const removeUrlClick = (index: number) => {
			formVal.value.urlList.splice(index, 1)
		}

		const cancelClick = () => {
			showModal.value = false;
		}

		const resetUploadFileClick = (file: any) => {
			confirmUploadFile(file)
		}

		const previewsKClick = () => {
			if (fileListRef.value.length === 0 || uploading.value || uploadFail.value) return message.warning('请上传文件')
			formRef.value?.validate(async (errors) => {
				if (!errors) {
					let Kconfig = {}
					switch(kType.value) {
						case 1:
							Kconfig = {
								chunk_size: formVal.value.size,
								chunk_overlap: formVal.value.overlap,
							}
							break
						case 2:
							Kconfig = {}
							break
						case 3:
							Kconfig = {
								split_headers_type: formVal.value.splitHeadersType * 1
							}
							break
						case 4:
							Kconfig = {
								delimiter: formVal.value.delimiter,
							}
							break
					}
					const params = {
						Kconfig,
						FileName: fileInfo.value?.name,
						Type: kType.value,
					}

					addLoading.value = true
					const results = await knowledge.previewsK(params)
					addLoading.value = false

					if (results) {
						previewsInfo.value = results
						showPreview.value = true
						message.success('导入成功');
					}
				}
			})
		}

		const saveClick = () => {
			if (fileListRef.value.length === 0 || uploading.value || uploadFail.value) return message.warning('请上传文件')
			formRef.value?.validate(async (errors) => {
				if (!errors) {
					let Kconfig = {}
					switch(kType.value) {
						case 1:
							Kconfig = {
								chunk_size: formVal.value.size,
								chunk_overlap: formVal.value.overlap,
							}
							break
						case 2:
							Kconfig = {}
							break
						case 3:
							Kconfig = {
								split_headers_type: formVal.value.splitHeadersType * 1
							}
							break
						case 4:
							Kconfig = {
								delimiter: formVal.value.delimiter,
							}
							break
					}
					const params = {
						KBID: KBID.value,
						Kconfig,
						FileName: fileInfo.value?.name,
						Type: kType.value,
					}

					saveLoading.value = true
					const results = await knowledge.addK(params)
					saveLoading.value = false

					if (results) {
						message.success('保存成功');
						showModal.value = false;
						ctx.emit('change')
					}
				}
			})
		}

		return {
			showModal,
			title,
			currentStatus: ref<StepsProps['status']>('process'),
			fileList: fileListRef,
			form: formRef,
			formVal,
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
				},
				size: {
					required: true,
					validator (rule: FormItemRule, value: number) {
						if (!value) {
							return new Error(`请输入分块长度`)
						} else if (value < 1000 || value > 2000) {
							return new Error(`请输入1000-2000的数值`)
						}
						return true
					},
					trigger: ['input', 'blur']
				},
				overlap: {
					required: true,
					validator (rule: FormItemRule, value: number) {
						if (!value) {
							return new Error(`请输入分块重叠数`)
						} else if (value < 50 || value > 200) {
							return new Error(`请输入50-200的数值`)
						}
						return true
					},
					trigger: ['input', 'blur']
				},
				delimiter: {
					required: true,
					message: '请输入切割符',
					trigger: ['input', 'blur']
				},
				splitHeadersType: {
					required: true,
					message: '请选择自定义头部类型',
					trigger: ['input', 'blur']
				}
			},
			kType,
			showPreview,
			fileAccept,
			fileAcceptText,
			splitTypeOpts,
			uploading,
			addLoading,
			saveLoading,
			previewsInfo,
			uploadSuccess,
			uploadFail,
			percentage: percentageRef,
			isCsv,
			onShow,
			onHide,
			onAfterLeaveDialog,
			uploadChange,
			countFileSize,
			delFileClick,
			previewFileClick,
			addUrlClick,
			removeUrlClick,
			cancelClick,
			resetUploadFileClick,
			previewsKClick,
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
	display: flex;
	flex-direction: column;
	.tabs-top {
		padding-bottom: 10px;
		margin-bottom: 20px;
		border-bottom: 1px solid #e0e0e0;
		.type-list {
			display: flex;
			.type-item {
				flex: 1;
				overflow: hidden;
				padding: 10px 20px;
				display: flex;
				align-items: center;
				border: 1px solid #e0e0e0;
				border-radius: 8px;
				margin-right: 20px;
				&:last-child {
					margin-right: 0;
				}
				.type-item-info {
					flex: 1;
					overflow: hidden;
					margin: 0 10px;
					p {
						&:nth-child(1) {
							font-size: 14px;
							font-weight: 500;
						}
						&:nth-child(2) {
							font-size: 12px;
							font-weight: 400;
							color: #8d8e99;
						}
					}
				}
			}
		}
	}
	.tabs-main {
		flex: 1;
		display: flex;
		overflow: hidden;
		.tabs-main-left {
			flex: 0 0 50%;
			padding-right: 20px;
			box-sizing: border-box;
			.upload-box {
				:deep(.n-upload-dragger) {
					padding: 10px;
				}
			}
			.tabs-form {
				.k-def-text {
					font-size: 12px;
					font-weight: 400;
					color: #1890ff;
					cursor: pointer;
					margin-left: 10px;
				}
			}
		}
		.tabs-main-right {
			flex: 0 0 50%;
			display: flex;
			flex-direction: column;
			.k-title {
				font-size: 16px;
				font-weight: 500;
				display: flex;
				margin-bottom: 10px;
				&>span {
					&:nth-child(1) {
						flex: 1;
						overflow: hidden;
					}
					&:nth-child(2) {
						font-size: 14px;
						color: #1890ff;
						cursor: pointer;
					}
				}
			}
			.k-preview {
				flex: 1;
				overflow: hidden;
				.k-preview-content {
					height: 100%;
					overflow: auto;

					.k-preview-empty {
						text-align: center;
						padding: 20px;
						color: #8d8e99;
					}
				}
				.k-preview-template {
					height: 100%;
					overflow: auto;
				}
				.k-preview-list {
						display: flex;
						flex-direction: column;
						.k-preview-item {
							width: 100%;
							min-height: 50px;
							background-color: #fafafa;
							padding: 10px;
							box-sizing: border-box;
							border-radius: 8px;
							margin-bottom: 20px;
							&:last-child {
								margin-bottom: 0;
							}
							.mb-10 {
								margin-bottom: 10px;
							}
							.mr-8 {
								margin-right: 8px;
							}
							.k-t-1 {
								font-size: 14px;
								font-weight: 500;
							}
							.k-num {
								padding: 2px 4px;
								border-radius: 2px;
								border: 1px solid #e0e0e0;
								background-color: #fafafa;
							}
							.k-p-1 {
								font-size: 12px;
								font-weight: 500;
							}
							.k-p-2 {
								font-size: 12px;
								font-weight: 500;
								color: #8d8e99;
							}
							.k-flex {
								display: flex;
								justify-content: space-between;
							}
							.k-cur {
								color: #1890ff;
								cursor: pointer;
							}
						}
					}
			}
		}
	}
}
.file-list {
	display: flex;
	flex-direction: column;
	max-height: 360px;
	overflow-y: auto;
	.file-item {
		position: relative;
		display: flex;
		padding: 20px;
		border-radius: 10px;
		border: 1px solid #e0e0e0;
		margin-bottom: 20px;
		box-sizing: border-box;
		&:hover {
			border: 1px solid #1890ff;
		}
		&.disabled {
			&:hover {
				border: 1px solid #e0e0e0;
			}
		}
		&.error {
			border: 1px solid #f5222d;
			&:hover {
				border: 1px solid #f5222d;
			}
		}
		.file-progress {
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			z-index: 9;
			background-color: rgba(0,0,0,0.1);
			border-radius: 10px;
			overflow: hidden;
			box-sizing: border-box;
			display: flex;
			align-items: flex-end;
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
