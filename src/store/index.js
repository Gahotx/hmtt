import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    avatar: localStorage.getItem('avatar') || 'https://img.yzcdn.cn/vant/cat.jpeg'
  },
  getters: {
  },
  mutations: {
    SET_USERPHOTO (state, value) {
      state.avatar = value
      localStorage.setItem('avatar', value)
    }
  },
  actions: {
  },
  modules: {
  }
})
