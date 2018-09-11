<template>
  <div class="prize-order">
    <div class="count-order">
      <span class="mr">票机兑换票：{{totalTicket}} 张</span>
      <span class="mr">票机兑换金额：{{totalMoney.toFixed(2)}} 元</span>
      <span>兑奖金额(元)：</span>
      <input v-model="awardAmount" ref="input" class="amount" type="number" @input="oninput" placeholder="请输入金额">
      <el-button type="primary" @click="upDate">确定</el-button>
    </div>
    <div class="ticketnum" v-show="!noticket">
      订单号：<span>{{serialNumber}}</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      系统算奖金额：<span class="bigger">{{(calAwardAmount/ 100).toFixed(2) || 0 }}</span> 元
    </div>
    <div class="imgBox" :style="height">
      <img class="img" :class="{'img-animation':imgAnimation}" v-show="!noticket" :src="imgStr" alt="">
      <p class="noticket" v-show="noticket">当前无可兑数据！</p>
    </div>
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="30%"
      @close="cancelCommit">
      <span>输入金额与算奖金额不一致<br>是否继续提交？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelCommit">取 消</el-button>
        <el-button type="primary" @click="sureUpDate">确 定</el-button>
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
      imgStr: '',
      serialNumber: '',
      ticketInfoNumber: '',
      awardAmount: '',
      calAwardAmount: '',
      totalTicket: 0,
      totalMoney: 0,
      originalAmount: 0,
      dialogVisible: false,
      // 屏幕高度
      height: {
        height: ''
      },
      // 图片动画效果
      imgAnimation: true,
      noticket: false
    }
  },
  watch: {
    totalMoney (val) {
      sessionStorage.setItem('totalMoney', val)
    },
    '$store.state.prizeCancelFlag' (val) {
      if (val === true) {
        this.$store.commit('setPrizeCancelFlag', false)
        this.$refs.input.focus()
      }
    }
  },
  computed: {

  },
  created () {
    this.getData()
    this.getHeight()
    this.originalAmount = JSON.parse(sessionStorage.getItem('originalAmount'))
    this.totalMoney = Number(this.originalAmount)
    sessionStorage.setItem('totalTicket', this.totalTicket)
    sessionStorage.setItem('totalMoney', this.totalMoney)
    sessionStorage.setItem('handActive', true)
    sessionStorage.setItem('clearStyle', true)
  },
  mounted () {
    this.$nextTick(() => {
      this.$refs.input.focus()
    })
    const _this = this
    document.onkeydown = function (e) {
      // console.log('获取', e.keyCode)
      if (e.keyCode === 144) {
        return
      }
      switch (e.keyCode) {
        case 0:
          if (!_this.dialogVisible) {
            if (_this.$store.state.managerFlag || _this.$store.state.prizeExitFlag) {
              _this.$store.commit('setkeyboardCode', 0)
            } else {
              _this.upDate()
            }
          } else {
            _this.sureUpDate()
          }
          break
        case 8:
          if (!_this.dialogVisible) {
            _this.$store.commit('setkeyboardCode', 8)
          } else {
            _this.cancelCommit()
          }
          break
        case 111:
          _this.$store.commit('setkeyboardCode', 111)
          break
        case 106:
          _this.$store.commit('setkeyboardCode', 106)
          break
        case 107:
          _this.$store.commit('setkeyboardCode', 107)
          return false
          break // eslint-disable-line
        case 109:
          _this.$store.commit('setkeyboardCode', 109)
          return false
          break // eslint-disable-line
          break
        default:
          break
      }
    }
  },
  methods: {
    // 获取页面高度
    getHeight () {
      this.height.height = window.innerHeight - 220 + 'px'
    },
    // 获取列表数据
    getData () {
      let memberParams = {
        awardFlag: 1
      }
      req('getOrderByAwardFlag', memberParams)
        .then(res => {
          if (res.code === '00000') {
            if (res.data) {
              this.serialNumber = res.data.serialNumber
              this.ticketInfoNumber = res.data.ticketInfoNumber
              this.imgStr = res.data.printResult
              this.imgAnimation = true
              this.calAwardAmount = res.data.calAwardAmount
              this.noticket = false
            } else {
              this.noticket = true
            }
          } else {
            this.$message({
              type: 'error',
              message: res.msg
            })
          }
        })
    },
    // 提交兑奖数据
    upDate () {
      if (!this.noticket) {
        if (this.awardAmount) {
          let deviation = Number(this.awardAmount) - Number(this.calAwardAmount / 100)
          if (deviation >= -1 && deviation <= 1) {
            this.sureUpDate()
          } else {
            this.dialogVisible = true
          }
        } else {
          this.$message({
            type: 'error',
            message: '请输入金额！',
            onClose: () => { this.$refs.input.focus() }
          })
        }
      } else {
        this.$message({
          type: 'error',
          message: '当前无可兑数据！'
        })
      }
    },
    sureUpDate () {
      this.dialogVisible = false
      this.imgAnimation = false
      let upDateParams = {
        ticketInfoNumber: this.ticketInfoNumber,
        awardAmount: this.awardAmount
      }
      req('updateAwardAmount', upDateParams)
        .then(res => {
          if (res.code === '00000') {
            this.totalTicket = this.totalTicket + 1
            this.totalMoney = Number(this.totalMoney) + Number(this.awardAmount)
            sessionStorage.setItem('totalTicket', this.totalTicket)
            sessionStorage.setItem('totalMoney', this.totalMoney)
            let _this = this
            this.$message({
              type: 'success',
              message: '兑奖成功！',
              onClose: _this.getData
            })
          } else {
            this.$message({
              type: 'error',
              message: res.msg
            })
          }
        })
    },
    cancelCommit () {
      this.dialogVisible = false
      this.awardAmount = ''
      this.$refs.input.focus()
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
    overflow: hidden;
    .mr{
      margin-right: 30px;
    }
  }
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
  .ticketnum{
    text-align: center;
    font-size: 20px;
    margin: 10px 0 20px;
    span{
      color: #f71e11;
      &.bigger{
        font-size: 28px;
      }
    }
  }
  .imgBox{
    box-sizing: border-box;
    text-align: center;
    width: 100%;
    padding-top: 40px;
    position: relative;
    overflow: hidden;
    .img{
      margin-top: 30px;
      position: absolute;
      left: 0;
      right: 0;
      bottom: 50%;
      margin: auto;
      display: inline-block;
      width: 500px;
    }
    .img-animation{
      animation:myfirst 1s forwards;
    }
    @keyframes myfirst{
      from {bottom: -100%;}
      to {bottom: 50%;}
    }
    .noticket{
      font-size: 28px;
    }
  }
  .el-dialog__body{
    font-size: 20px;
    padding: 20px 50px;
    text-align: center;
    color: #f71e11;
  }
}
</style>
