import { nanoid } from "nanoid";
import { ref } from 'vue';
import type { Ref } from "vue";
import { type ECOption, useEcharts } from "@/composables";

type optType = {
	label: string,
	value: any
}

export default function useLine(props: any) {
	const sourceType = props.sourceType || {};
	const sourceData = props.sourceData || [];
	const dataLength = ref(0);
	const sliderLineVal1 = ref(1);
	const sliderLineVal2 = ref(1);
	const lineSliderValue: Ref<number[]> = ref([1, 1]);
	const lineCheckboxList = ref([]);
	const linexList = ref<(string | number)[] | null>([]);
	const lineOpts = ref([]);
	const linexOpts = ref([]);
	const lineyOpts =ref([]);
	const lineForm = ref({
		x: '',
		y: [] as optType[],
		xname: '',
		yname: '',
		xRange: [1, 1]
	})

	const lineOptions = ref<ECOption>({
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
		// legend: {
		// 	data: legendData,
		// 	top: "2%",
		// 	left: "center",
		// },
		tooltip: {
			trigger: "axis",
			confine: true,
			formatter: (params: any) => {
				const pobj = params[0] || {}
				let index = pobj.dataIndex
				let obj = sourceData.value[index] || {}
				let res = ''
				for(let k in obj) {
					res += `${k}：${obj[k]}<br>`
				}
				return res
			}
		},
		xAxis: {
			type: "category",
			name: '',
			axisLabel: {
				rotate: -45,
			},
			data: linexList.value as [],
		},
		yAxis: {
			type: "value",
			name: '',
			axisLine: {
				show: true
			}
		},
		series: [],
	}) as Ref<ECOption>;

	const { domRef: chartRef3 } = useEcharts(lineOptions);

	// methods
	const initLine = () => {
		dataLength.value = sourceData.value?.length;
		sliderLineVal2.value = dataLength.value;
		lineSliderValue.value = [1, dataLength.value];
		const sourceKeys = (Object.keys(sourceType.value) || []) as [];
		const sourceNumberType = sourceKeys.filter((key) => {
			return sourceType.value[key] === "number";
		}) || [];
		lineCheckboxList.value = sourceNumberType;
		linexList.value = sourceNumberType;
		linexOpts.value = sourceKeys.map((v) => ({label: v, value: v})) as [];
		lineyOpts.value = sourceNumberType.map((v) => ({label: v, value: v})) as [];
		let xobj: optType = linexOpts.value[0] || {}
		let yobj: optType = lineyOpts.value[0] || {}
		lineForm.value.x = xobj.value;
		lineForm.value.y = [yobj.value];
		lineForm.value.xname = xobj.value;
		lineForm.value.yname = '';
		linexList.value = sourceData.value.map((v: any) => v[lineForm.value.x]) || [];
		const xAxis = lineOptions.value.xAxis || {}
		const yAxis = lineOptions.value.yAxis || {}
		lineOptions.value.xAxis = {...xAxis, name: xobj.value, data: linexList.value } as {}
		lineOptions.value.yAxis = {...yAxis, name: yobj.value } as {}
		lineOptions.value.series = getLineSeries();
	}

	const changeLine = (params: any) => {
		lineForm.value.x = params.x
		lineForm.value.y = params.y
		lineForm.value.xname = params.xname;
		lineForm.value.yname = params.yname;

		const xAxis = lineOptions.value.xAxis || {}
		const yAxis = lineOptions.value.yAxis || {}
		linexList.value = sourceData.value.map((v: any) => v[lineForm.value.x]) || [];
		lineOptions.value.xAxis = {...xAxis, name: params.xname, data: linexList.value } as {}
		lineOptions.value.yAxis = {...yAxis, name: params.yname, data: linexList.value } as {}
		lineOptions.value.series = getLineSeries();
	}

	const getLineSeries = () => {
		let res: any = lineForm.value.y.map((key: any) => {
			let list = sourceData.value.map((v: any) => v[key])
			return {
				// name: legendData[0],
				data: list,
				type: "line",
				large: true,
			};
		}) || [];
		res = res.slice(sliderLineVal1.value - 1, sliderLineVal2.value)
		return res;
	}

	initLine()

	const sliderLineUpdate = (value: number | [number, number]) => {
		if (Array.isArray(value)) {
			lineSliderValue.value = value;
			let v1: number = 1;
			let v2: number = 1;

			if (value[1] >= value[0]) {
				v1 = value[0];
				v2 = value[1];
			} else {
				v1 = value[1];
				v2 = value[0];
			}

			sliderLineVal1.value = v1;
			sliderLineVal2.value = v2;

			lineOptions.value.series = getLineSeries();
		}
	};

	const lineHandleUpdateValue = (value: (string | number)[]) => {
		linexList.value = value
		let list: any = lineCheckboxList.value.filter((item) => {
			return linexList.value?.includes(item)
		}) || []
		lineOptions.value.xAxis = Object.assign({}, lineOptions.value.xAxis, { data: list })
		lineOptions.value.series = getLineSeries()
	}

	return {
		chartRef3,
		sliderLineVal1,
		sliderLineVal2,
		lineSliderValue,
		lineCheckboxList,
		linexList,
		lineOptions,
		lineOpts,
		linexOpts,
		lineyOpts,
		lineForm,
		initLine,
		changeLine,
		getLineSeries,
		sliderLineUpdate,
		lineHandleUpdateValue
	}
}
