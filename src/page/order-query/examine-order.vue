<template>
  <div class="examine-order">
    <div class="detail">
      <!-- <span>今日销售：{{statisticData.printedOrderCount || 0}} 张</span>
      <span>金额：{{(statisticData.printedOrderAmount / 100) || 0}} 元</span> -->
      <span>提交时间：{{submitSettleTime}}</span>
    </div>

    <div class="count-order">
      <span class="count-all">审核统计：&nbsp;</span>
      <span>张数：{{accountData.pages || 0}}张</span>
      <span>销售总额： {{(accountData.amounts).toFixed(2) || 0}}元</span>
      <span>奖金： {{(accountData.awardAmounts).toFixed(2) || 0}}元</span>
      <span>结算金额： {{(accountData.operateMoney).toFixed(2) || 0}}元</span>
    </div>

    <el-table
      :height="winHeight"
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      border
      style="width: 100%"
      :row-class-name="tableRowClassName"
      v-loading="loading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading">
      <el-table-column
        prop="serialNumber"
        label="系统编号"
        width="280"
        align="center">
        <template slot-scope="outScope">
          <el-button @click="getOutPopover(outScope.row)" :disabled="outScope.row.flag">{{ outScope.row.serialNumber }}</el-button>
        </template>
      </el-table-column>
      <el-table-column v-for="(item, index) in tableColumn"
        :key="index"
        :prop="item.prop"
        :label="item.label"
        align="center">
      </el-table-column>
    </el-table>

    <el-dialog
      :visible.sync="showOutPopover"
      width="60%"
      center
      class="orderNum-popover"
      id="outPopover">
      <div class="hoverContent">
        <p class="hoverItem">系统票号: <span class="substance">{{orderInfo.ticketInfoNumber}}</span></p>
        <p class="hoverItem">彩种: <span class="substance">{{orderInfo.lotterykinds}}</span></p>
        <p class="hoverItem">倍数: <span class="substance">{{orderInfo.multiple}}倍</span></p>
        <p class="hoverItem">金额: <span class="substance">{{orderInfo.amount}}元</span></p>
        <p class="hoverItem">预计奖金: <span class="substance">25.43元</span></p>
        <p class="hoverItem">出票店铺: <span class="substance">{{orderInfo.storeName}}</span></p>
        <p class="hoverItem">最迟出票时间: <span class="substance">{{orderInfo.lastPrintDate}}</span></p>
        <p class="hoverItem">出票时间: <span class="substance">{{orderInfo.uploadTime}}</span></p>
      </div>
      <el-table :data="hoverData" border class="noright" style="width: 100%">
        <el-table-column v-for="(item, index) in hoverTableColumn"
          :key="index"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
          align="center">
        </el-table-column>
        <el-table-column prop="assumption" label="投注项" width="240" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.lotteryTypeWord}}{{scope.row.subPlayTypeWord}}</span>
            <span v-for="(item1, index1) in scope.row.betItemsObj" :key="index1">[{{item1.key}}&nbsp;({{item1.odds}})]</span>
          </template>
        </el-table-column>
      </el-table>
      <div class="uploadImg">
        <img class="img" :src="imgStr" alt="" @click="enlarge">
      </div>
    </el-dialog>

    <div class="Mask" v-if="Mask" @click="maskClick"></div>
    <div class="enlarge" v-if="enlargeImg">
      <img :src="imgStr" alt="" @click="narrow">
    </div>
  </div>
</template>

