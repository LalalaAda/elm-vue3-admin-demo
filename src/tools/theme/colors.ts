// 参考 antdesign的调色逻辑
// Ant Design 色板生成算法演进之路
// https://zhuanlan.zhihu.com/p/32422584

import { rgbToHsv, rgbToHex, inputToRGB } from '@ctrl/tinycolor'

const hueStep = 2 // 色相阶梯
const saturationStep = 0.16 // 饱和度阶梯，浅色部分
const saturationStep2 = 0.05 // 饱和度阶梯，深色部分
const brightnessStep1 = 0.05 // 亮度阶梯，浅色部分
const brightnessStep2 = 0.15 // 亮度阶梯，深色部分
const lightColorCount = 5 // 浅色数量，主色上
const darkColorCount = 4 // 深色数量，主色下

// 暗色主题颜色映射关系表
const darkColorMap = [
  {
    index: 7,
    opacity: 0.15
  },
  {
    index: 6,
    opacity: 0.25
  },
  {
    index: 5,
    opacity: 0.3
  },
  {
    index: 5,
    opacity: 0.45
  },
  {
    index: 5,
    opacity: 0.65
  },
  {
    index: 5,
    opacity: 0.85
  },
  {
    index: 4,
    opacity: 0.9
  },
  {
    index: 3,
    opacity: 0.95
  },
  {
    index: 2,
    opacity: 0.97
  },
  {
    index: 1,
    opacity: 0.98
  }
]

// Wrapper function ported from TinyColor.prototype.toHsv
// Keep it here because of `hsv.h * 360`
function toHsv(_ref: { ok?: boolean; format?: any; r: any; g: any; b: any; a?: number }) {
  const r = _ref.r,
    g = _ref.g,
    b = _ref.b
  const hsv = rgbToHsv(r, g, b)
  return {
    h: hsv.h * 360,
    s: hsv.s,
    v: hsv.v
  }
}

// Wrapper function ported from TinyColor.prototype.toHexString
// Keep it here because of the prefix `#`
function toHex(_ref2: { ok?: boolean; format?: any; r: any; g: any; b: any; a?: number }) {
  const r = _ref2.r,
    g = _ref2.g,
    b = _ref2.b
  return '#'.concat(rgbToHex(r, g, b, false))
}

// Wrapper function ported from TinyColor.prototype.mix, not treeshakable.
// Amount in range [0, 1]
// Assume color1 & color2 has no alpha, since the following src code did so.
function mix(
  rgb1: { ok?: boolean; format?: any; r: any; g: any; b: any; a?: number },
  rgb2: { ok?: boolean; format?: any; r: any; g: any; b: any; a?: number },
  amount: number
) {
  const p = amount / 100
  const rgb = {
    r: (rgb2.r - rgb1.r) * p + rgb1.r,
    g: (rgb2.g - rgb1.g) * p + rgb1.g,
    b: (rgb2.b - rgb1.b) * p + rgb1.b
  }
  return rgb
}

function getHue(hsv: { h: any; s?: number; v?: number }, i: number, light?: boolean) {
  let hue: number // 根据色相不同，色相转向不同

  if (Math.round(hsv.h) >= 60 && Math.round(hsv.h) <= 240) {
    hue = light ? Math.round(hsv.h) - hueStep * i : Math.round(hsv.h) + hueStep * i
  } else {
    hue = light ? Math.round(hsv.h) + hueStep * i : Math.round(hsv.h) - hueStep * i
  }

  if (hue < 0) {
    hue += 360
  } else if (hue >= 360) {
    hue -= 360
  }

  return hue
}

