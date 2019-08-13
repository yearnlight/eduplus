<template>
  <el-dialog
    title="安全验证"
    :visible.sync="visible"
    width="460px"
    :before-close="handleClose"
  >
    <div class="form-container">
      <div class="tip">说明：修改账号登录信息需要通过安全验证。</div>
      <el-form class="form" :model="verifyParams">
        <el-form-item label="手机号：">
          <el-input
            class="input-account"
            placeholder="请输入手机号"
            v-model="verifyParams.phone"
            disabled
          ></el-input>
        </el-form-item>
        <el-form-item label="验证码：">
          <div class="login-content-checkCode">
            <el-input
              class="input-code"
              placeholder="请输入验证码"
              v-model="verifyParams.smsCode"
              clearable
            ></el-input>
            <el-button
              class="btn-code"
              @click="sendCode"
              :disabled="codeBtnDisable"
              :class="{ 'btn-disabled': codeBtnDisable }"
              >{{ codeText }}</el-button
            >
          </div>
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer">
      <el-button @click="handleClose" size="small">取消</el-button>
      <el-button class="rb" type="primary" @click="confirm" size="small"
        >确定</el-button
      >
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: ["visible", "verifyParams", "platform"],
  data() {
    return {
      time: "",
      codeBtnDisable: false,
      codeText: "发送验证码",
      bizType: "" //校易收业务类型  2-修改密码 7-修改手机号
    };
  },
  mounted() {
    //清空验证码
    this.verifyParams.smsCode = "";
    if ("PWD" == this.verifyParams.type) {
      this.bizType = 2;
    } else {
      this.bizType = 7;
    }
  },
  methods: {
    handleClose() {
      this.verifyParams.smsCode = "";
      this.$emit("close");
    },
    confirm() {
      if (!this.verifyParams.smsCode) {
        this.$message.warning("请输入验证码");
        return;
      }

      let params = {
        mobile: this.verifyParams.phone,
        validCode: this.verifyParams.smsCode,
        bizType: this.bizType
      };
      if (this.platform == "zl") {
        this.checkZlCode(params);
      } else {
        this.checkXysCode(params);
      }
    },
    checkZlCode(params) {
      //知了校验参数
      let zlparams = {
        phone: params.mobile,
        smsCode: params.validCode
      };
      if (this.verifyParams.type == "PWD") {
        Object.assign(zlparams, { isDelete: false });
      }
      this.$http.post(this.$url.zlurl.checkSmCode, {}, zlparams).then(res => {
        if (res.bizData) {
          this.$emit("verifySuccess", params.validCode);
        } else {
          this.$message.error(res.msg);
          this.$emit("verifySuccess");
        }
      });
    },
    checkXysCode(params) {
      //校验校易收验证码
      this.$http
        .postFormData(this.$url.xysurl.personalSmsValid, params)
        .then(res => {
          if (0 == res.status) {
            this.$emit("verifySuccess", params.validCode);
          } else {
            this.$message.error(res.message || "校验验证码失败");
            this.$emit("verifySuccess");
          }
        });
    },
    //发送验证码
    sendCode() {
      if (this.platform === "zl") {
        this.sendZlCode(this.verifyParams.phone);
      } else {
        this.sendXysCode(this.verifyParams.phone);
      }
    },
    sendXysCode(phone) {
      //校易收发送验证码
      let params = {
        mobile: phone,
        bizType: this.bizType
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
            business: "2000",
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
