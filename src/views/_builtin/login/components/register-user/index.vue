<template>
  <n-form ref="formRef" :model="model" :rules="rules" size="large" :show-label="false">
		<!-- <n-form-item path="name">
      <n-input v-model:value="model.name" placeholder="用户名" :maxlength="8" />
    </n-form-item> -->
		<n-form-item path="account">
      <n-input v-model:value="model.account" placeholder="账号（6-8位字母和数字组合）" :maxlength="8" />
    </n-form-item>
    <n-form-item path="phone">
      <n-input v-model:value="model.phone" placeholder="手机号码（11位有效的手机号码）" :maxlength="11" />
    </n-form-item>
    <!-- <n-form-item path="code">
      <div class="flex-y-center w-full">
        <n-input v-model:value="model.code" placeholder="验证码" :maxlength="6" />
        <div class="w-18px"></div>
        <n-button size="large" :disabled="isCounting" :loading="smsLoading" @click="handleSmsCode">
          {{ label }}
        </n-button>
      </div>
    </n-form-item> -->
    <n-form-item path="pwd">
      <n-input v-model:value="model.pwd" type="password" show-password-on="click" placeholder="密码（6-18位数字/字符/符号的组合）" :maxlength="12" />
    </n-form-item>
    <n-form-item path="confirmPwd">
      <n-input v-model:value="model.confirmPwd" type="password" show-password-on="click" placeholder="确认密码（6-18位数字/字符/符号的组合）" :maxlength="12" />
    </n-form-item>
    <n-space :vertical="true" :size="18">
      <login-agreement v-model:value="agreement" />
      <n-button type="primary" size="large" :block="true" :round="true" @click="handleSubmit">确定</n-button>
      <n-button size="large" :block="true" :round="true" @click="toLoginModule('pwd-login')">返回</n-button>
    </n-space>
  </n-form>
</template>

<script lang="ts" setup>
import { reactive, ref, toRefs } from 'vue';
import type { FormInst, FormRules } from 'naive-ui';
import { useRouterPush } from '@/composables';
import { useSmsCode } from '@/hooks';
import { formRules, getConfirmPwdRule } from '@/utils';
import { fetchRegister } from '@/service';

const { toLoginModule } = useRouterPush();
const { label, isCounting, loading: smsLoading, start } = useSmsCode();

const formRef = ref<HTMLElement & FormInst>();

const model = reactive({
	name: '',
	account: '',
  phone: '',
  code: '',
  pwd: '',
  confirmPwd: ''
});

const rules: FormRules = {
	name: formRules.name,
	account: formRules.account,
  phone: formRules.phone,
  // code: formRules.code,
  pwd: formRules.pwd,
  confirmPwd: getConfirmPwdRule(toRefs(model).pwd)
};

const agreement = ref(false);

function handleSmsCode() {
  start();
}

async function handleSubmit() {
  await formRef.value?.validate();
	const formData = new FormData();
	formData.append("UserName", model.account);
	formData.append("Phone", model.phone);
	formData.append("Password", model.pwd);
	const res = await fetchRegister(formData);

	const data: any = res.data || {};

	if (data.uid) {
		model.name = '';
		model.account = '';
		model.phone = '';
		model.code = '';
		model.pwd = '';
		model.confirmPwd = '';
		agreement.value = false;
		formRef.value?.restoreValidation();
		window.$message?.success('注册成功!');
		toLoginModule('pwd-login');
	} else {
		window.$message?.error('注册失败!');
	}
}
</script>

<style scoped></style>
