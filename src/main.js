import Vue from "vue";
import App from "./App.vue";

import { Calendar, DatePicker, Popover } from "element-ui";
import "element-ui/lib/theme-chalk/index.css";

Vue.config.productionTip = false;
Vue.use(Calendar);
Vue.use(DatePicker);
Vue.use(Popover);

new Vue({
  render: (h) => h(App),
}).$mount("#app");
