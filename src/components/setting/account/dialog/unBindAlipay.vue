<template>
  <el-dialog title="解除支付宝绑定" :visible.sync="visible" width="460px" :before-close="handleClose">
    <div class="form-container">
      <div class="tip">解绑支付宝后，将无法通过支付宝扫码登录，确定要解除绑定吗？</div>
    </div>
    <span slot="footer">
      <el-button @click="handleClose" size="small">取消</el-button>
      <el-button class="rb" type="primary" @click="confirm" size="small">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { close } from "fs";
export default {
  props: ["visible"],
  data() {
    return {
      userInfo: null
    };
  },
  mounted() {},
  methods: {
    handleClose() {
      this.$emit("close");
    },
    confirm() {
      if (window.sessionStorage.getItem("saas_token")) {
        this.$http.post(this.$url.zlurl.alipayUnbind).then(res => {
          if (res.rtnCode == "0000000") {
            this.$emit("close");
            this.$emit("clearAlipay");
          }
        });
      } else {
        this.$http.post(this.$url.xysurl.unbindAlipay).then(res => {
          if (!res.status) {
            this.$emit("close");
            this.$emit("clearAlipay");
          }
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.form-container {
  margin: 0 auto;
}
.tip {
  text-align: center;
  font-size: 14px;
  color: #333333;
  margin: 40px 0px;
}
</style>
