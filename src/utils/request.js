import axios from 'axios'
import { Message } from 'element-ui'
const service = axios.create({
  // 当执行npm run dev => 读取.env.developnment => api =>跨域代理
  baseURL: process.env_VUE_APP_BASE_API, // npm run dev => /api
  timeout: 5000
})
service.interceptors.request.use()
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
  Message.error(error.message) // 提示错误信息
  return Promise.reject(error) // 返回执行错误，将当前的执行链接跳出成功，直接进入catch
})
export default service
