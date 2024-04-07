<template>
	<n-modal
		v-model:show="show"
		style="width: 80vw; position: fixed; top: 5vh"
		:title="title"
		preset="card"
	>
		<div class="modal-wrapper">
			<div class="modal-content">
				<div class="chart-wrapper">
					<div v-if="active === 'A0'" class="chart-content">
						<div class="table">
							<div ref="tableContentRef" class="table-content">
								<n-data-table
									:columns="columns"
									:data="tableData"
									:bordered="false"
									:single-line="false"
									:pagination="pagination"
									:scroll-x="200 * columnsLength"
									:style="{ height: `${tableHeight}px` }"
									flex-height
									virtual-scroll
								/>
							</div>
						</div>
					</div>
					<div v-if="active === 'A1'" class="chart-content">
						<div ref="chartRef1" class="chart-box"></div>
						<div class="set-box">
							<n-popover placement="left" trigger="click" style="padding: 4px">
								<template #trigger>
									<n-icon size="18" color="#797979" class="set-icon">
										<SettingsIcon />
									</n-icon>
								</template>
								<div class="set-box-list">
									<n-popover style="max-height: 240px; width: 200px;" placement="left" trigger="click" scrollable>
										<template #trigger>
											<n-button
												size="small"
												quaternary
											>
												<span>设置X轴</span>
											</n-button>
										</template>
										<div>
											<n-checkbox-group class="set-box-group" :value="barxList" @update:value="barHandleUpdateValue">
												<div class="set-box-group_item" v-for="(item, index) in barCheckboxList" :key="index">
													<n-checkbox :value="item" :label="item" />
												</div>
											</n-checkbox-group>
										</div>
									</n-popover>
								</div>
							</n-popover>
							<span class="set-text">设置</span>
						</div>
						<div class="slider-box">
							<n-slider
								:value="barSliderValue"
								:min="1"
								:max="dataLength === 0 ? 1 : dataLength"
								range
								:step="1"
								:on-update:value="barSliderUpdate"
							>
								<!-- <template #thumb>
									<n-icon-wrapper :size="24" :border-radius="12">
										<n-icon :size="14">
											<FlagIcon />
										</n-icon>
									</n-icon-wrapper>
								</template> -->
							</n-slider>
						</div>
					</div>
					<div v-else-if="active === 'A2'" class="chart-content">
						<div ref="chartRef2" class="chart-box"></div>
						<div class="slider-box">
							<n-slider
								:value="pieSliderValue"
								:min="1"
								:max="dataLength === 0 ? 1 : dataLength"
								range
								:step="1"
								:on-update:value="pieSliderUpdate"
							>
								<!-- <template #thumb>
									<n-icon-wrapper :size="24" :border-radius="12">
										<n-icon :size="14">
											<FlagIcon />
										</n-icon>
									</n-icon-wrapper>
								</template> -->
							</n-slider>
						</div>
					</div>
					<div v-else-if="active === 'A3'" class="chart-content">
						<div ref="chartRef3" class="chart-box"></div>
						<div class="set-box">
							<n-popover placement="left" trigger="click" style="padding: 4px">
								<template #trigger>
									<n-icon size="18" color="#797979" class="set-icon">
										<SettingsIcon />
									</n-icon>
								</template>
								<div class="set-box-list">
									<n-popover style="max-height: 240px; width: 200px;" placement="left" trigger="click" scrollable>
										<template #trigger>
											<n-button
												size="small"
												quaternary
											>
												<span>设置X轴</span>
											</n-button>
										</template>
										<div>
											<n-checkbox-group class="set-box-group" :value="linexList" @update:value="lineHandleUpdateValue">
												<div class="set-box-group_item" v-for="(item, index) in lineCheckboxList" :key="index">
													<n-checkbox :value="item" :label="item" />
												</div>
											</n-checkbox-group>
										</div>
									</n-popover>
								</div>
							</n-popover>
							<span class="set-text">设置</span>
						</div>
						<div class="slider-box">
							<n-slider
								:value="lineSliderValue"
								:min="1"
								:max="dataLength === 0 ? 1 : dataLength"
								range
								:step="1"
								:on-update:value="sliderLineUpdate"
							>
								<!-- <template #thumb>
									<n-icon-wrapper :size="24" :border-radius="12">
										<n-icon :size="14">
											<FlagIcon />
										</n-icon>
									</n-icon-wrapper>
								</template> -->
							</n-slider>
						</div>
					</div>
					<div v-if="chartTypeOpts.length" class="chart-footer">
						<div class="chart-footer-left">
							<n-popover
								trigger="hover"
								v-for="item in chartTypeOpts"
								:key="item.id"
								:show-arrow="false"
							>
								<template #trigger>
									<n-button
										class="mr-10"
										size="medium"
										:type="active === item.active ? 'info' : 'default'"
										tertiary
										circle
										@click="changeClick(item.active)"
									>
										<template #icon>
											<n-icon :size="18" v-if="item.active === 'A0'"
												><icon-local-table
											/></n-icon>
											<n-icon :size="18" v-else-if="item.active === 'A1'"
												><BarIcon
											/></n-icon>
											<n-icon :size="18" v-else-if="item.active === 'A2'"
												><PieIcon
											/></n-icon>
											<n-icon :size="18" v-else-if="item.active === 'A3'"
												><LineIcon
											/></n-icon>
										</template>
									</n-button>
								</template>
								<span>{{ item.name }}</span>
							</n-popover>
						</div>
						<div class="chart-footer-right"></div>
					</div>
				</div>
			</div>
		</div>
	</n-modal>
