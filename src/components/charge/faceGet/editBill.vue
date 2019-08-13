<template>
    <el-dialog width="600px" title="编辑账单" class="edit-bill-dialog-wrap" @close="closeDialog" :visible.sync="editBillDialogVisible">
        <el-form :model="editFormInfo" :rules="editFormRules" ref="editFormRef" label-width="132px" class="edit-bill-form">
          <el-form-item required label="缴费账单名称：" prop="plaChargeMainName">
            <el-input v-model="editFormInfo.plaChargeMainName" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item required label="学生姓名：" prop="chaStuName">
            <el-input v-model="editFormInfo.chaStuName" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item required v-if="schoolAttrType=='auth_userinfo'" label="家长手机号：" prop="authValue">
            <el-input v-model="editFormInfo.authValue" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item required v-if="schoolAttrType=='auth_studentno'" label="学生学号：" prop="authValue">
            <el-input v-model="editFormInfo.authValue" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item required v-if="schoolAttrType=='auth_identity'" label="学生身份证号：" prop="authValue">
            <el-input v-model="editFormInfo.authValue" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item required label="班级名称：" prop="chaClaName">
            <el-select v-model="editFormInfo.chaClaName" filterable placeholder="请选择" @change="changeClass">
              <el-option
                v-for="item in classList"
                :key="item.classId"
                :label="item.className"
                :value="item.classId">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="备注：" prop="remark">
            <el-input v-model="editFormInfo.remark" placeholder="最大100个字符"></el-input>
          </el-form-item>
          <el-form-item label="收缴截止日期：" required>
            <el-date-picker v-model="editFormInfo.endTime" type="date" placeholder="选择日期"></el-date-picker>
          </el-form-item>
          <el-form-item label="收费生效日期：">
            <el-date-picker v-model="editFormInfo.chaEffectDate" type="date" placeholder="选择日期"></el-date-picker>
          </el-form-item>
          <el-form-item label="收费到期日期：">
            <el-date-picker v-model="editFormInfo.chaAlarmDate" type="date" placeholder="选择日期"></el-date-picker>
          </el-form-item>
          <el-form-item required label="账单金额：" prop="chaMoney" class="bill-amount-item">
            <el-input v-model="editFormInfo.chaMoney" disabled></el-input>&nbsp;元
            <br/><span class="blue new-class" @click="addChargeItemClick">增加收费项目</span>
          </el-form-item>
          <el-form-item class="charge-item" v-for="(item, index) in editFormInfo.planChargeDetailJoin" :key="item.id" :label="item.chaName">
            <el-input v-model="item.chaDetailMoney" @blur="calEditBillAmount"></el-input><i class="el-icon-delete" @click="removeEditChargeItem(index)"></i>
          </el-form-item>
          <el-form-item class="send-bill-item">
            
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="closeDialog">取消</el-button>
            <el-button type="primary" :disabled="!editFormInfo.plaChargeMainName || !editFormInfo.chaStuName || !editFormInfo.authValue || !editFormInfo.endTime || editFormInfo.chaMoney=='0.00'" @click="resendBillClick">确认重发</el-button>
        </div>
    </el-dialog>
</template>

