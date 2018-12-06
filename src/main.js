// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './styles/index.scss'
import store from '@/store/store'
Vue.use(ElementUI)
Vue.config.productionTip = false
// eslint-disable-next-line
/* eslint-disable no-new */
//注册一个路由全局守卫,防止未登录的用户进入其他页面
router.beforeEach((to,from,next)=>{
  let token=localStorage.getItem('mytoken')
  if(token){
    next()
  }else{
    if(to.path!=='/login'){
      next({path:'/login'})
    }else{
      next()
    }
  }
})
new Vue({
  el: '#app',
  store,
  router,
  components: { App },
  template: '<App/>'
})
