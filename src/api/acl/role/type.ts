/**
 * 分页链接项
 */
export interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

export interface Role {
  id?: number;
  name: string;
  display_name: string | null;
  description: string | null;
  updated_at?: string | null;
}

export interface RoleListResponseData {
  success: boolean;
  code: number;
  message: string;
  data: {
    current_page: number;
    data: Role[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: PaginationLink[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
  };
  timestamp: number;
  request_id: string;
}

export interface RoleListSearch {
  name: string;
  display_name: string;
}

export interface RoleCreateOrUpdateResponseData {
  success: boolean;
  code: number;
  message: string;
  data: Role;
  timestamp: number;
  request_id: string;
}

export interface RoleAssignPermissionResponseData {
  success: boolean;
  code: number;
  message: string;
  data: number[];
  timestamp: number;
  request_id: string;
}

export interface CommonResponseData {
  success: boolean;
  code: number;
  message: string;
  data: any;
  timestamp: number;
  request_id: string;
}

export interface AssignPermission {
  role_id: number;
  display_name: string;
  permissionIds: number[];
}
