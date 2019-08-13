<template>
  <div class="appDialog">
    <div class="myApp">我的应用</div>
    <div class="appList">
      <div
        class="appItem"
        v-for="item in $store.state.navs.filter(n => n.type == '1' && n.isResident === '0')"
        :key="item.id"
        @click="goApp(item)"
      >
        <!-- <span :class="item.icon"></span> -->
        <svg-icon :icon-class="item.icon"></svg-icon>
        <span v-if="!item.name.includes('new')" class="name">{{$t(item.name)}}</span>
        <el-badge v-if="item.name.includes('new')" value="new" class="item name">
          <span class="name">{{$t(item.name.replace(/new/,''))}}</span>
        </el-badge>
      </div>
      <!-- <div class="appItem" @click="goAllApp">
        <span class="iconfont icon-gengduo"></span>
        <span class="all">查看全部>></span>
      </div>-->
    </div>
    <!-- <div class="recommend">
      <div class="title">
        <div></div>
        <span>应用推荐</span>
      </div>
      <div class="content">
        <div class="recommendItem" v-for="item in recommend" :key="item.title">
          <img :src="item.imgUrl" alt="加载中...">
          <div class="bottom">
            <div class="title">{{item.title}}</div>
            <div class="desc">{{item.desc}}</div>
            <div class="price">
              <span>{{item.price}}</span>元/年起
            </div>
          </div>
          <el-button type="primary" size="small">查看</el-button>
        </div>
      </div>
    </div>-->
    <el-button
      type="primary"
      size="small"
      class="appMarket"
      @click="goToAppManage"
    >应用菜单设置>></el-button>
  </div>
</template>

<script>
import SvgIcon from '@/components/common/SvgIcon'
export default {
  components: { SvgIcon },
  name: "myAppDialog",
  data() {
    return {
      navs: [],
      recommend: [
        {
          imgUrl: require("../../assets/app/recommend1.png"),
          title: "营养膳食",
          desc: "合理搭配营养膳食，让家长放心。",
          price: "2400"
        },
        {
          imgUrl: require("../../assets/app/recommend2.png"),
          title: "应用标题占位",
          desc: "合理搭配营养膳食，说明文字最长20字符合理搭配营养膳食",
          price: "2400"
        }
      ]
    };
  },
  mounted() {
    this.navs = this.$root.navs;
  },
  methods: {
    goApp(item) {
      this.$router.push(`/eduplus${item.path}`);
    },
    goAllApp() {
      this.$router.push(`/eduplus/app/allApp`);
    },
    goToAppManage() {
      this.$router.push("/eduplus/app/menuSetting");
    }
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
.recommend {
  > .title {
    font-size: 14px;
    color: #333;
    display: flex;
    flex-direction: row;
    align-items: center;
    > div {
      border-left: 3px solid #008eff;
      height: 12px;
      margin-right: 8px;
    }
  }
  > .content {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-top: 20px;
    .recommendItem {
      width: 261px;
      height: 234px;
      border: 1px solid #e7eaec;
      position: relative;
      img {
        height: 130px;
      }
      > .bottom {
        margin: 10px;
        > .title {
          font-size: 14px;
          color: #333;
        }
        > .desc {
          font-size: 12px;
          color: #666;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        > .price {
          margin-top: 10px;
          > span {
            font-size: 20px;
            color: #333;
          }
        }
      }
      > button {
        position: absolute;
        bottom: 10px;
        right: 10px;
      }
    }
  }
}
.appMarket {
  float: right;
  margin: 10px 0px;
}
</style>
