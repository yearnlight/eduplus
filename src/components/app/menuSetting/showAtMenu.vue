<template>
  <div class="appDialog">
    <div class="myApp">我的应用</div>
    <div class="appList">
      <div class="appItem" v-for="item in showAtMenu" :key="item.id">
       <svg-icon  :icon-class="item.icon"></svg-icon>
        <span class="name">{{$t(item.name)}}</span>
      </div>
    </div>
  </div>
</template>

<script>
import SvgIcon from '@/components/common/SvgIcon' 
export default {
  components:{SvgIcon},
  props: {
    showAtMenu: {
      type: Array,
      required: true
    }
  },
  name: "showAtMenu",
  data() {
    return {
      navs: []
    };
  },
  mounted() {
    this.navs = this.$root.navs;
  }
};
</script>

<style lang="scss" scoped>
.appDialog {
  padding: 0px 12px;
}
.myApp {
  height: 56px;
  border-bottom: 1px solid #e7eaec;
  font-size: 18px;
  line-height: 56px;
}
.appList {
  display: flex;
  flex-direction: row;
  align-items: center;
  flex-wrap: wrap;
  margin: 10px 0px;
  > .appItem {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 10px 0px;
    cursor: pointer;
    flex: 0 0 80px;
    > span,
    i {
      font-size: 32px;
    }
    > .name {
      font-size: 14px;
      margin-top: 8px;
      color: #333333;
    }
    > .all {
      font-size: 14px;
      color: #999999;
    }
  }
}
.icon-gengduo {
  color: #999999;
}
</style>
