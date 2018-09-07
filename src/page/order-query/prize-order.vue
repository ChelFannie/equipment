<template>
  <div class="prize-order">
    <div class="count-order">
      <span>兑奖金额(元)：</span>
      <input v-model="awardAmount" ref="input" autofocus="autofocus" class="amount" type="number" @input="oninput" placeholder="请输入金额">
      <el-button type="primary" @click="upDate">确定</el-button>
    </div>
    <div class="ticketnum" v-show="!noticket">
      订单号：<span>{{serialNumber}}</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      系统算奖金额：<span>{{(calAwardAmount/ 100).toFixed(2) || 0 }}</span> 元
    </div>
    <div class="imgBox" :style="height">
      <img class="img" v-show="!noticket" :src="imgStr" alt="">
      <p class="noticket" v-show="noticket">当前无可兑的票！</p>
    </div>
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
      awardAmount: '',
      calAwardAmount: '',
      // 屏幕高度
      height: {
        height: ''
      },
      noticket: false
    }
  },
  watch: {
  },
  computed: {

  },
  mounted () {
    this.$refs.input.focus()
    const _this = this
    document.onkeydown = function (e) {
      // console.log('获取', e.keyCode)
      if (e.keyCode === 144) {
        return
      }
      switch (e.keyCode) {
        case 0:
          _this.upDate()
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
  created () {
    this.getData()
    this.getHeight()
  },
  methods: {
    // 获取页面高度
    getHeight () {
      this.height.height = window.innerHeight - 220 + 'px'
    },
    // 获取列表数据
    getData () {
      this.awardAmount = ''
      let memberParams = {
        awardFlag: 1
      }
      req('getOrderByAwardFlag', memberParams)
        .then(res => {
          if (res.code === '00000') {
            if (res.data) {
              this.serialNumber = res.data.serialNumber
              this.imgStr = res.data.printResult
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
      let upDateParams = {
        serialNumber: this.serialNumber,
        awardAmount: this.awardAmount
      }
      req('updateAwardAmount', upDateParams)
        .then(res => {
          if (res.code === '00000') {
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
  .ticketnum{
    text-align: center;
    font-size: 20px;
    margin: 10px 0 20px;
    span{
      color: #f71e11;
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
      bottom: 50%;
      left: 0;
      right: 0;
      margin: auto;
      display: inline-block;
      width: 500px;
    }
    .noticket{
      font-size: 28px;
    }
  }
}
</style>
