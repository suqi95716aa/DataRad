<template>
	<div v-if="!notData" class="chart-box">
		<div v-if="active === 'A0'" class="chart-content">
			<div class="table">
				<div class="table-content">
					<n-data-table
						:columns="columns"
						:data="tableData"
						:pagination="pagination"
						:bordered="false"
						:single-line="false"
						:scroll-x="200 * columnsLength"
						:style="{ height: `${tableHeight}px`, flex: '1' }"
						flex-height
						virtual-scroll
					/>
				</div>
				<!-- <div v-if="columnsLength > 5" class="table-right">
					<n-button text>更多</n-button>
				</div> -->
			</div>
		</div>
		<!-- <div v-if="active === 'A1'" ref="chartRef1" class="chart-content"></div>
		<div
			v-else-if="active === 'A2'"
			ref="chartRef2"
			class="chart-content"
		></div>
		<div
			v-else-if="active === 'A3'"
			ref="chartRef3"
			class="chart-content"
		></div> -->
		<!-- <div class="chart-footer">
			<div class="chart-footer-left">
				<n-popover trigger="hover" v-for="item in chartTypeOpts" :key="item.id" :show-arrow="false">
					<template #trigger>
						<n-button class="mr-10" size="small" :type="active === item.active ? 'info' : 'default'" tertiary circle @click="changeClick(item.active)">
							<template #icon>
								<n-icon :size="14" v-if="item.active === 'A0'"><icon-local-table /></n-icon>
								<n-icon :size="14" v-else-if="item.active === 'A1'"><BarIcon /></n-icon>
								<n-icon :size="14" v-else-if="item.active === 'A2'"><PieIcon /></n-icon>
								<n-icon :size="14" v-else-if="item.active === 'A3'"><LineIcon /></n-icon>
							</template>
						</n-button>
					</template>
					<span>{{ item.name }}</span>
				</n-popover>
			</div>
			<div class="chart-footer-middle">
			</div>
			<div class="chart-footer-right">
				<n-button text @click="showMoreClick">查看完整数据</n-button>
			</div>
			<ChatCardMoreDialog :row-data="$props.cardData" :active="active" ref="moreRef" />
		</div> -->
	</div>
	<div v-else class="empty-box">
		<span>您当前的问题未查询成功，一般是由于问题描述的清晰度引起的。请修改您的问题后再次尝试，<br />或者点击这里</span>
		<a class="a-link" href="javascript:;">查看常见的问答使用手册和帮助</a>。
	</div>
</template>

<script lang="ts">
import {
	SwapHorizontalOutline as SwapIcon,
	BarChart as BarIcon,
	PieChart as PieIcon,
	AnalyticsOutline as LineIcon
} from "@vicons/ionicons5";
import ChatCardMoreDialog from './chart-more-dialog.vue';
import { ref, defineComponent } from "vue";
import type { Ref } from "vue";
import { type ECOption, useEcharts } from "@/composables";

type RowDataType = {
	key: number,
	[key: string]: any
}

