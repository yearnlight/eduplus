<!-- 账号设置 -->
<template>
  <div class="page">
    <el-row :gutter="0">
      <!-- <el-col :span="8">
        <div class="page-content left-content">
          <div class="user-info">
            <el-upload
              class="upload-demo"
              ref="upload"
              :on-success="handleSuccess"
              :show-file-list="false"
              :before-upload="beforeAvatarUpload"
              :action="uploadFileUrl"
            >
              <div slot="trigger" class="avatar-container">
                <img :src="userAvatar" alt>
              </div>
            </el-upload>

            <div class="user-info-base">
              <div class="title">{{userName}}</div>
              <span class="des">学加家用户</span>
            </div>
      </div>-->

      <!-- <div class="org-tip-container">
            <div class="org-tip"></div>
            <span class="title">所属机构</span>
          </div>

          <div class="org-container">
            <div class="des">{{ orgInfo.name }}</div>
            <div
              v-for="(item, index) in orgInfoList"
              :key="index"
              class="sub-org"
              :style="{ marginLeft: subOrgMarginLeft(index) }"
            >
              <div class="sub-org-tip"></div>
              <div class="des">{{ item }}</div>
            </div>
      </div>-->
      <!-- </div>
      </el-col>-->
      <el-col :span="24">
        <div class="page-content right-content">
          <div class="item-first">
            <span class="title">登录手机：</span>
            <div v-if="userPhone" class="sub-container">
              <span class="des">已绑定手机 {{ userPhone }}</span>
              <el-button class="btn" type="text" @click="modifyPhone">修改</el-button>
            </div>
            <div v-else class="sub-container">
              <span class="des">未绑定 </span>
              <el-button type="text" class="btn" @click="bindPhone">绑定</el-button>
            </div>
          </div>
          <div class="line"></div>
          <div class="item">
            <span class="title">用户名：</span>
            <div class="sub-container">
              <span class="des">{{ userName }}</span>
              <span class="des">请联系管理员修改</span>
            </div>
          </div>
          <div class="line"></div>
          <div class="item">
            <span class="title">登录密码：</span>
            <div class="sub-container">
              <span class="des">{{ userPhone ? "" : "绑定手机号后设置" }}</span>
              <el-button v-if="userPhone" type="text" class="btn" @click="modifyPwd">修改</el-button>
            </div>
          </div>
          <div class="line"></div>
          <div class="item">
            <span class="title">绑定支付宝：</span>
            <div class="sub-container">
              <span class="des">{{ alipayStatus }}</span>
              <el-button v-if="alipayStatus === '已绑定'" type="text" class="btn unbind-btn" @click="unbindAlipay">解绑</el-button>
              <el-button v-else class="btn " type="text" @click="bindAlipay">绑定</el-button>
            </div>
            <!-- <div v-else class="sub-container">
              <el-button type="text" @click="bindAlipay">绑定</el-button>
            </div>-->
          </div>
        </div>
      </el-col>
    </el-row>
    <verify-phone :visible="verifyDialogVisible" v-on:close="verifyDialogVisible = false" v-if="verifyDialogVisible" :verifyParams="verifyParams" @verifySuccess="verifyMobileSuccess" :platform="platform"></verify-phone>
    <modify-phone :visible="modifyDialogVisible" v-on:close="modifyDialogVisible = false" v-if="modifyDialogVisible" :modifyParams="modifyPhoneParams" @modifySuccess="getUserInfo" :platform="platform"></modify-phone>
    <modify-pwd :visible="modifyPwdDialogVisible" v-on:close="modifyPwdDialogVisible = false" v-if="modifyPwdDialogVisible" :platform="platform" :smCode="smCode" @bindModifyPwdSuccess="bindModifyPwdSuccess" :phone="verifyParams.phone" :type="verifyParams.type"></modify-pwd>
    <un-bind-alipay :visible="unbindAlipayDialogVisible" v-on:close="unbindAlipayDialogVisible = false" v-if="unbindAlipayDialogVisible" @clearAlipay="clearAlipay"></un-bind-alipay>
    <bind-alipay :visible="bindAlipayDialogVisible" v-on:close="closeBindAlipay" v-if="bindAlipayDialogVisible" @bindindAlipay="bindindAlipay"></bind-alipay>
    <bind-phone :visible="bindPhoneDialogVisible" v-on:close="bindPhoneDialogVisible = false" v-if="bindPhoneDialogVisible" :verifyParams="verifyParams" @verifySuccess="verifyMobileSuccess" @platform="platform"></bind-phone>
  </div>
