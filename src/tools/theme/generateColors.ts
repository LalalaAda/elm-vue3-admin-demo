import { generate } from './colors'
// 注意 这里生成颜色 使用的 亮色模式黑暗模式 是 light | dark
type GenerateTheme = 'light' | 'dark'

export const primaryColor = '#409EFF'
export const darkMode = 'light'

export function generateAntColors(color: string, theme: GenerateTheme = 'light') {
  return generate(color, {
    theme
  })
}

export function getThemeColors(color?: string, mode: GenerateTheme = 'light') {
  const tc = color || primaryColor

  let ret = generateAntColors(tc)
  const primary = ret[5]
  if (mode === 'dark') {
    ret = generateAntColors(primary, 'dark')
  }

  return [...ret]
}
