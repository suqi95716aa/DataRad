<template>
	<div class="knowledge-details">
		<div class="knowledge-wrapper">
			<div class="knowledge-nav">
				<div class="nav-back">
					<n-icon size="26" @click="backClick">
						<ArrowBackIcon />
					</n-icon>
				</div>
				<div class="nav-info">
					<div class="nav-info-left">
						<div
							class="icon-box"
							:style="{ backgroundColor: kbase?.KBColor || '#1890ff' }"
						>
							<img :src="getKbIcon(kbase?.KBBGImg || 'help')" />
						</div>
					</div>
					<div class="nav-info-right">
						<h5 class="nav-title">
							<n-ellipsis style="max-width: 200px;">
								{{ kbase?.KBName }}
								<template #tooltip>
									<div style="text-align: center; max-width: 200px;">
										{{ kbase?.KBName }}
									</div>
								</template>
							</n-ellipsis>
						</h5>
						<p class="nav-sub-title">
							<n-ellipsis style="max-width: 200px; ">
								{{ kbase?.KBDesc }}
								<template #tooltip>
									<div style="text-align: center; max-width: 200px;">
										{{ kbase?.KBDesc }}
									</div>
								</template>
							</n-ellipsis>
						</p>
					</div>
				</div>
			</div>
			<n-divider />
			<div class="knowledge-action">
				<n-button
					type="info"
					size="small"
					style="height: 34px"
					color="#1890ff"
					@click="addClick"
				>
					<template #icon>
						<n-icon>
							<AddIcon />
						</n-icon>
					</template>
					上传知识
				</n-button>
				<n-input
					style="width: 300px; margin-left: 20px"
					type="text"
					v-model:value="searchVal"
					round
					placeholder="请输入知识名称"
					:on-input="searchValChange"
				>
					<template #prefix>
						<n-icon :component="SearchOutlineIcon" />
					</template>
				</n-input>
			</div>
			<div class="knowledge-content">
				<div v-if="loading" class="loading-box">
					<n-spin size="small" />
					<span class="loading-text">正在加载...</span>
				</div>
				<div v-if="!loading && loaded && pageList.length" class="list">
					<div class="list-item" v-for="item in pageList" :key="item.id">
						<div class="list-item_top">
							<div class="info">
								<div class="info-left">
									<!-- <img src="@/assets/images/zsk.png" alt="" /> -->
									<file-type-icon :type="getFileType(item.KName)" :size="36" />
								</div>
								<div class="info-right">
									<n-ellipsis class="i-title" style="max-width: 200px">
										{{ item.KName }}
									</n-ellipsis>
								</div>
							</div>

							<div class="update-time">
								<!-- <span>{{ 0 }} 字</span><n-divider vertical /> -->
								<span>新建时间：{{ item.KCreateTime }}</span>
							</div>
							<!-- <div class="kb-id">
								<span>文档id：{{ item.KID }}</span>
								<n-popover trigger="hover">
									<template #trigger>
										<n-icon
											class="copy-icon"
											size="14"
											@click="copyClick(item.KID)"
										>
											<CopyIcon />
										</n-icon>
									</template>
									<span>复制</span>
								</n-popover>
							</div> -->
						</div>
						<div class="list-item_bom">
							<div class="btn-group">
								<div class="btn-item">
									<n-popover trigger="hover">
										<template #trigger>
											<n-icon size="20" @click="previewClick(item)">
												<EyeIcon />
											</n-icon>
										</template>
										<span>预览</span>
									</n-popover>
								</div>
								<!-- <div class="btn-item">
									<n-popover trigger="hover">
										<template #trigger>
											<n-icon size="20" @click="editClick(item)">
												<CreateIcon />
											</n-icon>
										</template>
										<span>编辑</span>
									</n-popover>
								</div> -->
								<!-- <div class="btn-item">
									<n-popover trigger="hover">
										<template #trigger>
											<n-icon size="20" @click="downloadClick(item)">
												<DownloadIcon />
											</n-icon>
										</template>
										<span>下载</span>
									</n-popover>
								</div> -->
								<div class="btn-item">
									<n-popconfirm
										positive-text="确定"
										@positive-click="delClick(item)"
									>
										<template #trigger>
											<n-popover trigger="hover">
												<template #trigger>
													<n-icon size="20">
														<TrashIcon />
													</n-icon>
												</template>
												<span>删除</span>
											</n-popover>
										</template>
										确定删除该知识？
									</n-popconfirm>
								</div>
							</div>
						</div>
					</div>
				</div>
				<n-empty
					v-if="!loading && loaded && pageList.length === 0"
					style="margin-top: 30px"
					description="暂无数据"
				/>
			</div>
			<div class="knowledge-footer">
				<n-pagination
					:item-count="total"
					:page-size="pageSize"
					:page="currentPage"
					:on-update:page="changePage"
				>
					<template #prefix="{ itemCount }"> 共 {{ itemCount }} 条 </template>
				</n-pagination>
			</div>
		</div>

		<!-- 弹框 -->
		<ConfigDialog ref="configRef" @change="createChange" />
		<PreviewsDialog ref="previewsRef" />
	</div>
