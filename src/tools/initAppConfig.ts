// 处理初始化加载project setting 或者本地缓存里的project config
// 将业务逻辑与工具方法剥离 所以工具方法不再处理更新store数据转而在该函数内更新

import type { ProjectConfig } from '/#/config'
import { PROJ_CFG_KEY } from '/@/enums/storgeEnum'
import projectSetting from '/@/settings/projectSetting'

import { App } from 'vue'

import { useLocaleStore } from '/@/store/modules/locale'
import { getCommonStoragePrefix, getStorageShortName } from '/@/utils/env'
import { deepMerge } from '/@/utils'
import { useAppStore } from '/@/store/modules/app'
import { Persistent } from '/@/utils/storge/persistent'

import { setupErrorHandle } from '/@/tools/error-handle'
import {
  t_changeTheme,
  TModeEnum,
  t_updateColorWeak,
  t_updateDarkTheme,
  t_updateGrayMode
} from './theme'

import { primaryColor } from './theme/generateColors'
import { ThemeEnum } from '/@/enums/appEnum'

export function changeTheme(color: string, mode: ThemeEnum) {
  const appStore = useAppStore()
  const m = mode === ThemeEnum.DARK ? TModeEnum.DARK : TModeEnum.LIGHT
  t_changeTheme(color, m)
  appStore.setProjectConfig({ themeColor: color })
}

export function updateColorWeak(colorWeak: boolean) {
  const appStore = useAppStore()
  colorWeak && t_updateColorWeak(colorWeak)
  appStore.setProjectConfig({ colorWeak })
}

export function updateGrayMode(grayMode: boolean) {
  const appStore = useAppStore()
  grayMode && t_updateGrayMode(grayMode)
  appStore.setProjectConfig({ grayMode })
}

export function updateDarkTheme(mode: ThemeEnum, color?: string) {
  const appStore = useAppStore()
  const projCfg: ProjectConfig = Persistent.getLocal(PROJ_CFG_KEY) as ProjectConfig
  const { themeColor } = projCfg
  const c = color || themeColor || primaryColor
  const m = mode === ThemeEnum.DARK ? TModeEnum.DARK : TModeEnum.LIGHT
  t_updateDarkTheme(m, c)
  appStore.setDarkMode(mode)
}

export function initAppConfig(app: App) {
  const appStore = useAppStore()
  let projCfg: ProjectConfig = Persistent.getLocal(PROJ_CFG_KEY) as ProjectConfig
  projCfg = deepMerge(projectSetting, projCfg || {})

  const darkMode = appStore.getDarkMode
  const { colorWeak, grayMode, themeColor = primaryColor } = projCfg

  try {
    changeTheme(themeColor, darkMode)
    updateGrayMode(grayMode)
    updateColorWeak(colorWeak)
    updateDarkTheme(darkMode, themeColor)
  } catch (error) {
    console.log(error)
  }

  const localeStore = useLocaleStore()
  localeStore.initLocale()

  const { useErrorHandle } = projCfg
  if (useErrorHandle) {
    setupErrorHandle(app)
    appStore.setProjectConfig({ useErrorHandle })
  }

  setTimeout(() => {
    clearOldVersionStorage()
  }, 0)
}

export function clearOldVersionStorage() {
  const commonPrefix = getCommonStoragePrefix()
  const shortPrefix = getStorageShortName()

  const list = [localStorage, sessionStorage]
  list.forEach((item: Storage) => {
    Object.keys(item).forEach((key) => {
      if (key && key.startsWith(commonPrefix) && !key.startsWith(shortPrefix)) {
        item.removeItem(key)
      }
    })
  })
}
