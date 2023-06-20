export const getDate = (val) => {
  if (val) {
    const date = new Date(val);
    const year = date.getFullYear();
    const monthNum = date.getMonth() + 1;
    const month = monthNum < 10 ? `0${monthNum}` : monthNum;
    const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
    return `${year}-${month}-${day}`;
  }
  return "";
};
export const getTodayDate = () => {
  const date = new Date();
  const year = date.getFullYear();
  const monthNum = date.getMonth() + 1;
  const month = monthNum < 10 ? `0${monthNum}` : monthNum;
  const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
  return `${year}-${month}-${day}`;
};

export const mockData = {
  list: [
    {
      planId: "1EDE219C",
      title: "广州广告部门需投入广告推广",
      startTime: "2022-06-10 00:00:00",
      limitTime: "2022-06-10 23:59:00",
    },
    {
      planId: "D47E6BC8",
      title: "本部运营人才招聘",
      startTime: "2022-05-05 00:00:00",
      limitTime: "2022-05-07 23:59:00",
    },
    {
      planId: "D47E6BC9",
      title: "开放平台接入：微信+抖音",
      startTime: "2022-06-01 00:00:00",
      limitTime: "2022-06-07 23:59:00",
    },
    {
      planId: "E44FD0D2",
      title: "协议拟定完成",
      startTime: "2022-05-07 00:00:00",
      limitTime: "2022-06-03 23:59:00",
    },
    {
      planId: "6C9D7BAB",
      title: "上线报表数据整理",
      startTime: "2022-05-11 00:00:00",
      limitTime: "2022-06-25 23:59:00",
    },
  ],

  list1: [
    {
      planId: "2103619F1",
      title: "这是事项一",
      startTime: "2022-05-10 00:00:00",
      limitTime: "2022-05-10 23:59:00",
    },
    {
      planId: "BEB0619F1",
      title: "这是事项二",
      startTime: "2023-05-01 00:00:00",
      limitTime: "2023-05-10 23:59:00",
    },
  ],
};
