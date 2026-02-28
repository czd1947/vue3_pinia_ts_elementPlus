import request from "@/utils/request";
import type {
  UserListResponseData,
  RoleListResponseData,
  CommonResponseData,
  SetUserRoleRequestData,
} from "./type";

enum API {
  USER_LIST = "/admin/acl/user",
  ROLE_LIST = "/get-all-role",
  SET_USER_ROLE = "/set-user-role",
}

export const reqUserList = (params: string) =>
  request.get<any, UserListResponseData>(API.USER_LIST + "?" + params);

export const reqRoleList = () =>
  request.post<any, RoleListResponseData>(API.ROLE_LIST);

export const reqSetUserRole = (data: SetUserRoleRequestData) =>
  request.post<any, CommonResponseData>(API.SET_USER_ROLE, data);
