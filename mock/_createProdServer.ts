import { createProdMockServer } from 'vite-plugin-mock/es/createProdMockServer'

// const modules = import.meta.globEager('./**/*.ts')
const modules = import.meta.glob('./**/*.ts', { eager: true })

const mockModules: any[] = []
Object.keys(modules).forEach((key) => {
  // 将批量导入的模块过滤掉 文件名下划线开头的
  if (key.includes('/_')) {
    return
  }
  mockModules.push(modules[key])
})

export function setupProdMockServer() {
  createProdMockServer(mockModules)
}
