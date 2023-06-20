<!-- 页面:日历-->
<template>
  <div class="main-plan">
    <!-- 月份切换选择 begin -->
    <div class="month-select">
      <el-date-picker
        v-model="valueDate"
        value-format="yyyy-MM"
        placeholder="选择月份"
        format="yyyy年MM月"
        :clearable="false"
        :editable="false"
        type="month"
        size="mini"
      ></el-date-picker>
    </div>
    <!-- 月份切换选择 end -->

    <!-- 日历 begin -->
    <el-calendar v-model="valueDate">
      <template #dateCell="{ data }">
        <div
          class="daily-plan"
          @mouseenter="hoverEnterDay(data)"
          @mouseleave="hoverLeaveDay()"
        >
          <!-- 某天的顶部区域  begin-->
          <div class="cell-top">
            <div class="day">
              {{ data.day.split("-").slice(2).join("-") }}
            </div>
            <div v-if="isToday(data)" class="today-plan">今</div>
          </div>
          <!-- 某天的顶部区域  end-->
          <div v-for="(item, index) in dataList" :key="index">
            <div v-if="item.date === data.day">
              <div class="day-plan">
                <!-- 当日事项列表 begin -->
                <div
                  v-for="(plan, i) in item.planList"
                  :key="i"
                  :class="getClassByWeight(plan.weight, plan.planLength)"
                  :style="{ background: `${plan.background}` }"
                  :title="`${plan.copyTitle} 日期:${plan.startTime} 至 ${plan.limitTime}`"
                  @click.stop="showPlanDetail(plan)"
                  @mouseenter="hoverEnterItem(plan)"
                  @mouseleave="hoverLeaveItem(plan)"
                >
                  <div class="day-item-left" style="width: auto; height: 20px">
                    <span class="plan-title">{{ plan.title }}</span>
                  </div>
                </div>
                <!-- 当日事项列表 end -->
              </div>

              <!-- 右上角更多事项图标 begin-->
              <div v-if="item.planList.length >= rowNum" class="plan-more">
                <el-popover placement="right" trigger="hover">
                  <div v-for="(plan, i) in item.planList" :key="i">
                    <div class="day-item" @click.stop="showPlanDetail(plan)">
                      <span class="plan-title">{{ plan.copyTitle }}</span>
                    </div>
                  </div>
                  <i
                    class="el-icon-more"
                    slot="reference"
                    style="color: #aaa; margin-right: 6px"
                  ></i>
                </el-popover>
              </div>
              <!-- 右上角更多事项图标 end-->
            </div>
          </div>

          <div
            v-if="showCreate"
            v-show="currentDay === data.day"
            class="plan-create"
            @click.stop="createPlan(data.day)"
          >
            {{ createLabel }}
          </div>
        </div>
      </template>
    </el-calendar>
    <!-- 日历 end -->
  </div>
</template>
<script>
// 获取封装头部请求参数createLabel
import dayjs from "dayjs";
import { getDate } from "@/utils/util";

