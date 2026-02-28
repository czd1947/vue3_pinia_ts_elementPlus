import axios from "axios";
import { ElMessage } from "element-plus";
import { encryptPayload, decryptPayload } from "@/utils/crypto";
import useUserStore from "@/store/modules/user";
import router from "@/router";

// 创建 axios 实例
const request = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API, // api 的 base_url
  timeout: 5000, // 请求超时时间
});

// 请求拦截器
request.interceptors.request.use((config) => {
  //获取用户相关的小仓库，获取token, 存在token，则在正常请求前都传递token 过去
  const userStore = useUserStore();
  if (userStore.token) {
    config.headers.Authorization = userStore.token;
  }

  if (
    config.method === "post" &&
    config.data &&
    import.meta.env.MODE !== "development"
  ) {
    config.data = {
      payload: encryptPayload(config.data),
    };
  }

  return config;
});

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    if (
      response.data &&
      response.data.payload &&
      import.meta.env.MODE !== "development"
    ) {
      response.data = decryptPayload(response.data.payload);
    }

    // 返回时会 自动封装 Promise 对象
    // response.data.code === 401 说明 token 过期了
    if (response.data) {
      switch (response.data.code) {
        case 401:
          // 1. 清空本地 token
          const userStore = useUserStore();

          userStore.token = "";
          // 2. 提示用户登录
          ElMessage({
            type: "warning",
            message: "登录过期，请重新登录",
          });
          // 3. 跳转到登录页， 并传递当前页面的路由地址作为参数
          router.push("/login?redirect=" + router.currentRoute.value.path);
          // 4. 终止 Promise 链
          break;
        case 500:
          ElMessage({
            type: "error",
            message: response.data.message,
          });
          break;
      }
    }

    return response.data;
  },
  (error) => {
    //处理网络错误
    let msg = "";
    let status = error.response?.status;
    if (!status) {
      // 网络错误，没有 response
      msg = "网络出现问题";
    } else {
      switch (status) {
        case 400:
          msg = "请求错误";
          break;
        case 401:
          msg = "未授权，请登录";
          break;
        case 403:
          msg = "无权访问";
          break;
        case 404:
          msg = "请求地址错误";
          break;
        case 500:
          msg = "服务器出现问题";
          break;
        default:
          msg = "网络出现问题";
      }
    }

    // alert(msg);
    ElMessage({
      type: "error",
      message: msg,
    });

    // 返回时，需要手动指定 Promise 对象的失败信息
    return Promise.reject(error);
  },
);

export default request;
