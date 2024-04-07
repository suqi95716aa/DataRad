<template>
	<div class="visual-container">
		<div class="visual-content">
			<div class="chart-section">
				<div class="chart-wrapper">
					<div class="chart-action">
						<div class="chart-action-left">
							<n-popover
								trigger="hover"
								v-for="item in chartTypeOpts"
								:key="item.id"
								:show-arrow="false"
							>
								<template #trigger>
									<n-button
										class="mr-10"
										size="small"
										:type="active === item.active ? 'info' : 'default'"
										tertiary
										circle
										@click="changeClick(item.active)"
									>
										<template #icon>
											<n-icon :size="14" v-if="item.active === 'A0'"
												><icon-local-table
											/></n-icon>
											<n-icon :size="14" v-else-if="item.active === 'A1'"
												><BarIcon
											/></n-icon>
											<n-icon :size="14" v-else-if="item.active === 'A2'"
												><PieIcon
											/></n-icon>
											<n-icon :size="14" v-else-if="item.active === 'A3'"
												><LineIcon
											/></n-icon>
										</template>
									</n-button>
								</template>
								<span>{{ item.name }}</span>
							</n-popover>
						</div>
						<div v-if="['A1', 'A2', 'A3'].includes(active)" class="chart-action-right">
							<n-popover
								trigger="hover"
								:show-arrow="false"
							>
								<template #trigger>
									<n-button
										class="mr-10"
										size="small"
										tertiary
										circle
										@click="openSetDrawer"
									>
										<template #icon>
											<n-icon size="18">
												<SettingsIcon />
											</n-icon>
										</template>
									</n-button>
								</template>
								<span>设置</span>
							</n-popover>
						</div>
					</div>
					<div class="chart-drawer" :style="{ width: showSetDrawer ? '260px' : '0'}">
						<!-- <div class="chart-drawer-header">
							<div class="drawer-close">
								<n-icon @click="closeDrawerClick"><CloseIcon /></n-icon>
							</div>
						</div> -->
						<div class="chart-drawer-main">
							<n-form
								ref="formRef"
								:model="formValue"
								size="small"
							>
								<n-form-item label="图表类型" path="phone">
									<n-select
										v-model:value="formValue.active"
										placeholder="请选择"
										:disabled="true"
										:options="actionsOpts"
									/>
								</n-form-item>
								<n-form-item label="X轴" path="x">
									<n-select
										v-model:value="formValue.x"
										placeholder="请选择"
										:options="xOpts"
									/>
								</n-form-item>
								<n-form-item v-if="['A2'].includes(active)" label="Y轴" path="piey">
									<n-select
										v-model:value="formValue.piey"
										placeholder="请选择"
										:options="yOpts"
									/>
								</n-form-item>
								<n-form-item v-if="['A1', 'A3'].includes(active)" label="Y轴" path="y">
									<n-select
										v-model:value="formValue.y"
										placeholder="请选择"
										multiple
										:max-tag-count="1"
										:options="yOpts"
									/>
								</n-form-item>
								<n-form-item v-if="['A1', 'A3'].includes(active)" label="X轴单位" path="xname">
									<n-input v-model:value="formValue.xname" placeholder="请输入" />
								</n-form-item>
								<n-form-item v-if="['A1', 'A3'].includes(active)" label="Y轴单位" path="yname">
									<n-input v-model:value="formValue.yname" placeholder="请输入" />
								</n-form-item>
								<!-- <n-form-item label="X轴范围" path="xRange">
									<n-slider
										v-model:value="formValue.xRange"
										:min="1"
										:max="dataLength === 0 ? 1 : dataLength"
										range
										:step="1"
									>
									</n-slider>
								</n-form-item> -->
							</n-form>
						</div>
						<div class="chart-drawer-footer" v-if="showSetDrawer">
							<n-button tertiary size="tiny" @click="closeDrawerClick">
								关闭
							</n-button>
							<n-button style="margin-left: 10px;" tertiary size="tiny" type="info" @click="saveClick">
								保存
							</n-button>
						</div>
					</div>
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
						<!-- <div class="set-box">
							<n-icon size="18" color="#797979" class="set-icon" @click="openSetDrawer">
								<SettingsIcon />
							</n-icon>
							<span class="set-text">设置</span>
						</div> -->
						<!-- <div class="slider-box">
								<n-slider
									:value="barSliderValue"
									:min="1"
									:max="dataLength === 0 ? 1 : dataLength"
									range
									:step="1"
									:on-update:value="barSliderUpdate"
								>
									<template #thumb>
										<n-icon-wrapper :size="24" :border-radius="12">
											<n-icon :size="14">
												<FlagIcon />
											</n-icon>
										</n-icon-wrapper>
									</template>
								</n-slider>
							</div> -->
					</div>
					<div v-else-if="active === 'A2'" class="chart-content">
						<div ref="chartRef2" class="chart-box"></div>
						<!-- <div class="slider-box">
								<n-slider
									:value="pieSliderValue"
									:min="1"
									:max="dataLength === 0 ? 1 : dataLength"
									range
									:step="1"
									:on-update:value="pieSliderUpdate"
								>
									<template #thumb>
										<n-icon-wrapper :size="24" :border-radius="12">
											<n-icon :size="14">
												<FlagIcon />
											</n-icon>
										</n-icon-wrapper>
									</template>
								</n-slider>
							</div> -->
					</div>
					<div v-else-if="active === 'A3'" class="chart-content">
						<div ref="chartRef3" class="chart-box"></div>
						<!-- <div class="set-box">
							<n-popover placement="left" trigger="click" style="padding: 4px">
								<template #trigger>
									<n-icon size="18" color="#797979" class="set-icon">
										<SettingsIcon />
									</n-icon>
								</template>
								<div class="set-box-list">
									<n-popover
										style="max-height: 240px; width: 200px"
										placement="left"
										trigger="click"
										scrollable
									>
										<template #trigger>
											<n-button size="small" quaternary>
												<span>设置X轴</span>
											</n-button>
										</template>
										<div>
											<n-checkbox-group
												class="set-box-group"
												:value="linexList"
												@update:value="lineHandleUpdateValue"
											>
												<div
													class="set-box-group_item"
													v-for="(item, index) in lineCheckboxList"
													:key="index"
												>
													<n-checkbox :value="item" :label="item" />
												</div>
											</n-checkbox-group>
										</div>
									</n-popover>
								</div>
							</n-popover>
							<span class="set-text">设置</span>
						</div> -->
						<!-- <div class="slider-box">
								<n-slider
									:value="lineSliderValue"
									:min="1"
									:max="dataLength === 0 ? 1 : dataLength"
									range
									:step="1"
									:on-update:value="sliderLineUpdate"
								>
									<template #thumb>
										<n-icon-wrapper :size="24" :border-radius="12">
											<n-icon :size="14">
												<FlagIcon />
											</n-icon>
										</n-icon-wrapper>
									</template>
								</n-slider>
							</div> -->
					</div>
				</div>
			</div>
			<div class="main-section">
				<p v-if="spssReasoning" class="analysis-data">{{ spssReasoning }}</p>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import {
	SwapHorizontalOutline as SwapIcon,
	BarChart as BarIcon,
	PieChart as PieIcon,
	AnalyticsOutline as LineIcon,
	Flag as FlagIcon,
	SettingsOutline as SettingsIcon,
	Close as CloseIcon
} from "@vicons/ionicons5";
import { FormInst } from 'naive-ui';
import {
	ref,
	computed,
	defineComponent,
	onMounted,
	onBeforeUnmount,
} from "vue";
import { useRobotStore } from "@/store";
import { EventBus } from "@/utils";
import { useTable, useBar, useLine, usePie } from "../hooks";

