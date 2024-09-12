<template>
	<div class="chatbot-content" ref="contentRef">
		<ChatbotContentCard ref="cardRef" v-for="item in records" :key="item.id" :item="item" />
		<!-- <div class="chat-card pb-24" ref="cardRef" :class="{'reverse': item.userType === 1}" v-for="item in records" :key="item.id">
			<div class="card-pic" :class="{'pd-2': item.userType === 2}">
				<img v-if="item.userType === 2" src="~@/assets/images/ai-pic.png" alt="" />
				<img v-else src="~@/assets/images/test.jpg" alt="" />
			</div>
			<div class="card-box">
				<div class="card-box_top">
					<span class="datetime">{{ item.datetime }}</span>
				</div>
				<div class="card-box_mid">
					<div class="card-box-inner_left">
						<div v-if="item.loading" class="loading-box">
							<n-spin :size="14" />
							<span class="ml-8">正在分析数据中...</span>
						</div>
						<div v-if="item.loaded && !item.loading && item.error" class="tips-box">
							<div class="t-error">
								<p>分析失败，请重新再试！</p>
								<n-popover trigger="hover">
									<template #trigger>
										<n-icon class="reload-icon ml-8" size="16">
											<icon-local-reload />
										</n-icon>
									</template>
									<span>重新加载</span>
								</n-popover>
							</div>
						</div>
						<div v-if="item.loaded && !item.loading && !item.error" class="results">
							<p v-if="item.type === 1" class="c-text">{{ item.value }}</p>
						</div>
					</div>
					<div class="card-box-inner_right">
						<n-dropdown
							:options="cardEllipsisOptions"
							size="small"
							:placement="item.userType === 1 ? 'left' : 'right'"
							@select="(key) => handleCardSelect(key, item)"
						>
							<n-icon class="evs-icon" size="12">
								<EllipsisVerticalSharpIcon />
							</n-icon>
						</n-dropdown>
					</div>
				</div>
			</div>
		</div> -->
	</div>
</template>

<script lang="ts">
import {
	TrashOutline as TrashIcon,
	SettingsOutline as SettingsIcon,
	EllipsisVerticalSharp as EllipsisVerticalSharpIcon,
	Copy as CopyIcon,
	ChevronDownOutline as DownIcon
} from "@vicons/ionicons5";
import html2canvas from 'html2canvas';
import moment from 'moment';
import { h, ref, defineComponent, computed, nextTick, onMounted, onBeforeUnmount } from "vue";
import type { Component } from "vue";
import { NIcon, useMessage } from "naive-ui";
import { useRobotStore } from '@/store';
import { EventBus, downloadImgFile } from '@/utils';
import ChatbotContentCard from './chatbot-content-card.vue';

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

export default defineComponent({
	components: {
		TrashIcon,
		SettingsIcon,
		CopyIcon,
		EllipsisVerticalSharpIcon,
		DownIcon,
		ChatbotContentCard
	},
	setup() {
		const contentRef = ref(null)
		const cardRef = ref()

		const message = useMessage()
		const robot = useRobotStore()

		const records = computed(() => {
			const fIndex = robot.chatbotRecords.findIndex((item) => item.id === robot.chatbotId)
			let res = [] as Robot.Record[]
			if (fIndex !== -1) {
				res = robot.chatbotRecords[fIndex].list
			}

			return res
		})

		const backBomHandle = () => {
			nextTick(() => {
				const length = records.value.length
				if (length > 0) {
					// cardRef.value[length - 1].scrollIntoView();
				}
			})
		}

		onMounted(() => {
			backBomHandle()
			EventBus.on('back-bom', () => {
				backBomHandle()
			})
			EventBus.on('download-chatbot-img', () => {
				downloadChatbotImgHandle()
			})
		})

		onBeforeUnmount(() => {
			EventBus.off('back-bom')
			EventBus.off('download-chatbot-img')
		})

		const contentScroll = (el: any) => {
			console.log('el-----', el)
		}

		const handleCardSelect = (key: string, item: any) => {
			switch(key) {
				case 'copy':
					navigator.clipboard.writeText(item.value)
					break
			}
		};

		const getImgName = (): string => {
			const name = robot.chatbotItem.screenName || ''
			const datetime = moment().format('YYYYMMDDHHmmss')
			return `${name}-${datetime}.png`
		}

		const downloadChatbotImgHandle = async () => {
      const dom: any = contentRef.value
      let canvas
      try {
        canvas = await html2canvas(dom, {
          useCORS: true
        })
      } catch (error) {
        console.log('error', error)
        message.error('导出图片失败')
      }
      if (!canvas) return
      const imgUrl = canvas.toDataURL('image/png')
			const name: string = getImgName()
      downloadImgFile(imgUrl, name)
    }

		return {
			contentRef,
			cardRef,
			contentScroll,
			records,
			cardEllipsisOptions,
			handleCardSelect
		};
	},
});
</script>

<style lang="scss" scoped>
.chatbot-content {
	position: relative;
	margin: 0 auto;
	max-width: 800px;
	height: 100%;
	padding: 16px;
	box-sizing: border-box;
	.chat-card {
		display: flex;
		align-items: flex-start;
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
			display: flex;
			flex-direction: column;
			.card-box_top {
				.datetime {
					font-size: 14px;
					color: #b4bbc4;
				}
			}
			.card-box_mid {
				margin-top: 8px;
				display: flex;
				.card-box-inner_left {
					padding: 8px 12px;
					background-color: #f4f6f8;
					border-radius: 6px;
					.loading-box {
						display: flex;
						align-items: center;
						.ml-8 {
							margin-left: 8px;
						}
					}
					.tips-box {

						.ml-8 {
							margin-left: 8px;
						}
						.t-error {
							display: flex;
							align-items: center;
							.reload-icon {
								cursor: pointer;
								&:hover {
									opacity: 0.8;
								}
							}
						}
					}
				}
				.card-box-inner_right {
					align-self: flex-end;
					padding: 0 6px;
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
}
</style>
