<template>
    <el-dialog
            :title="title"
            :visible.sync="visible"
            :close-on-click-modal="closeOnClickModal"
            :close-on-press-escape="closeOnPressEscape"
            :show-close="showClose"
            @close="handleCloseDialogCallback"
            :custom-class="customClass"
            width="600px">
        <slot></slot>
        <!--<span slot="footer" class="dialog-footer">-->
            <!--<el-button @click="cancel">取 消</el-button>-->
            <!--<el-button type="primary" @click="confirm">确 定</el-button>-->
        <!--</span>-->
    </el-dialog>
</template>

<script>
    export default {
        name: "baseModel",
        props:{
            dialogVisible:{
                type:Boolean,
                default:false
            },
            title:{
                type:String,
                default:''
            },
            handleClose:Function,
            handleConfirm:Function,
            closeOnClickModal: {
                type: Boolean,
                default: false
            },
            closeOnPressEscape: {
                type: Boolean,
                default: false
            },
            showClose: {
                type: Boolean,
                default: true
            },
            customClass:{
                type:String,
                default: ''
            }
        },
        data(){
            return {
                visible: this.dialogVisible
            }
        },
        methods:{
            cancel(){
                //this.visble = false
                this.handleClose()
            },
            confirm(){
                this.handleConfirm()
            },
            handleCloseDialogCallback(){
                if ('function' === typeof this.handleClose) {
                    this.handleClose();
                }
            }

        },
        watch:{
            dialogVisible(){
                this.visible = this.dialogVisible;
            }
        }
    }
</script>


<style scoped>

</style>