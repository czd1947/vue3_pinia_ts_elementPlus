import request from "@/utils/request";
import type {
  RoleListResponseData,
  Role,
  RoleCreateOrUpdateResponseData,
  RoleAssignPermissionResponseData,
  CommonResponseData,
} from "./type";

// Restful API
enum API {
  ROLE_LIST = "/admin/acl/role",
  ROLE_CREATE = "/admin/acl/role",
  ROLE_UPDATE = "/admin/acl/role",
  ROLE_DELETE = "/admin/acl/role",
  ROLE_ASSIGN_PERMISSION = "/get-permissionids-by-roleid",
  ROLE_ASSIGN_PERMISSION_UPDATE = "/set-permissionids-by-roleid",
}

export const getRoleList = (params: string) =>
  request.get<any, RoleListResponseData>(API.ROLE_LIST + "?" + params);

export const createRole = (data: Role) =>
  request.post<any, RoleCreateOrUpdateResponseData>(API.ROLE_CREATE, data);

export const updateRole = (data: Role) =>
  request.put<any, RoleCreateOrUpdateResponseData>(
    API.ROLE_UPDATE + "/" + data.id,
    data,
  );

export const deleteRole = (id: number) =>
  request.delete<any, RoleCreateOrUpdateResponseData>(
    API.ROLE_DELETE + "/" + id,
  );

export const getPermissionIdsByRoleId = (roleId: number) =>
  request.post<any, RoleAssignPermissionResponseData>(
    API.ROLE_ASSIGN_PERMISSION,
    { role_id: roleId },
  );

export const setPermissionIdsByRoleId = (
  roleId: number,
  permissionIds: number[],
) =>
  request.post<any, CommonResponseData>(API.ROLE_ASSIGN_PERMISSION_UPDATE, {
    role_id: roleId,
    permission_ids: permissionIds,
  });
