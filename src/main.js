import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'

// 初始化样式
import 'assets/css/base.css'

// axios
import axios from 'network/axios'
Vue.prototype.$http = axios

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
