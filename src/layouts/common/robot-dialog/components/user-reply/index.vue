<template>
	<div class="user-reply">
		<p class="user-reply-box">{{ value }}</p>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
	props: {
		value: String
	},
	setup () {

		return {
		}
	}
})
</script>

<style lang="scss" scoped>
.user-reply {
	width: 100%;
	padding: 8px 12px;
	border-radius: 4px;
	background-color: #fff;
	&.reply-error {
		background-color: rgb(253, 237, 237);
		color: rgb(95, 33, 32);
	}
	.user-reply-box {
		max-width: 100%;
	}
	.a-link {
		color: #1890ff;
		text-decoration: underline;
		margin: 0 2px;
	}
}
</style>
