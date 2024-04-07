<template>
	<div class="back-bom">
		<n-button strong secondary circle type="info">
			<template #icon>
				<n-icon color="#fff"><DownIcon /></n-icon>
			</template>
		</n-button>
	</div>
</template>

<script lang="ts">
import { ChevronDownOutline as DownIcon } from "@vicons/ionicons5";
import { defineComponent } from "vue";

export default defineComponent({
	components: {
		DownIcon,
	},
	setup() {

		return {
		};
	},
});
</script>

<style lang="scss" scoped>
.back-bom {
	position: absolute;
	right: 40px;
	bottom: 90px;
	z-index: 9;
}
</style>
