<template>
  <div class="face-get-wrap">
    <el-row :gutter="20">
      <el-col :xs="10" :sm="10" :md="8" :lg="6" :xl="6" class="form-container">
        <el-form :model="formInfo" :rules="rules" ref="formRef" label-width="122px" class="face-get-form">
          <el-form-item required label="缴费账单名称：" prop="billName">
            <el-input v-model="formInfo.billName" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item required label="学生姓名：" prop="studentName">
            <el-input v-model="formInfo.studentName" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item required v-if="curSchoolInfo.schoolAttrType=='auth_userinfo'" label="家长手机号：" prop="verifyValue">
            <el-input v-model="formInfo.verifyValue" :maxlength="11" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item required v-if="curSchoolInfo.schoolAttrType=='auth_studentno'" label="学生学号：" prop="verifyValue">
            <el-input v-model="formInfo.verifyValue" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item required v-if="curSchoolInfo.schoolAttrType=='auth_identity'" label="学生身份证号：" prop="verifyValue">
            <el-input v-model="formInfo.verifyValue" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item required label="班级名称：" prop="className">
            <el-select class="classSelect" v-model="formInfo.className" filterable placeholder="请选择" @change="changeClass">
              <el-option
                v-for="item in classList"
                :key="item.classId"
                :label="item.className"
                :value="item.classId">
              </el-option>
            </el-select>
            <span class="blue new-class" @click="addClassClick">新建班级</span>
          </el-form-item>
          <el-form-item label="备注：" prop="remark">
            <el-input v-model="formInfo.remark" placeholder="最大100个字符"></el-input>
          </el-form-item>
          <el-form-item label="收缴截止日期：" required>
            <el-date-picker v-model="formInfo.endTime" :picker-options="endTimeOptions" type="date" placeholder="选择日期"></el-date-picker>
          </el-form-item>
          <el-form-item label="收费生效日期：">
            <el-date-picker v-model="formInfo.effectiveTime" type="date" placeholder="选择日期"></el-date-picker>
          </el-form-item>
          <el-form-item label="收费到期日期：">
            <el-date-picker v-model="formInfo.expredTime" type="date" placeholder="选择日期"></el-date-picker>
          </el-form-item>
          <el-form-item required label="账单金额：" prop="billAmount" class="bill-amount-item">
            <el-input v-model="formInfo.billAmount" disabled></el-input>&nbsp;元
            <br/><span class="blue new-class" @click="addChargeItemClick">增加收费项目</span>
          </el-form-item>
          <el-form-item class="charge-item" v-for="(item, index) in chargeItems" :key="item.id" :label="item.chaName">
            <el-input v-model="item.value" @blur="calBillAmount"></el-input><i class="el-icon-delete" @click="removeChargeItem(index)"></i>
          </el-form-item>
          <el-form-item class="send-bill-item">
            <el-button type="primary" size="middle" :disabled="!formInfo.billName || !formInfo.studentName || !formInfo.verifyValue || !formInfo.endTime || !formInfo.billAmount || disableClick" @click="sendBillClick">发送账单</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :xs="14" :sm="14" :md="16" :lg="18" :xl="18" class="table-container">
        <el-form :inline="true" :model="queryForm" class="query-form-wrap" label-width="100px">
          <el-form-item label="学生姓名：" prop="stuName">
             <el-input v-model="queryForm.stuName" placeholder="学生姓名"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="getBillList">查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button @click="getBillList">刷新</el-button>
          </el-form-item>
        </el-form>
        <el-table
          :data="tableData"
          tooltip-effect="dark"
          style="width: 100%"
          border
          class="face-get-list-table"
          :size="'medium'">
          <el-table-column prop="plaChargeMainName" label="缴费账单名称" width="180"></el-table-column>
          <el-table-column prop="chaStuName" label="学生姓名" width="100"></el-table-column>
          <el-table-column width="170">
            <template slot="header" slot-scope="scope">
              <span v-if="curSchoolInfo.schoolAttrType=='auth_userinfo'">家长手机</span>
              <span v-if="curSchoolInfo.schoolAttrType=='auth_studentno'">学生学号</span>
              <span v-if="curSchoolInfo.schoolAttrType=='auth_identity'">学生身份证号</span>
            </template>
            <template slot-scope="scope">
              <span v-if="curSchoolInfo.schoolAttrType=='auth_userinfo'">{{scope.row.authValue}}</span>
              <span v-if="curSchoolInfo.schoolAttrType=='auth_studentno'">{{scope.row.authValue}}</span>
              <span v-if="curSchoolInfo.schoolAttrType=='auth_identity'">{{scope.row.authValue}}</span>
            </template>
          </el-table-column>
          <el-table-column label="账单金额(元)" width="120">
            <template slot-scope="scope">
              {{ scope.row.chaMoney/100 | moneyFilter }}
            </template>
          </el-table-column>
          <el-table-column label="账单状态" width="80">
            <template slot-scope="scope">
              {{ scope.row.chaCancelStatus === 2 ? '作废' : '' }}
              {{ scope.row.chaCancelStatus === 3 ? '逾期关闭' : '' }}
              {{ scope.row.chaCancelStatus === 1 && scope.row.plaPayStatus === 1 || scope.row.plaPayStatus === 2 || scope.row.plaPayStatus === 3 || scope.row.plaPayStatus === 4 || scope.row.plaPayStatus === 5 || scope.row.plaPayStatus === 6 || scope.row.plaPayStatus === 7 || scope.row.plaPayStatus === 8 || scope.row.plaPayStatus === 9 || scope.row.plaPayStatus === 12 ? '已支付' : '' }}
              {{ scope.row.chaCancelStatus === 1 && scope.row.sendNotifyStatus === 1 && scope.row.plaPayStatus === 0 ? '未支付' : '' }}
              {{ scope.row.chaCancelStatus === 1 && scope.row.sendNotifyStatus === 3 && scope.row.plaPayStatus === 0 ? '发送失败' : '' }}
              {{ scope.row.chaCancelStatus === 1 && scope.row.plaPayStatus === 0 && scope.row.sendNotifyStatus != 3 && scope.row.sendNotifyStatus != 1  ? '发送中' : '' }}
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" class-name="options" min-width="140">
            <template slot-scope="scope">
              <span class="blue" @click="checkBillClick(scope.row)">查看</span>
              <span class="blue" v-show="scope.row.chaCancelStatus === 1 && scope.row.plaPayStatus === 0" @click="invalidBill(scope.row)">作废</span>
              <span class="blue" v-show="scope.row.chaCancelStatus === 1 && scope.row.sendNotifyStatus === 1 && scope.row.plaPayStatus === 0" @click="payNotify(scope.row)">催缴</span>
              <span class="blue" v-show="scope.row.chaCancelStatus === 1 && scope.row.sendNotifyStatus === 1 && scope.row.plaPayStatus === 0" @click="editBillClick(scope.row)">编辑重发</span>
          </template> 
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>

    <!-- 催缴短信未开通 -->
    <el-dialog
      class="pay-notify-unopen-dialog"
      title="提示"
      :visible.sync="payNotifyUnopenVisible"
      width="600px">
      <div class="add-class-dialog-body">
        <div>一键催缴功能属于付费项目，短信收费价格为0.1元/条，开通后以短信方式通知家长及时付费，是否申请开通一键催缴功能？<br>客服电话：4000910061</div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="payNotifyUnopenVisible = false">关闭</el-button>
        <el-button type="primary" @click="applyOpenNotify">申请开通</el-button>
      </span>
    </el-dialog>

    <!-- 催缴短信申请中 -->
    <el-dialog
      class="pay-notify-apply-dialog"
      title="提示"
      :visible.sync="payNotifyApplyVisible"
      width="600px">
      <div class="add-class-dialog-body">
        <div>已成功提交申请，请耐心等待！<br>客服电话：400-006-9898</div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="payNotifyApplyVisible = false">关闭</el-button>
      </span>
    </el-dialog>

    <!-- 催缴 -->
    <el-dialog
      class="pay-notify-dialog"
      title="提示"
      :visible.sync="payNotifyVisible"
      width="600px">
      <div class="pay-notify-dialog-body">
        共选择<span class="red">&nbsp;1&nbsp;</span>条账单，
        <br>其中“有联系方式”<span class="red">&nbsp;{{payNotifyInfo.parentPhoneNumber ? '1' : '0'}}&nbsp;</span>条账单
        <br>确定是否一键催缴<span class="red">&nbsp;1&nbsp;</span>条账单
        <br>您的短信剩余<span class="red">&nbsp;{{payNotifyInfo.remainAmount}}&nbsp;</span>条
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="payNotifyVisible = false">关闭</el-button>
        <el-button type="primary" :disabled="!payNotifyInfo.parentPhoneNumber" @click="goPayNotify">确定</el-button>
      </span>
    </el-dialog>

    <!-- 催缴 短信不足-->
    <el-dialog
      class="pay-notify-dialog"
      title="提示"
      :visible.sync="payNotifyErrorVisible"
      width="600px">
      <div class="pay-notify-dialog-body">
        共选择<span class="red">&nbsp;1&nbsp;</span>条账单，
        <br>其中“有联系方式”<span class="red">&nbsp;{{payNotifyInfo.parentPhoneNumber ? '1' : '0'}}&nbsp;</span>条账单
        <br>确定是否一键催缴<span class="red">&nbsp;1&nbsp;</span>条账单
        <br>您的短信剩余<span class="red">&nbsp;{{payNotifyInfo.remainAmount}}&nbsp;</span>条,无法继续进行一键催缴，请联系客服充值
        <br>客服电话：400-006-9898
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="payNotifyErrorVisible = false">关闭</el-button>
      </span>
    </el-dialog>

    <!-- 新建班级 -->
    <add-class ref="addClassComponent" :updateClass="getClassList"></add-class>
    <!-- 选择收费项 -->
    <charge-item ref="chargeItemComponent" :parentChargeItems="chargeItems" :setChargeItem="getChargeItems"></charge-item>
    <!-- 选择收费项 -->
    <charge-item ref="ResendChargeItemComponent" :parentChargeItems="resendChargeItems" :setChargeItem="getResendChargeItems"></charge-item>
    <!-- 查看账单详情 -->
    <check-bill :billData="currentBillData" :schoolAttrType="curSchoolInfo.schoolAttrType" ref="checkBillComponent"></check-bill>
    <!-- 编辑重发 -->
    <edit-bill :billData="currentBillData" :selectedItems="resendChargeItems" :schoolAttrType="curSchoolInfo.schoolAttrType" :classList="classList" :getBillList="getBillList" @showChargeItems="showResendChargeItems" @closeEditDialog="closeCurrentEditDialog" ref="editBillComponent"></edit-bill>

  </div>
