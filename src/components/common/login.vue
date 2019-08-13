<template>
  <div class="login" v-loading="authLoginLoading" element-loading-text="登录中" element-loading-background="#fff">
    <div class="left" v-show="!authLoginLoading">
      <div class="slogan">
        <div>提升教育价值</div>
        <div>成就美好未来</div>
      </div>
    </div>
    <div class="right" v-show="!authLoginLoading">
      <div class="header">
        <img src="../../assets/image/login/right_top_img.png" alt>
      </div>
      <div class="bottom">
        <div class="logo">
          <img src="../../assets/image/login/blue_logo.png" alt>
        </div>
        <div class="login-content">
          <el-form ref="loginform" :model="loginform" :rules="rules" label-width="0">
            <el-form-item prop="account" class="telForm">
              <el-input class="telInput" placeholder="手机号" @change="accountChange" prefix-icon="iconfont icon-phone" v-model="loginform.account" clearable></el-input>
            </el-form-item>
            <el-form-item label prop="pwd" class="pwdForm">
              <el-input autocomplete="off" class="pwdInput" placeholder="密码" prefix-icon="iconfont icon-pwd" type="text" clearable v-model="loginform.pwd"></el-input>
            </el-form-item>
            <el-form-item label prop="code" v-if="loginform.sessionId" class="codeForm">
              <div class="login-content-checkCode">
                <el-input class="codeInput" placeholder="验证码" clearable prefix-icon="iconfont icon-validate" v-model="loginform.code"></el-input>
                <img class="ver-img" :src="verifyCodeUrl" alt @click="getVerifyCode">
              </div>
            </el-form-item>
            <el-form-item class="forgetForm">
              <div class="login-content-autosave">
                <span class="error-message" v-text="errorMessage"></span>
                <span></span>
                <span class="login-content-forget" @click="gotoForgetPwd">忘记密码</span>
              </div>
            </el-form-item>
            <el-form-item class="loginForm">
              <el-button type="primary" :loading="loading" @click="signin('loginform')" class="loginBtn">
                <span>{{ loading ? "登录中..." : "登录" }}</span>
              </el-button>
            </el-form-item>
            <el-form-item class="alipayForm">
              <a class="alipayButton" :href="zfbUrl">
                <img src="../../assets/image/login/alipay.png" alt>
                <span>支付宝登录</span>
              </a>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import md5 from "js-md5";
