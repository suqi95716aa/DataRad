<template>
	<n-modal
		v-model:show="showModal"
		style="width: 1080px; position: fixed; top: 10vh"
		title="知识点预览"
		:show-icon="false"
		preset="card"
	>
		<div class="dialog-wrapper">
			<div class="dialog-content">
				<div v-if="loading" class="loading-box">
					<n-spin size="small" />
					<span class="loading-text">正在加载...</span>
				</div>
				<div v-if="!loading && loaded && pageList.length" class="list">
					<div class="list-item" v-for="(item, index) in pageList" :key="index">
						<div class="list-item_top">
							<div class="k-title">
								<span># {{ item.sequence }}</span>
								<n-button size="tiny" quaternary circle @click="lookClick(item)">
									<template #icon>
										<n-icon><ResizeIcon /></n-icon>
									</template>
								</n-button>
							</div>
							<div class="k-cont">
								<n-ellipsis line-clamp="2" :tooltip="false">
									<span>{{ item.text }}</span>
									<template #tooltip>
										<n-scrollbar style="max-height: 300px; width: 320px;">
											<p style="word-wrap:break-word; word-break:break-all;">{{ item.text }}</p>
										</n-scrollbar>
									</template>
								</n-ellipsis>
							</div>
						</div>
						<div class="list-item_bom">
							<span>{{ item.text ? item.text?.length : 0 }} 字</span>
						</div>
					</div>
				</div>
				<n-empty
					v-if="!loading && loaded && pageList.length === 0"
					style="margin-top: 30px"
					description="暂无数据"
				/>
			</div>
			<div class="dialog-footer">
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
		<n-modal
			v-model:show="showInnerModal"
			style="width: 500px; height: 800px; overflow-y: auto; position: fixed; top: 10vh"
			class="custom-card"
			preset="card"
			size="huge"
			:bordered="false"
		>
			<div class="content">
				<p>{{ text }}</p>
			</div>
		</n-modal>
	</n-modal>
</template>

<script lang="ts">
import {
	Resize as ResizeIcon
} from "@vicons/ionicons5";
import { ref, defineComponent } from 'vue';
import { useKnowledgeStore } from "@/store";

type infoType = {
	KBID: string,
	KID: string
}

export default defineComponent({
	components: {
		ResizeIcon
	},
	setup () {
		const showModal = ref(false);
		const showInnerModal = ref(false);
		const loading = ref(false);
		const loaded = ref(false);
		const total = ref(0);
		const pageSize = ref(20);
		const currentPage = ref(1);
		const pageList = ref<Knowledge.KDetails[]>([]);
		const info = ref<infoType>();
		const text = ref('');

		// hooks
		const knowledge = useKnowledgeStore()

		// methods
		const onShow = (data: any) => {
			showModal.value = true;
			info.value = data;
			getPageList();
		};

		const onHide = () => {
			showModal.value = false;
		};

		const getPageList = async () => {
			const params = {
				KBID: info.value?.KBID,
				KID: info.value?.KID,
				Limit: currentPage.value * pageSize.value,
				Offset: (currentPage.value - 1) * pageSize.value,
			}

			loading.value = true;
			const results = await knowledge.getKDetails(params);
			loading.value = false;
			loaded.value = true;

			console.log('results----', results)

			if (results) {
				total.value = results.total;
				pageList.value = results.chunks_info;
			}
		}

		const lookClick = (item: any) => {
			text.value = item.text
			showInnerModal.value = true
		}

		const changePage = (page: number) => {
			currentPage.value = page;
			getPageList();
		};


		return {
			showModal,
			showInnerModal,
			loading,
			loaded,
			total,
			pageSize,
			currentPage,
			pageList,
			text,
			onShow,
			onHide,
			changePage,
			lookClick
		}
	}
})
</script>

<style lang="scss" scoped>
.dialog-wrapper {
	height: 600px;
	display: flex;
	flex-direction: column;
}
.dialog-content {
	flex: 1;
	overflow: auto;
}
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
	flex: 1;
	display: flex;
	flex-wrap: wrap;
	overflow: auto;
	.list-item {
		width: 320px;
		height: 126px;
		display: flex;
		flex-direction: column;
		background-color: var(--baseColor);
		border-radius: 6px;
		margin-bottom: 16px;
		margin-right: 16px;
		border: 1px solid rgb(239, 239, 245);
		.list-item_top {
			flex: 1;
			overflow: hidden;
			padding: 10px;
			.k-title {
				display: flex;
				justify-content: space-between;
				margin-bottom: 10px;
			}
			.k-cont {

			}
		}
		.list-item_bom {
			border-top: 1px solid rgb(239, 239, 245);
			padding: 6px 10px;
			font-size: 12px;
			color: #8d8e99;
			display: flex;
			align-items: center;
			box-sizing: border-box;
		}
	}
}
.tooltip-content {
	width: 320px;
}

</style>
<style lang="scss">
.custom-card {
	.n-card-header {
		padding: 10px;
		border-bottom: 1px solid rgb(239, 239, 245);
	}
	.n-card__content {
		padding: 10px;
		.content {
			line-height: 22px;
			word-wrap:break-word;
			word-break:break-all;
			overflow-y: auto;
    	height: 100%;
			padding: 10px;
			padding-top: 0;
			box-sizing: border-box;
		}
	}
}
</style>
