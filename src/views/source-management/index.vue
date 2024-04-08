<template>
	<div class="h-full">
		<div class="c-container">
			<div class="c-content">
				<!-- <div class="header">
					<div class="search-box">
						<div class="input">
							<div class="label">文件名称</div>
							<div class="value">
								<n-input
									v-model:value="search"
									type="text"
									placeholder="请输入"
								/>
							</div>
						</div>
						<n-button type="info" color="#1890ff" @click="queryClick"
							>查询</n-button
						>
					</div>
				</div>
				<div class="body">
					<div class="top-bar">
						<div class="top-bar-actionbar">
							<n-button type="info" color="#1890ff" @click="addClick"
								>添加</n-button
							>
						</div>
						<div class="top-bar-toolbar"></div>
					</div>
					<div class="table" ref="table">
						<n-data-table
							:single-line="false"
							:columns="columns"
							:data="pageList"
							:pagination="pagination"
							:max-height="tableHeight"
						/>
					</div>
				</div>
				<div class="footer"></div> -->
				<div class="top-action">
					<n-button type="info" size="small" style="height: 34px;" color="#1890ff" @click="addClick">
						<template #icon>
							<n-icon>
								<AddIcon />
							</n-icon>
						</template>
						添加
					</n-button>
					<n-input style="width: 300px;margin-left: 20px;" type="text" v-model:value="search" round placeholder="请输入文件名" :on-input="searchChange">
						<template #prefix>
							<n-icon :component="SearchOutline" />
						</template>
					</n-input>
				</div>
				<div class="main">
					<div v-if="loading" class="loading-box">
						<n-spin size="small" />
						<span class="loading-text">正在加载...</span>
					</div>
					<div v-if="!loading && loaded && pageList.length" class="list">
						<div class="list-item" v-for="item in pageList" :key="item.ConfigId">
							<div class="list-item_top">
								<div class="info">
									<div class="info-left">
										<img src="@/assets/images/xlsx.png" alt="" />
									</div>
									<div class="info-right">
										<n-ellipsis class="i-title" style="max-width: 200px">
											{{ item.SourceName }}
										</n-ellipsis>
									</div>
								</div>
								<n-ellipsis class="desc" :line-clamp="1" style="max-width: 260px">
									创建时间：{{ item.CreateTime }}
								</n-ellipsis>
							</div>
							<div class="list-item_bom">
								<div class="btn-group">
									<div class="btn-item">
										<n-icon size="20" @click="getInfoClick(item)">
											<EyeIcon />
										</n-icon>
									</div>
									<div class="btn-item">
										<n-icon size="20" @click="editClick(item)">
											<CreateIcon />
										</n-icon>
									</div>
									<div class="btn-item">
										<n-icon size="20" @click="downloadClick(item)">
											<DownloadIcon />
										</n-icon>
									</div>
									<div class="btn-item">
										<n-icon size="20" @click="delClick(item)">
											<TrashIcon />
										</n-icon>
									</div>
								</div>
							</div>
						</div>
					</div>
					<n-empty v-if="!loading && loaded && pageList.length === 0" style="margin-top: 30px;" description="暂无数据" />
				</div>
				<div class="footer">
					<n-pagination :item-count="total" :page-size="pageSize" :page="currentPage" :on-update:page="changePage">
						<template #prefix="{ itemCount }">
							共 {{ itemCount }} 条
						</template>
					</n-pagination>
				</div>
			</div>
		</div>

		<!-- 弹框 -->
		<n-modal
			v-model:show="showModal"
			style="width: 960px"
			:title="title"
			preset="dialog"
			:loading="submitLoading"
			positive-text="确定"
			negative-text="取消"
			:on-after-leave="onAfterLeave"
			@positive-click="submitClick"
			@negative-click="cancelClick"
		>
			<div class="card-content">
				<n-upload
					:multiple="false"
					directory-dnd
					action="#"
					accept=".xlsx"
					:max="1"
					:default-upload="false"
					v-model:file-list="fileList"
					@change="handleUploadChange"
				>
					<n-upload-dragger>
						<div style="margin-bottom: 12px">
							<n-icon size="48" :depth="3">
								<icon-local-xlsx />
							</n-icon>
						</div>
						<n-text style="font-size: 16px">
							点击或者拖动文件到该区域来上传
						</n-text>
						<n-p depth="3" style="margin: 8px 0 0 0"> 仅支持xlsx文件 </n-p>
					</n-upload-dragger>
				</n-upload>
			</div>
		</n-modal>
		<look-dialog ref="lookRef" :title="lookTitle" />
	</div>
