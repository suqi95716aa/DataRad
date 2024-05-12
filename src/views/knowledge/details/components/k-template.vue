<template>
	<n-collapse arrow-placement="right" :default-expanded-names="['1', '2', '3', '4']">
		<div class="k-template-item">
			<n-collapse-item title="直接分段" name="1">
				<n-divider style="margin-top: 0;margin-bottom: 10px;" />
				<p class="k-p-1 mb-10">适用场景</p>
				<p class="k-p-2 mb-10">适用于针对知识本身的内容进行直接提问。</p>
			</n-collapse-item>
		</div>
		<div class="k-template-item">
			<n-collapse-item title="特定类型标题分段" name="2">
				<n-divider style="margin-top: 0;margin-bottom: 10px;" />
				<p class="k-p-1 mb-10">适用场景</p>
				<p class="k-p-2 mb-10">适用于以知识的段落为单位进行提问，仅支持使用预设的标题样式来分隔文档中的不同部分的文档。</p>
				<p class="k-p-1 mb-10">
					<span>建议格式</span>
				</p>
				<div class="k-table">
					<n-table :bordered="true" :single-line="false">
						<thead>
							<tr>
								<th style="background-color: #e8e9eb;">CSV</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td style="font-size: 12px;color: #767c82;">
									<p># 一级标题</p>
									<p>## 二级标题</p>
								</td>
							</tr>
						</tbody>
					</n-table>
				</div>
			</n-collapse-item>
		</div>
		<div class="k-template-item">
			<n-collapse-item title="自定义类型标题分段" name="3">
				<n-divider style="margin-top: 0;margin-bottom: 10px;" />
				<p class="k-p-1 mb-10">适用场景</p>
				<p class="k-p-2 mb-10">适用于以知识的段落为单位进行提问，支持在文章中进行自定义标题信息分段。</p>
				<p class="k-p-1 mb-10">
					<span>建议格式</span>
				</p>
				<div class="k-table">
					<n-table :bordered="true" :single-line="false">
						<tbody>
							<tr>
								<td style="font-size: 12px;color: #767c82;">
									<p>1 一级标题</p>
									<p>1.2 二级子标题</p>
									<p>2 一级标题</p>
								</td>
							</tr>
						</tbody>
					</n-table>
				</div>
			</n-collapse-item>
		</div>
		<div class="k-template-item">
			<n-collapse-item title="表格类型分段" name="4">
				<n-divider style="margin-top: 0;margin-bottom: 10px;" />
				<p class="k-p-1 mb-10">适用场景</p>
				<p class="k-p-2 mb-10">适用于结构化表格信息分段。</p>
				<p class="k-p-1 k-flex mb-10">
					<span>建议格式-商品类型QA</span>
					<span class="k-cur" @click="downloadTemplateClick(1)">下载模板</span>
				</p>
				<div class="k-table mb-20">
					<n-table :bordered="true" :single-line="false">
						<thead>
							<tr>
								<th style="background-color: #e8e9eb;">商品名称</th>
								<th style="background-color: #e8e9eb;">品牌</th>
								<th style="background-color: #e8e9eb;">颜色</th>
								<th style="background-color: #e8e9eb;">尺寸</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td style="font-size: 12px;color: #767c82;">衣服</td>
								<td style="font-size: 12px;color: #767c82;">xx</td>
								<td style="font-size: 12px;color: #767c82;">蓝色</td>
								<td style="font-size: 12px;color: #767c82;">M</td>
							</tr>
						</tbody>
					</n-table>
				</div>
				<p class="k-p-1 k-flex mb-10">
					<span>建议格式-问答类型QA</span>
					<span class="k-cur" @click="downloadTemplateClick(2)">下载模板</span>
				</p>
				<div class="k-table">
					<n-table :bordered="true" :single-line="false">
						<thead>
							<tr>
								<th style="background-color: #e8e9eb;">问题</th>
								<th style="background-color: #e8e9eb;">答案</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td style="font-size: 12px;color: #767c82;">在这里填充问题，可多个</td>
								<td style="font-size: 12px;color: #767c82;">在这里填充答案</td>
							</tr>
						</tbody>
					</n-table>
				</div>
			</n-collapse-item>
		</div>
	</n-collapse>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
	setup () {

		const downloadTemplateClick = (type: number) => {
			switch(type) {
				case 1:
					window.location.href = '/商品类型QA-表格.xlsx'
					break
				case 2:
					window.location.href = '/问答类型QA-表格.xlsx'
					break
			}
		}

		return {
			downloadTemplateClick
		}
	}
})
</script>

<style lang="scss" scoped>
.k-template-item {
	width: 100%;
	min-height: 50px;
	background-color: #fafafa;
	padding: 10px;
	box-sizing: border-box;
	border-radius: 8px;
	margin-bottom: 20px;
	:deep(.n-collapse-item__header-main) {
		justify-content: space-between;
	}
	:deep(.n-collapse-item__content-inner) {
		padding-top: 10px !important;
	}
	&:last-child {
		margin-bottom: 0;
	}
	.mb-10 {
		margin-bottom: 10px;
	}
	.mb-20 {
		margin-bottom: 20px;
	}
	.mr-8 {
		margin-right: 8px;
	}
	.k-t-1 {
		font-size: 14px;
		font-weight: 500;
	}
	.k-num {
		padding: 2px 4px;
		border-radius: 2px;
		border: 1px solid #e0e0e0;
		background-color: #fafafa;
	}
	.k-p-1 {
		font-size: 12px;
		font-weight: 500;
	}
	.k-p-2 {
		font-size: 12px;
		font-weight: 500;
		color: #8d8e99;
	}
	.k-flex {
		display: flex;
		justify-content: space-between;
	}
	.k-cur {
		color: #1890ff;
		cursor: pointer;
	}
}
</style>
