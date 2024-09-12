<template>
	<img v-if="type === 'csv'" :style="{'width': size + 'px'}" src="@/assets/images/file-type-csv.png" alt="" />
	<img v-else-if="type === 'xlsx'" :style="{'width': size + 'px'}" src="@/assets/images/file-type-xlsx.png" alt="" />
	<img v-else-if="type === 'doc' || type === 'docx'" :style="{'width': size + 'px'}" src="@/assets/images/file-type-word.png" alt="" />
	<img v-else-if="type === 'md'" :style="{'width': size + 'px'}" src="@/assets/images/file-type-md.png" alt="" />
	<img v-else-if="type === 'txt'" :style="{'width': size + 'px'}" src="@/assets/images/file-type-txt.png" alt="" />
	<img v-else-if="type === 'pdf'" :style="{'width': size + 'px'}" src="@/assets/images/file-type-pdf.png" alt="" />
	<img v-else :style="{'width': size + 'px'}" src="@/assets/images/file-type-unknown.png" alt="" />
</template>

<script lang="ts" setup>
defineOptions({ name: 'FileTypeIcon' });

interface Props {
  /** 文件图标类型 */
  type?: string;
	size?: number;
}

withDefaults(defineProps<Props>(), {
  type: '',
	size: 18
});
</script>

<style lang="scss" scoped>
</style>