</template>

<script lang="ts">
import {
	h,
	ref,
	reactive,
	defineComponent,
	onMounted,
	nextTick,
	watch,
} from "vue";
import {
	TrashOutline as TrashIcon,
	Add as AddIcon,
	CreateOutline as CreateIcon,
	EyeOutline as EyeIcon,
	SearchOutline,
	DownloadOutline as DownloadIcon
} from "@vicons/ionicons5";
import { NButton, useMessage, useDialog } from "naive-ui";
import type { UploadFileInfo } from "naive-ui";
import type { DataTableColumns } from "naive-ui";
import { useAuthStore } from "@/store";
import * as api from "./api";
import { LookDialog } from './components';

type RowData = {
	[key: string]: any;
};

const createColumns = ({
	getInfoClick,
	editClick,
	delClick,
}: {
	getInfoClick: (rowData: RowData) => void;
	editClick: (rowData: RowData) => void;
	delClick: (rowData: RowData) => void;
}): DataTableColumns<RowData> => {
	return [
		{
			title: "文件名称",
			key: "SourceName",
		},
		// {
		// 	title: "表名",
		// 	key: "SheetNames",
		// 	render(row) {
		// 		const SheetNames = row.SheetNames || [];
		// 		return SheetNames.join("、") || "-";
		// 	},
		// },
		{
			title: "创建时间",
			key: "CreateTime",
		},
		{
			title: "更新时间",
			key: "UpdateTime",
		},
		{
			title: "操作",
			key: "actions",
			render(row) {
				return h("div", [
					h(
						NButton,
						{
							size: "small",
							type: "info",
							color: "#1890ff",
							onClick: () => getInfoClick(row),
						},
						{ default: () => "查看" }
					),
					h(
						NButton,
						{
							style: { "margin-left": "10px" },
							size: "small",
							type: "info",
							color: "#1890ff",
							onClick: () => editClick(row),
						},
						{ default: () => "编辑" }
					),
					h(
						NButton,
						{
							style: { "margin-left": "10px" },
							type: "error",
							size: "small",
							onClick: () => delClick(row),
						},
						{ default: () => "删除" }
					),
				]);
			},
		},
	];
};

