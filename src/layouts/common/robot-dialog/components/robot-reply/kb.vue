<template>
	<div class="kb-reply">
		<slot name="default"></slot>
		<slot name="action"></slot>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({})
</script>

<style lang="scss" scoped>
.kb-reply {
	width: 100%;
	padding: 8px 12px;
	border-radius: 4px;
	background-color: #fff;

	.kb-reply-box {
		max-width: 100%;
	}
}
</style>
