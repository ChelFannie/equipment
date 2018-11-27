import axios from 'axios'
import qs from 'qs'
import store from '../store/store'
import router from '../router'
import { Message } from 'element-ui'
// axios.defaults.baseURL = 'http://192.168.28.30:9731/'
// axios.defaults.withCredentials = true
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
// const BASE_URL = '/api/' // 配置api因为使用了代理，每个接口都需要加/api，在此加/api就不要加到每个接口了,生产环境需设置真实服务器地址
const BASE_URL = process.env.BASE_API // webpack识别开发或生产环境，自动匹配baseUrl
const TIMEOUT_MILLISECONDS = 8000 // 超时链接

const instance = axios.create({
  withCredentials: true, // 允许携带cookie
  baseURL: BASE_URL, // 基本url
  timeout: TIMEOUT_MILLISECONDS,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
})

/**
 *  解決重复请求
 *
 */
let pending = [] // 存储网络请求列表
let CancelToken = axios.CancelToken
let removePending = (config, cancleHandle) => {
  let flagUrl = config.url
  if (flagUrl.indexOf(config.baseURL) !== -1) {
    flagUrl = '/' + flagUrl.substr(config.baseURL.length, flagUrl.length)
  }
  if (flagUrl.indexOf('http') !== 0) flagUrl = config.baseURL + flagUrl
  if (pending.indexOf(flagUrl) !== -1) { // 如果要检索的字符串值没有出现，则该方法indexOf返回 -1
    if (cancleHandle) {
      console.log('重复的请求已取消')
      cancleHandle() // 执行取消操作
    } else {
      pending.splice(pending.indexOf(flagUrl), 1) // 把这条记录从数组中移除
    }
  } else {
    pending.push(flagUrl)
  }
  // console.log(pending)
  // console.log(pending.length)
}

// axios请求拦截器
instance.interceptors.request.use((config) => {
  config.cancelToken = new CancelToken((c) => {
    removePending(config, c)
  })
  config.headers.token = `${store.state.token}`
  if (config.method === 'post' && config.headers['Content-Type'] !== 'application/json') {
    config.data = qs.stringify(config.data) // stringify POST方式提交的数据
  }
  return config
},
(error) => {
  return Promise.reject(error)
})

// axios响应拦截器
instance.interceptors.response.use((response) => {
  removePending(response.config) // 不管成功与否都从记录中移除请求记录
  if (response.data.code && response.data.code === '10009') {
    // 用户没登录
    store.commit('token', '')
    sessionStorage.removeItem('token')
    router.push({name: '登录', query: {redirect: router.currentRoute.fullPath}})
  }
  return response.data
}, (error) => {
  // removePending(error.config) // 不管成功与否都从记录中移除请求记录
  pending = []
  switch (error.response && error.response.status) {
    case 400:
      error.message = '请求错误(400)'
      break
    case 401:
      error.message = '未授权，请重新登录(401)'
      break
    case 403:
      error.message = '拒绝访问(403)'
      break
    case 404:
      error.message = '请求出错(404)'
      break
    case 408:
      error.message = '请求超时(408)'
      Message.error({
        message: '请求超时,请刷新后连接!'
        // center: true
      })
      break
    case 500:
      error.message = '服务器错误(500)'
      Message.error({
        message: '服务器异常！'
        // center: true
      })
      break
    case 501:
      error.message = '服务未实现(501)'
      break
    case 502:
      error.message = '网络错误(502)'
      break
    case 503:
      error.message = '服务不可用(503)'
      break
    case 504:
      error.message = '网络超时(504)'
      break
    case 505:
      error.message = 'HTTP版本不受支持(505)'
      break
  }
  if (error.code === 'ECONNABORTED' && error.message.indexOf('timeout') !== -1) {
    Message.error({
      message: '网络异常'
      // center: true
    })
  }
  return Promise.reject(error)
})
export default instance