</template>

<script>
import { debuglog } from 'util';
import AddClass from './addClass';
import ChargeItem from './chargeItem';
import CheckBill from './checkBill';
import EditBill from './editBill';
import { defaultCoreCipherList } from 'constants';
export default {
  data() {
    var validateAuthValue = (rule, value, callback) => {
      if (value === '') {
        let errorMsg = '';
        switch (this.curSchoolInfo.schoolAttrType) {
          case 'auth_userinfo':
            errorMsg = '请输入家长手机号';
            break;
          case 'auth_studentno':
            errorMsg = '请输入学生学号';
            break;
          case 'auth_identity':
            errorMsg = '请输入学生身份证号';
            break;
          default:
            errorMsg = '';
        }
        callback(new Error(errorMsg));
      } else {
        callback();
      }
    };
    return {
      curSchoolInfo: {
        schoolAttrType: ''
      },
      batchNo: '',
      formInfo: {
        billName: "",
        studentName: "",
        verifyValue: "",
        className: "",
        remark: "",
        effectiveTime: "",
        endTime: "",
        expredTime: "",
        billAmount: "",
      },
      rules: {
        billName: [
          { required: true, message: '请输入缴费账单名称', trigger: ['blur', 'change'] },
        ],
        studentName: [
          { required: true, message: '请输入学生姓名', trigger: ['blur', 'change'] },
        ],
        verifyValue: [
          { validator: validateAuthValue, trigger: ['blur', 'change'] },
        ]
      },
      endTimeOptions: {
        disabledDate: time => {
          return new Date().getTime() - 24*60*60*1000 > time.getTime()
        }
      },
      classList: [],
      classInfo: {},
      queryForm: {
        stuName: ''
      },
      tableData: [],
      chargeItems: [],
      currentBillData: {},
      resendChargeItems: [],
      payNotifyUnopenVisible: false,
      payNotifyApplyVisible: false,
      payNotifyVisible: false,
      payNotifyInfo: {},
      payNotifyErrorVisible: false,
      disableClick: false,
      zlParams: {}
    };
  },
  components: {
    AddClass,
    ChargeItem,
    CheckBill,
    EditBill
  },
  created() {
    this.getVerifyOptions();
    this.getBatchNo();
    this.getClassList();
    this.getZlParams();
  },
  methods: {
    getZlParams () {
      this.$http.post( this.$url.zlurl.queryZlParams ).then(res => {
        if(res.rtnCode == '0000000'){
          this.zlParams = res.bizData[0];
        }else{
          this.$message.error("网络错误");
        }
      });
    },
    getVerifyOptions () {
      this.$http.post( this.$url.zlurl.queryVerifyOptions ).then(res => {
        if(res.rtnCode == '0000000'){
          this.curSchoolInfo.schoolAttrType = res.bizData.checkType
        }else{
          this.$message.error("网络错误");
        }
      });
    },
    addClassClick () {
        this.$refs.addClassComponent.showDialog();
    },
    getClassList () {
      this.$http.post(this.$url.zlurl.queryClassList).then(res => {
        if(res.rtnCode == '0000000'){
          let arr = JSON.parse(JSON.stringify(res.bizData));
          let arr2 = [];
          arr.forEach(val => {
            if(val.className.indexOf('公共事业部') == -1){
              arr2.push(val)
            }
          })
          this.classList = arr2;
        }else{
          this.$message.error(res.msg);
        }
      })
    },
    changeClass (val) {
      for(let i of this.classList){
        if(i.classId === val){
          this.classInfo = i
        }
      }
    },
    addChargeItemClick () {
      this.$refs.chargeItemComponent.showDialog();
    },
    removeChargeItem (index) {
      this.chargeItems.splice(index, 1);
      this.calBillAmount();
    },
    calBillAmount () {
      let count = 0;
      this.chargeItems.forEach(item => {
          if(item.value){
          count += parseFloat(item.value );
          }
      })
      this.formInfo.billAmount = count.toFixed(2);
    },
    getChargeItems (arr) {
      this.$set(this, 'chargeItems', arr);
    },
    getResendChargeItems (arr) {
      this.$set(this, 'resendChargeItems', arr)
    },
    showResendChargeItems (data) {
      this.$set(this, 'resendChargeItems', data)
      this.$refs.ResendChargeItemComponent.showDialog();
    },
    closeCurrentEditDialog () {
      this.$set(this, 'resendChargeItems', [])
      this.$set(this, 'currentBillData', {});
    },
    sendBillClick () {
      if(new Date(this.formInfo.effectiveTime).getTime() > new Date(this.formInfo.expredTime).getTime()){
        this.$message.error('收费到期日期不能小于收费生效日期');
      }else{
        this.disableClick = true;
        let chargeItems = JSON.parse(JSON.stringify(this.chargeItems));
        chargeItems.forEach(val => {
          val.chaChargeItemId = val.id
          val.chaDetailMoney = val.value * 100
          val.chaNum = 1
        })
        let params = {
          plaChargeMainName: this.formInfo.billName,
          chaClassId: this.classInfo.classId,
          chaClaName: this.classInfo.className,
          chaStuName: this.formInfo.studentName,
          schoolName: JSON.parse(window.sessionStorage.getItem("saas_currentSchool")).schoolName,
          schoolId: JSON.parse(window.sessionStorage.getItem("saas_currentSchool")).schoolId,
          endTime: new Date(this.formInfo.endTime).getTime() + 24*60*60*1000 - 1000,
          chaEffectDate: new Date(this.formInfo.effectiveTime).getTime(),
          chaAlarmDate: new Date(this.formInfo.expredTime).getTime() + 24*60*60*1000 - 1000,
          chaMoney: this.formInfo.billAmount * 100,
          remark: this.formInfo.remark,
          uniqueValue: this.formInfo.verifyValue,
          planChargeDetailJoin: chargeItems,
          chaChargeNoType: this.zlParams.chaChargeNoType
        }
        params = JSON.parse(JSON.stringify(params))
        this.$http.post(this.$url.zlurl.faceGetSendBill, {}, params).then(res => {
          if(res.rtnCode == '0000000'){
            this.$message.success('发送成功');
            this.$refs.formRef.resetFields();
            this.chargeItems = [];
            this.formInfo.endTime = '';
            this.formInfo.effectiveTime = '';
            this.formInfo.expredTime = '';
            this.getBillList();
          }else{
            this.$message.error(res.msg);
          }
          this.disableClick = false;
        }, err => {
          this.disableClick = false;
        });
      }
    },
    getBillList () {
      if(this.batchNo){
        let params = {
          batchNo: this.batchNo,
          searchType: "childName",
          chaStuName: this.queryForm.stuName,
          schoolId: JSON.parse(window.sessionStorage.getItem("saas_currentSchool")).schoolId
        }
        this.$http.post(this.$url.zlurl.queryFaceGetBillList, { pageIndex: 1, pageSize: 10 }, params).then(res => {
          if(res.rtnCode == '0000000'){
            this.tableData = res.bizData.rows;
          }else{
            this.$message.error(res.msg);
          }
        });
      }
      
    },
    getBatchNo () {
      this.$http.post(this.$url.zlurl.queryFaceGetBatchNo).then(res => {
        if(res.rtnCode == '0000000'){
          this.batchNo = res.bizData.batchNo;
          return this.getBillList();
        }else{
          this.$message.error(res.msg);
        }
      });
    },
    checkBillClick (data) {
      this.currentBillData = data;
      this.$refs.checkBillComponent.showDialog();
    },
    editBillClick (data) {
      this.currentBillData = data;
      this.$refs.editBillComponent.showDialog();
    },
    invalidBill (row) {
      this.$confirm(`确认作废账单吗？`, '提示操作', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.confirmInvalidBill(row)
        }).catch(() => {   

        });
    },
    confirmInvalidBill (row) {
      this.$http.post(this.$url.zlurl.invalidSingleBill, {}, { id: row.id }).then(res => {
        if(res.rtnCode == '0000000'){
          this.$message.success('作废成功');
          this.getBillList();
        }else{
          this.$message.error(res.msg);
        }
      });
    },
    applyOpenNotify () {
      this.$http.post(this.$url.zlurl.applyOpenPayNotify).then(res => {
        if(res.rtnCode == '0000000'){
          this.payNotifyUnopenVisible = false;
          this.payNotifyApplyVisible = true;
        }else{
          this.$message.error(res.msg);
        }
      })
    },
    payNotify (row) {
      this.$http.post(this.$url.zlurl.getPayNotifyStatus).then(res => {
        if(res.rtnCode == '0000000'){
          let notifyState = res.bizData.notifyState;
          switch (notifyState) {
            case 0: //未开通
              this.payNotifyUnopenVisible = true;
              break;
            case 1: //申请中
              this.payNotifyApplyVisible = true;
              break;
            case 2: //已开通
              this.getNotifyRemainAmount(row);
              break;
          }
        }else{
          this.$message.error(res.msg);
        }
      });
    },
    getNotifyRemainAmount (row) {
      this.$http.post(this.$url.zlurl.getNotifyRemains).then(res => {
        if(res.rtnCode == '0000000'){
          let remainAmount = res.bizData.remainAmount;
          this.payNotifyInfo = row;
          this.payNotifyInfo.remainAmount = remainAmount;
          if(remainAmount){
            this.payNotifyVisible = true;
          }else{
            this.payNotifyErrorVisible = true;
          }
        }else{
          this.$message.error(res.msg);
        }
      })
    },
    goPayNotify () {
      this.$http.post(this.$url.zlurl.goPayNotify, {}, { ids: this.payNotifyInfo.id }).then(res => {
        if(res.rtnCode == '0000000'){
          this.$message.success('催缴成功');
          this.payNotifyVisible = false;
        }else{
          this.$message.error(res.msg);
        }
      })
    }
  }
};
</script>

