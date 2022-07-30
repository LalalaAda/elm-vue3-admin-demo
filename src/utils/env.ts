// import { warn } from '/@/utils/log'
import pkg from '../../package.json'

export function getEnv(): string {
  return import.meta.env.MODE
}
export function isDevMode(): boolean {
  return import.meta.env.DEV
}
export function isProdMode(): boolean {
  return import.meta.env.PROD
}

// 获取环境变量数据  如果是编译后的 则从暴露给window变量的环境变量数据中取值
export function getAppEnvConfig() {
  const env = import.meta.env
  let runtimeEnv: ViteEnv | undefined = undefined
  if (env.DEV) {
    runtimeEnv = env as unknown as ViteEnv
  } else {
    const variable = env.VITE_GLOBAL_APP_ENV_EXPOSE_VARIABLE_NAME
    runtimeEnv = window[variable] as unknown as ViteEnv
  }

  const {
    VITE_GLOBAL_APP_SHORT_NAME,
    VITE_GLOBAL_APP_TITLE,
    VITE_GLOBAL_API_URL,
    VITE_GLOBAL_API_URL_PREFIX,
    VITE_GLOBAL_UPLOAD_URL
  } = runtimeEnv

  if (!/^[a-zA-Z\_]*$/.test(VITE_GLOBAL_APP_SHORT_NAME)) {
    // warn(
    //   `VITE_GLOB_APP_SHORT_NAME Variables can only be characters/underscores, please modify in the environment variables and re-running.`,
    // )
  }

  return {
    VITE_GLOBAL_APP_SHORT_NAME,
    VITE_GLOBAL_APP_TITLE,
    VITE_GLOBAL_API_URL,
    VITE_GLOBAL_API_URL_PREFIX,
    VITE_GLOBAL_UPLOAD_URL
  }
}

export function getCommonStoragePrefix() {
  const { VITE_GLOBAL_APP_SHORT_NAME } = getAppEnvConfig()
  return `${VITE_GLOBAL_APP_SHORT_NAME}__${getEnv()}`.toUpperCase()
}

export function getStorageShortName() {
  return `${getCommonStoragePrefix()}__${pkg.version}__`.toUpperCase()
}
