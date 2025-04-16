import 'core-js/stable'
import 'regenerator-runtime/runtime'
import Vue from 'vue'
import App from '@/App.vue'
import router from '@/router'
import i18n from '@/i18n'
import '@/plugins/axios'
import '@/css/main.css'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)

import videojs from 'video.js'
import 'video.js/dist/video-js.css'
Vue.prototype.$video = videojs

Vue.config.productionTip = false

new Vue({
    router,
    i18n,
    render: h => h(App)
}).$mount('#app')
