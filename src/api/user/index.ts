//统一管理咱们项目用户相关的接口
import request from "@/utils/request";

import type {
  loginFormData,
  loginResponseData,
  userInfoResponseData,
  UserDetailResponseData,
  UserDetailUpdateFormData,
  UserDetailUpdateResponseData,
} from "./type";

//项目用户相关的请求地址
enum API {
  LOGIN_URL = "/login",
  USERINFO_URL = "/user",
  LOGOUT_URL = "/logout",
  USER_DETAIL_URL = "/get-user-detail",
  USER_DETAIL_UPDATE_URL = "/update-user-detail",
  UPLOAD_URL = "/upload",
}
//登录接口
export const reqLogin = (data: loginFormData) =>
  request.post<any, loginResponseData>(API.LOGIN_URL, data);

//获取用户信息
export const reqUserInfo = () =>
  request.post<any, userInfoResponseData>(API.USERINFO_URL);

//退出登录
export const reqLogout = () => request.post<any, any>(API.LOGOUT_URL);

//获取用户详情
export const reqUserDetail = () =>
  request.post<any, UserDetailResponseData>(API.USER_DETAIL_URL);

//更新用户详情
export const reqUserDetailUpdate = (data: UserDetailUpdateFormData) =>
  request.post<any, UserDetailUpdateResponseData>(
    API.USER_DETAIL_UPDATE_URL,
    data,
  );

//上传用户头像
export const reqUploadAvatar = (data: FormData) =>
  request.post<any, any>(API.UPLOAD_URL, data);
