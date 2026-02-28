export interface Category {
  id: number;
  name: string;
  parent_id: number;
  level: number;
}

export interface CategoryResponseData {
  success: boolean;
  code: number;
  data: Category[];
  message: string;
  timestamp: number;
  request_id: string;
}

export interface AttributeValues {
  id?: number;
  attribute_id?: number;
  attr_value: string;
  flag?: number;
}

export interface Attribute {
  id?: number;
  category_id_1: number;
  category_id_2: number;
  category_id_3: number;
  attr_name: string;
  attr_values: string[];
  attr_value: AttributeValues[];
  is_required?: number;
  sort_order?: number;
}

export interface AttributeResponseData {
  success: boolean;
  code: number;
  data: {
    current_page: number;
    data: Attribute[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: any;
    path: string;
    prev_page_url: null | string;
    next_page_url: null | string;
    per_page: number;
    to: number;
    total: number;
  };
  message: string;
  timestamp: number;
  request_id: string;
}

export interface AttributeDeleteResponseData {
  success: boolean;
  code: number;
  data: number;
  message: string;
  timestamp: number;
  request_id: string;
}
