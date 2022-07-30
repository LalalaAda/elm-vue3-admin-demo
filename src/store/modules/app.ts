import type { ProjectConfig } from '/#/config'

import { defineStore } from 'pinia'
import { store } from '/@/store'

import { ThemeEnum } from '/@/enums/appEnum'
import { PROJ_CFG_KEY, APP_DARK_MODE_KEY_ } from '/@/enums/storgeEnum'

import { Persistent } from '/@/utils/storge/persistent'
import { deepMerge } from '/@/utils'

interface AppState {
  darkMode?: ThemeEnum
  pageLoading: boolean
  projectConfig: ProjectConfig | null
}

let timeId: ReturnType<typeof setTimeout>

export const useAppStore = defineStore({
  id: 'app',
  state: (): AppState => ({
    darkMode: undefined,
    pageLoading: false,
    projectConfig: Persistent.getLocal(PROJ_CFG_KEY)
  }),
  getters: {
    getPageLoading(): boolean {
      return this.pageLoading
    },
    getDarkMode(): ThemeEnum {
      return this.darkMode || (localStorage.getItem(APP_DARK_MODE_KEY_) as ThemeEnum) || 'light'
    },
    getProjectConfig(): ProjectConfig {
      return this.projectConfig || ({} as ProjectConfig)
    }
  },
  actions: {
    setPageLoading(loading: boolean): void {
      this.pageLoading = loading
    },
    setDarkMode(mode: ThemeEnum): void {
      this.darkMode = mode
      localStorage.setItem(APP_DARK_MODE_KEY_, mode)
    },
    setProjectConfig(config: Partial<ProjectConfig>): void {
      this.projectConfig = deepMerge(this.projectConfig || {}, config)
      Persistent.setLocal(PROJ_CFG_KEY, this.projectConfig, true)
    },

    async resetAllState() {
      Persistent.clearAll()
    },
    async setPageLoadingAction(loading: boolean): Promise<void> {
      if (loading) {
        clearTimeout(timeId)
        // Prevent flicker
        timeId = setTimeout(() => {
          this.setPageLoading(loading)
        }, 50)
      } else {
        this.setPageLoading(loading)
        clearTimeout(timeId)
      }
    }
  }
})

export function useAppStoreOutside() {
  return useAppStore(store)
}
