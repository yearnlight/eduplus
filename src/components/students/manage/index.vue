<template>
  <div class="students">
    <el-tabs v-model="activeTab">
      <el-tab-pane label="在校学生" name="inGarden">
        <div class="students-form">
          <el-form :inline="true" refs="searchForm" :model="params" class="students-form-inline">
            <el-form-item label="学生姓名：">
              <el-input v-model="params.childName" placeholder></el-input>
            </el-form-item>
            <el-form-item label="家长手机：">
              <el-input v-model="params.phoneNum" placeholder></el-input>
            </el-form-item>
            <el-form-item label="班级名称：">
              <el-input v-model="params.className" placeholder></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="query">查询</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="students-table" style="height: calc(100% - 49px);">
          <div class="students-table-operate">
            <div class="students-table-operate-left">
              <el-button :disabled="!multipleSelection.length" type="primary" plain @click="switchClass">调班</el-button>
              <el-button :disabled="!multipleSelection.length" type="primary" plain @click="leaveSchool">离校</el-button>
              <el-button :disabled="!multipleSelection.length" type="primary" plain @click="delStudent">删除</el-button>
              <el-button :disabled="!multipleSelection.length" :loading="downloadBillLoading" type="primary" plain @click="downloadBill">{{downloadBillLoading?"下载中...":"下载缴费通知单"}}</el-button>
            </div>
            <div class="students-table-operate-right">
              <el-button type="primary" plain @click="importStudent">批量导入学生</el-button>
              <el-button type="primary" plain :loading="exportStudenting" @click="exportStudent">{{exportStudenting?"导出中...":"全部学生导出"}}</el-button>
              <el-button type="primary" @click="add" plain>新增学生</el-button>
            </div>
          </div>
          <el-table v-loading="inLoading" element-loading-text="加载中..." ref="multipleTable" :data="studentTable" tooltip-effect="dark" style="width: 100%" @selection-change="handSelected">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="childName" label="学生姓名" width=""></el-table-column>
            <el-table-column prop="customName" label="班级名称" width=""></el-table-column>
            <el-table-column prop="phoneNum" label="家长手机号" width=""></el-table-column>
            <el-table-column prop="childSex" label="性别" width="100"></el-table-column>
            <!-- <el-table-column prop="aliPayId" label="支付宝绑定">
              <template slot-scope="scope">
                <span :class="{'green':scope.row.aliPayId,'red':!scope.row.aliPayId}">{{scope.row.aliPayId ?"已绑定":"未绑定"}}</span>
              </template>
            </el-table-column> -->
            <el-table-column prop="sign" label="状态">
              <template slot-scope="scope">
                <span :class="{'green':scope.row.sign == 1,'red':scope.row.sign != 1}">{{scope.row.sign == 1 ?"在校":"离校"}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="remark" label="备注"></el-table-column>
            <el-table-column label="操作" width="230">
              <template slot-scope="scope">
                <span class="blue" @click="view(scope.row)">查看</span>
                <span class="blue" @click="edit(scope.row)">编辑</span>
                <span class="blue" @click="charge(scope.row)">收费</span>
                <span class="blue" @click="switchClass(scope.row)">调班</span>
                <span class="blue" @click="leaveSchool(scope.row)">离校</span>
                <span class="blue" @click="toPayHistory">历史缴费</span>
                <span class="red" @click="delStudent(scope.row)">删除</span>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination background @size-change="changeSize" :page-sizes="[10, 20, 30, 50,100]" :page-size="params.pageSize" :current-page="params.pageIndex" layout="total,sizes,prev, pager, next" :total="total" @current-change="changePage">
          </el-pagination>
        </div>
      </el-tab-pane>
      <el-tab-pane label="离校学生" name="outGarden">
        <div class="outGarden-form">
          <!-- <el-select v-model="outParams.searchType" placeholder="请选择">
            <el-option label="学生名称" value="childName"></el-option>
          </el-select>
          <el-input placeholder="请输入内容" v-model="outParams.searchValue" class="input-with-select">
            <el-button type="primary" slot="append" icon="el-icon-search" @click="outQuery"></el-button>
          </el-input> -->
          <el-form :inline="true" refs="searchForm" :model="outParams" class="students-form-inline">
            <el-form-item label="学生姓名：">
              <el-input v-model="outParams.searchValue" placeholder></el-input>
            </el-form-item>
            <el-form-item label="家长手机号：">
              <el-input v-model="outParams.phoneNum" placeholder></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="outQuery">查询</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="students-table-operate">
          <div class="students-table-operate-left">
            <el-button :disabled="!outMultipleSelection.length" type="primary" plain @click="restoreStudent">学生恢复</el-button>
            <el-button :disabled="!outMultipleSelection.length" type="primary" plain @click="delStudent({},true)">删除</el-button>
          </div>
        </div>
        <el-table v-loading="outLoading" element-loading-text="加载中..." ref="multipleTable" :data="outStudentTable" tooltip-effect="dark" style="width: 100%" @selection-change="handOutSelected">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="childName" label="学生姓名" width=""></el-table-column>
          <el-table-column prop="customName" label="班级名称" width=""></el-table-column>
          <el-table-column prop="phoneNum" label="家长手机号" width=""></el-table-column>
          <el-table-column prop="childSex" label="性别" width="100"></el-table-column>
          <!-- <el-table-column prop="aliPayId" label="支付宝绑定">
            <template slot-scope="scope">
              <span :class="{'green':scope.row.aliPayId,'red':!scope.row.aliPayId}">{{scope.row.aliPayId ?"已绑定":"未绑定"}}</span>
            </template>
          </el-table-column> -->
          <el-table-column prop="sign" label="状态">
            <template slot-scope="scope">
              <span :class="{'green':scope.row.sign == 1,'red':scope.row.sign != 1}">{{scope.row.sign == 1 ?"在校":"离校"}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="remark" label="备注"></el-table-column>
          <el-table-column label="操作" width="240">
            <template slot-scope="scope">
              <span class="blue" @click="toPayHistory">历史缴费</span>
              <span class="blue" @click="restoreStudent(scope.row)">恢复</span>
              <span class="red" @click="delStudent(scope.row,true)">删除</span>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination background :page-size="outParams.pageSize" :current-page="outParams.pageIndex" :page-sizes="[10, 20, 30, 50,100]" layout="total,sizes,prev, pager, next" :total="outTotal" @current-change="outChangePage" @size-change="outChangeSize">
        </el-pagination>
      </el-tab-pane>
    </el-tabs>

    <el-dialog @opened="operateOpened" :title="isView?'查看':(operateForm.base.id ? '编辑学生':'新增学生')" :visible.sync="isAddOrEdit" custom-class="operate-student">
      <el-form :disabled="isView" v-loading="operateLoading" element-loading-text="保存中..." :rules="operateRules" ref="operateForm" :model="operateForm" label-width="160px">
        <el-form-item label="学生姓名" prop="base.name">
          <el-input v-model="operateForm.base.name" maxlength="15" show-word-limit auto-complete="off" placeholder="请输入姓名（限2-15个字符）"></el-input>
        </el-form-item>
        <el-form-item label="班级名称" prop="base.classId">
          <el-select v-model="operateForm.base.classId" placeholder="请选择">
            <el-option v-for="(item,index) in classes.filter(n => n.gradeId)" :key="index" :label="`${item.customName}(${item.gradeName}${item.className})`" :value="item.classId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="性别" prop="base.sex" :rules="[$rules.required]">
          <el-radio-group v-model="operateForm.base.sex">
            <el-radio label="男"></el-radio>
            <el-radio label="女"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="学号" prop="base.studentNum" :rules="checkItemNumRules">
          <el-input v-model="operateForm.base.studentNum" maxlength="32" show-word-limit auto-complete="off" placeholder="请输入学号"></el-input>
        </el-form-item>
        <el-form-item label="家庭信息" :rules="checkItem == 'MOBILE'?[$rules.required]:[]">
          <div class="familyInfo" v-for="(f,findex) in operateForm.base.familyList" :key="findex">
            <div class="familyInfo-content">
              <div class="familyInfo-input">
                <el-form-item :prop="`base.familyList[${findex}].relation`">
                  <el-select v-model="f.relation" placeholder="请选择">
                    <el-option v-for="(item,index) in $enums.familyContact" :key="index" :label="item.name" :value="item.name"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item :prop="`base.familyList[${findex}].name`" :rules="[$rules.familyName]">
                  <el-input v-model="f.name" auto-complete="off" placeholder="姓名"></el-input>
                </el-form-item>
                <el-form-item :prop="`base.familyList[${findex}].phoneNum`" :rules="checkItemPhoneRules">
                  <el-input v-model="f.phoneNum" auto-complete="off" placeholder="电话" maxlength="11" show-word-limit></el-input>
                </el-form-item>

              </div>
              <el-upload :before-upload="onBeforeUploadImage" :on-success="(response)=>faceSuccess(response,f)" class="familyInfo-upload" action="/zl_api/file/upload/savefile.shtml" :file-list="f.fileList" :on-preview="handlePreview" :on-remove="(response)=>faceRemove(response,f)" list-type="picture" :limit="1">
                <div class="upload-en">
                  <!-- <i class="iconfont icon-faceIdentify blue" style="font-size:26px;"></i> -->
                  <el-button v-if="!isView" type="primary" plain>上传人脸</el-button>
                  <div slot="tip" class="el-upload__tip">只能上传jpg/jpeg/png文件</div>
                  <span v-if="isView && f.facePicture" class="blue" :data-img="scope.row.images" @click="$imgPreview">查看人脸</span>
                </div>

              </el-upload>
            </div>
            <i v-if="operateForm.base.familyList.length >1" class="el-icon-circle-close red" @click="delFamily(findex)"></i>
          </div>
          <span class="orange" @click="addFamily"><i class="el-icon-circle-plus-outline"></i> 添加家庭成员信息</span>
        </el-form-item>
        <el-form-item label="学生身份证件类型" prop="detail.idCardTypeName" :rules="checkItem == 'ID_NO'?[$rules.required]:[]">
          <el-select v-model="operateForm.detail.idCardTypeName" placeholder="请选择">
            <el-option v-for="(item,index) in $enums.cardType" :key="index" :label="item.name" :value="item.name"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="学生证件号码" prop="detail.idCardNum" :rules="checkItemIDRules">
          <el-input v-if="operateForm.detail.idCardTypeName == '居民身份证'" v-model="operateForm.detail.idCardNum" auto-complete="off" :placeholder="`请输入${operateForm.detail.idCardTypeName}`"></el-input>
          <el-input v-else maxlength="30" show-word-limit v-model="operateForm.detail.idCardNum" auto-complete="off" :placeholder="`请输入${operateForm.detail.idCardTypeName}`"></el-input>
        </el-form-item>
        <div>
          <span class="addCard">接送卡号</span><span class="orange" @click="addCard"><i class="el-icon-circle-plus-outline"></i> 添加卡号</span>
          <el-form-item :label="''" :rules="[$rules.pickupNum]" :prop="`base.cardNumbers[${cindex}].number`" v-for="(c,cindex) in operateForm.base.cardNumbers" :key="cindex">
            <div class="idCard">
              <el-input v-model="c.number" auto-complete="off" placeholder="请输入卡号"></el-input>
              <i class="el-icon-circle-close red" @click="delCard(cindex)"></i>
            </div>
          </el-form-item>
        </div>

        <el-form-item label="出生日期" prop="birth">
          <el-date-picker v-model="operateForm.base.birth" type="date" placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input maxlength="20" show-word-limit v-model="operateForm.base.remark" type="textarea" placeholder="最大输入20字符"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isAddOrEdit = false">取 消</el-button>
        <el-button type="primary" v-if="!isView" @click="saveOperate('operateForm')">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="学生班级调整" :visible.sync="isSwitchClass" custom-class="switch-class">
      <el-form :model="changeForm" label-width="200px">
        <el-form-item>
          确定将{{switchDesc}}调整至
        </el-form-item>
        <el-form-item label="班级名称">
          <el-select v-model="changeForm.classId" placeholder="请选择">
            <el-option v-for="(item,index) in classes" :key="index" :label="`${item.customName}(${item.gradeName}${item.className})`" :value="item.classId"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isSwitchClass = false">取 消</el-button>
        <el-button type="primary" :disabled="!changeForm.classId" @click="saveSetClass">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="恢复" :visible.sync="isRestore" custom-class="restore-class">
      <el-form :model="restoreForm" label-width="200px">
        <el-form-item>
          确定将{{restoreDesc}}恢复至
        </el-form-item>
        <el-form-item label="班级名称">
          <el-select v-model="restoreForm.classId" placeholder="请选择">
            <el-option v-for="(item,index) in classes" :key="index" :label="`${item.customName}(${item.gradeName}${item.className})`" :value="item.classId"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isRestore = false">取 消</el-button>
        <el-button type="primary" :disabled="!restoreForm.classId" @click="saveRestore">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="批量导入学生" :visible.sync="isImport" custom-class="import-student">
      <el-alert title="模版更新提醒" type="warning" description="学生批量导入模版已于 2019年8月10日 更新，请下载新模版进行学生批量导入操作" show-icon>
      </el-alert>
      <el-steps :active="1">
        <el-step title="下载Excel模板" description="下载Excel模板并填写相关信息"></el-step>
        <el-step title="上传导入" description="请您确认Excel录入的班级信息"></el-step>
      </el-steps>
      <el-upload v-loading="importExceling" ref="uploadExcel" :element-loading-text="importExcelingText" :before-upload="onBeforeUploadExcel" :on-success="excelSuccess" class="upload-Excel" :limit="1" drag :action="importExcelUrl">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将Excel拖拽到此处或者<em>点击上传Excel学生名单</em></div>
        <div class="el-upload__tip" slot="tip">只支持上传xls/xlsx类型文件，<el-link type="primary" @click="exportStudentTemp">下载Excel模板</el-link><span class="red">New!</span></div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isImport = false">取 消</el-button>
        <el-button type="primary" @click="saveImport">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="学生收费" :visible.sync="isCharge" custom-class="charge">
      <el-form ref="chargeForm" :model="chargeForm" label-width="200px">
        <el-form-item label="学生姓名">
          <label>{{chargeForm.studentName}}</label>
        </el-form-item>
        <el-form-item label="班级名称">
          <label>{{chargeForm.classGrade}}</label>
        </el-form-item>
        <el-form-item label="家长手机号">
          <label>{{chargeForm.userMobile}}</label>
        </el-form-item>
        <el-form-item label="收款方式">
          <el-radio-group v-model="chargeForm.operateType">
            <el-radio label="1">发账单</el-radio>
            <el-radio label="2">其它方式收款</el-radio>
          </el-radio-group>
          <el-select class="paymentMethods" v-if="chargeForm.operateType == 2" v-model="chargeForm.paymentMethod" placeholder="请选择">
            <el-option v-for="item in $enums.paymentMethods" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="账单模式" v-if="chargeForm.operateType == 1">
          <el-radio-group v-model="chargeForm.billType">
            <el-radio label="1">普通账单</el-radio>
            <el-radio label="2">分期账单</el-radio>
          </el-radio-group>
          <div>*用户可以使用支付宝教育缴费、校易收App信用卡分期（{{chargeForm.billType == "1"?"含":"免"}}手续费）进行支付。</div>
        </el-form-item>
        <el-form-item label="备注">
          <el-input maxlength="100" show-word-limit v-model="chargeForm.billRemark" type="textarea" placeholder="最大输入100字符"></el-input>
        </el-form-item>
        <el-form-item label="收费截止时间" prop="endTime" :rules="[$rules.required]">
          <el-date-picker type="date" value-format="yyyy-MM-dd" placeholder="选择日期" v-model="chargeForm.endTime"></el-date-picker>
        </el-form-item>
        <el-form-item label="收费名称" prop="title" :rules="[$rules.required]">
          <el-input maxlength="20" show-word-limit v-model="chargeForm.title" type="text" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="收费金额" :rules="isExpand?[]:[$rules.required]" prop="totalFee">
          <el-input :disabled="true" v-model="chargeForm.totalFee" auto-complete="off" placeholder="请输入"></el-input>
          <span class="suffix">元</span>
          <span class="blue" @click="isExpand = !isExpand">{{isExpand?'收起':'展开'}}<i :class="{'el-icon-arrow-down':!isExpand,'el-icon-arrow-up':isExpand}"></i></span>
        </el-form-item>
        <el-form-item v-if="isExpand" label="收费详情" required>
          <span class="red">*选交+必交总共不超过9项（超过时请分账单发送），只有必交时无个数限制。</span>
        </el-form-item>
        <el-form-item v-if="isExpand" label="选交费用" required>
          <div class="scalable" v-for="(item,index) in chargeForm.selectItems" :key="index">
            <el-form-item :rules="[$rules.required,$rules.chargeItem]" :prop="`selectItems[${index}].item_name`">
              <el-input v-model="item.item_name" auto-complete="off" placeholder="收费项"></el-input>
            </el-form-item>
            <el-form-item :rules="[$rules.required,$rules.chargeFee]" :prop="`selectItems[${index}].item_price`">
              <el-input v-model="item.item_price" auto-complete="off" placeholder="金额"></el-input>
            </el-form-item>
            <span @click="addItem('selectItems')" class="scalable-btn" v-if="index == chargeForm.selectItems.length -1"><i class="el-icon-circle-plus-outline blue"></i></span>
            <span @click="delItem('selectItems',index)" class="scalable-btn" v-else><i class="el-icon-circle-close red"></i></span>
          </div>
        </el-form-item>
        <el-form-item v-if="isExpand" label="必交费用" required>
          <div class="scalable" v-for="(item,index) in chargeForm.mustItems" :key="index">
            <el-form-item :rules="[$rules.required,$rules.chargeItem]" :prop="`mustItems[${index}].item_name`">
              <el-input v-model="item.item_name" auto-complete="off" placeholder="收费项"></el-input>
            </el-form-item>
            <el-form-item :rules="[$rules.required,$rules.chargeFee]" :prop="`mustItems[${index}].item_price`">
              <el-input v-model="item.item_price" auto-complete="off" placeholder="金额"></el-input>
            </el-form-item>
            <span @click="addItem('mustItems')" class="scalable-btn" v-if="index == chargeForm.mustItems.length -1"><i class="el-icon-circle-plus-outline blue"></i></span>
            <span @click="delItem('mustItems',index)" class="scalable-btn" v-else><i class="el-icon-circle-close red"></i></span>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isCharge = false">取 消</el-button>
        <el-button type="primary" @click="saveBill('chargeForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import Url from "@/http/url";
import Util from "@/util";
import { setTimeout, clearTimeout } from "timers";
export default {
  data() {
    return {
      isView: false,
      activeTab: "inGarden",
      operateLoading: false,
      classes: [],
      params: {
        childName: "",
        phoneNum: "",
        className: "",
        pageIndex: 1,
        pageSize: 10
      },
      outParams: {
        pageIndex: 1,
        pageSize: 10,
        searchType: "childName",
        searchValue: "",
        phoneNum: ""
      },
      studentTable: [],
      inLoading: false,
      outLoading: false,
      outStudentTable: [],
      total: 0,
      outTotal: 0,
      multipleSelection: [],
      outMultipleSelection: [],
      isAddOrEdit: false,
      operateRules: {
        "base.name": [this.$rules.required, this.$rules.studentName],
        "base.classId": [this.$rules.required],
        "base.studentNum": [this.$rules.required, this.$rules.studentNum]
      },
      operateForm: {
        detail: {
          xysSouce: "xys",
          idCardNum: "", //身份证号
          idCardTypeName: "",
          idCardType: {
            name: ""
          }
        },
        base: {
          inSchool: true,
          remark: "",
          studentNum: "", //学号
          birth: "",
          classIds: "",
          classId: "",
          name: "",
          id: 0,
          sex: "男",
          cardNumbers: [],
          familyList: [
            {
              name: "",
              id: "0",
              phoneNum: "",
              relation: "",
              strPicture: "",
              facePicture: "",
              fileList: []
            }
          ]
        }
      },
      isSwitchClass: false,
      isRestore: false,
      isImport: false,
      importExcelUrl: "",
      importExceling: false,
      importExcelingText: "",
      exportStudenting: false,
      switchDesc: "",
      restoreDesc: "",
      changeForm: {},
      restoreForm: {},
      checkItem: "",
      downloadBillLoading: false,
      isCharge: false,
      chargeForm: {
        studentNo: "", //学生id
        studentName: "", //学生姓名
        classGrade: "", //年级班级
        userMobile: "", //家长手机号
        studentCode: "", //学号？
        title: "",
        billType: "1",
        endTime: "",
        billRemark: "",
        totalFee: "",
        paymentMethod: "",
        selectItems: [{ item_name: "", item_price: "" }],
        mustItems: [{ item_name: "", item_price: "" }],
        chargeItems: [],
        operateType: "1"
      },
      isExpand: false,
      excelTimer: null
    };
  },
  watch: {
    activeTab(n) {
      if (n && n == "outGarden") {
        this.outQuery();
      } else {
        this.query();
      }
    },
    isImport() {
      this.importExceling = false;
      this.importExcelingText = "";
      if (this.$refs.uploadExcel) {
        this.$refs.uploadExcel.clearFiles();
      }
    },
    isAddOrEdit(n) {
      this.operateLoading = false;
      if (!n) {
        this.$refs.operateForm.clearValidate();
      }
    },
    "chargeForm.selectItems": {
      handler(nItem, o) {
        if (nItem) {
          this.clacTotalFee();
        }
      },
      deep: true
    },
    "chargeForm.mustItems": {
      handler(nItem, o) {
        if (nItem) {
          this.clacTotalFee();
        }
      },
      deep: true
    }
  },
  created() {
    if (this.$route.query.className) {
      this.params.className = this.$route.query.className;
    }
    this.classList();
    this.query();
    //获取校验项
    this.getCheckItem();
  },
  computed: {
    clacTotalFee() {
      let selectValue = 0;
      let chargeValue = 0;
      if (Array.isArray(this.chargeForm.selectItems)) {
        this.chargeForm.selectItems.forEach(n => {
          let price = n.item_price || 0;
          selectValue += parseFloat(price);
        });
      }
      if (Array.isArray(this.chargeForm.mustItems)) {
        this.chargeForm.mustItems.forEach(n => {
          let price = n.item_price || 0;
          chargeValue += parseFloat(price);
        });
        let totalValue = selectValue + chargeValue;
        this.chargeForm.totalFee = totalValue || "";
        //奇葩问题将就处理，展开时清理掉totalFee输入框的校验错误信息
        this.$refs.chargeForm.fields.forEach(n => {
          if (n.prop == "totalFee" && this.isExpand) {
            n.clearValidate();
          }
        });
      }
    },
    checkItemIDRules() {
      let rules = [];
      if (this.checkItem == "ID_NO") {
        rules =
          this.operateForm.detail.idCardTypeName == "居民身份证"
            ? [this.$rules.idNum, this.$rules.required]
            : [this.$rules.studentIdNum, this.$rules.required];
      } else {
        rules =
          this.operateForm.detail.idCardTypeName == "居民身份证"
            ? [this.$rules.idNum]
            : [this.$rules.studentIdNum];
      }
      return rules;
    },
    checkItemNumRules() {
      let rules = [];
      if (this.checkItem == "STUDENT_CODE") {
        rules = [this.$rules.required];
      }
      return rules;
    },
    checkItemPhoneRules() {
      let rules = [];
      if (this.checkItem == "MOBILE") {
        rules = [this.$rules.required];
      }
      return rules;
    }
  },
  methods: {
    charge(item) {
      this.isCharge = true;
      this.chargeForm = {
        studentNo: item.studentNum, //学生id
        studentName: item.childName, //学生姓名
        classGrade: item.customName, //年级班级
        userMobile: item.phoneNum, //家长手机号
        studentCode: "", //学号？
        title: "",
        billType: "1",
        endTime: "",
        billRemark: "",
        totalFee: "",
        paymentMethod: "",
        selectItems: [{ item_name: "", item_price: "" }],
        mustItems: [{ item_name: "", item_price: "" }],
        chargeItems: [],
        operateType: "1",
        downloadTimer: null
      };
    },
    saveBill(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$http
            .postFormData(Url.eduurl.studentCharge, this.changeForm)
            .then(res => {
              if (res.status == 0) {
                this.isCharge = false;
                this.$$message.error("发送账单成功");
                this.query();
              }
            });
        } else {
          return;
        }
      });
    },
    addItem(type) {
      let totalNum =
        this.chargeForm.selectItems.length + this.chargeForm.mustItems.length;
      if (totalNum == 9) {
        this.$message.warning("收费项最多只支持9项");
      } else {
        this.chargeForm[type].push({ lable: "", value: "" });
      }
    },
    delItem(type, index) {
      this.chargeForm[type].splice(index, 1);
    },
    downloadBill() {
      let schoolNo = this.getSStorage("saas_currentSchool").externalSchoolNo;
      this.downloadBillLoading = true;
      let ids = Util.getPropInArray(this.multipleSelection, "childId");
      this.$http
        .postFormData(`${Url.eduurl.downloadBillNote}?schoolNo=${schoolNo}`, {
          ids: ids
        })
        .then(res => {
          if (res.status == 0) {
            let exportId = res.data.exportId;
            this.downloadBillProgress(exportId, schoolNo);
          } else {
            this.downloadBillLoading = false;
            this.$message.error(res.message || "下载失败");
          }
        });
    },
    downloadBillProgress(exportId, schoolNo) {
      this.$http
        .postFormData(`${Url.eduurl.downloadBillExport}?schoolNo=${schoolNo}`, {
          exportId: exportId
        })
        .then(response => {
          if (response.status == 0) {
            if (response.data.downloadStatus == "SUCCESS") {
              let fileUrl = response.data.url;
              this.downloadFile(fileUrl);
              this.downloadBillLoading = false;
            } else if (response.data.downloadStatus == "FAIL") {
              this.$message.error(response.message || "下载失败");
              this.downloadBillLoading = false;
            } else {
              if (this.downloadTimer) {
                clearTimeout(this.downloadTimer);
              }
              this.downloadTimer = setTimeout(() => {
                this.downloadBillProgress(exportId, schoolNo);
              }, 1000);
            }
          } else {
            this.$message.error(res.message || "下载失败");
          }
        });
    },
    downloadFile(url) {
      this.$http.get(url, {}, "blob").then(res => {
        Util.download(res, "缴费通知单", "pdf");
      });
    },
    operateOpened() {
      //打开框时清理校验错误显示
      this.$refs.operateForm.clearValidate();
    },
    getCheckItem() {
      //获取校验项
      this.$http.post(Url.eduurl.getCheckItem).then(res => {
        if (res.rtnCode == "0000000") {
          this.checkItem = res.bizData.attrType || "MOBILE";
        }
      });
    },
    exportStudentTemp() {
      let checkItems = {
        MOBILE: Url.tempurl.studentExcelPhone,
        STUDENT_CODE: Url.tempurl.studentExcelStudentNum,
        ID_NO: Url.tempurl.studentExcelId
      };
      let checkItemsTitle = {
        MOBILE: "学生名单（手机号校验项）",
        STUDENT_CODE: "学生名单（学号校验项）",
        ID_NO: "学生名单（身份证号校验项）"
      };
      this.$http
        .get(
          checkItems[this.checkItem] || Url.tempurl.studentExcelPhone,
          {},
          "blob"
        )
        .then(res => {
          Util.download(
            res,
            checkItemsTitle[this.checkItem] || "学生名单（手机号校验项）",
            "xlsx"
          );
        });
    },
    exportStudent() {
      this.exportStudenting = true;
      this.$http.post(Url.eduurl.exportStudent).then(res => {
        this.exportStudenting = false;
        if (res.rtnCode == "0000000") {
          let uri = res.bizData;
          //资源下载
          this.$http.get(uri, {}, "blob").then(response => {
            Util.download(response, "学生列表导出");
          });
        }
      });
    },
    outQuery() {
      this.outParams.pageIndex = 1;
      this.outList();
    },
    //离园列表
    outList() {
      this.outLoading = true;
      this.$http.post(Url.eduurl.outStudentList, this.outParams).then(res => {
        this.outLoading = false;
        if (res.rtnCode == "0000000") {
          this.outStudentTable = res.bizData.rows;
          this.outTotal = res.bizData.records;
        }
      });
    },
    onBeforeUploadExcel(file) {
      const isExcel = /(\.(xls|xlsx))$/.test(file.name);
      if (!isExcel) {
        this.$message.error("导入学生EXCEL不存在或者格式不合法");
      }
      return isExcel;
    },
    excelSuccess(response) {
      this.importExceling = true;
      let excelNum = response.bizData;
      this.excelProgress(excelNum);
    },
    excelProgress(excelNum) {
      this.$http
        .post(Url.eduurl.importProgress, { time: excelNum })
        .then(res => {
          if (res.bizData && res.bizData.status) {
            this.importExceling = false;
            let errMsg = "";
            res.bizData.data.forEach(err => {
              errMsg += `<p>${err.error_message}</p>`;
            });
            let type = errMsg ? "error" : "success";
            this.$message({
              type: type,
              dangerouslyUseHTMLString: true,
              message: `<div>${errMsg || "导入成功"}</div>`,
              duration: type == "error" ? 5000 : 3000
            });
          } else {
            //进度中
            let percentage =
              res.bizData &&
              parseInt((res.bizData.index / res.bizData.total) * 100);
            this.importExcelingText = `导入中...,${percentage || 0}%`;
            //弹出框关闭时
            if (this.importExceling) {
              //节流
              if (this.excelTimer) {
                clearTimeout(this.excelTimer);
              }
              this.excelTimer = setTimeout(() => {
                this.excelProgress(excelNum);
              }, 1000);
            }
          }
        });
    },
    onBeforeUploadImage(file) {
      const isIMAGE =
        file.type === "image/jpeg" ||
        file.type === "image/jpg" ||
        file.type === "image/png";
      if (!isIMAGE) {
        this.$message.error("上传文件只能是jpg/jpeg/png格式");
      }
      return isIMAGE;
    },
    handlePreview() {},
    faceSuccess(response, item) {
      debugger;
      let qiniuUrl = response.data.url;
      item.facePicture = qiniuUrl;
      Util.getBase64(qiniuUrl).then(res => {
        item.srcPicture = res;
      });
    },
    faceRemove(response, item) {
      item.facePicture = "";
    },
    delCard(index) {
      this.operateForm.base.cardNumbers.splice(index, 1);
    },
    addCard() {
      this.operateForm.base.cardNumbers.push({ id: "0", number: "" });
    },
    delFamily(index) {
      this.operateForm.base.familyList.splice(index, 1);
    },
    addFamily() {
      this.operateForm.base.familyList.push({
        name: "",
        id: "0",
        phoneNum: "",
        relation: "",
        strPicture: "",
        facePicture: ""
      });
    },
    classList() {
      this.$http
        .post(Url.eduurl.classList, {
          pageIndex: 1,
          pageSize: 1000
        })
        .then(res => {
          if (res.rtnCode == "0000000") {
            this.classes = res.bizData.rows;
          }
        });
    },
    query() {
      this.params.pageIndex = 1;
      this.list();
    },
    list() {
      this.inLoading = true;
      this.$http.post(Url.eduurl.studentList, this.params).then(res => {
        this.inLoading = false;
        if (res.rtnCode == "0000000") {
          this.studentTable = res.bizData.rows;
          this.total = res.bizData.records;
        }
      });
    },
    changePage(index) {
      this.params.pageIndex = index;
      this.list();
    },
    changeSize(size) {
      this.params.pageIndex = 1;
      this.params.pageSize = size;
      this.list();
    },
    outChangeSize(size) {
      this.outParams.pageIndex = 1;
      this.outParams.pageSize = size;
      this.outList();
    },
    outChangePage() {
      this.outParams.pageIndex = index;
      this.outList();
    },
    handSelected(vals) {
      this.multipleSelection = vals;
    },
    handOutSelected(vals) {
      this.outMultipleSelection = vals;
    },
    leaveSchool(item) {
      let desc = item.childName
        ? `学生 ${item.childName} `
        : `选择的 ${this.multipleSelection.length} 名学生`;
      let msg = `<div class="">确认将${desc}设为<span class="red">已离校</span>？</div>
                 <div>离校后，学生可在【学生管理】-【离校学生】中找回</div>`;
      this.$confirm(msg, "学生离校", { dangerouslyUseHTMLString: true }).then(
        () => {
          let temp = [];
          if (item.childId) {
            temp.push({
              classId: item.classId,
              childId: item.childId,
              greadId: item.groupCode ? item.groupCode : null
            });
          } else {
            this.multipleSelection.forEach(n => {
              temp.push({
                classId: n.classId,
                childId: n.childId,
                groupCode: n.groupCode ? n.groupCode : null
              });
            });
          }
          this.$http
            .post(
              Url.eduurl.leaveSchoolAll,
              { modifier: 12345 },
              { classChild: temp }
            )
            .then(res => {
              if (res.rtnCode == "0000000") {
                this.$message.success("离校成功");
                this.query();
                this.activeTab = "outGarden";
              }
            });
        }
      );
    },
    delStudent(item, isNot) {
      let selection = isNot
        ? this.outMultipleSelection
        : this.multipleSelection;
      let desc = item.childName
        ? `学生 ${item.childName} `
        : `已选 ${selection.length} 名学生`;
      let msg = `<div>是否确定将${desc}从学生列表中删除？</div>
                 <div class="red">学生删除后将无法撤回，请谨慎操作</div>`;
      this.$confirm(msg, "学生删除", { dangerouslyUseHTMLString: true }).then(
        () => {
          //单点删除
          if (item.childName) {
            this.$http
              .post(
                Url.eduurl.delStudent,
                {},
                {
                  childId: item.childId,
                  schoolId: this.getSStorage("saas_currentSchool").schoolId
                }
              )
              .then(res => {
                if (res.rtnCode == "0000000") {
                  this.callBackDel(isNot);
                }
              });
          } else {
            let params = { classChild: [] };
            selection.forEach(n => {
              params.classChild.push({
                classId: n.classId,
                childId: n.childId,
                groupCode: n.groupCode
              });
            });
            this.$http.post(Url.eduurl.delAllStudent, {}, params).then(res => {
              if (res.rtnCode == "0000000") {
                this.callBackDel(isNot);
              }
            });
          }
        }
      );
    },
    callBackDel(isNot) {
      this.$message.success("删除成功");
      if (isNot) {
        this.outQuery();
      } else {
        this.query();
      }
    },
    importStudent() {
      this.isImport = true;
      this.importExcelUrl = `${Url.eduurl.importStudent}?schoolId=${
        this.getSStorage("saas_currentSchool").schoolId
      }&token=${this.getSStorage("saas_token")}`;
    },
    saveImport() {},
    saveRestore() {
      let params = {
        classChild: []
      };
      //行上操作
      if (this.restoreForm.childId) {
        params.classChild.push({
          classId: this.restoreForm.classId,
          childId: this.restoreForm.childId,
          groupCode: this.restoreForm.groupCode
        });
      } else {
        this.outMultipleSelection.forEach(n => {
          params.classChild.push({
            classId: this.restoreForm.classId,
            childId: n.childId,
            groupCode: n.groupCode
          });
        });
      }
      this.$http.post(Url.eduurl.restoreSchool, {}, params).then(res => {
        if (res.rtnCode == "0000000") {
          this.$message.success("再入园成功");
          //跳转到在园列表，刷新列表查看再入园情况
          // this.activeTab = "inGarden";
          this.isRestore = false;
          this.outQuery();
        }
      });
    },
    restoreStudent(item) {
      this.restoreDesc = item.childName
        ? `学生 ${item.childName} `
        : `已选的 ${this.outMultipleSelection.length} 名学生`;
      this.isRestore = true;
      this.restoreForm = {};
      //行上操作时
      if (item.childId) {
        this.restoreForm.childId = item.childId;
        this.restoreForm.groupCode = item.groupCode;
      }
    },
    toPayHistory() {
      this.$router.push("/eduplus/students/manage/history");
    },
    add() {
      this.isView = false;
      this.isAddOrEdit = true;
      this.operateForm = {
        detail: {
          xysSouce: "xys",
          idCardNum: "", //身份证号
          idCardTypeName: "",
          idCardType: {
            name: ""
          }
        },
        base: {
          inSchool: true,
          remark: "",
          studentNum: "", //学号
          birth: "",
          classIds: "",
          classId: "",
          name: "",
          id: 0,
          sex: "男",
          cardNumbers: [],
          familyList: [
            {
              name: "",
              id: "0",
              phoneNum: "",
              relation: "",
              strPicture: "",
              facePicture: "",
              fileList: []
            }
          ]
        }
      };
    },
    view(item) {
      this.isView = true;
      this.detail(item);
    },
    edit(item) {
      this.isView = false;
      this.detail(item);
    },
    detail(item) {
      this.isAddOrEdit = true;
      this.$http
        .post(Url.eduurl.studentInfo, { id: item.childId })
        .then(res => {
          if (res.rtnCode == "0000000") {
            let info = res.bizData;
            let idCardTypeName = "";
            info.detail = info.detail || {};
            if (info.detail.idCardType) {
              idCardTypeName = info.detail.idCardType.name
                ? info.detail.idCardType.name
                : "其他";
            }
            this.operateForm = {
              detail: {
                xysSouce: "xys",
                idCardNum: info.detail.idCardNum, //身份证号
                idCardTypeName: idCardTypeName,
                idCardType: info.detail.idCardType
              },
              base: {
                inSchool: info.base.inSchool,
                studentNum: info.base.studentNum, //学号
                birth: info.base.birth,
                classIds: info.base.classIds,
                classId: info.base.classIds[0],
                name: info.base.name,
                id: info.base.id,
                sex: info.base.sex,
                cardNumbers: info.base.cardNumbers,
                remark: info.base.remark,
                familyList: info.base.familyList
              }
            };
          }
        });
    },
    addFace(item) {
      this.operateForm.base.familyList.forEach(face => {
        let params = {
          classId: item.base.classIds[0],
          userId: this.getSStorage("userId"),
          childId: item.base.id,
          faceSetType: 1,
          strPicture: face.srcPicture,
          httpPicture: face.facePicture
        };
        this.$http.post(Url.eduurl.addFace, {}, params);
      });
    },
    saveOperate(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let msg = this.operateForm.base.id ? "编辑" : "新增";
          this.operateLoading = true;
          this.operateForm.base.classIds = [this.operateForm.base.classId];
          this.operateForm.base.birth = new Date(
            this.operateForm.base.birth
          ).valueOf();
          let cardTypes = Util.deepClone(this.$enums.cardType);
          this.operateForm.detail.idCardType = cardTypes.filter(
            n => (n.name = this.operateForm.detail.idCardTypeName)
          )[0];
          this.$http
            .post(Url.eduurl.addStudent, {}, this.operateForm)
            .then(res => {
              this.operateLoading = false;
              if (res.rtnCode == "0000000") {
                this.isAddOrEdit = false;
                this.$message.success(`${msg}成功`);
                this.query();
                this.addFace(res.bizData);
              }
            });
        } else {
          return;
        }
      });
    },
    switchClass(item) {
      this.switchDesc = item.childName
        ? `学生 ${item.childName} `
        : `已选的 ${this.multipleSelection.length} 名学生`;
      this.isSwitchClass = true;
      //清空记录
      this.changeForm = {};
    },
    saveSetClass(item) {
      let OldClassInfo = item.childName ? item : this.multipleSelection;
      let inParams = { classChild: [] };
      let notParams = { classChild: [] };
      let classInfo = this.classes.filter(
        n => n.classId == this.changeForm.classId
      );
      //目标班是否在班
      let newIsInClass = classInfo.groupCode ? false : true;
      if (OldClassInfo.length) {
        OldClassInfo.forEach(n => {
          //未分班
          if (!newIsInClass) {
            notParams.classChild.push({
              classId: this.changeForm.classId,
              childId: n.childId,
              oldClassId: n.classId,
              groupCode: n.groupCode
            });
          } else {
            //在班
            inParams.classChild.push({
              classId: this.changeForm.classId,
              childId: n.childId,
              oldClassId: n.classId,
              groupCode: n.groupCode
            });
          }
        });
      }
      this.$http
        .post(
          newIsInClass
            ? Url.eduurl.changeClassToIn
            : Url.eduurl.changeClassToNot,
          {},
          newIsInClass ? inParams : notParams
        )
        .then(res => {
          this.isSwitchClass = false;
          if (res.rtnCode == "0000000") {
            this.$message.success("调班成功");
            this.query();
          }
        });
    }
  }
};
</script>

