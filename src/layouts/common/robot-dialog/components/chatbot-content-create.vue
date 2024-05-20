<template>
	<div class="create-wrapper">
		<div class="create-content">
			<div class="title">
				<span>开启新的会话</span>
			</div>
			<div class="main">
				<div class="list">
					<div class="list-item mr-24px" :class="{'active': checkedValue === '1'}" @click.stop="itemClick('1')">
						<div class="list-item-left">
							<img src="@/assets/images/data-wd.png" />
						</div>
						<div class="list-item-mid">
							<p class="p1">数据问答助手</p>
							<p class="p2">hello</p>
						</div>
						<div class="list-item-right">
							<n-radio :checked="checkedValue === '1'" value="1" @change="handleChange" />
						</div>
					</div>
					<div class="list-item" :class="{'active': checkedValue === '2'}" @click.stop="itemClick('2')">
						<div class="list-item-left">
							<img src="@/assets/images/know-wd.png" />
						</div>
						<div class="list-item-mid">
							<p class="p1">知识问答助手</p>
							<p class="p2">hello</p>
						</div>
						<div class="list-item-right">
							<n-radio :checked="checkedValue === '2'" value="2" @change="handleChange" />
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="footer-action">
			<div class="f-btn">
				<n-button
					type="primary"
					block
					secondary
					strong
					:loading="loading"
					@click.stop="saveClick"
				>
					开始会话
				</n-button>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import {
	ref,
	defineComponent,
} from "vue";
import { useMessage } from "naive-ui";
import { useRobotStore } from "@/store";

export default defineComponent({
	setup() {
		const loading = ref(false)
		const checkedValue = ref('1')

		// hooks
		const robot = useRobotStore();
		const message = useMessage();

		// methods
		const handleChange = (e: any) => {
			const val = e.target.value
			checkedValue.value = val
		}
		const itemClick = (val: string) => {
			checkedValue.value = val
		}
		const saveClick = () => {
			if (!checkedValue.value) return message.warning('请选择问答助手')
			addSubmitHandle()
		}

		const addSubmitHandle = async () => {
			const params = {
				ScreenDesc: "",
				ScreenName: "未命名会话",
				ConfigId: "",
				ConfigName: "",
				ScreenType: Number(checkedValue.value),
				GroupList: [],
			}
			loading.value = true;
			const results = await robot.addChatbot(params);
			loading.value = false;

			console.log('results----aaa', results)
			if (results) {
				robot.setShowCreate(false);
			}
		};


		return {
			loading,
			checkedValue,
			handleChange,
			itemClick,
			saveClick
		}
	}
});
</script>

<style lang="scss" scoped>
.create-wrapper {
	position: absolute;
	top: 0;
	left: 16px;
	right: 0;
	bottom: 0;
	z-index: 100;
	// background-color: var(--baseColor);
	background-color: #f5f5f6;
	display: flex;
	flex-direction: column;
	align-items: center;
	padding-top: 5vh;
	.mr-10 {
		margin-right: 10px;
	}
	.pb-24 {
		padding-bottom: 24px;
	}
	.create-content {
		width: 600px;
		.title {
			font-size: 20px;
			font-weight: 500;
		}
		.main {
			padding-top: 30px;
			.list {
				display: flex;
				.list-item {
					display: flex;
					width: 372px;
					height: 100px;
					margin-bottom: 12px;
					border-radius: 12px;
					padding: 12px;
					display: flex;
					cursor: pointer;
					transition: all 0.3s cubic-bezier(0.36, 0.66, 0.04, 1);
					border-color: transparent;
					position: relative;
					border: 1px solid transparent;
					box-sizing: border-box;
					background-color: #fff;
					&:hover {
						border: 1px solid #1890ff;
					}
					&.active {
						border: 1px solid #1890ff;
					}
					.list-item-left {
						flex: 0 0 48px;
						img {
							width: 48px;
						}
					}
					.list-item-mid {
						flex: 1;
						overflow: hidden;
						padding-left: 12px;
						.p1 {
							font-size: 16px;
							font-weight: 700;
							line-height: 20px;
							padding: 0;
							margin-bottom: 4px;
						}
						.p2 {
							font-size: 14px;
							line-height: 20px;
							padding: 0;
						}
					}
					.list-item-right {
						flex: 0 0 48px;
						display: flex;
						align-items: center;
						justify-content: center;
					}
				}
			}
		}
	}
	.footer-action {
		position: absolute;
		bottom: 30px;
		left: 0;
		right: 30px;
		display: flex;
		align-items: center;
		justify-content: flex-end;
		.mr-20 {
			margin-right: 20px;
		}
	}
}
</style>
