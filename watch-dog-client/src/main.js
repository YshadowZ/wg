// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import VueResource from 'vue-resource';
import VueRouter from 'vue-router';
import App from './App';
import router from './router';
import httpInterceptor from './plugins/httpInterceptor';

Vue.use(VueRouter);
Vue.use(VueResource);

Vue.config.productionTip = false;

Vue.use(httpInterceptor, { operation: (...args) => {
  // modified http header Authorization field
  const [request, next] = args;
  request.headers.map.userid = [localStorage.getItem('userid') || ''];
  next((response) => {
    if (typeof response.headers.map.userid === 'object') {
      localStorage.setItem('userid', response.headers.map.userid[0]);
    }
    return response;
  });
} });

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App },
});
