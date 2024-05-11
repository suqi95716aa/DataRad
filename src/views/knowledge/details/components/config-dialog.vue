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
			<div class="tabs-content">
				<div class="tabs-top">
					<n-radio-group v-model:value="kType" name="radiogroup">
						<div class="type-list">
							<div class="type-item">
								<n-icon size="22" :depth="3">
									<icon-local-fa-upload />
								</n-icon>
								<div class="type-item-info">
									<p>直接分段</p>
									<p>选择文本文件，直接将其按分段进行处理</p>
								</div>
								<n-radio :value="1" />
							</div>
							<div class="type-item">
								<n-icon size="22" :depth="3">
									<icon-local-fa-upload />
								</n-icon>
								<div class="type-item-info">
									<p>传统标题切割</p>
									<p>选择文本文件，特定文章类型问答</p>
								</div>
								<n-radio :value="2" />
							</div>
							<div class="type-item">
								<n-icon size="22" :depth="3">
									<icon-local-fa-upload />
								</n-icon>
								<div class="type-item-info">
									<p>自定义文章类型</p>
									<p>通过批量导入问答对，要求提前整理好数据</p>
								</div>
								<n-radio :value="3" />
							</div>
							<div class="type-item">
								<n-icon size="22" :depth="3">
									<icon-local-fa-upload />
								</n-icon>
								<div class="type-item-info">
									<p>CSV导入</p>
									<p>选择文本文件，直接将其按分段进行处理</p>
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
								@change="handleUploadChange"
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
							<div class="file-item" uploading v-for="(item, index) in fileList" :key="item.id">
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
						<div class="tabs-form">
							<n-form
								ref="formRef"
								:model="formVal"
								:rules="rules"
								label-placement="left"
								:label-width="110"
								require-mark-placement="right-hanging"
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
								<n-form-item v-if="[1].includes(kType)" label="分块重叠数" path="overlap">
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
								<n-form-item v-if="[4].includes(kType)" label="切割符" path="delimiter">
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
								<n-form-item v-if="[3].includes(kType)" label="头部切分方式" path="splitHeadersType">
									<n-input v-model:value="formVal.splitHeadersType" :maxlength="10" style="width: 217px;" placeholder="请输入" />
									<n-popover trigger="hover">
										<template #trigger>
											<n-icon size="20" style="margin-left: 10px;cursor: pointer;" color="#8d8e99">
												<HelpIcon />
											</n-icon>
										</template>
										<span>您可以为每个知识标记<br/>对应的知识类型，以达到更好<br/>的知识提取效果</span>
									</n-popover>
									<span class="k-def-text" @click="formVal.splitHeadersType = '1.1'">恢复默认值</span>
								</n-form-item>
								<n-form-item>
									<n-button type="info" @click="addClick">确定导入</n-button>
								</n-form-item>
							</n-form>
						</div>
					</div>
					<div class="tabs-main-right">
						<p class="k-title">
							<span>
								<span>{{ showPreview ?  '知识预览' : '知识模板' }}</span>
								<n-popover trigger="hover">
									<template #trigger>
										<n-icon size="20" style="margin-left: 4px;cursor: pointer;vertical-align: text-bottom;" color="#8d8e99">
											<HelpIcon />
										</n-icon>
									</template>
									<span>您可以为每个知识标记<br/>对应的知识类型，以达到更好<br/>的知识提取效果</span>
								</n-popover>
							</span>
							<span @click="showPreview = !showPreview">{{ showPreview ?  '展示模板' : '展示预览' }}</span>
						</p>
						<div class="k-preview">
							<div v-show="showPreview" class="k-preview-content">
								<div class="k-preview-list">
									<div class="k-preview-item">
										<p class="k-t-1">问答类知识-xlsx</p>
										<p class="k-p-1">适用场景</p>
										<p class="k-p-2">适用于问答对类型，表头为"问题"、"答案"，每行一组问答</p>
										<p class="k-p-1">
											<span>建议格式</span>
											<span>下载模板</span>
										</p>
										<div class="k-table">
											<n-table :bordered="false" :single-line="false">
												<thead>
													<tr>
														<th>问题</th>
														<th>答案</th>
													</tr>
												</thead>
												<tbody>
													<tr>
														<td>在这里填充问题，可多个</td>
														<td>在这里填充答案</td>
													</tr>
												</tbody>
											</n-table>
										</div>
									</div>
								</div>
								<div class="k-preview-empty">暂无可预览内容</div>
							</div>
							<div v-show="!showPreview" class="k-preview-template">
								<div class="k-preview-list">
									<div v-for="item in 8" :key="item" class="k-preview-item">
										<p class="k-t-1 mb-10">问答类知识-xlsx</p>
										<p class="k-p-1 mb-10">适用场景</p>
										<p class="k-p-2 mb-10">适用于问答对类型，表头为"问题"、"答案"，每行一组问答</p>
										<p class="k-p-1 k-flex mb-10">
											<span>建议格式</span>
											<span class="k-cur">下载模板</span>
										</p>
										<div class="k-table">
											<n-table :bordered="true" :single-line="false">
												<thead>
													<tr>
														<th style="background-color: #e8e9eb;">问题</th>
														<th style="background-color: #e8e9eb;">答案</th>
													</tr>
												</thead>
												<tbody>
													<tr>
														<td style="font-size: 12px;color: #767c82;">在这里填充问题，可多个</td>
														<td style="font-size: 12px;color: #767c82;">在这里填充答案</td>
													</tr>
												</tbody>
											</n-table>
										</div>
									</div>
								</div>
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
					<n-button type="info" style="margin-left: 20px;" @click="saveClick">确定保存</n-button>
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
import { ref, computed, defineComponent } from 'vue';
import { useRoute } from "vue-router";
import type { UploadFileInfo, FormInst, FormItemRule, StepsProps } from "naive-ui";
import { useMessage } from 'naive-ui';
import { useAuthStore, useKnowledgeStore } from '@/store';
import { fetchPreviewsUploadKnowledge } from '@/service';
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

