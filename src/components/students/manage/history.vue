<template>
  <div class="payhistory">
    <div class="payhistory-form">
      <el-form :inline="true" :model="queryParam" label-width="100px">
        <el-row :gutter="20">
          <el-form-item label=" ">
            <el-select v-model="dateType">
              <el-option v-for="item in dateOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="">
            <el-row type="flex">
              <el-col :span="11">
                <el-date-picker size="small" type="date" placeholder="开始日期" v-model="queryParam.startTime" style="width: 100%;"></el-date-picker>
              </el-col>
              <el-col :span="2">
                <div class="separated">-</div>
              </el-col>
              <el-col :span="11">
                <el-date-picker size="small" type="date" placeholder="结束日期" v-model="queryParam.endTime" style="width: 100%;"></el-date-picker>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item>
            <el-button>昨天</el-button>
            <el-button>近一周</el-button>
            <el-button>近一个月</el-button>
          </el-form-item>
        </el-row>
        <el-row :gutter="20">
          <el-form-item prop="" label="账单状态：">
            <el-select v-model="billState">
              <el-option v-for="item in billingStates" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="" label="学生姓名：">
            <el-input placeholder="学生姓名"></el-input>
          </el-form-item>
          <el-form-item prop="" label="家长手机号：">
            <el-input placeholder="家长手机号"></el-input>
          </el-form-item>
          <el-form-item prop="" label="班级名称：">
            <el-input placeholder="班级名称"></el-input>
          </el-form-item>
        </el-row>
        <el-row :gutter="20">
          <el-form-item prop="" label="收费方式：">
            <el-select v-model="chargeType">
              <el-option v-for="item in chargeTypes" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="" label="收据状态：">
            <el-select v-model="receiptState">
              <el-option v-for="item in receiptStates" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="" label="账单名称：">
            <el-input placeholder="账单名称"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary">查询</el-button>
          </el-form-item>
        </el-row>
      </el-form>
    </div>
    <div class="payhistory-table">
      <div class="payhistory-table-operate">
        <el-button type="primary" plain>打印数据</el-button>
        <el-button type="primary" plain>导出Excel</el-button>
      </div>
      <el-table ref="multipleTable" :data="payTable" tooltip-effect="dark" style="width: 100%" @selection-change="handSelected">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="name" label="缴费账单名称" width="120"></el-table-column>
        <el-table-column prop="name" label="学生姓名" width="120"></el-table-column>
        <el-table-column prop="name" label="家长手机号" width="120"></el-table-column>
        <el-table-column prop="name" label="班级名称" width="120"></el-table-column>
        <el-table-column prop="name" label="账单金额(元)" width="120"></el-table-column>
        <el-table-column prop="name" label="实缴金额(元)"></el-table-column>
        <el-table-column prop="name" label="账单状态"></el-table-column>
        <el-table-column prop="name" label="收据"></el-table-column>
        <el-table-column prop="name" label="操作" width="180">
          <template slot-scope="scope">
            <span class="blue">查看</span>
            <span class="blue">其他方式收费</span>
            <span class="blue">催缴</span>
            <span class="blue">编辑重发</span>
            <span class="red">删除</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      payTable: [{ name: "杨明翔" }],
      queryParam: {},
      dateOptions: [
        { label: "创建账单日期", value: "creat" },
        { label: "账单付款日期", value: "pay" }
      ],
      dateType: "creat",
      billingStates: [
        { label: "全部", value: "" },
        { label: "发送失败", value: "SEND_FAIL" },
        { label: "待缴费", value: "NOT_PAY" },
        { label: "缴费成功", value: "BILL_SUCCESS" },
        { label: "逾期关闭", value: "AUTO_CLOSED" },
        { label: "账单关闭", value: "MANUAL_CLOSED" },
        { label: "未缴费", value: "NOT_BILLING" },
        { label: "其它", value: "OTHER" }
      ],
      billState: "",
      chargeTypes: [
        { label: "全部", value: "" },
        { label: "支付宝教育缴费", value: "1" },
        { label: "现金", value: "2" },
        { label: "POS机", value: "3" },
        { label: "银行汇款转账", value: "4" },
        { label: "微信转账", value: "5" },
        { label: "其它", value: "7" },
        { label: "网银转账", value: "15" },
        { label: "信用卡分期", value: "17" },
        { label: "花呗分期", value: "18" }
      ],
      chargeType: "",
      receiptStates: [
        { label: "全部", value: "" },
        { label: "已打印", value: "1" },
        { label: "未打印", value: "0" }
      ],
      receiptState: ""
    };
  }
};
</script>

<style lang="scss">
.payhistory {
  &-table {
    &-operate {
      padding: 8px 0;
    }
  }
}
</style>

