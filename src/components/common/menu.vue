<template>
  <el-container>
    <div class="common-udesk-kf" id="common-udesk-kf">
      <img src="../../assets/image/customerService.png" width="56" height="132" alt />
    </div>
    <el-header>
      <div :class="[
          { 'logo-active': isCollapse, 'logo-default': !isCollapse },
          'logo'
        ]">
        <img :src="logoSrc" :class="{ active: isCollapse, default: !isCollapse }" />
      </div>

      <span @click="switchCollapse" :class="[
          {
            'iconfont icon-shousuodaohang': !isCollapse,
            'iconfont icon-shousuodaohang1': isCollapse
          },
          'collapse'
        ]"></span>
      <ul class="sys-nav">
        <li :class="{ active: level1Path == item.path }" @click="gotoPage(item, index)" v-for="(item, index) in $store.state.navs.filter(
            n => n.type == '1' && n.isResident === '1'
          )" :key="index" v-if="!item.hide && !item.noPermission">{{ $t(item.name) }}</li>
      </ul>
      <span class="sys-operate">
        <el-popover v-if="productCode !== 'XYS'" placement="bottom" width="594" trigger="hover">
          <myAppDialog></myAppDialog>
          <div class="moreApp" slot="reference">
            <span class="iconfont icon-gengduo1"></span>
            <span>更多应用</span>
          </div>
        </el-popover>

        <div class="schoolList" ref="schoolListRef" @click="alertSchoolModel()">
          <span class="switchLang">
            <span class="iconfont icon-xuexiao"></span>
            <span>
              {{
              curSchool.schoolName
              ? curSchool.schoolName
              : orgRoleInfo.name || orgRoleInfo.organizationName
              }}
            </span>
          </span>
        </div>
        <div @click="goToNews">
          <el-badge :value="newsNum" :max="10" class="message">
            <i class="iconfont icon-xiaoxizhongxin"></i>
          </el-badge>
        </div>

        <el-dropdown trigger="click" ref="userNameRef" @command="handleUserCommand">
          <span class="switchLang">
            <span class="iconfont icon-account"></span>
            <span>{{ userName }}</span>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="setting">个人设置</el-dropdown-item>
            <el-dropdown-item command="exit">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>

        <!-- <el-dropdown
          trigger="click"
          @command="switchLang"
        >
          <span class="switchLang">
            <span class="iconfont icon-lan"></span>
            <span>{{ $i18n.locale == "zh" ? "中文" : "English" }}</span>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
              :class="{ 'is-active': $i18n.locale == 'zh' }"
              command="zh"
            >中文</el-dropdown-item>
            <el-dropdown-item
              :class="{ 'is-active': $i18n.locale == 'en' }"
              command="en"
            >English</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>-->
      </span>
      <message ref="message"></message>
      <change-school-model :school-info="schoolInfo" @switchSchool="switchSchool" @getSchoolInfo="getSchoolInfo" :component-visible.sync="changeSchoolVisible">
      </change-school-model>
    </el-header>
    <div class="sys-menu">
      <!-- 强刷新 -->
      <router-view></router-view>
    </div>

    <!-- 校易收新功能引导 start -->
    <div class="xys-new-feature-notify" v-if="showNotifyStepOne" @click="closeNotifyMain">
      <div class="img-container">
        <i class="el-icon-close"></i>
        <img src="../../assets/image/xys-upgrade-notify/xysupgrade.png" alt="">
      </div>
    </div>
    <div class="new-feature-notify-two" v-if="showNotifyStepTwo">
      <div class="highlight-item-container">
        <span class="charge-highlight highlight-item"></span>
        <span class="teacher-management-highlight highlight-item"></span>
        <span class="ring-highlight highlight-item"></span>
      </div>
      <div class="arrow-item-container">
        <span class="charge-arrow arrow-item"></span>
        <span class="teacher-management-arrow arrow-item"></span>
        <span class="ring-arrow arrow-item"></span>
      </div>
      <div class="txt-item-container">
        <span class="charge-txt txt-item"></span>
        <span class="teacher-management-txt txt-item"></span>
        <span class="ring-txt txt-item"></span>
      </div>
      <div class="submit-btn" @click="showNotifyStepTwo=false"></div>
    </div>
    <!-- 校易收新功能引导 end -->

    <!-- 知了新功能引导 start -->
    <div class="xys-new-feature-notify" v-if="showZlNotifyStepOne" @click="closeZlNotifyMain">
      <div class="img-container">
        <i class="el-icon-close"></i>
        <img src="../../assets/image/xys-upgrade-notify/zlupgrade.png" alt="">
      </div>
    </div>
    <div class="new-feature-notify-two" v-if="showZlNotifyStepTwo">
      <div class="highlight-item-container">
        <span class="zlprogram-highlight highlight-item" :style="{right: schoolListWidth + 148 + 'px'}"></span>
        <span class="ring-highlight highlight-item"></span>
      </div>
      <div class="arrow-item-container">
        <span class="zlprogram-arrow arrow-item"></span>
        <span class="ring-arrow arrow-item"></span>
      </div>
      <div class="txt-item-container">
        <span class="zlprogram-txt txt-item"></span>
        <span class="zlring-txt txt-item"></span>
      </div>
      <div class="zl-submit-btn submit-btn" @click="setZLGuide()"></div>
    </div>
    <!-- 知了新功能引导 end -->
  </el-container>
