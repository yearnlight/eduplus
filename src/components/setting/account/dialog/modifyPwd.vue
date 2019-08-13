<!-- 修改密码 -->
<template>
  <el-dialog
    title="修改密码"
    :visible.sync="visible"
    width="460px"
    :before-close="handleClose"
  >
    <div class="form-container">
      <div class="tip">
        说明：密码构成为6-18位数字、字母（区分大小写）或符号
      </div>
      <el-form
        ref="form"
        class="form"
        :model="form"
        :rules="rules"
        label-width="120px"
      >
        <el-form-item label="新密码：" prop="newPassword">
          <el-input
            class="input-account"
            type="password"
            placeholder="请输入密码"
            v-model="form.newPassword"
          ></el-input>
        </el-form-item>
        <el-form-item label="确认密码：" prop="confirmPassword">
          <div class="login-content-checkCode">
            <el-input
              class="input-account"
              placeholder="请再输入一次"
              v-model="form.confirmPassword"
              clearable
              type="password"
            ></el-input>
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
import md5 from "js-md5";
import { validatePwd } from "@/common/rules";
import { setTimeout } from "timers";
export default {
  //type：‘PWD’-修改密码  ‘BIND’-绑定手机号
  props: ["visible", "platform", "smCode", "phone", "type"],
  data() {
    let _this = this;
    var validateEqual = function(rule, value, callback) {
      if (value === _this.form.newPassword) {
        callback();
      } else {
        callback(new Error("两次密码输入不一致"));
      }
    };
    return {
      form: {
        newPassword: "",
        confirmPassword: ""
      },
      rules: {
        newPassword: [
          {
            required: true,
            validator: validatePwd,
            trigger: "blur"
          }
        ],
        confirmPassword: [
          {
            required: true,
            validator: validatePwd,
            trigger: "blur"
          },
          {
            validator: validateEqual,
            trigger: "blur"
          }
        ]
      }
    };
  },
  mounted() {},
  methods: {
    handleClose() {
      this.$emit("close");
    },
    goToLogin() {
      window.localStorage.clear();
      window.sessionStorage.clear();
      setTimeout(() => {
        this.$router.push("/login");
      }, 2000);
    },
    confirm() {
      this.$refs.form.validate(valid => {
        if (valid) {
          let pwd = md5(this.form.confirmPassword);
          if ("PWD" == this.type) {
            if (this.platform == "zl") {
              let params = {
                smsCode: this.smCode,
                pwd: pwd,
                phone: this.getSStorage("userDetail").userInfo.phoneNum
              };
              this.$http
                .post(this.$url.zlurl.updatePass, {}, params)
                .then(res => {
                  if (res.bizData) {
                    this.$message.success("修改登录密码成功,请重新登录");
                    this.goToLogin();
                  } else {
                    this.$message.error("修改登录密码失败");
                  }
                });
            } else {
              let params = {
                newPassword: pwd
              };
              this.$http
                .postFormData(this.$url.xysurl.modifyPwd, params)
                .then(res => {
                  if (0 == res.status) {
                    this.$message.success("修改成功");
                    this.goToLogin();
                  }
                });
            }
          } else if ("BIND" == this.type) {
            if (this.platform == "zl") {
              let zlparams = {
                phone: this.modifyParams.phone,
                smsCode: this.modifyParams.smsCode
              };
              this.$http
                .post(this.$url.zlurl.updatePhone, {}, zlparams)
                .then(res => {
                  if ("0000000" == res.rtnCode) {
                    this.$message.success("绑定成功");
                    this.$emit("bindModifyPwdSuccess");
                  } else {
                    this.$message.error(res.msg ? res.msg : "绑定失败");
                  }
                });
            } else {
              let params = {
                password: pwd,
                mobile: this.phone
              };
              this.$http
                .postFormData(this.$url.xysurl.bindMobile, params)
                .then(res => {
                  if (0 == res.status) {
                    this.$emit("bindModifyPwdSuccess");
                    this.$message.success("绑定成功");
                  } else {
                    this.$message.error(res.message ? res.message : "绑定失败");
                  }
                });
            }
          }
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.form-container {
  margin: 0 auto;
  .form {
    width: 300px;
  }
}
.tip {
  text-align: center;
  font-size: 14px;
  color: #999999;
  margin-bottom: 40px;
}
.input-account {
  width: 210px;
}
.input-code {
  width: 100px;
}
.btn-getcode {
  width: 100px;
  margin-left: 8px;
}
.rb {
  margin-left: 8px;
}
</style>