const typeOptions = [
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
];

export default defineComponent({
	components: {
		SwapIcon,
		BarIcon,
		PieIcon,
		LineIcon,
		FlagIcon,
		SettingsIcon,
		CloseIcon
	},
	setup() {
		const active = ref("A1");
		const sourceData = ref([]);
		const sourceType = ref({});
		const spssReasoning = ref('');
		const chartTypeOpts = ref(typeOptions);
		const dataLength = ref(0);
		const showSetDrawer = ref(false);
		const formRef = ref<FormInst | null>(null);
		const formValue = ref({
			active: active.value,
			x: '',
			y: [],
			piey: '',
			xname: '',
			yname: '',
			xRange: [1, 1]
    })
		const xOpts = ref([]);
		const yOpts = ref([]);

		const robot = useRobotStore();

		const recordItem: any = computed(() => {
			let res = {};
			let list = robot.currentChatbotRecords;
			let id = robot.chatbotRecordId;

			if (id) {
				res = list.find((item: any) => item?.id === id) || {};
			}

			return res;
		});

		const {
			tableContentRef,
			columns,
			tableData,
			tableHeight,
			columnsLength,
			pagination,
			initTable,
			resizeTable,
		} = useTable({ sourceData, sourceType });

		const {
			chartRef1,
			barSliderValue,
			barCheckboxList,
			barForm,
			barxOpts,
			barxList,
			baryOpts,
			initBar,
			changeBar,
			barSliderUpdate,
			barHandleUpdateValue,
		} = useBar({ sourceType, sourceData });

		const {
			chartRef3,
			lineCheckboxList,
			lineSliderValue,
			linexList,
			linexOpts,
			lineyOpts,
			lineForm,
			initLine,
			changeLine,
			sliderLineUpdate,
			lineHandleUpdateValue,
		} = useLine({ sourceType, sourceData });

		const {
			chartRef2,
			pieSliderValue,
			piexOpts,
			pieyOpts,
			pieForm,
			initPie,
			changePie,
			pieSliderUpdate,
			pieHandleUpdateValue,
		} = usePie({ sourceType, sourceData });

		onMounted(() => {
			init();
			EventBus.on("refresh-visual-data", () => {
				init();
			});
		});

		onBeforeUnmount(() => {
			EventBus.off("refresh-visual-data");
		});

		const init = () => {
			sourceData.value = recordItem.value?.data?.sourceData || [];
			sourceType.value = recordItem.value?.data?.sourceType || {};
			spssReasoning.value = recordItem.value?.data?.spss_reasoning || '';
			dataLength.value = sourceData.value.length;
			switch (active.value) {
				case "A0":
					initTable();
					resizeTable();
					break;
				case "A1":
					initBar();
					break;
				case "A2":
					initPie();
					break;
				case "A3":
					initLine();
					break;
			}
		};

		const changeClick = (type: string) => {
			if (active.value === type) return;
			showSetDrawer.value = false;
			active.value = type;
			switch (type) {
				case "A0":
					initTable();
					resizeTable();
					break;
				case "A1":
					initBar();
					break;
				case "A2":
					initPie();
					break;
				case "A3":
					initLine();
					break;
			}
		};

		const openSetDrawer = () => {
			showSetDrawer.value = true;
			formValue.value.active = active.value;
			switch(active.value) {
				case 'A0':
					break
				case 'A1':
					xOpts.value = barxOpts.value;
					yOpts.value = baryOpts.value;
					formValue.value.xRange = barForm.value.xRange;
					formValue.value.x = barForm.value.x;
					formValue.value.y = barForm.value.y as [];
					formValue.value.xname = barForm.value.xname;
					formValue.value.yname = barForm.value.yname;
					break
				case 'A2':
					xOpts.value = piexOpts.value;
					yOpts.value = pieyOpts.value;
					formValue.value.x = pieForm.value.x;
					formValue.value.piey = pieForm.value.piey;
					break
				case 'A3':
					xOpts.value = linexOpts.value;
					yOpts.value = lineyOpts.value;
					formValue.value.xRange = lineForm.value.xRange;
					formValue.value.x = lineForm.value.x;
					formValue.value.y = lineForm.value.y as [];
					formValue.value.xname = lineForm.value.xname;
					formValue.value.yname = lineForm.value.yname;
					break
			}
		}

		const closeDrawerClick = () => {
			showSetDrawer.value = false;
		}

		const saveClick = () => {
			switch (active.value) {
				case 'A1':
					changeBar(formValue.value)
					break
				case 'A2':
					changePie(formValue.value)
					break
				case 'A3':
					changeLine(formValue.value)
					break
			}
			showSetDrawer.value = false;
		}

		return {
			tableContentRef,
			spssReasoning,
			chartTypeOpts,
			dataLength,
			columnsLength,
			pagination,
			tableHeight,
			active,
			showSetDrawer,
			formRef,
			formValue,
			actionsOpts: typeOptions.map((v) => ({
				label: v.name,
				value: v.active
			})),
			xOpts,
			yOpts,
			tableData,
			columns,
			saveClick,
			openSetDrawer,
			changeClick,
			chartRef1,
			barSliderValue,
			barCheckboxList,
			barxList,
			barSliderUpdate,
			barHandleUpdateValue,
			chartRef2,
			pieSliderValue,
			pieSliderUpdate,
			pieHandleUpdateValue,
			chartRef3,
			lineCheckboxList,
			lineSliderValue,
			linexList,
			sliderLineUpdate,
			lineHandleUpdateValue,
			closeDrawerClick
		};
	},
});
</script>