</template>

<script>
import bus from "@/bus";
import util from "@/util";
import message from "./message";
import myAppDialog from "./myAppDialog";
import { mapMutations, mapGetters } from "vuex";
import changeSchoolModel from "./changSchool/changeSchoolModel";
import { debuglog } from 'util';
import UI from '@/http/ui';
import { Promise } from 'q';

export default {
  components: {
    message,
    myAppDialog,
    changeSchoolModel
  },
  data() {
    return {
      name: "",
      activeNav: 0,
      isCollapse: false,
      schoolInfo: [],
      curSchool: {},
      visualAppNum: 6,
      logoSrc: require("../../assets/splus.png"),
      changeSchoolVisible: false,
      orgRoleInfo: "",
      edupulsPath: "",
      userName: "",
      showNotifyStepOne: false,
      showNotifyStepTwo: false,
      showZlNotifyStepOne: false,
      showZlNotifyStepTwo: false,
      schoolListWidth: "",
      zlGuide: {
        childClass: true,
        childAttend: true,
        teacherEmployee: true,
        teacherPermissions: true,
        handleOrdinaryRecipes: true,
        dietSurvey: true,
        recipes: true,
        homeGuide: true
      }
    };
  },
  created() {
    this.getSchoolInfo();
    this.watchZlRouter();
  },
  mounted() {
    this.userName =
      this.getSStorage("userDetail") && this.getSStorage("userDetail").userInfo
        ? this.getSStorage("userDetail").userInfo.userName
        : "";
    this.controlUdeskShow();
    this.getUserInfo();
    this.schoolListWidth = this.$refs.schoolListRef.clientWidth;
  },
  computed: {
    ...mapGetters(["GET_NEWSNUMBER"]),
    level1Path() {
      return `/${this.$route.path.split("/")[2]}`;
    },
    newsNum() {
      let newsNum = this.$store.state.newsNumber;
      newsNum = newsNum > 0 ? newsNum : "";
      return newsNum;
    },
    productCode() {
      //获取学校标识
      return this.curSchool ? this.curSchool.source : "";
    }
  },
  watch: {
    productCode() {
      this.controlUdeskShow();
    }
  },
  methods: {
    ...mapMutations(["SET_NAVS", "SET_BATCHMANAGE"]),
    watchZlRouter() {
      let _self = this;
      // 接收传递过来的消息
      window.addEventListener(
        "message",
        e => {
          let zlHref = e.data;
          if (e.data === "logOutCurrentSaas") {
            //知了超时退出
            _self.clearToLogin();
          }
          if (e.data === "batchManage") {
            this.SET_BATCHMANAGE(true);
          }
          if (e.data == "xys-indexSetPid") {
            //校易收-设置校验项
            _self.$router.push(`/eduplus/noPid/indexNoPid`);
            return;
          }
          if (e.data == "xys-indexPage") {
            //切换到校易收首页
            _self.$router.push(`/eduplus/home/overview`);
            return;
          }
          if (/^\/(\w+\/?)+$/.test(zlHref)) {
            _self.edupulsPath = "";
            _self.matchEduplusPath(zlHref);
            //找到的路径和当前页面路径不匹配时，跳转找到路径
            if (
              _self.edupulsPath &&
              _self.$route.path != `/eduplus${_self.edupulsPath}`
            ) {
              _self.$router.push(`/eduplus${_self.edupulsPath}`);
            }
          }
        },
        false
      );
    },
    matchEduplusPath(zlHref) {
      let source = this.getSStorage("menu_list");
      if (source) {
        this.recursiveFindPath(source, zlHref);
      }
    },
    recursiveFindPath(source, zlHref) {
      for (let i = 0; i < source.length; i++) {
        let item = source[i];
        if (item.href && item.href == zlHref) {
          this.edupulsPath = item.path;
          break;
        } else {
          if (item.children && item.children.length) {
            this.recursiveFindPath(item.children, zlHref);
          } else {
            continue;
          }
        }
      }
    },
    getSchoolInfo() {
      if (this.getSg("accountModalType") == "isGroup") {
        this.orgRoleInfo = this.getSStorage("orgRoleInfo");
        this.curSchool = {};
      } else {
        this.schoolInfo = this.getSStorage("school_list");
        this.curSchool =
          this.getSStorage("saas_currentSchool") || this.schoolInfo[1];
        this.curSchool.schoolId = this.curSchool.schoolNo;
      }
      this.$refs.message && this.$refs.message.restMQTT();
      if (this.productCode === "XYS") {
        this.initUdesk();
        this.$http.post(this.$url.xysurl.firstLogin).then(res => {
          if (0 == res.status && res.data && res.data == "true") {
            this.showNotifyStepOne = true;
          }
        });
      } else {
        //获取知了引导信息
        this.$http.post(this.$url.zlurl.getUserGuide).then(res => {
          if ("0000000" == res.rtnCode) {
            if (
              !res.bizData.content ||
              (res.bizData.content &&
                JSON.stringify(res.bizData.content) == "{}")
            ) {
              //所有引导都没有展示过
              //需要展示首页guide
              this.showZlNotifyStepOne = true;
            } else {
              this.zlGuide = res.bizData.content;
              if (
                undefined == res.bizData.content.homeGuide ||
                res.bizData.content.homeGuide == true
              ) {
                //需要展示首页guide
                this.showZlNotifyStepOne = true;
              }
            }
          }
        });
      }
    },
    //设置知了引导信息
    setZLGuide() {
      this.showZlNotifyStepTwo = false;
      this.zlGuide.homeGuide = false;
      this.$http.post(
        this.$url.zlurl.addUserGuide,
        {},
        { content: this.zlGuide }
      );
    },
    closeNotifyMain() {
      this.showNotifyStepOne = false;
      this.showNotifyStepTwo = true;
    },
    closeZlNotifyMain() {
      this.showZlNotifyStepTwo = true;
      this.showZlNotifyStepOne = false;
    },
    alertSchoolModel() {
      this.changeSchoolVisible = true;
    },
    switchSchool(command) {
      //获取当前学校信息
      const oldSchool = this.curSchool;
      const oldSchoolSg = this.getSStorage("saas_currentSchool");
      this.curSchool = command;
      if (oldSchool.schoolNo != command.schoolNo) {
        window.sessionStorage.setItem(
          "saas_currentSchool",
          JSON.stringify({
            ...command,
            schoolId: command.schoolId,
            schoolNo: command.schoolId,
          })
        );

        if (command.source == "XJJ") {
          util.zlSwitchSchool(command).then(() => {
            this.changeSchoolVisible = false;
          });
          this.$router.push("/xx");
        } else if (command.source == "XYS") {
          util.xysSwitchSchool().then(res => {
            if (res.status === 0) {
              this.initUdesk();
            }

            if (res.status !== 0 && res.status !== 42) {
              return Promise.reject(res);
            }
            
            // 查询菜单
            return util.getMenuList();
          }).then(res => {
            if (res.status !== 0) {
              // 重置当前学校
              window.sessionStorage.setItem(
                "saas_currentSchool",
                JSON.stringify(oldSchoolSg)
              );
              this.curSchool = oldSchool;
              return Promise.reject(res);
            }

            this.changeSchoolVisible = false;
            this.$router.push("/xx");
          }).catch(err => {
            if (err) {
              UI.toastError(err.message);
            }
          });
        }
      } else {
        this.changeSchoolVisible = false;
      }
      this.$refs.message && this.$refs.message.restMQTT();
    },
    switchCollapse() {
      this.isCollapse = !this.isCollapse;
      if (this.isCollapse) {
        this.logoSrc = require("../../assets/splus-mini.png");
      } else {
        this.logoSrc = require("../../assets/splus.png");
      }
      bus.$emit("isCollapse", this.isCollapse);
    },
    switchLang(command) {
      this.$i18n.locale = command;
    },
    gotoPage(item, index) {
      this.activeNav = index;
      this.$router.push(`/eduplus${item.path}`);
    },
    handleUserCommand(command) {
      if ("setting" == command) {
        this.$router.push("/eduplus/setting/account");
      } else if ("exit" == command) {
        //退出操作
        this.signout();
      }
    },
    signout() {
      this.$confirm(
        this.$t("frame.signout.prompt"),
        this.$t("common.signout")
      ).then(() => {
        //退出清理
        this.logout();
      });
    },

    configSys() {
      this.$notify({
        title: this.$t("common.warn"),
        message: "配置功能尚未设计",
        type: "warning"
      });
    },
    goToNews() {
      this.$router.push("/eduplus/news/newsCenter");
    },
    /**
     * 客服按钮是否显示：校易收学校才显示
     */
    controlUdeskShow() {
      if (this.productCode === "XYS") {
        document.getElementById("common-udesk-kf")
          ? (document.getElementById("common-udesk-kf").style.display = "block")
          : "";
      } else {
        document.getElementById("common-udesk-kf")
          ? (document.getElementById("common-udesk-kf").style.display = "none")
          : "";
      }
    },
    initUdesk() {
      let that = this;
      window.__udeskApiInit = false;
      window.UdeskApiObject = null;
      window.ud = null;
      (function(a, h, c, b, f, g) {
        a["UdeskApiObject"] = f;
        a[f] =
          a[f] ||
          function() {
            (a[f].d = a[f].d || []).push(arguments);
          };
        g = h.createElement(c);
        g.async = 1;
        g.charset = "utf-8";
        g.src = b;
        g.id = "eduplusCustomer";
        c = h.getElementsByTagName(c)[0];
        c.parentNode.insertBefore(g, c);
      })(
        window,
        document,
        "script",
        `https://assets-cli.udesk.cn/im_client/js/udeskApi.js`,
        "ud"
      );
      if (document.getElementById("eduplusCustomer")) {
        var nonce = randomWord(false, 16);
        var timestamp = new Date().getTime();
        var sign_str =
          "nonce=" +
          nonce +
          "&timestamp=" +
          timestamp +
          "&web_token=" +
          this.curSchool.schoolNo +
          "&36c40e8ba94d1846b7d5d8e3f3670cca";

        sign_str = hex_sha1(sign_str);

        sign_str = sign_str.toUpperCase();

        // 线上环境匹配正确的email 开发测试环境修改email后缀为test.com
        var createEmail =
          location.hostname === "web.imeduplus.com"
            ? this.curSchool.schoolNo + "@imzhiliao.com"
            : this.curSchool.schoolNo + "@test.com";
        var udConfig = {
          code: "280576kk",
          link: "https://cmkj.udesk.cn/im_client/?web_plugin_id=44574",
          mode: "inner",
          targetSelector: ".common-udesk-kf",
          color: "#008EFF",
          pos_flag: "crb",
          customer: {
            nonce: nonce,
            signature: sign_str,
            timestamp: timestamp,
            web_token: this.curSchool.schoolNo,
            c_name: this.curSchool.schoolName,
            c_cf_ID: this.curSchool.schoolNo,
            // c_email c_phone web_token匹配。web_token不能在uDesk自定义生成，所以只能通过
            // email 或者 phone 去匹配信息，
            c_email: createEmail
            // "c_phone": schoolInfo.data.telephone
          },
          onlineText: "联系客服，在线咨询",
          offlineText: "客服下班，请留言",
          panel: {
            css: {
              top: "100px",
              right: "40px",
              color: "#008EFF"
            }
          },
          onReady: function() {
            that.controlUdeskShow();
          }
        };
        ud(udConfig);
        // ud.init();
      }
      /*
      ** randomWord 产生任意长度随机字母数字组合
      ** randomFlag-是否任意长度 min-任意长度最小位[固定位数] max-任意长度最大位
      */
      function randomWord(randomFlag, min, max) {
        var str = "",
          range = min,
          pos,
          arr = [
            "0",
            "1",
            "2",
            "3",
            "4",
            "5",
            "6",
            "7",
            "8",
            "9",
            "a",
            "b",
            "c",
            "d",
            "e",
            "f",
            "g",
            "h",
            "i",
            "j",
            "k",
            "l",
            "m",
            "n",
            "o",
            "p",
            "q",
            "r",
            "s",
            "t",
            "u",
            "v",
            "w",
            "x",
            "y",
            "z",
            "A",
            "B",
            "C",
            "D",
            "E",
            "F",
            "G",
            "H",
            "I",
            "J",
            "K",
            "L",
            "M",
            "N",
            "O",
            "P",
            "Q",
            "R",
            "S",
            "T",
            "U",
            "V",
            "W",
            "X",
            "Y",
            "Z"
          ];

        // 随机产生
        if (randomFlag) {
          range = Math.round(Math.random() * (max - min)) + min;
        }
        for (var i = 0; i < range; i++) {
          pos = Math.round(Math.random() * (arr.length - 1));
          str += arr[pos];
        }
        return str;
      }

      var hexcase = 0; /* hex output format. 0 - lowercase; 1 - uppercase        */

      var chrsz = 8; /* bits per input character. 8 - ASCII; 16 - Unicode      */

      /*
      * The main function to calculate message digest
      */

      function hex_sha1(s) {
        return binb2hex(core_sha1(AlignSHA1(s)));
      }

      /*
      * Perform a simple self-test to see if the VM is working
      */

      function sha1_vm_test() {
        return hex_sha1("abc") == "a9993e364706816aba3e25717850c26c9cd0d89d";
      }

      /*
      * Calculate the SHA-1 of an array of big-endian words, and a bit length
      */

      function core_sha1(blockArray) {
        var x = blockArray; //append padding

        var w = Array(80);

        var a = 1732584193;

        var b = -271733879;

        var c = -1732584194;

        var d = 271733878;

        var e = -1009589776;

        for (
          var i = 0;
          i < x.length;
          i += 16 //每次处理512位 16*32
        ) {
          var olda = a;

          var oldb = b;

          var oldc = c;

          var oldd = d;

          var olde = e;

          for (
            var j = 0;
            j < 80;
            j++ //对每个512位进行80步操作
          ) {
            if (j < 16) w[j] = x[i + j];
            else w[j] = rol(w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16], 1);

            var t = safe_add(
              safe_add(rol(a, 5), sha1_ft(j, b, c, d)),

              safe_add(safe_add(e, w[j]), sha1_kt(j))
            );

            e = d;

            d = c;

            c = rol(b, 30);

            b = a;

            a = t;
          }

          a = safe_add(a, olda);

          b = safe_add(b, oldb);

          c = safe_add(c, oldc);

          d = safe_add(d, oldd);

          e = safe_add(e, olde);
        }

        return new Array(a, b, c, d, e);
      }

      /*
      * Perform the appropriate triplet combination function for the current iteration
      * 返回对应F函数的值
      */

      function sha1_ft(t, b, c, d) {
        if (t < 20) return (b & c) | (~b & d);

        if (t < 40) return b ^ c ^ d;

        if (t < 60) return (b & c) | (b & d) | (c & d);

        return b ^ c ^ d; //t<80
      }

      /*
      * Determine the appropriate additive constant for the current iteration
      * 返回对应的Kt值
      */

      function sha1_kt(t) {
        return t < 20
          ? 1518500249
          : t < 40
            ? 1859775393
            : t < 60
              ? -1894007588
              : -899497514;
      }

      /*
      * Add integers, wrapping at 2^32. This uses 16-bit operations internally
      * to work around bugs in some JS interpreters.
      * 将32位数拆成高16位和低16位分别进行相加，从而实现 MOD 2^32 的加法
      */

      function safe_add(x, y) {
        var lsw = (x & 0xffff) + (y & 0xffff);

        var msw = (x >> 16) + (y >> 16) + (lsw >> 16);

        return (msw << 16) | (lsw & 0xffff);
      }

      /*
      * Bitwise rotate a 32-bit number to the left.
      * 32位二进制数循环左移
      */

      function rol(num, cnt) {
        return (num << cnt) | (num >>> (32 - cnt));
      }

      /*
      * The standard SHA1 needs the input string to fit into a block
      * This function align the input string to meet the requirement
      */

      function AlignSHA1(str) {
        var nblk = ((str.length + 8) >> 6) + 1,
          blks = new Array(nblk * 16);

        for (var i = 0; i < nblk * 16; i++) blks[i] = 0;

        for (i = 0; i < str.length; i++)
          blks[i >> 2] |= str.charCodeAt(i) << (24 - (i & 3) * 8);

        blks[i >> 2] |= 0x80 << (24 - (i & 3) * 8);

        blks[nblk * 16 - 1] = str.length * 8;

        return blks;
      }

      /*
      * Convert an array of big-endian words to a hex string.
      */

      function binb2hex(binarray) {
        var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";

        var str = "";

        for (var i = 0; i < binarray.length * 4; i++) {
          str +=
            hex_tab.charAt(
              (binarray[i >> 2] >> ((3 - (i % 4)) * 8 + 4)) & 0xf
            ) + hex_tab.charAt((binarray[i >> 2] >> ((3 - (i % 4)) * 8)) & 0xf);
        }

        return str;
      }
    },
    getUserInfo() {
      //校易收用户需要通过接口获取用户信息（userName）
      let token = this.getSStorage("saas_token") || "";
      let xysToken = this.getSStorage("_TOKEN_COOKIE") || "";
      if (!token && xysToken) {
        this.$http.get(this.$url.xysurl.accountInfo).then(res => {
          if (0 == res.status) {
            this.userName = res.data.nickName;
            let userDetail = this.getSStorage("userDetail");
            userDetail.userInfo.userName = res.data.nickName;
            userDetail.userInfo.phoneNum = res.data.mobile;
            this.setSStorage("userDetail", userDetail);
          }
        });
      }
    },
    clearToLogin() {
      this.$refs.message && this.$refs.message.clearMQTT();
      this.$root.bizData = null;
      window.sessionStorage.clear();
      window.localStorage.clear();
      if (document.getElementById("udesk_container")) {
        document.body.removeChild(document.getElementById("udesk_container"));
      }
      this.$router.push("/login");
    },
    logout() {
      //知了logou需要调接口
      let token = this.getSStorage("saas_token") || "";
      if (token) {
        this.$http.post(this.$url.zlurl.zlLogout).then(res => {
          if ("0000000" == res.rtnCode) {
            this.clearToLogin();
          }
        });
      } else {
        this.clearToLogin();
      }
    }
  }
};
</script>

