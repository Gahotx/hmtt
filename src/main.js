import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'amfe-flexible'
import { NavBar, Form, Field, Button, Tabbar, TabbarItem, Icon, Tab, Tabs, Cell, List, PullRefresh, ActionSheet, Popup, Col, Row, Badge, Search, Divider } from 'vant'

Vue.use(Divider)
Vue.use(Search)
Vue.use(Badge)
Vue.use(Col)
Vue.use(Row)
Vue.use(Popup)
Vue.use(ActionSheet)
Vue.use(PullRefresh)
Vue.use(List)
Vue.use(Cell)
Vue.use(Tab)
Vue.use(Tabs)
Vue.use(Icon)
Vue.use(Tabbar)
Vue.use(TabbarItem)
Vue.use(Button)
Vue.use(Form)
Vue.use(Field)
Vue.use(NavBar)

Vue.directive('focus', {
  inserted (el) {
    if (el.nodeName === 'TEXTAREA' || el.nodeName === 'INPUT') {
      el.focus()
    } else {
      const inputBox = el.querySelector('input')
      const textareaBox = el.querySelector('textarea')
      if (inputBox) {
        inputBox.focus()
      } else {
        textareaBox.focus()
      }
    }
  }
})

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
