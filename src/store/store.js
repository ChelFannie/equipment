import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const state = {
  token: sessionStorage.getItem('token'),
  activeIndex: '',
  menuDisabled: {
    orderList: false,
    accountOrder: false,
    queryOrder: false,
    quitSystem: false
  },
  keyboardCode: '',
  managerFlag: false,
  originalPrizeFlag: false,
  prizeExitFlag: false,
  prizeCancelFlag: false,
  deviceStatus: 0 // 设备判断，0：投注单打印机，1：彩票单打印机
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
  },
  setkeyboardCode (state, param) {
    state.keyboardCode = param
  },
  setManagerFlag (state, param) {
    state.managerFlag = param
  },
  setOriginalPrizeFlag (state, param) {
    state.originalPrizeFlag = param
  },
  setPrizeExitFlag (state, param) {
    state.prizeExitFlag = param
  },
  setPrizeCancelFlag (state, param) {
    state.prizeCancelFlag = param
  },
  setDeviceStatus (state, param) {
    state.deviceStatus = param
  }
}

const actions = {

}

export default new Vuex.Store({
  state,
  mutations,
  actions
})