export default {
  name: "SimpleScheduleCalendar",
  components: {},
  props: {
    list: { type: Array, default: () => [] }, // 数据列表
    maxNum: { type: Number, default: 4 }, // 单日计划最大行数
    showCreate: { type: Boolean, default: true }, // 是否展示创建按钮
    createLabel: { type: String, default: "新建" }, // 新建文本
    defDate: { type: Date, default: null }, // 新建文本
  },
  data() {
    return {
      dataList: [],
      valueDate: this.defDate ?? new Date(),
      resList: [],
      rowNum: this.maxNum,
      currentDay: "",
    };
  },
  mounted() {
    // 初始化页面加载数据
    this.initData();
  },
  methods: {
    // 1.0 初始化
    initData() {
      this.loadCalendar(this.list);
    },

    // 1.1 处理数据列表
    loadCalendar(list) {
      if (list) {
        const allList = this.getAllList(list);
        this.bulidDataList(allList);
        this.dataList = this.resList;
      }
    },
    // 1.2 构建我的日程计划数据
    bulidDataList(list) {
      const resList = [];
      list.forEach((ele) => {
        const date = getDate(ele.createTime);
        let itemObj = resList.find((item) => item.date === date);
        if (!itemObj) {
          itemObj = {
            date: date,
            planList: [],
          };
          resList.push(itemObj);
        }
        const obj = this.buildObj(ele);
        itemObj.planList.push(obj);
      });

      resList.forEach((item) => {
        // 计划列表 按照权重和长度排序，这样才能显示在同行上面
        item.planList.sort(this.sortWeight);
        // 单日最多显示行数rowNum
        item.planList = item.planList.slice(0, this.rowNum);
      });

      resList.sort(this.sortTime);
      this.handlePlanList(resList);
      this.handleFormatPlanList(resList);
      this.resList = resList;
    },

    // 1.3 计划名称断层问题处理
    handlePlanList(resList) {
      resList.forEach((ele, k) => {
        ele.planList.forEach((member, index) => {
          // 拿到每一个元素和上一个元素对比
          if (k > 0) {
            const list = ele.planList.filter((it) => it.planId === "") || [];
            this.handleList(resList, member, k, index, list.length);
          }
        });
      });
    },

    // 1.4 得到已格式化列表
    handleFormatPlanList(resList) {
      resList.forEach((ele, k) => {
        ele.planList.forEach((o, index) => {
          // 拿到每一个元素和上一个元素对比
          if (k > 0) {
            // 处理当头部被遮挡 在一周之内 则隐藏此计划
            this.handleHeaderList(resList, o, k, index);
          }
        });
      });
    },

    /** 1.5
     * 保证每个计划在一周之内不断行
     * resList  数据列表
     * member 为当前日期中某项计划对象
     * k 数据列表中第几项
     * num 此计划位于当天第几项
     * */

    handleList(resList, member, k, num, length) {
      const isMonday = new Date(resList[k].date).getDay() === 1;
      // 遍历相邻项 找出相邻列表中的计划对象
      const planIndex = resList[k - 1].planList.findIndex(
        (item) => member.planId !== "" && member.planId === item.planId
      );
      if (planIndex !== -1 && planIndex - num > 0 && !isMonday) {
        // 获得格式化后的列表 覆盖原来列表
        const list = this.getFormatList(
          resList,
          member,
          k,
          num,
          planIndex - num,
          length
        );
        resList[k].planList = list;
      }
    },
    // 1.6 处理当头部被遮挡 在一周之内 则隐藏此计划
    handleHeaderList(resList, o, k) {
      // 计算目前项对应是否为周一  这里需要最一重逻辑  判断前面的日期中是否包含此计划，并且判断的条件是不是周一和不是此计划的第一天
      const haveFlag = resList[k - 1].planList.some(
        (item) => o.planId !== "" && o.planId === item.planId
      );
      const forDate = dayjs(resList[k].date).format("YYYY-MM-DD");
      const isMonday = new Date(forDate).getDay() === 1;
      let planIndex = resList[k].planList.findIndex(
        (item) => o.planId !== "" && item.planId === o.planId
      );
      // 计算标志位
      const computeFlag =
        !haveFlag &&
        o.planId !== "" &&
        !isMonday &&
        resList[k].planList[planIndex].startTime !== forDate &&
        o.planLength > 6;

      if (computeFlag) {
        const index = resList[k].planList.findIndex(
          (item) => item.planId === o.planId
        );

        if (index !== -1) {
          resList[k].planList.splice(index, 1);
        }
      }
    },
    // 1.7 填充展示计划数组
    getFormatList(resList, o, k, num, l, length) {
      const obj = {
        title: "",
        planId: "",
        weight: "",
        planLength: o.planLength,
        background: "#fff",
        startTime: o.startTime,
        limitTime: o.limitTime,
        copyTitle: "",
      };
      const pushList = resList[k].planList.slice(0, num);
      // 计算空数组长度
      for (let b = 0; b < l - length; b += 1) {
        pushList.push(obj);
      }

      for (let h = num; h < resList[k].planList.length; h += 1) {
        pushList.push(resList[k].planList[h]);
      }
      return pushList.slice(0, this.rowNum);
    },
    // 1.8 按照计划日期及计划长度排序
    sortWeight(a, b) {
      return b.weight - a.weight || b.planLength - a.planLength;
    },
    // 1.9 按照时间排序
    sortTime(a, b) {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    },
    // 2.0 构建日期展示的数据列表
    getAllList(list) {
      const resList = [];
      list.forEach((ele) => {
        const startDate = ele.startTime;
        const day = dayjs(ele.limitTime).diff(ele.startTime, "day");
        for (let i = 0; i <= day; i += 1) {
          const createDate = dayjs(startDate)
            .add(i, "day")
            .format("YYYY-MM-DD");
          const isMonday = new Date(createDate).getDay() === 1;
          const obj = this.getFormatObj(i, ele, isMonday, day);
          resList.push(obj);
        }
      });
      return resList;
    },
    // 2.1 得到格式化对象
    getFormatObj(i, ele, isMonday, day) {
      const obj = {};
      obj.background = "#c4e1ff";
      if (i === 0 || isMonday) {
        obj.flag = true;
        obj.title = ele.title;
      } else {
        obj.flag = false;
        obj.title = "";
      }
      obj.planId = ele.planId;
      obj.planLength = day;
      obj.weight = i;
      obj.copyTitle = ele.title;
      obj.startTime = getDate(ele.startTime);
      obj.limitTime = getDate(ele.limitTime);
      obj.createTime = dayjs(ele.startTime).add(i, "day").format("YYYY-MM-DD");
      return obj;
    },
    // 2.2 创建计划
    createPlan(day) {
      this.$emit("create", day);
    },

    // 2.4 计划详情
    showPlanDetail(plan) {
      this.$emit("detail", plan);
    },

    // 2.5 计划第一天和最后一天 角半径设置
    getClassByWeight(weight, planLength) {
      return planLength === 0
        ? "day-item3"
        : weight === 0
        ? "day-item1"
        : weight === planLength
        ? "day-item2"
        : "day-item";
    },

    // 2.6 处理鼠标进入事件
    hoverEnterItem(e) {
      this.dataList.forEach((item) => {
        const obj = item.planList.find(
          (element) => e.planId !== "" && e.planId === element.planId
        );
        if (obj) {
          obj.background = "#ccc";
        }
      });
    },
    // 2.7 处理鼠标移开事件
    hoverLeaveItem(e) {
      this.dataList.forEach((item) => {
        const obj = item.planList.find(
          (element) => e.planId !== "" && e.planId === element.planId
        );
        if (obj) {
          obj.background = "#c4e1ff";
        }
      });
    },

    hoverEnterDay(data) {
      this.currentDay = data.day;
    },
    hoverLeaveDay() {
      this.currentDay = "";
    },
    // 2.8 是否为今天
    isToday(data) {
      return dayjs().isSame(data.day, "day");
    },

    // 2.9 构建数据对象
    buildObj(ele) {
      const obj = {
        title: ele.title,
        planId: ele.planId,
        weight: ele.weight,
        planLength: ele.planLength,
        background: ele.background,
        startTime: ele.startTime,
        limitTime: ele.limitTime,
        copyTitle: ele.copyTitle,
      };
      return obj;
    },
  },
};
</script>

