import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const Login = () => import('views/Login')
const Home = () => import('views/Home')
const Welcome = () => import('components/content/welcome/Welcome')
const Users = () => import('components/content/users/Users')

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    meta: {
      title: '登录'
    },
    component: Login
  },
  {
    path: '/home',
    name: 'Home',
    meta: {
      title: '首页'
    },
    component: Home,
    redirect: '/home/welcome',
    children: [
      {
        path: 'welcome',
        name: 'Welcome',
        meta: {
          title: '欢迎'
        },
        component: Welcome
      },
      {
        path: 'users',
        name: 'Users',
        meta: {
          title: '用户列表'
        },
        component: Users
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(path) {
  return originalPush.call(this, path).catch(err => err)
}

const originalReplace = VueRouter.prototype.replace
VueRouter.prototype.replace = function push(path) {
  return originalReplace.call(this, path).catch(err => err)
}

router.beforeEach((to, from, next) => {
  if (to.path !== '/login') {
    const token = window.sessionStorage.getItem('token')
    if (!token) {
      return next('/login')
    }
  }
  document.title = to.meta.title
  next()
})

export default router
