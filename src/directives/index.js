// 负责管理所有的自定义指令
export const imagerror = {
  // 指令对象 会在当前的dom元素插入到节点之后执行
  inserted(dom, options) {
    // option是指令中变量的解释
    // dom 表示当前指令作用的dom对象
    // dom 认为此时就是图片
    dom.src = dom.src || options.value // 初始化的时候如果没有值 需要进行默认值赋值
    dom.onerror = function() {
    // 当图片出现异常 会将指令配置的默认图片设置为该图片的内容
    // dom可以注册error时间{
      dom.src = options.value
    }
  },
  // 该函数同inserted一样也是一个钩子函数
  componentUpdated(dom, options) {
    // 该钩子函数会在当前指令作用的组件 更新数据完成之后执行
    // inserted只会执行一次
    // 组件初始化后一旦更新就不会再次进入inserted函数 会进入componentUpdated
    dom.src = dom.src || options.value
  }
}
