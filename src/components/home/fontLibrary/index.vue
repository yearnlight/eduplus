<template>
  <div class="fontLibrary">
    <ul class="icon-list">
      <li v-for="(item,index) in fontGroup" :key="index">
        <span>
          <i :class="`iconfont ${item}`"></i>
          <span class="name">{{item}}</span>
        </span>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  data() {
    return {
      fontGroup: []
    };
  },
  created() {
    this.getFontLibrary();
  },
  methods: {
    getFontLibrary() {
      let href = "https://at.alicdn.com/t/font_1212258_ut5lyp434ac.css";
      this.$axios.get(href).then(res => {
        let libraryStr = res.data;
        let fontArr = libraryStr.match(/icon-[a-zA-Z]+:before/g);
        let fonts = [];
        fontArr.forEach(item => {
          fonts.push(item.substring(0, item.length - 7));
        });
        this.fontGroup = fonts;
      });
    }
  }
};
</script>

<style lang="scss">
.fontLibrary {
  height: 100%;
  font-size: 26px;
  color: #999;
  overflow-x: hidden;
  overflow-y: auto;
  .icon-list {
    overflow: hidden;
    list-style: none;
    padding: 0;
    border: 1px solid #eaeefb;
    border-radius: 4px;
    &:not(.timeline) {
      margin: 10px 0;
      font-size: 14px;
      color: #5e6d82;
      line-height: 2em;
    }
    li {
      float: left;
      width: 16.66%;
      text-align: center;
      height: 120px;
      line-height: 120px;
      color: #666;
      font-size: 13px;
      transition: color 0.15s linear;
      border-right: 1px solid #eee;
      border-bottom: 1px solid #eee;
      margin-right: -1px;
      margin-bottom: -1px;
      span {
        display: inline-block;
        line-height: normal;
        vertical-align: middle;
        font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB,
          Microsoft YaHei, SimSun, sans-serif;
        color: #99a9bf;
        i {
          display: block;
          font-size: 32px;
          margin-bottom: 15px;
          color: #606266;
        }
        .name {
          display: inline-block;
          padding: 0 3px;
          height: 1em;
          color: #606266;
        }
      }
    }
  }
}
</style>