<style lang="scss">
%red {
  color: #f56c6c;
}
%green {
  color: #67c23a;
}
%blue {
  color: #409eff;
}
%orange {
  color: #e6a23c;
}
%flex-center {
  display: flex;
  align-items: center;
}

%flex-center-middle {
  display: flex;
  align-items: center;
  justify-content: center;
}

.router-link-active {
  color: #3399ff;
  [class^="icon-"] {
    color: #3399ff !important;
  }
}

//占位隐藏
.holder-hide {
  visibility: hidden;
}
//占位显示
.holder-show {
  visibility: visible;
}

.sys-nav {
  margin: 0;
  height: 100%;
  font-weight: 500;
  li {
    list-style: none;
    margin: 0;
    float: left;
    display: block;
    padding: 0 16px;
    cursor: pointer;
    height: 100%;
    display: inline-flex;
    align-items: center;
    color: #b4ddff;
  }
  li.active {
    color: #ffffff;
    background-color: #0082e9;
  }
}

.el-header {
  height: 64px !important;
  color: #ffffff;
  background-color: #008eff;
  display: flex;
  align-items: center;
  padding-left: 0 !important;
  .moreApps {
    width: 50px;
    cursor: pointer;
    color: #ffffff;
    text-align: center;
  }
  .collapse {
    margin-left: 20px;
    cursor: pointer;
    font-size: 20px;
  }
  .logo {
    height: 100%;
    @extend %flex-center-middle;
    img.active {
      height: 24px;
      width: 40px;
    }

    img.default {
      height: 24px;
      width: 130px;
    }
  }
  .logo-active {
    width: 64px;
    min-width: 64px;
  }

  .logo-default {
    width: 184px;
    min-width: 184px;
  }
  .sys-operate {
    margin-left: auto;
    font-size: 14px;
    @extend %flex-center;
    .switchLang {
      @extend %flex-center;
      cursor: pointer;
    }
    .el-badge.message {
      margin: 0 12px;
      cursor: pointer;
      font-size: 18px;
    }
    .iconfont {
      margin: 0 8px;
      font-size: 18px;
      cursor: pointer;
    }
    .el-dropdown {
      color: #ffffff;
    }
  }
}

