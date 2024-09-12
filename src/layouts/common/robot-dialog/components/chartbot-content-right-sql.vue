<template>
	<div class="sql-container">
		<div class="sql-content">
			<div class="header-section">
				<codemirror
					v-model="code"
					placeholder="Code goes here..."
					:style="{ height: '200px', width: '100%', textAlign: 'center' }"
					:autofocus="true"
					:indent-with-tab="true"
					:tab-size="2"
					@ready="handleReady"
					@change="log('change', $event)"
					@focus="log('focus', $event)"
					@blur="log('blur', $event)"
				/>
				<div class="header-action">
					<n-button type="info" size="small" style="height: 34px;" color="#1890ff" @click="runClick">
						执行
					</n-button>
				</div>
			</div>
			<div class="main-section">

			</div>
		</div>
	</div>
</template>

<script lang="ts">

import {
	ref,
	shallowRef,
	computed,
	defineComponent,
	onMounted,
	onBeforeUnmount,
} from "vue";
import { Codemirror } from 'vue-codemirror';
import { useRobotStore } from "@/store";
import { EventBus } from "@/utils";

export default defineComponent({
	components: {
		Codemirror
	},
	setup() {
		const sourceData = ref([]);
		const sourceType = ref({});
		const code = ref('');
		const view = shallowRef()

		const robot = useRobotStore()

		const recordItem: any = computed(() => {
			let res = {};
			let list = robot.currentChatbotRecords;
			let id = robot.chatbotRecordId;

			if (id) {
				res = list.find((item: any) => item?.id === id) || {};
			}

			return res;
		});

		onMounted(() => {
			init();
			EventBus.on("refresh-sql-data", () => {
				init();
			});
		});

		onBeforeUnmount(() => {
			EventBus.off("refresh-sql-data");
		});


		// methods
		const init = () => {
			sourceData.value = recordItem.value?.data?.sourceData || [];
			sourceType.value = recordItem.value?.data?.sourceType || {};
			code.value = recordItem.value?.data?.sql || '';
		};

    const handleReady = (payload: any) => {
      view.value = payload.view
    }

    // Status is available at all times via Codemirror EditorView
    const getCodemirrorStates = () => {
      const state = view.value.state
      const ranges = state.selection.ranges
      const selected = ranges.reduce((r: any, range: any) => r + range.to - range.from, 0)
      const cursor = ranges[0].anchor
      const length = state.doc.length
      const lines = state.doc.lines
      // more state info ...
      // return ...
			console.log('selected----', selected)
    }

		const runClick = () => {
			console.log('code', code.value)
			// getCodemirrorStates()
		}


		return {
			code,
			log: console.log,
			runClick,
			handleReady
		}
	}
});
</script>

<style lang="scss" scoped>
:deep(.cm-editor) {
	border: 1px solid var(--n-border-color);
	.cm-content {
		text-align: left;
	}
}
.sql-container {
	height: 100%;
	.sql-content {
		height: 100%;
		display: flex;
		flex-direction: column;
		box-sizing: border-box;
		.header-section {
			overflow-y: auto;
			border-bottom: 1px solid var(--n-border-color);
			padding: 20px;
			.header-action {
				display: flex;
				justify-content: flex-end;
				padding-top: 10px;
			}
		}
		.main-section {
			flex: 1;
			overflow-y: auto;
		}
	}
}
</style>
