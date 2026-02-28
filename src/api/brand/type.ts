/**
 * 商品品牌单条数据模型
 */
export interface Brand {
  id?: number;
  name: string;
  alias: string;
  logo: string;
  description: string;
  website: string;
  sort_order: number;
  is_enabled: number; // 也可以根据业务定义为 0 | 1
  first_letter?: string;
  updated_at?: string;
  created_at?: string; // 根据需要添加
  deleted_at?: string | null;
}

/**
 * 分页链接项
 */
export interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

/**
 * Laravel 分页响应结构
 */
export interface PaginatedResponse<T> {
  current_page: number;
  data: T[];
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
}

export interface BrandResponseData {
  success: boolean;
  code: number;
  message: string;
  data: PaginatedResponse<Brand>;
  timestamp: number;
  request_id: string;
}

export interface BrandRequest {
  id?: number;
  name: string;
  alias: string;
  logo: string;
  description: string;
  website: string;
  sort_order: number;
  is_enabled: number;
  updated_at?: string;
}

export interface BrandCreateResponseData {
  success: boolean;
  code: number;
  message: string;
  data: Brand;
  timestamp: number;
  request_id: string;
}
