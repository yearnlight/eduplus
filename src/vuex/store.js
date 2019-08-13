import Vue from "vue";
import Vuex from "vuex";
import mutations from "./mutations.js";
import getters from "./getters";
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    loading: false,
    currentNotDing: true,
    currentPufa: false,
    lastSchoolInfo: "",
    navs: [],
    code: "",
    newsNumber: 0,
    toastNumber: 0,
    isBatchManage: false
  },
  mutations: mutations,
  actions: {},
  getters
});
