<template>
	<div class="flex wh-full" :style="{ backgroundColor: bgColor }">
		<!-- <div class="flex-y-center justify-between">
			<n-button class="flex-1" :block="true" @click="toKnowAnyModule('data-source')">
				{{ knowanyModuleLabels['data-source'] }}
			</n-button>
			<div class="w-12px"></div>
			<n-button class="flex-1" :block="true" @click="toKnowAnyModule('knowledge-base')">
				{{ knowanyModuleLabels['knowledge-base'] }}
			</n-button>
		</div> -->
		<div class="knowany-nav">
			<div class="nav-box">
				<n-popover placement="right" trigger="hover">
					<template #trigger>
						<n-button size="tiny" quaternary @click="toKnowAnyModule('knowany')">
							<template #icon>
								<n-icon><cash-icon /></n-icon>
							</template>
						</n-button>
					</template>
					<span>首页</span>
				</n-popover>
				<n-divider style="margin-top: 6px;margin-bottom: 6px;" />
				<n-popover placement="right" trigger="hover">
					<template #trigger>
						<n-button size="tiny" quaternary @click="toKnowAnyModule('data-source')">
							<template #icon>
								<n-icon><cash-icon /></n-icon>
							</template>
						</n-button>
					</template>
					<span>数据源</span>
				</n-popover>
				<n-divider style="margin-top: 6px;margin-bottom: 6px;" />
				<n-popover placement="right" trigger="hover">
					<template #trigger>
						<n-button size="tiny" quaternary @click="toKnowAnyModule('knowledge-base')">
							<template #icon>
								<n-icon><cash-icon /></n-icon>
							</template>
						</n-button>
					</template>
					<span>知识库</span>
				</n-popover>
				<n-divider style="margin-top: 6px;margin-bottom: 6px;" />
				<n-popover placement="right" trigger="hover">
					<template #trigger>
						<n-button size="tiny" quaternary>
							<template #icon>
								<n-icon><cash-icon /></n-icon>
							</template>
						</n-button>
					</template>
					<span>用户</span>
				</n-popover>
			</div>
		</div>
		<div class="knowany-main flex-1">
			<transition name="fade-slide" mode="out-in" appear>
				<component :is="activeModule.component" />
			</transition>
		</div>
		<div class="knowany-right"></div>
	</div>
</template>

<script setup lang="ts">
import { CashOutline as CashIcon } from '@vicons/ionicons5';
import { computed } from 'vue';
import type { Component } from 'vue';
import { knowanyModuleLabels } from '@/constants';
import { useThemeStore } from '@/store';
import { useRouterPush } from '@/composables';
import { mixColor } from '@/utils';
import { DataSource, KnowledgeBase } from './views';

interface Props {
  /** 首页模块分类 */
  module: UnionKey.knowanyModule;
}

interface knowanyModule {
  key: UnionKey.knowanyModule;
  label: string;
  component: Component;
}

const theme = useThemeStore();
const { toKnowAnyModule } = useRouterPush();
const props = defineProps<Props>();

const modules: knowanyModule[] = [
  { key: 'data-source', label: knowanyModuleLabels['data-source'], component: DataSource },
  { key: 'knowledge-base', label: knowanyModuleLabels['knowledge-base'], component: KnowledgeBase },
];

const activeModule = computed(() => {
  const active: knowanyModule = { ...modules[0] };
  const findItem = modules.find(item => item.key === props.module);
  if (findItem) {
    Object.assign(active, findItem);
  }
  return active;
});

const bgColor = computed(() => {
  // const COLOR_WHITE = '#ffffff';
  // const ratio = theme.darkMode ? 0.5 : 0.2;
  // return mixColor(COLOR_WHITE, theme.themeColor, ratio);
	return '#f3f5fa'
});
</script>

<style lang="scss" scoped>
.knowany-nav {
	position: relative;
	width: 96px;
	.nav-box {
		position: absolute;
		top: 50%;
		left: 8px;
    transform: translateY(-50%);
    z-index: 101;
		min-height: 200px;
		border-radius: 12px;
		transform: translateY(-50%);
		display: flex;
		flex-direction: column;
		padding: 10px;
		background-color: #fafbff;
		box-shadow: 2px 2px 7.7px 0px rgba(146, 159, 202, 0.19), 0px 0px 1px 1px rgba(255, 255, 255, 0.45) inset;
		transition: all .3s ease;
	}
}
.knowany-right {}
</style>
