import type { Role } from "../role/type";
/**
 * 分页链接项
 */
export interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

export interface User {
  ulid: string;
  username: string;
  nickname: string;
  avatar: string;
  mobile: string;
  email: string;
  last_login_at: string;
  last_login_ip: string;
  created_at: string;
  roles: Role[];
}

export interface UserListResponseData {
  success: boolean;
  code: number;
  message: string;
  data: {
    current_page: number;
    data: User[];
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

export interface UserListSearch {
  username: string;
  nickname: string;
  mobile: string;
  email: string;
  searchTime: string;
  status: number | boolean;
}

export interface userForm {
  id?: string;
  username: string;
  nickname: string;
  mobile: string;
  email: string;
  password: string;
  repeatPassword: string;
  status: number;
}

export interface RoleListResponseData {
  success: boolean;
  code: number;
  message: string;
  data: Role[];
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

export interface SetUserRoleRequestData {
  ulid: string;
  username: string;
  roleId: number;
}
