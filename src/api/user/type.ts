// 用户登录接口携带参数的ts类型
export interface loginFormData {
  username: string;
  password: string;
}

// 定义全部接口返回数据都拥有ts类型
export interface ResponseData {
  code: number;
  message: string;
  ok?: boolean;
  success?: boolean;
  timestamp?: number;
  request_id?: string;
}

//定义登录接口返回数据类型
export interface loginResponseData extends ResponseData {
  data: {
    userId: number;
    username: string;
    roles: string[];
    token: string;
  };
}

//定义获取用户信息返回数据类型
export interface userInfoResponseData extends ResponseData {
  data: {
    roles: string[];
    buttons: string[];
    routes: string[];
    name: string;
    avatar: string;
  };
}

export interface UserDetail {
  username: string;
  nickname: string;
  avatar: string;
  mobile: string;
  email: string;
}

export interface UserDetailResponseData extends ResponseData {
  data: UserDetail;
}

export interface UserDetailUpdateFormData {
  username: string;
  nickname: string;
  avatar: string;
  mobile: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface UserDetailUpdateResponseData extends ResponseData {
  data?: any;
}
