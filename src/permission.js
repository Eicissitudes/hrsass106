import router from '@/router'
import store from '@/store'
import nprogress from 'nprogress' // 引入进度条
import 'nprogress/nprogress.css' // 引入进度条样式

const whiteList = ['/login', '/404']
router.beforeEach(async(to, from, next) => {
  nprogress.start()
  if (store.getters.token) {
    if (to.path === '/login') {
      next('/')
    } else {
      // 只有放行的时候才去获取用户资料的id
      // 不是每次都要获取
      // 如果当前vuex中有用户资料的id表示 已经有资料了 如果没有才需要获取
      if (!store.getters.userId) {
        // 如果没有表示没有获取过
        await store.dispatch('user/getUserInfo')
        // 如果后续需要根据用户资料获取数据这里要改成同步
      }
      next()
    }
  } else {
    if (whiteList.indexOf(to.path) > -1) {
      // 表示要去的地址在白名单
      next()
    } else {
      next('/login')
    }
    nprogress.done() // 关闭进度条    //解决手动切换地址时进度条不关闭的问题
  }
})
// 后置守卫
router.afterEach(() => {
  nprogress.done() // 关闭进度条
})
