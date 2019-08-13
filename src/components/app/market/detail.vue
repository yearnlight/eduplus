<template>
  <div class="market-detail">
    <div class="market-detail-header">
      <div class="market-detail-header-name">物资管理</div>
      <div class="market-detail-header-desc">轻松管理校园公共物资</div>
    </div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="功能介绍" name="info">
        <div class="info">
          <div class="info-v" v-for="(item,index) in vs" :key="index">
            <div class="info-v-poster">{{item.version}}</div>
            <el-button
              :disabled="!item.inline"
              size="mini"
              type="primary"
            >{{item.inline?"立即购买":"即将上线"}}</el-button>
          </div>
          <div class="info-cdkey">
            <div class="info-cdkey-title">使用兑换码</div>
            <el-form
              ref="cdkeyform"
              :rules="rules"
              name="cdkeyform"
              :model="cdkeyform"
              class="info-cdkey-operate"
            >
              <el-form-item prop="cdkey">
                <el-input size="small" v-model="cdkeyform.cdkey" placeholder="输入兑换码"/>
                <el-button @click="submitCDkey('cdkeyform')" size="small" type="primary">提交</el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane class="matter" label="常见问题" name="matter">
        <el-collapse v-model="activeMatter" accordion>
          <el-collapse-item name="1">
            <template slot="title">
              1.购买套餐无法组合选购
              <i class="el-icon-info"></i>
              <el-badge class="mark" :value="12"/>
            </template>
            <div>右上角参考操作说或者咨询客服，根据引导完成操作</div>
          </el-collapse-item>
          <el-collapse-item title="2.购买服务加载异常" name="2">
            <div>右上角参考操作说或者咨询客服，根据引导完成操作</div>
          </el-collapse-item>
          <el-collapse-item name="3">
            <template slot="title">
              3.收费二维码无法识别
              <i class="el-icon-info"></i>
              <el-badge class="mark" :value="3"/>
            </template>
            <div>右上角参考操作说或者咨询客服，根据引导完成操作</div>
          </el-collapse-item>
          <el-collapse-item title="4.设计完成响应时间过长" name="4">
            <div>右上角参考操作说或者咨询客服，根据引导完成操作</div>
          </el-collapse-item>
          <el-collapse-item title="5.客服久久不能回复" name="5">
            <div>右上角参考操作说或者咨询客服，根据引导完成操作</div>
          </el-collapse-item>
        </el-collapse>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
export default {
  data() {
    return {
      activeName: "info",
      activeMatter: "",
      vs: [
        { version: "幼儿园版", inline: true },
        { version: "中小学版", inline: true },
        { version: "集团版", inline: false }
      ],
      cdkeyform: {
        cdkey: ""
      },
      rules: {
        cdkey: {
          type: "string",
          required: true,
          message: "兑换码无效，请重新输入",
          trigger: "blur"
        }
      }
    };
  },
  methods: {
    submitCDkey(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$message.error("兑换失败");
        } else {
          return false;
        }
      });
    }
  }
};
</script>

<style lang="scss">
$primary: #0099ff;
%to-center {
  display: flex;
  align-items: center;
  justify-content: center;
}
%market-detail-tab {
  padding: 0 12px;
  background-color: #ffffff;
}

%content-name {
  font-size: 16px;
  color: $primary;
  font-weight: 600;
}

%content-desc {
  font-size: 12px;
  color: #00000072;
  padding: 5px 0;
}

.market-detail {
  &-header {
    background-color: #ffffff;
    text-align: left;
    padding: 12px 12px 0 12px;
    &-name {
      @extend %content-name;
    }
    &-desc {
      @extend %content-desc;
    }
  }
  .el-tabs {
    .el-tabs__header {
      @extend %market-detail-tab;
      margin: 0;
      .el-tabs__item {
        font-size: 12px;
      }
    }
    .el-tabs__content {
      @extend %market-detail-tab;
      margin-top: 10px;
      padding: 12px;
      .matter {
        margin: 12px;
        text-align: left;
        .el-collapse-item__content {
          padding: 0 5px;
          font-size: 12px;
          color: #00000072;
        }
        [class^="el-icon"] {
          color: #f56c6c;
          margin-left: 10px;
        }
      }
      .info {
        display: flex;
        &-v {
          &-poster {
            height: 260px;
            width: 150px;
            background-color: #f2f2f2;
            @extend %to-center;
          }
          margin: 6px;
          .el-button {
            margin: 10px 0;
          }
        }

        &-cdkey {
          padding: 10px 40px;
          &-title {
            text-align: left;
            padding: 10px 6px;
            font-size: 14px;
            color: #169bd5;
          }
          &-operate {
            .el-input {
              width: auto;
              margin-right: 20px;
            }
          }
        }
      }
    }
  }
}
</style>

