<template>
  <div class="login">
    <div class="global-header">
      <img src="../../assets/logo2.png" width="120" height="23" alt>
      <div class="bread left">找回密码</div>
    </div>

    <div class="forget-pwd-steps">
      <div class="clearfix">
        <div class="forget-steps-icons forget-steps-validate" :class="{ active: activeSteps === 'VALIDATE' }">1</div>
        <div class="forget-steps-line"></div>
        <div class="forget-steps-icons forget-steps-reset" :class="{ active: activeSteps === 'RESET' }">2</div>
        <div class="forget-steps-line"></div>
        <div class="forget-steps-icons forget-steps-success" :class="{ active: activeSteps === 'SUCCESS' }">3</div>
      </div>
    </div>
    <div class="login-content">
      <div class="container">
        <div v-show="activeSteps == 'VALIDATE'">
          <el-form class="form" :model="accountform">
            <el-form-item label>
              <el-input class="input-account" placeholder="手机号" prefix-icon="iconfont icon-phone" v-model="accountform.phone"></el-input>
              <div class="error-message" v-if="validMobileErrorMsg">{{ validMobileErrorMsg }}</div>
            </el-form-item>
            <el-form-item label>
              <div>
                <el-input class="input-code" placeholder="验证码" prefix-icon="iconfont icon-validate" v-model="accountform.smsCode"></el-input>
                <el-button class="btn-code" @click="sendSms" :class="{ 'btn-disabled': codeBtnDisable }" :disabled="codeBtnDisable">{{ codeText }}</el-button>
                <div class="error-message" v-if="validCodeErrorMsg">{{ validCodeErrorMsg }}</div>
              </div>
            </el-form-item>
            <el-form-item>
              <el-button class="next-btn" type="primary" @click="nextStep">下一步</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div v-show="activeSteps == 'RESET'">
          <el-form class="form" :model="pwdform">
            <el-form-item>
              <el-input placeholder="输入新密码" prefix-icon="iconfont icon-pwd" type="password" v-model="pwdform.pwd"></el-input>
            </el-form-item>
            <el-form-item>
              <el-input placeholder="再次输入新密码" prefix-icon="iconfont icon-pwd" type="password" v-model="pwdform.pwd2"></el-input>
              <div v-if="pwdErrorMsg" class="error-message">{{ pwdErrorMsg }}</div>
            </el-form-item>
            <el-form-item>
              <el-button class="forget-pwd-btn" type="primary" @click="resetPwd" style="margin-top: 16px;">确定</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div v-show="activeSteps == 'SUCCESS'" class="center">
          <div class="reset-success-tips clearfix">
            <img src="../../assets/image/icon-success.png" width="42" height="43"></img>
            <span class="ml24">重置密码成功！{{backTime}}S后自动返回登录首页</span>
          </div>
          <el-form>
            <el-form-item>
              <el-button class="forget-pwd-btn" type="primary" @click="goBack">返回登录</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import md5 from "js-md5";
import { checkTel } from "@/common/validator";
import { setInterval, clearInterval } from "timers";

