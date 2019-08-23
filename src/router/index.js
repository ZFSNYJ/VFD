import Vue from 'vue'
import Router from 'vue-router'
import FlowDesigner from '@/components/flow/designer/FlowDesigner'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'FlowDesigner',
      component: FlowDesigner
    }
  ]
})
