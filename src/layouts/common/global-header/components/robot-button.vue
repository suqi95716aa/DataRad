<template>
	<div class="global-robot-button" @click="app.openRobotDialog">
		<icon-local-robot_001 />
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useAppStore } from '@/store';

export default defineComponent({
	name: 'RobotButton',
	setup() {
		const app = useAppStore()

		return {
			app
		}
	}
})
</script>

<style lang="scss" scoped>
.global-robot-button {
	position: fixed;
	bottom: 30px;
	right: 30px;
	z-index: 99;
	width: 60px;
	height: 60px;
	border-radius: 50%;
	background-color: #1890ff;
	color: #FFF;
	font-size: 32px;
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
	box-shadow: rgba(0, 0, 0, 0.12) 0px 2px 8px 0px;
	&:hover {
		background-color: #40a9ff;
    color: #FFF;
	}
}
</style>
