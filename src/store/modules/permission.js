// 专门用来处理权限的模块
import { constantRoutes, asyncRoutes } from '@/router'
const state = {
  // 一开始 肯定拥有静态路由的权限
  routes: constantRoutes // 路由表 表示该用户所拥有的所有路由的数值
}
const mutations = {
  // payload 是要添加的新路由
  setRoutes(state, newRoutes) {
    state.routes = [...constantRoutes, ...newRoutes] // 每次都是在静态路由的基础上加
  }
}
const actions = {
  // 筛选权限路由
  // 第二个参数为当前用户所拥有的菜单权限
  // menus:['settings','permissions']
  filterRoutes(context, menus) {
    const routes = []
    // 筛选出动态路由当中能够跟menus中能对应上的路由
    menus.forEach(key => {
      // item就是标识
      routes.push(...asyncRoutes.filter(item => item.name === key)) // 得到一个数组有可能有元素有可能没有
    })
    context.commit('setRoutes', routes)
    return routes // 这里为什么要return state
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