.el-container {
  height: 100%;
  .el-scrollbar {
    background-color: #ffffff;
    border-right: none;
    width: 184px;
    .el-scrollbar__wrap {
      overflow-x: hidden;
      .el-scrollbar__view {
        .el-aside {
          overflow: hidden;
          .el-menu {
            border-right: none;
          }
        }
      }
    }
  }
  .sys-menu {
    height: calc(100% - 64px);
    .vue-friendly-iframe {
      // width: 100%;
      iframe {
        height: 100%;
        width: 100%;
        border: none;
        min-height: 76vh;
      }
    }
    .sys-content {
      // overflow: hidden !important;
      overflow-y: hidden;
      width: 100%;
      // height: 100%;
      background-color: #f2f2f2;
      display: flex;
      flex-direction: column !important;
      overflow: auto;
      .separated {
        display: flex;
        justify-content: center;
      }
      &-breadcrumb {
        display: flex;
        align-items: center;
        background-color: #ffffff;
        .return-router {
          cursor: pointer;
          height: 16px;
          width: 16px;
          margin-right: 24px;
          color: #606266;
          background-image: url("../../assets/icon-back.png");
        }
        .service-phone {
          margin-right: 16px;
          font-size: 13px;
          color: #999;
        }
      }
      &-page {
        height: calc(100% - 72px);
        overflow-y: auto;
        background-color: #ffffff;
        margin: 16px;
        padding: 16px;
        .el-table {
          .red {
            @extend %red;
            cursor: pointer;
            margin-left: 10px;
          }
          .blue {
            @extend %blue;
            cursor: pointer;
            margin-left: 10px;
          }
          .orange {
            @extend %orange;
            cursor: pointer;
            margin-left: 10px;
          }
          .green {
            @extend %green;
            cursor: pointer;
            margin-left: 10px;
          }
        }
        .el-pagination {
          text-align: right;
          padding: 10px;
        }
      }
      .el-container {
        padding: 10px;
      }
      .el-breadcrumb {
        flex: 1;
        background-color: #ffffff;
        margin-bottom: 10px;
        padding: 13px;
        .crumb {
          &-path {
            cursor: pointer;
          }
          &-cur {
            opacity: 0.5;
          }
        }
      }
    }
  }
}
.moreApp {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  > .icon {
    margin: 0px !important;
  }
  > span {
    margin: 0px 5px;
    font-size: 14px;
  }
}
.common-udesk-kf {
  position: fixed;
  bottom: 10px;
  right: 10px;
  z-index: 999;
}