import { validateTelphone } from "@/common/validator";
export default {
  data() {
    return {
      loading: false,
      authLoginLoading: true,
      validMobileErrorMsg: "",
      validPwdErrorMsg: "",
      errorMessage: "",
      verifyCodeUrl: "",
      showVerifyCode: "",
      loginform: {
        account: "",
        code: "",
        pwd: "",
        sessionId: ""
      },
      rules: {
        account: [
          {
            validator: validateTelphone,
            trigger: "blur",
            required: true
          }
        ],
        code: {
          type: "string",
          required: true,
          message: "请输入验证码",
          trigger: "blur"
        },
        pwd: {
          type: "string",
          required: true,
          message: "请输入密码",
          trigger: "blur"
        }
      },
      lastErrorAccount: "",
      zfbUrl:
        "/zl_api/uc/user/gotoAlipayLoginPage?type=2&requestSource=imeduplus", //支付宝授权登录地址
      queryLoginInfo: ""
    };
  },
  created() {
    let _this = this;
    this.clearStorage();
    document.onkeydown = function(e) {
      var key = window.event.keyCode;
      if (key == 13) {
        _this.signin("loginform");
      }
    };
  },
  mounted() {
    //屏蔽客服入口
    document.getElementById("common-udesk-kf")
      ? (document.getElementById("common-udesk-kf").style.display = "none")
      : "";
    if (this.$route.query.loginInfo) {
      //第三方登录：支付宝登录、切流（知了、校易收）
      this.queryLoginInfo = JSON.parse(this.$route.query.loginInfo);
      this.authLoginLoading = true;
      this.toSignin(this.queryLoginInfo);
    } else {
      this.closeLoading();
    }
  },
  methods: {
    getNewsNumber() {
      this.$http
        .post(this.$url.zlurl.unReadMessage, {}, {}, "application/json")
        .then(res => {
          if (res.bizData && res.bizData.rows) {
            const total = res.bizData.rows && res.bizData.rows.length;
            this.$store.commit("setNewsNumber", total);
          }
        });
    },
    //用户点击登录
    async userLogin() {
      this.errorMessage = "";
      this.loading = true;
      let data = {
        account: this.loginform.account,
        pwd: md5(this.loginform.pwd),
        sessionId: this.loginform.sessionId,
        code: this.loginform.code,
        requestSource: "imeduplus"
      };
      let res = await this.$http
        .post(this.$url.zlurl.saasLogin, {}, data)
        .catch(e => {
          this.loading = false;
        });

      if (res && res.rtnCode != "0000000") {
        this.lastErrorAccount = this.loginform.account;
        this.loginform.sessionId = res.bizData ? res.bizData.sessionId : "";
        this.verifyCodeUrl = res.bizData
          ? "data:image/jpeg;base64," + res.bizData.url
          : "";
        this.loading = false;
        this.errorMessage = res.msg;
        return;
      }
      if (res.rtnCode == "0000000") {
        //登录成功
        this.toSignin(res.bizData);
      }
    },
    //登录结果处理（支付宝&账号密码）
    async toSignin(loginUserInfo) {
      var userDetail;
      this.errorMessage = "";
      let groupUsers = loginUserInfo.groupUsers;
      let token = loginUserInfo.token || "";
      let xysToken = loginUserInfo.xysToken || "";
      let xysUserId = loginUserInfo.xysUserId;
      let userId = loginUserInfo.userId;
      this.setSg("userId", userId);
      this.setSg("saas_token", token);
      this.setSg("_TOKEN_COOKIE", xysToken);
      this.setSStorage("userDetail", {
        userInfo: {
          userName: loginUserInfo.xysUserName,
          phoneNum: loginUserInfo.phone
            ? loginUserInfo.phone
            : loginUserInfo.xysMobile
        }
      });
      if (xysUserId) {
        this.setSStorage("xysUserId", xysUserId);
      }

      // if (!token && xysToken) {
      //   //单校易收用户
      //   //校易收login:主要是后端给session写数据
      //   let xysLoginRes = await this.$http
      //     .get(this.$url.xysurl.authReturn, {
      //       token: xysToken,
      //       zlToken: token,
      //       userId: xysUserId
      //     })
      //     .catch(() => {
      //       this.clearStorage();
      //     });
      //   if (xysLoginRes.data && xysLoginRes.data.url) {
      //     //校易收登录返回url，说明失败
      //     this.redirectToLogin();
      //     this.$message.warning("没有登录权限");
      //     return;
      //   }
      //   if (xysLoginRes.status == 0) {
      //     this.loading = false;
      //     this.$router.push("/eduplus");
      //   } else {
      //     this.clearStorage();
      //     this.$message.error(xysLoginRes.message);
      //   }
      // } else {
      //知了、 知了+校易收  （知了集团园不需要考虑校易收）
      let res = await this.$http
        .post(this.$url.zlurl.queryUserInfo, { requestSource: "imeduplus" })
        .catch(() => {
          this.clearStorage();
        });
      if (!res) {
        this.redirectToLogin();
        return;
      }
      userDetail = res.bizData;
      // 存入user 信息
      if (userDetail && userDetail.userInfo) {
        this.setSStorage("userDetail", userDetail);
        this.setSg("userId", userDetail.userInfo.userId);
        this.setSg("userName", userDetail.userInfo.userName);
      }
      let xysLoginOk = false;
      if (groupUsers) {
        //集团用户
        // 集团园信息
        const dat = await this.$http
          .post(this.$url.zlurl.getUserAllSchool)
          .catch(() => {
            this.clearStorage();
          });
        let groupGardenInfo = dat.bizData;
        //  这是集团园 机构模式
        if (groupGardenInfo.organizations.length) {
          groupGardenInfo.currentOrg = groupGardenInfo.organizations[0];
          //设置集团园列表
          this.setSg("accountModalType", "isGroup");
          this.setSStorage("groupGardenInfo", groupGardenInfo);
          // 获得集团园用户身份列表
          let code = groupGardenInfo.organizations[0].code;
          this.setSg("code", code);

          //该接口回处理一些异常：1、集团园版本未开始  2、集团园版本未开始  3.集团园版本已过期
          const findByUserRes = await this.$http
            .post(this.$url.zlurl.organizationPermission, { code: code })
            .catch(() => {
              this.clearStorage();
            });
          if (!findByUserRes) {
            this.redirectToLogin();
            return;
          }
          let orgInfo = await this.$http.post(
            this.$url.zlurl.queryEmployeeByUserId,
            {},
            { organizationCode: code }
          );
          if (orgInfo.bizData.length > 1) {
            // 这是集团 多身份
            this.setSStorage("multiplieLists", orgInfo.bizData);
          }
          // 这是切换模式
          this.setSStorage("orgRoleInfo", groupGardenInfo.organizations[0]);
        }
      } else {
        this.setSg("accountModalType", "isSingle");
        // if (!loginUserInfo.groupUsers) {
          //非集团用户、有校易收token  需要登录校易收
          //校易收login:主要是后端给session写数据
          let xysLoginRes = await this.$http
            .get(this.$url.xysurl.authReturn, {
              token: xysToken,
              zlToken: token,
              userId: xysUserId
            })
            .catch(() => {
              this.clearStorage();
            });
          if (xysLoginRes.data && xysLoginRes.data.url) {
            xysLoginOk = false;
          } else {
            xysLoginOk = true;
          }
        // }
      }
      //存入知了 需要的必要参数
      //该接口会返回一些异常情况：1、单园没有登录权限 2、单园所的服务已经过期 3、单园版本还未开始
      const userSchoolList = await this.$http
        .post(this.$url.zlurl.querySchoolList) //TODO
        .catch(() => {});
      if (!userSchoolList && !xysLoginOk) {
        //没有权限&校易收也没有权限
        this.$message.warning("没有登录权限");
        this.redirectToLogin();
        return;
      }
      if (userSchoolList) {
        userDetail.schoolList = userSchoolList.bizData;
        userDetail.userId = userDetail.userInfo.userId;
        this.getNewsNumber();
      }
      // 存入saas_user
      this.setSStorage("saas_user", {
        info: userDetail,
        userId: userDetail.userId,
        schoolList: userDetail.schoolList
      });
      // this.closeLoading();
      this.$router.push("/eduplus");
    // }
    },
    signin(loginForm) {
      this.$refs[loginForm].validate(valid => {
        if (valid) {
          this.userLogin();
        } else {
          return false;
        }
      });
    },

    // 忘记密码
    gotoForgetPwd() {
      this.$router.push("/forgetPwd");
    },
    getVerifyCode() {
      this.$http.post(this.$url.zlurl.getCode).then(res => {
        this.verifyCodeUrl = "data:image/jpeg;base64," + res.bizData.url;
        this.loginform.sessionId = res.bizData.sessionId;
        this.showVerifyCode = true;
      });
    },
    accountChange(newValue) {
      this.errorMessage = "";
      if (this.lastErrorAccount !== newValue) {
        this.loginform.sessionId = "";
        this.loginform.code = "";
      }
    },
    /**
     * 支付宝登录需要重定向到学加家普通login
     */
    redirectToLogin() {
      this.closeLoading();
      this.clearStorage();
      if (this.queryLoginInfo) {
        this.$router.push("/login");
      }
    },
    closeLoading() {
      this.authLoginLoading = false;
      this.loading = false;
    },
    clearStorage() {
      this.closeLoading();
      window.sessionStorage.clear();
      window.localStorage.clear();
    }
  }
};
</script>

