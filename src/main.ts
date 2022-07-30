import { createApp } from 'vue'
import App from './App.vue'

import { setupStore } from '/@/store'
import { setupI18n } from '/@/i18n/setupI18n'
import { initAppConfig } from '/@/tools/initAppConfig'

// elm的暗黑模式样式
import 'element-plus/theme-chalk/dark/css-vars.css'

async function bootstrap() {
  const app = createApp(App)

  setupStore(app)

  initAppConfig(app)

  await setupI18n(app)

  app.mount('#app')
}

bootstrap()
