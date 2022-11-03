import Vue from 'vue'
import VueRouter from 'vue-router'
import { getToken } from '@/utils/token'
// import LoginPage from '@/views/LoginPage'
// import LayoutPage from '@/views/LayoutPage'
// import HomePage from '@/views/HomePage'
// import UserPage from '@/views/UserPage'
// import SearchPage from '@/views/SearchPage'
// import SearchResult from '@/views/SearchPage/SearchResult'
// import ArticleDetail from '@/views/ArticleDetail'
// import UserEdit from '@/views/UserPage/UserEdit'
// import ChatBot from '@/views/ChatBot'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/layout/home'
  },
  {
    path: '/login',
    component: () => import(/* webpackChunkName: "LoginPage" */ '@/views/LoginPage'),
    beforeEnter: (to, from, next) => {
      if (getToken()?.length > 0) {
        next(false)
      } else {
        next()
      }
    }
  },
  {
    path: '/layout',
    component: () => import(/* webpackChunkName: "LayoutPage" */ '@/views/LayoutPage'),
    children: [
      {
        path: 'home',
        component: () => import(/* webpackChunkName: "HomePage" */ '@/views/HomePage')
      },
      {
        path: 'user',
        component: () => import(/* webpackChunkName: "UserPage" */ '@/views/UserPage')
      }
    ]
  },
  {
    path: '/search',
    component: () => import(/* webpackChunkName: "SearchPage" */ '@/views/SearchPage')
  },
  {
    path: '/search/:keywords',
    component: () => import(/* webpackChunkName: "SearchResult" */ '@/views/SearchPage/SearchResult')
  },
  {
    path: '/article',
    component: () => import(/* webpackChunkName: "ArticleDetail" */ '@/views/ArticleDetail')
  },
  {
    path: '/setting',
    component: () => import(/* webpackChunkName: "UserEdit" */ '@/views/UserPage/UserEdit')
  },
  {
    path: '/chat',
    component: () => import(/* webpackChunkName: "ChatBot" */ '@/views/ChatBot')
  }
]

const router = new VueRouter({
  routes
})

// 解决编程式路由往同一地址跳转时会报错的情况
const originalPush = VueRouter.prototype.push
const originalReplace = VueRouter.prototype.replace

// push
VueRouter.prototype.push = function push (location, onResolve, onReject) {
  if (onResolve || onReject) {
    return originalPush.call(this, location, onResolve, onReject)
  }
  return originalPush.call(this, location).catch(err => err)
}

// replace
VueRouter.prototype.replace = function push (location, onResolve, onReject) {
  if (onResolve || onReject) {
    return originalReplace.call(this, location, onResolve, onReject)
  }
  return originalReplace.call(this, location).catch(err => err)
}

export default router
