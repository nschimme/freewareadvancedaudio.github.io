import DefaultTheme from 'vitepress/theme'
import WasmConverter from '../components/WasmConverter.vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('WasmConverter', WasmConverter)
  }
}
