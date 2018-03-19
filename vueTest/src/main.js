var Vue = require('vue');
var VueRouter = require('vue-router');
var VueAsyncData = require('vue-async-data');
var VueResource = require('vue-resource');
var App = require('./app.vue');
var routerMap = require('./router');

//调用插件
Vue.use(VueResource);
Vue.use(VueRouter);
Vue.use(VueAsyncData);

//swiper
var VueAwesomeSwiper = require('vue-awesome-swiper');
// mount with global
Vue.use(VueAwesomeSwiper);

// filter
var filter = require('./filter');

Object.keys(filter).forEach(function(k) {
  Vue.filter(k, filter[k]);
});

//directive
var directive = require('./directive');

Object.keys(directive).forEach(function(k) {
  Vue.directive(k, directive[k]);
});

var test= Vue.extend({})

new Vue({
  el: '#app',
  components: {
    test: test,
  },
})

var router = new VueRouter();
routerMap(router);

router.start(App, '#app');
