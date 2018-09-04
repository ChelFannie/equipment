<template>
  <div class="prize-order">
    <div class="count-order">
        <div>
            <span>兑奖金额(元)：</span>
            <input v-model="awardAmount" ref="input" autofocus="autofocus" class="amount" type="number" @input="oninput" placeholder="请输入金额">
            <el-button type="primary" @click="upDate">确定</el-button>
        </div>
    </div>
    <div class="imgBox">
      <p class="ticketnum" v-show="!noticket">订单号：{{ticketInfoNumber}}</p>
      <img class="img" v-show="!noticket" :src="imgStr" alt=""  @click="enlarge">
      <p class="noticket" v-show="noticket">当前无可兑的票！</p>
    </div>
    <!-- 图片放大缩小 -->
    <div class="mask" v-if="Mask" @click="maskClick"></div>
    <div class="enlarge" v-if="enlargeImg">
      <img :src="imgStr" alt="" @click="narrow">
    </div>
    <!-- <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="30%"
      @close="getData">
      <span>兑换成功！</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog> -->
  </div>
</template>

<script>
import req from '../../api/order-list/index.js'
export default {
  components: {},
  data () {
    return {
      // dialogVisible: false,
      imgStr: '',
      ticketInfoNumber: '',
      awardAmount: '',
      Mask: false,
      enlargeImg: false,
      noticket: false
    }
  },
  watch: {
  },
  computed: {

  },
  mounted () {
  },
  created () {
    this.getData()
  },
  methods: {
    // 获取列表数据
    getData () {
      this.awardAmount = ''
      let memberParams = {
        awardFlag: 1
      }
      req('getOrderByAwardFlag', memberParams)
        .then(res => {
          if (res.code === '00000') {
            if (res.data && res.data.ticketInfoNumber) {
              console.log('getdata')
              this.ticketInfoNumber = res.data.ticketInfoNumber
              this.imgStr = res.data.printResult
              this.noticket = false
            } else {
              this.noticket = true
              return
            }
            // try {
            //   this.imgStr = 'data:image/bmp;base64,' + latech.getPDF417BMPFromJS(res.data.qrInfo) // eslint-disable-line
            // } catch (error) {
            //   console.log('图片错误', error)
            // }
          } else {
            this.$message({
              type: 'error',
              message: res.msg
            })
          }
          this.$nextTick(() => {
            this.$refs.input.focus()
          })
        })
      // this.dialogVisible = false
    },
    upDate () {
      let upDateParams = {
        ticketInfoNumber: this.ticketInfoNumber,
        awardAmount: this.awardAmount
      }
      req('updateAwardAmount', upDateParams)
        .then(res => {
          if (res.code === '00000') {
            // this.dialogVisible = true
            this.$message({
              type: 'success',
              message: '兑奖成功！'
            })
            this.getData()
          } else {
            this.$message({
              type: 'error',
              message: res.msg
            })
          }
        })
    },
    // 图片放大
    enlarge () {
      if (this.imgStr === '') {
        return
      }
      this.Mask = true
      this.enlargeImg = true
    },
    // 图片缩小
    narrow (event) {
      event.stopPropagation()
      this.Mask = false
      this.enlargeImg = false
    },
    maskClick (event) {
      event.stopPropagation()
      this.Mask = false
      this.enlargeImg = false
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
    .ticketnum{
      font-size: 20px;
    }
    .img{
      display: inline-block;
      height: 300px;
    }
    .noticket{
      font-size: 28px;
    }
  }
  .mask{
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    opacity: .5;
    background: #000;
    z-index: 999;
  }
  .enlarge{
    width: 300px;
    height: 100%;
    overflow: scroll;
    position: absolute;
    top: 0;
    left: 50%;
    margin-left: -150px;
    z-index: 99999;
    img{
      width: 100%;
    }
  }
  .enlarge::-webkit-scrollbar {
    display: none;
  }
  .el-dialog__body{
      font-size: 20px;
  }
  .el-dialog__close{
      font-size: 32px;
  }
}
</style>
