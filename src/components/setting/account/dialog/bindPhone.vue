<template>
  <el-dialog
    title="绑定安全手机号"
    :visible.sync="visible"
    width="460px"
    :before-close="handleClose"
  >
    <div class="form-container">
      <el-form class="form" :model="verifyParams" label-width="90px">
        <el-form-item label="新手机号：" label-width:="90px">
          <el-input
            class="input-account"
            placeholder="请输入新手机号"
            v-model="verifyParams.phone"
          ></el-input>
        </el-form-item>
        <el-form-item label="验证码：" label-width:="90px">
          <div>
            <el-input
              class="input-code"
              placeholder="请输入验证码"
              v-model="verifyParams.smsCode"
              clearable
            ></el-input>
            <el-button
              class="btn-code"
              @click="sendSms"
              :class="{ 'btn-disabled': codeBtnDisable }"
              :disabled="codeBtnDisable"
              >{{ codeText }}</el-button
            >
          </div>
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer">
      <el-button class="default-btn" @click="handleClose" size="small"
        >取消</el-button
      >
      <el-button class="rb" type="primary" @click="confirm" size="small"
        >确定</el-button
      >
    </span>
  </el-dialog>
</template>

<script>
import { checkTel } from "@/common/validator";
export default {
  props: ["visible", "verifyParams", "platform"],
  data() {
    return {
      time: "",
      codeBtnDisable: false,
      codeText: "发送验证码",
      curApp: ""
    };
  },
  mounted() {
    this.verifyParams.phone = "";
    this.verifyParams.smsCode = "";
  },
  methods: {
    goToLogin() {
      window.localStorage.clear();
      window.sessionStorage.clear();
      setTimeout(() => {
        this.$router.push("/login");
      }, 2000);
    },
    handleClose() {
      this.$emit("close");
    },
    confirm() {
      if (!this.verifyParams.smsCode) {
        this.$message.warning("请输入验证码");
        return;
      }
      if (this.platform == "zl") {
        let zlparams = {
          phone: this.verifyParams.phone,
          smsCode: this.verifyParams.smsCode,
          business: "4000",
          isDelete: false
        };
        this.$http.post(this.$url.zlurl.checkSmCode, {}, zlparams).then(res => {
          if (res.bizData) {
            this.$emit("verifySuccess", this.verifyParams.smsCode);
          } else {
            this.$message.error(res.msg);
          }
        });
      } else {
        let params = {
          mobile: this.verifyParams.phone,
          validCode: this.verifyParams.smsCode,
          bizType: 6
        };
        this.$http.postFormData(this.$url.xysurl.smsValid, params).then(res => {
          if (0 == res.status) {
            this.$emit("verifySuccess", this.verifyParams.smsCode);
          } else {
            this.$message.error(res.message);
          }
        });
      }
    },
    _mobileValidate() {
      let msg = "";
      if (!this.verifyParams.phone) {
        return (msg = "手机号不能为空");
      } else if (!checkTel(this.verifyParams.phone)) {
        return (msg = "请输入正确的手机号码");
      }
      return msg;
    },
    //发送验证码
    async sendSms() {
      if (this._mobileValidate()) {
        return;
      }
      if (this.platform === "zl") {
        this.sendZlCode(this.verifyParams.phone);
      } else {
        let params = {
          mobile: this.verifyParams.phone
        };
        let res = await this.$http.post(this.$url.xysurl.validMobile, params);
        if (0 == res.status) {
          this.sendXysCode();
        } else {
          this.$message.warning(res.message ? res.message : "手机号校验失败");
        }
      }
    },
    //校易收发送验证码
    sendXysCode() {
      let params = {
        mobile: this.verifyParams.phone,
        bizType: 6
      };
      this.$http
        .postFormData(this.$url.xysurl.personalSendSms, params)
        .then(res => {
          if (0 == res.status) {
            this.$message.success("验证码发送成功，请注意查收");
            this.time = 60;
            this.timeCount();
          } else {
            this.$message.error(res.message);
          }
        });
    },
    sendZlCode(phone) {
      //知了发送验证码
      this.$http
        .post(
          this.$url.zlurl.getSMSCode,
          {},
          {
            app: "zhiliao",
            num: 0,
            business: "4000",
            phone: phone
          }
        )
        .then(res => {
          if ("0000000" == res.rtnCode) {
            this.$message.success("验证码发送成功，请注意查收");
            this.time = res.bizData.time;
            if(this.time < 0){
              this.time = 60;
            }
            this.timeCount();
          } else {
            this.$message.error(res.msg);
          }
        });
    },
    timeCount() {
      if (this.time === 0) {
        this.codeBtnDisable = false;
        this.codeText = "发送验证码";
      } else {
        this.time--;
        this.codeText = `${this.time}s`;
        this.codeBtnDisable = true;
        setTimeout(this.timeCount, 1000);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.form-container {
  margin: 0 auto;
  .form {
    width: 300px;
    margin: 0 auto;
  }
}
.tip {
  text-align: center;
  font-size: 14px;
  color: #999999;
  margin-bottom: 40px;
  margin-left: 4px;
}
.input-account {
  width: 210px;
}
.input-code {
  width: 112px;
}
.btn-code {
  width: 90px;
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
.rb {
  margin-left: 8px;
}
</style>
