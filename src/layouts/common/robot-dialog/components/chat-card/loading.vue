<template>
	<div class="loading-box">
		<n-spin :size="14" />
		<span class="ml-8">正在分析数据中...</span>
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
.loading-box {
	display: flex;
	align-items: center;
	padding: 8px 12px;
	border-radius: 4px;
	background-color: #fff;
	.ml-8 {
		margin-left: 8px;
	}
}
</style>