</template>
<script lang="ts">
import {
	SwapHorizontalOutline as SwapIcon,
	BarChart as BarIcon,
	PieChart as PieIcon,
	AnalyticsOutline as LineIcon,
	Flag as FlagIcon,
	SettingsOutline as SettingsIcon,
} from "@vicons/ionicons5";
import { ref, reactive, toRefs, defineComponent, nextTick, watch } from "vue";
import { useBar, useLine, usePie } from '../../hooks';

type RowDataType = {
	key: number;
	[key: string]: any;
};

export default defineComponent({
	components: {
		SwapIcon,
		BarIcon,
		PieIcon,
		LineIcon,
		FlagIcon,
		SettingsIcon
	},
	props: {
		title: {
			type: String,
			default: "",
		},
		rowData: {
			type: Object,
			default() {
				return {};
			},
		},
		active: {
			type: String,
			default: "A0"
		}
	},
	setup(props) {
		const sourceType: any = props.rowData.data?.sourceType || {};
		const sourceData: any = props.rowData.data?.sourceData || [];
		const state = reactive({
			show: false,
			currentPage: 1,
			pageSize: 10,
			pageCount: 0,
			total: 0,
			title: props.title,
		});
		const tableContentRef = ref();
		const tableHeight = ref(600);
		const active = ref("A0");
		const columnsLength = ref(0);
		const dataLength = ref(0);
		const notData = ref(false);
		const moreRef = ref();
		const chartTypeOpts = ref([
			{
				id: "1",
				active: "A0",
				name: "表格",
			},
			{
				id: "2",
				active: "A1",
				name: "柱状图",
			},
			{
				id: "3",
				active: "A2",
				name: "饼图",
			},
			{
				id: "4",
				active: "A3",
				name: "折线图",
			},
		]);

		const {
			chartRef1,
			barSliderValue,
			barCheckboxList,
			barxList,
			barSliderUpdate,
			barHandleUpdateValue
		} = useBar({ sourceType, sourceData })

		const {
			chartRef3,
			lineCheckboxList,
			lineSliderValue,
			linexList,
			sliderLineUpdate,
			lineHandleUpdateValue
		} = useLine({ sourceType, sourceData })

		const {
			chartRef2,
			pieSliderValue,
			pieSliderUpdate,
			pieHandleUpdateValue
		} = usePie({ sourceType, sourceData })

		const sourceKeys = Object.keys(sourceType);

		let columns = sourceKeys.map((key) => {
				return {
					title: key,
					key,
				};
			}) || [];

		notData.value = sourceData.length === 0;
		dataLength.value = sourceData.length;
		columnsLength.value = columns.length;

		const tableData: RowDataType[] = sourceData.map(
			(item: any, index: number) => {
				item.key = index;
				return item;
			}
		);

		const sourceNumberType = sourceKeys.filter((key, index) => {
				return sourceType[key] === "number";
			}) || [];

		if (sourceNumberType.length === 0) {
			chartTypeOpts.value = []
		}

		watch(() => props.active, (newVal) => {
			active.value = newVal
		})

		const onShow = () => {
			state.show = true;
			resizeTable();
		};

		const resizeTable = () => {
			nextTick(() => {
				if (tableContentRef.value) {
					tableHeight.value = tableContentRef.value?.clientHeight || 600;
				}
			});
		};

		const onHide = () => {
			state.show = false;
		};

		const changeClick = (type: string) => {
			if (active.value === type) return;
			active.value = type;
			if (type === "A0") {
				resizeTable();
			}
		};

		const pageChange = (page: number) => {
			state.currentPage = page;
		};

		const pageSizeChange = (size: number) => {
			state.pageSize = size;
			state.currentPage = 1;
		};



		return {
			...toRefs(state),
			tableContentRef,
			tableHeight,
			pagination: {
				pageSize: 30,
			},
			active,
			columns,
			columnsLength,
			dataLength,
			notData,
			tableData,
			chartTypeOpts,
			moreRef,
			chartRef1,
			chartRef2,
			chartRef3,
			barSliderValue,
			pieSliderValue,
			lineSliderValue,
			barCheckboxList,
			lineCheckboxList,
			barxList,
			linexList,
			barHandleUpdateValue,
			lineHandleUpdateValue,
			pieHandleUpdateValue,
			changeClick,
			onShow,
			onHide,
			pageChange,
			pageSizeChange,
			barSliderUpdate,
			sliderLineUpdate,
			pieSliderUpdate
		};
	},
});
</script>