export default {
  data() {
    return {
      validMobileErrorMsg: "",
      validCodeErrorMsg: "",
      pwdErrorMsg: "",
      loading: false,
      activeSteps: "VALIDATE",
      accountform: {
        phone: "",
        smsCode: ""
      },
      pwdform: {
        pwd: "",
        pwd2: ""
      },
      rules: {
        phone: {
          type: "string",
          required: true,
          message: "手机号必填",
          trigger: "blur"
        },
        smsCode: {
          type: "string",
          required: true,
          message: "验证码必填",
          trigger: "blur"
        },
        password: {
          type: "string",
          required: true,
          message: "密码必填",
          trigger: "blur"
        }
      },
      params: {
        style: "",
        clientInfo: {},
        data: {}
      },
      xysParams: {
        mobile: "",
        newPassword: ""
      },
      time: "",
      codeBtnDisable: false,
      codeText: "发送验证码",
      backTime: 5,
      interval: 0
    };
  },
  mounted() { },
  methods: {
    _mobileValidate() {
      let msg = "";
      if (!this.accountform.phone) {
        return (msg = "手机号不能为空");
      } else if (!checkTel(this.accountform.phone)) {
        return (msg = "请输入正确的手机号码");
      }
      return msg;
    },
    _resetPwdValidate() {
      let msg = "";
      if (!this.pwdform.pwd || !this.pwdform.pwd2) {
        return (msg = "密码不能为空");
      } else if (this.pwdform.pwd.length < 6) {
        return (msg = "密码长度不能小于6位");
      } else if (this.pwdform.pwd !== this.pwdform.pwd2) {
        return (msg = "两次密码不一致");
      }
      return msg;
    },
    async nextStep() {
      this.validMobileErrorMsg = "";
      this.validCodeErrorMsg = "";
      if (!this.accountform.phone) {
        this.validMobileErrorMsg = "手机号不能为空";
      } else if (!this.accountform.smsCode) {
        this.validCodeErrorMsg = "验证码不能为空";
      } else if (!checkTel(this.accountform.phone)) {
        this.validMobileErrorMsg = "请输入正确的手机号码";
      } else {
        let userSource = await this.$http.get(this.$url.zlurl.usersource, {
          phone: this.accountform.phone
        });

        if (userSource.bizData === "zl") {
          //知了验证码校验
          this.$http
            .post(
              this.$url.zlurl.fpasswordCheckSmsCode,
              {},
              {
                phone: this.accountform.phone,
                smsCode: this.accountform.smsCode,
                isDelete: false
              }
            )
            .then(res => {
              if (res.bizData) {
                this.activeSteps = "RESET";
              } else {
                this.$message.error(res.msg);
              }
            });
        } else {
          //校易收验证码校验
          this.$http
            .post(
              this.$url.xysurl.validSms +
              "?bizType=3&mobile=" +
              this.accountform.phone +
              "&validCode=" +
              this.accountform.smsCode
            )
            .then(res => {
              if (0 == res.status) {
                this.activeSteps = "RESET";
              } else {
                this.$message.error(res.message);
              }
            });
        }
      }
    },

    async resetPwd() {
      this.pwdErrorMsg = this._resetPwdValidate();
      if (this.pwdErrorMsg) {
        return;
      }

      let userSource = await this.$http.get(this.$url.zlurl.usersource, {
        phone: this.accountform.phone
      });

      if (userSource.bizData === "zl") {
        // 知了设置密码
        this.$http
          .post(
            this.$url.zlurl.forgetPassword,
            {},
            {
              app: "zhiliao",
              phone: this.accountform.phone,
              pwd: md5(this.pwdform.pwd),
              smsCode: this.accountform.smsCode
            }
          )
          .then(res => {
            if ("0000000" == res.rtnCode) {
              this.$message.success("重置密码成功");
              this.activeSteps = "SUCCESS";
              this.autoBack();
            } else {
              this.$message.error(res.msg);
            }
          });
      } else {
        // 校易收设置密码
        this.$http
          .post(
            this.$url.xysurl.forgetPwd +
            "?mobile=" +
            this.accountform.phone +
            "&newPassword=" +
            md5(this.pwdform.pwd)
          )
          .then(res => {
            if (!res.status) {
              this.$message.success("重置密码成功");
              this.activeSteps = "SUCCESS";
              this.autoBack();
            } else {
              this.$message.error(res.message);
            }
          });
      }
    },
    async sendSms() {
      this.validMobileErrorMsg = this._mobileValidate();
      if (this.validMobileErrorMsg) {
        return;
      }
      let userSource = await this.$http.get(this.$url.zlurl.usersource, {
        phone: this.accountform.phone
      });

      if (userSource.bizData === "zl") {
        //知了发送验证码
        this.$http
          .post(
            this.$url.zlurl.getSMSCode,
            {},
            {
              app: "zhiliao",
              num: "0",
              business: "2000",
              phone: this.accountform.phone
            }
          )
          .then(res => {
            if ("0000000" == res.rtnCode) {
              this.$message.success("验证码发送成功，请注意查收");
              this.time = res.bizData.time;
              if(this.time <= 0){
                this.time = 60;
              }
              this.timeCount();
            } else {
              this.$message.error(res.msg);
            }
          });
      } else {
        //校易收发送验证码
        this.$http
          .post(
            this.$url.xysurl.sendSms +
            "?mobile=" +
            this.accountform.phone +
            "&bizType=3"
          )
          .then(res => {
            if (0 == res.status) {
              this.$message.success("验证码发送成功，请注意查收");
              this.time = 60;
              this.timeCount();
            } else {
              this.$message.error(res.message);
            }
          });
      }
    },

    timeCount() {
      if (this.time === 0) {
        this.codeBtnDisable = false;
        this.codeText = "发送验证码";
      } else {
        this.time--;
        this.codeText = `${this.time}S`;
        this.codeBtnDisable = true;
        setTimeout(this.timeCount, 1000);
      }
    },

    autoBack() {
      this.interval = setInterval(() => {
        if (this.backTime == 0) {
          clearInterval(this.interval);
          this.$router.go(-1);
        }
        --this.backTime;
      }, 1000);
    },

    // 返回登录
    goBack() {
      clearInterval(this.interval);
      this.$router.go(-1);
    }
  }
};
</script>

