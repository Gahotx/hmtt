import Vue from 'vue'
import VueRouter from 'vue-router'
import LoginPage from '@/views/LoginPage'
import LayoutPage from '@/views/LayoutPage'
import HomePage from '@/views/HomePage'
import UserPage from '@/views/UserPage'
import SearchPage from '@/views/SearchPage'
import SearchResult from '@/views/SearchPage/SearchResult'
import ArticleDetail from '@/views/ArticleDetail'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/layout/home'
  },
  {
    path: '/login',
    component: LoginPage
  },
  {
    path: '/layout',
    component: LayoutPage,
    children: [
      {
        path: 'home',
        component: HomePage
      },
      {
        path: 'user',
        component: UserPage
      }
    ]
  },
  {
    path: '/search',
    component: SearchPage
  },
  {
    path: '/search/:keywords',
    component: SearchResult
  },
  {
    path: '/article',
    component: ArticleDetail
  }
]

const router = new VueRouter({
  routes
})

export default router
