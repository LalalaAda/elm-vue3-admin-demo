import type { UserConfig, ConfigEnv } from 'vite'
import { resolve } from 'path'
import { loadEnv } from 'vite'

import { createProxy } from './build/proxy'
import { translateEnvConfig } from './build/utils'
import { createVitePlugin } from './build/vitePlugin'
import { OUTPUT_DIR } from './build/constant'

import pkg from './package.json'

function pathResolve(dir: string) {
  return resolve(process.cwd(), '.', dir)
}

const { dependencies, devDependencies, name, version } = pkg
const __APP_INFO__ = {
  pkg: { dependencies, devDependencies, name, version },
  lastBuildTime: new Date().getTime() // 返回的是编译机器的本地时间
}

export default ({ command, mode }: ConfigEnv): UserConfig => {
  const root = process.cwd()
  const env = loadEnv(mode, root)
  const viteEnv = translateEnvConfig(env)
  const { VITE_PORT, VITE_PUBLIC_PATH, VITE_PROXY, VITE_DROP_CONSOLE } = viteEnv

  const isBuild = command === 'build'

  return {
    base: VITE_PUBLIC_PATH,
    root,
    resolve: {
      alias: [
        {
          find: 'vue-i18n',
          replacement: 'vue-i18n/dist/vue-i18n.cjs.js'
        },
        // /@/xxx => src/xxx
        {
          find: /\/@\//,
          replacement: pathResolve('src') + '/'
        },
        // /#/xxx => types/xxx
        {
          find: /\/#\//,
          replacement: pathResolve('types') + '/'
        }
      ]
    },
    server: {
      // https: true,
      https: false,
      host: true,
      port: VITE_PORT,
      proxy: createProxy(VITE_PROXY)
    },
    esbuild: {
      pure: VITE_DROP_CONSOLE ? ['console.log', 'debugger'] : []
    },
    build: {
      target: 'es2015',
      cssTarget: 'chrome80',
      outDir: OUTPUT_DIR,
      chunkSizeWarningLimit: 2000
    },
    define: {
      __APP_INFO__: JSON.stringify(__APP_INFO__)
    },
    css: {
      preprocessorOptions: {
        less: {
          javascriptEnabled: true
        }
      }
    },
    plugins: createVitePlugin(viteEnv, isBuild),
    optimizeDeps: {
      // 预构建
      include: [
        '@iconify/iconify',
        'element-plus/es/locale/lang/zh-cn',
        'element-plus/es/locale/lang/en'
      ]
    }
  }
}
