<template>
  <div class="teacher">
    <el-tabs>
      <el-tab-pane>
        <span slot="label">在职老师</span>
        <div class="teacher-operate">
          <div class="teacher-operate-left">
            <el-button type="primary" plain @click="add">新增老师</el-button>
          </div>
          <div class="teacher-operate-right">
            <el-select v-model="searchType" placeholder="请选择">
              <el-option v-for="(item,index) in queryItems" :key="index" :label="item.label" :value="item.value"></el-option>
            </el-select>

            <el-select filterable v-if="searchType == 'roleId'" v-model="searchValue" class="dynamic-input" :placeholder="`请输入${itemLabel}（可搜索）`">
              <el-option :key="index" :label="item.roleName" :value="item.roleId" v-for="(item,index) in roles"></el-option>
            </el-select>
            <el-select filterable v-if="searchType == 'classId'" v-model="searchValue" class="dynamic-input" :placeholder="`请输入${itemLabel}（可搜索）`">
              <el-option :key="index" :label="item.gradeName?`${item.customName}(${item.gradeName}${item.className})`:item.className" :value="item.classId" v-for="(item,index) in classes">
                <span class="limitWidth" :title="item.gradeName?`${item.customName}(${item.gradeName}${item.className})`:item.className ">{{ item.gradeName?`${item.customName}(${item.gradeName}${item.className})`:item.className }}</span>
              </el-option>
            </el-select>
            <el-input v-if="searchType != 'roleId' && searchType != 'classId'" v-model="searchValue" class="dynamic-input" :placeholder="`请输入${itemLabel}`">
            </el-input>
            <el-button :class="{'holder-hide':searchType == 'roleId' || searchType == 'classId','holder-show':searchType != 'roleId' && searchType != 'classId'}" type="primary" @click="query">查询</el-button>
          </div>
        </div>
        <el-table v-loading="loading" element-loading-text="加载中..." ref="multipleTable" :data="teacherTable" tooltip-effect="dark" style="width: 100%" @selection-change="handSelected">
          <el-table-column prop="userName" label="老师名称"></el-table-column>
          <el-table-column prop="phoneNum" label="老师手机">
            <template slot-scope="scope">
              {{scope.row.phoneNum | desensitization}}
            </template>
          </el-table-column>
          <el-table-column prop="roleName" label="角色"></el-table-column>
          <el-table-column prop="userSex" label="性别"></el-table-column>
          <el-table-column prop="classInfos" label="所带班级" width="320">
            <template slot-scope="scope">
              <!-- <el-tag v-if="scope.row.classAll == 1" type="success">全校班级</el-tag>
              <el-tag v-else :key="index" v-for="(item,index) in scope.row.classInfos" type="primary" close-transition>{{item.className}}</el-tag> -->
              <el-popover v-if="scope.row.classAll != 1" placement="top-start" title="" width="200" trigger="hover" :content="scope.row.classInfos | splitJoin">
                <span slot="reference">
                  <span :key="cindex" v-for="(citem,cindex) in scope.row.classInfos.slice(0,3)">
                    <span>{{citem.className}}</span>
                    {{(cindex == (scope.row.classInfos.slice(0,3).length - 1)&&cindex == 2)?"...":(cindex == (scope.row.classInfos.slice(0,3).length - 1)&&cindex != 2)?"":"、"}}
                  </span>
                </span>

              </el-popover>
              <span v-if="scope.row.classAll == 1">全校班级</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="160">
            <template slot-scope="scope">
              <span v-if="scope.row.userId != getSStorage('userId')" class="blue" @click="edit(scope.row)">编辑</span>
              <span v-if="scope.row.userId != getSStorage('userId')" class="red" @click="del(scope.row)">删除</span>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination background @size-change="changeSize" :page-sizes="[10, 20, 30, 50,100]" :page-size="params.pageSize" :current-page="params.pageIndex" layout="total,sizes,prev, pager, next" :total="total" @current-change="changePage">
        </el-pagination>
      </el-tab-pane>
    </el-tabs>
    <el-dialog @opened="openedOperateForm" :title="operateForm.userId ? '编辑老师':'新增老师'" :visible.sync="isAddOrEdit" custom-class="operate-teacher">
      <el-form ref="operateForm" :rules="operateRules" v-loading="operateLoading" :model="operateForm" label-width="200px">
        <el-form-item label="老师姓名" required prop="userName">
          <el-input v-model="operateForm.userName" auto-complete="off" maxlength="20" show-word-limit placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="老师手机" required prop="phoneNum">
          <el-input v-if="!operateForm.userId" v-model="operateForm.phoneNum" auto-complete="off" maxlength="11" show-word-limit placeholder="请输入"></el-input>
          <label v-else>{{operateForm.phoneNum | desensitization}}</label>
        </el-form-item>
        <el-form-item label="性别" required prop="userSex">
          <el-radio-group v-model="operateForm.userSex">
            <el-radio label="男"></el-radio>
            <el-radio label="女"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="选择角色" required prop="roleId">
          <el-radio-group v-model="operateForm.roleId">
            <el-radio :label="item.roleId" v-for="(item,index) in roles.slice(1)" :key="index">{{item.roleName}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="选择班级" required prop="classSelectedInfos">
          <div class="linkage">
            <el-cascader separator="" v-model="operateForm.classSelectedInfos" filterable :options="cascaderOptions" placeholder="请选择班级,可搜索" :props="cascaderProps" clearable>
              <template slot-scope="{ node, data }">
                <span>{{ data.id == 0 ? "全部":data.label }}</span>
              </template>
            </el-cascader>
          </div>

        </el-form-item>
        <el-form-item label="考勤卡号" prop="cardNumber">
          <el-input v-model="operateForm.cardNumber" maxlength="10" show-word-limit auto-complete="off" placeholder="请输入"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isAddOrEdit = false">取 消</el-button>
        <el-button type="primary" @click="saveOperate('operateForm')">确 定</el-button>
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
      cascaderOptions: [],
      cascaderProps: {
        multiple: true,
        emitPath: false
      },
      queryItems: [
        { label: "姓名", value: "userName" },
        { label: "手机号", value: "phoneNum" },
        { label: "角色", value: "roleId" },
        { label: "班级/群组", value: "classId" }
      ],
      searchType: "userName",
      teacherTable: [],
      searchValue: "",
      total: 0,
      params: {
        pageIndex: 1,
        pageSize: 10
      },
      roles: [], //角色信息
      classes: [], //班级信息
      grades: [], //年级
      gradeClasses: [], //班级
      isAddOrEdit: false,
      operateForm: {
        userSex: "女",
        classInfos: [],
        classSelectedInfos: []
      },
      operateRules: {
        userName: [this.$rules.required, this.$rules.teacherName],
        roleId: [this.$rules.required],
        userSex: [this.$rules.required],
        classSelectedInfos: [this.$rules.required],
        phoneNum: [this.$rules.required, this.$rules.phoneNum],
        cardNumber: [this.$rules.cardNumber]
      },
      loading: false,
      operateLoading: false
    };
  },
  filters: {
    splitJoin(source) {
      let temp = [];
      source.forEach(n => {
        temp.push(n.className);
      });
      return temp.join("、");
    }
  },
  watch: {
    isAddOrEdit(n) {
      if (!n) {
        this.$refs.operateForm.clearValidate();
      } else {
        this.operateLoading = false;
      }
    },
    searchType() {
      this.searchValue = "";
    },
    searchValue(n) {
      if (this.searchType == "roleId" || this.searchType == "classId") {
        this.query();
      }
    }
  },
  computed: {
    itemLabel() {
      let self = this;
      let item = self.queryItems.filter(n => n.value == self.searchType);
      return item[0].label;
    }
  },
  created() {
    this.query();
    //获取角色列表
    this.roleList();
    //获取班级列表
    this.classList();
  },
  methods: {
    openedOperateForm() {
      this.$refs.operateForm.clearValidate();
    },
    changeGrade(key) {
      this.$http
        .post(Url.eduurl.classInGrade, {
          gradeId: this.operateForm.grade[0].id
        })
        .then(res => {
          if (res.rtnCode == "0000000") {
            this.gradeClasses = res.bizData;
          }
        });
    },
    classListInGrade(isClassAll) {
      this.$http.post(Url.eduurl.classesInGrades).then(res => {
        if (res.rtnCode == "0000000") {
          let cascaderOptions = [res.bizData];
          this.setProps(cascaderOptions);
          this.cascaderOptions = cascaderOptions;
          if (isClassAll) {
            let selectedClassIds = [];
            cascaderOptions[0].classInfo.forEach(n => {
              selectedClassIds = selectedClassIds.concat(
                Util.getPropInArray(n.classInfo, "classId")
              );
            });
            this.operateForm.classSelectedInfos = selectedClassIds;
          }
        }
      });
    },
    setProps(source) {
      if (source && source.length) {
        source.forEach(item => {
          if (item.customName) {
            item.label = `${item.className}(${item.customName})`;
          } else {
            item.label = item.className == "全部" ? "" : item.className;
          }
          item.value = item.classId;
          if (item.classInfo && item.classInfo.length) {
            this.setProps(item.classInfo);
          }
          item.children = item.classInfo;
        });
      }
    },
    roleList() {
      this.$http.post(Url.eduurl.roleList).then(res => {
        if (res.rtnCode == "0000000") {
          let roles = res.bizData;
          roles.unshift({ roleName: "全部", roleId: "" });
          this.roles = roles;
        }
      });
    },
    classList() {
      this.$http
        .post(Url.eduurl.classList, { pageIndex: 1, pageSize: 9999 })
        .then(res => {
          if (res.rtnCode == "0000000") {
            let classes = res.bizData.rows;
            classes.unshift({
              className: "全部",
              classId: "",
              gradeName: "",
              customName: ""
            });
            this.classes = classes;
          }
        });
    },
    list() {
      this.loading = true;
      this.queryItems.forEach(item => {
        this.params[item.value] = "";
      });
      this.params[this.searchType] = this.searchValue;
      this.$http.post(Url.eduurl.teacherList, this.params).then(res => {
        this.loading = false;
        if (res.rtnCode == "0000000") {
          this.teacherTable = res.bizData.rows;
          this.total = res.bizData.records;
        } else {
        }
      });
    },
    query() {
      this.params.pageIndex = 1;
      this.list();
    },
    del(item) {
      this.$confirm(`是否删除【${item.userName}】老师`, "删除").then(() => {
        this.$http
          .post(
            Url.eduurl.delTeacher,
            {},
            { userId: item.userId, schoolId: this.getSStorage("saas_currentSchool").schoolId }
          )
          .then(res => {
            if (res.rtnCode == "0000000") {
              this.$message.success("删除成功");
              this.query();
            }
          });
      });
    },
    edit(item) {
      //获取年级下所有班级
      this.isAddOrEdit = true;
      this.operateForm = {
        cardNumber: item.cardNumber,
        classInfos: [],
        phoneNum: item.phoneNum,
        roleId: item.roleId,
        userId: item.userId,
        userName: item.userName,
        userSex: item.userSex
      };
      let temp = [];
      let isClassAll = false;
      if (item.classAll != 1) {
        item.classInfos.forEach(c => {
          temp.push(c.classId);
        });
      } else {
        isClassAll = true;
      }
      this.operateForm.classSelectedInfos = temp;
      this.classListInGrade(isClassAll);
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
    handSelected() {},
    add() {
      this.operateForm.classSelectedInfos = [];
      this.classListInGrade();
      this.operateForm = {
        userSex: "女",
        classInfos: []
      };
      this.isAddOrEdit = true;
    },
    saveOperate(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let temp = [];
          this.operateForm.classSelectedInfos.forEach(c => {
            temp.push({ classId: c });
          });
          this.operateForm.classInfos = temp;
          let url = this.operateForm.userId
            ? Url.eduurl.editTeacher
            : Url.eduurl.addTeacher;
          this.$http.post(url, {}, this.operateForm).then(res => {
            let operateType = this.operateForm.userId ? "编辑" : "新增";
            if (res.rtnCode == "0000000") {
              this.isAddOrEdit = false;
              this.$message.success(`${operateType}成功`);
              this.query();
            }
          });
        } else {
          return;
        }
      });
    }
  }
};
</script>

<style lang="scss">
.teacher {
  &-operate {
    display: flex;
    padding: 8px 0;
    &-left {
      display: inline-block;
    }
    &-right {
      display: flex;
      margin-left: auto;
      .el-select {
        width: 120px;
      }
      .dynamic-input {
        width: 170px;
        margin: 0 10px;
      }
    }
  }
  .el-table {
    .el-tag {
      margin: 5px;
    }
  }
}

.el-select-dropdown {
  .limitWidth {
    float: left;
    display: inline-block;
    max-width: 200px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap; /*文本不换行*/
  }
}

.operate-teacher {
  .el-form {
    .el-input,
    .el-cascader {
      width: 250px;
    }
    .el-radio {
      margin: 10px;
    }
    .phoneNum {
      font-size: 12px;
      opacity: 0.7;
      margin-left: 10px;
    }
    .linkage {
    }
  }
}
</style>


