<template>
  <div class="batch-manage-wrap" 
    v-loading.fullscreen.lock="loading"
    element-loading-text="下载中"
    >
    <el-form :inline="true" :model="formData" label-width="110px" class="demo-form-inline">
        <el-form-item label="批次创建时间：">
          <el-date-picker
            v-model="formData.sendDate"
            type="date"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="批次名称：">
          <el-input v-model="formData.keyword" placeholder="批次名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">查询</el-button>
        </el-form-item>
    </el-form>
    <el-row class="options-row">
      <el-button :disabled="selectedItems.length<2" @click="combineBatchClick">合并</el-button>
      <el-button type="primary" @click="buildDialogVisible=true">新建</el-button>
    </el-row>
    <el-table
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
      border
      :size="'medium'"
      @selection-change="handleSelectionChange">
      <el-table-column
        type="selection"
        width="55"
        :selectable="batchSelectable">
      </el-table-column>
      <el-table-column prop="name" label="批次名称" width="250">
        <template slot-scope="scope">
          <div v-if="scope.row.inputType=='MANUAL'" class="green">{{scope.row.remark}}</div>
          <div v-if="scope.row.inputType=='PAYMENT_IN_FACE'" class="blue">{{scope.row.remark}}</div>
          <div v-if="scope.row.inputType!='MANUAL' && scope.row.inputType !='PAYMENT_IN_FACE' && scope.row.sendType !== 1">{{scope.row.remark}}</div>
          <div v-if="scope.row.inputType!='MANUAL' && scope.row.inputType !='PAYMENT_IN_FACE' && scope.row.sendType === 1">
              <img src="@/assets/image/time@2x.png" alt="" style="width:14px"> {{scope.row.remark}}(定时发送)
          </div>
        </template>
      </el-table-column>
      <el-table-column label="批次创建时间" width="160">
        <template v-if="!(scope.row.inputType === 'MANUAL' || scope.row.inputType === 'PAYMENT_IN_FACE' || scope.row.inputType === 'NULL')" slot-scope="scope">{{ scope.row.createDate | formatDate('Y-m-d H:i:s') }}</template>
      </el-table-column>
      <el-table-column label="收缴截止时间" width="160">
        <template v-if="!(scope.row.inputType === 'MANUAL' || scope.row.inputType === 'PAYMENT_IN_FACE' || scope.row.inputType === 'NULL')" slot-scope="scope">
          <span v-if="scope.row.endTime == 2051279999000">无</span>
          <span v-else>{{ scope.row.endTime | formatDate('Y-m-d H:i:s') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="缴费成功/账单总数" width="140">
        <template slot-scope="scope">
          <span v-if="!(scope.row.inputType === 'MANUAL' || scope.row.inputType === 'PAYMENT_IN_FACE' || scope.row.inputType === 'NULL' || scope.row.sendType == 1)">
            <router-link class="blue" :to="{path: '/eduplus/charge/plan', query: { batchName: scope.row.remark, batchNo: scope.row.batchNo, plaPayStatus: 1 }}">{{scope.row.payCount}}</router-link> / <router-link class="blue"  :to="{path: '/eduplus/charge/plan', query: { batchName: scope.row.remark, batchNo: scope.row.batchNo, plaPayStatus: 'all' }}">{{scope.row.billCount}}</router-link>
          </span>
        </template>
      </el-table-column>
      <el-table-column label="未缴费" width="80">
        <template slot-scope="scope">
          <span v-if="!(scope.row.inputType === 'MANUAL' || scope.row.inputType === 'PAYMENT_IN_FACE' || scope.row.inputType === 'NULL' || scope.row.sendType == 1)">
            <router-link class="blue" :to="{path: '/eduplus/charge/plan', query: { batchName: scope.row.remark, batchNo: scope.row.batchNo, plaPayStatus: 0 }}">{{scope.row.notPayCount}}</router-link>
          </span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <router-link class="common-link operate-span" :to="{path: '/eduplus/charge/plan', query: { batchName: scope.row.remark, batchNo: scope.row.batchNo }}">查看</router-link>
          <span v-if="!(scope.row.inputType === 'MANUAL' || scope.row.inputType === 'PAYMENT_IN_FACE' || scope.row.inputType === 'NULL' || scope.row.sendType === 1)" class="common-link operate-span" @click="showStatisticDialog(scope.row)">统计</span>
          <!-- <span v-if="scope.row.sendType==1" class="common-link operate-span" @click="cancalTimeSend(scope.row)">取消定时发送</span> -->
          <span v-if="scope.row.inputType!='MANUAL' && scope.row.inputType !='PAYMENT_IN_FACE' && scope.row.inputType != 'NULL' && scope.row.sendType !=1">
            <span @click="downloadNoticeLetter(scope.row)" class="download-notice blue common-link operate-span" v-if="currentNotDing">下载通知单</span>
          </span>
          <span v-if="scope.row.billCount == 0 && scope.row.inputType!='MANUAL' && scope.row.inputType !='PAYMENT_IN_FACE' && scope.row.inputType != 'NULL' && scope.row.sendType !=1" @click="deleteBill(scope.row)" class="common-link operate-span">删除</span>
          <span v-if="scope.row.showDelayBtn" class="common-link operate-span" @click = "delayBill(scope.row)">延期</span>
          <span v-if="scope.row.inputType!='MANUAL' && scope.row.inputType !='PAYMENT_IN_FACE' && scope.row.sendType === 1" @click='cancelTimingSend(scope.row)' class="common-link operate-span">取消定时发送</span>
       </template> 
      </el-table-column>
    </el-table>
    <div>
      <span class="page-total-count">总计{{pageInfo.total}}条</span>
      <el-pagination
        class="batch-manage-pagination"
        background
        layout="prev, pager, next"
        @current-change="handleCurrentChange"
        :page-size="50"
        :total="pageInfo.total">
      </el-pagination>
    </div>


    <!-- 批次延期 -->
    <el-dialog
      title="批次延期"
      :visible.sync="delayDialogVisible"
      width="30%">
      <el-form :model="delayBillInfo" label-width="45%">
        <el-form-item label="批次名称：">{{delayBillInfo.remark}}</el-form-item>
        <el-form-item label="发送时间：">{{ delayBillInfo.sendTime | formatDate('Y-m-d H:i:s') }}</el-form-item>
        <el-form-item label="收缴截止时间：">
          <span v-if="delayBillInfo.endTime==2051279999000">无</span>
          <span v-if="delayBillInfo.endTime!=2051279999000">{{ delayBillInfo.endTime | formatDate('Y-m-d H:i:s') }}</span>
        </el-form-item>
        <el-form-item label="延期至：">
          <el-date-picker
            class="select-delay-date"
            v-model="delayTime"
            type="date"
            :picker-options="delayBillDateOption"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="delayDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmDelayClick">确认延期</el-button>
      </span>
    </el-dialog>

    <!-- 批次延期确认 -->
    <el-dialog
      title="批次延期"
      :visible.sync="delayConfirmDialogVisible"
      width="30%">
      <div>
        确定将批次"{{delayBillInfo.remark}}"内所有账单收费结束时间延后至 <span class="red">{{ new Date(delayTime).getTime() | formatDate('L-y-m-d') }}</span> 吗？
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="delayConfirmDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="goDelay">确认</el-button>
      </span>
    </el-dialog>

    <!-- 新建批次 -->
    <el-dialog
      class="build-dialog-container"
      title="新建"
      :visible.sync="buildDialogVisible"
      width="600px"
      @close="cancelBuildBatch">
      <div class="build-dialog-body">
        <p class="build-dialog-title">*输入批次名称，新建一条空缴费账单批次！</p>
        <div>批次名称：<el-input v-model="buildBatchName" placeholder="请输入"></el-input></div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelBuildBatch">取消</el-button>
        <el-button type="primary" :disabled="!buildBatchName || disableClick" @click="checkBatchName">确定创建</el-button>
      </span>
    </el-dialog>

    <!-- 合并批次 -->
    <el-dialog
      class="combine-dialog-container"
      title="合并"
      :visible.sync="combineDialogVisible"
      width="600px"
      @close="cancelCombimeBatch">
      <div class="combine-dialog-body">
        <div class="combine-dialog-title">已选择批次：</div>
        <ul class="infinite-list">
          <li v-for="(item, index) in selectedItems" :key="item.batchNo" class="infinite-list-item"><div class="batch-item"> <span>{{ item.remark }}</span><el-link v-if="selectedItems.length>2" class="blue" type="primary" :underline="false" @click="deleteSelectBatch(item, index)">删除</el-link></div></li>
        </ul>
        <div class="new-batch-name"><span class="font-bold">批次名称（新）：</span><el-input v-model="mergeItemsName" placeholder="请输入"></el-input></div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelCombimeBatch">取消</el-button>
        <el-button type="primary" :disabled="!mergeItemsName || disableCombimeClick" @click="confirmCombine">确定合并</el-button>
      </span>
    </el-dialog>

    <!-- 统计 -->
    <el-dialog
      class="statistic-dialog-container"
      title="批次收费统计"
      :visible.sync="statisticDialogVisible"
      width="600px">
      <div class="statistic-dialog-body">
        <ul class="statistic-items-container">
          <li class="statistic-item"><span class="statistic-item-label">支付宝教育缴费</span>{{statisticInfo.alipayEduMoney/100 | moneyFilter}}</li>
          <li class="statistic-item"><span class="statistic-item-label">微信教育缴费</span>{{statisticInfo.wechatEduMoney/100 | moneyFilter}}</li>
          <li class="statistic-item"><span class="statistic-item-label">信用卡分期</span>{{statisticInfo.creditCardMoney/100 | moneyFilter}}</li>
          <li class="statistic-item"><span class="statistic-item-label">现金</span>{{statisticInfo.cash/100 | moneyFilter}}</li>
          <li class="statistic-item"><span class="statistic-item-label">POS</span>{{statisticInfo.posMoney/100 | moneyFilter}}</li>
          <li class="statistic-item"><span class="statistic-item-label">微信</span>{{statisticInfo.wechatMoney/100 | moneyFilter}}</li>
          <li class="statistic-item"><span class="statistic-item-label">支付宝</span>{{statisticInfo.alipayMoney/100 | moneyFilter}}</li>
          <li class="statistic-item"><span class="statistic-item-label">银行</span>{{statisticInfo.bankMoney/100 | moneyFilter}}</li>
          <li class="statistic-item"><span class="statistic-item-label">其他</span>{{statisticInfo.otherMoney/100 | moneyFilter}}</li>
        </ul>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="statisticDialogVisible=false">我知道了</el-button>
      </span>
    </el-dialog>

    <!-- 下载通知单 -->
    <a id="downloadCodeBtn" href="" style="display: none;"></a>
    <div id="noticeLetter" ref="noticeLetterRef" style="position:fixed;left: 0;top: 0;background:#fff;width:600px;z-index:-1000;opacity:0">
        <div style="padding:40px 20px">
          <h3>缴费通知单：{{noticeLetterInfo.remark}}</h3>
          <div style="color:#999999;">{{currentSchoolInfo.schoolName}} &nbsp; {{ new Date().getTime() | formatDate('L-y-m-d')}}</div>
          <p style="padding:20px 0;margin:0;">尊敬的各位学生家长，您好！</p>
          <div style = "margin-bottom:30px;">您有一笔待交的学校费用，请务必于<span style="color: #FF0000">{{noticeLetterInfo.endTime | formatDate('Y-m-d H:i:s')}}</span>截止收费之前完成交费。（如果您已收到支付宝通知，完成交费，请忽略）</div>


          <h4>缴费方式：支付宝</h4>
          <div style="line-height:1.8rem"> 第一步：打开支付宝，搜索：中小学，选择"中小学"应用；</div>
          <img style = "width:95%;" src="@/assets/image/notice_letter/toparent1.png" alt="">
          <p style = "margin-top:10px">第二步：点击"教育缴费"；</p>
          <img style = "width:95%;" src="@/assets/image/notice_letter/toparent2.png" alt="">
          <p style = "margin-top:10px">第三步：点击"添加缴费账号"；</p>
          <img style = "width:95%;" src="@/assets/image/notice_letter/toparent3.jpg" alt="">
          <p style = "margin-top:10px;word-wrap: break-word;word-break: break-all;white-space: normal">第四步：输入信息，证件类型请选择
              <span id="checkItem" style="color:#FF0000">{{verifyValue}}</span> ，点击"确定添加"
              <span v-if = "verifyItem == 'auth_userinfo'">（请填写在学校预留的手机号或者等老师通知后再填写指定手机号）</span>
          </p>
          <img v-if = "verifyItem == 'auth_userinfo'" style = "width:95%;" src="@/assets/image/notice_letter/toparent4phone.jpg" alt="">
          <img v-if = "verifyItem == 'auth_studentno'" style = "width:95%;" src="@/assets/image/notice_letter/toparent4stu.jpg" alt="">
          <img v-if = "verifyItem == 'auth_identity'" style = "width:95%;" src="@/assets/image/notice_letter/toparent4Id.jpg" alt="">
          <p style = "margin-top:10px;word-wrap: break-word;word-break: break-all;white-space: normal">第五步：查看您孩子目前的待缴费用，下次老师发出账单后，您可以立即收到支付宝消息通知。</p>
          <img style = "width:95%;" src="@/assets/image/notice_letter/toparent5.jpg" alt="">
          <h4 style="margin-top:20px">其他缴费方式：二维码缴费</h4>
          <p style = "word-wrap: break-word;word-break: break-all;white-space: normal">如果老师开启了直接转账，并通知了具体缴费金额，用支付宝，扫描下面的二维码，输入金额，直接支付。</p>

          <h4 style="text-align:center;padding-top:15px">支付宝教育缴费-当面付二维码</h4>
          <div style="position:relative;width:80%;margin:0 auto">
              <img src="@/assets/image/notice_letter/toparent6.png" alt="" style="width:100%">
              <div id="code2" style="display:none;"></div>
              <span style="display: inline-block; position: absolute; left: 50%; top: 31%; margin-left: -100px; width: 180px; height: 20px; line-height: 20px;text-align: center; max-width: 94%; background: #fff;padding: 3px 16px;
    font-size: 8px; color: #1f95d4; -webkit-border-radius: 12px; -moz-border-radius: 12px; border-radius: 12px;" class="school-name">{{currentSchoolInfo.schoolName}}</span>
              <img id="image2" :src="facePayBarcodeUrl" style="width: 37%;height:25%; display:block;margin:15px auto;position:absolute;left: 50%;bottom:32%;transform:translate(-48%,0);" />
          </div>
          <div style="margin:10px auto 30px">
              <span style="float:left">使用方法：</span>
              <ol style="float:left; padding-left:10px;">
                  <li style="padding-bottom:10px">长按二维码并"保存图片"</li>
                  <li style="padding-bottom:10px">打开支付宝"扫一扫"</li>
                  <li style="padding-bottom:10px">点击"相册"，选择该图片</li>
              </ol>
              <div style = "clear:both;"></div>
          </div>
          <p style = "color:#666;word-wrap: break-word;word-break: break-all;white-space: normal">注意事项：因部分银行每日快捷支付金额有限，若您超过限额不能支付，建议先将资金提前转入支付宝余额/余额宝，然后使用余额进行缴费支付。</p>
        </div>
    </div>
  </div>
</template>

<script>
import { debuglog } from 'util';
import "@/assets/js/jQuery-2.1.4.min.js"
import "@/assets/js/jquery.qrcode.min.js"
import html2canvas from 'html2canvas'
import { setTimeout } from 'timers';
export default {
  data() {
    return {
      disableClick: false,
      disableCombimeClick: false,
      loading: false,
      currentNotDing: this.$store.state.currentNotDing,
      verifyItem: '',
      verifyValue: '',
      currentSchoolInfo: {},
      facePayBarcodeUrl: '',
      pageInfo: {
        pageIndex: 1,
        pageSize: 50,
        total: 0
      },
      formData: {
        sendDate: '',
        keyword: ''
      },
      tableData: [],
      delayDialogVisible: false,
      delayTime: '',
      delayBillInfo: {},
      delayBillDateOption: {
        disabledDate: time => {
          return this.delayBillInfo.min_date.getTime() > time.getTime()
        }
      },
      delayConfirmDialogVisible: false,
      buildDialogVisible: false,
      buildBatchName: '',
      selectedItems: [],
      mergeItemsName: '',
      combineDialogVisible: false,
      noticeLetterInfo: {},
      statisticDialogVisible: false,
      statisticInfo: {}
    };
  },
  created () {
    this.getBatchList();
    this.getFacePayBarcode();
    this.getVerifyOptions();
  },
  mounted () {
    this.currentSchoolInfo = JSON.parse(window.sessionStorage.getItem("saas_currentSchool"));
  },
  methods: {
    getVerifyOptions () {
      this.$http.post( this.$url.zlurl.queryVerifyOptions ).then(res => {
        if(res.rtnCode == '0000000'){
          this.verifyItem = res.bizData.checkType
          switch (res.bizData.checkType) {
            case 'auth_userinfo':
              this.verifyValue = '请输入家长手机号';
              break;
            case 'auth_studentno':
              this.verifyValue = '请输入学生学号';
              break;
            case 'auth_identity':
              this.verifyValue = '请输入学生身份证号';
              break;
            default:
          }
        }else{
          this.$message.error("网络错误");
        }
      });
    },
    getFacePayBarcode () {
      this.$http.post( this.$url.zlurl.getFacePayBarcode).then(res => {
        if(res.rtnCode == '0000000'){
          let _url = res.bizData;
          let _tempUrl = res.bizData.split('.com')[1]
          this.facePayBarcodeUrl = '/zl_image' + _tempUrl
        }else{
          this.$message.error("网络错误");
        }
      });
    },
    batchSelectable (row, index) {
      if(!(row.inputType === 'MANUAL' || row.inputType === 'PAYMENT_IN_FACE' || row.inputType === 'NULL' || row.sendType === 1)){
        return true
      }
      return false
    },
    getBatchList () {
      let _url = `${this.$url.zlurl.queryBatchList}?pageIndex=${this.pageInfo.pageIndex}&pageSize=${this.pageInfo.pageSize}`
      let params = {
        queryStartSendDate: this.formData.sendDate ? new Date(this.formData.sendDate).getTime() : '',
        queryEndSendDate: this.formData.sendDate ? new Date(this.formData.sendDate).getTime() : '',
        remark: this.formData.keyword || ''
      }
      this.$http.post( _url, {}, params).then(res => {
        if(res.rtnCode == '0000000'){
          this.tableData = res.bizData.rows.filter(item => {
            return item.inputType != 'NULL'
          });
          this.pageInfo = {
            pageIndex: res.bizData.page,
            pageSize: res.bizData.pagesize,
            total: res.bizData.records
          }
        }else{
          this.$message.error("网络错误");
        }
      });
    },
    handleCurrentChange (index) {
      this.pageInfo.pageIndex = index;
      this.getBatchList();
    },
    search () {
      this.pageInfo.pageIndex = 1;
      this.getBatchList();
    },
    confirmCancel (row) {
      ytBillService.billTempCancelSend({
          "batchNo": row.batchNo
      }).then(function (data) {
          if (!data.status) {
            this.$message.success('操作成功');
            this.getBatchList()
          }
      }, function () {
          this.$message.success('网络错误');
      });
    },
    cancalTimeSend (row) {
      // 取消定时发送
      this.$confirm(`是否取消发送“${row.remark}”账单？`, '取消定时发送', {
          confirmButtonText: '确定取消',
          cancelButtonText: '暂不取消',
          type: 'warning'
        }).then(() => {
          this.confirmCancel(row)
        }).catch(() => {   

        });
    },
    confirmDeleteBill (row) {
      this.$http.post( this.$url.zlurl.deleteBatch, {},  {batchNo: row.batchNo}).then(res => {
        if(res.rtnCode == '0000000'){
          this.$message.success('操作成功');
            this.getBatchList()
        }else{
          this.$message.error("网络错误");
        }
      });
    },
    deleteBill (row) {
      // 取消定时发送
      this.$confirm(`是否删除${row.remark}批次？`, '删除', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.confirmDeleteBill(row)
        }).catch(() => {   

        });
    },
    delayBill (row) {
      this.delayDialogVisible = true;
      this.delayBillInfo = row
      if(row.endTime == 2051279999000){
            this.delayBillInfo.min_date = new Date(Date.now() + 86400000 * 1)
            this.delayTime = this.delayBillInfo.min_date;
        }else{
            var time = Date.now(); 
            // var tiemKey = parseInt((row.endTime - Date.now()) / 86400000) + 1;
            this.delayBillInfo.min_date = new Date(row.endTime + 86400000);
            this.delayTime = this.delayBillInfo.min_date;
        }
    },
    confirmDelayClick () {
      this.delayDialogVisible = false
      this.delayConfirmDialogVisible = true
      
    },
    goDelay () {
      let params = {
        batchNo: this.delayBillInfo.batchNo,
        newEndTime: new Date(this.delayTime).getTime()
      }
      this.$http.post( this.$url.zlurl.delayBatch, {}, params).then(res => {
        if(res.rtnCode == '0000000'){
          this.$message.success('延期成功');
            this.getBatchList()
        }else{
          this.$message.error(res.msg);
        }
        this.delayConfirmDialogVisible = false
      });
    },
    checkBatchName () {
      this.disableClick = true;
      this.$http.post(this.$url.zlurl.checkBatchName, {}, {batchName: this.buildBatchName}).then(res => {
        if(res.rtnCode == '0000000'){
          if(res.bizData.isExist){
            this.$message.error("该批次名称已存在，请更换批次名称");
          }else{
            this.confirmBuild();
          }
        }else{
          this.$message.error(res.msg);
        }
        this.disableClick = false;
      }, err => {
        this.disableClick = false;
      });
    },
    confirmBuild () {
      this.$http.post(this.$url.zlurl.newBatch, {}, {remark: this.buildBatchName}).then(res => {
        this.buildDialogVisible = false;
        if(res.rtnCode == '0000000'){
          this.$message.success("创建成功！")
          this.getBatchList();
          this.buildBatchName = '';
        }else{
          this.$message.error("网络错误");
        }
        this.disableClick = false;
      }, err => {
        this.disableClick = false;
      });
    },
    cancelBuildBatch () {
      this.buildDialogVisible = false;
      this.buildBatchName = '';
      this.disableClick = false;
    },
    handleSelectionChange (selection) {
      this.selectedItems = selection;
      this.getMergeItemsName()
    },
    getMergeItemsName () {
      let maxBatchCount;
      this.mergeItemsName = '';
      if(this.selectedItems.length){
        this.selectedItems.forEach(val => {
          if(!maxBatchCount){
            maxBatchCount = val
          }else{
            if(maxBatchCount.id !== val.id &&(maxBatchCount.billCount<val.billCount||
                maxBatchCount.billCount===val.billCount&&maxBatchCount.billSendTime<val.billSendTime)){
                maxBatchCount = val;
            }
          }
        })
        this.mergeItemsName = maxBatchCount.remark;
      }
    },
    deleteSelectBatch (item, index) {
      if(this.selectedItems.length > 2){
        this.selectedItems.splice(index, 1)
        this.getMergeItemsName()
      }
    },
    cancelCombimeBatch () {
      this.combineDialogVisible = false;
      this.disableCombimeClick = false;
    },
    combineBatchClick () {
      this.combineDialogVisible = true
    },
    confirmCombine () {
      this.disableCombimeClick = true;
      let batchNos = [];
      this.selectedItems.forEach(val => {
        if(val.batchNo){
          batchNos.push(val.batchNo)
        }
      })
      let params = {
        remark: this.mergeItemsName,
        batchNos: batchNos
      }
      this.$http.post(this.$url.zlurl.mergeBatch, {}, params).then(res => {
        this.combineDialogVisible = false;
        this.disableCombimeClick = false;
        if(res.rtnCode == '0000000'){
          this.$message.success("合并成功！")
          this.getBatchList();
        }else{
          this.$message.error("网络错误");
        }
      }, err => {
        this.disableCombimeClick = false;
      });
    },
    downloadNoticeLetter (row, flag) {
      // 下载通知单
      this.loading = true;
      this.noticeLetterInfo = row
      const _this = this;
      $("#noticeLetter").css("opacity",1)
      setTimeout(() => {
        const _canvasEle = this.$refs.noticeLetterRef;
        var w = _this.$refs.noticeLetterRef.clientWidth;
        var h = _this.$refs.noticeLetterRef.clientHeight;
        //要将 canvas 的宽高设置成容器宽高的 2 倍
        var canvas = document.createElement("canvas");
        var context = canvas.getContext("2d");
        var scaleBy = _this.getPixelRatio(context);

        if (navigator.userAgent.indexOf('Window') > 0) {
            scaleBy = 2;
        } else if (navigator.userAgent.indexOf('Mac OS X') > 0) {
            scaleBy = _this.getPixelRatio(context);
        }
        canvas.width = w * scaleBy;
        canvas.height = h * scaleBy;
        canvas.style.width = w + "px";
        canvas.style.height = h + "px";
        //然后将画布缩放，将图像放大两倍画到画布上
        context.scale(scaleBy, scaleBy);
        html2canvas(document.getElementById("noticeLetter")).then(data => {
                var url = data.toDataURL("image/jpeg"); //base64数据
                var image = new Image();
                image.src = url;
                this.loading = false;
                var download = $("#downloadCodeBtn").attr("href", url).attr("download", "缴费通知单.jpg");
                download[0].click();
                $("#download").css("noticeLetter",0)
        })
      }, 300)
    },
    getPixelRatio (context) {
      var backingStore = context.backingStorePixelRatio ||
          context.webkitBackingStorePixelRatio ||
          context.mozBackingStorePixelRatio ||
          context.msBackingStorePixelRatio ||
          context.oBackingStorePixelRatio ||
          context.backingStorePixelRatio || 1;
      return (window.devicePixelRatio || 1) / backingStore;
    },
    showStatisticDialog (row) {
      this.$http.post(this.$url.zlurl.queryBatchStatistic, {}, {batchNo: row.batchNo}).then(res => {
        if(res.rtnCode == '0000000'){
          this.statisticDialogVisible = true
          this.statisticInfo = res.bizData
        }else{
          this.$message.error("网络错误");
        }
      });
    },
    cancelTimingSend (row) {
      this.$confirm(`是否取消发送${row.remark}账单？`, '取消定时发送', {
        confirmButtonText: '确定取消',
        cancelButtonText: '暂不取消',
        type: 'warning'
      }).then(() => {
        this.$http.post(this.$url.zlurl.cancelTimingSendBill, {}, {batchNo: row.batchNo}).then(res => {
          if(res.rtnCode == '0000000'){
            this.$message.success('操作成功');
            this.getBatchList();
          }else{
            this.$message.error("网络错误");
          }
        });
      }).catch(() => {   

      });
    }
  }
};
</script>

<style lang="scss">
.batch-manage-wrap{
  height: auto!important;
  .green{
    cursor: default;
  }
  .el-form-item__content{
    // width: 220px;
  }
  .build-dialog-container{
    .el-dialog__body{
      padding-left: 50px;
    }
    .el-input{
      width: 240px;
    }
  }
  .combine-dialog-container{
    color: #373C50;
    .el-dialog__body{
      padding: 30px 72px;
    }
    .combine-dialog-title{
      padding: 8px 0;
      font-weight: bold;
    }
    ul{
      border: 1px solid #f4f4f4;
      max-height: 180px;
      overflow-y: scroll;
      li{
        line-height: 36px;
        padding: 0 16px 0 8px;
        &:not(:last-child){
          border-bottom: 1px solid #f4f4f4;
          
        }
      }
    }
    .new-batch-name{
      margin-top: 16px;
      .el-input{
        width: 320px;
      }
    }
    .el-link.el-link--primary{
      float: right
    }
  }
  .download-notice span{
    color: #008EFF;
    font-weight: normal;
  }
  .statistic-items-container{
    width: 60%;
    margin: 0 auto;
    .statistic-item{
      line-height: 32px;
      .statistic-item-label{
        display: inline-block;
        width: 200px;
      }
    }
  }
  .select-delay-date{
    width: 140px;
  }
  .school-name{
    display: inline-block;
    position: absolute;
    left: 50%;
    top: 31%;
    margin-left: -100px;
    width: 180px;
    height: 20px;
    line-height: 20px;
    text-align: center;
    max-width: 94%;
    background: #fff;padding: 3px 16px;
    font-size: 8px;
    color: #1f95d4;
    -webkit-border-radius: 12px;
    -moz-border-radius: 12px;
    border-radius: 12px;
  }
  .page-total-count{
    line-height: 28px;
    padding: 10px;
    font-size: 14px;
  }
  .batch-manage-pagination{
    float: right;
  }
}
.batch-item{
  display: flex;
  justify-content: space-between;
}
</style>