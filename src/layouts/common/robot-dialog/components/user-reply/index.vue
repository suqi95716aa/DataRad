<template>
	<div class="user-reply">
		<n-popover
			ref="more"
			style="padding: 4px"
			trigger="hover"
			placement="bottom-end"
			:show-arrow="false"
		>
			<template #trigger>
				<p class="user-reply-box">{{ value }}</p>
			</template>
			<div class="popover-content">
				<div class="item-box" @click.stop.prevent="copyClick">
					<n-icon class="evs-icon" size="12" style="margin-right: 4px;">
						<CopyIcon />
					</n-icon>
					<span>复制</span>
				</div>
			</div>
		</n-popover>
	</div>
</template>

<script lang="ts">
import {
	CopyOutline as CopyIcon
} from "@vicons/ionicons5";
import { defineComponent } from "vue";

export default defineComponent({
	components: {
		CopyIcon
	},
	props: {
		value: String,
	},
	emits: ['copy'],
	setup(props, ctx) {

		const copyClick = () => {
			ctx.emit('copy')
			navigator.clipboard.writeText(String(props.value));
		}

		return {
			copyClick
		};
	},
});
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
.popover-content {
	.item-box {
		display: flex;
		align-items: center;
		font-size: 12px;
		font-family: "PingFang SC", "Microsoft YaHei", SimHei;
		font-weight: 400;
		color: #8f8f8f;
		border-radius: 2px;
		padding: 2px 4px;
		box-sizing: border-box;
		cursor: pointer;
		span {
			line-height: 20px;
		}
		&:hover {
			background-color: #f3f5fc;
			color: #000;
		}
	}
}
</style>
