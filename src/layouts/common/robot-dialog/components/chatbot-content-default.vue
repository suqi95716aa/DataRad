<template>
	<div class="default-box">
		<div class="logo mb-10">
			<img src="~@/assets/images/ai-pic.png" alt="" />
		</div>
		<div class="name mb-10">AiRobot 分析工具</div>
		<div class="desc">欢迎使用</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
	setup() {
		return {};
	},
});
</script>

<style lang="scss" scoped>
.default-box {
	position: absolute;
	top: 0;
	left: 16px;
	right: 0;
	bottom: 0;
	z-index: 99;
	height: 100%;
	width: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	background-color: var(--baseColor);
	.mb-10 {
		margin-bottom: 10px;
	}
	.logo {
		width: 80px;
		height: 80px;
		background-color: #1890ff;
		border-radius: 50%;
		padding: 6px;
		box-sizing: border-box;
		img {
			width: 100%;
			height: 100%;
			border-radius: 50%;
		}
	}
	.name {
		font-size: 22px;
		font-weight: 500;
	}
	.desc {
		width: 250px;
		font-size: 16px;
		text-align: center;
	}
}
</style>
