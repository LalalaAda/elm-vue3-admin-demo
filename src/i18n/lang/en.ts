import { genMessage } from '../helper'
import elmLocale from 'element-plus/es/locale/lang/en'

const modules = import.meta.glob('./en/**/*.ts', { eager: true }) as Recordable
export default {
  message: {
    ...genMessage(modules, 'en'),
    elmLocale
  }
}
