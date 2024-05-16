<template>
	<div class="robot-reply" :class="{'reply-error': !success}">
		<p v-if="type === 0" class="robot-reply-box">
			<span>Hi，我是数据问答助手，你可以向我提出任何需要针对数据源查询的问题。但是提问之前请先前往<a class="a-link" href="javascript:;" @click="addClick">配置中心</a>。完善配置信息哦~</span>
		</p>
		<p v-if="type === 1" class="robot-reply-box">
			<span>您当前的问题未查询成功，一般是由于问题描述的清晰度引起的。请修改您的问题后再次尝试，<br />或者点击这里</span>
			<a class="a-link" href="javascript:;">查看常见的问答使用手册和帮助</a>。
		</p>
		<p v-if="type === 2" class="robot-reply-box">
			<span>您当前的数据源好像被删除了哦！请点击这里重新</span>
			<a class="a-link" href="javascript:;" @click="addClick">添加数据源</a>。
		</p>
	</div>
</template>

<script lang="ts">
import { defineComponent, nextTick } from 'vue'
import { useRobotStore } from "@/store";
import { EventBus } from "@/utils";

export default defineComponent({
	props: {
		// 1 默认错误提示 2 数据源被删除错误提示
		type: Number,
		success: Boolean
	},
	setup (props) {
		const robot = useRobotStore();
		const addClick = () => {
			robot.setShowSettings(true);
			nextTick(() => {
				EventBus.emit('set-chatbot-settings', 2);
			})
		}

		return {
			addClick
		}
	}
})
</script>

<style lang="scss" scoped>
.robot-reply {
	width: 100%;
	padding: 8px 12px;
	border-radius: 4px;
	background-color: #f4f6f8;
	&.reply-error {
		background-color: rgb(253, 237, 237);
		color: rgb(95, 33, 32);
	}
	.robot-reply-box {
		max-width: 100%;
	}
	.a-link {
		color: #1890ff;
		text-decoration: underline;
		margin: 0 2px;
	}
}
</style>
