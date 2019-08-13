/*!
*项目启动文件 
*2019-08-13 14:02:04 
*yangmx
*/
import Vue from "vue";
import App from "./App.vue";
import Axios from "axios";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import "./assets/css/common.css";
import "./assets/font/iconfont.css";
import "./assets/css/reset-element-ui.css";
import locale from "element-ui/lib/locale";
import enLocale from "element-ui/lib/locale/lang/en";
import zhLocale from "element-ui/lib/locale/lang/zh-CN";
import router from "./router";
import VueRouter from "vue-router";
import VueFriendlyIframe from "vue-friendly-iframe";
import VueI18n from "vue-i18n";
import "./filter";
import store from "./vuex/store";
import "./config";
import { resetRouter } from "./router";
import BaseModel from "@/components/common/baseModel/baseModel";
import ImgPreview from "@/components/common/imgPreview/index";

Vue.prototype.$axios = Axios;
Vue.config.productionTip = false;
Vue.use(ElementUI, {
  size: "small"
});
Vue.use(VueRouter);
Vue.use(VueI18n);
Vue.component("vue-friendly-iframe", VueFriendlyIframe);
Vue.use(BaseModel);
Vue.use(ImgPreview);

import lanData from "../public/mock/lan";
import util from "./util";

let messages = lanData;
Object.assign(messages.zh, zhLocale);
Object.assign(messages.en, enLocale);

const i18n = new VueI18n({
  locale: "zh", // 语言标识
  messages: messages,
  silentTranslationWarn: true
});
locale.i18n((key, value) => i18n.t(key, value));

// 全局路由守卫
router.beforeEach((to, from, next) => {
  //userDetail是login页面存入的，如果没有该值，说明用户没有登录或者其他操作导致localStorage数据被清除，无法进行进一步操作，需要返回到login页面
  let userInfo = window.sessionStorage.getItem("userDetail");
  if (!userInfo) {
    window.sessionStorage.clear();
  }
  let zl_token = window.sessionStorage.getItem("saas_token");
  let xys_token = window.sessionStorage.getItem("_TOKEN_COOKIE");
  if (!zl_token && !xys_token) {
    if (
      to.path == "/login" ||
      to.path == "/forgetPwd" ||
      to.path == "/alipayLogin"
    ) {
      next();
    } else {
      next("/login");
    }
  } else {
    let curSchool = window.sessionStorage.getItem("saas_currentSchool");
    // 机构code
    let code = window.sessionStorage.getItem("code");
    let menuList = window.sessionStorage.getItem("menu_list");

    let oldSchool = store.state.lastSchoolInfo;
    let oldCode = store.state.code;
    if (
      (curSchool && curSchool == oldSchool) ||
      (code && menuList && code == oldCode)
    ) {
      next();
    } else {
      //刷新页面或者切换学校、集团时
      //获取记录的路由
      let recordRoutePath = to?to.path:"";
      //获取学校信息进而获取菜单信息，生成路由配置，跳转默认配置
      util.getMenuList().then(() => {
        let menuList = JSON.parse(window.sessionStorage.getItem("menu_list"));
        store.commit("CODE", code);
        store.commit(
          "setLastSchoolInfo",
          window.sessionStorage.getItem("saas_currentSchool")
        );
        let dynamicEoutes = util.getDynamicRoutes(menuList);
        resetRouter();
        store.commit("SET_NAVS", menuList);
        //有权限
        if (dynamicEoutes && dynamicEoutes.length) {
          router.addRoutes([{
            path: "/eduplus",
            component: require("./components/common/menu.vue").default,
            children: dynamicEoutes,
            redirect: dynamicEoutes[0].path
          }]);
          //记录的路由存在并且在新生成的路由配置里面存在（切换学校时记录的toPath == ‘/xx’也不存在，默认跳首页）
          let isExistInConf = util.isExistPathInRouterConf(dynamicEoutes,recordRoutePath)
          if(recordRoutePath && isExistInConf){
            next(recordRoutePath);
          }
          else{
            next(dynamicEoutes[0].path);
          }
        } else {
          router.addRoutes([{
            path: "/eduplus",
            redirect: "/eduplus",
            component: require("./components/common/menu.vue").default,
            children: [{
              path: "/eduplus",
              redirect: "/eduplus/withoutPermission",
              component: require("./components/common/leftMenu.vue")
                .default,
              children: [{
                path: "/eduplus/withoutPermission",
                component: require("./components/common/noservice.vue")
                  .default
              }]
            }]
          }]);
          store.commit("SET_NAVS", []);
          next("/eduplus/withoutPermission");
        }
      });
    }
  }
});
window.webapp = new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount("#app");