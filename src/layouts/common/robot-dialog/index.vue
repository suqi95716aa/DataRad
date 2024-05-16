<template>
	<n-modal
		preset="card"
		:title="title"
		content-class="modal-content"
		header-extra-class="header-extra"
		:show="app.robotDialogVisible"
		:style="isFull ? fullStyle : normalStyle"
		:on-after-enter="onAfterEnter"
		:on-mask-click="app.closeRobotDialog"
		:on-close="app.closeRobotDialog"
		:on-after-leave="afterLeaveCallback"
	>
		<!-- <template #header-extra>
			<icon-local-full-screen-exit
				v-if="isFull"
				style="
					font-size: 22px;
					color: var(--n-close-icon-color);
					cursor: pointer;
				"
				@click="isFull = false"
			/>
			<icon-local-full-screen-filled
				v-else
				style="
					font-size: 22px;
					color: var(--n-close-icon-color);
					cursor: pointer;
				"
				@click="isFull = true"
			/>
		</template> -->
		<div class="chatbot">
			<n-layout style="height: 100%">
				<!-- <n-layout-header style="height: 64px; padding: 24px" bordered>
				</n-layout-header> -->
				<n-layout has-sider position="absolute" style="top: 0; bottom: 0;">
					<n-layout-sider
						:native-scrollbar="false"
						ref="siderRef"
						bordered
						:collapsed="isCollapsed"
						collapse-mode="width"
						:collapsed-width="0"
						:width="260"
						show-trigger="arrow-circle"
						content-style="height: 100%; padding: 0;"
						trigger-style="width: 32px;height: 32px"
						collapsed-trigger-style="width: 32px;height: 32px"
						:on-update:collapsed="collapsedChange"
					>
						<ChatbotSider />
					</n-layout-sider>
					<n-layout has-sider>
						<n-layout-content
							ref="contentRef"
							content-style="padding: 0; height: calc(100% - 72px);"
							:native-scrollbar="true"
							:on-scroll="onContentScroll"
						>
							<div class="chatbot-main" ref="contentInnerRef">
								<div class="chatbot-main_wrapper">
									<ChatbotContent />
								</div>
							</div>
							<BackBom v-show="showBackBom" @click="backBomClick" />
						</n-layout-content>
						<n-layout-footer
							position="absolute"
							style="padding: 0; background-color: var(--baseColor);"
						>
							<ChatbotFooter />
						</n-layout-footer>
						<ChatbotContentDefault v-if="showWelcome" />
						<ChatbotContentSettings v-if="showSettings" />
						<ChatbotContentCreate v-if="showCreate" />
					</n-layout>
					<n-layout has-sider :style="rightWrapperStyle">
						<n-layout-content v-if="showRightContent" :content-style="rightContentStyle">
							<ChatbotContentRight />
						</n-layout-content>
					</n-layout>
				</n-layout>
				<!-- <n-layout-footer
					bordered
					position="absolute"
					style="height: 64px; padding: 24px; background-color: var(--baseColor);"
				>
				</n-layout-footer> -->
			</n-layout>
		</div>
	</n-modal>
</template>

<script lang="ts">
import {
	TrashOutline as TrashIcon,
	SettingsOutline as SettingsIcon,
	EllipsisVerticalSharp as EllipsisVerticalSharpIcon,
	PaperPlane as PaperPlaneIcon,
	Copy as CopyIcon,
} from "@vicons/ionicons5";
import { h, ref, defineComponent, computed, watch, nextTick, onMounted, onBeforeUnmount } from "vue";
import type { Component } from "vue";
import { NIcon, LayoutInst, useMessage } from "naive-ui";
import { useAppStore, useRobotStore } from "@/store";
import { EventBus } from '@/utils';
import {
	ChatbotSider,
	ChatbotContent,
	ChatbotFooter,
	BackBom,
	ChatbotContentSettings,
	ChatbotContentDefault,
	ChatbotContentRight,
	ChatbotContentCreate
} from "./components";

const renderIcon = (icon: Component) => {
	return () => {
		return h(NIcon, null, {
			default: () => h(icon),
		});
	};
};

const cardEllipsisOptions = [
	{
		label: "复制",
		key: "copy",
		icon: renderIcon(CopyIcon),
	},
	{
		label: "删除",
		key: "del",
		icon: renderIcon(TrashIcon),
	},
];

const dataOptions = ["groode", "veli good", "emazing", "lidiculous"].map(
	(v) => ({
		label: v,
		value: v,
	})
);

const normalStyle = {
	position: "fixed",
	top: "100px",
	height: "880px",
	width: "1280px",
};

const fullStyle = {
	position: "fixed",
	// top: "0",
	// bottom: "0",
	// left: "0",
	// right: "0",
	height: '100%',
	width: '100%'
};

const rightContentStyle = {
	padding: 0,
	height: '100%',
	width: '100%',
	borderLeft: '1px solid var(--n-border-color)'
}

