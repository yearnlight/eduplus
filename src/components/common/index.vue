<template>
  <div class="app-wrapper">
    <div class="global-header">
      <div class="container clearfix">
        <div class="logo left">
          <img
            src="../../assets/image/time@2x.png"
            width="119"
            height="33"
            alt=""
          />
        </div>
        <div class="bread left">
          找回密码
        </div>
      </div>
    </div>
    <div class="forget-pwd-steps">
      <div class="container clearfix">
        <div
          class="forget-steps-icons forget-steps-validate"
          :class="{ active: forgetStep === 'VALIDATE' }"
        >
          1
        </div>
        <div class="forget-steps-line"></div>
        <div
          class="forget-steps-icons  forget-steps-reset"
          :class="{ active: forgetStep === 'RESET' }"
        >
          2
        </div>
        <div class="forget-steps-line"></div>
        <div
          class="forget-steps-icons  forget-steps-success"
          :class="{ active: forgetStep === 'SUCCESS' }"
        >
          3
        </div>
      </div>
    </div>
    <div class="container">
      <div class="forget-pwd-cont" v-if="forgetStep === 'VALIDATE'">
        <div class="form-control">
          <input
            class="input login-input login-mobile input-max"
            type="text"
            v-model="userMobile"
            placeholder="手机号"
            maxlength="11"
          />
          <div v-if="validMobileErrorMsg" class="errorMsg">
            {{ validMobileErrorMsg }}
          </div>
        </div>
        <div class="form-control clearfix">
          <input
            class="input login-input login-validate input-min left"
            type="text"
            v-model="validateCode"
            placeholder="验证码"
            maxlength="6"
          />
          <button
            class="login-validate-btn"
            @click="loginValidateSend"
            :disabled="validateTimeShow"
          >
            {{ validateText }}
          </button>
          <span class="validate-time" v-if="validateTimeShow"
            >{{ validateTime }}s</span
          >
          <div v-if="validCodeErrorMsg" class="errorMsg">
            {{ validCodeErrorMsg }}
          </div>
        </div>
        <button class="btn forget-pwd-btn" @click="resetNext">下一步</button>
      </div>
      <div class="forget-pwd-cont" v-if="forgetStep === 'RESET'">
        <div class="form-control">
          <input
            class="input login-input login-pwd input-max"
            type="password"
            placeholder="输入新密码"
            v-model="newPwd"
          />
        </div>
        <div class="form-control">
          <input
            class="input login-input login-pwd input-max"
            type="password"
            placeholder="再次输入新密码"
            v-model="newPwdAgain"
          />
          <div v-if="pwdErrorMsg" class="errorMsg">{{ pwdErrorMsg }}</div>
        </div>
        <button class="btn forget-pwd-btn" @click="resetSubmit">确定</button>
        <!-- <div class="color-red mt20" v-if="forgetStep === 'RESET' && resetErrorMsg">{{resetErrorMsg}}</div> -->
      </div>
      <div class="reset-success-cont" v-if="forgetStep === 'SUCCESS'">
        <div class="reset-success-tips clearfix">
          <i class="icon-success mr16"></i>
          <span>重置密码成功！5S后自动返回登录首页</span>
        </div>
        <button class="btn forget-pwd-btn" @click="backLogin">返回登录</button>
      </div>
    </div>
  </div>
</template>

