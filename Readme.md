1、简介：

**simple-schedule-calendar** 是基于VUE开发 使用ElementUI中Calendar 做的日程事项日历 ，支持日程事项展示（单日、多日） 。

![](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/8K4ny97wkWv5nLbj/img/ac4cbd23-6728-44c1-a7ae-cff92aa79339.gif)

2、使用方法：

**npm i simple-schedule-calendar**

```

import { SimpleScheduleCalendar } from 'simple-schedule-calendar/simple-schedule-calendar.common';
import 'simple-schedule-calendar/simple-schedule-calendar.css';
...
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
...
  
// 创建事项
createPlan(day) {
      Message({
        showClose: true,
        message: `${day} 在日历上新建计划`,
        type: "success",
        duration: 2000,
        offset: 120,
      });
}

// 事项详情
goDetail(plan) {
      Message({
        showClose: true,
        message: `打开 ${plan.copyTitle} 详情`,
        type: "success",
        duration: 2000,
        offset: 120,
      });
}
...
  

```

3、属性

| 属性名称        | 说明       | 默认   |
| :---------- | :------- | :--- |
| list        | 数据列表     | 空数组  |
| maxNum      | 单日最大事项个数 | 4    |
| showCreate  | 是否显示新建按钮 | 是    |
| defDate     | 默认月份     | 当前月份 |
| createLabel | 新建按钮文本   | 新建   |

4、API

\:::
当新建后需要刷新日程列表数据时可调用：

this.\$refs.calendar.loadPlanCalendar(list)

\:::
