import { PluginOption } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import legacy from '@vitejs/plugin-legacy' //使用它来提供对旧版本浏览器的支持

import purgeIcons from 'vite-plugin-purge-icons' // 高效的使用Iconify中所有的图标
import VitePluginCertificate from 'vite-plugin-mkcert' // 使用 mkcert 为 vite https 开发服务提供证书支持

// 饿了么的自动按需加载
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import ElementPlus from 'unplugin-element-plus/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

import { configHtmlPlugin } from './html'
import { configPwaConfig } from './pwa'
import { configMockPlugin } from './mock'
import { configCompressPlugin } from './compress'
import { configVisualizerConfig } from './visualizer'
import { configSvgIconsPlugin } from './svgSprite'

export function createVitePlugin(viteEnv: ViteEnv, isBuild: boolean) {
  const {
    VITE_USE_MOCK,
    VITE_LEGACY,
    VITE_BUILD_COMPRESS,
    VITE_BUILD_COMPRESS_DELETE_ORIGIN_FILE
  } = viteEnv

  const vitePlugins: (PluginOption | PluginOption[])[] = [
    vue(),
    vueJsx(),
    VitePluginCertificate({
      source: 'coding'
    }),
    AutoImport({
      resolvers: [ElementPlusResolver()]
    }),
    Components({
      resolvers: [ElementPlusResolver()]
    }),
    ElementPlus()
  ]

  VITE_LEGACY && isBuild && vitePlugins.push(legacy())

  vitePlugins.push(configHtmlPlugin(viteEnv, isBuild))
  vitePlugins.push(configSvgIconsPlugin(isBuild))
  VITE_USE_MOCK && vitePlugins.push(configMockPlugin(isBuild))
  vitePlugins.push(purgeIcons())
  vitePlugins.push(configVisualizerConfig())

  if (isBuild) {
    // vite-plugin-imagemin
    // VITE_USE_IMAGEMIN && vitePlugins.push(configImageminPlugin())

    // rollup-plugin-gzip
    vitePlugins.push(
      configCompressPlugin(VITE_BUILD_COMPRESS, VITE_BUILD_COMPRESS_DELETE_ORIGIN_FILE)
    )

    // vite-plugin-pwa
    vitePlugins.push(configPwaConfig(viteEnv))
  }

  return vitePlugins
}
