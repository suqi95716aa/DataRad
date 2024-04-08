<template>
	<div class="create">
		<div class="create-wrapper">
			<div class="create-content">
				<div class="c-title mb-20">{{ title }}</div>
				<div class="c-form">
					<n-form
						ref="formRef"
						:model="formData"
						:rules="rules"
						label-placement="left"
						label-width="auto"
						require-mark-placement="right-hanging"
					>
						<n-divider style="width: 650px;" title-placement="left">
							基础信息
						</n-divider>
						<n-form-item label="名称" path="name">
							<n-input v-model:value="formData.name" style="width: 600px;" maxlength="50" show-count clearable placeholder="支持中文、英文、数字、下划线(_)，50个字符以内，不能以下划线开头" />
						</n-form-item>
						<n-form-item label="描述" path="desc">
							<n-input
								v-model:value="formData.desc"
								placeholder="为更好区分不同知识库数据，请填写提升描述检索概率"
								type="textarea"
								style="width: 600px;"
								maxlength="200"
								show-count
								clearable
								:autosize="{
									minRows: 3,
									maxRows: 5
								}"
							/>
						</n-form-item>
						<n-form-item label="标签" path="tags">
							<n-dynamic-tags v-model:value="formData.tags" />
						</n-form-item>
						<n-divider style="width: 650px;" title-placement="left">
							领域模板
						</n-divider>
						<n-form-item label="模板" path="temp">
							<n-select
								v-model:value="formData.temp"
								style="width: 600px;"
								placeholder="请选择领域模板"
								:options="tempOptions"
							/>
						</n-form-item>
						<n-form-item label="向量模型" path="vectorModel">
							<n-select
								v-model:value="formData.vectorModel"
								style="width: 600px;"
								placeholder="请选择向量模型"
								:options="tempOptions"
							/>
						</n-form-item>
						<n-form-item label="检索方式" path="retrievalMode">
							<div style="padding-top: 5px;">
								<n-radio-group v-model:value="formData.retrievalMode" :disabled="true" name="retrievalMode">
									<n-space>
										<n-radio value="1">
											向量检索
										</n-radio>
										<n-radio value="2">
											多路召回
										</n-radio>
									</n-space>
								</n-radio-group>
								<br/>
								<p v-if="formData.retrievalMode === '1'" class="b-tips">利用向量空间模型来计算它们之前的相似度，从而实现文档的检索和排序。</p>
								<p v-if="formData.retrievalMode === '2'" class="b-tips">结合不同的检索模型、特征表示和排序策略，以获得更全面的检索结果。</p>
							</div>
						</n-form-item>
						<n-form-item style="padding-left: 80px;">
							<n-button style="margin-right: 10px;" type="tertiary">
								取消
							</n-button>
							<n-button type="info">
								保存
							</n-button>
						</n-form-item>
					</n-form>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { FormInst, FormItemRule, useMessage } from 'naive-ui';
import { ref, defineComponent } from 'vue'
import { useTabStore } from "@/store";
import { useRoute } from 'vue-router';

const tempOptions: any = [
	{
		label: '普通模板',
		value: '1'
	}
]

export default defineComponent({
	setup () {
		const tabStore = useTabStore();
		const route = useRoute();
		const id = route.query.id;
		const title = ref('');
		const formRef = ref<FormInst | null>(null);
		const formData = ref({
			name: null,
			desc: null,
			tags: [],
			temp: null,
			vectorModel: null,
			retrievalMode: '1'
		})

		if (id) {
			tabStore.setActiveTabTitle('知识库编辑');
			title.value = '知识库编辑';
		} else {
			tabStore.setActiveTabTitle('知识库新建');
			title.value = '知识库新建';
		}


		return {
			formRef,
			formData,
			rules: {
				name: {
          required: true,
          trigger: ['blur', 'input'],
          message: '请输入名称'
        },
				desc: {
          required: true,
          trigger: ['blur', 'input'],
          message: '请填写描述'
        },
				temp: {
          required: true,
          trigger: ['blur', 'input'],
          message: '请选择领域模板'
        },
				vectorModel: {
          required: true,
          trigger: ['blur', 'input'],
          message: '请选择向量模型'
        },
				retrievalMode: {
          required: true,
          trigger: ['blur', 'input'],
          message: '请选择检索方式'
        }
			},
			title,
			tempOptions
		}
	}
})
</script>

<style lang="scss" scoped>
.mb-20 {
	margin-bottom: 20px;
}
.create {
	height: 100%;
	width: 100%;
}
.create-wrapper {
	height: 100%;
	width: 100%;
	background-color: var(--baseColor);
}
.create-content {
	height: 100%;
	padding: 20px;
	.c-title {
		height: 48px;
		line-height: 48px;
		font-size: 18px;
		font-weight: 500;
	}
	.c-form {
		.b-tips {
			color: #9ca3af;
			font-size: 14px;
			margin-top: 4px;
		}
	}
}
</style>
