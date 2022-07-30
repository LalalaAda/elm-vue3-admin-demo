import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'

export function isDevFn(mode: string): boolean {
  return mode === 'development'
}
export function isProdFn(mode: string): boolean {
  return mode === 'production'
}
export function isReportMode(): boolean {
  return process.env.REPORT === 'true'
}

// 转换conf文件为conf对象 并处理process的属性值
export function translateEnvConfig(envConf: Recordable<string>): ViteEnv {
  const ret: ViteEnv = {
    VITE_PORT: 0,
    VITE_USE_MOCK: false,
    VITE_USE_PWA: false,
    VITE_PUBLIC_PATH: '',
    VITE_PROXY: [],
    VITE_GLOBAL_APP_TITLE: '',
    VITE_GLOBAL_APP_SHORT_NAME: '',
    VITE_USE_CDN: false,
    VITE_DROP_CONSOLE: false,
    VITE_BUILD_COMPRESS: 'none',
    VITE_BUILD_COMPRESS_DELETE_ORIGIN_FILE: false,
    VITE_LEGACY: false,
    VITE_USE_IMAGEMIN: false,
    VITE_GENERATE_UI: '',
    VITE_GLOBAL_APP_ENV_EXPOSE_VARIABLE_NAME: 'MTMTMT',
    VITE_GLOBAL_API_URL: '',
    VITE_GLOBAL_UPLOAD_URL: '',
    VITE_GLOBAL_API_URL_PREFIX: ''
  }
  for (const name of Object.keys(envConf)) {
    let value: string | boolean | object | number = ''
    value = envConf[name].replace(/\\n/g, '\n')
    value = value === 'true' ? true : value === 'false' ? false : value
    if (name === 'VITE_PORT') {
      value = Number(value)
    }
    if (name === 'VITE_PROXY' && typeof value === 'string') {
      try {
        value = JSON.parse(value.replace(/'/g, '"'))
      } catch (error) {
        value = ''
      }
    }
    ret[name] = value
    if (typeof value === 'string') {
      process.env[name] = value
    } else if (typeof value === 'object') {
      process.env[name] = JSON.stringify(value)
    }
  }
  return ret
}

// 获取当前环境下生效的环境配置名 ['.env', '.env.development']
function getEnvFilesName() {
  // npm的钩子 npm_lifecycle_script返回正在运行的脚本名称
  const script = process.env.npm_lifecycle_script
  const reg = new RegExp('--mode ([a-z_\\d]+)')
  const result = reg.exec(script as string)
  if (result) {
    const mode = result[1] as string
    return ['.env', `.env.${mode}`]
  }
  return ['.env', '.env.production']
}

export function getEnvConfig(match = 'VITE_GLOBAL_', envFilesName = getEnvFilesName()) {
  let envConfig = {}
  envFilesName.forEach((item) => {
    try {
      const env = dotenv.parse(fs.readFileSync(path.resolve(process.cwd(), item)))
      envConfig = { ...envConfig, ...env }
    } catch (error) {
      console.error(`Error in parsing ${item}`, error)
    }
  })
  const reg = new RegExp(`^(${match})`)
  Object.keys(envConfig).forEach((key) => {
    if (!reg.test(key)) {
      Reflect.deleteProperty(envConfig, key)
    }
  })
  return envConfig
}

export function getRootPath(...dir: string[]) {
  return path.resolve(process.cwd(), ...dir)
}
