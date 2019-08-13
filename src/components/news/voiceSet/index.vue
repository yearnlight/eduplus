<template>
  <el-container>
    <el-header style="background-color:#fff;padding:50px 20px;">
      <div style="width:100%;padding:20px;display:flex;flex-direction:row;justify-content:space-betwen;align-items:center;border-bottom:1px solid #ececec;">
        <div style="flex:1">
          <p class="title">收款语音播报</p>
          <p class="des">支付成功后播放语音提示</p>
        </div>
        <div style="height:100%">
          <switch-button
            :value="value"
            :labels="{checked: '开', unchecked: '关'}"
            :sync="true"
            @change="switchChange"
          ></switch-button>
        </div>
      </div>
    </el-header>
    <el-main></el-main>
  </el-container>
</template>

<script>
import SwitchButton from '../../common/SwitchButton'
export default {
  components: { SwitchButton },
  data() {
    return {
      value: false,
      type: '' // zl -> 知了 xys -> 校易收
    };
  },
  mounted() {
    const zhiliao = this.getSg("saas_token"); // 知了
    const xys = this.getSg("_TOKEN_COOKIE"); // 校易收
    if (zhiliao) {
      // 知了账号
      this.type = 'zl'
      this.getSwitchStatus();
    } else {
      // 校易收账号
      this.type = 'xys'
      this.getSwitchStatusXYS()
    }
  },
  methods: {
    getSwitchStatusXYS() {
      this.$http
        .post("/xys_api/user/info", {}, {}, "application/x-www-form-urlencoded")
        .then(res => {
          const flag = res.data.pushStatus
          if (flag == 'OFF') {
            this.value = false
          } else if (flag == 'ON') {
            this.value = true
          }
        })
    },
    getSwitchStatus() {
      const data = {
        configKey: "EDU_SAAS_VISIT"
      };
      this.$http
        .post("/zl_api/uc/user/getUserSetting", {}, data, "application/json")
        .then(res => {
          if (res.rtnCode === "0000000") {
            if (!res.bizData.s || res.bizData.s == 0) {
              this.value = false;
            } else {
              this.value = true;
            }
          }
        });
    },
    switchChange(status) {
      let flag = status.value
      if (this.type == 'zl') {
        let data = {
          configKey: "EDU_SAAS_VISIT",
          configValue: flag ? 1 : 0
        };
        this.$http
          .post("/zl_api/uc/user/setUserSetting", {}, data, "application/json")
          .then(res => { });
      } else if (this.type == 'xys') {
        let data = {
          status: flag ? 'ON' : 'OFF'
        }
        this.$http
          .postFormData("/xys_api/push/config", data)
          .then(res => { })
      }
    },
  }
};
</script>

<style>
.row {
  width: 100%;
  padding: 20px;
  display: flex;
  flex-direction: row;
  justify-content: space-betwen;
  align-items: center;
  border-bottom: 1px solid #ececec;
}
.title {
  font-weight: 500;
  color: #333;
  font-size: 16px;
}
.des {
  color: #666;
  font-size: 14px;
}
</style>
