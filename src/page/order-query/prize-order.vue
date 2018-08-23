<template>
  <div class="prize-order">
    <div class="count-order">
        <div>
            <span>兑奖金额(元)：</span>
            <el-input v-model="input" placeholder="请输入内容"></el-input>
            <el-button type="primary" @click="dialogVisible = true">确定</el-button>
        </div>
    </div>

    <el-dialog
        title="提示"
        :visible.sync="dialogVisible"
        width="30%">
        <span>兑换失败！</span>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  components: {},
  data () {
    return {
      input: '',
      dialogVisible: false
    }
  },
  watch: {

  },
  computed: {

  },
  created () {

  },
  methods: {
    // 获取列表数据
    // getData () {
    //   req('getSettleList', memberParams)
    //     .then(res => {
    //       if (res.code === '00000') {
    //       } else {
    //         this.$message({
    //           type: 'error',
    //           message: res.msg
    //         })
    //       }
    //     })
    // }
  }
}
</script>

<style lang="less">
.prize-order {
  .count-order {
    box-sizing: border-box;
    width: calc(100% - 60px);
    padding: 15px;
    font-size: 20px;
    background: #ffffff;
    position: fixed;
    top: 110px;
    left: 30px;
    z-index: 998;
    border-bottom: 1px solid #4dafdb;
    text-align: center;
    .el-input{
        width: auto;
        font-size: 20px;
        margin-right: 20px;
        line-height: 46px;
    }
  }
  .el-dialog__body{
      font-size: 20px;
  }
  .el-dialog__close{
      font-size: 32px;
  }
}
</style>
