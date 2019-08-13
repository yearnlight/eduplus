<template>
  <base-model
    :title="title"
    :dialog-visible.sync="dialogVisible"
    :handle-close="handleClose"
    :handle-confirm="handleConfirm"
    custom-class="changeSchoolClass"
  >
    <el-row v-if="backGroupBtn" id="backGroup">
      <el-col :span="2" class="btn-bottom">
        <el-button size="small" type="primary" plain @click="backGroupSchool()"><< 返回集团园</el-button>
      </el-col>
    </el-row>
    <div
      class="change-school-header identityHeader"
      id="change-identity"
      v-if="multiplieLists.length"
    >
      <div class="change-school-title">
        <el-row>
          <el-col :span="24">
            <b class="icon-line"></b>
            <span class="title-header">身份切换</span>
          </el-col>
        </el-row>
      </div>
      <div class="school-lists">
        <span
          class="school-item"
          :class="{ active: item.organizationCode == isActive }"
          v-for="(item, index) in multiplieLists"
          :key="index"
          @click="changeIdentity(item)"
        >{{ item.organizationName }}</span>
      </div>
    </div>
    <div class="change-school-header" id="change-school">
      <div class="change-school-title">
        <el-row>
          <el-col :span="12">
            <div class="grid-content bg-purple-dark">
              <b class="icon-line"></b>
              <span class="title-header mr16">学校切换</span>

              <span class="mr8 showOrganization" v-if="currentSchoolSwitchMode">显示机构</span>
              <switch-button
                v-if="currentSchoolSwitchMode"
                :value="switchValue"
                :labels="{checked: '开', unchecked: '关'}"
                :sync="true"
                @change="switchOff"
              ></switch-button>
              <!-- <el-switch
                v-if="currentSchoolSwitchMode"
                v-model="switchValue"
                active-color="#008EFF"
                @change="switchOff()"
                inactive-color="#ccc"
              ></el-switch>-->
            </div>
          </el-col>
          <div v-if="currentSchoolSwitchMode">
            <el-col :span="8" class="mr16">
              <div class="grid-content bg-purple-dark">
                <el-input
                  placeholder="请输入内容"
                  prefix-icon="el-icon-search"
                  v-model="schoolName"
                  @input="searchSchool(schoolName)"
                ></el-input>
              </div>
            </el-col>
            <el-col :span="2">
              <el-button
                size="small"
                type="primary"
                class="search"
                @click="searchSchool(schoolName)"
              >搜索</el-button>
            </el-col>
          </div>
        </el-row>
      </div>

      <div
        v-if="currentSchoolSwitchMode"
        :class="{'schoolContent':!backGroupBtn,'schoolContent2':backGroupBtn}"
      >
        <div class="school-data" v-if="switchValue">
          <div v-if="schoolAllList.length">
            <div v-for="(schoolByOrg, item) in schoolAllList" :key="item">
              <div
                v-for="(schoolList, index) in schoolByOrg"
                :key="index"
                class="org-out-container"
              >
                <div class="school-lists-title">{{ index }}</div>
                <div class="school-lists">
                  <span
                    class="school-item"
                    :class="{ active: currentSchoolActive == school.schoolId }"
                    v-for="(school,inx) in schoolList"
                    :key="inx"
                    @click="checkSchool(school)"
                  >{{ school.schoolName }}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="no-data-text" v-if="!schoolAllList.length">
            <i class="iconfont icon-Sadface"></i>没有数据
          </div>
        </div>
        <div v-if="!switchValue">
          <div v-if="schoolAllList.length">
            <div v-for="(schoolList, index) in schoolAllList" :key="index">
              <div class="school-lists-title">{{ schoolList.key }}</div>
              <div class="school-lists">
                <span
                  class="school-item"
                  :class="{ active: currentSchoolActive == school.schoolId }"
                  v-for="(school, index) in schoolList.value"
                  :key="index"
                  @click="checkSchool(school)"
                >{{ school.schoolName }}</span>
              </div>
            </div>
          </div>
          <span v-if="!schoolAllList.length" class="text-center">没有数据</span>
        </div>
      </div>
      <div class="school-lists" v-if="!currentSchoolSwitchMode">
        <span
          class="school-item"
          :class="{ active: currentSchoolActive == item.schoolId }"
          v-for="(item, index) in schoolInfo"
          :key="index"
          @click="selectSchool(item)"
        >{{ item.schoolName }}</span>
      </div>
    </div>
  </base-model>
</template>

