import type { App } from 'vue'

import { createPinia } from 'pinia'

import api from './api'
import router from '../router'

export function registerPlugins(app: App) {
  app.use(api).use(router).use(createPinia())
}
