<template>
  <!-- <vue-friendly-iframe
    v-loading="loading"
    element-loading-text="加载中..."
    @load="loaded"
    :src="src"
  ></vue-friendly-iframe> -->
  <div class="vue-friendly-iframe" v-loading="loading" element-loading-text="加载中...">
    <iframe frameborder="0" crossorigin="anonymous" target="_parent" :src="src"></iframe>
  </div>
</template>

<script>
import { setTimeout, clearTimeout } from "timers";
export default {
  data() {
    return {
      src: "/saas/index.html",
      loading: true,
      timer: null,
      menuHref: ""
    };
  },
  watch: {
    $route(to, from) {
      let _self = this;
      //嵌入模块
      if (to.path) {
        _self.getCrumbHref(
          `/${to.path
            .split("/")
            .slice(2)
            .join("/")}`
        );
        //判断是知了还是校易收界面
        debugger;
        let src = "";
        let currentSchool = _self.getSStorage("saas_currentSchool");
        if (currentSchool && currentSchool.productCode == "xys") {
          src = `/xysweb/#/${_self.menuHref}`;
        } else {
          src = `/zlweb/#${_self.menuHref}`;
        }

        if (_self.menuHref.includes("/xysweb/#/")) {
          src = _self.menuHref;
        }

        if (_self.menuHref.includes("/zlweb/#/")) {
          src = _self.menuHref;
        }
        _self.src = src;
      }
    }
  },
  created() {
    let _self = this;
    if (this.$route.path) {
      _self.getCrumbHref(
        `/${_self.$route.path
          .split("/")
          .slice(2)
          .join("/")}`
      );
      //判断是知了还是校易收界面
      let src = "";
      let currentSchool = _self.getSStorage("saas_currentSchool");
      if (currentSchool && currentSchool.productCode == "xys") {
        src = `/xysweb/#/${_self.menuHref}`;
      } else {
        src = `/zlweb/#${_self.menuHref}`;
      }

      if (_self.menuHref.includes("/xysweb/#/")) {
        src = _self.menuHref;
      }

      if (_self.menuHref.includes("/zlweb/#/")) {
        src = _self.menuHref;
      }
      _self.src = src;
    }
  },
  mounted() {
    let _self = this;
    this.judgeJump();
    this.timer = setTimeout(() => {
      _self.loading = false;
    }, 2 * 1000);
  },
  methods: {
    // 消息中心跳转过来的
    judgeJump() {
      if (this.$route.query != {}) {
        const id = this.$route.query.id;
        const sourceType = this.$route.query.sourceType;
        if (id && sourceType) {
          const modalType = this.getSStorage("accountModalType");
          if (modalType == "isGroup") {
            // 机构
            if (sourceType == 1) {
              // sourceType 1 易耗品 2 固定资产
              this.src = `/zlweb/#/app/groupMaterialManagement/groupMaterialStorageForConsumableDetail?id=${id}&type=1&kind=modify&category=1`;
            } else {
              this.src = `/zlweb/#/app/groupMaterialManagement/groupMaterialStorageForConsumableDetail?id=${id}&type=1&kind=modify&category=2`;
            }
          } else {
            // 园所
            if (sourceType == 1) {
              // sourceType 1 易耗品 2 固定资产
              this.src = `/zlweb/#/app/materialsManage/updateConsumable?id=${id}&type=1&kind=modify&category=1`;
            } else {
              this.src = `/zlweb/#/app/groupMaterialManagement/groupMaterialStorageForFixedAssetsDetail?id=${id}&type=1&kind=modify&category=2`;
            }
          }
        }
      }
    },
    getCrumbHref(path, source) {
      let navs = source || this.$root.menus;
      if (navs && navs.length) {
        for (let i = 0; i < navs.length; i++) {
          let item = navs[i];
          if (item.path == path) {
            this.menuHref = item.href;
            break;
          } else {
            if (item.children && item.children.length) {
              this.getCrumbHref(path, item.children);
            }
          }
        }
      }
    },
    loaded() {
      let _self = this;

      let innerFrame = document.getElementsByClassName(
        "vue-friendly-iframe"
      )[0];
      if (innerFrame) {
        this.timer = setTimeout(() => {
          // let childWindow = innerFrame.childNodes[0].contentWindow;
          // let childDoc = childWindow.document;

          // innerFrame.height =
          //   childDoc.documentElement.scrollHeight || childDoc.body.scrollHeight;

          _self.loading = false;
        }, 2 * 1000);
      }
    }
  },
  destroyed() {
    if (this.timer) {
      clearTimeout(this.timer);
    }
  }
};
</script>

<style scoped>
.statistics {
  height: 100%;
  width: 100%;
}
.el-container .sys-menu .sys-content-page {
  background-color: #ffffff;
  margin: 16px;
  overflow-y: hidden;
  padding: 0px !important;
  /* height: calc(100% - 72px); */
}
</style>
