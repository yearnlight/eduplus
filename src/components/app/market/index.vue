<template>
  <div class="market">
    <div class="market-combo">
      <div class="market-combo-header">组合套餐</div>
      <div class="market-combo-content">
        <el-card v-for="(item,index) in combos" :key="index" :body-style="{ padding: '0px' }">
          <img src="../../../assets/combo.jpg" class="image">
          <div class="info">
            <span class="info-name">{{item.name}}</span>
            <div class="info-desc">{{item.desc}}</div>
            <div class="bottom clearfix">
              <span class="info-price">{{ item.price }}</span>
              <span class="info-suffix">起</span>
              <el-button @click="toDetail(item)" size="mini" type="primary" class="button info-view">查看</el-button>
            </div>
          </div>
        </el-card>
      </div>
    </div>
    <div class="market-app">
      <div class="market-app-header">应用</div>
      <div class="market-app-content">
        <el-card v-for="(item,index) in combos" :key="index" :body-style="{ padding: '0px' }">
          <img src="../../../assets/app.png" class="image">
          <div class="info">
            <span class="info-name">{{item.name}}</span>
            <div class="info-desc">{{item.desc}}</div>
            <div class="bottom clearfix">
              <span class="info-price">{{ item.price }}</span>
              <span class="info-suffix">起</span>
              <el-button @click="toDetail(item)" size="mini" type="primary" class="button info-view">查看</el-button>
            </div>
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      combos: [
        {
          name: "套餐1",
          desc: "幼儿园标准套餐组合",
          price: "2800元/年",
          img: "",
          id: "1"
        },
        {
          name: "套餐2",
          desc: "幼儿园标准套餐组合",
          price: "2800元/年",
          img: "",
          id: "2"
        },
        {
          name: "套餐3",
          desc: "幼儿园标准套餐组合",
          price: "2800元/年",
          img: "",
          id: "3"
        },
        {
          name: "套餐4",
          desc: "幼儿园标准套餐组合",
          price: "2800元/年",
          img: "",
          id: "4"
        },
        {
          name: "套餐5",
          desc: "幼儿园标准套餐组合",
          price: "2800元/年",
          img: "",
          id: "5"
        }
      ]
    };
  },
  methods:{
      toDetail(item){
          this.$router.push({path:"/eduplus/app/market/detail",query:{appId:item.id}});
      }
  }
};
</script>

<style lang="scss">
$primary: #0099ff;
%app {
  background-color: #ffffff;
  padding: 15px;
  display: flex;
  flex-direction: column;
}
%header {
  display: flex;
  justify-content: flex-start;
  padding: 5px;
}

%content {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  .el-card {
    width: 200px;
    height: 218px;
    border-radius: 0;
    margin: 5px;
    .info {
      padding: 10px;
      text-align: left;
      &-name {
        font-size: 16px;
        color: $primary;
        font-weight: 600;
      }
      &-desc {
        font-size: 12px;
        color: #00000072;
        padding: 5px 0;
      }
      &-price {
        color: $primary;
        font-weight: 400;
      }
      &-suffix {
        color: $primary;
        font-size: 12px;
      }

      &-view {
        float: right;
      }
    }

    img {
      height: 100%;
      width: 100%;
    }
  }
}
.market {
  overflow-y: auto;
  &-combo {
    @extend %app;
    &-header {
      @extend %header;
    }
    &-content {
      @extend %content;
    }
  }

  &-app {
    @extend %app;
    margin: 10px 0;
    &-header {
      @extend %header;
    }
    &-content {
      @extend %content;
    }
  }
}
</style>

