<template>
	<div class="chatbot-sider">
		<div class="chatbot-sider_top">
			<div class="btn-item">
				<n-button style="width: 100%" dashed :loading="addLoading" @click="addChatbotClick">
					开启新会话
				</n-button>
			</div>
		</div>
		<div class="chatbot-sider_middle">
			<n-scrollbar style="max-height: 100%">
				<div class="list">
					<div
						class="list-item"
						:class="{ active: item.ScreenId === activeId }"
						v-for="item in chatbotList"
						:key="item.ScreenId"
						@click.stop.prevent="itemClick(item)"
					>
						<div class="pic-box">
							<img v-if="item.ScreenType === 1" :src="picIcon1" alt="" />
							<img v-if="item.ScreenType === 2" :src="picIcon2" alt="" />
						</div>
						<!-- <n-icon><chatbox-icon /></n-icon> -->
						<div v-if="item.isEdit" class="inner-box pl-10" @click.stop.prevent>
							<n-input
								ref="inputRef"
								v-model:value="item.screenName"
								class="mr-10"
								type="text"
								size="small"
								:maxlength="20"
								:input-props="{'id': `input-${item.ScreenId}`}"
								:placeholder="item.screenName ? item.screenName : '请输入'"
							/>
							<n-button
								strong
								secondary
								circle
								size="small"
								type="info"
								@click.stop.prevent="saveClick(item.ScreenId, item)"
							>
								<template #icon>
									<n-icon><icon-local-save /></n-icon>
								</template>
							</n-button>
						</div>
						<div v-else class="inner-box">
							<p class="i-text">{{ item.screenName }}</p>
							<n-popover
								ref="more"
								style="padding: 4px"
								trigger="hover"
								:show-arrow="false"
							>
								<template #trigger>
									<n-icon><EllipsisIcon /></n-icon>
								</template>
								<div class="r-more">
									<n-button
										size="small"
										quaternary
										@click="handleSelect('edit', item)"
									>
										<template #icon>
											<n-icon :size="14">
												<CreateIcon />
											</n-icon>
										</template>
										<span>编辑</span>
									</n-button>
									<n-button
										size="small"
										quaternary
										@click="handleSelect('settings', item)"
									>
										<template #icon>
											<n-icon :size="14">
												<SettingsIcon />
											</n-icon>
										</template>
										<span>设置</span>
									</n-button>
									<n-popconfirm
										positive-text="删除"
										@positive-click="() => handleSelect('del', item)"
										@negative-click="() => handleSelect('cancel-del', item)"
									>
										<template #trigger>
											<n-button size="small" quaternary>
												<template #icon>
													<n-icon :size="14">
														<TrashIcon />
													</n-icon>
												</template>
												<span>删除</span>
											</n-button>
										</template>
										<span style="white-space: nowrap">删除该会话？</span>
									</n-popconfirm>
								</div>
							</n-popover>
						</div>
					</div>
				</div>
			</n-scrollbar>
		</div>
		<div class="chatbot-sider_bottom"></div>
		<div class="chatbot-sider_footer">
			<div class="r-pic">
				<img src="../imgs/r_pic.png" alt="" />
			</div>
			<div class="r-info">
				<p>AiRobot</p>
				<p>机器人信息</p>
			</div>
			<div class="r-btn">
				<n-button quaternary circle>
					<template #icon>
						<n-icon><SettingsIcon /></n-icon>
					</template>
				</n-button>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import {
	ChatboxEllipsesOutline as ChatboxIcon,
	TrashOutline as TrashIcon,
	SettingsOutline as SettingsIcon,
	EllipsisVerticalOutline as EllipsisIcon,
	CreateOutline as CreateIcon,
} from "@vicons/ionicons5";
import picIcon1 from '@/assets/images/data-wd.png';
import picIcon2 from '@/assets/images/know-wd.png';
import { ref, defineComponent, computed } from "vue";
import { NIcon, NPopconfirm } from "naive-ui";
import { useRobotStore } from "@/store";
import { EventBus } from "@/utils";