</template>

<script lang="ts">
import {
	Add as AddIcon,
	CopyOutline as CopyIcon,
	SearchOutline as SearchOutlineIcon,
	ArrowBack as ArrowBackIcon,
	TrashOutline as TrashIcon,
	CreateOutline as CreateIcon,
	EyeOutline as EyeIcon,
	DownloadOutline as DownloadIcon,
} from "@vicons/ionicons5";
import { useMessage } from "naive-ui";
import ConfigDialog from "./components/config-dialog.vue";
import PreviewsDialog from './components/previews-dialog.vue';
import { ref, watch, defineComponent } from "vue";
import { routeName } from "@/router";
import { useRoute } from "vue-router";
import { useRouterPush } from "@/composables";
import { useTabStore } from "@/store";
import { getKbIcon } from "@/config";
import { useKnowledgeStore } from "@/store";

type ItemType = {
	[key: string]: any;
};

export default defineComponent({
	components: {
		ConfigDialog,
		AddIcon,
		CopyIcon,
		ArrowBackIcon,
		TrashIcon,
		CreateIcon,
		EyeIcon,
		DownloadIcon,
		PreviewsDialog
	},
	setup() {
		const tabStore = useTabStore();
		tabStore.setActiveTabTitle("知识库详情");
		const searchVal = ref("");
		const loading = ref(false);
		const loaded = ref(false);
		const pageList = ref<ItemType[]>([]);
		const currentPage = ref(1);
		const total = ref(0);
		const pageSize = ref(30);
		const configRef = ref();
		const previewsRef = ref();
		const KBID = ref("");
		const kbase = ref<Knowledge.Base>();
		const delLoading = ref(false);

		const { routerPush } = useRouterPush();
		const knowledge = useKnowledgeStore();
		const route = useRoute();
		KBID.value = route.query.id + "";
		kbase.value = knowledge.knowledgeBaseList.find(
			(item: Knowledge.Base) => item.KBID === KBID.value
		);

		// hooks
		const message = useMessage();

		const init = async () => {
			loading.value = true;
			await knowledge.getKBList()
			kbase.value = knowledge.knowledgeBaseList.find(
				(item: Knowledge.Base) => item.KBID === KBID.value
			);
			getPageList()
		}
		init()

		// methods
		const getPageList = () => {
			let list = kbase.value?.data || [];
			if (searchVal.value) {
				list = list.filter((item: any) => {
					const name: string = item.KName || "";
					return name.includes(searchVal.value);
				});
			}
			pageList.value = list.slice(
				(currentPage.value - 1) * pageSize.value,
				currentPage.value * pageSize.value
			) as [];
			total.value = list.length;
			loading.value = false;
			loaded.value = true;
		};

		const createChange = () => {
			getPageList()
		}

		const backClick = () => {
			routerPush({ name: routeName("knowledge_list") });
		};

		let timer: any = null;
		const searchValChange = (value: any) => {
			if (timer) {
				clearTimeout(timer);
			}

			timer = setTimeout(() => {
				currentPage.value = 1;
				getPageList();
			}, 1000);
		};

		const changePage = (page: number) => {
			currentPage.value = page;
			getPageList();
		};

		const addClick = async () => {
			configRef.value.onShow();
		};

		const previewClick = (item: ItemType) => {
			previewsRef.value.onShow({
				KBID: KBID.value,
				KID: item.KID
			});
		};

		const editClick = (item: ItemType) => {
			configRef.value.onShow();
		};

		const downloadClick = (item: ItemType) => {};

		const delClick = async (item: ItemType) => {
			if (delLoading.value) return
			delLoading.value = true
			const results = await knowledge.delK(KBID.value, item.KID);
			delLoading.value = false
			if (results) {
				getPageList()
				message.success('删除成功');
			}
		};

		const copyClick = (val: string) => {
			navigator.clipboard.writeText(val);
			message.success("已复制");
		};

		const getFileType = (name: string) => {
			let res: string = ''
			let list = ['md', 'doc', 'txt', 'pdf', 'xlsx', 'csv', 'docx']
			let arr = name.split('.') || []
			let len = arr.length
			let type = arr[len - 1] || ''

			if (list.includes(type)) {
				res = type
			}

			return res
		}

		return {
			configRef,
			previewsRef,
			loading,
			loaded,
			searchVal,
			total,
			currentPage,
			pageSize,
			pageList,
			kbase,
			SearchOutlineIcon,
			getKbIcon,
			backClick,
			addClick,
			searchValChange,
			changePage,
			previewClick,
			editClick,
			downloadClick,
			delClick,
			copyClick,
			createChange,
			getFileType
		};
	},
});
</script>

