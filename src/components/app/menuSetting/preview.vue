<template>
  <div class="preview">
    <div class="title">实时预览</div>
    <div class="main">
      <div class="content">
        <el-menu
          class="el-menu-demo"
          mode="horizontal"
          background-color="#008EFF"
          text-color="#fff"
        >
          <el-menu-item
            v-for="item in showAtHome"
            :key="item.name"
            :index="item.name"
          >{{$t(item.name)}}</el-menu-item>
        </el-menu>
        <el-popover
          class="popover"
          v-model="visible"
          placement="bottom"
          width="594"
          trigger="manual"
        >
          <showAtMenu :showAtMenu="showAtMenu"></showAtMenu>
          <div class="moreApp" slot="reference">
            <span class="iconfont icon-more icon"></span>
            <span>更多应用</span>
          </div>
        </el-popover>
      </div>
    </div>
  </div>
</template>

<script>
import showAtMenu from "./showAtMenu";
import { setTimeout } from "timers";
export default {
  props: {
    showAtHome: { type: Array, required: true },
    showAtMenu: {
      type: Array,
      required: true
    }
  },
  name: "preview",
  data() {
    return {
      visible: false
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.visible = true;
    });
  },
  components: {
    showAtMenu
  }
};
</script>

<style lang="scss" scoped>
.preview {
  background-color: #fff;
  // border: 1px solid #dcdfe6;
  margin-top: 24px;
  height: 400px;
}
.title {
  height: 56px;
  line-height: 56px;
  font-size: 18px;
  color: #333;
  padding-left: 24px;
  border-bottom: 1px solid #dcdfe6;
}
.content {
  background-color: #008eff;
  display: flex;
  flex-direction: row;
  align-items: center;
  position: relative;
  .el-menu-demo {
    width: 600px;
    border-bottom: none;
  }
}
.main {
  padding: 50px;
  padding-bottom: 120px;
  background-color: #eee;
  margin: 20px;
}
.popover {
  color: #fff;
  position: absolute;
  right: 10px;
}
.icon {
  font-size: 18px;
}
</style>
