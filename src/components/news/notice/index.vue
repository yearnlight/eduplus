<template>
  <div class="notice-wrap">
    <div v-if="!show && rows.length > 0">
      <el-table
        :data="rows"
        style="width: 100%"
        :show-header="false"
        @expand-change="expandSelect"
        :expand-row-keys="expands"
        :row-key="getRowKeys"
      >
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form
              label-position="left"
              inline
              class="demo-table-expand"
            >
              <el-form-item
                style="display:block;color:blue;"
                label=""
              >
                <span @click="lookDetail(props.row.id)">查看详情</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column
          label=""
          prop="title"
        > </el-table-column>
        <el-table-column
          label=""
          prop="postTime"
        > </el-table-column>
      </el-table>
      <el-pagination
        background
        layout="prev, pager, next, jumper"
        :total="total"
        @current-change="currentChange"
      >
      </el-pagination>
    </div>
    <div v-if="show">
      <el-row>
        <el-col
          :span="4"
          :offset="23"
        >
          <el-button @click="back">返回</el-button>
        </el-col>
      </el-row>
      <div style="text-align:center;">{{ detail.title }}</div>
      <el-divider></el-divider>
      <div style="text-align:center;">{{ detail.time }}</div>
      <div
        style="background:#fff"
        v-html="detail.content"
      ></div>
    </div>
    <div
      class="no-data"
      v-if="rows.length <= 0"
    >
      <img src="../../../assets/nochild.png" />
      <div class="text">
        <p>温馨提示</p>
        <p>您没有查询到相关数据哦~</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      show: false,
      detail: {},
      page: 1, // 当前页,默认1
      pagesize: 10, // 固定10
      total: 0, // 总页数
      records: "", // 消息总数
      rows: [], // 返回数据
      expands: [],
      getRowKeys(row) {
        return row.id;
      }
    };
  },
  methods: {
    back() {
      this.show = false;
      this.detail = {};
    },
    lookDetail(id) {
      this.rows.forEach(item => {
        if (item.id === id) {
          this.detail["title"] = item.title;
          this.detail["content"] = item.content;
          this.detail["time"] = item.postTime
            .replace(/\//g, "-")
            .replace(/上午|下午/g, "");
          this.show = true;
        }
      });
    },
    expandSelect(row, expandedRows) {
      if (expandedRows.length) {
        this.expands = [];
        if (row) {
          this.expands.push(row.id);
        }
      } else {
        this.expands = [];
      }
    },
    currentChange(e) {
      this.page = e;
      this.getNewsList();
    },
    showWhichTr() {
      const id = this.$route.query.id ? this.$route.query.id : "";
      if (id) {
        this.rows.forEach((item, index) => {
          if (item.id === id) {
            this.expands.push(this.rows[index].id);
          }
        });
      }
    },
    formatTime_(tt) {
      const year = tt.getFullYear();
      const month =
        tt.getMonth() + 1 < 10 ? "0" + (tt.getMonth() + 1) : tt.getMonth() + 1;
      const date = tt.getDate() < 10 ? "0" + tt.getDate() : tt.getDate();
      const hours = tt.getHours() < 10 ? "0" + tt.getHours() : tt.getHours();
      const minutes =
        tt.getMinutes() < 10 ? "0" + tt.getMinutes() : tt.getMinutes();
      return {
        year,
        month,
        date,
        hours,
        minutes
      };
    },
    getNewsList() {
      const params = {
        pageIndex: this.page,
        pageSize: 10
      };
      this.$http
        .post(
          `/zl_api/boss/message/saas/messages`, // `/zl_api/boss/message/saas/messages?pageIndex=${this.page}&pageSize=10&token=8c698c36-8c31-47fc-9f88-9e8b8e25e95e&schoolId=6101130221&code=1001210000`,
          params,
          {},
          "application/json"
        )
        .then(res => {
          if (res.rtnCode === "0000000") {
            const { page, pagesize, total, records, rows } = res.bizData;
            this.page = page;
            this.pagesize = pagesize;
            this.total = total * 10;
            this.records = records;
            rows.filter(item => {
              const tt = new Date(item.postTime);
              const { year, month, date, hours, minutes } = this.formatTime_(
                tt
              );
              return (item.postTime = `${year}/${month}/${date} ${
                hours > 12 ? "下午" : "上午"
                }${hours}:${minutes}`);
            });
            this.rows = rows;
          }
        });
    }
  },
  mounted() {
    this.showWhichTr();
    const zhiliao = this.getSg("saas_token"); // 知了
    if (zhiliao) {
      this.getNewsList();
    }
  }
};
</script>

<style lang="scss" scoped>
.notice-wrap {
  .no-data {
    min-height: 400px;
    position: relative;
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    color: #7b7b7b;
    font-size: 14px;
    img {
      height: 171px;
      width: 192px;
    }
    .text {
      transform: translateY(50%);
      -webkit-transform: translateY(50%);
    }
  }
  .set {
    color: red;
  }
  table tbody tr td:nth-child(3) {
    text-align: right;
  }
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
}
</style>
