import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/views/LoginPage'
import Layout from '@/views/LayoutPage'
import Home from '@/views/HomePage'
import User from '@/views/UserPage'
import Search from '@/views/SearchPage'
import SearchResult from '@/views/SearchPage/SearchResult'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/layout/home'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/layout',
    component: Layout,
    children: [
      {
        path: 'home',
        component: Home
      },
      {
        path: 'user',
        component: User
      }
    ]
  },
  {
    path: '/search',
    component: Search
  },
  {
    path: '/search/:keywords',
    component: SearchResult
  }
]

const router = new VueRouter({
  routes
})

export default router
