<template>
  <div id="app">
    <router-view :key="$route.path == '/login' && (new Date()).valueOf()"></router-view>
  </div>
</template>

<script>
import Menu from "./components/common/menu.vue";

export default {
  name: "app",
  components: {
    Menu
  }
};
</script>

<style lang="scss">
html,
body {
  height: 100%;
  margin: 0;
  padding-right: 0 !important;
  overflow: hidden;
  background-color: #f2f2f2;
  #app {
    font-family: "Avenir", Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    // text-align: center;
    height: 100%;
    color: #2c3e50;
  }

  %red {
    color: #f56c6c;
  }
  %green {
    color: #67c23a;
  }
  %blue {
    color: #409eff;
  }
  %orange {
    color: #e6a23c;
  }
  .red {
    @extend %red;
  }
  .green {
    @extend %green;
  }
  .blue {
    @extend %blue;
  }
  .orange {
    @extend %orange;
  }
}
</style>
