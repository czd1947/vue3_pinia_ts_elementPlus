import request from "@/utils/request";
import type {
  PermissionListResponseData,
  CommonResponseData,
  SwitchPermissionRequestData,
  PermissionFormData,
} from "./type";

enum API {
  PERMISSION_LIST = "/admin/acl/permission",
  SWITCH_PERMISSION = "permission/switchChange",
  ADD_PERMISSION = "/admin/acl/permission",
  UPDATE_PERMISSION = "/admin/acl/permission",
  DELETE_PERMISSION = "/admin/acl/permission",
}

export const getPermissionList = (params: string) =>
  request.get<any, PermissionListResponseData>(
    API.PERMISSION_LIST + "?" + params,
  );

export const switchPermission = (data: SwitchPermissionRequestData) => {
  return request.post<any, CommonResponseData>(API.SWITCH_PERMISSION, data);
};

export const addPermission = (data: PermissionFormData) => {
  return request.post<any, CommonResponseData>(API.ADD_PERMISSION, data);
};

export const updatePermission = (data: PermissionFormData) => {
  return request.put<any, CommonResponseData>(
    API.UPDATE_PERMISSION + "/" + data.id,
    data,
  );
};

export const deletePermission = (id: number) => {
  return request.delete<any, CommonResponseData>(
    API.DELETE_PERMISSION + "/" + id,
  );
};
