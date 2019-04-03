import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
// 保存数据的地方
const state = {
  username: ''
}
// 真正修改数据的地方
const mutations = {
  setUsername: (state, username) => {
    state.username = username
    localStorage.setItem('username ', username)
  }
}
// 修改数据
const actions = {}

// 获取数据
const getters = {
  username: (state) => localStorage.getItem('username')
}
export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations
})
