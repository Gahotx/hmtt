// 基于 axios 封装网络请求
import ajax from 'axios'
import { getToken, removeToken, setToken } from '@/utils/token'
import { Notify } from 'vant'
import router from '@/router'
import { refreshToken } from '@/api'

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
}, async function (error) {
  // 对响应错误做点什么
  // console.log(error)
  if (error.response.status === 401) {
    // 方式1： 强制用户重新登录，用户有感知
    // Notify({ type: 'danger', message: '用户已过期，请重新登录' })
    // removeToken()
    // setTimeout(() => {
    //   router.replace('/login')
    // }, 500)

    // 方式2：后台直接刷新token，用户无感知
    removeToken()
    const res = await refreshToken()
    // console.log(res)
    setToken(res.data.data.token)
    error.config.headers.Authorization = `Bearer ${getToken()}`
    return axios(error.config)
  } else if (error.response.data.message === 'refresh_token失效') {
    if (localStorage.getItem('refresh_token') !== null) {
      Notify({ type: 'danger', message: '身份已过期，请重新登录' })
    } else {
      Notify({ type: 'warning', message: '无权限，请登录后重试' })
    }
    localStorage.removeItem('refresh_token')
    router.replace('/login')
  }
  return Promise.reject(error)
})

export default axios
