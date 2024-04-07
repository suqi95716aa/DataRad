import { nanoid } from "nanoid";
import { ref } from 'vue';
import type { Ref } from "vue";
import { type ECOption, useEcharts } from "@/composables";

type optType = {
	label: string,
	value: any
}

export default function useBar(props: any) {
	const sourceType = props.sourceType || {};
	const sourceData = props.sourceData || [];
	const dataLength = ref(0);
	const barSliderVal1 = ref(1);
	const barSliderVal2 = ref(1);
	const barSliderValue: Ref<number[]> = ref([1, 1]);
	const barCheckboxList = ref([]);
	const barxList = ref([]);
	const baryOpts = ref([]);
	const barxOpts = ref([]);
	const barForm = ref({
		x: '',
		y: [] as optType[],
		xname: '',
		yname: '',
		xRange: [1, 1]
	})

	const barOptions = ref<ECOption>({
		toolbox: {
			show: true,
			bottom: "3%",
			right: "3%",
			feature: {
				saveAsImage: {
					name: `${nanoid()}.png`,
				},
			},
		},
		grid: {
			right: 100,
			left: 80,
			bottom: 100,
		},
		tooltip: {
			trigger: "item",
			confine: true,
			formatter: (params: any) => {
				let index = params?.dataIndex
				let obj = sourceData.value[index] || {}
				let res = ''
				for(let k in obj) {
					res += `${k}：${obj[k]}<br>`
				}
				return res
			}
		},
		// legend: {
		// 	data: legendData,
		// 	top: "2%",
		// 	left: "center",
		// },
		xAxis: {
			type: "category",
			name: "",
			axisLabel: {
				rotate: -45,
			},
			data: barxList.value as [],
		},
		yAxis: {
			type: "value",
			name: "",
			axisLine: {
				show: true
			}
		},
		series: [],
	}) as Ref<ECOption>;

	const { domRef: chartRef1 } = useEcharts(barOptions);

	// methods
	const initBar = () => {
		dataLength.value = sourceData.value?.length;
		barSliderVal2.value = dataLength.value;
		barSliderValue.value = [1, dataLength.value];
		const sourceKeys = Object.keys(sourceType.value);
		const sourceNumberType = sourceKeys.filter((key) => {
			return sourceType.value[key] === "number";
		}) || [];
		barCheckboxList.value = sourceNumberType as [];
		barxOpts.value = sourceKeys.map((v) => ({label: v, value: v})) as [];
		baryOpts.value = sourceNumberType.map((v) => ({label: v, value: v})) as [];
		let xobj: optType = barxOpts.value[0] || {}
		let yobj: optType = baryOpts.value[0] || {}
		barForm.value.x = xobj.value;
		barForm.value.y = [yobj.value];
		barForm.value.xname = xobj.value;
		barForm.value.yname = '';
		const xAxis = barOptions.value.xAxis || {}
		const yAxis = barOptions.value.yAxis || {}
		barxList.value = sourceData.value.map((v: any) => v[barForm.value.x]) || [];
		barOptions.value.xAxis = {...xAxis, name: xobj.value, data: barxList.value } as {}
		barOptions.value.yAxis = {...yAxis, name: yobj.value } as {}
		barOptions.value.series = getBarSeries();
	}

	const changeBar = (params: any) => {
		console.log('changeBar----params', params)
		barForm.value.x = params.x
		barForm.value.y = params.y
		barForm.value.xname = params.xname;
		barForm.value.yname = params.yname;

		const xAxis = barOptions.value.xAxis || {}
		const yAxis = barOptions.value.yAxis || {}
		console.log('params.xname---', params.xname)
		barxList.value = sourceData.value.map((v: any) => v[barForm.value.x]) || [];
		barOptions.value.xAxis = {...xAxis, name: params.xname, data: barxList.value } as {}
		barOptions.value.yAxis = {...yAxis, name: params.yname, data: barxList.value } as {}
		barOptions.value.series = getBarSeries();
	}

	const getBarSeries = () => {
		let res: any = barForm.value.y.map((key: any) => {
			let list = sourceData.value.map((v: any) => v[key])
			return {
				// name: legendData[0],
				data: list,
				type: "bar",
				large: true,
			};
		}) || [];
		res = res.slice(barSliderVal1.value - 1, barSliderVal2.value)
		return res
	}

	initBar()

	const barSliderUpdate = (value: number | [number, number]) => {
		if (Array.isArray(value)) {
			barSliderValue.value = value;
			let v1: number = 1;
			let v2: number = 1;

			if (value[1] >= value[0]) {
				v1 = value[0];
				v2 = value[1];
			} else {
				v1 = value[1];
				v2 = value[0];
			}

			barSliderVal1.value = v1;
			barSliderVal2.value = v2;

			barOptions.value.series = getBarSeries();
		}
	};

	const barHandleUpdateValue = (value: (string | number)[]) => {
		barxList.value = value as []
		let list: any = barCheckboxList.value.filter((item) => {
			return barxList.value?.includes(item)
		}) || []
		barOptions.value.xAxis = Object.assign({}, barOptions.value.xAxis, { data: list})
		barOptions.value.series = getBarSeries()
	}

	return {
		chartRef1,
		barSliderVal1,
		barSliderVal2,
		barSliderValue,
		barCheckboxList,
		barForm,
		baryOpts,
		barxOpts,
		barxList,
		barOptions,
		initBar,
		changeBar,
		getBarSeries,
		barSliderUpdate,
		barHandleUpdateValue
	}
}
