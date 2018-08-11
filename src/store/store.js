import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const state = {
  token: sessionStorage.getItem('token'),
  activeIndex: '',
  menuDisabled: {
    orderList: false,
    accountOrder: true
  }
}

const mutations = {
  token (state, param) {
    state.token = param
  },
  setActiveIndex (state, param) {
    state.activeIndex = param
  },
  setMenuDisabled (state, obj) {
    Object.keys(obj).map(key => {
      state.menuDisabled[key] = obj[key]
    })
  }
}

const actions = {

}

export default new Vuex.Store({
  state,
  mutations,
  actions
})
