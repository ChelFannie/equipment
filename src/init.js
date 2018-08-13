import Vue from 'vue'
// import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './style/index.css'
import ILayout from './components/common/i-layout'
import IForm from './components/common/i-form'
import router from './router'
import store from './store/store'
import {Button, Dialog, Menu, MenuItem, Table, TableColumn, Popover, Form, FormItem, Icon, Loading, Message, MessageBox, Pagination, Input} from 'element-ui'
require('./utils/vconsole.js')

// Vue.use(ElementUI)
Vue.use(Button)
Vue.use(Dialog)
Vue.use(Menu)
Vue.use(MenuItem)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Popover)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Icon)
Vue.use(Loading)
// Vue.use(Message)
Vue.use(Pagination)
Vue.use(Input)
// Vue.use(MessageBox)
Vue.component('i-layout', ILayout)
Vue.component('i-form', IForm)

Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm
// 路由全局守卫
router.beforeEach((to, from, next) => {
  // localStorage.setItem('lastRouter', from.path)
  if (!to.meta.requireAuth) {
    if (store.state.token) {
      next()
    } else {
      next({name: '登录'})
    }
  } else {
    next()
  }
})
