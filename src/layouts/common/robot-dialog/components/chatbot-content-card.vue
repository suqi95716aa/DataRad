<template>
	<div
		v-if="!item.isDelete"
		class="chat-card pb-24"
		:class="{ reverse: item.userType === 1 }"
	>
		<div class="card-pic" :class="{ 'pd-2': item.userType === 2 }">
			<div v-if="item.userType === 2" class="robot-pic">
				<img
					v-if="Number(item.screenType) === 1"
					src="~@/assets/images/data-wd.png"
					alt=""
				/>
				<img
					v-else-if="Number(item.screenType) === 2"
					src="~@/assets/images/know-wd.png"
					alt=""
				/>
				<img
					v-else
					src="~@/assets/images/ai-pic.png"
					alt=""
				/>
			</div>
			<icon-local-avatar v-else class="text-32px" />
			<!-- <img v-else src="~@/assets/images/test.jpg" alt="" /> -->
		</div>
		<div class="card-box">
			<!-- <div class="card-box_top" :class="{'t-r': item.userType === 1}">
				<span class="datetime">{{ item.datetime }}</span>
			</div> -->
			<div class="card-box_mid">
				<div
					class="card-box-inner_left"
					:class="{'flex-fill': item.isTipsReply}"
					:style="{'margin-left': item.userType === 1 ? '42px' : '0', 'margin-right': item.userType === 2 ? '42px' : '0'}"
					>
					<ChatCardLoading v-if="item.loading" />
					<ChatCardError v-if="item.loaded && !item.loading && item.error" />
					<div
						v-if="item.loaded && !item.loading && !item.error"
						class="results"
					>
						<!-- 用户提问 -->
						<div v-if="item.userType === 1" class="results-content">
							<div class="success-results">
								<UserReply :value="item.value"/>
								<!-- <div class="action-box">
									<div class="action-box-left"></div>
									<div class="action-box-right">
										<div class="action-box-item" @click="handleSelect('copy', item)">
											<n-icon class="evs-icon" size="12" style="margin-right: 4px;">
												<CopyIcon />
											</n-icon>
											<span>复制</span>
										</div>
									</div>
								</div> -->
							</div>
						</div>
						<!-- 机器人回复 -->
						<div v-if="item.userType === 2" class="results-content">
							<div v-if="item.isWelcome" class="success-results">
								<RobotReply :success="true" :screen-type="item.screenType" :type="item.replyType"/>
							</div>
							<div v-else-if="item.isTipsReply" class="error-results">
								<RobotReply :success="true" :screen-type="item.screenType" :type="item.replyType">
									<template #action>
										<div class="action-box">
											<div class="action-box-left">
												<div class="action-box-item" @click="handleSelect('copy', item)">
													<n-icon class="evs-icon" size="12" style="margin-right: 4px;">
														<CopyIcon />
													</n-icon>
													<span>复制</span>
												</div>
											</div>
										</div>
									</template>
								</RobotReply>
							</div>
							<div v-else-if="item.isKbReply" class="success-results">
								<RobotReplyKB>
									<template #default>
										<p>{{ item?.data?.answer }}</p>
									</template>
									<template #action>
										<div class="action-box">
											<div class="action-box-left">
												<div class="action-box-item" @click="handleSelect('copy', item)">
													<n-icon class="evs-icon" size="12" style="margin-right: 4px;">
														<CopyIcon />
													</n-icon>
													<span>复制</span>
												</div>
											</div>
										</div>
									</template>
								</RobotReplyKB>
							</div>
							<div v-else class="success-results">
								<RobotReplyDH>
									<template #default>
										<ChatCardChart :card-data="item" />
										<div v-if="item?.data?.spss_reasoning" class="reasoning">
											<n-divider style="margin-top: 8px;margin-bottom: 24px;" />
											<p>{{ item?.data?.spss_reasoning }}</p>
										</div>
									</template>
									<template #action>
										<div class="action-box">
											<div class="action-box-left">
												<div class="action-box-item" @click="handleSelect('copy', item)">
													<n-icon class="evs-icon" size="12" style="margin-right: 4px;">
														<CopyIcon />
													</n-icon>
													<span>复制</span>
												</div>
											</div>
											<div class="action-box-right">
												<div class="action-box-item mr-6px" @click="handleSelect('sql', item)">
													<n-icon class="evs-icon" size="12" style="margin-right: 4px;">
														<SqlIcon />
													</n-icon>
													<span>SQL查询</span>
												</div>
												<div class="action-box-item" @click="handleSelect('chart', item)">
													<n-icon class="evs-icon" size="12" style="margin-right: 4px;">
														<KshIcon />
													</n-icon>
													<span>数据可视化</span>
												</div>
											</div>
										</div>
									</template>
								</RobotReplyDH>
							</div>
						</div>
						<!-- <div class="action-footer">
							<n-button text>
								<template #icon>
									<n-icon>
										<ReloadIcon />
									</n-icon>
								</template>
								重新生成
							</n-button>
						</div> -->
					</div>
				</div>
				<!-- <div class="card-box-inner_right" :class="{'flex-justify-end': item.userType === 1}">
					<n-dropdown
						:options="getDropdownOpts(item)"
						size="small"
						:placement="item.userType === 1 ? 'left' : 'right'"
						:disabled="item.loading"
						@select="(key) => handleSelect(key, item)"
					>
						<n-icon class="evs-icon" size="18">
							<EllipsisVerticalSharpIcon />
						</n-icon>
					</n-dropdown>
				</div> -->
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import {
	TrashOutline as TrashIcon,
	EllipsisVerticalSharp as EllipsisVerticalSharpIcon,
	CopyOutline as CopyIcon,
	Reload as ReloadIcon
} from "@vicons/ionicons5";
import SvgIcon from '@/components/custom/svg-icon.vue';
import RobotReply from './robot-reply/index.vue';
import UserReply from './user-reply/index.vue';
import RobotReplyKB from './robot-reply/kb.vue';
import RobotReplyDH from './robot-reply/dh.vue';
import type { Component } from "vue";
import { NIcon } from "naive-ui";
import { h, defineComponent } from "vue";
import { useRobotStore } from "@/store";
import { ChatCardLoading, ChatCardError, ChatCardChart } from "./chat-card";
import { EventBus } from "@/utils";

