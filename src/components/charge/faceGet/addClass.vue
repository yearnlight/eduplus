<template>
    <el-dialog
        class="addClass-dialog-container"
        title="创建班级"
        :visible.sync="addClassDialogVisible"
        width="600px">
        <div class="add-class-dialog-body">
            <el-form :model="addClassForm" ref="addClassFormRef" label-width="120px" class="add-class-form">
                <el-form-item label="年级" required>
                    <el-select v-model="addClassForm.grade" placeholder="请选择" @change="changeGrade">
                    <el-option
                        v-for="item in gradeList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                    </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="班号" required>
                    <el-select v-model="addClassForm.classNum" placeholder="请选择" @change="changeClassNum">
                        <el-option
                            v-for="item in classNumList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="班级类型" required>
                    <el-select v-model="addClassForm.classType" placeholder="请选择" @change="changeClassType">
                    <el-option
                        v-for="item in classTypeList"
                        :key="item.id"
                        :label="item.typeName"
                        :value="item.id">
                    </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="名称" class="class-name-item">
                    {{addClassForm.name}}
                </el-form-item>
                <el-form-item label="别名" prop="otherName" class="class-name-item">
                    <el-input v-model="addClassForm.otherName" placeholder="请输入班级别名，控制16个字符"></el-input>
                </el-form-item>
                <el-form-item label="入学年份">
                    <el-date-picker v-model="addClassForm.entranceYear" type="year" placeholder="请选择"></el-date-picker>
                </el-form-item>
                <el-form-item label="定额人数" prop="normedCount" class="class-name-item">
                    <el-input type="number" v-model="addClassForm.normedCount" placeholder="请输入0~99之间的整数"></el-input>
                </el-form-item>
            </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="addClassDialogVisible = false">取消</el-button>
            <el-button type="primary" :disabled="!(addClassForm.gradeName && addClassForm.classNumName && addClassForm.classTypeName)" @click="confirmAddClass">确定</el-button>
        </span>
    </el-dialog>
</template>

<script>
export default {
    name: 'addClassComponent',
    data () {
        return {
            addClassDialogVisible: false,
            addClassForm: {
                name: '',
                gradeName: '',
                gradeInfo: {},
                classNumName: '',
                classNumInfo: {},
                classTypeName: '',
                classTypeInfo: {},
                otherName: '',
                entranceYear: new Date(),
                normedCount: ''
            },
            gradeList: [],
            classNumList: [],
            classTypeList: []
        }
    },
    props: ['updateClass'],
    mounted () {
        this.getGradeClassInfo();
    },
    methods: {
        showDialog () {
            this.addClassDialogVisible = true;
        },
        getGradeClassInfo () {
            this.$http.post(this.$url.zlurl.queryGradeList).then(gradeRes => {
                if(gradeRes.rtnCode == '0000000'){
                this.gradeList = gradeRes.bizData;
                }else{
                this.$message.error(gradeRes.msg);
                }
                return this.$http.post(this.$url.zlurl.queryClassNum)
            }).then(classNumRes => {
                if(classNumRes.rtnCode == '0000000'){
                this.classNumList = classNumRes.bizData;
                }else{
                this.$message.error(classNumRes.msg);
                }
                return this.$http.post(this.$url.zlurl.queryClassTypeList)
            }).then(classTypeRes => {
                if(classTypeRes.rtnCode == '0000000'){
                this.classTypeList = classTypeRes.bizData;
                }else{
                this.$message.error(classTypeRes.msg);
                }
            })
        },
        changeGrade (val) {
            for(let i of this.gradeList){
                if(i.id === val){
                this.addClassForm.gradeName = i.name;
                this.addClassForm.gradeInfo = i;
                if(this.addClassForm.classNumName){
                    this.addClassForm.name = i.name + this.addClassForm.classNumName;
                }else{
                    this.addClassForm.name = i.name;
                }
                break
                }
            }
        },
        changeClassNum (val) {
            for(let i of this.classNumList){
                if(i.id === val){
                this.addClassForm.classNumName = i.name;
                this.addClassForm.classNumInfo = i;
                if(this.addClassForm.gradeName){
                    this.addClassForm.name = this.addClassForm.gradeName + i.name;
                }else{
                    this.addClassForm.name = i.name;
                }
                break
                }
            }
        },
        changeClassType (val) {
            for(let i of this.classTypeList){
                if(i.id === val){
                this.addClassForm.classTypeName = i.typeName;
                this.addClassForm.classTypeInfo = i;
                break;
                }
            }
        },
        confirmAddClass () {
            let params = {
                classId: 0,
                childCount: 0,
                className: this.addClassForm.name,
                grade: this.addClassForm.gradeInfo,
                classNum: this.addClassForm.classNumInfo,
                classType: this.addClassForm.classTypeInfo,
                limitNum: this.addClassForm.normedCount,
                customName: this.addClassForm.otherName,
                entranceYear: new Date(this.addClassForm.entranceYear).getFullYear()
            }
            params = JSON.parse(JSON.stringify(params))
            this.$http.post(this.$url.zlurl.addClass, {}, params).then(res => {
                if(res.rtnCode == '0000000'){
                    this.$message.success('保存成功');
                    this.addClassDialogVisible = false;
                    this.resetData();
                    this.updateClass();
                }else{
                    this.$message.error(res.msg);
                }
            });
        },
        resetData () {
            this.addClassForm = {
                name: '',
                gradeName: '',
                gradeInfo: {},
                classNumName: '',
                classNumInfo: {},
                classTypeName: '',
                classTypeInfo: {},
                otherName: '',
                entranceYear: new Date(),
                normedCount: ''
            }
        }
    }
}
</script>

<style lang="scss">
.addClass-dialog-container{
    .el-dialog__body{
        padding: 40px 60px;
        .class-name-item{
        .el-input__inner{
            width: 280px;
        }
        }
    }
}
</style>


