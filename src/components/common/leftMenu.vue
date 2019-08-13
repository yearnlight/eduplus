<template>
  <el-container>
    <el-scrollbar :class="{ notCollapse: !isCollapse, isCollapse: isCollapse }">
      <el-aside width="100%">
        <el-menu :default-openeds="open_list" router :default-active="$route.path" :collapse="isCollapse" text-color="#444" active-text-color="#0086F4" :unique-opened="true" @select="menuSelected">
          <el-submenu v-if="item.children && item.type === '1' && !item.noPermission" :index="`${mIndex}`" v-for="(item, mIndex) in menus" :key="mIndex">
            <template slot="title">
              <i :class="item.icon"></i>
              <span>{{ $t(item.name) }}</span>
            </template>
            <el-menu-item :index="`/eduplus${child.path}`" v-for="child in item.children" :key="child.id" v-if="child.type === '1'">
              <i class="icon iconfont icon-dot"></i>
              <span slot="title">{{ $t(child.name) }}</span>
            </el-menu-item>
          </el-submenu>

          <el-menu-item :class="{
              active: $route.path.includes(item.path),
              'no-active': !$route.path.includes(item.path)
            }" v-if="!item.children && !item.hide && item.type === '1'" :index="`/eduplus${item.path}`" v-for="item in menus" :key="item.id">
            <i :class="item.icon"></i>
            <span slot="title">{{ $t(item.name) }}</span>
          </el-menu-item>
        </el-menu>
        <div class="exclusive_logo_box" v-if="exclusiveLogo">
          <img class="exclusive_logo" :src="exclusiveLogo" height="38" width="180" alt="logo" />
        </div>
      </el-aside>
    </el-scrollbar>
    <el-container>
      <div class="sys-content">
        <div class="sys-content-breadcrumb">
          <el-breadcrumb class="sys-content-breadcrumb" separator="/">
            <el-breadcrumb-item v-for="(item, index) in crumbs" :key="index">
              <span class="crumb-path" v-if="index < crumbs.length - 1" @click="goToCrumbRoute(item.path)">{{ item.name }}</span>
              <span class="crumb-cur" v-else>{{ $t(item.name) }}</span>
            </el-breadcrumb-item>
          </el-breadcrumb>
          <span class="service-phone">客服电话 400-006-9898</span>
          <span @click="toBack" class="return-router"></span>
        </div>

        <router-view :key="refreshRouterKey" class="sys-content-page">></router-view>
      </div>
    </el-container>
  </el-container>
</template>

<script>
import bus from "@/bus";
import { mapMutations, mapGetters } from "vuex";

