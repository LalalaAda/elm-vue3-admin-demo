import { genMessage } from '../helper'
import elmLocale from 'element-plus/es/locale/lang/zh-cn'

const modules = import.meta.glob('./zh-cn/**/*.ts', { eager: true }) as Recordable
export default {
  message: {
    ...genMessage(modules, 'zh-cn'),
    elmLocale
  }
}
