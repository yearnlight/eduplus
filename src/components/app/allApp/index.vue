<template>
  <div class="allApp">
    <div class="app" v-for="item in allApp" :key="item.name">
      <header>
        <div class="icon">
          <span class="iconfont icon-food"></span>
        </div>
        <div class="info">
          <div class="name">{{item.name}}</div>
          <div class="valid">{{item.valid}}</div>
          <div class="version">{{item.version}}</div>
        </div>
      </header>
      <footer>
        <div class="setting">功能设置</div>
        <div class="record" @click="record">购买记录</div>
      </footer>
    </div>
  </div>
</template>

<script>
export default {
  name: "allApp",
  data() {
    return {
      allApp: [
        {
          icon: "",
          name: "物资管理",
          valid: "2019-05-06",
          version: "幼教-集团版"
        }
      ]
    };
  },
  mounted() {
    for (let i = 0; i < 10; i++) {
      let arr = Object.assign({}, this.allApp[0]);
      arr.name = arr.name + i;
      this.allApp.push(arr);
    }
  },
  methods: {
    record() {
      this.$router.push("/eduplus/app/orderForApplication");
    }
  },
  components: {}
};
</script>

<style lang="scss" scoped>
.allApp {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  .app {
    width: 260px;
    height: 151px;
    border: 1px solid #e7eaec;
    box-shadow: 0px 4px 6px 2px #eeeeee;
    margin: 15px;
    > header {
      display: flex;
      flex-direction: row;
      padding: 18px;
      box-sizing: border-box;
      height: 109px;
      > .icon {
        span {
          font-size: 32px;
        }
      }
      > .info {
        margin-left: 10px;
        > .name {
          font-size: 18px;
          color: #333;
        }
        > .valid {
          margin-top: 10px;
        }
        > .valid,
        .version {
          font-size: 12px;
          color: #666;
        }
      }
    }
    > footer {
      height: 42px;
      display: flex;
      flex-direction: row;
      background-color: #e7eaec;
      justify-content: space-around;
      align-items: center;
      font-size: 14px;
      > .setting {
        color: #008eff;
        cursor: pointer;
      }
      > .record {
        color: #666;
        cursor: pointer;
      }
    }
  }
}
</style>
