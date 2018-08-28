<template>
  <div class="prize-order">
    <div class="count-order">
        <div>
            <span>兑奖金额(元)：</span>
            <input v-model="awardAmount" class="amount" type="number" @input="oninput" placeholder="请输入金额">
            <el-button type="primary" @click="upDate">确定</el-button>
        </div>
    </div>
    <div class="imgBox" :ticketInfoNumber="ticketInfoNumber">
      <img class="img" :src="imgStr" alt="">
    </div>
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="30%"
      @close="getData">
      <span>兑换成功！</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import req from '../../api/order-list/index.js'
export default {
  components: {},
  data () {
    return {
      dialogVisible: false,
      imgStr: '',
      ticketInfoNumber: '',
      awardAmount: ''
    }
  },
  watch: {
  },
  computed: {

  },
  created () {
    this.getData()
  },
  methods: {
    // 获取列表数据
    getData () {
      // this.imgStr = '../../assets/logo.png'
      let memberParams = {
        awardFlag: 1
      }
      req('getOrderByAwardFlag', memberParams)
        .then(res => {
          if (res.code === '00000') {
            console.log(res.data)
            this.ticketInfoNumber = res.data.ticketInfoNumber
            try {
              this.imgStr = 'data:image/bmp;base64,' + latech.getPDF417BMPFromJS(res.data.qrInfo) // eslint-disable-line
            } catch (error) {
              console.log('图片错误', error)
            }
          } else {
            this.$message({
              type: 'error',
              message: res.msg
            })
          }
        })
      this.dialogVisible = false
    },
    upDate () {
      let upDateParams = {
        ticketInfoNumber: this.ticketInfoNumber,
        awardAmount: this.awardAmount
      }
      req('updateAwardAmount', upDateParams)
        .then(res => {
          if (res.code === '00000') {
            this.dialogVisible = true
          } else {
            this.$message({
              type: 'error',
              message: res.msg
            })
          }
        })
    },
    oninput (e) {
      // 通过正则过滤小数点后两位
      e.target.value = (e.target.value.match(/^\d*(\.?\d{0,2})/g)[0]) || null
      this.awardAmount = e.target.value
    }
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
    .amount{
        font-size: 20px;
        margin-right: 20px;
        line-height: 40px;
        padding: 0 10px;
    }
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
        -webkit-appearance: none;
    }
    input[type="number"]{
        -moz-appearance: textfield;
    }
  }
  .imgBox{
    text-align: center;
    .img{
      width: 800px;
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
