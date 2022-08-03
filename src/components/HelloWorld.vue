<template>
  <h1>{{ msg }}</h1>

  <p>
    Recommended IDE setup:
    <a href="https://code.visualstudio.com/" target="_blank">VS Code</a>
    +
    <a href="https://github.com/johnsoncodehk/volar" target="_blank">Volar</a>
  </p>

  <p>See <code>README.md</code> for more information.</p>

  <p>
    <a href="https://vitejs.dev/guide/features.html" target="_blank"> Vite Docs </a>
    |
    <a href="https://v3.vuejs.org/" target="_blank">Vue 3 Docs</a>
  </p>

  <el-button type="primary" @click="count++">count is: {{ count }}</el-button>
  <p>
    Edit
    <code>components/HelloWorld.vue</code> to test hot module replacement.
  </p>
  <el-select v-model="selectVal">
    <el-option
      v-for="item in selectOptions"
      :key="item.id"
      :value="item.value"
      :label="item.label"
    />
  </el-select>
  <el-row>
    <el-button type="default" @click="toggleDarkMode">
      {{ darkMode }}
    </el-button>
  </el-row>
  <el-select v-model="color">
    <el-option v-for="item in presetPrimaryColors" :key="item" :value="item" :label="item" />
  </el-select>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useAppStore } from '/@/store/modules/app'
import { ThemeEnum } from '/@/enums/appEnum'
import { primaryColor } from '/@/tools/theme/generateColors'
import { ProjectConfig } from '/#/config'
import { PROJ_CFG_KEY } from '/@/enums/storgeEnum'
import { Persistent } from '/@/utils/storge/persistent'
import { presetPrimaryColors } from '/@/tools/theme/colors'
import { updateDarkTheme, changeTheme } from '/@/tools/initAppConfig'
import { useI18n } from '/@/i18n/useLocale'
const { t } = useI18n()

const selectVal = ref('')
const selectOptions = [
  { value: 0, label: t('common.okText'), id: 0 },
  { value: 1, label: t('router.errorPage'), id: 1 },
  { value: 2, label: t('router.404'), id: 2 },
  { value: 3, label: t('common.resetText'), id: 3 },
  { value: 4, label: t('common.back'), id: 4 }
]

defineProps<{ msg: string }>()
const count = ref(0)

const appStore = useAppStore()
const darkMode = computed(() => appStore.$state.darkMode || ThemeEnum.LIGHT)
function toggleDarkMode() {
  const mode = darkMode.value === ThemeEnum.DARK ? ThemeEnum.LIGHT : ThemeEnum.DARK
  updateDarkTheme(mode)
  appStore.setDarkMode(mode)
}

let projCfg: ProjectConfig = Persistent.getLocal(PROJ_CFG_KEY) as ProjectConfig
const { themeColor } = projCfg
// color-picker组件有bug 待element修复
const color = ref(`${themeColor || primaryColor}`)

watch(color, (val) => {
  console.log(val)
  changeTheme(val, darkMode.value)
})
</script>

<style scoped>
a {
  color: #42b983;
}

label {
  margin: 0 0.5em;
  font-weight: bold;
}

code {
  background-color: #eee;
  padding: 2px 4px;
  border-radius: 4px;
  color: #304455;
}
</style>
