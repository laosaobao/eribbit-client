// import XtxSkeleton from './xtx-skeleton.vue'
// import XtxCarousel from './xtx-carousel.vue'
// import XtxMore from './xtx-more.vue'
import defaultImg from '@/assets/images/200.png'
// import XtxBread from './xtx-bread.vue'
// import XtxBreadItem from './xtx-bread-item.vue'
// 扩展vue原有的功能：全局组件，自定义指令，挂载原型方法，注意：没有全局过滤器。
// 这就是插件
// vue2.0插件写法要素：导出一个对象，有install函数，默认传入了Vue构造函数，Vue基础之上扩展
// vue3.0插件写法要素：导出一个对象，有install函数，默认传入了app应用实例，app基础之上扩展
const importFn = require.context('./', false, /\.vue$/)
export default {
  // 批量导入需要使用一个函数 require.context(dir,deep,matching)
  // 参数：1. 目录  2. 是否加载子目录  3. 加载的正则匹配

    install(app) {
    // 在app上进行扩展，app提供 component directive 函数
    // 如果要挂载原型 app.config.globalProperties 方式
    // app.component(XtxSkeleton.name, XtxSkeleton)
    // app.component(XtxCarousel.name, XtxCarousel)
    // app.component(XtxMore.name, XtxMore)
    // app.component(XtxBread.name, XtxBread)
    // app.component(XtxBreadItem.name, XtxBreadItem)
    //批量注册全局组件
    importFn.keys().forEach(path => {
      const component = importFn(path).default
      app.component(component.name,component)
    });

    //定义指令
    defineDirective(app)
  }
}

//指令
const defineDirective = (app) => {
  // 1 图片懒加载指令
  app.directive('lazy', {
    //2.0监听元素创建方法用inserted 3.0用mounted
    mounted(el, binding) {
      const observer = new IntersectionObserver(([{ isIntersecting }], observer) => {
        if (isIntersecting) {
          //关闭第二次反复监听
          observer.unobserve(el)
          el.onerror = () => {
            el.src = defaultImg
          }
          el.src = binding.value
        }
      }, {
        threshold: 0.01
      })
      observer.observe(el)
    }
  })//directive方法结束
}