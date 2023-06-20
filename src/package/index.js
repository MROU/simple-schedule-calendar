// 1.引入通用基础组件
import SimpleScheduleCalendar from "./simple-schedule-calendar/index";
// 存储组件列表
const components = [SimpleScheduleCalendar];
// 定义 install 方法，接收 Vue 作为参数。如果使用 use 注册插件，则所有的组件都将被注册

const install = (Vue) => {
  // 遍历注册全局组件
  components.forEach((component) => {
    Vue.component(component.name, component);
  });
};

// 判断是否是直接引入文件
if (typeof window !== "undefined" && window.Vue) {
  install(window.Vue);
}

export default {
  // 引入全部
  install,
};
export {
  // 局部引入
  SimpleScheduleCalendar,
};