export default defineComponent({
	name: "ComponentConfigInfo",
	components: {
		LookDialog,
		TrashIcon,
		AddIcon,
		CreateIcon,
		EyeIcon,
		DownloadIcon
	},
	setup() {
		const search = ref("");
		const table = ref();
		const tableHeight = ref(0);
		const tableData: any = ref([]);
		const showModal = ref(false);
		const title = ref("添加数据源");
		const fileListRef = ref<UploadFileInfo[]>([]);
		const submitLoading = ref(false);
		const isUpdate = ref(false);
		const updateRow: any = ref({});
		const pageList = ref<RowData[]>([]);
		const lookRef = ref();
		const lookTitle = ref('');
		const currentPage = ref(1);
		const total = ref(0);
		const pageSize = ref(30);
		const loading = ref(false);
		const loaded = ref(false);

		const message = useMessage();
		const dialog = useDialog();

		const paginationReactive = reactive({
			page: 1,
			pageSize: 10,
			pageSizes: [10, 20, 30, 40],
			showSizePicker: true,
			onChange: (page: number) => {
				paginationReactive.page = page;
			},
			onUpdatePageSize: (pageSize: number) => {
				paginationReactive.pageSize = pageSize;
				paginationReactive.page = 1;
			},
		});

		const auth = useAuthStore();

		const resizeTableHeight = () => {
			nextTick(() => {
				let height = table.value?.clientHeight;
				tableHeight.value = height - 120;
			});
		};

		const getPageList = () => {
			let list = tableData.value || [];
			loading.value = true;
			if (search.value) {
				list = list.filter((item: any) => {
					const name: string = item.SourceName || "";
					return name.includes(search.value);
				});
			}
			pageList.value = list.slice((currentPage.value - 1) * pageSize.value, currentPage.value * pageSize.value);
			total.value = list.length;
			loading.value = false;
			loaded.value = true;
		};

		watch(
			() => auth.wdConfigInfo,
			(newInfo) => {
				let list = newInfo || [];
				tableData.value = list;
				getPageList();
				resizeTableHeight();
			},
			{ deep: true, immediate: true }
		);

		onMounted(() => {
			resizeTableHeight();
		});

		const getInfoClick = (rowData: RowData) => {
			lookTitle.value = rowData.SourceName;
			lookRef.value.onShow(rowData)
		};

		const editClick = (rowData: RowData) => {
			fileListRef.value = [
				{
					id: rowData.ConfigId,
					name: rowData.SourceName,
					status: "finished",
				},
			];
			updateRow.value = rowData;
			title.value = "编辑数据源";
			isUpdate.value = true;
			showModal.value = true;
		};

		const delClick = (rowData: RowData) => {
			dialog.warning({
				title: "删除提示",
				content: "您确定要删除该记录吗?",
				positiveText: "确定",
				negativeText: "取消",
				onPositiveClick: async () => {
					const formData = new FormData();
					formData.append("Uid", auth.userInfo.userId);
					formData.append("ConfigId", rowData.ConfigId);
					formData.append("Label", rowData.Label);
					const res = await api.DelObj(formData);

					if (res) {
						const id: string = res.ConfigId || "";
						auth.delWdConfigInfo(id);
						message.success("删除成功");
					}
				},
				onNegativeClick: () => {
					// message.error('不确定')
				},
			});
		};

		const handleUploadChange = (options: {
			file: UploadFileInfo;
			fileList: Array<UploadFileInfo>;
			event?: Event;
		}) => {
			console.log("handleUploadChange---options-----", options);
		};

		let timer: any = null
		const searchChange = (value: any) => {
			if (timer) {
				clearTimeout(timer)
			}

			timer = setTimeout(() => {
				currentPage.value = 1;
				getPageList();
			}, 1000)
		}

		const changePage = (page: number) => {
			currentPage.value = page;
			getPageList();
		}

		const queryClick = () => {
			getPageList();
		};

		const addClick = () => {
			title.value = "添加数据源";
			showModal.value = true;
		};

		const downloadClick = (row: RowData) => {
			message.info("开发中");
		}

		const handleAdd = async (formData: any) => {
			const { data } = await api.AddObj(formData);
			console.log("data----handleAdd", data);
			if (data) {
				message.success("添加成功");
				auth.addWdConfigInfo(data);
				return true;
			}
			message.error("添加失败");
			return false;
		};

		const handleUpdate = async (formData: any) => {
			const { data } = await api.UpdateObj(formData);
			if (data) {
				const id = updateRow.value?.ConfigId;
				auth.updateWdConfigInfo(id, data);
				message.success("更新成功");
				return true;
			}
			message.success("更新失败");
			return false;
		};

		const submitClick = async () => {
			const obj = fileListRef.value[0] || {};

			if (!obj.file) {
				message.warning("请选择要上传的文件");
				return false;
			}

			const formData = new FormData();
			formData.append("Label", "Excel");
			formData.append("Uid", auth.userInfo.userId);
			formData.append("FileName", obj.file);

			submitLoading.value = true;
			try {
				if (isUpdate.value) {
					formData.append("ConfigId", updateRow.value?.ConfigId);
					await handleUpdate(formData);
				} else {
					await handleAdd(formData);
				}
			} catch (error) {}
			submitLoading.value = false;
		};

		const cancelClick = () => {
			console.log("onCloseModal");
		};

		const onAfterLeave = () => {
			fileListRef.value = [];
			updateRow.value = {};
			isUpdate.value = false;
		};

		return {
			search,
			table,
			tableHeight,
			pageList,
			showModal,
			title,
			submitLoading,
			lookRef,
			lookTitle,
			SearchOutline,
			fileList: fileListRef,
			columns: createColumns({
				getInfoClick,
				editClick,
				delClick,
			}),
			pagination: paginationReactive,
			currentPage,
			pageSize,
			total,
			loading,
			loaded,
			changePage,
			handleUploadChange,
			searchChange,
			queryClick,
			getInfoClick,
			addClick,
			delClick,
			editClick,
			downloadClick,
			submitClick,
			cancelClick,
			onAfterLeave,
		};
	},
});
</script>

