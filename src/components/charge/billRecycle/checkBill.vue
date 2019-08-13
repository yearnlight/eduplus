<template>
  <el-dialog width="600px" title="查看" class="check-bill-dialog-wrap" :visible.sync="checkBillDialogVisible">
    <el-form :model="billData" label-width="120px">
      <el-form-item label="账单编号：">{{
        billData.plaChargeMainNum
      }}</el-form-item>
      <el-form-item label="缴费账单名称：">{{
        billData.plaChargeMainName
      }}</el-form-item>
      <el-form-item label="学生姓名：">{{ billData.chaStuName }}</el-form-item>
      <el-form-item label="班级名称：">{{ billData.chaClaName }}</el-form-item>
      <el-form-item label="账单金额(元)：">{{
        (billData.chaMoney / 100) | moneyFilter
      }}</el-form-item>
      <el-form-item label="账单详情：">
        <el-table :data="billData.planChargeDetailJoin" tooltip-effect="dark" style="width: 300px" border :size="'small'">
          <el-table-column prop="chaName" label="名称" width="180">
            <template slot-scope="scope">
              <span class="check-box-span">
                <el-checkbox v-if="scope.row.needPay == 2" disabled :checked="ifPaid"></el-checkbox>
              </span>{{ scope.row.chaName }}
            </template>
          </el-table-column>
          <el-table-column label="金额(元)">
            <template slot-scope="scope">
              {{ (scope.row.chaDetailMoney / 100) | moneyFilter }}
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item label="备注：">{{ billData.remark || "无" }}</el-form-item>
      <!-- <el-form-item label="状态：">
        {{ billData.chaCancelStatus === 2 ? "作废" : "" }}
        {{ billData.chaCancelStatus === 3 ? "逾期关闭" : "" }}
        {{
          billData.plaPayStatus === 1 ||
          billData.plaPayStatus === 2 ||
          billData.plaPayStatus === 3 ||
          billData.plaPayStatus === 4 ||
          billData.plaPayStatus === 5 ||
          billData.plaPayStatus === 6 ||
          billData.plaPayStatus === 7 ||
          billData.plaPayStatus === 8 ||
          billData.plaPayStatus === 9 ||
          billData.plaPayStatus === 12
            ? "已支付"
            : ""
        }}
        {{
          billData.chaCancelStatus === 1 &&
          billData.sendNotifyStatus === 1 &&
          billData.plaPayStatus === 0
            ? "未支付"
            : ""
        }}
        {{
          billData.chaCancelStatus === 1 &&
          billData.sendNotifyStatus === 3 &&
          billData.plaPayStatus === 0
            ? "发送失败"
            : ""
        }}
      </el-form-item> -->
      <el-form-item label="账单生成日期：" v-if="billData.plaChargeDate">{{
        billData.plaChargeDate | formatDate("Y-m-d H:i:s")
      }}</el-form-item>
      <el-form-item label="收费生效日期：" v-if="billData.chaEffectDate">{{
        billData.chaEffectDate | formatDate("Y-m-d")
      }}</el-form-item>
      <el-form-item label="收费到期日期：" v-if="billData.chaAlarmDate">{{
        billData.chaAlarmDate | formatDate("Y-m-d")
      }}</el-form-item>
      <el-form-item label="收缴截止日期：" v-if="billData.endTime">{{
        billData.endTime | formatDate("Y-m-d H:i:s")
      }}</el-form-item>
      <el-form-item label="付款日期：" v-if="billData.finanicalPostDate">{{
        billData.finanicalPostDate | formatDate("Y-m-d H:i:s")
      }}</el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="checkBillDialogVisible = false">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {};
</script>

<style></style>

<script>
export default {
  name: "checkDetailComponent",
  props: ["billData"],
  data() {
    return {
      checkBillDialogVisible: false,
      ifPaid: false
    };
  },
  watch: {
    billData(oldVal, newVal) {
      this.ifPaid =
        this.billData.plaPayStatus === 1 ||
        this.billData.plaPayStatus === 2 ||
        this.billData.plaPayStatus === 3 ||
        this.billData.plaPayStatus === 4 ||
        this.billData.plaPayStatus === 5 ||
        this.billData.plaPayStatus === 6 ||
        this.billData.plaPayStatus === 7 ||
        this.billData.plaPayStatus === 8 ||
        this.billData.plaPayStatus === 9 ||
        this.billData.plaPayStatus === 12
          ? true
          : false;
    }
  },
  created() {},
  mounted() {},
  methods: {
    showDialog() {
      this.checkBillDialogVisible = true;
    }
  }
};
</script>

<style lang="scss">
.check-bill-dialog-wrap {
  .el-dialog__body {
    padding: 40px 60px;
  }
  .check-box-span {
    display: inline-block;
    width: 20px;
  }
}
</style>
