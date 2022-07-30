import type { LocaleSetting, ElementUILocaleType } from '/#/config'

import { defineStore } from 'pinia'
import { store } from '/@/store'

import { LOCALE_KEY } from '/@/enums/storgeEnum'
import { createLocalStorage } from '/@/utils/storge'
import { localeSetting } from '/@/settings/localeSetting'

const ls = createLocalStorage()
const { fallback } = localeSetting
const lsLocaleSetting = (ls.get(LOCALE_KEY) || localeSetting) as LocaleSetting

interface LocaleState {
  localInfo: LocaleSetting
}

export const useLocaleStore = defineStore({
  id: 'app-locale',
  state: (): LocaleState => ({
    localInfo: lsLocaleSetting
  }),
  getters: {
    getLocale(): ElementUILocaleType {
      return this.localInfo?.locale ?? fallback
    }
  },
  actions: {
    setLocaleInfo(info: Partial<LocaleSetting>) {
      this.localInfo = { ...this.localInfo, ...info }
      ls.set(LOCALE_KEY, this.localInfo)
    },
    initLocale() {
      this.setLocaleInfo({
        ...localeSetting,
        ...this.localInfo
      })
    }
  }
})

// setup 外使用
export function uselocaleStoreOutside() {
  // 传递pinia的实例
  return useLocaleStore(store)
}
