<template>
  <div class="classes">
    <div class="classes-form">
      <el-form :inline="true" :model="params" class="classes-form-inline">
        <el-form-item label="班级名称：">
          <el-input v-model="params.customName" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="年级：">
          <el-input v-model="params.gradeName" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="班级：">
          <el-input v-model="params.className" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="query">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="classes-table">
      <div class="classes-table-operate">
        <div class="classes-table-operate-left">
          <el-button :disabled="!multipleSelection.length" type="primary" plain @click="charge">收费</el-button>
          <el-button :disabled="!multipleSelection.length" type="primary" plain @click="del">删除班级</el-button>
        </div>
        <div class="classes-table-operate-right">
          <el-button :loading="exporting" :disabled="!multipleSelection.length" type="primary" plain @click="exportClass">{{exporting?"导出中":"导出选择班级"}}</el-button>
          <el-button type="primary" plain @click="add">新建班级</el-button>
        </div>
      </div>
      <el-table v-loading="classLoading" element-loading-text="加载中..." ref="multipleTable" :data="classTable" tooltip-effect="dark" style="width: 100%" @selection-change="handSelected">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="customName" label="班级名称">
          <template slot-scope="scope">
            <router-link class="blue" :to="{path: '/eduplus/students/manage', query: { className: scope.row.customName }}">{{scope.row.customName}}</router-link>
          </template>
        </el-table-column>
        <el-table-column prop="gradeName" label="年级"></el-table-column>
        <el-table-column prop="className" label="班级"></el-table-column>
        <el-table-column prop="childCount" label="班级人数" width="120"></el-table-column>
        <el-table-column prop="teacherNames" label="带班老师" width="320">
          <template slot-scope="scope">
            <!-- <el-tag :key="index" v-for="(item,index) in scope.row.teacherNames" type="primary" close-transition>{{item}}</el-tag> -->
            <el-popover placement="top-start" title="" width="200" trigger="hover" :content="scope.row.teacherNames | splitJoin">
              <span slot="reference">
                <span :key="tindex" v-for="(titem,tindex) in scope.row.teacherNames.slice(0,3)">
                  <span>{{titem}}</span>
                  {{(tindex == (scope.row.teacherNames.slice(0,3).length - 1)&&tindex == 2)?"...":(tindex == (scope.row.teacherNames.slice(0,3).length - 1)&&tindex != 2)?"":"、"}}
                </span>
              </span>

            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="160">
          <template slot-scope="scope">
            <span class="blue" @click="edit(scope.row)">编辑</span>
            <span class="red" @click="del(scope.row)">删除</span>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination background @size-change="changeSize" :page-sizes="[10, 20, 30, 50,100]" layout="total,sizes,prev, pager, next" :total="total" @current-change="changePage"></el-pagination>
    </div>
    <el-dialog @opened="operateOpened" :title="operateForm.classId ? '编辑班级':'新建班级'" :visible.sync="isAddOrEdit" custom-class="operate-class">
      <el-form v-loading="operateLoading" element-loading-text="保存中..." :model="operateForm" label-width="200px" ref="operateForm">
        <div class="className">
          <el-form-item label="年级" prop="gradeNo" :rules="[$rules.required]">
            <el-select filterable v-model="operateForm.gradeNo" placeholder="请选择（可搜索）">
              <el-option v-for="(item,index) in grades" :key="index" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="operateForm.gradeNo == 0" label-width="0" prop="customGradeName" :rules="[$rules.gradeName,$rules.required]">
            <el-input v-model="operateForm.customGradeName" auto-complete="off" placeholder="自定义年级"></el-input>
          </el-form-item>
        </div>
        <div class="className">
          <el-form-item label="班级" prop="classNo" :rules="[$rules.required]">
            <el-select filterable v-model="operateForm.classNo" placeholder="请选择（可搜索）">
              <el-option v-for="(item,index) in classes" :key="index" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="operateForm.classNo == 0" label-width="0" prop="customClassName" :rules="[$rules.gradeName,$rules.required]">
            <el-input v-model="operateForm.customClassName" auto-complete="off" placeholder="自定义班级"></el-input>
          </el-form-item>
        </div>
        <el-form-item label="班级名称" prop="customName" :rules="[$rules.className,$rules.required]">
          <el-input v-model="operateForm.customName" maxlength="20" show-word-limit auto-complete="off" placeholder="请输入名称（限20个字符）"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isAddOrEdit = false">取 消</el-button>
        <el-button type="primary" @click="saveOperate('operateForm')">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="班级收费" :visible.sync="isCharge" custom-class="charge">
      <el-form ref="chargeForm" :model="chargeForm" label-width="200px">
        <el-form-item label="收费批次名称" prop="batchName" :rules="[$rules.batchName,$rules.required]" required>
          <el-input maxlength="32" show-word-limit v-model="chargeForm.batchName" auto-complete="off" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="已选班级" required>
          <span>共<span class="red">{{multipleSelection.length}}</span>个班</span>
        </el-form-item>

        <el-form-item label="收费截止时间">
          <el-date-picker type="date" value-format="yyyy-MM-dd" placeholder="选择日期" v-model="chargeForm.endTime"></el-date-picker>
        </el-form-item>
        <el-form-item label="账单备注">
          <el-input maxlength="100" show-word-limit v-model="chargeForm.remarks" type="textarea" placeholder="最大输入100字符"></el-input>
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
export default {
  data() {
    return {
      exporting: false,
      classTable: [],
      classLoading: false,
      total: 0,
      params: {
        pageIndex: 1,
        pageSize: 10,
        className: "",
        customName: "",
        gradeName: ""
      },
      multipleSelection: [],
      isAddOrEdit: false,
      chargeForm: {
        batchName: "",
        billSendType: 0,
        endTime: "",
        classNos: "",
        remarks: "",
        totalFee: "",
        selectItems: [{ item_name: "", item_price: "" }],
        mustItems: [{ item_name: "", item_price: "" }],
        chargeItems:[]
      },
      operateForm: {
        customClassName: ""
      },
      operateLoading: false,
      isCharge: false,
      isExpand: false,
      classes: [],
      grades: []
    };
  },
  created() {
    this.query();
  },
  filters: {
    splitJoin(source) {
      let temp = [];
      source.forEach(n => {
        temp.push(n);
      });
      return temp.join("、");
    }
  },
  watch: {
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
    },
    isAddOrEdit(n) {
      this.operateLoading = false;
      if (!n) {
        this.$refs.operateForm.clearValidate();
      }
    }
  },
  methods: {
    operateOpened() {
      //打开框时清理校验错误显示
      this.$refs.operateForm.clearValidate();
    },
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
    query() {
      this.params.pageIndex = 1;
      this.list();
    },
    list() {
      this.classLoading = true;
      this.$http.post(Url.eduurl.classList, this.params).then(res => {
        this.classLoading = false;
        if (res.rtnCode == "0000000") {
          this.classTable = res.bizData.rows;
          this.total = res.bizData.records;
        }
      });
    },
    classEnum() {
      let promise = this.$http.post(Url.eduurl.classEnum).then(res => {
        if (res.rtnCode == "0000000") {
          let classes = res.bizData;
          classes.push({ name: "其它", id: 0 });
          this.classes = classes;
        }
      });
      return promise;
    },
    gradeList() {
      this.$http.post(Url.eduurl.gradeList).then(res => {
        if (res.rtnCode == "0000000") {
          let grades = res.bizData;
          grades.push({ name: "其它", id: 0, entranceYear: 2019 });
          this.grades = grades;
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
    handSelected(vals) {
      this.multipleSelection = vals;
    },
    del(item) {
      let desc = item.classId
        ? `班级 ${item.className} `
        : `已选 ${this.multipleSelection.length} 个班级`;
      let msg = `<div>是否确定将${desc}从班级列表中删除？</div>
                 <div class="red">班级删除后将无法撤回，请谨慎操作</div>`;
      this.$confirm(msg, "删除", { dangerouslyUseHTMLString: true }).then(
        () => {
          let temp = [];
          if (item.classId) {
            //单独删除
            temp = `${item.classId}`;
          } else {
            this.multipleSelection.forEach(n => {
              temp.push(n.classId);
            });
            temp = temp.join(",");
          }
          this.$http
            .post(Url.eduurl.delClass, {}, { classIds: temp })
            .then(res => {
              if (res.rtnCode == "0000000") {
                this.$message.success("删除成功");
                this.query();
              }
            });
        }
      );
    },
    add() {
      this.operateForm = {
        classId: 0,
        classNum: {
          id: "",
          name: ""
        },
        grade: {
          id: "",
          name: ""
        },
        className: "",
        customName: "",
        childCount: 0,
        classType: {
          createDate: 0,
          creator: 0,
          id: 1,
          lastModDate: 0,
          lastModifier: 0,
          schoolId: 0,
          sortNum: 0,
          status: 0,
          typeName: "普通班"
        },
        entranceYear: 2019
      };
      this.gradeList();
      this.classEnum();
      this.isAddOrEdit = true;
    },
    edit(item) {
      this.operateForm = {
        classId: item.classId,
        classNum: {
          id: "",
          name: ""
        },
        grade: {
          id: "",
          name: ""
        },
        className: "",
        classNo: "",
        customGradeName: "",
        customClassName: "",
        gradeNo: item.gradeId,
        customName: item.customName,
        childCount: 0,
        classType: {
          createDate: 0,
          creator: 0,
          id: 1,
          lastModDate: 0,
          lastModifier: 0,
          schoolId: 0,
          sortNum: 0,
          status: 0,
          typeName: "普通班"
        },
        entranceYear: 2019
      };
      this.gradeList();
      this.classEnum().then(() => {
        this.isAddOrEdit = true;
        let classInfo = this.classes.filter(n => n.id == item.classId);
        //列表里面找到 or 未找到
        if (classInfo && classInfo.length) {
          this.operateForm.classNo = item.classId;
        } else {
          let cInfo = this.classes.filter(n => n.name == item.className);
          if (cInfo && cInfo.length) {
            this.operateForm.classNo = cInfo[0].id;
          } else {
            this.operateForm.classNo = 0;
            this.operateForm.customClassName = item.className;
          }
        }
      });
    },
    saveOperate(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.operateLoading = true;
          let gradeInfo = this.grades.filter(
            n => n.id == this.operateForm.gradeNo
          );
          let classInfo = this.classes.filter(
            n => n.id == this.operateForm.classNo
          );
          this.operateForm.grade = gradeInfo[0];
          if (gradeInfo[0].id == 0) {
            this.operateForm.grade.name = this.operateForm.customGradeName;
          }
          this.operateForm.classNum.id = classInfo[0].id;
          if (classInfo[0].id == 0) {
            this.operateForm.classNum.name = this.operateForm.customClassName;
          } else {
            this.operateForm.classNum.name = classInfo[0].name;
          }
          this.operateForm.className =
            this.operateForm.grade.name + this.operateForm.classNum.name;
          this.$http
            .post(Url.eduurl.addClass, {xys:"xys"}, this.operateForm)
            .then(res => {
              this.operateLoading = false;
              if (res.rtnCode == "0000000") {
                this.isAddOrEdit = false;
                let msg = this.operateForm.classId ? "编辑" : "添加";
                this.$message.success(`${msg}成功`);
                this.query();
              } else {
              }
            });
        } else {
          return false;
        }
      });
    },
    charge() {
      this.isCharge = true;
      this.isExpand = false;
      this.chargeForm = {
        batchName: "",
        billSendType: 0,
        endTime: "",
        classNos: "",
        remarks: "",
        selectItems: [{ item_name: "", item_price: "" }],
        mustItems: [{ item_name: "", item_price: "" }],
        chargeItems:[]
      };
    },
    saveBill(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let temp = [];
          //克隆一份
          let chargeForm = this.chargeForm;
          //塞入校易收班级ids
          this.multipleSelection.forEach(n => {
            temp.push(n.externalClassNo);
          });
          chargeForm.classNos = temp.join(",");
          chargeForm.selectItems = chargeForm.selectItems;
          chargeForm.mustItems = chargeForm.mustItems;
          chargeForm.chargeItems = chargeForm.mustItems.concat(chargeForm.selectItems)
          this.$http
            .postFormData(Url.eduurl.classbill, chargeForm)
            .then(res => {
              this.isCharge = false;
              if (res.status == 0) {
                this.$message.success("收费成功");
              } else {
                this.$message.error(res.message || "收费失败");
              }
            });
        } else {
          return false;
        }
      });
    },
    exportClass() {
      this.exporting = true;
      let params = { classChild: [] };
      this.multipleSelection.forEach(n => {
        params.classChild.push({
          classId: n.classId,
          childId: n.childId,
          groupCode: n.groupCode
        });
      });
      this.$http.post(Url.eduurl.exportClass, {}, params).then(res => {
        if (res.rtnCode == "0000000") {
          this.$http.get(`/zl_api/${res.bizData}`, {}, "blob").then(res => {
            this.exporting = false;
            Util.download(res, "班级下学生数据");
          });
        } else {
          this.exporting = false;
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
    }
  }
};
</script>

<style lang="scss">
.classes {
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
    .el-table {
      .el-tag {
        margin: 5px;
      }
    }
  }
}

.operate-class {
  .el-form {
    .el-input {
      width: 193px;
      margin-right: 10px;
    }
    .className {
      display: flex;
    }
  }
}

.charge {
  .el-form {
    .el-input,
    .el-date-editor,
    .el-textarea {
      width: 250px;
    }
    .scalable {
      display: flex;
      .el-form-item {
        width: calc(50% - 20px);
        margin-right: 10px;
        .el-input {
          width: auto;
        }
      }
      width: 270px;
      &-btn {
      }
    }
    .suffix {
      padding: 0 10px;
    }
    .blue {
      cursor: pointer;
    }
  }
}
</style>


