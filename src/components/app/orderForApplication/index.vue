<template>
  <div class="orderList">
    <!-- <el-form :inline="true" :model="queryParam" class="demo-form-inline" size="small">
      <el-form-item label="下单时间">
        <el-date-picker
          v-model="queryParam.time"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="购买人">
        <el-select v-model="queryParam.person">
          <el-option label="购买人1" value="1"></el-option>
          <el-option label="购买人2" value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="应用名称">
        <el-input v-model="queryParam.name"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="query">查询</el-button>
      </el-form-item>
    </el-form> -->
    <el-table :data="converTableData" style="width: 100%" :header-cell-style="tableHeaderColor">
      <el-table-column
        v-for="item in columns"
        :key="item.prop"
        :prop="item.prop"
        :label="item.label"
        :formatter="item.formatter"
      ></el-table-column>
      <!-- <el-table-column fixed="right" label="操作" width="180">
        <template slot-scope="scope">
          <el-button @click="handleClick(scope.row)" type="text" size="small">续费</el-button>
          <el-button type="text" size="small">升级</el-button>
          <el-button type="text" size="small">权限设置</el-button>
        </template>
      </el-table-column> -->
    </el-table>
  </div>
</template>

<script>
export default {
  name: "oderForApplication",
  data() {
    return {
      queryParam: {
        time: "",
        person: "",
        name: ""
      },
      tableData: [],
      columns: [
        {
          prop: "orderId",
          label: "订单号"
        },
        {
          prop: "name",
          label: "购买产品"
        },
        {
          prop: "schoolName",
          label: "购买单位"
        },
        {
          prop: "deadline",
          label: "到期时间",
          formatter: function(value) {
            let text = value.name;
            if (value.deadline == -1) {
              return (text += "永久");
            } else if (value.deadline > 0) {
              return (text += new Date(value.deadline).toLocaleDateString());
            } else {
              return text;
            }
          }
        },
        {
          prop: "price",
          label: "购买金额"
        },
        {
          prop: "createDate",
          label: "下单时间",
          formatter: function(value) {
            return new Date(value.createDate).toLocaleDateString();
          }
        }
      ]
    };
  },
  mounted() {
    this.$http
      .post(
        this.$url.zlurl.saasOrderListV2,
        {
          pageIndex: 1,
          pageSize: 10
        },
        {
          payStatus: 1
        }
      )
      .then(res => {
        
        this.tableData = res.bizData.rows;
      });
  },
  computed: {
    converTableData() {
      let newTableData = [];
      this.tableData.forEach(item => {
        newTableData.push(Object.assign(item, item.schoolOrderDetailVOS[0]));
      });
      return newTableData;
    }
  },
  methods: {
    query() {},
    handleClick() {},
    // 修改table header的背景色
    tableHeaderColor({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === 0) {
        return "background-color: #E7EAEC;";
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.orderList {
  padding: 25px !important;
}
</style>
