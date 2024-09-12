<template>
	<div class="h-full">
		<div class="c-container">
			<div class="c-content">
				<!-- <div class="header">
				</div> -->
				<div class="body">
					<!-- <div class="top-bar">
						<div class="top-bar-actionbar">
							<n-button type="info" color="#1890ff" @click="addClick"
								>添加</n-button
							>
						</div>
						<div class="top-bar-toolbar"></div>
					</div> -->
					<div class="table" ref="table">
						<n-data-table
							:single-line="false"
							:columns="columns"
							:data="tableData"
							:max-height="tableHeight"
						/>
					</div>
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
	TrashOutline as TrashIcon,
	Add as AddIcon,
	CreateOutline as CreateIcon,
	EyeOutline as EyeIcon,
	SearchOutline,
	DownloadOutline as DownloadIcon
} from "@vicons/ionicons5";
import { NButton, NTag, useMessage, useDialog } from "naive-ui";
import { ref, h, nextTick, defineComponent, onMounted } from 'vue';


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
			title: "名称",
			key: "name",
		},
		{
			title: "创建时间",
			key: "CreateTime",
		},
		{
      title: '状态',
      key: 'tags',
      render (row) {
        const tags = row.tags.map((tagKey) => {
          return h(
            NTag,
            {
              style: {
                marginRight: '6px'
              },
              type: 'info',
              bordered: false
            },
            {
              default: () => tagKey
            }
          )
        })
        return tags
      }
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
	components: {
		TrashIcon,
		AddIcon,
		CreateIcon,
		EyeIcon,
		DownloadIcon
	},
	setup () {
		const tableRef = ref(null);
		const tableHeight = ref(0);
		const currentPage = ref(1);
		const pageSize = ref(10);
		const total = ref(0);
		const columns = ref([]);

		const createData = (): RowData[] => [
			{
				key: 0,
				name: 'John Brown',
				CreateTime: '2024-02-03 12:12:30',
				tags: ['待生成']
			},
			{
				key: 1,
				name: 'Jim Green',
				CreateTime: '2024-02-03 12:12:30',
				tags: ['待生成']
			},
			{
				key: 2,
				name: 'Joe Black',
				CreateTime: '2024-02-03 12:12:30',
				tags: ['待生成']
			}
		]


		onMounted(() => {
			resizeTableHeight();
		});

		const resizeTableHeight = () => {
			nextTick(() => {
				let height = tableRef.value?.clientHeight;
				tableHeight.value = height - 120;
			});
		};

		const changePage = (val) => {
			currentPage.value = val
		}

		const getInfoClick = () => {

		}

		const editClick = () => {

		}

		const delClick = () => {

		}

		return {
			table: tableRef,
			tableHeight,
			columns: createColumns({
				getInfoClick,
				editClick,
				delClick,
			}),
			tableData: createData(),
			total,
			currentPage,
			pageSize,
			changePage
		}
	}
})
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
	}
}
</style>