<style lang="scss">
.classSelect{
  width: 100%;
}
.face-get-wrap{
  height: auto!important;
  .form-container{
    min-height: 600px;
    border-right: 1px solid #E7EAEC;
  }
  .face-get-form{
    .el-date-editor .el-input__inner{
      padding-right: 0;
    }
    .new-class{
      cursor: pointer;
    }
    .bill-amount-item{
      .el-input{
        width: 80%;
        margin-right: 5px;
      }
    }
    .send-bill-item{
      margin: 0 auto!important;
      width: 80%;
      .el-form-item__content{
        margin: 0!important;
      }
      .el-button{
        width: 100%;
      }
    }
    .el-date-editor{
      width: 100%;
    }
    .charge-item{
      .el-input{
        width: 70%;
        margin-right: 10px;
      }
      .el-icon-delete{
        cursor: pointer;
      }
    }
  }
  .table-container{
    .status_success {
        color: #00B090!important;
    }
    
    .status_close {
        color: #32384C!important;
    }
    
    .status_fail {
        color: #FE5E7D!important;
    }
    
    .status_daijiaofei {
        color: #FFA819!important;
    }
    .status_method {
        color: #9095A9!important;
    }
    .options{
      cursor: pointer;
      span{
        margin: 0 4px;
      }
    }
  }
  .face-get-list-table .el-table__body-wrapper tbody tr td:nth-child(4), .add-charge-item-dialog-container .el-table__body-wrapper tbody tr td:nth-child(6){
    text-align: right;
  }
}
</style>
