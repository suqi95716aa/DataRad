<template>
	<div class="details-container">
		<div class="details-wrapper">
			<div class="details-header">
				<div class="h-close">
					<n-button quaternary circle @click="closeClick">
						<template #icon>
							<n-icon size="20"><CloseIcon /></n-icon>
						</template>
					</n-button>
				</div>
			</div>
			<div class="details-content">
				<VisualContent v-if="type === 'chart'" />
				<SqlContent v-if="type === 'sql'"/>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import {
	Close as CloseIcon
} from "@vicons/ionicons5";
import VisualContent from './chartbot-content-right-visual.vue';
import SqlContent from './chartbot-content-right-sql.vue';
import { ref, computed, defineComponent } from 'vue';
import { useRobotStore } from "@/store";
import { EventBus } from "@/utils";

export default defineComponent({
	components: {
		CloseIcon,
		VisualContent,
		SqlContent
	},
	setup () {
		const active = ref('A0');
		const robot = useRobotStore();

		const type = computed(() => robot.chatbotRightContentType)

		const closeClick = () => {
			robot.showRightContent = false
			EventBus.emit('chatbot-sider-collapsed', false);
		}

		return {
			active,
			type,
			closeClick
		}
	}
})
</script>

<style lang="scss" scoped>
.details-container {
	width: 100%;
	height: 100%;
	.details-wrapper {
		height: 100%;
		display: flex;
		flex-direction: column;
		.details-header {
			position: relative;
			height: 38px;
			border-bottom: 1px solid var(--n-border-color);
			.h-close {
				position: absolute;
				top: 50%;
				left: 5px;
				z-index: 99;
				transform: translateY(-50%);
			}
		}
		.details-content {
			flex: 1;
			overflow: hidden;
		}
	}
}
</style>
