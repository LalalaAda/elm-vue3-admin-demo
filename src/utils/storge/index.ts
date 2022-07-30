import { getStorageShortName } from '/@/utils/env'
import { createStorage as cs, CreateStorageParams } from './storageCache'
import { enableStorageEncryption, DEFAULT_CACHE_TIME } from '/@/settings/encryptionSetting'

export type Options = Partial<CreateStorageParams>

const createOptions = (storage: Storage, options: Options = {}): Options => {
  return {
    hasEncrypt: enableStorageEncryption,
    storage,
    prefixKey: getStorageShortName(),
    ...options
  }
}

export const WebStorage = cs(createOptions(sessionStorage))

export const createStorage = (storage: Storage = sessionStorage, options: Options = {}) => {
  return cs(createOptions(storage, options))
}

let ls: ReturnType<typeof cs>
let ss: ReturnType<typeof cs>

export const createSessionStorage = (options: Options = {}) => {
  if (!ss) {
    ss = createStorage(sessionStorage, { ...options, timeout: DEFAULT_CACHE_TIME })
  }
  return ss
}

export const createLocalStorage = (options: Options = {}) => {
  if (!ls) {
    ls = createStorage(localStorage, { ...options, timeout: DEFAULT_CACHE_TIME })
  }
  return ls
}

export default WebStorage