.xys-new-feature-notify {
  z-index: 20009;
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  .img-container {
    position: relative;
    top: 15%;
    left: 50%;
    margin-left: -300px;
    width: 600px;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.3);
    .el-icon-close {
      position: absolute;
      top: 10px;
      right: 10px;
      font-size: 20px;
      color: #fff;
      cursor: pointer;
    }
    img {
      display: block;
      width: 600px;
    }
  }
}
.new-feature-notify-two {
  z-index: 2007;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.5);
  .highlight-item,
  .arrow-item,
  .txt-item {
    position: absolute;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
  }
  .highlight-item-container {
    position: relative;
    height: 64px;
    line-height: 64px;
    .highlight-item {
      height: 64px;
      &.charge-highlight {
        left: 295px;
        width: 103px;
        background-image: url("../../assets/image/xys-upgrade-notify/charge.png");
      }
      &.teacher-management-highlight {
        left: 480px;
        width: 104px;
        background-image: url("../../assets/image/xys-upgrade-notify/teacherManage.png");
      }
      &.ring-highlight {
        right: 98px;
        width: 49px;
        background-image: url("../../assets/image/xys-upgrade-notify/rings.png");
      }
      &.zlnav-highlight {
        left: 0;
        width: 822px;
        background-image: url("../../assets/image/xys-upgrade-notify/zlnav.png");
      }
      &.zlprogram-highlight {
        right: 260px;
        width: 126px;
        background-image: url("../../assets/image/xys-upgrade-notify/zlprogram.png");
      }
    }
  }
  .arrow-item-container {
    position: relative;
    margin: 10px 0 20px;
    height: 128px;
    .arrow-item {
      height: 128px;
      &.charge-arrow {
        left: 325px;
        width: 136px;
        background-image: url("../../assets/image/xys-upgrade-notify/teacherManageArrow.png");
      }
      &.teacher-management-arrow {
        left: 520px;
        width: 136px;
        background-image: url("../../assets/image/xys-upgrade-notify/teacherManageArrow.png");
      }
      &.ring-arrow {
        right: 120px;
        width: 137px;
        background-image: url("../../assets/image/xys-upgrade-notify/ringsArrow.png");
      }
      &.zlnav-arrow {
        left: 470px;
      }
      &.zlprogram-arrow {
        right: 320px;
        width: 136px;
        background-image: url("../../assets/image/xys-upgrade-notify/ringsArrow.png");
      }
    }
  }
  .txt-item-container {
    position: relative;
    height: 22px;
    .txt-item {
      height: 22px;
      &.charge-txt {
        top: 8px;
        left: 350px;
        width: 174px;
        background-image: url("../../assets/image/xys-upgrade-notify/chargeTxt.png");
      }
      &.teacher-management-txt {
        top: 8px;
        left: 580px;
        width: 221px;
        background-image: url("../../assets/image/xys-upgrade-notify/teacherManageTxt.png");
      }
      &.ring-txt {
        right: 120px;
        width: 271px;
        height: 52px;
        background-image: url("../../assets/image/xys-upgrade-notify/ringsTxt.png");
      }
      &.zlnav-txt {
        left: 550px;
      }
      &.zlprogram-txt {
        right: 380px;
        width: 223px;
        height: 52px;
        background-image: url("../../assets/image/xys-upgrade-notify/zlprogramTxt.png");
      }
      &.zlring-txt {
        right: 120px;
        width: 223px;
        height: 52px;
        background-image: url("../../assets/image/xys-upgrade-notify/zlringTxt.png");
      }
    }
  }
  .submit-btn {
    cursor: pointer;
    width: 153px;
    height: 46px;
    margin-top: 50px;
    margin-left: 55%;
    background: url("../../assets/image/xys-upgrade-notify/gotItBtn.png")
      no-repeat center;
    background-size: contain;
  }
  .zl-submit-btn {
    margin-left: 70%;
  }
}
</style>
