<template>
  <div class="billrecycle">
    <div class="billrecycle-searchform">
      <el-form :inline="true" :model="params" label-width="100px">
        <el-row :gutter="20">
          <el-form-item label="账单日期:">
            <el-col :span="11">
              <el-form-item prop="startTime">
                <el-date-picker size="small" type="date" placeholder="开始日期" v-model="params.data.startTime" style="width: 100%;"></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col class="line" :span="2">-</el-col>
            <el-col :span="11">
              <el-form-item prop="endTime">
                <el-date-picker size="small" type="date" placeholder="结束日期" v-model="params.data.endTime" style="width: 100%;"></el-date-picker>
              </el-form-item>
            </el-col>
          </el-form-item>
          <el-form-item label="账单名称:">
            <el-input size="small" placeholder="请输入账单名称" clearable v-model="params.data.plaChargeMainName"></el-input>
          </el-form-item>
        </el-row>
        <el-row :gutter="20">

          <el-form-item label="班级:">
            <el-select v-model="params.data.chaClaName" clearable placeholder="请选择班级">
              <el-option v-for="item in classList" :key="item.classId" :label="item.className" :value="item.className">
              </el-option>
            </el-select>
            <!-- <el-input
              size="small"
              v-model="params.data.chaClaName"
              placeholder="请选择班级"
            ></el-input> -->
          </el-form-item>
          <el-form-item label="学生姓名:">
            <el-input size="small" v-model="params.data.chaStuName" placeholder="请输入学生姓名" clearable></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="list" :loading="queryLoading">查询</el-button>
            <el-button @click="resetForm">重置</el-button>
          </el-form-item>
        </el-row>
      </el-form>
    </div>
    <div class="billrecycle-table">
      <div class="billrecycle-table-operate">
        <el-button type="primary" size="mini" @click="clear">清空回收站</el-button>
      </div>
      <el-table :data="tableData" style="width: 100%">
        <el-table-column label="账单" prop="plaChargeMainNum,plaChargeMainName,payTypeExplain">
          <template slot-scope="scope">
            <p>单号：{{ scope.row.plaChargeMainNum }}</p>
            <p v-if="scope.row.plaChargeMainName">
              名称：{{ scope.row.plaChargeMainName }}
            </p>
            <p></p>
            <p v-if="scope.row.payTypeExplain">
              所属批次：{{ scope.row.payTypeExplain }}
            </p>
          </template>
        </el-table-column>
        <el-table-column prop="chaStuName" label="学生"></el-table-column>
        <el-table-column prop="chaClaName" label="班级"></el-table-column>
        <el-table-column prop="createDate,chaEffectDate,chaAlarmDate,schoolYearAndSemesterStr" label="日期">
          <template slot-scope="scope">
            <p v-if="scope.row.createDate">
              账单生成日期：{{ scope.row.createDate | formatDate("Y-m-d") }}
            </p>
            <p v-if="scope.row.chaEffectDate">
              收费生效日期：{{ scope.row.chaEffectDate | formatDate("Y-m-d") }}
            </p>
            <p v-if="scope.row.chaAlarmDate">
              收费到期日期：{{ scope.row.chaAlarmDate | formatDate("Y-m-d") }}
            </p>
            <p v-if="scope.row.endTime">
              收缴截止日期：{{ scope.row.endTime | formatDate("Y-m-d") }}
            </p>
            <p v-if="scope.row.schoolYearAndSemesterStr">
              所属学期：{{ scope.row.schoolYearAndSemesterStr }}
            </p>
          </template>
        </el-table-column>
        <el-table-column width="160px" prop="chaMoney" label="金额">
          <template slot-scope="scope">{{
            (scope.row.chaMoney / 100) | moneyFilter
          }}</template></el-table-column>
        <!-- <el-table-column prop="parentPhoneNumber" label="家长手机号"></el-table-column> -->
        <!-- <el-table-column prop="chaMoney" label="账单金额（元）"></el-table-column> -->
        <!-- <el-table-column prop="paidMoney" label="实缴金额（元）"></el-table-column> -->
        <!-- <el-table-column prop="createDate" label="账单创建时间"></el-table-column> -->
        <el-table-column prop="id" width="80px" label="操作">
          <template slot-scope="scope">
            <span class="blue" @click="check(scope.row)">查看</span>
            <span class="red ml8" @click="del(scope.row)">删除</span>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @current-change="currentChange" :current-page="suffixParams.pageIndex" layout="total, prev, pager, next, jumper"
        :total="suffixParams.total" :page-size="suffixParams.pageSize"></el-pagination>
    </div>
    <!-- 查看账单详情 -->
    <check-bill :billData="currentBillData" ref="checkBillComponent"></check-bill>
  </div>
</template>

