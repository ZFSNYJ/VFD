// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Antd from 'ant-design-vue'
import App from './App'
import 'ant-design-vue/dist/antd.css'
import router from './router'
import VueContextMenu from 'vue-contextmenu'
import vcolorpicker from 'vcolorpicker'
Vue.config.productionTip = false

Vue.use(Antd)
Vue.use(VueContextMenu)
Vue.use(vcolorpicker)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
