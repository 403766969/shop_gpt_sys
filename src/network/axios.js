import originalAxios from 'axios'

const instance = originalAxios.create({
  baseURL: 'https://www.liulongbin.top:8888/api/private/v1/',
  timeout: 5000
})

instance.interceptors.request.use(config => {
  return config
}, err => {
  console.log(err)
})

instance.interceptors.response.use(res => {
  return res.data
}, err => {
  console.log(err)
})

export default instance