<style lang="scss" scoped>
.login {
  height: 100%;
  display: flex;
  flex-direction: row;
  > .left {
    background-image: url("../../assets/image/login/login_main.jpg");
    background-size: 100% 100%;
    flex: 2;
    .picture {
      img {
        height: 100%;
        width: 100%;
      }
    }
    > .top {
      position: fixed;
      top: 0;
      left: 47px;
      height: 80px;
      display: flex;
      flex-direction: row;
      align-items: center;
      color: #fff;
      > img {
        width: 131px;
        height: 25px;
      }
      > .split {
        margin: 0px 16px;
      }
      > .text {
        font-size: 16px;
      }
    }
  }
  > .right {
    overflow-y: auto;
    flex: 1;
    background-color: #fff;
    display: flex;
    flex-direction: column;
    > .header {
      flex: 1;
      > img {
        width: 100%;
      }
    }
    > .bottom {
      flex: 2;
      > .logo {
        text-align: center;
        margin-bottom: 38px;
        > img {
          width: 145px;
          height: 28px;
        }
      }
    }
  }

  &-content {
    width: 319px;
    height: 319px;
    margin: auto;
    &-header {
      text-align: center;
      font-size: 32px;
    }
    &-checkCode {
      flex-direction: row;
      display: flex;
      .el-button {
        width: 120px !important;
        margin-left: 10px;
      }
    }
    &-autosave {
      display: flex;
      justify-content: space-between;
    }

    &-forget {
      color: #1890ff;
      cursor: pointer;
    }

    .el-button {
      width: 100%;
    }
  }
}
.error-message {
  color: red;
  font-size: 14px;
}
.ver-img {
  cursor: pointer;
  width: 102px;
  height: 48px;
  border: none;
}
.alipayButton {
  height: 48px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background-color: #f8fdff;
  border: 1px solid #65cfff;
  box-shadow: 0px 2px 4px 0px #def5ff;
  box-sizing: border-box;
  color: #02b0ff;
  font-size: 16px;
  text-decoration: none;
  cursor: pointer;
  border-radius: 4px;
  > img {
    width: 22px;
    height: 22px;
    margin-right: 8px;
  }
  &:hover {
    background-color: #e0f6ff !important;
  }
}
</style>