<style lang="scss" scoped>
.c-container {
	height: 100%;
	width: 100%;
	position: relative;
	display: flex;
	flex-direction: column;
	flex: 1;
	background-color: var(--baseColor);
	.c-content {
		position: absolute;
		width: 100%;
		top: 0;
		bottom: 0;
		display: flex;
		flex-direction: column;
		padding: 20px;
		.header {
			// min-height: 90px;
			border: 1px solid var(--n-border-color);
			margin: 10px 10px 5px;
			flex-shrink: 0;
			border: 1px solid rgb(239, 239, 245);
			.search-box {
				padding: 20px 24px;
				.input {
					display: inline-flex;
					align-items: center;
					margin-right: 20px;
					.value {
						width: 150px;
						margin-left: 10px;
					}
				}
			}
		}
		.body {
			flex: 1;
			overflow-y: auto;
			margin: 5px 10px 10px;
			border: 1px solid rgb(239, 239, 245);
			display: flex;
			flex-direction: column;
			.top-bar {
				min-height: 54px;
				border-bottom: 1px solid rgb(239, 239, 245);
				display: flex;
				justify-content: space-between;
				.top-bar-actionbar {
					margin: 10px;
				}
			}
			.table {
				flex: 1;
				padding: 10px;
			}
		}
		.footer {
			flex-shrink: 0;
			margin-top: 20px;
		}

		.top-action {
			margin-bottom: 20px;
			display: flex;
			align-items: center;
		}

		.main {
			flex: 1;
			overflow-y: auto;
			.loading-box {
				width: 100px;
				margin: 0 auto;
				margin-top: 30px;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				.loading-text {
					margin-top: 8px;
				}
			}
			.list {
				height: initial;
				display: flex;
				flex-wrap: wrap;
				.list-item {
					width: 300px;
					height: 156px;
					display: flex;
					flex-direction: column;
					background-color: var(--baseColor);
					border-radius: 6px;
					margin-bottom: 16px;
					margin-right: 16px;
					border: 1px solid rgb(239, 239, 245);
					.list-item_top {
						flex: 1;
						display: flex;
						flex-direction: column;
						padding: 12px 16px;
						box-sizing: border-box;
						overflow: hidden;
						.info {
							display: flex;
							margin-bottom: 8px;
							.info-left {
								flex: 0 0 48px;
								display: flex;
								align-items: center;
								justify-content: center;
								width: 48px;
								height: 48px;
								margin-right: 16px;
								img {
									max-width: 100%;
									max-height: 100%;
								}
							}
							.info-right {
								:deep(.i-title) {
									font-size: 16px;
									font-weight: 500;
								}
							}
						}
						:deep(.desc) {
							font-size: 14px;
							font-weight: 400;
							color: rgb(118, 124, 130);
						}
					}
					.list-item_bom {
						height: 48px;
						border-top: 1px solid #f3f4f6;
						.btn-group {
							display: flex;
							padding: 10px 0;
							height: 100%;
							.btn-item {
								position: relative;
								flex: 1;
								display: flex;
								align-items: center;
								justify-content: center;
								border-right: 1.5px solid #f3f4f6;
								&:last-child {
									border-right: none;
								}
								.n-icon {
									cursor: pointer;
									&:hover {
										color: #1890ff;
									}

								}
								.c-icon {
									&:hover {
										:deep(path) {
											fill: #1890ff;
										}
									}
								}
							}
						}
					}
				}
			}
		}
	}
}
</style>
