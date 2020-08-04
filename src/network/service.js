import axios from 'axios'
import { BASE_URL } from 'commonjs/const'

// 创建axios实例
const instance = axios.create({
  baseURL: BASE_URL,
  timeout: 5000
})

// 请求拦截器
instance.interceptors.request.use(config => {
  // 每次请求设置token
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
}, err => {
  console.log('request', err)
})

// 响应拦截器
instance.interceptors.response.use(res => {
  return res
}, err => {
  console.log('response', err)
})

export default instance