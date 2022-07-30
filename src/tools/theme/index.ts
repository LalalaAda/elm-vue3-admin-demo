// 更新elmui的css变量 动态更新主题
import { getThemeColors } from './generateColors'
import { addClass, hasClass, removeClass } from './dom'

export enum TModeEnum {
  DARK = 'dark',
  LIGHT = 'light'
}

// 更新主题 实际上不仅仅是 单独主题色的更新
// TODO 多添加些处理色彩的css变量？
const elmCssVarList = [
  '--el-color-primary-light-9',
  '--el-color-primary-light-8',
  '--el-color-primary-light-7',
  '--el-color-primary-light-5',
  '--el-color-primary-light-3',
  '--el-color-primary',
  '--el-color-primary-dark-2'
]

// 获取缓存的主题 css变量对象
export function getCacheThemeCssColorsObj() {
  // 获取 css 变量
  const obj: any = {}

  const el = document.documentElement
  elmCssVarList.forEach((item) => {
    const v = getComputedStyle(el).getPropertyValue(item)
    obj[item] = v
  })
  return obj
}

async function replaceStyleVariables(colors: string[]) {
  const el = document.documentElement
  elmCssVarList.forEach((item, index) => {
    el.style.setProperty(item, colors[index])
  })
}

// 注意在调用更新主题色的方法时 传入的参数色彩 需要判断饱和度和亮度
// 饱和度建议不低于70 亮度建议不低于70
export async function t_changeTheme(color: string, mode?: TModeEnum) {
  if (mode === TModeEnum.DARK) {
    return await replaceStyleVariables([...getThemeColors(color, 'dark')])
  }
  return await replaceStyleVariables([...getThemeColors(color)])
}

const docEle = document.documentElement

export function toggleClass(flag: boolean, clsName: string, target?: HTMLElement) {
  const targetEl = target || document.body
  let { className } = targetEl
  className = className.replace(clsName, '')
  targetEl.className = flag ? `${className} ${clsName} ` : className
}

export function setCssVar(prop: string, val: any, dom = docEle) {
  dom.style.setProperty(prop, val)
}

// 高对比度
export function t_updateColorWeak(colorWeak: boolean) {
  toggleClass(colorWeak, 'color-weak', document.documentElement)
  // TODO 写入到本地project config
}

// 灰度
export function t_updateGrayMode(flag: boolean) {
  toggleClass(flag, 'gray-mode', document.documentElement)
  // TODO 写入到本地project config
}

// 更新主题色彩 在切换黑暗模式时
function updateThemeColor(mode: TModeEnum, color: string) {
  t_changeTheme(color, mode)
}

// 黑暗模式
export function t_updateDarkTheme(mode: TModeEnum, color: string) {
  const htmlRoot = document.getElementById('htmlRoot')
  if (!htmlRoot) {
    return
  }

  const hasDarkClass = hasClass(htmlRoot, 'dark')
  if (mode === TModeEnum.DARK) {
    htmlRoot.setAttribute('data-theme', 'dark')
    if (!hasDarkClass) {
      addClass(htmlRoot, 'dark')
    }
    setTimeout(() => {
      updateThemeColor(TModeEnum.DARK, color)
    }, 10)
  } else {
    htmlRoot.setAttribute('data-theme', 'light')
    if (hasDarkClass) {
      removeClass(htmlRoot, 'dark')
    }
    setTimeout(() => {
      updateThemeColor(TModeEnum.LIGHT, color)
    }, 10)
  }
}
