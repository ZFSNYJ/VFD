import Vue from 'vue'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
import VueContextMenu from 'vue-contextmenu'
import vcolorpicker from 'vcolorpicker'
import vfd from './src/components/flow/designer/FlowDesigner'

Vue.use(Antd)
Vue.use(VueContextMenu)
Vue.use(vcolorpicker)

export default vfd