function getSaturation(hsv: { h: any; s: any; v?: number }, i: number, light?: boolean) {
  // grey color don't change saturation
  if (hsv.h === 0 && hsv.s === 0) {
    return hsv.s
  }

  let saturation: number

  if (light) {
    saturation = hsv.s - saturationStep * i
  } else if (i === darkColorCount) {
    saturation = hsv.s + saturationStep
  } else {
    saturation = hsv.s + saturationStep2 * i
  } // 边界值修正

  if (saturation > 1) {
    saturation = 1
  } // 第一格的 s 限制在 0.06-0.1 之间

  if (light && i === lightColorCount && saturation > 0.1) {
    saturation = 0.1
  }

  if (saturation < 0.06) {
    saturation = 0.06
  }

  return Number(saturation.toFixed(2))
}

function getValue(hsv: { h?: number; s?: number; v: any }, i: number, light?: boolean) {
  let value: number

  if (light) {
    value = hsv.v + brightnessStep1 * i
  } else {
    value = hsv.v - brightnessStep2 * i
  }

  if (value > 1) {
    value = 1
  }

  return Number(value.toFixed(2))
}

export function generate(color: string, ...args: any[]) {
  const opts = arguments.length > 1 && args[0] !== undefined ? args[0] : {}
  const patterns: string[] = []
  const pColor = inputToRGB(color)

  for (let i = lightColorCount; i > 0; i -= 1) {
    const hsv = toHsv(pColor)
    const colorString = toHex(
      inputToRGB({
        h: getHue(hsv, i, true),
        s: getSaturation(hsv, i, true),
        v: getValue(hsv, i, true)
      })
    )
    patterns.push(colorString)
  }

  patterns.push(toHex(pColor))

  for (let _i = 1; _i <= darkColorCount; _i += 1) {
    const _hsv = toHsv(pColor)

    const _colorString = toHex(
      inputToRGB({
        h: getHue(_hsv, _i),
        s: getSaturation(_hsv, _i),
        v: getValue(_hsv, _i)
      })
    )

    patterns.push(_colorString)
  }

  // dark theme patterns
  if (opts.theme === 'dark') {
    return darkColorMap.map(function (_ref3) {
      const index = _ref3.index,
        opacity = _ref3.opacity
      const darkColorString = toHex(
        mix(
          inputToRGB(opts.backgroundColor || '#141414'),
          inputToRGB(patterns[index]),
          opacity * 100
        )
      )
      return darkColorString
    })
  }

  return patterns
}

// 预设的部分色板
const presetPrimaryColors = {
  red: '#F5222D',
  volcano: '#FA541C',
  orange: '#FA8C16',
  gold: '#FAAD14',
  yellow: '#FADB14',
  lime: '#A0D911',
  green: '#52C41A',
  cyan: '#13C2C2',
  blue: '#1890FF',
  geekblue: '#2F54EB',
  purple: '#722ED1',
  magenta: '#EB2F96',
  grey: '#666666'
}
const presetPalettes: any = {}
const presetDarkPalettes: any = {}
Object.keys(presetPrimaryColors).forEach(function (key) {
  presetPalettes[key] = generate(presetPrimaryColors[key])
  presetPalettes[key].primary = presetPalettes[key][5]

  // dark presetPalettes
  presetDarkPalettes[key] = generate(presetPrimaryColors[key], {
    theme: 'dark',
    backgroundColor: '#141414'
  })
  presetDarkPalettes[key].primary = presetDarkPalettes[key][5]
})
const red = presetPalettes.red
const volcano = presetPalettes.volcano
const gold = presetPalettes.gold
const orange = presetPalettes.orange
const yellow = presetPalettes.yellow
const lime = presetPalettes.lime
const green = presetPalettes.green
const cyan = presetPalettes.cyan
const blue = presetPalettes.blue
const geekblue = presetPalettes.geekblue
const purple = presetPalettes.purple
const magenta = presetPalettes.magenta
const grey = presetPalettes.grey

export {
  red,
  volcano,
  gold,
  orange,
  yellow,
  lime,
  green,
  cyan,
  blue,
  geekblue,
  purple,
  magenta,
  grey,
  presetPalettes,
  presetDarkPalettes,
  presetPrimaryColors
}