<script>
// import { checkTel, checkPwd } from "../../tools/utils";
import madeSecrect from "md5";
export default {
  beforeCreate: function() {
    document.getElementsByTagName("body")[0].style.background = "#fff";
  },
  data() {
    return {
      forgetStep: "VALIDATE",
      validateText: "发送验证码",
      validateTime: 60,
      validateTimeShow: false,
      userMobile: "",
      newPwd: "",
      newPwdAgain: "",
      validateCode: "",
      resetErrorMsg: "",
      validMobileErrorMsg: "",
      validCodeErrorMsg: "",
      pwdErrorMsg: ""
    };
  },
  watch: {},
  mounted() {},
  methods: {
    async loginValidateSend() {
      if (this.userMobile) {
        this.resetErrorMsg = "";
        const res = await this.$http.post(this.$urlApi.sendValidate, {
          mobile: this.userMobile,
          bizType: 3
        });
        if (!res.status) {
          this.validateText = "重新发送";
          this.validateTimeShow = true;
          this.validMobileErrorMsg = "";
          let time = 60;
          let timer = setInterval(() => {
            time -= 1;
            this.validateTime = time;
            if (time === 0) {
              clearInterval(timer);
              this.validateTimeShow = false;
              this.validateTime = 60;
            }
          }, 1000);
        } else {
          this.validMobileErrorMsg = res.message;
        }
      } else {
        this.validMobileErrorMsg = "请先输入手机号";
      }
    },
    _mobileValidate() {
      let msg = "";
      if (!this.userMobile || !this.validateCode) {
        return (msg = "手机号/验证码不能为空");
      } else if (!checkTel(this.userMobile)) {
        return (msg = "请输入正确的手机号码");
      } else if (this.validateCode.length !== 6) {
        return (msg = "请输入正确的验证码");
      }
    },
    _resetPwdValidate() {
      let msg = "";
      if (!this.newPwd || !this.newPwdAgain) {
        return (msg = "密码不能为空");
      } else if (!checkPwd(this.newPwd)) {
        return (msg = "密码必须为6-18位的数字、字母或_@*");
      } else if (this.newPwd !== this.newPwdAgain) {
        return (msg = "两次密码不一致");
      }
    },
    async resetNext() {
      this.validMobileErrorMsg = "";
      this.validCodeErrorMsg = "";
      if (!this.userMobile) {
        this.validMobileErrorMsg = "手机号不能为空";
      } else if (!this.userMobile) {
        this.validCodeErrorMsg = "验证码不能为空";
      } else if (!checkTel(this.userMobile)) {
        this.validMobileErrorMsg = "请输入正确的手机号码";
      } else if (this.validateCode.length !== 6) {
        this.validCodeErrorMsg = "请输入正确的验证码";
      } else {
        const res = await this.$http.post(this.$urlApi.validateCode, {
          mobile: this.userMobile,
          bizType: 3,
          validCode: this.validateCode
        });
        if (!res.status) {
          this.forgetStep = "RESET";
          this.resetErrorMsg = "";
        } else if (res.status === 100002) {
          this.validMobileErrorMsg = res.message;
        } else if (res.status === 1) {
          this.validCodeErrorMsg = res.message;
        } else {
          this.validMobileErrorMsg = res.message;
        }
      }
    },
    async resetSubmit() {
      let errorMsg = this._resetPwdValidate();
      if (!errorMsg) {
        const res = await this.$http.post(this.$urlApi.forgetPwd, {
          mobile: this.userMobile,
          newPassword: madeSecrect(this.newPwd)
        });
        if (!res.status) {
          this.forgetStep = "SUCCESS";
          setTimeout(() => {
            this.goToLogin = "VALIDATE";
            this.$router.push({ path: "/login" });
          }, 5000);
          this.pwdErrorMsg = "";
        }
      } else {
        this.pwdErrorMsg = errorMsg;
      }
    },
    backLogin() {
      this.$router.push({ path: "/login" });
    }
  }
};
</script>

<style scoped>
.forget-pwd-steps {
  background: #f6f6f6;
  height: 120px;
  padding: 32px 0 56px 0;
  text-align: center;
}

.forget-pwd-steps .forget-steps-icons {
  display: inline-block;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #d8d8d8;
  line-height: 32px;
  color: #fff;
  vertical-align: middle;
  position: relative;
}

.forget-pwd-steps .forget-steps-icons.active {
  background: #427cff;
}

.forget-pwd-steps .forget-steps-icons:after {
  display: block;
  position: absolute;
  width: 75px;
  bottom: -32px;
  left: -21px;
  color: #666;
  text-align: center;
}

.forget-pwd-steps .forget-steps-icons.forget-steps-validate:after {
  content: "手机验证";
}

.forget-pwd-steps .forget-steps-icons.forget-steps-reset:after {
  content: "重置密码";
}

.forget-pwd-steps .forget-steps-icons.forget-steps-success:after {
  content: "完成";
}

.forget-pwd-steps .forget-steps-line {
  display: inline-block;
  width: 212px;
  height: 1px;
  background: #ccc;
  vertical-align: middle;
}

.forget-pwd-cont {
  margin-top: 56px;
  padding-left: 340px;
}

.input-max {
  max-width: 275px;
}

.input-min {
  max-width: 185px;
}

.login-validate-btn {
  line-height: 42px;
  margin: 0 16px 0 16px;
  color: #427cff;
  background: none;
  width: 75px;
  text-align: right;
}

.validate-time {
  line-height: 42px;
  color: #999999;
}

.forget-pwd-btn {
  width: 275px;
  margin-top: 48px;
}

.reset-success-tips span {
  font-size: 16px;
  color: #373c50;
}

.reset-success-cont {
  margin-top: 56px;
  text-align: center;
}

button[disabled] {
  color: #999;
  cursor: not-allowed;
}

.errorMsg {
  position: absolute;
  top: 46px;
  left: 0;
  color: #f00;
  font-size: 12px;
}
</style>
