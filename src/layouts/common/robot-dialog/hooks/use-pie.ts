import { nanoid } from "nanoid";
import { ref } from 'vue';
import type { Ref } from "vue";
import { type ECOption, useEcharts } from "@/composables";

type optType = {
	label: string,
	value: any
}

export default function usePie(props: any) {
	const sourceType = props.sourceType || {};
	const sourceData = props.sourceData || [];
	const dataLength = ref(0);
	const pieSliderVal1 = ref(1);
	const pieSliderVal2 = ref(1);
	const pieSliderValue: Ref<number[]> = ref([1, 1]);
	const piexList = ref([]);
	const sourceNumberType = ref([]);
	const pieData = ref([]);
	const pieyOpts = ref([]);
	const piexOpts = ref([]);
	const pieForm = ref({
		x: '',
		piey: '',
		xname: '',
		yname: '',
		xRange: [1, 1]
	})

	const pieSeries: any = [
		{
			// name: legendData[0],
			type: "pie",
			radius: ["40%", "70%"],
			avoidLabelOverlap: false,
			width: "60%",
			left: "center",
			itemStyle: {
				borderRadius: 10,
			},
			label: {
				show: false,
				position: "center",
			},
			emphasis: {
				label: {
					show: true,
					fontSize: 18,
					fontWeight: "bold",
				},
			},
			labelLine: {
				show: false,
			},
			data: pieData.value,
		},
	]

	const pieOptions = ref<ECOption>({
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
		grid: {
			right: 100,
			left: 80,
			bottom: 100,
		},
		legend: {
			type: "scroll",
			orient: "vertical",
			left: 10,
			top: 30,
			height: 360
		},
		series: [
			{
				// name: legendData[0],
				type: "pie",
				radius: ["40%", "70%"],
				avoidLabelOverlap: false,
				width: "60%",
				left: "center",
				itemStyle: {
					borderRadius: 10,
				},
				label: {
					show: false,
					position: "center",
				},
				emphasis: {
					label: {
						show: true,
						fontSize: 16,
						fontWeight: "bold",
					},
				},
				labelLine: {
					show: false,
				},
				data: pieData.value,
			},
		],
	}) as unknown as Ref<ECOption>;

	pieOptions.value.series = pieSeries;

	const { domRef: chartRef2 } = useEcharts(pieOptions);

	// methods
	const initPie = () => {
		dataLength.value = sourceData.value.length;
		pieSliderVal2.value = dataLength.value;
		pieSliderValue.value = [1, dataLength.value];
		const sourceKeys = Object.keys(sourceType.value);
		const sourceNumberType = sourceKeys.filter((key) => {
			return sourceType.value[key] === "number";
		}) || [];
		// piexList.value = sourceNumberType;
		piexOpts.value = sourceKeys.map((v) => ({label: v, value: v})) as [];
		pieyOpts.value = sourceNumberType.map((v) => ({label: v, value: v})) as [];
		let xobj: optType = piexOpts.value[0] || {}
		let yobj: optType = pieyOpts.value[0] || {}
		pieForm.value.x = xobj.value;
		pieForm.value.piey = yobj.value;
		piexList.value = sourceData.value.map((v: any) => v[pieForm.value.x]) || [];
		pieData.value = sourceData.value.map((item: any) => {

			return {
				value: item[pieForm.value.piey],
				name: pieForm.value.piey,
			};
		}) as [];

		pieOptions.value.series = [];
		pieSeries[0].data = pieData;
		pieOptions.value.series = pieSeries;
	}

	const changePie = (params: any) => {
		console.log('changeBar----params', params)
		pieForm.value.x = params.x
		pieForm.value.piey = params.piey
		pieForm.value.xname = params.xname;
		pieForm.value.yname = params.yname;

		console.log('params.xname---', params.xname)
		piexList.value = sourceData.value.map((v: any) => v[pieForm.value.x]) || [];
		pieData.value = sourceData.value.map((item: any) => {

			return {
				value: item[pieForm.value.piey],
				name: pieForm.value.piey,
			};
		}) as [];

		pieOptions.value.series = [];
		pieSeries[0].data = pieData;
		pieOptions.value.series = pieSeries;
	}

	initPie()


	const pieSliderUpdate = (value: number | [number, number]) => {
		if (Array.isArray(value)) {
			pieSliderValue.value = value;
			let v1: number = 1;
			let v2: number = 1;

			if (value[1] >= value[0]) {
				v1 = value[0];
				v2 = value[1];
			} else {
				v1 = value[1];
				v2 = value[0];
			}

			pieSliderVal1.value = v1;
			pieSliderVal2.value = v2;

			const pieData = sourceNumberType.value.map((key: any, index: number) => {
				let value = 0;
				let list = sourceData.slice(v1 - 1, v2)
				list.forEach((item: any) => {
					if (item[key]) {
						value += item[key];
					}
				});

				return {
					value,
					name: key,
				};
			});
			pieOptions.value.series = []
			pieSeries[0].data = pieData
			pieOptions.value.series = pieSeries
		}
	};

	const pieHandleUpdateValue = (value: (string | number)[]) => {
		// piexList.value = value
		// let list: any = pieCheckboxList.filter((item: any) => {
		// 	return piexList.value?.includes(item)
		// }) || []
		// pieOptions.value.xAxis = Object.assign({}, pieOptions.value.xAxis, { data: list})
		// pieOptions.value.series = pieSeries
	}


	return {
		chartRef2,
		pieSliderVal1,
		pieSliderVal2,
		pieSliderValue,
		piexOpts,
		pieyOpts,
		pieForm,
		initPie,
		changePie,
		pieSliderUpdate,
		pieHandleUpdateValue
	}
}
