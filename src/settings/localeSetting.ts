import type { LocaleSetting, ElementUILocaleType } from '/#/config'

const LOCALE: { [key: string]: ElementUILocaleType } = {
  ZH_CN: 'zh-cn',
  EN_US: 'en',
  VI: 'vi', // 越南语
  ID: 'id', // 印度尼西亚
  TH: 'th' // 泰语
}

export const localeSetting: LocaleSetting = {
  locale: LOCALE.ZH_CN,
  fallback: LOCALE.EN_US,
  availableLocales: [LOCALE.ZH_CN, LOCALE.EN_US]
}
