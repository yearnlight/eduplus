<template>
    <el-dialog
        class="add-charge-item-dialog-container"
        title="选择收费项目"
        :visible.sync="dialogVisible"
        width="850px">
        <div class="add-class-dialog-body">
            <el-form :model="formInfo" :inline="true" label-width="120px" class="add-charge-item-form">
            <el-form-item label="收费项目：" prop="keyword">
                <el-input v-model="formInfo.keyword" placeholder=""></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="search">查询</el-button>
            </el-form-item>
            <el-form-item>
                <el-button @click="reset">重置</el-button>
            </el-form-item>
            </el-form>
            <el-table v-show="tableData.length"
                ref="addChargeItemRef"
                :data="tableData" tooltip-effect="dark" style="width: 100%" height="400" border :size="'medium'" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column label="收费项目">
                    <template slot-scope="scope">
                        {{scope.row.chaName}}&nbsp;<em v-if="scope.row.needPay == 2" class="blue choose-pay">选交</em>
                    </template>
                </el-table-column>
                <el-table-column label="是否考勤结算" width="110">
                    <template slot-scope="scope">
                        {{scope.row.attendenceBased ? '是' : '否'}}
                    </template>
                </el-table-column>
                <el-table-column label="最小结算天数" prop="lowerDayLimit" width="110"></el-table-column>
                <el-table-column label="最大结算天数" prop="upperDayLimit" width="110"></el-table-column>
                <el-table-column label="收费金额" width="100">
                    <template slot-scope="scope">
                        {{scope.row.chaPrice/100 | moneyFilter}}{{scope.row.attendenceBased ? '/天' : ''}}
                    </template>
                </el-table-column>
                <el-table-column prop="abbreviationsStr" width="150">
                    <template slot="header">
                        收费项生效范围
                        <el-tooltip class="item" effect="dark" content="收费项的生效范围仅适用于自动生成账单" placement="top">
                            <i class="el-icon-info"></i>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
            <div v-show="!tableData.length" class="warmly-tips">
                <p>温馨提示</p>
                <p>没有更多的收费项目，请前往<router-link class="red" to="/eduplus/charge/setting">财务管理-收费管理-收费设置</router-link>添加新的收费项目～</p>
            </div>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="cancelAddChargeItem">取消</el-button>
            <el-button type="primary" :disabled="selectedItems.length==0" @click="confirmAddChargeItem">确定</el-button>
        </span>
    </el-dialog>
</template>

<script>
import { debuglog } from 'util';
export default {
    name: 'chargeItemComponent',
    data () {
        return {
            dialogVisible: false,
            tableData: [],
            selectedItems: [],
            formInfo: {
                keyword: ''
            },
        }
    },
    props: ['parentChargeItems', 'setChargeItem'],
    mounted () {
        this.getData();
    },
    watch: {
        parentChargeItems (newVal, oldVal) {
            this.getData();
        }
    },
    methods: {
        showDialog () {
            this.dialogVisible = true;
        },
        search () {
            this.getData(this.formInfo.keyword);
        },
        reset () {
            this.formInfo.keyword = '';
            this.getData();
        },
        getData (chaName) {
            let _url = `${this.$url.zlurl.queryChargeItems}?chaDefaultItem=&specialCode=1`
            if(chaName){
                _url += `&chaName=${chaName}`
            }
            this.$http.post(_url).then(res => {
                if(res.rtnCode == '0000000'){
                    if(res.bizData.length){
                        this.tableData = this.AssembleShowMonthData(res.bizData);
                        this.filterTotalChargeItems();
                    }else{
                        this.tableData = []
                    }
                }else{
                    this.$message.error(res.msg);
                }
            })
        },
        filterTotalChargeItems () {
            if(this.tableData.length && this.parentChargeItems.length){
                this.parentChargeItems.forEach((val, index) => {
                    this.tableData.forEach((subVal, subIndex) => {
                        if(subVal.id === val.id || subVal.id === val.chaChargeItemId){
                            this.tableData.splice(subIndex, 1);
                        }
                    })
                })
            }
        },
        AssembleShowMonthData (data) {
            if ((!!data) && (!!data.length)) {
                for (var it = 0; it < data.length; it++) {
                    var item = data[it];
                    item.completeStr = "";
                    item.abbreviationsStr = "";
                    if (item.chargeEffectRange == "1") {
                        item.completeStr = item.abbreviationsStr = "全年";
                    } else {
                        var mothLists = item.effectMonth && item.effectMonth.split("-") || [];
                        for (var k = 0; k < mothLists.length; k++) {
                            if (!!mothLists[k]) {
                                mothLists[k] = mothLists[k] + "月";
                                item.completeStr += mothLists[k] + ",";
                                if (k < 3) {
                                    item.abbreviationsStr = k == mothLists.length - 1 ? item.abbreviationsStr + mothLists[k] : k == 2 ? item.abbreviationsStr + mothLists[k] + "..." : item.abbreviationsStr + mothLists[k] + ",";
                                }
                            }
                        }
                        item.completeStr = item.completeStr.length > 0 ? item.completeStr.substring(0, item.completeStr.lastIndexOf(',')) : ""
                    }
                }
                return data;
            }
        },
        handleSelectionChange (selection) {
            this.$set(this, 'selectedItems', selection)
        },
        confirmAddChargeItem () {
            let tmpArr = JSON.parse(JSON.stringify(this.parentChargeItems));
            this.setChargeItem(tmpArr.concat(this.selectedItems))
            this.cancelAddChargeItem();
        },
        cancelAddChargeItem () {
            this.dialogVisible = false;
            this.$refs.addChargeItemRef.clearSelection();
            this.selectedItems = [];
        }
    }
}
</script>

<style lang="scss">
.add-charge-item-dialog-container{
    .el-dialog__body{
        padding-top: 24px;
    }
    .choose-pay{
        font-style: normal;
        font-size: 12px;
        padding: 0 1px;
        border: 1px solid #008EFF;
    }
    .warmly-tips{
        padding: 40px;
    }
}
</style>


