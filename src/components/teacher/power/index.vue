<template>
  <div class="power">
    <div class="power-operate">
      <el-button type="primary" plain @click="add">新增角色</el-button>
    </div>
    <el-table v-loading="loading" element-loading-text="加载中..." :data="roleTable" tooltip-effect="dark" style="width: 100%">
      <el-table-column prop="roleName" label="角色名称"></el-table-column>
      <el-table-column prop="roleCount" label="老师人数"></el-table-column>
      <el-table-column label="操作" width="160">
        <template slot-scope="scope">
          <span class="blue" @click="view(scope.row)">查看</span>
          <span v-if="scope.row.isMaster != 1" class="blue" @click="edit(scope.row)">编辑</span>
          <span v-if="scope.row.isMaster != 1" class="red" @click="del(scope.row)">删除</span>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog @opened="operateOpened" :title="isView ? '查看' :(operateForm.roleId ? '编辑角色':'新增角色')" :visible.sync="isAddOrEdit" custom-class="operate-role">
      <el-form :element-loading-text="loadingText" ref="operateForm" :rules="operateRules" v-loading="treeLoading" :model="operateForm" label-width="200px">
        <el-form-item label="角色名称" prop="roleName" :rules="[$rules.roleName,$rules.required]">
          <el-input maxlength="20" show-word-limit :disabled="isView" v-model="operateForm.roleName" auto-complete="off" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="选择权限" required prop="permissions" :rules="[$rules.required]">
          <el-checkbox :disabled="isView" v-model="checkedAll" @change="handleCheckAll">全选</el-checkbox>
          <el-tree :default-checked-keys="defaultKeys" :data="operateForm.permissions" show-checkbox default-expand-all node-key="id" ref="tree" highlight-current :props="defaultProps">
          </el-tree>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isAddOrEdit = false;isView = false;">取 消</el-button>
        <el-button v-if="!isView" type="primary" @click="saveOperate('operateForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Url from "@/http/url";
import { debuglog } from "util";
export default {
  data() {
    return {
      roleTable: [],
      operateForm: {
        permissions:[]
      },
      operateRules: {
        roleName: [this.$rules.required, this.$rules.roleName]
      },
      isAddOrEdit: false,
      isView: false,
      defaultProps: {
        children: "values",
        label: "name"
      },
      defaultKeys: [],
      treeLoading: false,
      loading: false,
      checkedAll: false,
      allKeys: [],
      loadingText: ""
    };
  },
  watch: {
    isAddOrEdit(n) {
      if (!n) {
        this.treeLoading = false;
        this.loadingText = "";
      }
    }
  },
  created() {
    this.list();
  },
  methods: {
    operateOpened(){
      //打开框时清理校验错误显示
      this.$refs.operateForm.clearValidate();
    },
    handleCheckAll() {
      //全选 Or 全不选
      if (this.checkedAll) {
        this.getAllKeys(this.operateForm.permissions);
        this.$refs.tree.setCheckedKeys(this.allKeys);
      } else {
        this.defaultKeys = [];
        this.$refs.tree.setCheckedKeys([]);
      }
    },
    rolePermissions(roleId, isView) {
      this.treeLoading = true;
      this.loadingText = "权限树加载中...";
      let promise = this.$http
        .post(Url.eduurl.rolePermissions, { id: roleId || 0 })
        .then(res => {
          this.treeLoading = false;
          if (res.rtnCode == "0000000") {
            let permissions = res.bizData || [];
            if (isView) {
              this.setDisabled(permissions);
            }
            this.operateForm.permissions = permissions;
          }
        });
      return promise;
    },
    getCheckedKeys(source) {
      source.forEach(item => {
        if (item.flag == 1) {
          this.defaultKeys.push(item.id);
        } else {
          if (item.values && item.values.length) {
            this.getCheckedKeys(item.values);
          }
        }
      });
    },
    setDisabled(source) {
      source.forEach(item => {
        item.disabled = true;
        if (item.values && item.values.length) {
          this.setDisabled(item.values);
        }
      });
    },
    getAllKeys(source) {
      source.forEach(item => {
        this.allKeys.push(item.id);
        if (item.values && item.values.length) {
          this.getAllKeys(item.values);
        }
      });
    },
    add() {
      this.operateForm = {};
      this.isAddOrEdit = true;
      this.isView = false;
      this.rolePermissions().then(() => {
        //清空选择
        this.$refs.tree.setCheckedKeys([]);
      });
    },
    view(item) {
      this.operateForm = item;
      this.isView = true;
      this.isAddOrEdit = true;
      //获取设置权限信息
      this.defaultKeys = [];
      this.rolePermissions(item.roleId, this.isViews).then(() => {
        //过滤出要勾选的项
        this.getCheckedKeys(this.operateForm.permissions);
        //勾选操作
        if (this.defaultKeys && this.defaultKeys) {
          this.$refs.tree.setCheckedKeys(this.defaultKeys);
        }
        //置灰
        this.setDisabled(this.operateForm.permissions);
      });
    },
    del(item) {
      this.$confirm(`你确定删除角色 ${item.roleName}?`, "删除").then(() => {
        this.$http
          .post(Url.eduurl.delRole, {}, { id: item.roleId })
          .then(res => {
            if (res.rtnCode == "0000000") {
              this.$message.success("删除成功");
              this.list();
            }
          });
      });
    },
    edit(item) {
      this.operateForm = item;
      this.isAddOrEdit = true;
      this.isView = false;
      //获取设置权限信息
      this.defaultKeys = [];
      this.rolePermissions(item.roleId).then(() => {
        this.getCheckedKeys(this.operateForm.permissions);
        this.$refs.tree.setCheckedKeys(this.defaultKeys);
      });
    },
    list() {
      this.loading = true;
      this.$http.post(Url.eduurl.roleList).then(res => {
        this.loading = false;
        if (res.rtnCode == "0000000") {
          this.roleTable = res.bizData;
        }
      });
    },
    setCheckFlag(nodes) {
      nodes.forEach(n => {
        n.flag = 1;
        if (n.values && n.values.length) {
          this.setCheckFlag(n.values);
        }
      });
    },
    saveOperate(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.treeLoading = true;
          this.loadingText = "保存中...";
          let nodes = this.$refs.tree.getCheckedNodes();
          this.setCheckFlag(nodes);
          let operateType = this.operateForm.roleId?"编辑":"添加";
          this.$http
            .post(
              Url.eduurl.addRole,
              {},
              {
                roleId:this.operateForm.roleId,
                roleName: this.operateForm.roleName,
                permissions: JSON.stringify(nodes)
              }
            )
            .then(res => {
              this.treeLoading = false;
              if (res.rtnCode == "0000000") {
                this.$message.success(`${operateType}成功`);
                this.isAddOrEdit = false;
                this.list();
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
.operate-role {
  .el-form {
    .el-input {
      width: 250px;
    }
    .el-tree {
      height: 300px;
      overflow-y: auto;
    }
  }
}
</style>
