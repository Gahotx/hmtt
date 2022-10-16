// 基于 axios 封装网络请求
import ajax from 'axios'
import { getToken } from '@/utils/token'
import { Notify } from 'vant'
import router from '@/router'

const axios = ajax.create({
  baseURL: 'https://toutiao.itheima.net',
  timeout: 20000
})

// 添加请求拦截器
axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  // console.log(config)
  if (getToken()?.length > 0 && config.headers.Authorization === undefined) {
    config.headers.Authorization = `Bearer ${getToken()}`
  }
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  return response
}, function (error) {
  // 对响应错误做点什么
  // console.log(error)
  if (error.response.status === 401) {
    Notify({ type: 'danger', message: '用户已过期，请重新登录' })
    setTimeout(() => {
      router.replace('/login')
    }, 500)
  }
  return Promise.reject(error)
})

export default axios