<script>
import SwitchButton from "../../common/SwitchButton";
import URL from "@/http/url";
import Util from "@/util";
export default {
  name: "changeSchoolModel",
  components: { SwitchButton },
  data() {
    return {
      dialogVisible: this.componentVisible,
      title: "",
      switchValue: true,
      schoolName: "",
      // 多身份列表
      multiplieLists: [],
      // 原始学校 列表
      originSchoolList: "",
      orgRelustMap: [],
      schoolAllList: [],
      currentSchoolSwitchMode: false,
      // 标识 是否返回集团园
      backGroupBtn: false,
      isActive: "",
      currentSchoolActive: ""
    };
  },
  props: {
    componentVisible: {
      type: Boolean,
      default: false
    },
    schoolInfo: {
      type: Array,
      default: []
    }
  },
  beforeCreate() {},
  created() {
    // 多身份列表
    this.multiplieLists = this.getSStorage("multiplieLists") || [];
    if (this.multiplieLists.length) {
      this.isActive = this.multiplieLists[0].organizationCode;
    }
    this.originSchoolList = this.getSStorage("originSchoolList");
    this.backGroupBtn = this.getSg("groupCode");

    //
    // 这是 集团园过来需要 拉取集团列表
    if (this.getSg("accountModalType") == "isGroup") {
      this.currentSchoolSwitchMode = true;
      this.getSchoolLists();
    }
    if (this.originSchoolList) {
      this.currentSchoolSwitchMode = true;
      this.orgRelustMap = this.originSchoolList.orgRelustMap;
      this.pyMap = this.originSchoolList.pyMap;
      this.schoolAllList = this.orgRelustMap;
    }
  },
  watch: {
    componentVisible() {
      this.dialogVisible = this.componentVisible;

      // 如果是多身份时 不显示 返回按钮
      // if (this.getSStorage("multiplieLists")) {
      //   this.backGroupBtn = "";
      // }
      let orgRoleInfo = this.getSStorage("orgRoleInfo");
      if (orgRoleInfo) {
        this.isActive = orgRoleInfo.organizationCode || orgRoleInfo.code;
      }
      if (this.getSg("accountModalType") == "isGroup") {
        this.currentSchoolSwitchMode = true;
        this.getSchoolLists();
      }
      if (this.getSStorage("saas_currentSchool")) {
        this.currentSchoolActive = this.getSStorage(
          "saas_currentSchool"
        ).schoolId;

        this.backGroupBtn = this.getSg("groupCode");
      } else {
        this.currentSchoolActive = "";
        this.backGroupBtn = false;
      }
      this.switchValue = true;
      if (this.dialogVisible) {
        this.calcHt();
      }
    }
  },
  methods: {
    calcHt() {
      this.$nextTick(() => {
        let identityDom = document.getElementById("change-identity");
        let schoolDom = document.getElementById("change-school");
        let backGroupDom = document.getElementById("backGroup");
        let ht = identityDom ? identityDom.scrollHeight + 20 : 0;
        let bht = backGroupDom ? backGroupDom.scrollHeight : 0;
        schoolDom.style.height = `calc(100% - ${ht + bht}px)`;
      });
    },
    handleClose() {
      this.$emit("update:componentVisible", false);
    },
    handleConfirm() {
      this.handleClose();
    },
    // 点击切换 学校
    selectSchool(item) {
      this.$emit("switchSchool", item);
    },
    //  返回集团园
    backGroupSchool() {
      let groupCode = this.getSg("groupCode");
      this.removeSg("groupCode");
      if (groupCode) {
        this.setSg("code", groupCode);
        this.setSg("accountModalType", "isGroup");
        this.removeSg("saas_currentSchool");
        this.$router.push("/xx");
        this.dialogVisible = false;
        this.$emit("getSchoolInfo");
      }
    },
    // 这是知了集团园 切换学校
    checkSchool(school) {
      //该接口处理一些异常：1、单园没有版本（成功返回，内容为空） 2、单园版本未开始（返回异常码） 3、单园版本已到期（返回异常码
      this.$http
        .post(this.$url.zlurl.getSchoolSaasVersionV2, {
          schoolId: school.schoolId
        })
        .then(res => {
          if (res.bizData && res.bizData.length) {
            //该接口获取用户单园权限：如果返回权限为空，用户不能切换该园
            this.$http
              .post(this.$url.zlurl.findByUser, {
                schoolId: school.schoolId
              })
              .then(res => {
                if (
                  res.bizData &&
                  res.bizData &&
                  res.bizData.order &&
                  res.bizData.order.length > 0
                ) {
                  //用户有权限后才能切换
                  school.schoolNo = school.schoolId;
                  school.orgId = this.getSg("code") || this.getSg("groupCode");
                  school.productCode = "zl";
                  school.source = "XJJ";
                  this.setSStorage("saas_currentSchool", school);
                  this.setSg("accountModalType", "isSingle");
                  this.setSg("groupCode", school.orgId);
                  this.removeSg("menu_list");
                  this.$store.commit("SET_NAVS", []);
                  this.removeSg("code");
                  this.$store.commit("setLastSchoolInfo", "");
                  Util.zlSwitchSchool(school);
                  this.$router.push("/xx");
                  this.dialogVisible = false;
                  this.$emit("getSchoolInfo");
                } else {
                  this.$message.error("对不起,您没有查看该园的权限");
                }
              });
          } else {
            this.$message.error(
              "该分园的版本已经到期，请联系客服人员重新开通!"
            );
          }
        });
    },
    switchOff(status) {
      this.switchValue = status.value;
      if (this.switchValue) {
        // 机构模式
        this.schoolAllList = this.orgRelustMap;
      } else {
        // 字母模式
        this.schoolAllList = this.pyMap;
      }
      this.searchSchool(this.schoolName);
    },
    // 切换集团园身份
    changeIdentity(item) {
      this.isActive = item.organizationCode;
      this.setSStorage("orgRoleInfo", item);
      this.setSg("code", item.organizationCode);
      this.setSg("accountModalType", "isGroup");
      this.removeSg("saas_currentSchool");
      // 重新设置机构 切换的内容
      var groupGardenInfo = this.getSStorage("groupGardenInfo");
      groupGardenInfo.currentOrg.name = item.organizationName;
      groupGardenInfo.currentOrg.type = item.type;
      groupGardenInfo.currentOrg.code = item.organizationCode;
      this.setSStorage("groupGardenInfo", groupGardenInfo);
      this.$store.commit("setLastSchoolInfo", "");
      this.$store.commit("CODE", "");
      this.$router.push("/xx");
      this.dialogVisible = false;
      this.$emit("getSchoolInfo");
    },
    async getSchoolLists() {
      let res = await this.$http.post(URL.zlurl.getOrgSchool);
      this.setSStorage("originSchoolList", res.bizData);
      this.originSchoolList = res.bizData;
      this.orgRelustMap = res.bizData.orgRelustMap;
      this.pyMap = res.bizData.pyMap;
      this.schoolAllList = this.orgRelustMap;
    },
    searchSchool(schoolName) {
      var resultObj = {};
      var resultArray = [];
      var showtype = this.switchValue;
      var typePatten = {
        true: "orgRelustMap",
        false: "pyMap"
      };
      var schoolListObj = this.originSchoolList[typePatten[showtype]];
      if (schoolName) {
        if (showtype) {
          for (var m = 0; m < schoolListObj.length; m++) {
            for (var key in schoolListObj[m]) {
              for (var i = 0; i < schoolListObj[m][key].length; i++) {
                if (
                  schoolListObj[m][key][i].schoolName.indexOf(schoolName) > -1
                ) {
                  resultObj = {};
                  resultObj[key] = [];
                  resultObj[key].push(schoolListObj[m][key][i]);
                  resultArray.push(resultObj);
                }
              }
            }
          }
          this.schoolAllList = resultArray; //机构排序下
        } else {
          for (var i = 0; i < schoolListObj.length; i++) {
            for (var j = 0; j < schoolListObj[i].value.length; j++) {
              if (
                schoolListObj[i].value[j].schoolName.indexOf(schoolName) > -1
              ) {
                if (!resultObj[schoolListObj[i].key]) {
                  resultObj[schoolListObj[i].key] = [];
                }
                resultObj[schoolListObj[i].key].push(schoolListObj[i].value[j]);
              }
            }
          }
          for (var key in resultObj) {
            var tempObj = {};
            tempObj.key = key;
            tempObj.value = resultObj[key];
            resultArray.push(tempObj);
          }
          this.schoolAllList = resultArray; //字母排序下
        }
      } else {
        this.schoolAllList = this.originSchoolList[typePatten[showtype]];
      }
    }
  }
};
</script>

