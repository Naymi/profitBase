import Vue from "vue"
import ElementUI from "element-ui"
import "element-ui/lib/theme-chalk/index.css"
import locale from "element-ui/lib/locale/lang/ru-RU"
import App from "./App.vue"
import "@/assets/main.scss"
Vue.config.productionTip = false

Vue.use(ElementUI, { locale })
new Vue({
  el: "#app",
  render: h => h(App)
})
// import Vue from 'vue'
// import App from './App.vue'

// new Vue({
//   render: h => h(App),
// }).$mount('#app')
