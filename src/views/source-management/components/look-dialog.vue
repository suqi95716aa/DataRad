<template>
	<n-modal
		v-model:show="show"
		style="width: 1280px; position: fixed; top: 10vh"
		:title="title"
		preset="card"
	>
		<div class="card-content">
			<div class="form">
				<div class="form-item">
					<div class="form-item-select">
						<span class="label">表名：</span>
						<n-select
							v-model:value="sheetName"
							:options="options"
							:on-update:value="selectChange"
							placeholder="请选择"
						/>
					</div>
				</div>
			</div>
			<div class="card-table">
				<!-- <div class="table-inner">
						<n-data-table
							:columns="columns"
							:data="data"
							:max-height="'50vh'"
						/>
					</div> -->
				<n-scrollbar x-scrollable style="height: 100%">
					<n-table
						v-if="loaded && !loading && tHeadList.length"
						:bordered="false"
						:single-line="false"
					>
						<thead>
							<tr>
								<th v-for="(name, index) in tHeadList" :key="index">
									{{ name }}
								</th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="(item, index) in tBodyList" :key="index">
								<td v-for="(name, tdIndex) in item.tdList" :key="tdIndex">
									{{ name }}
								</td>
							</tr>
						</tbody>
					</n-table>
					<div
						v-if="loaded && !loading && tHeadList.length === 0"
						class="table-empty"
					>
						<n-empty description="暂无数据" />
					</div>
				</n-scrollbar>
			</div>
			<div class="pagination">
				<n-pagination
					v-model:page="currentPage"
					v-model:page-size="pageSize"
					:item-count="total"
					show-size-picker
					:page-sizes="[10, 20, 30, 40]"
					:on-update:page="pageChange"
					:on-update:page-size="pageSizeChange"
				/>
			</div>
		</div>
	</n-modal>
</template>
<script lang="ts">
import { reactive, ref, toRefs } from "vue";
import * as api from "../api";
import { useAuthStore } from "@/store";

interface Info {
	SheetNames: [];
	[key: string]: any;
}

export default {
	props: {
		title: {
			type: String,
			default: "",
		},
	},
	setup(props) {
		const state = reactive({
			show: false,
			loading: false,
			options: [],
			currentPage: 1,
			pageSize: 10,
			pageCount: 0,
			total: 0,
			title: props.title,
		});
		const sheetName = ref();
		const rowData = ref();
		const tHeadList: any = ref([]);
		const tBodyList: any = ref([]);
		const loading = ref(false);
		const loaded = ref(false);
		const columnsRef = ref([]);
		const dataRef = ref([]);

		const auth = useAuthStore()

		const getData = async () => {
			if (loading.value) return;
			loading.value = true;
			let results;
			try {
				const formData = new FormData();
				const { ConfigId, Label } = rowData.value || {};
				const currentPage = state.currentPage;
				formData.append("ConfigId", ConfigId);
				formData.append("Label", Label);
				formData.append("Uid", auth.userInfo.userId);
				formData.append("Offset", state.pageSize * (currentPage - 1) + "");
				formData.append("Limit", state.pageSize + "");
				formData.append("SheetName", sheetName.value);
				results = await api.GetDetails(formData);
			} catch (error) {
				console.log("error", error);
			} finally {
				loading.value = false;
				loaded.value = true;
			}

			if (!results) return;

			const { records, total } = results || {};

			state.total = total || 0;
			tHeadList.value = [];
			tBodyList.value = [];
			columnsRef.value = [];
			dataRef.value = [];

			records.forEach((item: any, index: number) => {
				const keys = Object.keys(item) || [];
				if (index === 0) {
					tHeadList.value = keys;
				}
				let tdList = [];
				if (keys.length > 0) {
					for (let i in item) {
						tdList.push(item[i]);
					}
				}
				tBodyList.value.push({ tdList });
			});

			const list: any = [];
			tHeadList.value.forEach((item: string, index: number) => {
				let obj = {
					title: item,
					key: index,
				};
				list.push(obj);
			});

			columnsRef.value = list;

			dataRef.value = tBodyList.value.map((item: any, index: number) => {
				let res = {
					key: index,
					...item.tdList,
				};
				return res;
			});
		};

		const onShow = (data: Info) => {
			rowData.value = data;
			state.show = true;
			let list: any = data.Data || [];
			list =
				list.map((item: any) => {
					return {
						label: item.sheetName,
						value: item.sheetName,
					};
				}) || [];
			state.options = list;

			if (list.length > 0) {
				sheetName.value = list[0].value;
			}

			getData();
		};

		const onHide = () => {
			state.show = false;
		};

		const pageChange = (page: number) => {
			state.currentPage = page;
			getData();
		};

		const pageSizeChange = (size: number) => {
			state.pageSize = size;
			state.currentPage = 1;
			getData();
		};

		const selectChange = (value: string | number | null) => {
			sheetName.value = value;
			state.currentPage = 1;
			getData();
		};

		return {
			...toRefs(state),
			data: dataRef,
			columns: columnsRef,
			sheetName,
			tHeadList,
			tBodyList,
			loading,
			loaded,
			onShow,
			onHide,
			pageChange,
			pageSizeChange,
			selectChange,
		};
	},
};
</script>

<style lang="scss" scoped>
.card-content {
	height: 70vh;
	display: flex;
	flex-direction: column;
	padding: 20px 0;
	.form {
		margin-bottom: 20px;
		.form-item {
			.form-item-select {
				width: 280px;
				display: flex;
				align-items: center;
				.label {
					width: 60px;
				}
				.value {
					flex: 1;
					overflow: hidden;
				}
			}
		}
	}
	.card-table {
		flex: 1;
		overflow: hidden;
		.table-inner {
			width: 100%;
			height: 100%;
			overflow: auto;
		}
		.table-empty {
			padding-top: 20px;
		}
	}
	.pagination {
		margin-top: 20px;
		display: flex;
		justify-content: flex-end;
	}
}
</style>
