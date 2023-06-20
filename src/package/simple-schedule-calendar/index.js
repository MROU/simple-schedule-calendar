import Component from "./main.vue";

Component.install = (Vue) => {
  Vue.component(Component.name, Component);
};

export default Component;
