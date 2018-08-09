import Vue from 'vue'
import Router from 'vue-router'
import LeftNav from '@/components/left-nav'
import OrderQuery from './order-query'
// const Welcome = () => import('../page/welcome')
const Login = () => import('../components/login')
Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'leftNav',
      component: LeftNav,
      // redirect: '/welcome',
      redirect: '/order-query/order-List',
      children: [
        // {
        //   path: 'welcome',
        //   name: '欢迎页',
        //   component: Welcome
        // },
        // ...RealTimeMonitoring,
        ...OrderQuery
      ]
    }, {
      path: '/login',
      name: '登录',
      component: Login,
      meta: {
        requireAuth: true
      }
    }, {
      path: '*',
      name: '404',
      component: Error
    }]
})