export default defineComponent({
	components: {
		SettingsIcon,
		CreateIcon,
		TrashIcon,
		ChatboxIcon,
		EllipsisIcon,
	},
	setup() {
		const moreRef = ref();
		const inputRef = ref();
		const addLoading = ref(false);

		const robot = useRobotStore();

		const chatbotList = computed(() => robot.chatbotList);
		const activeId = computed(() => robot.chatbotId);

		const getScreenName = (item: Robot.ChatbotItemType) => {
			return item.settings?.ScreenBasicConfig?.ScreenName || "";
		}

		const handleSelect = (
			key: string | number,
			item: Robot.ChatbotItemType
		) => {
			const cIndex = chatbotList.value.findIndex((i) => i.ScreenId === item.ScreenId);
			switch (key) {
				case "edit":
					item.isEdit = true;
					moreRef.value[cIndex].setShow(false);
					break;
				case "settings":
					moreRef.value[cIndex].setShow(false);
					robot.setChatbotId(item.ScreenId);
					robot.setShowSettings(true);
					break;
				case "del":
					robot.delChatbot(item.ScreenId);
					break;
				case "cancel-del":
					moreRef.value[cIndex].setShow(false);
					break;
			}
		};

		// 添加聊天窗口
		const addChatbotClick = async () => {
			robot.setShowCreate(true);
			robot.setChatbotId("");
			// EventBus.emit('init-chatbot-settings');
		};

		const saveClick = async (id: string = "", item: Robot.ChatbotItemType) => {
			item.isEdit = false;
			const res = await robot.updateChatbot(id, {
				ScreenName: item.screenName
			}, 'basicConfig');
			if (res) {
				EventBus.emit('set-chatbot-settings');
			}
		};

		const itemClick = (item: Robot.ChatbotItemType) => {
			robot.setChatbotId(item.ScreenId);
			EventBus.emit("back-bom");
			robot.setShowCreate(false);
			// robot.checkChatbotSettings();
		};

		return {
			more: moreRef,
			inputRef,
			addLoading,
			chatbotList,
			activeId,
			picIcon1,
			picIcon2,
			getScreenName,
			handleSelect,
			addChatbotClick,
			itemClick,
			saveClick,
		};
	},
});
</script>

<style lang="scss" scoped>
.chatbot-sider {
	height: 100%;
	display: flex;
	flex-direction: column;
	// background-color: #f5f5f6;
	.chatbot-sider_top {
		border-bottom: 1px solid var(--n-border-color);
		.btn-item {
			padding: 8px 12px;
		}
	}
	.chatbot-sider_middle {
		flex: 1;
		overflow: hidden;
		padding: 10px 0;
		box-sizing: border-box;
		.list {
			padding: 0 12px;
			.list-item {
				padding: 12px;
				border: 1px solid var(--n-border-color);
				border-radius: var(--n-border-radius);
				margin-top: 10px;
				cursor: pointer;
				display: flex;
				align-items: center;
				&:first-child {
					margin-top: 0;
				}
				&:hover {
					color: #40a9ff;
					border: 1px solid #40a9ff;
				}
				&.active {
					color: #40a9ff;
					border: 1px solid #40a9ff;
				}
				.pic-box {
					flex: 0 0 28px;
					width: 28px;
					height: 28px;
					display: flex;
					align-items: center;
					justify-content: center;
					border-radius: 50%;
					overflow: hidden;
					padding: 5px;
					box-sizing: border-box;
					img {
						max-width: 100%;
						max-height: 100%;
					}
				}
				.n-icon {
					vertical-align: middle;
				}
				.mr-10 {
					margin-right: 10px;
				}
				.pl-10 {
					padding-left: 10px;
				}
				.inner-box {
					flex: 1;
					display: flex;
					align-items: center;
					overflow: hidden;
					.i-text {
						flex: 1;
						display: block;
						white-space: nowrap;
						text-overflow: ellipsis;
						overflow: hidden;
						padding: 0 8px;
						box-sizing: border-box;
					}
				}
			}
		}
	}
	.chatbot-sider_footer {
		display: flex;
		align-items: center;
		padding: 16px;
		border-top: 1px solid var(--n-border-color);
		.r-pic {
			flex: 0 0 40px;
			margin-right: 6px;
			border-radius: 50%;
			background-color: #1890ff;
			display: flex;
			align-items: center;
			justify-content: center;
			padding: 6px;
			box-sizing: border-box;
			img {
				width: 100%;
				height: 100%;
				border-radius: 50%;
			}
		}
		.r-info {
			flex: 1;
			overflow: hidden;
			p {
				line-height: 20px;
				white-space: nowrap;
				text-overflow: ellipsis;
				overflow: hidden;
				&:nth-child(1) {
					font-size: 16px;
					font-weight: 500;
				}
				&:nth-child(2) {
					font-size: 14px;
				}
			}
		}
		.r-btn {
			margin-left: 6px;
		}
	}
}
</style>

<style lang="scss">
.r-more {
	display: flex;
	flex-direction: column;
}
</style>