export default {
  watch: {
    $route: {
      handler(n, o) {
        if (n.path && n.path != o.path && n.path != "/login") {
          this.initLeftMenu();
        }
      }
    },
    navs() {
      this.initLeftMenu();
    }
    // "$i18n.locale": {
    //   handler(n, o) {
    //     this.initLeftMenu();
    //   }
    // }
  },
  data() {
    return {
      open_list: ["0"],
      isCollapse: false,
      menus: [],
      crumbs: [],
      crumbName: "",
      exclusiveLogo: "",
      refreshRouterKey: "",
      reloadCode: 0
    };
  },
  created() {
    let _self = this;
    _self.initLeftMenu();
    bus.$on("isCollapse", state => {
      this.isCollapse = state;
    });
  },
  computed: {
    ...mapGetters(["GET_ISBATCHMANAGE"]),
    navs() {
      return this.$store.state.navs;
    }
  },
  methods: {
    ...mapMutations(["SET_BATCHMANAGE"]),
    getRefreshKey() {
      let refreshRouterKey =
        (this.getSStorage("saas_currentSchool") &&
          this.getSStorage("saas_currentSchool").schoolId) ||
        this.getSg("code") ||
        this.getSg("groupCode");
      this.reloadCode = new Date().valueOf();
      return `${refreshRouterKey}-${this.reloadCode}`;
    },
    menuSelected() {
      //点击本身刷新自身组件
      if (this.$route.path == arguments[0]) {
        //重置刷新码，刷新右侧内容
        this.refreshRouterKey = this.getRefreshKey();
      }
    },
    initLeftMenu() {
      let _self = this;
      //渲染左侧导航
      _self.menus = [];
      //一级菜单路由名称
      let level1Path = `/${_self.$route.path.split("/")[2]}`;
      _self.navs.forEach(n => {
        if (level1Path == n.path) {
          _self.menus = n.children || [];
          _self.$root.menus = n.children || [];
          _self.getCrumbs();
        }
      });
      let curSchool = this.getSStorage("saas_currentSchool");
      if (null != curSchool) {
        _self.exclusiveLogo = curSchool.logo;
      } else {
        _self.exclusiveLogo = null;
      }
      //有菜单或者路由为没权限时需要刷新页面（router-view）
      if (
        _self.navs.length > 0 ||
        this.$route.path == "/eduplus/withoutPermission"
      ) {
        //重置刷新码，刷新右侧内容
        this.refreshRouterKey = this.getRefreshKey();
      }
    },
    getCrumbName(navs, path) {
      if (navs && navs.length) {
        for (let i = 0; i < navs.length; i++) {
          let item = navs[i];
          // if (path.includes(item.path) || item.path.includes(path)) {
          if (item.path == path) {
            this.crumbName = item.name;
            break;
          } else {
            if (item.children && item.children.length) {
              this.getCrumbName(item.children, path);
            }
          }
          // } else {
          //   continue;
          // }
        }
      }
    },
    goToCrumbRoute() {
      if (arguments[0]) {
        this.$router.push(arguments[0]);
      }
    },
    getCrumbs() {
      let _self = this;
      //根据路由生成当前面包屑
      let curRouterPath = this.$route.path;
      let paths = curRouterPath.split("/").slice(2);
      this.crumbs.length = 0;
      let routePath = "";
      if (paths && paths.length) {
        paths.forEach(p => {
          routePath += `/${p}`;
          this.getCrumbName(_self.navs, routePath);
          this.crumbs.push({
            path: `/eduplus${routePath}`,
            name: this.$t(this.crumbName)
          });
          this.$root.crumbs = this.crumbs;
        });
      }
    },
    toBack() {
      if (!this.$route.path.includes("/eduplus")) {
        return;
      }
      if (this.GET_ISBATCHMANAGE) {
        this.SET_BATCHMANAGE(false);
        this.$router.go(0);
      } else {
        this.SET_BATCHMANAGE(false);
        this.$router.go(-1);
      }
    }
  },
  beforeDestroy() {
    bus.$off("left-menus");
  }
};
</script>

<style lang="scss">
.el-container .sys-menu .sys-content /deep/ .el-breadcrumb {
  background-color: #ffffff !important;
  padding-left: 24px !important;
  margin-bottom: 0px !important;
  font-size: 12px;
  display: flex;
  align-items: center;
  box-shadow: 0 2px 3px -6px #ddd;
}
.isCollapse {
  max-width: 64px;
  width: 64px;
  box-shadow: 0px 4px 10px #ddd;
}

.notCollapse {
  min-width: 184px;
  width: 184px;
  box-shadow: 0px 4px 10px #ddd;
}

.el-aside {
  .el-menu {
    height: 100%;
    text-align: left;
    .el-menu-item {
      min-width: 100%;
      height: 40px;
      line-height: 40px;
      > span {
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        text-align: left;
        width: 100px;
        display: inline-block;
      }
      > i.iconfont {
        margin: 0 5px;
      }
      &.is-active {
        background-color: #eff7fe !important;
      }
      &.active,
      &.is-active {
        // &::before {
        //   content: "";
        //   display: inline-block;
        //   position: absolute;
        //   left: 0;
        //   width: 4px;
        //   height: 100%;
        //   background: #008EFF;
        // }
        color: #ffffff;
        .iconfont {
          color: #0086f4 !important;
        }
      }
      &.no-active {
        color: #444;
        .iconfont {
          color: #9e9e9e !important;
        }
      }
    }
  }

  .el-submenu {
    i.iconfont {
      margin: 0 5px;
    }
  }
  .exclusive_logo_box {
    width: 180px;
    position: fixed;
    left: 0;
    bottom: 24px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
