<template>
  <div class="iDialogError">
    <el-dialog
        title="错误"
        :visible.sync="dialogVisible"
        width="30%"
        :before-close="handleClose">
        <i class="el-icon-circle-close"></i><span>{{content}}</span>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
        </span>
    </el-dialog>
  </div>
</template>
<script>

export default {
  name: 'iDialogError',
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    content: {
      type: String,
      default: '错误信息'
    }
  },
  data () {
    return {
    //   dialogVisible: false
    }
  },
  watch: {

  },
  computed: {

  },
  created () {

  },
  mounted () {

  },
  methods: {
    handleClose (done) {
      done()
    }
  }
}
</script>
<style lang="less">
.iDialogError {
    .el-dialog{
        border-radius: 8px;
        .el-dialog__body{
            padding: 10px 20px;
            display: flex;
            align-items: center;
        }
        .el-icon-circle-close{
            color: red;
            font-size: 35px;
            margin-right: 15px;
        }
    }
}
</style>
