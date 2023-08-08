<template>
	<div class="mt-20px">
		<el-button @click="toggle" size="large">Switch Language</el-button>
		<span class="ml-10px text-#f00440">{{ $t('common.hello') }}</span>
	</div>
</template>

<script lang="ts" setup>
import { $t, setLocale } from '@/locales';
const { locale } = useI18n();

const toggle = () => {
	locale.value === 'zh-CN' ? setLocale('en') : setLocale('zh-CN');
};
</script>
