<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import type { EpPropMergeType } from 'element-plus/es/utils/vue/props/types'
import type { Language } from 'element-plus/es/locale/index'

import { ElConfigProvider } from 'element-plus'
import HelloWorld from './components/HelloWorld.vue'
import { useLocale } from '/@/i18n/useLocale'

const elmZIndex = 3000
const elmSize: EpPropMergeType<StringConstructor, '' | 'default' | 'small' | 'large', never> =
  'small'
const hello = 'HelloWorld'
const { elmComputedCLocale } = useLocale()
const locale = elmComputedCLocale.value as Language
</script>

<template>
  <el-config-provider :size="elmSize" :z-index="elmZIndex" :locale="locale">
    <HelloWorld :msg="hello" />
  </el-config-provider>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}
</style>