<style lang="scss">
.students {
  .outGarden {
    display: flex;
    &-search {
      margin-left: auto;
      width: 320px;
      display: flex;
      .el-select {
        width: 150px;
        margin-right: 5px;
      }
    }
  }
  &-table {
    &-operate {
      display: flex;
      padding: 8px 0;
      &-left {
        display: inline-block;
      }
      &-right {
        display: inline-block;
        margin-left: auto;
      }
    }
  }
}

.import-student {
  .el-steps {
    padding: 20px 70px;
  }
  .upload-Excel {
    display: flex;
    align-items: center;
    flex-direction: column;
    .blue {
      cursor: pointer;
    }
    .el-upload__tip {
      display: flex;
      align-items: center;
      .red {
        font-weight: 500;
        font-size: 14px;
        margin-left: 5px;
      }
    }
  }
}

.charge {
  .el-form {
    .paymentMethods {
      margin-left: 20px;
      .el-input {
        width: 150px;
      }
    }
  }
}

.operate-student {
  .el-form {
    width: 100%;
    .el-form-item {
      width: 520px;
    }
    .el-select,
    .el-date-editor {
      width: 100%;
    }
    .orange {
      cursor: pointer;
    }
    .addCard {
      margin-left: 93px;
      margin-right: 10px;
      margin-bottom: 10px;
      display: inline-block;
    }
    .idCard {
      margin-bottom: 5px;
      width: 100%;
      align-items: center;
      display: flex;
      .red {
        margin-left: 5px;
      }
    }
    .familyInfo {
      border: 1px dashed #eee;
      padding: 10px;
      margin-bottom: 5px;
      width: 110%;
      align-items: center;
      display: flex;
      .red {
        font-size: 18px;
      }
      &-content {
        display: flex;
        flex-direction: column;
      }
      .el-form-item {
        width: auto;
        &:first-child {
          width: 90px;
        }
      }
      &-input {
        display: flex;
        .el-select {
          width: auto;
          flex: 1;
        }
        .el-input {
          width: auto;
          flex: 2;
          margin-right: 5px;
        }
      }
      &-upload {
        .upload-en {
          display: flex;
          .blue {
            margin-left: 10px;
          }
        }
        display: flex;
        flex-direction: column;
        margin-top: 10px;
        .el-upload__tip {
          margin-top: 0;
          margin-left: 10px;
        }
      }
    }
  }
}
</style>


