import type { ProjectConfig } from '/#/config'
import { PROJ_CFG_KEY } from '/@/enums/storgeEnum'
import projectSetting from '/@/settings/projectSetting'

import { useLocaleStore } from '/@/store/modules/locale'
import { getCommonStoragePrefix, getStorageShortName } from '/@/utils/env'
import { deepMerge } from '/@/utils'
import { useAppStore } from '../store/modules/app'
import { Persistent } from '/@/utils/storge/persistent'

import { setupErrorHandle } from '/@/tools/error-handle'
import { App } from 'vue'

export function initAppConfig(app: App) {
  const appStore = useAppStore()
  let projCfg: ProjectConfig = Persistent.getLocal(PROJ_CFG_KEY) as ProjectConfig
  projCfg = deepMerge(projectSetting, projCfg || {})
  // const darkMode = appStore.getDarkMode
  appStore.setProjectConfig(projCfg)

  const localeStore = useLocaleStore()
  localeStore.initLocale()

  const { useErrorHandle } = projCfg
  if (useErrorHandle) {
    setupErrorHandle(app)
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