<style lang="scss" scoped>
.knowledge-details {
	height: 100%;
	width: 100%;
}
.knowledge-wrapper {
	height: 100%;
	width: 100%;
	position: relative;
	display: flex;
	flex-direction: column;
	flex: 1;
	background-color: var(--baseColor);
}
.knowledge-nav {
	padding: 20px;
	display: flex;
	align-items: center;
	padding-bottom: 0;
	.nav-back {
		margin-right: 20px;
		cursor: pointer;
	}
	.nav-info {
		display: flex;
		.nav-info-left {
			margin-right: 20px;
			.icon-box {
				width: 46px;
				height: 46px;
				border-radius: 6px;
				background-color: #d1d3d6;
				display: flex;
				align-items: center;
				justify-content: center;
				border-radius: 8px;
				img {
					width: 32px;
				}
			}
		}
		.nav-info-right {
			.nav-title {
				font-weight: 600;
				font-size: 16px;
				line-height: 22px;
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;
				max-width: 200px;
			}
			.nav-sub-title {
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;
				max-width: 200px;
				color: #5e5e66;
			}
		}
	}
}
.knowledge-action {
	padding: 0 20px 20px 20px;
}
.knowledge-content {
	flex: 1;
	padding: 20px;
	overflow-y: auto;
	box-sizing: border-box;
	padding-top: 0;
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
		display: flex;
		flex-wrap: wrap;
		.list-item {
			width: 380px;
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
				justify-content: space-around;
				.info {
					display: flex;
					margin-bottom: 8px;
					.info-left {
						flex: 0 0 32px;
						display: flex;
						align-items: center;
						justify-content: center;
						width: 32px;
						height: 32px;
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
				.update-time {
					font-size: 14px;
					font-weight: 400;
					color: rgb(118, 124, 130);
				}
				.kb-id {
					font-size: 14px;
					font-weight: 400;
					color: rgb(118, 124, 130);
					.copy-icon {
						margin-left: 6px;
						vertical-align: middle;
						cursor: pointer;
					}
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
.knowledge-footer {
	padding: 20px;
}
</style>
