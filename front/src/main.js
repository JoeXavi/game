import Vue from 'vue'
import App from './App.vue'

import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
Vue.config.productionTip = false
Vue.use(BootstrapVue)
Vue.use(IconsPlugin)

import './plugins/axios.js'

import mqtt from './plugins/mqtt'
Vue.use(mqtt)

import EventBus from './plugins/event-bus'
Vue.use(EventBus);

new Vue({
  render: h => h(App),
}).$mount('#app')