<style lang="scss">
$font-color: #008eff;
%color {
  color: $font-color;
}
%school-content {
  .change-school-title {
    line-height: inherit;
    .icon-line {
      display: inline-block;
      width: 3px;
      height: 16px;
      background: $font-color;
      position: relative;
      top: 2px;
      margin-right: 7px;
    }
    .title-header {
      font-size: 18px;
      font-weight: 500;
      color: #000;
    }
  }
  .school-lists-title {
    margin: 20px 5px 0px 5px;
    font-size: 16px;
    font-weight: bold;
  }
  .school-lists {
    // margin: 20px 5px;
    .school-item {
      cursor: pointer;
      padding: 0 10px;
      display: inline-block;
      box-sizing: border-box;
      height: 40px;
      line-height: 40px;
      // margin-bottom: 14px;
      color: #666666;
      font-size: 14px;
      border: 1px solid #e4e7ed;
      border-radius: 4px;
      // margin-right: 16px;
      margin: 14px 16px 0px 0px;
      &:hover,
      &.active {
        color: $font-color;
        border-color: $font-color;
      }
    }
  }
}

.change-school-header {
  height: 100%;
  @extend %school-content;
}

.btn-bottom {
  margin-bottom: 18px;
}
.changeSchoolClass {
  height: 494px;
  overflow: auto;
  .el-dialog__header {
    height: 35px;
    line-height: 35px;
  }
  .el-dialog__body {
    border-top: 0;
    padding-top: 0px !important;
    height: calc(100% - 76px);
  }
}
.showOrganization {
  color: #999999;
}
.schoolContent {
  height: calc(100% - 32px);
  overflow-y: auto;
}
.schoolContent2 {
  height: calc(100% - 32px);
  overflow-y: auto;
}
.identityHeader {
  margin-bottom: 20px;
  height: auto !important;
}
.school-data {
  height: 100%;
  .no-data-text {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    .iconfont {
      font-size: 18px;
    }
  }
}
</style>
