export const constantRoutes = [
  {
    // 登录
    path: "/login",
    // 懒加载的方式引入组件
    component: () => import("@/views/login/Index.vue"),
    name: "login",
    meta: {
      // 菜单标题
      title: "登录",
      // 代表路由标题在菜单中是否隐藏  true:隐藏 false:不隐藏
      hidden: true,
      // 菜单文字左侧的图标,支持element-plus全部图标
      icon: "Promotion",
    },
  },
  {
    // 后台首页
    path: "/",
    component: () => import("@/views/layout/Index.vue"),
    name: "layout",
    meta: {
      // 只有一个二级路由的一级路由， 可以不用写标题和icon ，因为它只呈现 二级路由
      title: "",
      hidden: false,
      icon: "",
    },
    // 有二级路由的情况下，一级路由默认重定向到第一个二级路由地址
    redirect: "/home",
    children: [
      {
        path: "/home",
        name: "Home",
        component: () => import("@/views/home/Index.vue"),
        meta: {
          title: "首页",
          hidden: false,
          icon: "HomeFilled",
        },
      },
      {
        // 登录
        path: "/userInfo",
        // 懒加载的方式引入组件
        component: () => import("@/views/home/UserInfo.vue"),
        name: "userInfo",
        meta: {
          // 菜单标题
          title: "用户信息",
          // 代表路由标题在菜单中是否隐藏  true:隐藏 false:不隐藏
          hidden: true,
          // 菜单文字左侧的图标,支持element-plus全部图标
          icon: "User",
        },
      },
    ],
  },

  {
    path: "/404",
    component: () => import("@/views/404/Index.vue"),
    name: "404",
    meta: {
      title: "",
      hidden: true,
      icon: "",
    },
  },
];

// 异步路由
export const asyncRoutes = [
  {
    path: "/screen",
    component: () => import("@/views/screen/Index.vue"),
    name: "Screen",
    meta: {
      hidden: false,
      title: "数据大屏",
      icon: "Platform",
    },
  },
  {
    path: "/product",
    component: () => import("@/views/layout/Index.vue"),
    name: "Product",
    meta: {
      title: "商品管理",
      icon: "Goods",
      hidden: false,
    },
    redirect: "/product/trademark",
    children: [
      {
        path: "/product/trademark",
        component: () => import("@/views/product/trademark/Index.vue"),
        name: "Trademark",
        meta: {
          title: "品牌管理",
          icon: "ShoppingCartFull",
          hidden: false,
        },
      },
      {
        path: "/product/attr",
        component: () => import("@/views/product/attr/Index.vue"),
        name: "Attr",
        meta: {
          title: "属性管理",
          icon: "ChromeFilled",
          hidden: false,
        },
      },
      {
        path: "/product/spu",
        component: () => import("@/views/product/spu/Index.vue"),
        name: "Spu",
        meta: {
          title: "SPU管理",
          icon: "Calendar",
          hidden: false,
        },
      },
      {
        path: "/product/sku",
        component: () => import("@/views/product/sku/Index.vue"),
        name: "Sku",
        meta: {
          title: "SKU管理",
          icon: "Orange",
          hidden: false,
        },
      },
    ],
  },
  {
    path: "/acl",
    // 只有父组件是使用的布局组件时，当前路由的子路由才能显示在布局组件的<router-view>中
    component: () => import("@/views/layout/Index.vue"),
    name: "Acl",
    meta: {
      title: "权限管理",
      icon: "Lock",
      hidden: false,
    },
    redirect: "/acl/user",
    children: [
      {
        path: "/acl/user",
        component: () => import("@/views/acl/user/Index.vue"),
        name: "User",
        meta: {
          title: "用户管理",
          icon: "User",
          hidden: false,
        },
      },
      {
        path: "/acl/role",
        component: () => import("@/views/acl/role/Index.vue"),
        name: "Role",
        meta: {
          title: "角色管理",
          icon: "UserFilled",
          hidden: false,
        },
      },
      {
        path: "/acl/permission",
        component: () => import("@/views/acl/permission/Index.vue"),
        name: "Permission",
        meta: {
          title: "权限管理",
          icon: "Monitor",
          hidden: false,
        },
      },
    ],
  },
];

// 任意路由
export const anyRoutes = {
  path: "/:pathMatch(.*)*",
  redirect: "/404",
  name: "Any",
  meta: {
    title: "任意路由",
    hidden: true,
    icon: "DataLine",
  },
};
