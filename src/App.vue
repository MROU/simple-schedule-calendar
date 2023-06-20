<template>
  <div id="app">
    <SimpleScheduleCalendar
      ref="calendar"
      :list="dataList"
      :maxNum="4"
      :showCreate="true"
      :defDate="defDate"
      createLabel="新建计划"
      @create="createPlan"
      @detail="goDetail"
    />
  </div>
</template>

<script>
import { mockData } from "@/utils/util";
import SimpleScheduleCalendar from "./package/simple-schedule-calendar/main.vue";
import { Message } from "element-ui";

export default {
  name: "App",
  components: {
    SimpleScheduleCalendar,
  },
  data() {
    return {
      dataList: mockData.list, // 模拟数据
      defDate: new Date("2022-05-10"),
    };
  },
  methods: {
    // 1.0 创建事件
    createPlan(day) {
      Message({
        showClose: true,
        message: `${day} 在日历上新建计划`,
        type: "success",
        duration: 2000,
        offset: 120,
      });
      //this.refreshCalendar();
    },
    // 1.1 事项详情
    goDetail(plan) {
      Message({
        showClose: true,
        message: `打开 ${plan.copyTitle} 详情`,
        type: "success",
        duration: 2000,
        offset: 120,
      });
    },

    // 1.2  刷新日历数据
    refreshCalendar() {
      Message({
        showClose: true,
        message: `刷新日历数据`,
        type: "success",
        duration: 2000,
        offset: 120,
      });
      this.$refs.calendar.loadCalendar(mockData.list1);
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
