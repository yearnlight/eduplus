<!--  -->
<template>
  <div></div>
</template>

<script>
export default {
  data() {
    return {
      source: "",
      loginUrl: "",
      baseUrl: "http://test.imzhiliao.com/",
      loginInfo: ""
    };
  },

  mounted() {
    this.source = this.getParamByName("source");
    if (!this.source) alert("source 字段未传递!");
    let params = {
      style: "",
      clientInfo: {},
      data: {
        app: "zhiliao"
      }
    };
    let loginUrl;
    switch (this.source) {
      case "alipay_wallet":
        params.data["auth_code"] = this.getParamByName("auth_code");
        loginUrl = this.$url.zlurl.alipayLogin(params.data["auth_code"]);
        break;
      //   case "easypay_wallet":
      //     params.data["alipayId"] = this.getParamByName("alipayId");
      //     loginUrl =
      //       this.baseUrl +
      //       "uc/user/xysLogin?alipayId=" +
      //       encodeURIComponent(params.data["alipayId"]);
      //     break;
      default:
        break;
    }
    this.triggerLogin(loginUrl, params);
  },

  methods: {
    triggerLogin(loginUrl, params) {
      this.$http
        .post(loginUrl, {}, params)
        .then(res => {
          if (res.rtnCode == "0000000") {
            
            this.$router.push({
              path: "/login",
              query: {
                loginInfo: JSON.stringify(res)
              }
            });
          }
        })
        .catch(err => {
          
          window.sessionStorage.clear();
          window.localStorage.clear();
          this.$router.push("/login");
        });
    },
    getParamByName(name) {
      return (
        decodeURIComponent(
          (new RegExp("[?|&]" + name + "=" + "([^&;]+?)(&|#|;|$)").exec(
            location.href
          ) || [, ""])[1].replace(/\+/g, "%20")
        ) || null
      );
    },
    getNewsNumber() {
      this.$http
        .post(this.$url.zlurl.unReadMessage, {}, {}, "application/json")
        .then(res => {
          const total = res.bizData.rows.length;
          this.$store.commit("setNewsNumber", total);
        });
    }
  }
};
</script>
<style lang="scss" scoped></style>