</template>

<script>
import VerifyPhone from "./dialog/verifyPhone";
import ModifyPhone from "./dialog/modifyPhone";
import BindPhone from "./dialog/bindPhone";
import ModifyPwd from "./dialog/modifyPwd";
import unBindAlipay from "./dialog/unBindAlipay";
import bindAlipay from "./dialog/bindAlipay";

export default {
  data() {
    return {
      orgInfo: {},
      orgInfoList: [],
      verifyParams: {
        phone: "",
        smsCode: "",
        type: "PHONE" //校验业务：'PHONE'-修改手机号 'PWD'-修改密码 'BIND'-绑定手机号
      },
      modifyPhoneParams: {
        oldPhone: "",
        phone: "",
        smsCode: ""
      },
      verifyDialogVisible: false,
      modifyDialogVisible: false,
      modifyPwdDialogVisible: false,
      unbindAlipayDialogVisible: false,
      bindAlipayDialogVisible: false,
      bindPhoneDialogVisible: false,
      userAvatar: require("../../../assets/combo.jpg"),
      platform: "", //‘zl’ -知了 ‘xys’-校易收
      smCode: "",
      alipayStatus: "",
      userName: "",
      userPhone: "",
      bindingTimer: null
    };
  },
  components: {
    VerifyPhone,
    ModifyPhone,
    ModifyPwd,
    unBindAlipay,
    bindAlipay,
    BindPhone
  },
  computed: {
    uploadFileUrl() {
      return "";
    }
  },

  mounted() {
    //获取结构树
    // this.handleOrgInfo();
    this.getUserInfo();
  },

  methods: {
    getPlatform(platform) {
      this.platform = platform;
    },
    getUserInfo() {
      //获取登录账号信息
      let userDetail = this.getSStorage("userDetail");
      let userInfo = userDetail ? userDetail.userInfo : "";
      this.userName = userInfo ? userInfo.userName : "";
      this.userPhone = userInfo ? userInfo.phoneNum : "";
      if (window.sessionStorage.getItem("saas_token")) {
        this.platform = "zl";
        this.$http.post(this.$url.zlurl.getUserRefreshInfo).then(res => {
          if ("0000000" == res.rtnCode) {
            res.bizData.alipayUid
              ? (this.alipayStatus = "已绑定")
              : (this.alipayStatus = "未绑定");
            this.userPhone = res.bizData.mobile;
            this.verifyParams.phone = res.bizData.mobile;
            this.userName = res.bizData.userName;
            this.updateUserInfo()
          }
        });
      } else {
        this.platform = "xys";
        this.$http.get(this.$url.xysurl.accountInfo).then(res => {
          if (0 == res.status) {
            this.alipayStatus = res.data.alipayUserIdStatus;
            this.userPhone = res.data.mobile;
            this.verifyParams.phone = res.data.mobile;
            this.userName = res.data.nickName;
            this.updateUserInfo()
          }
        });
      }
    },

    updateUserInfo() {
      let userDetail = this.getSStorage("userDetail");
      userDetail.userInfo.userName = this.userName;
      userDetail.userInfo.phoneNum = this.userPhone;
      this.setSStorage("userDetail",userDetail);
    },
    handleOrgInfo() {
      if (this.orgInfo.child) {
        this.getSubOrg(this.orgInfo.child);
      }
    },
    getSubOrg(item) {
      this.orgInfoList.push(item.name);
      if (item.child) {
        this.getSubOrg(item.child);
      }
    },
    subOrgMarginLeft(index) {
      return index * 16 + "px";
    },
    verifyMobileSuccess(smCode) {
      this.verifyDialogVisible = false;
      if ("PHONE" == this.verifyParams.type) {
        this.modifyDialogVisible = true;
      } else if ("PWD" == this.verifyParams.type) {
        this.modifyPwdDialogVisible = true;
        this.smCode = smCode;
      } else if ("BIND" == this.verifyParams.type) {
        this.smCode = this.verifyParams.smsCode;
        this.bindPhoneDialogVisible = false;
        this.modifyPwdDialogVisible = true;
      }
    },
    /**
     * 修改手机号
     */
    modifyPhone() {
      this.verifyParams.type = "PHONE";
      this.verifyDialogVisible = true;
    },
    /**
     * 修改密码
     */
    modifyPwd() {
      this.verifyParams.type = "PWD";
      this.verifyDialogVisible = true;
    },
    /**
     * 绑定手机号
     */
    bindPhone() {
      this.verifyParams.type = "BIND";
      this.bindPhoneDialogVisible = true;
    },
    /**
     * 绑定手机号成功
     */
    bindModifyPwdSuccess() {
      this.modifyPwdDialogVisible = false;
      //获取用户信息
    },
    unbindAlipay() {
      this.unbindAlipayDialogVisible = true;
    },
    bindAlipay() {
      this.bindAlipayDialogVisible = true;
    },
    closeBindAlipay() {
      if (this.bindingTimer) {
        clearInterval(this.bindingTimer);
      }
      this.bindAlipayDialogVisible = false;
      this.getUserInfo();
    },

    /**
     * 绑定支付宝后，定时查询绑定状态
     */
    bindindAlipay(taskNo) {
      const that = this;
      this.bindingTimer = setInterval(() => {
        that.bindAlipayStatusRefresh(taskNo)
      }, 3000);
      this.bindAlipayStatusRefresh(taskNo)
    },
    bindAlipayStatusRefresh(taskNo) {
      if (this.platform == "zl") {
        this.$http.post(this.$url.zlurl.getBindAlipayId).then(res => {
          if ("0000000" == res.rtnCode && res.bizData) {
            this.closeBindAlipay()
          }
        }).catch(() => { });
      } else {
        this.$http.postFormData(this.$url.xysurl.isBindAlipay, { taskNo: taskNo }).then(res => {
          if (res && 0 == res.status) {
            this.closeBindAlipay()
          }
        });
      }
    },

    uploadUserInfo(imageUrl) {
      let params = {
        style: "",
        data: {
          imageUrl: imageUrl
        }
      };
      this.$http
        .post(this.$url.xysurl.yxbUploadUserInfo, {}, params)
        .then(res => {
          this.userAvatar = imageUrl;
        });
    },
    beforeDestroy() {
      if (this.bindingTimer) {
        clearInterval(this.bindingTimer);
      }
    },
    handleSuccess(data) {
      if (data && data.data.url) {
        this.uploadUserInfo(data.data.url);
      }
    },
    beforeAvatarUpload(file) {
      const isLt4M = file.size / 1024 / 1024 < 4;
      if (!isLt4M) {
        this.$message.error("上传图片大小不能超过 4MB!");
      }
      return isLt4M;
    },
    handlError(err, file, fileList) {
      this.$message.error("上传失败，请稍后再试!");
    },
    clearAlipay() {
      this.alipayStatus = "未绑定";
    }
  }
};
</script>

