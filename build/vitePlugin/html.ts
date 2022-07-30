import type { PluginOption } from 'vite'
import { createHtmlPlugin } from 'vite-plugin-html'
import pkg from '../../package.json'
import { EXPOSE_CONFIG_FILE_NAME } from '../constant'

export function configHtmlPlugin(env: ViteEnv, isBuild: boolean) {
  const { VITE_GLOBAL_APP_TITLE, VITE_PUBLIC_PATH } = env

  const path = VITE_PUBLIC_PATH.endsWith('/') ? VITE_PUBLIC_PATH : `${VITE_PUBLIC_PATH}/`
  const getAppConfigSrc = () => {
    return `${path || '/'}${EXPOSE_CONFIG_FILE_NAME}?v=${pkg.version}-${new Date().getTime()}`
  }

  const htmlPlugin: PluginOption[] = createHtmlPlugin({
    minify: isBuild,
    inject: {
      data: {
        title: VITE_GLOBAL_APP_TITLE
      },
      tags: isBuild ? [{ tag: 'script', attrs: { src: getAppConfigSrc() } }] : []
    }
  })

  return htmlPlugin
}
