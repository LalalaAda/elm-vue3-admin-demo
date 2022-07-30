import type { ElementUILocaleType } from '/#/config'

import { set } from 'lodash-es'

export const loadLocalePool: ElementUILocaleType[] = []

export function setHtmlPageLang(locale: ElementUILocaleType) {
  document.querySelector('html')?.setAttribute('lang', locale)
}

export function setLoadLocalePool(cb: (loadLocalePool: ElementUILocaleType[]) => void) {
  cb(loadLocalePool)
}

/**
 * 解析 国际化语言模块 批量导入  示例：
 * {"./zh-CN/routes/basic.ts":{}, "./zh-CN/sys.ts":{}}   prefix: "zh-CN"
 * obj.routes[basic] = { tips: '提示' }
 * obj.sys = { title: '系统' }
 */
export function genMessage(langModuleMap: Record<string, Record<string, any>>, prefix = 'lang') {
  const obj: Recordable = {}

  Object.keys(langModuleMap).forEach((key) => {
    const module = langModuleMap[key]
    let moduleFileName = key.replace(`./${prefix}/`, '').replace(/^\.\//, '')
    const lastIndex = moduleFileName.lastIndexOf('.')
    moduleFileName = moduleFileName.substring(0, lastIndex)
    const pathList = moduleFileName.split('/')
    const moduleName = pathList.shift()
    const contentKey = pathList.join('.')

    if (moduleName) {
      if (contentKey) {
        set(obj, moduleName, obj[moduleName] || {})
        set(obj[moduleName], contentKey, module || {})
      } else {
        set(obj, moduleName, module || {})
      }
    }
  })
  return obj
}
