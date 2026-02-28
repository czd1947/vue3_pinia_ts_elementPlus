import type { RouteRecordRaw } from "vue-router";

// 定义 用户 state 返回的对象类型
export interface UserState {
  token: string | null;
  menuRoutes: RouteRecordRaw[]; // 路由项类型
  username: string;
  avatar: string;
  roles: string[];
  routes: string[];
  buttons: string[];
  routesAdded: boolean; // 标记动态路由是否已添加
}
