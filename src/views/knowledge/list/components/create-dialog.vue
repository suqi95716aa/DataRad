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
			<n-form ref="formRef" :model="model" :rules="rules">
				<n-form-item path="name" label="知识库名称">
					<n-input v-model:value="model.name" placeholder="请输入" @keydown.enter.prevent />
				</n-form-item>
				<n-form-item path="desc" label="知识库描述">
					<n-input
						v-model:value="model.desc"
						type="textarea"
						maxlength="200"
						show-count
						clearable
						:autosize="{
							minRows: 3,
							maxRows: 5
						}"
						placeholder="为更好区分不同知识库数据，请填写提升描述检索概率"
						@keydown.enter.prevent
					/>
				</n-form-item>
				<n-form-item path="vectorModel" label="向量化模型">
					<n-select
						v-model:value="model.vectorModel"
						placeholder="请选择"
						:options="mxOptions"
						@keydown.enter.prevent
					/>
				</n-form-item>
				<n-form-item path="kbIcon" label="知识库图标">
					<div class="kb-content">
						<div class="kb-left">
							<div class="icon-box" :style="{ backgroundColor: activeColor }">
								<img :src="getKbIcon(activeIconKey)" />
							</div>
						</div>
						<div class="kb-right">
							<div class="color-content">
								<p class="color-title">选择背景色</p>
								<div class="color-list">
									<div
										v-for="(color, index) in colorList"
										:key="index"
										class="color-item"
										:style="{ backgroundColor: color}"
										@click="colorClick(color)"
									>
										<icon-local-kb-selected v-if="color === activeColor" class="active-icon" />
									</div>
								</div>
							</div>
							<div class="icon-content">
								<p class="icon-title">选择图标</p>
								<div class="icon-list">
									<div
										v-for="item in iconList"
										:key="item.id"
										class="icon-item"
										:style="{ backgroundColor: item.key === activeIconKey ? activeColor : ''}"
										@click="iconClick(item.key)"
									>
										<img :src="item.icon" alt="" />
									</div>
								</div>
							</div>
						</div>
					</div>
				</n-form-item>
			</n-form>
		</div>
	</n-modal>
</template>

<script lang="ts">
import { ref, defineComponent } from 'vue';
import {
  FormInst,
  FormItemInst,
  FormItemRule,
  useMessage,
  FormRules
} from 'naive-ui';
import { getKbIcon, kbIconList, kbColorList } from '@/config';

interface ModelType {
  name: string | null
	desc: string | null
	vectorModel: string | null
	kbIcon: string | null
}

const mxOptions: any = [
	{
		label: '通用模型1',
		value: '1'
	},
	{
		label: '通用模型2',
		value: '2'
	}
]

export default defineComponent({
	setup () {
		const showModal = ref(false);
		const title = ref('新建知识库');
		const formRef = ref<FormInst | null>(null);
		const activeColor = ref('#1890ff')
		const activeIconKey = ref('help');
		const model = ref<ModelType>({
      name: null,
			desc: null,
			vectorModel: null,
			kbIcon: activeIconKey.value
    })

		// methods
		const onShow = (data: any) => {
			showModal.value = true;
		};

		const onHide = () => {
			showModal.value = false;
		};

		const setTitle = (val: string) => {
			title.value = val
		}

		const colorClick = (color: string) => {
			activeColor.value = color
		}

		const iconClick = (name: string) => {
			activeIconKey.value = name
		}

		const rules: FormRules = {
      name: [
        {
          required: true,
          validator (rule: FormItemRule, value: string) {
            if (!value) {
              return new Error('请输入知识库名称')
            }
            return true
          },
          trigger: ['input', 'blur']
        }
      ],
			desc: [
        {
          required: true,
          validator (rule: FormItemRule, value: string) {
            if (!value) {
              return new Error('请输入知识库描述')
            }
            return true
          },
          trigger: ['input', 'blur']
        }
      ],
			vectorModel: [
        {
          required: true,
          validator (rule: FormItemRule, value: string) {
            if (!value) {
              return new Error('请选择向量化模型')
            }
            return true
          },
          trigger: ['input', 'blur']
        }
      ],
			kbIcon: [
        {
          required: true,
          validator (rule: FormItemRule, value: string) {
            if (!value) {
              return new Error('请选择图标')
            }
            return true
          },
          trigger: ['input', 'blur']
        }
      ],
    }

		return {
			showModal,
			formRef,
			model,
			rules,
			title,
			mxOptions,
			activeColor,
			activeIconKey,
			colorList: kbColorList,
			iconList: kbIconList,
			onShow,
			onHide,
			setTitle,
			getKbIcon,
			colorClick,
			iconClick
		}
	}
})
</script>

<style lang="scss" scoped>
.mt-20 {
	margin-top: 20px;
}
.dialog-content {
	.kb-content {
		display: flex;
		width: 100%;
		.kb-left {
			flex: 0 0 80px;
			margin-right: 20px;
			.icon-box {
				width: 64px;
				height: 64px;
				border-radius: 6px;
				background-color: #d1d3d6;
				display: flex;
				align-items: center;
				justify-content: center;
				img {
					width: 36px;
				}
			}
		}
		.kb-right {
			flex: 1;
			padding: 20px;
			background-color: #f4f5f7;
			border-radius: 8px;
			padding-bottom: 0;
			.color-content {
				.color-title {
					margin-bottom: 10px;
					font-weight: 600;
					font-size: 14px;
				}
				.color-list {
					display: flex;
					flex-wrap: wrap;
					.color-item {
						width: 42px;
						height: 42px;
						background-color: #2454ff;
						margin-right: 20px;
						margin-bottom: 20px;
						border-radius: 6px;
						cursor: pointer;
						display: flex;
						align-items: center;
						justify-content: center;
						.active-icon {
							font-size: 22px;
						}
					}
				}
			}
			.icon-content {
				.icon-title {
					margin-bottom: 10px;
					font-weight: 600;
					font-size: 14px;
				}
				.icon-list {
					display: flex;
					flex-wrap: wrap;
					.icon-item {
						width: 42px;
						height: 42px;
						background-color: #d1d3d6;
						margin-right: 20px;
						margin-bottom: 20px;
						border-radius: 6px;
						cursor: pointer;
						display: flex;
						align-items: center;
						justify-content: center;
						img {
							width: 22px;
						}
					}
				}
			}
		}
	}
}
</style>
