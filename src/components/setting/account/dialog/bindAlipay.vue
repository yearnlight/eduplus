<template>
  <el-dialog
    title="扫码绑定支付宝"
    :visible.sync="visible"
    width="460px"
    :before-close="handleClose"
  >
    <div class="container">
      <div class="qrcode-container">
        <qrcode-vue
          v-loading="loading"
          class="qrCode"
          size="200"
          :value="skipUrl"
        ></qrcode-vue>
      </div>
      <div class="tip mt24">打开支付宝扫一扫上方二维码绑定</div>
    </div>
  </el-dialog>
</template>

<script>
import QrcodeVue from "qrcode.vue";
export default {
  props: ["visible"],
  data() {
    return {
      skipUrl: "",
      loading: true,
      taskNo: ''
    };
  },
  components: {
    QrcodeVue
  },
  mounted() {
    if (window.sessionStorage.getItem("saas_token")) {
      this.$http.post(this.$url.zlurl.getBindUrl).then(res => {
        this.skipUrl = res.bizData;
        this.loading = false;
        this.$emit('bindindAlipay')
      });
    } else {
      this.$http.get(this.$url.xysurl.bindAlipay).then(res => {
        this.skipUrl = this.$url.xysurl.xysBindAlipaySkipUrl() + res.data;
        this.loading = false;
        this.$emit('bindindAlipay', res.data)
      });
    }
  },
  methods: {
    handleClose() {
      this.$emit("close");
    }
  }
};
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}
.qrcode-container {
  background: #fafafa;
  border: 1px solid #ddd;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
}
.qrCode {
  background: #fff;
  padding: 8px;
}
.tip {
  text-align: center;
  font-size: 14px;
  color: #333333;
}
</style>
