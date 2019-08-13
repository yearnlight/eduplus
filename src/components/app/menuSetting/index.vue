<template>
  <div class="application">
    <div class="menuSetting">
      <div class="showAtHome">
        <div class="title">
          显示在首页
          <span>（最多显示6项）</span>
        </div>
        <footer>
          <draggable v-model="showAtHome" group="app" @start="drag=true" @end="homeEnd">
            <div v-for="element in showAtHome" class="app" id="showAtHome" :key="element.name">
              <svg-icon class="app-icon-size" :icon-class="element.icon"></svg-icon>
              <div class="name">{{$t(element.name)}}</div>
            </div>
          </draggable>
        </footer>
      </div>
      <div class="shawAtMenu">
        <div class="title">显示在菜单</div>
        <footer>
          <draggable
            v-model="showAtMenu"
            group="app"
            @start="drag=true"
            @end="menuEnd"
            :move="onMove"
          >
            <div v-for="element in showAtMenu" class="app" id="shawAtMenu" :key="element.name">
              <svg-icon :icon-class="element.icon"></svg-icon>
              <div class="name">{{$t(element.name)}}</div>
            </div>
          </draggable>
        </footer>
        <div v-if="showGuide" class="guide">
          <img src="../../../assets/image/menuSetting/guide.png" alt />
          <div class="guideTip">将应用图标拖拽至左侧即可添加至菜单</div>
        </div>
      </div>
    </div>
    <!-- <preview :showAtHome="showAtHome" :showAtMenu="showAtMenu"></preview>
    <div class="save">
      <el-button size="mini" @click="cancel">取消</el-button>
      <el-button type="primary" size="mini" @click="saveMenu">保存</el-button>
    </div>-->
  </div>
</template>

<script>
import draggable from "vuedraggable";
import preview from "./preview";
import { setTimeout, clearTimeout } from "timers";
import { debuglog } from "util";
import SvgIcon from "@/components/common/SvgIcon";
import { mapMutations } from "vuex";

export default {
  name: "MyApplication",
  data() {
    return {
      navs: [],
      showAtHome: [],
      showAtMenu: [],
      showGuide: true
    };
  },
  mounted() {
    this.navs = this.$store.state.navs;
    this.showAtHome = this.navs.filter(item => {
      return item.isResident === "1" && item.type === "1";
    });
    this.showAtMenu = this.navs.filter(item => {
      return item.isResident === "0" && item.type === "1";
    });
    setTimeout(() => {
      this.showGuide = false;
    }, 4000);
  },
  methods: {
    ...mapMutations(["SET_NAVS"]),
    onMove(e) {
      // 首页已经有6个并且还在往首页拖动，就禁止生效，并提示
      if (this.showAtHome.length >= 6 && e.to.firstChild.id === "showAtHome") {
        if (this.excel) {
          clearTimeout(this.excel);
        }
        this.excel = setTimeout(() => {
          this.$message.error("首页最多显示6项");
        }, 500);
        return false;
      }
    },
    homeEnd() {
      let arr = this.getConcatMenu();
      let showArr = [],
        hideArr = [];
      arr.forEach(item => {
        this.navs.forEach(nav => {
          if (item.id === nav.id) {
            nav.isResident = item.isResident;
            showArr.push(nav);
          }
        });
      });

      this.navs.forEach(nav => {
        let flag = true;
        showArr.forEach(showItem => {
          if (nav.id === showItem.id) {
            flag = false;
          }
        });
        if (flag) {
          hideArr.push(nav);
        }
      });

      this.navs = [...showArr, ...hideArr];
      this.SET_NAVS(this.navs);
      this.saveMenu();
    },
    menuEnd() {
      let arr = this.getConcatMenu();
      let showArr = [],
        hideArr = [];
      arr.forEach(item => {
        this.navs.forEach(nav => {
          if (item.id === nav.id) {
            nav.isResident = item.isResident;
            showArr.push(nav);
          }
        });
      });

      this.navs.forEach(nav => {
        let flag = true;
        showArr.forEach(showItem => {
          if (nav.id === showItem.id) {
            flag = false;
          }
        });
        if (flag) {
          hideArr.push(nav);
        }
      });

      this.navs = [...showArr, ...hideArr];
      this.SET_NAVS(this.navs);
      this.saveMenu();
    },
    saveMenu() {
      let settingParam = [];
      let schoolId =
        this.getSStorage("saas_currentSchool") &&
        this.getSStorage("saas_currentSchool").schoolId;
      let orgId = this.getSg("code") || this.getSg("groupCode");
      this.getConcatMenu().forEach((item, index) => {
        settingParam.push({
          schoolId,
          orgId,
          menuId: item.id,
          sortNo: index,
          isResident: item.isResident
        });
      });

      let url = orgId
        ? this.$url.zlurl.addMenuManage + "?orgId=" + orgId
        : this.$url.zlurl.addMenuManage;
      this.$http.post(url, {}, settingParam).then(res => {
        if (res.rtnCode === "0000000") {
          // this.$message.success("设置成功！");
          // setTimeout(() => {
          //   location.reload();
          // }, 1000);
        }
      });
    },
    getConcatMenu() {
      let arr = [];
      this.showAtHome.forEach(item => {
        arr.push({
          id: item.id,
          isResident: "1"
        });
      });
      this.showAtMenu.forEach(item => {
        arr.push({
          id: item.id,
          isResident: "0"
        });
      });
      return arr;
    },
    cancel() {
      this.$router.go(-1);
    }
  },
  components: {
    draggable,
    preview,
    SvgIcon
  }
};
</script>

<style lang="scss" scoped>
.application {
  background-color: #f2f2f2 !important;
  padding: 0px !important;
  .menuSetting {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    footer {
      > div {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        width: 100%;
        min-height: 60px;
        > .app {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          margin: 40px 15px;
          width: 60px;
          cursor: move;
        }
        .name {
          font-size: 14px;
          color: #333;
          text-align: center;
          margin-top: 10px;
        }
        span {
          font-size: 32px;
        }
      }
    }
    > div {
      // border: 1px solid #dcdfe6;
      position: relative;
      background-color: #fff;
      width: calc(50% - 10px);
      > .title {
        height: 54px;
        line-height: 54px;
        border-bottom: 1px solid #dcdfe6;
        color: #333;
        font-size: 18px;
        padding-left: 24px;
        > span {
          font-size: 16px;
          color: #666;
        }
      }
    }
  }
}
.save {
  position: absolute;
  top: 345px;
  right: 30px;
  text-align: right;
  > button {
    width: 64px;
    height: 32px;
    margin: 5px;
  }
}
.guide {
  animation: guideAnimation 2s;
  // animation-direction: alternate;
  animation-iteration-count: 2;
  display: flex;
  flex-direction: row;
  position: absolute;
  bottom: -57px;
  height: 94px;
  left: 10px;
  align-items: center;
  > img {
    width: 94px;
  }
  > div {
    font-size: 19px;
    color: #0084ff;
    font-weight: bold;
  }
}
@keyframes guideAnimation {
  0% {
    left: 10px;
  }
  100% {
    left: -200px;
  }
}
</style>
