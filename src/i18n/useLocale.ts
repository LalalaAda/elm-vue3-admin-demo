import type { ElementUILocaleType } from '/#/config'

import { i18n } from './setupI18n'
import { uselocaleStoreOutside } from '/@/store/modules/locale'

import { unref, computed } from 'vue'
import { setHtmlPageLang, loadLocalePool } from './helper'

interface LangModule {
  message: Recordable
  dateLocale: Recordable
  dateLocaleName: string
}

function setI18nLanguage(locale: ElementUILocaleType) {
  const localeStore = uselocaleStoreOutside()

  if (i18n.mode === 'legacy') {
    i18n.global.locale = locale
  } else {
    ;(i18n.global.locale as any).value = locale
  }
  localeStore.setLocaleInfo({ locale })
  setHtmlPageLang(locale)
}

export function useLocale() {
  const localeStore = uselocaleStoreOutside()
  const computedLocale = computed(() => localeStore.getLocale)

  const elmComputedCLocale = computed(() => {
    return i18n.global.getLocaleMessage(unref(computedLocale))?.elmLocale ?? {}
  })

  async function changeLocale(locale: ElementUILocaleType) {
    const globalI18n = i18n.global
    const currentLocale = unref(globalI18n.locale)
    if (currentLocale === locale) {
      return locale
    }

    if (loadLocalePool.includes(locale)) {
      setI18nLanguage(locale)
      return locale
    }

    const langModule = ((await import(`./lang/${locale}.ts`)) as any).default as LangModule
    if (!langModule) {
      return
    }

    const { message } = langModule

    globalI18n.setLocaleMessage(locale, message)
    loadLocalePool.push(locale)

    setI18nLanguage(locale)
    return locale
  }

  return {
    computedLocale,
    changeLocale,
    elmComputedCLocale
  }
}

export function useI18n() {
  const { t } = i18n.global
  // 写这个方法主要是 提供给 i18n-ally插件 自动补全
  const tfn = (key: string): string => {
    return t(key)
  }
  return {
    t: tfn
  }
}
