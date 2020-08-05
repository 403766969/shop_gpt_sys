import axios from 'axios'
import { BASE_URL } from 'commonjs/const'

import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

// 创建axios实例
const instance = axios.create({
  baseURL: BASE_URL,
  timeout: 5000
})

// 请求拦截器
instance.interceptors.request.use(config => {
  // 显示进度条
  NProgress.start()
  // 每次请求设置token
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
}, err => {
  console.log('request', err)
})

// 响应拦截器
instance.interceptors.response.use(res => {
  // 隐藏进度条
  NProgress.done()
  return res
}, err => {
  console.log('response', err)
})

export default instance