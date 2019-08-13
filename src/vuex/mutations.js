export default {
  loading(state) {
    state.loading = true;
  },
  unloading(state) {
    state.loading = false;
  },
  SET_NAVS(state, payload) {
    state.navs = payload;
  },
  setLastSchoolInfo(state, schoolInfo) {
    state.lastSchoolInfo = schoolInfo;
  },
  // 设置上次的学校code
  CODE(state, payload) {
    state.code = payload;
  },
  setNewsNumber(state, newsNumber) {
    state.newsNumber = newsNumber;
  },
  addorReduceNewsNumber(state, flag) {
    if (flag) {
      state.newsNumber += 1;
    } else {
      state.newsNumber -= 1;
    }
  },
  addorReduceToastNumber(state, flag) {
    if (flag) {
      state.toastNumber += 1;
    } else {
      state.toastNumber -= 1;
    }
  },
  SET_BATCHMANAGE(state, flag) {
    state.isBatchManage = flag;
  }
};
