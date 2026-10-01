import DefaultTheme from 'vitepress/theme'
import WasmConverter from '../components/WasmConverter.vue'
import AudioVisualizer from '../components/AudioVisualizer.vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('WasmConverter', WasmConverter)
    app.component('AudioVisualizer', AudioVisualizer)
  }
}
