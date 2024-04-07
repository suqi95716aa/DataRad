<template>
	<div>

	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useTabStore } from "@/store";

export default defineComponent({
	setup () {
		const tabStore = useTabStore();
		tabStore.setActiveTabTitle('知识库详情');

		return {}
	}
})
</script>

<style scoped>

</style>