<style lang="scss" scoped>
.modal-wrapper {
	height: 80vh;
	display: flex;
	flex-direction: column;
	padding: 20px 0;
	.modal-content {
		width: 100%;
		height: 100%;
		margin: 0 auto;
		border: 1px solid var(--n-border-color);
		border-radius: 8px;
		box-sizing: border-box;
		overflow: hidden;
		.chart-wrapper {
			width: 100%;
			height: 100%;
			background-color: var(--baseColor);
			display: flex;
			flex-direction: column;
			.chart-content {
				position: relative;
				width: 100%;
				flex: 1;
				overflow: hidden;
				.table {
					height: 100%;
					width: 100%;
					box-sizing: border-box;
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
				.chart-box {
					width: 100%;
					height: 100%;
					box-sizing: border-box;
				}
				.slider-box {
					position: absolute;
					bottom: 0;
					left: 50%;
					transform: translateX(-50%);
					z-index: 10;
					width: 50vw;
					height: 32px;
				}
				.set-box {
					position: absolute;
					top: 19px;
					right: 18px;
					z-index: 10;
					display: flex;
					cursor: pointer;
					.set-text {
						display: none;
						position: absolute;
						bottom: -20px;
						z-index: 11;
						left: -5px;
						color: #56a5cc;
						width: 30px;
					}
					&:hover {
						.set-icon {
							&.n-icon {
								color: #56a5cc !important;
							}
						}
						.set-text {
							display: block;
						}
					}
					.set-list {
						height: 300px;
						display: flex;
						flex-direction: column;
					}
				}
			}
			.chart-footer {
				height: 58px;
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
	}
}
</style>

<style lang="scss">
// .set-list {
// 		display: flex;
// 		flex-direction: column;
// 	}
// .set-box-popover {
// 	.set-list {
// 		display: flex;
// 		flex-direction: column;
// 	}
// }
.set-box-content {
	padding: 6px;
}
.set-box-list {
	display: flex;
	flex-direction: column;
}
.set-box-group {
	display: flex;
	flex-direction: column;
}
</style>
