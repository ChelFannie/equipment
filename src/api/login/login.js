import request from '../index'
const config = {
// 登陆
  login: {
    url: '/login/login.json',
    method: 'post'
  },
  toggleLogin: {
    url: '/login/auditorloginMonitor.json',
    method: 'post'
  }
}

export default function req (funcName, data) {
  return request(config, funcName, data)
}
