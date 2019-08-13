import axios from "axios";
import vue from "vue";
import store from "@/vuex/store";
import UI from "./ui";
import Util from "@/util";
const VUE = new vue();
const instance = axios.create({
  timeout: 60000
});

const jointParams = (params, isContains) => {
  let res = isContains ? "&" : "?";
  for (let key in params) {
    res += `${key}=${params[key]}&`;
  }
  return res.substr(0, res.length - 1);
};

// 请求前拦截
instance.interceptors.request.use(
  config => {
    store.commit("loading");
    return config;
  },
  err => {
    store.commit("unloading");
    return Promise.resolve(err);
  }
);

// 返回后拦截
instance.interceptors.response.use(
  res => {
    let bizRes = res.data;
    if (
      bizRes.status === 0 ||
      bizRes.rtnCode == "0000000" ||
      bizRes.rtnCode == "0100030" ||
      bizRes.rtnCode == "0100010" ||
      bizRes.status == "42"
    ) {
      return res.data;
    } else if (bizRes.rtnCode == "6666666" || bizRes.status === "0000") {// 身份过期
      window.sessionStorage.clear();
      window.localStorage.clear();
      UI.toastError(bizRes.message ? bizRes.message : bizRes.msg);
      window.webapp.$router.push("/login");
      return Promise.reject(bizRes);
    } else if (bizRes.status == "100001") {// 用户不存在  100001
      window.sessionStorage.clear();
      window.localStorage.clear();
      UI.toastError(bizRes.message ? bizRes.message : bizRes.msg);
      window.webapp.$router.push("/login");
      return Promise.reject(bizRes);
    } else if (bizRes.rtnCode == "4444444" || bizRes.rtnCode == "1000212") { // 知了接口没有登录权限
      return Promise.reject(bizRes);
    } else if (bizRes.rtnCode != "0000000" && !bizRes.status) {
      UI.toastError(bizRes.msg ? bizRes.msg : bizRes.message);
      return bizRes;
    } else {
      return bizRes;
    }

    //store.commit("unloading");
    //return res.data;
  },
  err => {
    let message = {};
    if (!err.response) {
      message.content = "网络错误，请求超时";
      message.state = err.code;
    } else {
      let enumError = {
        "500": "服务器错误",
        "401": "请重新登录",
        "403": "您没有权限",
        "404": "获取资源错误404"
      };
      message.content =
        enumError[err.response.status] || "网络不给力,请稍后再试~";
    }
    UI.toastError(message.content);
    //去除loading
    Util.unLoading(window.webapp);
    store.commit("unloading");
    return Promise.reject(err);
  }
);

export default {
  /**
   * post请求
   * @param {*} url 请求地址
   */
  post(url, params = {}, data, contentType, responseType) {
    //url后缀存在参数
    let isContains = url.includes("?");
    //知了
    if (url.indexOf("zl_api") != -1) {
      data = {
        style: "",
        clientInfo: {},
        data: data
      };
      let schoolId = params.schoolId; //部分接口传schoolId且与缓存不一致
      if (!schoolId) {
        let schoolInfo = VUE.getSStorage("saas_currentSchool");
        if (schoolInfo) {
          schoolId = schoolInfo.schoolId;
        }
      }
      if (schoolId) {
        params.schoolId = schoolId;
      }
      let token = VUE.getSStorage("saas_token") || VUE.getSStorage("_TOKEN_COOKIE");
      let code = VUE.getSg("code") || VUE.getSg("groupCode");
      if (code) {
        params.code = code;
      }
      params =
        token &&
        Object.assign({}, params, {
          token: token
        });

      url += jointParams(params, isContains);
    }
    //校易收接口加知了token
    if (url.includes('/xys_api')) {
      let token = VUE.getSStorage("saas_token") || VUE.getSStorage("_TOKEN_COOKIE");
      params = token &&
        Object.assign({}, params, {
          token: token
        });
      url += jointParams(params, isContains);
    }

    return instance.request({
      method: "post",
      url,
      data,
      headers: {
        "Content-Type": contentType || "application/json"
      },
      responseType: responseType
    });
  },
  /**
   * get请求
   * @param {*} url 请求地址
   * @param {*} params 参数
   */
  get(url, params = {}, responseType) {
    return instance.request({
      method: "get",
      url,
      params,
      responseType: responseType
    });
  },

  /**
   * post from data 请求
   * @param {*} url 请求地址
   */
  postFormData(url, params) {
    let res = Util.translateParams(params);
    return instance.request({
      method: "post",
      url,
      data: res,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    });
  }
};