const renderIcon = (icon: Component) => {
	return () => {
		return h(NIcon, null, {
			default: () => h(icon),
		});
	};
};

const cardEllipsisOptions = [
	{
		label: "数据可视化",
		key: "chart",
		icon: () => {
			return h(SvgIcon, { localIcon: 'ksh' })
		},
	},
	{
		label: "SQL查询",
		key: "sql",
		icon: () => {
			return h(SvgIcon, { localIcon: 'sql' })
		},
	},
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

export default defineComponent({
	components: {
		CopyIcon,
		EllipsisVerticalSharpIcon,
		ChatCardLoading,
		ChatCardError,
		ChatCardChart,
		ReloadIcon,
		RobotReply,
		UserReply,
		RobotReplyDH,
		RobotReplyKB,
		KshIcon: () => {
			return h(SvgIcon, { localIcon: 'ksh' })
		},
		SqlIcon: () => {
			return h(SvgIcon, { localIcon: 'sql' })
		},
	},
	props: {
		item: {
			type: Object,
			default() {
				return {};
			},
		},
	},
	setup() {
		const robot = useRobotStore();

		const handleSelect = (key: string, item: any) => {
			switch (key) {
				case "chart":
					robot.chatbotRecordId = item.id;
					robot.showRightContent = true;
					robot.chatbotRightContentType = 'chart';
					EventBus.emit('chatbot-sider-collapsed', true);
					EventBus.emit('refresh-visual-data');
					break
				case "sql":
					robot.chatbotRecordId = item.id;
					robot.showRightContent = true;
					robot.chatbotRightContentType = 'sql';
					EventBus.emit('chatbot-sider-collapsed', true);
					EventBus.emit('refresh-sql-data');
					break
				case "copy":
					navigator.clipboard.writeText(item.value);
					break;
				case "del":
					robot.delChatbotRecord(item.id);
					break;
			}
		};

		const getDropdownOpts = (row: any) => {
			let res: any = cardEllipsisOptions

			if (row?.userType === 1) {
				res = cardEllipsisOptions.filter(item => ['copy', 'del'].includes(item.key))
			} else {
				if (row.state === 0) {
					res = cardEllipsisOptions.filter(item => ['copy'].includes(item.key))
				} else if (row.state === -2) {
					res = cardEllipsisOptions.filter(item => ['copy', 'del'].includes(item.key))
				}
			}

			return res
		}

		return {
			cardEllipsisOptions,
			handleSelect,
			getDropdownOpts
		};
	},
});
</script>

<style lang="scss" scoped>
.chat-card {
	display: flex;
	align-items: flex-start;
	font-size: 14px;
	color: rgb(51, 54, 57);
	.card-pic {
		flex: 0 0 32px;
		margin-right: 10px;
		border-radius: 50%;
		width: 32px;
		height: 32px;
		box-sizing: border-box;
		&.pd-2 {
			padding: 2px;
		}
		.robot-box {
			width: 100%;
			height: 100%;
			display: flex;
			align-items: center;
			justify-content: center;
			border-radius: 50%;
			overflow: hidden;
			img {
				max-width: 100%;
				max-height: 100%;
			}
		}
	}
	.card-box {
		flex: 1;
		display: flex;
		flex-direction: column;
		overflow: hidden;

		.card-box_top {
			&.t-r {
				text-align: right;
			}
			.datetime {
				font-size: 14px;
				color: #b4bbc4;
			}
		}
		.card-box_mid {
			width: 100%;
			// margin-top: 8px;
			display: flex;
			.card-box-inner_left {
				// flex: 1;
				overflow: hidden;
				&.flex-fill {
					flex: 1;
					// overflow: hidden;
					// margin-right: 42px;
				}
				.results {
					white-space: pre-wrap;

					.results-content {
						position: relative;

						.success-results {
							flex: initial;
							// padding: 12px;
							background-color: #f4f6f8;
							border-radius: 4px;
							.reasoning {
								padding: 8px 12px;
								background-color: #fff;
								// margin-top: 10px;
							}
						}
						.error-results {
							.error-text {
								width: 100%;
								padding: 8px 12px;
								border-radius: 4px;
								background-color: rgb(253, 237, 237);
								color: rgb(95, 33, 32);
							}
							.a-link {
								color: #1890ff;
								text-decoration: underline;
								margin: 0 2px;
							}
						}
					}
					.action-footer {
						height: 36px;
						display: flex;
						align-items: center;
						margin-top: 8px;
					}
					.action-box {
						display: flex;
						// padding: 8px 12px;
						background-color: #fff;
						border-radius: 2px;
						box-sizing: border-box;
						margin-top: 10px;
						.action-box-left {
							flex: 1;
							display: flex;
							align-items: center;
						}
						.mr-10 {
							margin-right: 10px;
						}
						.action-box-right {
							display: flex;
						}
						.action-box-item {
							display: flex;
							align-items: center;
							font-size: 12px;
							font-family: "PingFang SC", "Microsoft YaHei", SimHei;
							font-weight: 400;
							color: #8f8f8f;
							border-radius: 2px;
							padding: 2px 4px;
							box-sizing: border-box;
							cursor: pointer;
							span {
								line-height: 20px;
							}
							&:hover {
								background-color: #f3f5fc;
								color: #000;
							}
						}
					}
				}
			}
			.card-box-inner_right {
				flex: 0 0 42px;
				align-self: flex-end;
				padding: 0 6px;
				display: flex;
				&.flex-justify-end {
					justify-content: flex-end;
				}
				.evs-icon {
					cursor: pointer;
					color: #b4bbc4;
					&:hover {
						color: #40a9ff;
					}
				}
			}
		}
	}
	&.mb-24 {
		margin-bottom: 24px;
	}
	&.pb-24 {
		padding-bottom: 24px;
	}
	&.reverse {
		flex-direction: row-reverse;
		.card-pic {
			margin-left: 10px;
			margin-right: 0;
		}
		.card-box {
			.card-box_mid {
				flex-direction: row-reverse;
			}
		}
	}
}
</style>
