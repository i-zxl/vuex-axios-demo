import Vue from 'vue'
import VueRouter from 'vue-router'
import Axios from 'axios'
import VueAxios from './resource/vue-axios'
import store from 'src/store/index.js'
import App from 'src/App.vue'
import 'global.css'

import routes from './router.js'

Vue.use(VueRouter);
Vue.use(VueAxios, Axios)

const router = new VueRouter({
  routes
})
// 重定向首页
router.beforeEach((to, from, next) => {
  let path = to.path;
  if (!path) {
    next('/home/index');
  } else {
    next();
  }
})

const app = new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