export default defineComponent({
	components: {
		SwapIcon,
		BarIcon,
		PieIcon,
		LineIcon,
		ChatCardMoreDialog
	},
	props: {
		cardData: {
			type: Object,
			default() {
				return {}
			}
		}
	},
	setup(props) {
		const sourceType: any = props.cardData.data?.sourceType || {}
		const sourceData: any = props.cardData.data?.sourceData || []
		const active = ref("A0");
		const columnsLength = ref(0);
		const notData = ref(false);
		const moreRef = ref();
		const tableHeight = ref(300);
		const dataLength = ref(0);
		const chartTypeOpts = ref([
			{
				id: '1',
				active: 'A0',
				name: '表格'
			},
			{
				id: '2',
				active: 'A1',
				name: '柱状图'
			},
			{
				id: '3',
				active: 'A2',
				name: '饼图'
			},
			{
				id: '4',
				active: 'A3',
				name: '折线图'
			}
		])
		const pagination = {
			pageSize: 10,
		}

		const sourceKeys = Object.keys(sourceType)

		let columns = sourceKeys.map((key) => {
			return {
				title: key,
      	key
			}
		}) || []

		dataLength.value = sourceData.length;

		notData.value = sourceData.length === 0;
		columnsLength.value = columns.length;

		const sourceNumberType = sourceKeys.filter((key, index) => {
			return sourceType[key] === "number"
		}) || []

		if (sourceNumberType.length === 0) {
			chartTypeOpts.value = []
		}

		// 柱状图
		const data1 = sourceNumberType
		const data2 = sourceData
		// const legendData = ['Email'];

		const tableData: RowDataType[] = data2.map((item: any, index: number) => {
			item.key = index
			return item
		})

		const barSeries: any = data2.map((item: any) => {
			let list: any = sourceNumberType.map((el) => {
				return item[el]
			})
			return {
				// name: legendData[0],
				data: list,
				type: "bar",
			}
		}) || []

		const lineSeries: any = data2.map((item: any) => {
			let list: any = sourceNumberType.map((el) => {
				return item[el]
			})
			return {
				// name: legendData[0],
				data: list,
				type: "line",
			}
		}) || []

		const pieData = data1.map((key: any, index: number) => {
			let value = 0
			data2.forEach((item: any) => {
				if (item[key]) {
					value += item[key]
				}
			})

			return {
				value,
				name: key
			}
		})

		const barOptions = ref<ECOption>({
			toolbox: {
				show: true,
				top: '1.5%',
				right: '4%',
				feature: {
					saveAsImage: {
						name: 'aaa'
					}
				}
			},
			tooltip: {
				trigger: "item",
			},
			// legend: {
			// 	data: legendData,
			// 	top: "2%",
			// 	left: "center",
			// },
			xAxis: {
				type: "category",
				data: data1,
				axisLabel: {
					rotate: -45,
					fontSize: 8
				}
			},
			yAxis: {
				type: "value",
			},
			series: [],
		}) as Ref<ECOption>;

		const pieOptions = ref<ECOption>({
			toolbox: {
				show: true,
				top: '1.5%',
				right: '4%',
				feature: {
					saveAsImage: {
						name: 'aaa'
					}
				}
			},
			tooltip: {
				trigger: "item",
			},
			legend: {
				type: 'scroll',
				orient: 'vertical',
				right: 10,
				top: 100,
				bottom: 20
			},
			series: [
				{
					// name: legendData[0],
					type: "pie",
					radius: ["40%", "70%"],
					avoidLabelOverlap: false,
					itemStyle: {
						borderRadius: 10,
					},
					label: {
						show: false,
						position: "center",
					},
					// emphasis: {
					// 	label: {
					// 		show: true,
					// 		fontSize: 40,
					// 		fontWeight: "bold",
					// 	},
					// },
					labelLine: {
						show: false,
					},
					data: pieData,
				},
			],
		}) as unknown as Ref<ECOption>;

		const lineOptions = ref<ECOption>({
			toolbox: {
				show: true,
				top: '1.5%',
				right: '4%',
				feature: {
					saveAsImage: {
						name: 'aaa'
					}
				}
			},
			grid: {
				bottom: 80,
			},
			// legend: {
			// 	data: legendData,
			// 	top: "2%",
			// 	left: "center",
			// },
			tooltip: {
				trigger: 'axis'
			},
			xAxis: {
				type: "category",
				axisLabel: {
					rotate: -45,
					fontSize: 8
				},
				data: data1,
			},
			yAxis: {
				type: "value",
			},
			series: [],
		}) as Ref<ECOption>;

		barOptions.value.series = barSeries
		lineOptions.value.series = lineSeries

		const { domRef: chartRef1 } = useEcharts(barOptions);
		const { domRef: chartRef2 } = useEcharts(pieOptions);
		const { domRef: chartRef3 } = useEcharts(lineOptions);

		const changeClick = (type: string) => {
			active.value = type;
		};

		const showMoreClick = () => {
			moreRef.value.onShow()
		}

		return {
			active,
			columns,
			columnsLength,
			dataLength,
			tableHeight,
			pagination,
			notData,
			tableData,
			chartTypeOpts,
			moreRef,
			chartRef1,
			chartRef2,
			chartRef3,
			showMoreClick,
			changeClick,
		};
	},
});
</script>

<style lang="scss" scoped>
.chart-box {
	// min-width: 350px;
	// max-width: 908px;
	width: 100%;
	min-height: 300px;
	display: flex;
	flex-direction: column;
	padding: 8px 12px;
	border-radius: 4px;
	background-color: #fff;
	.chart-content {
		width: 100%;
		flex: 1;
		overflow: hidden;
		.table {
			width: 100%;
			// :deep(.n-data-table-th) {
			// 	white-space: nowrap;
			// }
			display: flex;
			.table-content {
				flex: 1;
				overflow: hidden;
			}
			.table-right {
				flex: 0 0 50px;
				display: flex;
				align-items: center;
				justify-content: center;
				border-left: 1px solid var(--n-border-color);
			}
		}
	}
	.chart-footer {
		height: 42px;
		display: flex;
		align-items: center;
		border-top: 1px solid var(--n-border-color);
		padding: 0 12px;
		box-sizing: border-box;
		.mr-10 {
			margin-right: 10px;
		}
		.chart-footer-left {
			flex: 1;
		}
		.chart-footer-right {

		}
	}
}
.empty-box {
	padding: 8px 12px;
	border-radius: 4px;
	background-color: #fff;
	.a-link {
		color: #1890ff;
		text-decoration: underline;
		margin: 0 2px;
	}
}
</style>
