import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'

// 样式
import 'assets/css/base.css'
import 'assets/css/global.css'
import 'assets/css/normalize.css'

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