<style lang="scss" scoped>
.visual-container {
	height: 100%;
	.visual-content {
		height: 100%;
		display: flex;
		flex-direction: column;
		box-sizing: border-box;
		.chart-section {
			flex: 0 0 500px;
			overflow: hidden;
			border-bottom: 1px solid var(--n-border-color);
			.chart-wrapper {
				position: relative;
				width: 100%;
				height: 100%;
				background-color: var(--baseColor);
				display: flex;
				flex-direction: column;
				padding: 20px;
				padding-top: 0;
				.chart-action {
					height: 46px;
					display: flex;
					align-items: center;
					.mr-10 {
						margin-right: 10px;
					}
					.chart-action-left {
						flex: 1;
						overflow: hidden;
					}
				}
				.chart-drawer {
					position: absolute;
					top: 0;
					right: 0;
					width: 260px;
					height: 100%;
					z-index: 99;
					background-color: var(--baseColor);
					border-left: 1px solid var(--n-border-color);
					transition: width .2s linear;
					display: flex;
					flex-direction: column;
					.chart-drawer-header {
						height: 30px;
						display: flex;
						align-items: center;
						border-bottom: 1px solid var(--n-border-color);
						.drawer-close {
							cursor: pointer;
							width: 30px;
							height: 30px;
							display: flex;
							align-items: center;
							justify-content: center;
						}
					}
					.chart-drawer-main {
						flex: 1;
						overflow-y: auto;
						padding: 10px;
					}
					.chart-drawer-footer {
						padding: 10px;
						display: flex;
						justify-content: flex-end;
					}
				}
				.chart-content {
					position: relative;
					width: 100%;
					flex: 1;
					overflow: hidden;
					border: 1px solid var(--n-border-color);
					.set-drawer {
						position: absolute;
						top: 0;
						right: 0;
						width: 260px;
						height: 100%;
						z-index: 99;
						background-color: var(--baseColor);
						border-left: 1px solid var(--n-border-color);
						transition: 'width .3s var(--n-bezier), border-color .3s var(--n-bezier), min-width .3s var(--n-bezier), max-width .3s var(--n-bezier), transform .3s var(--n-bezier), background-color .3s var(--n-bezier)';
						.set-drawer-header {
							height: 30px;
							display: flex;
							align-items: center;
							border-bottom: 1px solid var(--n-border-color);
							.drawer-close {
								cursor: pointer;
								width: 30px;
								height: 30px;
								display: flex;
								align-items: center;
								justify-content: center;
							}
						}
					}
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
						width: 200px;
						height: 32px;
					}
					.set-box {
						position: absolute;
						top: 14px;
						right: 8px;
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
		.main-section {
			flex: 1;
			overflow-y: auto;
			.analysis-data {
				padding: 20px;
				box-sizing: border-box;
				white-space: pre-wrap;
			}

		}
	}
}
</style>