<script>
import ChangeBetContext from '../../utils/changeBetContext.js'
import req from '../../api/order-list/index.js'
export default {
  components: {
  },
  data () {
    return {
      tableColumn: [
        {prop: 'lotteryTypeWord', label: '彩种类型', 'min-width': '100'},
        {prop: 'multiple', label: '倍数', 'min-width': '50'},
        {prop: 'amountWord', label: '金额', 'min-width': '100'},
        {prop: 'awardAmountWord', label: '奖金', 'min-width': '100'},
        {prop: 'settleStatusWord', label: '结算', 'min-width': '100'}
      ],
      tableData: [],
      pageIndex: 1,
      pageSize: 150,
      totalCount: 0,
      showOutPopover: false,
      hoverTableColumn: [
        {prop: 'orderNum', label: '编号'},
        {prop: 'host', label: '主队'},
        {prop: 'guest', label: '客队'},
        {prop: 'assumption', label: '预设'}
      ],
      hoverData: [],
      orderInfo: {},
      statisticData: {},
      accountData: {
        pages: 0,
        amounts: 0,
        awardAmounts: 0,
        operateMoney: 0,
        rebatePoint: 0,
        accountList: []
      },
      // 提交时间
      submitSettleTime: '',
      timer: null,
      scanTicket: '',
      imgStr: '',
      Mask: false,
      enlargeImg: false,
      serialNumbersArr: [],
      loading: false,
      winHeight: 0
    }
  },
  watch: {
    // '$store.state.activeIndex' (val) {
    //   if (val === '/order-query/account-order') {
    //     this.getData()
    //   }
    // },
    scanTicket (val) {
      console.log(val, '落地票号')
      // 判断当前扫描的票是否已经审核完成
      let flag = true
      // 判断扫描的票据是否存于待审核列表
      let exitFlag = true
      this.tableData.map(item => {
        if (item.ticketInfoVoList[0].qrInfo === val) {
          exitFlag = false
          if (this.serialNumbersArr.length) {
            for (let i = 0; i < this.serialNumbersArr.length; i++) {
              if (this.serialNumbersArr[i] === item.serialNumber) {
                flag = false
                this.$message({
                  message: '此单已经扫码完成',
                  type: 'error',
                  duration: 1000
                })
                break
              }
            }
            if (flag) {
              // 审核成功后需要改变状态和颜色
              this.$set(item, 'changeSettleStatus', 5)// 审核成功
              this.$set(item, 'settleStatusWord', '审核成功')
              this.serialNumbersArr.push(item.serialNumber)
              this.$message({
                message: '扫描成功',
                type: 'success',
                duration: 1000
              })
            }
          } else {
            this.$set(item, 'changeSettleStatus', 5)// 审核成功
            this.$set(item, 'settleStatusWord', '审核成功')
            this.serialNumbersArr.push(item.serialNumber)
            this.$message({
              message: '扫描成功',
              type: 'success',
              duration: 1000
            })
          }
        }
      })
      if (exitFlag) {
        this.$message({
          message: '该订单不在待审核列表里',
          type: 'error',
          duration: 1000
        })
      }
      // 排序
      this.tableData.sort((a, b) => {
        return a.changeSettleStatus - b.changeSettleStatus
      })
    },
    // 扫码列表的所有订单号
    serialNumbersArr (val) {
      console.log(val.length, '已扫成功的数组长度1')
      console.log(this.tableData.length, 'tableData长度2')
      if (val.length > 0 && (val.length === this.tableData.length)) {
        this.submitToAudit()
      }
    }
  },
  created () {
    if (!this.$store.state.setActiveIndex) {
      this.$store.commit('setActiveIndex', localStorage.getItem('setActiveIndex'))
      let setMenuDisabled = {
        orderList: true,
        accountOrder: true,
        queryOrder: true,
        quitSystem: true
      }
      this.$store.commit('setMenuDisabled', setMenuDisabled)
      localStorage.setItem('setMenuDisabled', JSON.stringify(setMenuDisabled))
    }
    this.serialNumbersArr = []
    this.getData()
    document.addEventListener('click', () => {
      this.showOutPopover = false
    })
    this.winHeight = localStorage.getItem('winHeight') - 285
  },
  mounted () {
    document.getElementById('outPopover').addEventListener('click', (event) => {
      event.stopPropagation()
    })
  },
  methods: {
    // 扫码完成后自动提交
    submitToAudit () {
      req('submitToAudit', {serialNumbers: JSON.stringify(this.serialNumbersArr)})
        .then(res => {
          if (res.code === '00000') {
            try {
              clearInterval(this.timer)
              latech.BCRDisableFromJS() // eslint-disable-line  
            } catch (error) {
              console.log('条码枪')
            }
            this.$message({
              type: 'success',
              message: '全部扫码完成，提交成功!'
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
    // 获取待审核列表
    getData () {
      let memberParams = {
        page: this.pageIndex,
        pageSize: this.pageSize
      }
      this.loading = true
      req('getAuditingList', memberParams)
        .then(res => {
          if (res.code === '00000') {
            try {
              this.scan()
            } catch (error) {
              console.log('条码枪')
            }
            this.loading = false
            this.submitSettleTime = res.data.submitSettleTime ? res.data.submitSettleTime : '无'
            this.accountData.rebatePoint = res.data.store.rebatePoint / 100
            this.statisticData = res.data.statistic
            let amounts = 0
            let awardAmounts = 0
            res.data.orderList.result.map(val => {
              val.lotteryTypeWord = ChangeBetContext.lotteryType(val.lotteryType)
              val.changeSettleStatus = val.settleStatus
              val.subPlayTypeWord = ChangeBetContext.subPlayType(val.subPlayType)
              val.settleStatusWord = ChangeBetContext.settleStatus(val.changeSettleStatus)
              val.amount = val.amount / 100
              val.awardAmount = val.awardAmount / 100
              val.amountWord = (val.amount).toFixed(2)
              val.awardAmountWord = (val.awardAmount).toFixed(2)
              val.flag = false
              amounts += val.amount
              awardAmounts += val.awardAmount
            })
            this.tableData = res.data.orderList.result
            this.totalCount = res.data.orderList.totalCount
            this.accountData.pages = this.tableData.length
            this.accountData.amounts = amounts
            this.accountData.awardAmounts = awardAmounts
            this.accountData.operateMoney = amounts - (awardAmounts + amounts * this.accountData.rebatePoint)
          } else {
            this.$message({
              type: 'error',
              message: res.msg
            })
          }
        })
    },
    // 添加扫码成功后的颜色
    tableRowClassName ({row, rowIndex}) {
      if (row.changeSettleStatus === 5) {
        return 'disabled-row'
      }
      return ''
    },
    // 获取订单信息
    getOutPopover (rows) {
      this.tableData.map(item => {
        if (item.serialNumber === rows.serialNumber) {
          this.$set(item, 'flag', true)
        }
      })
      req('queryTicketList', {serialNumber: rows.serialNumber})
        .then(res => {
          if (res.code === '00000') {
            if (res.data.ticketInfoVoPage.result && res.data.ticketInfoVoPage.result.length) {
              this.ticketInfoNumber = res.data.ticketInfoVoPage.result[0].ticketInfoNumber
            } else {
              this.$message({
                type: 'error',
                message: '此订单无票'
              })
              return
            }
            this.getPopoverData(rows)
          } else {
            this.$message({
              type: 'error',
              message: res.msg
            })
          }
        })
    },
    // 获取票面信息
    getPopoverData () {
      req('getTicketInfo', {ticketInfoNumber: this.ticketInfoNumber})
        .then(res => {
          if (res.code === '00000') {
            let orderInfo = res.data.orderInfo
            orderInfo.lotteryTypeWord = ChangeBetContext.lotteryType(orderInfo.lotteryType)
            orderInfo.subPlayTypeWord = ChangeBetContext.subPlayType(orderInfo.subPlayType)
            orderInfo.amount = (orderInfo.amount / 100).toFixed(2)
            this.orderInfo = orderInfo
            this.orderInfo.lotterykinds = `${orderInfo.lotteryTypeWord}${orderInfo.subPlayTypeWord}`
            this.orderInfo.printResult && (this.imgStr = this.orderInfo.printResult)
            // 投注项
            let betContextList = res.data.betContextList
            betContextList.map(val => {
              val.assumption = !val.score ? '—' : val.score
              val.assumptionFlag = false
              val.orderNum = ChangeBetContext.changeMatchUniqueId(val.matchUniqueId)
              val.betItemsObj.map(val1 => {
                for (let oddsKey in val1) {
                  let obj = {}
                  obj[oddsKey] = val1[oddsKey]
                  val1[val.matchUniqueId] = obj
                  val1.odds = val1[oddsKey]
                  val1.flag = false
                  val1.key = ChangeBetContext.bet(val.subPlayType, oddsKey)
                }
              })
              val.lotteryTypeWord = ChangeBetContext.lotteryType(val.lotteryType)
              val.subPlayTypeWord = ChangeBetContext.subPlayType(val.subPlayType)
            })
            this.hoverData = betContextList
            this.tableData.map(item => {
              if (this.orderInfo.serialNumber === item.serialNumber) {
                this.$set(item, 'flag', false)
              }
            })
            this.showOutPopover = true
          } else {
            this.$message({
              type: 'error',
              message: res.msg
            })
          }
        })
    },
    scan () {
      // 条码枪初始化
      if (latech.BCRInitFromJS() === 0) { // eslint-disable-line
        // 条码枪设置扫描模式 参数： 1 手动模式， 2 自动模式
        if (latech.BCRSetScanModeFromJS(1) === true) { // eslint-disable-line
          // 条码枪开始扫描
          // latech.BCRStartScanFromJS() // eslint-disable-line
          const _this = this
          _this.timer = setInterval(function () {
            let flag = latech.BCRScanIsCompleteFromJS() // eslint-disable-line
            // let flag = latech.BCRIsReadlyFromJS() // eslint-disable-line
            // console.log(flag) // eslint-disable-line
            if (flag === true) { // 判断读票机是否读完票
              // clearInterval(_this.timer)
              _this.scanTicket = latech.BCRGetTicketInfoFromJS() // eslint-disable-line
              latech.BCRStopScan() // eslint-disable-line
            }
          }, 200)
        }
      }
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
    }
  },
  destroyed () {
    try {
      clearInterval(this.timer)
      latech.BCRDisableFromJS() // eslint-disable-line  
    } catch (error) {
      console.log('条码枪')
    }
  }
}
</script>

<style lang="less">
.examine-order{
  .detail{
    box-sizing: border-box;
    width: calc(100% - 60px);
    line-height: 40px;
    color: #1f2f3d;
    font-size: 20px;
    position: fixed;
    top: 100px;
    left: 30px;
    z-index: 998;
    background: #ffffff;
    padding: 10px 20px 0;
    >span{
      margin-right: 60px;
    }
    .btn{
      float: right;
    }
  }
  .count-order{
    box-sizing: border-box;
    width: calc(100% - 60px);
    padding:0 20px 10px;
    height: 35px;
    font-size: 16px;
    background: #ffffff;
    position: fixed;
    top: 150px;
    left: 30px;
    z-index: 998;
    border-bottom: 1px solid #4dafdb;
    .count-all{
      display: inline-block;
      margin-right: 10px;
    }
    span{
      margin-right: 60px;
    }
  }
  .page{
    margin-top: 15px;
    margin-left: 100px;
  }
  // 禁用的颜色
  .el-table .disabled-row {
    background: #FE4C40;
    color: #fff;
    .el-button{
      background: #FE4C40;
      color: #fff;
      border: none;
    }
  }
  .orderNum-popover{
    .el-dialog{
      margin-top: 0 !important;
      margin-bottom: 0;
    }
    .el-dialog__header{
      padding: 0;
    }
    .el-dialog__header{
      padding: 0;
    }
    .popper__arrow{
      top: 2% !important;
    }
    .hoverInput{
      display: flex;
      align-items: center;
      span{
        width: 100px;
      }
      .el-input__inner{
        width: 545px;
        height: 33px;
      }
    }
    .hoverItem{
      display: inline-block;
      margin: 10px 40px 0 0;
      .substance{
        color: #4daedb;
      }
    }
    .noright{
      margin-top: 20px;
    }
    .uploadImg{
      margin-top: 10px;
      .no-image{
        margin: 0 auto;
        width: 200px;
        height: 250px;
        line-height: 250px;
        text-align: center;
        border: 1px solid #cccccc;
      }
      .img{
        margin: 10px auto;
        width: 250px;
        height: 380px;
        display: block;
      }
    }
  }
  .managerLogin-right{
    width: 100px;
    height: 50px;
    line-height: 50px;
    background: #409EFF;
    color: #fff;
    letter-spacing: 6px;
    cursor:pointer;
  }
  .Mask{
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    opacity: .5;
    background: #000;
    z-index: 9999;
  }
  .enlarge{
    width: 300px;
    position: absolute;
    top: 0;
    left: 50%;
    margin-left: -150px;
    z-index: 99999;
    img{
      width: 100%;
    }
  }
}
</style>
