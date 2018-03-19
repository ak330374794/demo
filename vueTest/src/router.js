module.exports = function (router) {
  router.map({
    '*': {
      component: require('./views/index.vue')
    },
    '/': {
      component: require('./views/index.vue')
    },
    '/list': {
      component: require('./views/list.vue')
    },
    '/asi': {
      component: require('./views/asi.vue')
    }
  })

}