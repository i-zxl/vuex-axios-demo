import Vue from 'vue'
import VueRouter from 'vue-router'
import ElementUI from 'element-ui'
import 'element-ui/theme-default/index.css'
import Axios from 'axios'
import VueAxios from './resource/vue-axios'
import store from 'src/store/index.js'
import App from 'src/App.vue'
import 'global.css'

Vue.use(ElementUI);
Vue.use(VueRouter);
Vue.use(VueAxios, Axios)

const app = new Vue({
  store,
  render: h => h(App)
}).$mount('#app');
