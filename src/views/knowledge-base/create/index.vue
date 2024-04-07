<template>
	<div class="create">
		<div class="create-wrapper">
			<div class="create-content">
				<div class="c-title">知识库新建</div>
				<div class="c-form">

				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useTabStore } from "@/store";
import { useRoute } from 'vue-router';

export default defineComponent({
	setup () {
		const tabStore = useTabStore();
		const route = useRoute();
		const id = route.query.id;

		if (id) {
			tabStore.setActiveTabTitle('知识库编辑');
		} else {
			tabStore.setActiveTabTitle('知识库新建');
		}
		return {}
	}
})
</script>

<style lang="scss" scoped>
.create {
	height: 100%;
	width: 100%;
	.create-wrapper {
		height: 100%;
		width: 100%;
		background-color: var(--baseColor);
		.create-content {
			height: 100%;
			padding: 20px;
			.c-title {
				height: 48px;
				line-height: 48px;
				font-size: 16px;
				font-weight: 500;
			}
		}
	}
}
</style>
