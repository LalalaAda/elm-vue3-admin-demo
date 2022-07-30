import { StorageTypeEnum } from '/@/enums/storgeEnum'

// elementUI的国际化类型 后续有新的请补全
export type ElementUILocaleType = 'zh-cn' | 'en' | 'vi' | 'th' | 'id'

export interface LocaleSetting {
  // current language
  locale: ElementUILocaleType
  // default language
  fallback: ElementUILocaleType
  // available locales
  availableLocales: ElementUILocaleType[]
}

export interface GlobalConfig {
  // 网站标题
  title: string
  // 接口地址
  apiUrl: string
  // 上传接口地址
  uploadUrl?: string
  // 接口前缀
  urlPrefix?: string
  // 项目缩写
  shortName: string
}

export interface ProjectConfig {
  // 存储权限相关信息的方式 (session|local)storage
  permissionStorageType: StorageTypeEnum
  // 自定义的错误处理
  useErrorHandle: boolean
}