<style lang="scss">
.telInput,
.pwdInput,
.codeInput {
  > .el-input__inner {
    height: 48px !important;
  }
  > .el-input__inner + span {
    line-height: 53px;
    margin: 0px 5px;
  }
}
.loginBtn {
  height: 48px;
  font-size: 16px !important;
}
.telForm {
  margin-bottom: 32px !important;
}
.pwdForm {
  margin-bottom: 14px !important;
  input {
    -webkit-text-security: disc;
  }
}
.forgetForm {
  margin-bottom: 39px !important;
}
.loginForm {
  margin-bottom: 24px !important;
  box-shadow: 0px 4px 6px 0px #9dd4ff;
}
.codeForm {
  margin-top: 18px !important;
  margin-bottom: 14px !important;
  display: inline-block;
  width: 100%;
}
.slogan {
  position: fixed;
  left: 12%;
  top: 12%;
  font-size: 62px;
  color: #fff;
  > div:nth-child(2) {
    padding-left: 2 * 62px;
    font-weight: bold;
  }
}
@media screen and (min-width: 1441px) and (max-width: 1990px) {
  .slogan {
    font-size: 1.5 * 62px;
  }
}
@media screen and (min-width: 1991px) {
  .slogan {
    font-size: 2 * 62px;
  }
}
</style>
