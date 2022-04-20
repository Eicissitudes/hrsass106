import router from '@/router'
import store from '@/store'
import axios from 'axios'
import { Message } from 'element-ui'
import { getTimeStamp } from './auth'
const TimeOut = 3600 // 定义超时时间
const service = axios.create({
  // 当执行npm run dev => 读取.env.developnment => api =>跨域代理
  baseURL: process.env.VUE_APP_BASE_API, // npm run dev => /api
  timeout: 5000
})
service.interceptors.request.use(config => {
  // config是请求的配置信息
  // 注入token
  if (store.getters.token) {
    if (isCheckTimeOut()) {
      // 如果为true表示token过期了
      store.dispatch('user/logout')// 登出操作
      router.push('/login')
      return Promise.reject(new Error('token超时了'))
    }
    // 只有在有token的情况下才有必要检查时间戳是否超时
    config.headers['Authorization'] = `Bearer ${store.getters.token}`
  }
  return config
}, error => {
  return Promise.reject(error)
})
// 响应拦截器
service.interceptors.response.use(response => {
  // axios默认加了一层data
  const { success, message, data } = response.data
  // 要根据success的成功与否决定下面的操作
  if (success) {
    return data
  } else {
    //   业务已经错误了，不能进then,应该进catch
    Message.error(message)
    return Promise.reject(new Error(message))
  }
}, error => {
  // error 信息里面response的对象
  if (error.response && error.response.data && error.response.data.code === 10002) {
    // 当等于10002的时候，表示后端告诉我超时了
    store.dispatch('user/logout')
    router.push('login')
  } else {
    Message.error(error.message) // 提示错误信息
  }
  return Promise.reject(error) // 返回执行错误，将当前的执行链接跳出成功，直接进入catch
})
// 是否超时
// 超时逻辑：当前时间-缓存中的时间，是否大于3600
function isCheckTimeOut() {
  var currentTime = Date.now() // 当前的时间戳
  var timestamp = getTimeStamp() // 缓存时间戳
  return (currentTime - timestamp) / 1000 > TimeOut
}
export default service
