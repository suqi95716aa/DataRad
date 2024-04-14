<template>
	<n-modal
		v-model:show="showModal"
		style="width: 800px; position: fixed; top: 20vh"
		:title="title"
		:show-icon="false"
		preset="dialog"
		positive-text="保存"
    negative-text="取消"
	>
		<div class="dialog-content mt-20">

		</div>
	</n-modal>
</template>

<script lang="ts">
import { ref, defineComponent } from 'vue';

export default defineComponent({
	setup() {
		const showModal = ref(false);
		const title = ref('知识配置');

				// methods
		const onShow = (data: any) => {
			showModal.value = true;
		};

		const onHide = () => {
			showModal.value = false;
		};

		return {
			showModal,
			title,
			onShow,
			onHide
		}
	}
})
</script>

<style lang="scss" scoped>
.mt-20 {
	margin-top: 20px;
}
.dialog-content {

}
</style>
