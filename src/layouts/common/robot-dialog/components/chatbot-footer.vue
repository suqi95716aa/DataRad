<template>
	<div class="chatbot-footer">
		<div class="left-box">
			<n-button quaternary circle @click="clearRecordsClick">
				<template #icon>
					<n-icon><TrashIcon /></n-icon>
				</template>
			</n-button>
			<n-button quaternary circle @click="downloadImgClick">
				<template #icon>
					<n-icon><icon-local-download /></n-icon>
				</template>
			</n-button>
		</div>
		<div class="middle-box">
			<n-input
				v-model:value="sendValue"
				type="textarea"
				placeholder="赶快输入您的问题进行查询吧！（Shift + Enter = 换行）"
				:autosize="{ minRows: 1, maxRows: 5 }"
				@keydown.enter.native="keydownHandle"
			/>
		</div>
		<div class="right-box">
			<n-button type="primary" :loading="sendLoading" :disabled="!sendValue" @click="sendClick">
				<template #icon>
					<n-icon><PaperPlaneIcon /></n-icon>
				</template>
			</n-button>
		</div>
	</div>
</template>

<script lang="ts">
import {
	TrashOutline as TrashIcon,
	PaperPlane as PaperPlaneIcon,
} from "@vicons/ionicons5";
import { ref, defineComponent } from "vue";
import { useDialog } from "naive-ui";
import { useRobotStore } from "@/store";
import { EventBus } from "@/utils";

export default defineComponent({
	components: {
		TrashIcon,
		PaperPlaneIcon,
	},
	setup() {
		const sendValue = ref("");
		const sendLoading = ref(false);

		const dialog = useDialog();
		const robot = useRobotStore();

		const clearRecordsClick = () => {
			dialog.warning({
				title: "提示",
				content: "是否清空会话？",
				positiveText: "是",
				negativeText: "否",
				onPositiveClick: () => {
					robot.clearChatbotRecord();
				},
				onNegativeClick: () => {},
			});
		};

		const downloadImgClick = () => {
			dialog.warning({
				title: "提示",
				content: "是否将会话保存为图片?",
				positiveText: "是",
				negativeText: "否",
				onPositiveClick: () => {
					EventBus.emit("download-chatbot-img");
				},
				onNegativeClick: () => {},
			});
		};

		const sendClick = async () => {
			if (!sendValue.value) return;

			// const res = robot.checkChatbotSettings()

			// if (!res) return false

			let value = sendValue.value;
			sendValue.value = "";

			sendLoading.value = true;
			await robot.addChatbotRecord({
				value
			});
			sendLoading.value = false;

			EventBus.emit('chatbot-content-scroll-to', { type: 'bom', behavior: 'smooth' })
		};

		const keydownHandle = (e: KeyboardEvent) => {
			e.preventDefault()
			if (e.shiftKey && e.key === "Enter") {
				sendValue.value += "\n"
			} else {
				sendClick()
			}
		}

		return {
			sendValue,
			sendLoading,
			clearRecordsClick,
			downloadImgClick,
			sendClick,
			keydownHandle
		};
	},
});
</script>

<style lang="scss" scoped>
.chatbot-footer {
	margin: 0 auto;
	max-width: 1048px;
	min-height: 50px;
	padding: 16px 16px 8px;
	box-sizing: border-box;
	display: flex;
	background-color: #f5f5f6;
	.middle-box {
		flex: 1;
		overflow: hidden;
		padding: 0 12px;
	}
}
</style>
