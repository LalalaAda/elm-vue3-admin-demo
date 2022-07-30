import path from 'path'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'

const svgIconFolder = 'src/assets/icons'

export function configSvgIconsPlugin(isBuild: boolean) {
  const svgIconsPlugin = createSvgIconsPlugin({
    iconDirs: [path.resolve(process.cwd(), svgIconFolder)],
    svgoOptions: isBuild,
    symbolId: 'svg-[dir]-[name]'
  })
  return svgIconsPlugin
}
