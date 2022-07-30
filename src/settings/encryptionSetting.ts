import { isDevMode } from '/@/utils/env'

// 默认缓存本地7天
export const DEFAULT_CACHE_TIME = 60 * 60 * 24 * 7

// aes 加密的 密钥
export const cacheCipher = {
  key: '+qe_sa99820@-',
  iv: '3242@0dddaz-43fasd_'
}

export const enableStorageEncryption = !isDevMode()