<style lang="scss" scoped>
.page {
  background: #f2f2f2 !important;
  padding: 0px !important;
  .page-content {
    background: #ffffff;
    display: flex;
    padding: 24px;
    flex-direction: column;
    height: 440px;
  }
  .left-content {
    margin-right: 12px;
    .user-info {
      display: flex;
      align-items: center;
      .avatar-container {
        width: 64px;
        height: 64px;
        > img {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          display: inline-block;
          text-align: center;
          overflow: hidden;
        }
      }
      .user-info-base {
        margin-left: 24px;
      }
    }
    .org-tip-container {
      margin-top: 32px;
      display: flex;
      align-items: center;
      .org-tip {
        border-left: 3px solid #008eff;
        height: 12px;
        margin-right: 8px;
      }
    }
    .org-container {
      margin-top: 16px;
      margin-left: 15px;
      .sub-org {
        margin-top: 8px;
        display: flex;
        align-items: center;

        .sub-org-tip {
          width: 4px;
          height: 4px;
          margin-right: 8px;
          background: #e5e5e5;
          border-radius: 9px;
        }
      }
    }
  }
  .right-content {
    // margin-left: 12px;
    .item-first {
      padding: 8px 0px 24px 0px;
    }
    .item {
      padding: 24px 0px;
    }
    .sub-container {
      display: flex;
      margin-right: 24px;
      justify-content: space-between;
      margin-top: 8px;
    }

    .line {
      width: 100%;
      height: 1px;
      background: #e7eaec;
    }
  }
  .title {
    font-size: 16px;
    color: #333333;
    font-weight: 500;
  }
  .des {
    font-size: 14px;
    color: #999999;
  }
  .btn {
    font-size: 14px;
  }
  .unbind-btn{
    color: #FF2660 !important;
  }
}
</style>
