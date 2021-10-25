import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login'
import Home from '../components/Home'
import TaskManagement from '../views/TaskManagement'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: Home,
    children: [{
      path: '/task-management',
      component: TaskManagement
    }]
  }
]

// TODO 挂在路由导航守卫
const router = new VueRouter({
  routes
})

export default router
