export interface Permission {
  id?: number;
  parent_id?: number;
  name: string;
  display_name: string;
  type: number;
  type_txt: string;
  route: string | null;
  updated_at: string | null;
  sort_order: number;
  is_enabled: number;
  children?: Permission[];
}

export interface PermissionListResponseData {
  success: boolean;
  code: number;
  message: string;
  data: Permission[];
  timestamp: number;
  request_id: string;
}

export interface CommonResponseData {
  success: boolean;
  code: number;
  data: any;
  message: string;
  timestamp: number;
  request_id: string;
}

export interface SwitchPermissionRequestData {
  id: number;
  is_enabled: number;
}

export interface PermissionFormData {
  id?: number;
  parent_id: number;
  name: string;
  display_name: string;
  type: number;
  route: string | null;
  sort_order: number;
  is_enabled: number;
}
