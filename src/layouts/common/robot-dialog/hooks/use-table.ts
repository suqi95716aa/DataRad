import { ref, nextTick } from 'vue';

export default function useTable(props: any) {
	const sourceType = props.sourceType;
	const sourceData = props.sourceData;
	const tableData = ref([]);
	const tableContentRef = ref();
	const columnsLength = ref(0);
	const tableHeight = ref(500);
	const sourceKeys: any = ref([]);
	const columns: any = ref([]);

	const initTable = () => {
		sourceKeys.value = Object.keys(sourceType.value);
		columns.value = sourceKeys.value.map((key: string) => {
			return {
				title: key,
				key,
			};
		}) || [];
		columnsLength.value = columns.value.length

		tableData.value = sourceData.value?.map(
			(item: any, index: number) => {
				item.key = index;
				return item;
			}
		) as [];
	}

	const resizeTable = () => {
		nextTick(() => {
			if (tableContentRef.value) {
				tableHeight.value = tableContentRef.value?.clientHeight || 500;
			}
		});
	};

	return {
		tableContentRef,
		tableData,
		columns,
		tableHeight,
		columnsLength,
		pagination: {
			pageSize: 20,
		},
		initTable,
		resizeTable
	}
}
