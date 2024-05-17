<template>
	<div class="error-box">
		<div class="t-error">
			<p>分析失败，请重新再试！</p>
			<n-popover trigger="hover">
				<template #trigger>
					<n-icon class="reload-icon ml-8" size="16">
						<icon-local-reload />
					</n-icon>
				</template>
				<span>再试一次</span>
			</n-popover>
		</div>
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
.error-box {
	padding: 8px 12px;
	border-radius: 4px;
	background-color: #fff;
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
</style>
