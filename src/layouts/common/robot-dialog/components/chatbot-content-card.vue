<template>
	<div
		v-if="!item.isDelete"
		class="chat-card pb-24"
		:class="{ reverse: item.userType === 1 }"
	>
		<div class="card-pic" :class="{ 'pd-2': item.userType === 2 }">
			<img
				v-if="item.userType === 2"
				src="~@/assets/images/ai-pic.png"
				alt=""
			/>
			<icon-local-avatar v-else class="text-32px" />
			<!-- <img v-else src="~@/assets/images/test.jpg" alt="" /> -->
		</div>
		<div class="card-box">
			<div class="card-box_top" :class="{'t-r': item.userType === 1}">
				<span class="datetime">{{ item.datetime }}</span>
			</div>
			<div class="card-box_mid">
				<div class="card-box-inner_left" :class="{'flex-fill': item.state === -2}">
					<ChatCardLoading v-if="item.loading" />
					<ChatCardError v-if="item.loaded && !item.loading && item.error" />
					<div
						v-if="item.loaded && !item.loading && !item.error"
						class="results"
					>
						<div v-if="item.state === 1" class="success-results">
							<p v-if="item.type === 1" class="c-text">{{ item.value }}</p>
							<ChatCardChart :card-data="item" v-else-if="item.type === 2" />
							<div v-if="item?.data?.spss_reasoning" class="reasoning">
								<p>{{ item?.data?.spss_reasoning }}</p>
							</div>
						</div>
						<div v-else-if="item.state === -2" class="error-results">
							<RobotReply :type="item.type"/>
						</div>
						<!-- <div v-if="item.type === 2" class="action-footer">
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
				<div class="card-box-inner_right" :class="{'flex-justify-end': item.userType === 1}">
					<n-dropdown
						:options="getDropdownOpts(item)"
						size="small"
						:placement="item.userType === 1 ? 'left' : 'right'"
						@select="(key) => handleSelect(key, item)"
					>
						<n-icon class="evs-icon" size="18">
							<EllipsisVerticalSharpIcon />
						</n-icon>
					</n-dropdown>
				</div>
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
		EllipsisVerticalSharpIcon,
		ChatCardLoading,
		ChatCardError,
		ChatCardChart,
		ReloadIcon,
		RobotReply
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
					console.log('item------', item)
					robot.chatbotRecordId = item.id;
					robot.showRightContent = true;
					robot.chatbotRightContentType = 'chart';
					EventBus.emit('chatbot-sider-collapsed', true);
					EventBus.emit('refresh-visual-data');
					break
				case "sql":
					console.log('item------', item);
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
				if (row.state === -2) {
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
		background-color: #1890ff;
		border-radius: 50%;
		width: 32px;
		height: 32px;
		box-sizing: border-box;
		&.pd-2 {
			padding: 2px;
		}
		img {
			width: 100%;
			height: 100%;
			border-radius: 50%;
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
			margin-top: 8px;
			display: flex;
			.card-box-inner_left {
				// flex: 1;
				overflow: hidden;
				&.flex-fill {
					flex: 1;
					overflow: hidden;
				}
				.loading-box {
					padding: 8px 12px;
					background-color: #f4f6f8;
					border-radius: 4px;
					display: flex;
					align-items: center;
					.ml-8 {
						margin-left: 8px;
					}
				}
				.results {
					white-space: pre-wrap;
					.w-max-300 {
						max-width: 300px;
					}

					.w-max-360 {
						max-width: 360px;
					}

					.w-max-80b {
						max-width: 80%;
					}

					.success-results {
						flex: initial;
						padding: 12px;
						background-color: #f4f6f8;
						border-radius: 4px;
						.reasoning {
							margin-top: 10px;
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
					.action-footer {
						height: 36px;
						display: flex;
						align-items: center;
						margin-top: 8px;
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
