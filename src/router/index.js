import Vue from 'vue'
import VueRouter from 'vue-router'
import Index from '../components/Index'
import Home from '../components/Home'
import TaskManagement from '../views/TaskManagement'
import MyTask from '../views/MyTask'
import ReportTask from '../views/ReportTask'
import TimeoutTask from '../views/TimeoutTask'
import MyReportTask from '../views/MyReportTask'
import Report from '../components/report/Report'

Vue.use(VueRouter)

const routes = [

  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/login',
    component: Index
  },
  {
    path: '/test',
    component: Index
  },
  {
    path: '/home',
    component: Home,
    children: [{
      path: '/task-management',
      component: TaskManagement
    }, {
      path: '/my-task',
      component: MyTask
    }, {
      path: '/my-report-task',
      component: MyReportTask
    }, {
      path: '/report-task',
      component: ReportTask
    }, {
      path: '/timeout-task',
      component: TimeoutTask
    }, {
      path: '/statistics',
      component: Report
    }
    ]
  }
]

const router = new VueRouter({
  routes,
  mode: 'history'
})

// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  if (to.path === '/login' || to.path === '/test') return next()
  const token = window.sessionStorage.getItem('token')
  if (!token) return next('/login')
  next()
})

export default router