<script>
export default {
    name: 'editDetailComponent',
    props: ['billData', 'selectedItems', 'schoolAttrType', 'classList', 'getBillList'],
    data() {
        var validateAuthValue = (rule, value, callback) => {
            if (value === '') {
                let errorMsg = '';
                switch (this.schoolAttrType) {
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
            editBillDialogVisible: false,
            editFormInfo: {},
            classInfo: {},
            editFormRules: {
                plaChargeMainName: [
                    { required: true, message: '请输入缴费账单名称', trigger: ['blur', 'change'] },
                ],
                chaStuName: [
                    { required: true, message: '请输入学生姓名', trigger: ['blur', 'change'] },
                ],
                authValue: [
                    { validator: validateAuthValue, trigger: ['blur', 'change'] },
                ]
            }
        };
    },
    created() {
        
    },
    mounted () {
        this.editFormInfo = JSON.parse(JSON.stringify(this.billData));
        this.formatData();
    },
    watch: {
        billData (newVal, oldVal) {
            this.editFormInfo = JSON.parse(JSON.stringify(this.billData));
            this.formatData();
        },
        selectedItems () {
            if(this.selectedItems && this.selectedItems.length){
                this.$set(this.editFormInfo, 'planChargeDetailJoin', this.selectedItems)
            }
        }
    },
    methods: {
        formatData () {
            this.editFormInfo.chaMoney = parseFloat(this.editFormInfo.chaMoney / 100).toFixed(2);
            this.editFormInfo.endTime = this.editFormInfo.endTime || '';
            this.editFormInfo.chaEffectDate = this.editFormInfo.chaEffectDate || '';
            this.editFormInfo.chaAlarmDate = this.editFormInfo.chaAlarmDate || '';
            if(this.editFormInfo.planChargeDetailJoin && this.editFormInfo.planChargeDetailJoin.length){
                this.editFormInfo.planChargeDetailJoin.forEach(val => {
                    if(val.chaDetailMoney){
                        val.chaDetailMoney = (val.chaDetailMoney / 100).toFixed(2)
                    }
                })
            }
        },
        showDialog () {
            this.editBillDialogVisible = true
        },
        changeClass (val) {
            for(let i of this.classList){
                if(i.classId === val){
                this.classInfo = i
                }
            }
        },
        calEditBillAmount () {
            let count = 0;
            this.editFormInfo.planChargeDetailJoin.forEach(item => {
                if(item.chaDetailMoney){
                count += parseFloat(item.chaDetailMoney );
                }
            })
            this.editFormInfo.chaMoney = count.toFixed(2);
        },
        removeEditChargeItem (index) {
            this.editFormInfo.planChargeDetailJoin.splice(index, 1);
            this.calEditBillAmount();
        },
        addChargeItemClick () {
            this.$emit("showChargeItems", this.editFormInfo.planChargeDetailJoin)
        },
        resendBillClick () {
            if(new Date(this.editFormInfo.chaEffectDate).getTime() > new Date(this.editFormInfo.chaAlarmDate).getTime()){
                this.$message.error('收费到期日期不能小于收费生效日期');
            }else{
                let chargeItems = JSON.parse(JSON.stringify(this.editFormInfo.planChargeDetailJoin));
                chargeItems.forEach(val => {
                    val.chaDetailMoney = val.chaDetailMoney * 100
                    val.chaNum = 1
                    if(!val.chaChargeItemId){
                        val.chaChargeItemId = val.id
                    }
                })
                let schoolId = JSON.parse(window.sessionStorage.getItem("saas_currentSchool")).schoolId;
                let params = {
                    id: this.editFormInfo.id,
                    plaChargeMainName: this.editFormInfo.plaChargeMainName,
                    chaClassId: this.editFormInfo.chaClassId,
                    chaClaName: this.editFormInfo.chaClaName,
                    chaStuName: this.editFormInfo.chaStuName,
                    schoolId: schoolId,
                    schoolName: JSON.parse(window.sessionStorage.getItem("saas_currentSchool")).schoolName,
                    endTime: new Date(this.editFormInfo.endTime).getTime(),
                    chaEffectDate: new Date(this.editFormInfo.chaEffectDate).getTime(),
                    chaAlarmDate: new Date(this.editFormInfo.chaAlarmDate).getTime(),
                    chaMoney: this.editFormInfo.chaMoney * 100,
                    remark: this.editFormInfo.remark,
                    uniqueValue: this.editFormInfo.authValue,
                    planChargeDetailJoin: chargeItems
                }
                params = JSON.parse(JSON.stringify(params))
                this.$http.post(this.$url.zlurl.editAndResend, {}, params).then(res => {
                    if(res.rtnCode == '0000000'){
                        this.$message.success('重发账单成功');
                        this.editBillDialogVisible = false;
                        this.getBillList();
                    }else{
                        this.$message.error(res.msg);
                    }
                });
            }
        },
        closeDialog () {
            this.editBillDialogVisible = false;
            this.$refs.editFormRef.resetFields();
            this.$emit("closeEditDialog")
        }
    }
};
</script>

<style lang="scss">
.edit-bill-dialog-wrap{
    .el-dialog__body{
        padding: 40px 60px;
    }
    .edit-bill-form{
        .el-input__inner{
            width: 205px;
        }
        .el-select{
            width: 205px;
        }
        .new-class{
            cursor: pointer;
        }
        .bill-amount-item{
            .el-input{
                width: 130px;
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
            width: 205px;
        }
        .charge-item{
            .el-input{
                width: 205px;
                margin-right: 10px;
            }
            .el-icon-delete{
                cursor: pointer;
            }
        }
    }
}
</style>
