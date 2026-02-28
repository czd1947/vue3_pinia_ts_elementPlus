//用于项目logo|标题配置
export default {
  title: "czd的个人后台", //项目的标题
  logo: "/public/logo.png", //项目logo设置
  logoHidden: true, //logo组件是否隐藏

  // 分页默认配置信息
  pageInfo: {
    page: 1,
    limit: 10,
    total: 0,
    layout: "prev, pager, next, jumper,->, sizes,total",
    pageSizes: [2, 10, 20, 50, 100],
  },
};
