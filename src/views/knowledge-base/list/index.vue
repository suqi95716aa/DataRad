<template>
	<div class="h-full">
		<div class="c-container">
			<div class="c-content">
				<div class="top-action">
					<n-button type="info" size="small" style="height: 34px;" color="#1890ff" @click="addClick">
						<template #icon>
							<n-icon>
								<AddIcon />
							</n-icon>
						</template>
						创建知识库
					</n-button>
					<n-input style="width: 300px;margin-left: 20px;" type="text" v-model:value="search" round placeholder="请输入知识库名称" :on-input="searchChange">
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
						<div class="list-item" v-for="item in pageList" :key="item.id">
							<div class="list-item_top">
								<div class="info">
									<div class="info-left">
										<img src="@/assets/images/xlsx.png" alt="" />
									</div>
									<div class="info-right">
										<n-ellipsis class="i-title" style="max-width: 200px">
											{{ item.name }}
										</n-ellipsis>
									</div>
								</div>
								<n-ellipsis class="desc" :line-clamp="1" style="max-width: 260px">
									{{ item.desc }}
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
	</div>
</template>

<script lang="ts">
import {
	ref,
	defineComponent,
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
import { useAuthStore } from "@/store";
import { routeName } from '@/router';
import { useRouterPush } from '@/composables';


type RowData = {
	[key: string]: any;
};

export default defineComponent({
	name: "ComponentConfigInfo",
	components: {
		TrashIcon,
		AddIcon,
		CreateIcon,
		EyeIcon,
		DownloadIcon
	},
	setup() {
		const search = ref("");
		const submitLoading = ref(false);
		const pageList = ref<RowData[]>([]);
		const currentPage = ref(1);
		const total = ref(0);
		const pageSize = ref(30);
		const loading = ref(false);
		const loaded = ref(false);

		const message = useMessage();
		const dialog = useDialog();
		const { routerPush } = useRouterPush();

		const getPageList = () => {
			let list = [
				{
					id: '001',
					name: '知识库001',
					desc: 'haha'
				},
				{
					id: '002',
					name: '知识库002',
					desc: 'haha111'
				}
			];
			loading.value = true;
			if (search.value) {
				list = list.filter((item: any) => {
					const name: string = item.name || "";
					return name.includes(search.value);
				});
			}
			pageList.value = list.slice((currentPage.value - 1) * pageSize.value, currentPage.value * pageSize.value);
			total.value = list.length;
			loading.value = false;
			loaded.value = true;
		};
		getPageList()

		// 跳转创建知识库页面
		const addClick = () => {
			routerPush({ name: routeName('knowledge-base_create'), query: {} });
		};

		const getInfoClick = (row: any) => {
			routerPush({ name: routeName('knowledge-base_details'), query: { id: row.id } });
		};

		const editClick = (row: any) => {
			routerPush({ name: routeName('knowledge-base_create'), query: {id: row.id} });
		};

		const delClick = (row: any) => {

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

		const submitClick = async () => {

		};

		return {
			search,
			pageList,
			submitLoading,
			SearchOutline,
			currentPage,
			pageSize,
			total,
			loading,
			loaded,
			changePage,
			searchChange,
			queryClick,
			getInfoClick,
			addClick,
			delClick,
			editClick,
			submitClick,
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
								::v-deep .i-title {
									font-size: 16px;
									font-weight: 500;
								}
							}
						}
						::v-deep .desc {
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
										::v-deep path {
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