export default defineComponent({
	components: {
		TrashIcon,
		SettingsIcon,
		EllipsisVerticalSharpIcon,
		PaperPlaneIcon,
		CopyIcon,
		ChatbotSider,
		ChatbotContent,
		ChatbotFooter,
		BackBom,
		ChatbotContentSettings,
		ChatbotContentDefault,
		ChatbotContentRight,
		ChatbotContentCreate
	},
	setup() {
		const title = ref("");
		const isFull = ref(true);
		const showBackBom = ref(false);
		const sendValue = ref("");
		const isCollapsed = ref(false);
		const contentRef = ref<LayoutInst | null>(null)
		const contentInnerRef = ref<HTMLElement | undefined>(undefined)

		const app = useAppStore();
		const robot = useRobotStore();

		const records = computed(() => {
			const fIndex = robot.chatbotRecords.findIndex((item) => item.id === robot.chatbotId)
			let res = [] as Robot.ChatbotRecordType[]
			if (fIndex !== -1) {
				res = robot.chatbotRecords[fIndex].list
			}
			return res
		})

		const showRightContent = computed(() => robot.showRightContent)

		const rightWrapperStyle = computed(() => {
			let res = {
				flex: showRightContent.value ? '0 0 40vw' : '0 0 0vw',
				height: '100%',
				transition: 'flex .3s var(--n-bezier), border-color .3s var(--n-bezier), min-width .3s var(--n-bezier), max-width .3s var(--n-bezier), transform .3s var(--n-bezier), background-color .3s var(--n-bezier)',
				boxSizing: 'border-box',
				position: 'relative'
			}
			return res
		})

		const showWelcome = computed(() => {
			return records.value.length === 0 && !robot.chatbotId
		})

		window.$message = useMessage()

		watch(
			() => records.value,
			() => {
				chatbotScrollTo('bom', 'auto')
			}
		);

		onMounted(() => {
			EventBus.on('chatbot-sider-collapsed', (val) => {
				isCollapsed.value = val as boolean
			})
		})

		onBeforeUnmount(() => {
			EventBus.off('chatbot-sider-collapsed')
		})

		const onAfterEnter = () => {
			chatbotScrollTo('bom', 'auto')
			// robot.checkChatbotSettings()
			EventBus.on('chatbot-content-scroll-to', (res: any) => {
				chatbotScrollTo(res?.type, res?.behavior)
			})
		}

		const chatbotScrollTo = (type: string, behavior: ScrollBehavior) => {
			nextTick(() => {
				const scrollHeight = contentInnerRef.value?.scrollHeight

				switch (type) {
					case 'top':
						contentRef.value?.scrollTo({ top: 0, behavior })
						break
					case 'bom':
						contentRef.value?.scrollTo({ top: scrollHeight, behavior })
						break
				}
			});
		}

		const afterLeaveCallback = () => {
			// isFull.value = false;
			isCollapsed.value = false;
			robot.showRightContent = false;
		};

		const onContentScroll = (e: any) => {
			const target = e.target
			const clientHeight = target?.clientHeight;
			const scrollHeight = target?.scrollHeight;
			const scrollTop = target?.scrollTop;

			if (scrollHeight - clientHeight - scrollTop > 200) {
				showBackBom.value = true;
			} else {
				showBackBom.value = false;
			}
		};

		const collapsedChange = (collapsed: boolean) => {
			isCollapsed.value = collapsed
		}

		const backBomClick = () => {
			chatbotScrollTo('bom', 'auto')
		}

		return {
			app,
			title,
			isFull,
			sendValue,
			isCollapsed,
			showBackBom,
			dataOptions,
			normalStyle,
			fullStyle,
			rightContentStyle,
			rightWrapperStyle,
			contentRef,
			contentInnerRef,
			cardEllipsisOptions,
			showSettings: computed(() => robot.showSettings),
			showCreate: computed(() => robot.showCreate),
			showWelcome,
			showRightContent,
			onAfterEnter,
			collapsedChange,
			onContentScroll,
			afterLeaveCallback,
			backBomClick
		};
	},
});
</script>

<style lang="scss" scoped>
.chatbot {
	height: 100%;
	border: 1px solid var(--n-border-color);
}

.chatbot-main {
	position: relative;
	height: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	.chatbot-main_wrapper {
		position: relative;
		width: 100%;
		flex: 1;
		// overflow: hidden;
		.chatbot-main_content {
			height: 100%;
			width: 100%;
			// overflow-y: auto;
			// overflow-x: hidden;
		}
	}
	.chatbot-main_footer {
		width: 100%;
	}
}
</style>

<style lang="scss">
.n-modal-container {
	z-index: 2020 !important;
}
.header-extra {
	.n-card-header__extra {
		cursor: pointer;
		svg {
			font-size: 20px;
		}
	}
}

.n-modal .n-card__content {
	overflow: hidden;
}
</style>