type InfoType = {
	name: string
}

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
		const formVal = ref({
			size: 2000,
			overlap:100,
			delimiter: ',',
			splitHeadersType: '1.1',
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
		const fileInfo = ref<InfoType>();
		const KBID = ref("");

		// hooks
		const message = useMessage()
		const { userInfo } = useAuthStore();
		const knowledge = useKnowledgeStore();
		const route = useRoute();
		KBID.value = route.query.id + "";

		// computed
		const fileAccept = computed(() => {
			let res: string = '.xlsx, .doc, .docx, .txt, .pdf, .csv, .md'
			switch(kType.value) {
				case 1:
					res = '.doc, .docx, .txt, .pdf, .md'
					break
				case 2:
					res = '.doc, .docx, .md'
					break
				case 3:
					res = '.doc, .docx, .txt, .pdf, .md'
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
					res = 'txt、doc、docx、pdf、md'
					break
				case 2:
					res = 'doc、docx、md'
					break
				case 3:
					res = 'txt、doc、docx、pdf、md'
					break
				case 4:
					res = 'xlsx、csv'
					break
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

		const handleUploadChange = async (options: {
			file: UploadFileInfo;
			fileList: Array<UploadFileInfo>;
			event?: Event;
		}) => {
			console.log("handleUploadChange---options-----", options);
			uploading.value = true
			const file: any = options.file
			const formData = new FormData()
			formData.append('Uid', userInfo.userId)
			formData.append('File', file.file)
			const results = await fetchPreviewsUploadKnowledge(formData)
			uploading.value = false
			if (results.error) return false;
			const resData: any = results.data || {}
			fileInfo.value = {
				name: resData.file_name
			}
			message.success('上传成功')
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

		const addClick = () => {
			if (!fileInfo.value?.name) return message.warning('请上传文件')
			formRef.value?.validate(async (errors) => {
				if (!errors) {
					let Kconfig = {}
					switch(kType.value) {
						case 1:
							Kconfig = {
								chunk_size: formVal.value.size,
								chunk_overlap: formVal.value.overlap,
								file_path: fileInfo.value?.name
							}
							break
						case 2:
							Kconfig = {
								file_path: fileInfo.value?.name
							}
							break
						case 3:
							Kconfig = {
								file_path: fileInfo.value?.name,
								split_headers_type: ''
							}
							break
						case 4:
							Kconfig = {
								file_path: fileInfo.value?.name,
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

					addLoading.value = true
					const results = await knowledge.addK(params)
					addLoading.value = false

					if (results) {
						message.success('保存成功');
					}
				}
			})
		}

		const delFileClick = (index: number) => {
			fileListRef.value.splice(index, 1)
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
					handleAddFile();
					return false;
					currentRef.value = 2;
					title.value = '知识配置';
					break
				case 2:
					showModal.value = false;
					break
			}
		}

		const handleAddFile = () => {
			const fileList = fileListRef.value;
			console.log('fileList-----', fileList)
		}


		return {
			showModal,
			title,
			current: currentRef,
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
				}
			},
			kType,
			showPreview,
			fileAccept,
			fileAcceptText,
			typeOpts,
			uploading,
			addLoading,
			onShow,
			onHide,
			handleUploadChange,
			countFileSize,
			delFileClick,
			previewFileClick,
			addUrlClick,
			removeUrlClick,
			cancelClick,
			addClick,
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
					overflow: hidden;

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
							.k-t-1 {
								font-size: 14px;
								font-weight: 500;
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