<style lang="less" scoped>
.main-plan {
  height: 100%;
  position: relative;
  /deep/.el-calendar {
    .el-calendar__body {
      padding: 15px;
    }
    .el-calendar-table .el-calendar-day {
      height: 130px;
      padding: 0px;
    }
    .el-calendar-table thead th {
      text-align: center;
    }
  }
}

.cell-top {
  display: flex;
  align-items: center;
  justify-content: flex-start;
}
.day {
  padding: 5px;
}
.day-plan {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100%;
}
.day-item {
  display: flex;
  justify-content: center;
  align-items: center;
  background: #c4e1ff;
  width: 100%;
  margin-top: 1px;
  color: #fff;
}
.day-item:hover {
  background: #c1cedb;
}

.day-item-left {
  flex: 3;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.day-item-right {
  display: flex;
  justify-content: flex-end;
}
.daily-plan {
  position: relative;
  height: 100%;
}
.plan-more {
  position: absolute;
  top: 0px;
  right: 0px;
}
.month-select {
  position: absolute;
  left: 20px;
  top: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.day-item1 {
  display: flex;
  justify-content: center;
  align-items: center;
  background: #c4e1ff;
  width: 100%;
  margin-top: 1px;
  color: #fff;
  border-radius: 15px 0px 0px 15px;
}
.day-item2 {
  display: flex;
  justify-content: center;
  align-items: center;
  background: #c4e1ff;
  width: 100%;
  margin-top: 1px;
  color: #fff;
  border-radius: 0px 15px 15px 0px;
}
.day-item3 {
  display: flex;
  justify-content: center;
  align-items: center;
  background: #c4e1ff;
  width: 100%;
  margin-top: 1px;
  color: #fff;
  border-radius: 15px 15px 15px 15px;
}

.plan-title {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  color: #333;
  font-size: 12px;
  padding-left: 5px;
}

.today-plan {
  width: 16px;
  height: 16px;
  background: #ff0000;
  border-radius: 50%;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
}
.plan-create {
  position: absolute;
  bottom: 10px;
  width: 100%;
  display: flex;
  justify-content: center;
  font-size: 12px;
  color: #666;
}
</style>
