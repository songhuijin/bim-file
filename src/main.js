import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import echarts from 'echarts'
Vue.prototype.$echarts = echarts

//引入ant-design-vue
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
Vue.use(Antd)
import '../public/color.less'

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