<script>
import CheckBill from "./checkBill";
import util from "../../../util";
export default {
  data() {
    return {
      loading: true,
      tableData: [],
      schoolTermList: [],
      classList: [],
      params: {
        data: {
          startTime: "", //起始时间
          endTime: "", //结束时间
          chaStuName: "", //学生名称
          plaChargeMainName: "", //账单名称
          chaClaName: "" //班级名称
        }
      },
      suffixParams: {
        pageIndex: 1,
        pageSize: 10,
        total: 0
      },
      queryLoading: false,
      currentBillData: "",
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      }
    };
  },
  components: { CheckBill },
  created() {
    this.getSchoolTermList();
    this.getClassListByUserId();
    this.list();
  },
  methods: {
    formatTime_(tt) {
      const year = tt.getFullYear();
      const month =
        tt.getMonth() + 1 < 10 ? "0" + (tt.getMonth() + 1) : tt.getMonth() + 1;
      const date = tt.getDate() < 10 ? "0" + tt.getDate() : tt.getDate();
      const hours = tt.getHours() < 10 ? "0" + tt.getHours() : tt.getHours();
      const minutes =
        tt.getMinutes() < 10 ? "0" + tt.getMinutes() : tt.getMinutes();
      return {
        year,
        month,
        date,
        hours,
        minutes
      };
    },
    resetForm(formName) {
      this.params = {
        data: {
          startTime: "", //起始时间
          endTime: "", //结束时间
          chaStuName: "", //学生名称
          plaChargeMainName: "", //账单名称
          chaClaName: "" //班级名称
        }
      };
      this.suffixParams = {
        pageIndex: 1,
        pageSize: 10,
        total: 0
      };
      this.list();
    },
    list() {
      let msg = util.checkDateValid(
        this.params.data.startTime,
        this.params.data.endTime
      );
      if (msg) {
        this.$message.warning(msg);
        return;
      }
      this.queryLoading = true;
      this.$http
        .post(
          `${this.$url.zlurl.billRecycleList}?pageIndex=${this.suffixParams.pageIndex}&pageSize=${this.suffixParams.pageSize}`,
          {},
          this.params.data
        )
        .then(res => {
          this.queryLoading = false;
          if (res.bizData.rows) {
            // this.tableData = res.bizData.rows;
            const rows = res.bizData.rows;
            rows.forEach(item => {
              let d4 = item.schoolYearStartTime
                ? this.formatTime_(new Date(item.schoolYearStartTime))
                : "";
              let d5 = item.schoolYearEndTime
                ? this.formatTime_(new Date(item.schoolYearEndTime))
                : "";
              let semester = "";
              let schoolTerm = this.schoolTermList.find(e => {
                return e.id == item.schoolTremId;
              });
              if (schoolTerm) {
                semester = schoolTerm.termName;
              }
              item["schoolYearAndSemesterStr"] =
                d4 && d5 ? `${d4.year}-${d5.year}学年${semester}` : semester;
            });
            this.tableData = rows;
            this.suffixParams.total = res.bizData.records;
          }
        })
        .catch(() => {
          this.queryLoading = false;
        });
    },
    del(item) {
      console.log("item", item);
      this.$confirm("你确认删除当前选中信息？", "删除").then(() => {
        this.$http
          .post(this.$url.zlurl.delbillRecycle, {}, { id: item.id })
          .then(res => {
            if (res.bizData == "success") {
              this.$message.success("删除成功");
              this.list();
            } else {
              this.$message.error("删除失败");
            }
          });
      });
    },
    check(item) {
      this.currentBillData = item;
      console.log(item);
      this.$refs.checkBillComponent.showDialog();
    },
    clear() {
      this.$confirm("你确认清空所有记录？", "清空").then(() => {
        this.$http.post(this.$url.zlurl.clearbillRecycle, {}).then(res => {
          if (res.bizData == "success") {
            this.$message.success("清空成功");
            this.list();
          } else {
            this.$message.error("清空失败");
          }
        });
      });
    },
    currentChange(val) {
      this.suffixParams.pageIndex = val;
      this.list();
    },
    /**
     * 获取学期列表
     */
    async getSchoolTermList() {
      let res = await this.$http.post(this.$url.zlurl.getSchoolTermList);
      if ("0000000" == res.rtnCode) {
        this.schoolTermList = res.bizData;
      }
    },
    /**
     * 获取班级列表
     */
    async getClassListByUserId() {
      let res = await this.$http.post(this.$url.zlurl.getClassListByUserId);
      if ("0000000" == res.rtnCode) {
        this.classList = res.bizData;
      }
    }
  }
};
</script>

<style lang="scss"  scoped>
.billrecycle {
  overflow-y: auto;
  [class^="el-col"] {
    padding: 0 !important;
  }
}
</style>