<style lang="scss" scoped>
.center {
  text-align: center;
}
.login {
  background-color: #ffffff;
  height: 100%;

  &-header {
    height: 80px;
    font-size: 32px;
  }

  &-content {
    display: flex;
    align-items: center;
    flex-direction: column;

    &-checkCode {
      flex-direction: row;
      height: 42px;
      display: flex;
    }

    &-forget {
      color: #1890ff;
      cursor: pointer;
    }
  }
}

.form {
  width: 276px;
  margin: 0px auto;
}

.input-account {
  width: 276px;
  height: 42px;
}

.el-form-item--small.el-form-item {
  margin-bottom: 24px;
}

.input-code {
  width: 166px;
  height: 42px;
}

.btn-code {
  width: 102px;
  height: 42px;
  margin-left: 8px;
  color: #008eff;
  background: #f3f9ff;
  border: 1px solid #a3d0fd;
  border-radius: 2px;
}

.btn-code.btn-disabled {
  color: #999;
  background: #f9f9f9;
  border: 1px solid #f0f0f0;
  border-radius: 2px;
}

.error-message {
  color: red;
  font-size: 12px;
  line-height: 1.6;
  position: absolute;
  top: 100%;
  left: 0;
}

.reset-success-tips {
  vertical-align: middle;
  display: flex;
  align-items: center;
  justify-content: center;
}

.forget-pwd-btn {
  width: 275px;
  height: 42px;
  font-size: 14px;
  margin-top: 48px;
}

.container {
  display: flex;
  justify-content: center;
  margin-top: 80px;

  > div {
    width: 365px;
  }
}

.global-header {
  padding: 24px 0;
  background: #fff;
  display: flex;
  padding-left: 140px;
}

.global-header .bread {
  padding: 0 12px;
  line-height: 32px;
  border-left: 1px solid #ccc;
  margin-left: 16px;
  font-size: 16px;
}
.forget-pwd-steps {
  background: #f6f6f6;
  width: 100%;
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
  background: #409eff;
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

.login /deep/ .el-input--small .el-input__inner {
  line-height: 42px;
  height: 42px;
}

.next-btn {
  width: 276px;
  margin-top: 16px;
  height: 42px;
  font-size: 16px;
}

.login-content /deep/ .el-input__prefix {
  left: 8px !important;
}
</style>
