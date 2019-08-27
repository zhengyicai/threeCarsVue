import babelpolyfill from 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
//import './assets/theme/theme-green/index.css'
import VueRouter from 'vue-router'
import store from './vuex/store'
import Vuex from 'vuex'
//import NProgress from 'nprogress'
//import 'nprogress/nprogress.css'
import routes from './routes'
// import Mock from './mock'
// Mock.bootstrap();
import 'font-awesome/css/font-awesome.min.css'

//import '../theme/index.css';
import axios from 'axios'
import { Message } from 'element-ui';
import api from './api/api'
import timeFormat from './api/format'
import dateFormat from './api/format'
import state from './api/format'
Vue.prototype.$message = Message;
Vue.prototype.$axios = axios


// Vue.use(timeFormat);
// Vue.use(dateFormat);
// Vue.use(state);
Vue.use(ElementUI)
Vue.use(VueRouter)
Vue.use(Vuex)

Vue.use(require('vue-moment'));
//NProgress.configure({ showSpinner: false });

const router = new VueRouter({
  routes,
  api
})

router.beforeEach((to, from, next) => {
  //NProgress.start();
  if (to.path == '/login') {
    sessionStorage.removeItem('user');
  }
  let user = JSON.parse(sessionStorage.getItem('user'));
  if (!user && to.path != '/login') {
    next({ path: '/login' })
  } else {
    next()
  }
})

//router.afterEach(transition => {
//NProgress.done();
//});

new Vue({
  //el: '#app',
  //template: '<App/>',
  router,
  store,
  //components: { App }
  render: h => h(App)
}).$mount('#app')

