<template>
  <div class="examine-order">
    <div class="count-order">
      <span class="count-all">审核统计：&nbsp;</span>
      <span>张数：{{accountData.pages || 0}}张</span>
      <span>销售总额： {{(accountData.amounts).toFixed(2) || 0}}元</span>
      <span>奖金： {{(accountData.awardAmounts).toFixed(2) || 0}}元</span>
      <span>结算金额： {{(accountData.operateMoney).toFixed(2) || 0}}元</span>
      <span>提交时间：{{submitSettleTime}}</span>
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
      element-loading-spinner="el-icon-loading"
      @row-click="getOutPopover">
      <el-table-column v-for="(item, index) in tableColumn"
        :key="index"
        :prop="item.prop"
        :label="item.label"
        :min-width="item.width"
        align="center">
      </el-table-column>
    </el-table>

    <!-- 票详情页 -->
    <el-dialog
      :visible.sync="showOutPopover"
      width="80%"
      center
      class="orderNum-popover"
      id="outPopover"
      title="订单详情">
      <div class="hoverContent">
        <el-row :gutter="10">
          <el-col :span="12">出票店铺：<div class="grid-content">{{orderInfo.storeName}}</div></el-col>
          <el-col :span="12">系统票号：<div class="grid-content">{{orderInfo.ticketInfoNumber || '暂无'}}</div></el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="12">出票时间：<div class="grid-content">{{orderInfo.uploadTime}}</div></el-col>
          <el-col :span="12">最迟出票时间：<div class="grid-content">{{orderInfo.lastPrintDate}}</div></el-col>
        </el-row>
        <el-row class="tip" :gutter="20">
          <el-col :span="5">彩种：<div class="grid-content">{{orderInfo.lotterykinds}}</div></el-col>
          <el-col :span="4">过关方式：<div class="grid-content">{{orderInfo.betTypeWord}}</div></el-col>
          <el-col :span="3">倍数：<div class="grid-content">{{orderInfo.multiple}}倍</div></el-col>
          <el-col :span="5">金额：<div class="grid-content">{{orderInfo.amount}}元</div></el-col>
          <el-col :span="7">预计奖金：<div class="grid-content red">{{orderInfo.maxMoney || 0.00}}元</div></el-col>
        </el-row>
      </div>
      <div class="contentBox">
        <el-table :data="hoverData" border class="noright" style="width: 70%">
          <el-table-column v-for="(item, index) in hoverTableColumn"
            :key="index"
            :prop="item.prop"
            :label="item.label"
            :width="item.width"
            align="center">
          </el-table-column>
          <el-table-column
            prop="assumption"
            label="预设"
            align="center"
            v-if="orderInfo.assumptionShow">
          </el-table-column>
          <el-table-column prop="assumption" label="投注项" width="240" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.subPlayTypeWord}}</span>
              <span v-for="(item1, index1) in scope.row.betItemsObj" :key="index1">[{{item1.key}}&nbsp;({{item1.odds}})]</span>
            </template>
          </el-table-column>
        </el-table>
        <div class="uploadImg">
          <img class="img" :src="imgStr" alt="" @click="enlarge">
        </div>
      </div>
    </el-dialog>

    <!-- 图片放大 -->
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
        {prop: 'serialNumber', label: '系统编号', width: '250'},
        {prop: 'typeWords', label: '彩种类型', width: '130'},
        {prop: 'multiple', label: '倍数', width: '80'},
        {prop: 'amountWord', label: '金额', width: '100'},
        {prop: 'awardAmountWord', label: '奖金', width: '100'},
        {prop: 'settleStatusWord', label: '结算', width: '100'}
      ],
      // 列表数据
      tableData: [],
      pageIndex: 1,
      pageSize: 150,
      // 列表总条数
      totalCount: 0,
      // 控制票详情页是否打开
      showOutPopover: false,
      // 票详情页的表格表头
      hoverTableColumn: [
        {prop: 'orderNum', label: '编号'},
        {prop: 'host', label: '主队'},
        {prop: 'guest', label: '客队'}
      ],
      // 票详情页的表格数据
      hoverData: [],
      // 票详情页的基本信息
      orderInfo: {},
      // 审核统计数据
      accountData: {
        // 张数
        pages: 0,
        // 销售总额
        amounts: 0,
        // 奖金和
        awardAmounts: 0,
        // 结算金额
        operateMoney: 0,
        // 比例
        rebatePoint: 0
      },
      // 提交时间
      submitSettleTime: '',
      timer: null,
      scanTicket: '',
      // 图片
      imgStr: '',
      // 放大图片的遮罩层
      Mask: false,
      enlargeImg: false,
      // 审核成功的数据
      serialNumbersArr: [],
      loading: false,
      winHeight: 0,
      lastqrInfo: '',
      // 系统票号
      ticketInfoNumber: ''
    }
  },
  watch: {
    scanTicket (val) {
      console.log(val, '落地票号')
      // 判断当前扫描的票是否已经审核完成
      let flag = true
      // 判断扫描的票据是否存于待审核列表，默认不存在
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
        .catch(error => {
          console.log(error)
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
              console.log('条码枪错误', error)
            }
            this.loading = false
            this.submitSettleTime = res.data.submitSettleTime ? res.data.submitSettleTime : '无'
            this.accountData.rebatePoint = res.data.store.rebatePoint / 100
            let amounts = 0
            let awardAmounts = 0
            res.data.orderList.result.map(val => {
              val.lotteryTypeWord = ChangeBetContext.lotteryType(val.lotteryType)
              val.changeSettleStatus = val.settleStatus
              val.subPlayTypeWord = ChangeBetContext.subPlayType(val.subPlayType)
              val.settleStatusWord = ChangeBetContext.settleStatus(val.changeSettleStatus)
              val.amount = val.amount / 100
              val.calAwardAmount = val.calAwardAmount / 100
              val.amountWord = (val.amount).toFixed(2)
              val.awardAmountWord = (val.calAwardAmount).toFixed(2)
              val.flag = false
              amounts += val.amount
              awardAmounts += val.calAwardAmount
              val.typeWords = `${val.lotteryTypeWord}${val.subPlayTypeWord}`
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
        .catch(error => {
          console.log(error)
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
    getOutPopover (rows, event, column) {
      this.orderInfo = {}
      this.hoverData = []
      this.ticketInfoNumber = ''
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
        .catch(error => {
          console.log(error)
        })
    },
    // 获取票面信息
    getPopoverData () {
      req('getTicketInfo', {ticketInfoNumber: this.ticketInfoNumber})
        .then(res => {
          if (res.code === '00000') {
            let maxMoney = 0
            let calcData = JSON.parse(JSON.stringify(res.data))
            // 数据出现异常
            // if (calcData.orderInfo.betType !== 'single') {
            //   // 判断后台拆票是否出现问题
            //   let ticketErrorFlag = false
            //   let betLen = Number(calcData.orderInfo.betType.split('x')[0])
            //   let tablelen = calcData.betContextList.length
            //   betLen !== tablelen && (ticketErrorFlag = true)
            //   // 判断是否拆票时，有重复的matchUniqueId
            //   let repeatIdFlag = false
            //   for (let i = 0; i < calcData.betContextList.length - 1; i++) {
            //     if (calcData.betContextList[i].matchUniqueId === calcData.betContextList[i + 1].matchUniqueId) {
            //       repeatIdFlag = true
            //       break
            //     }
            //   }
            //   if (ticketErrorFlag || repeatIdFlag) {
            //     this.$alert('数据出现异常，请联系开发人员！', '错误提示', {
            //       confirmButtonText: '确定',
            //       type: 'error',
            //       showClose: false,
            //       callback: action => {
            //         console.log('后台数据出现异常，请检查！')
            //       }
            //     })
            //     // return
            //   }
            // }
            // 计算最高奖金
            try {
              if (calcData.orderInfo.betType === 'single') {
                maxMoney = ChangeBetContext.returnFloat((ChangeBetContext.getSingleMaxMoney(JSON.parse(calcData.orderInfo.betContextOdds), calcData.orderInfo.multiple)))
                maxMoney = maxMoney >= 100000 ? 100000 : maxMoney
              } else {
                let dataInfo = ChangeBetContext.getPassMaxMoney(calcData)
                maxMoney = ChangeBetContext.returnFloat(ChangeBetContext.returnEvenRound(ChangeBetContext.returnEvenRound(dataInfo.price) * calcData.orderInfo.multiple))
                // 过关场次
                let tablelen = calcData.betContextList.length
                if (tablelen === 2 || tablelen === 3) {
                  maxMoney = maxMoney >= 200000 ? 200000 : maxMoney
                } else if (tablelen === 4 || tablelen === 5) {
                  maxMoney = maxMoney >= 500000 ? 500000 : maxMoney
                } else if (tablelen >= 6 && tablelen <= 8) {
                  maxMoney = maxMoney >= 1000000 ? 1000000 : maxMoney
                }
              }
              maxMoney = ChangeBetContext.getQianfenWei(maxMoney)
            } catch (error) {
              console.log(error)
            }
            // 获取信息
            let orderInfo = res.data.orderInfo
            orderInfo.maxMoney = maxMoney
            orderInfo.lotteryTypeWord = ChangeBetContext.lotteryType(orderInfo.lotteryType)
            orderInfo.subPlayTypeWord = ChangeBetContext.subPlayType(orderInfo.subPlayType)
            orderInfo.amount = (orderInfo.amount / 100).toFixed(2)
            orderInfo.uploadTime = orderInfo.uploadTime ? orderInfo.uploadTime : '暂无'
            orderInfo.lastPrintDate = orderInfo.lastPrintDate ? orderInfo.lastPrintDate : '暂无'
            if (orderInfo.betType === 'single') {
              orderInfo.betTypeWord = '单关'
            } else if (Object.prototype.toString.call(orderInfo.betType) === '[object String]') {
              orderInfo.betTypeWord = orderInfo.betType
            } else {
              orderInfo.betTypeWord = JSON.parse(orderInfo.betType)
            }
            this.orderInfo = orderInfo
            this.orderInfo.lotterykinds = `${orderInfo.lotteryTypeWord}${orderInfo.subPlayTypeWord}`
            // 竞彩篮球的让球胜负和大小分彩种才需要显示预设值
            if (this.orderInfo.subPlayType === '61' || this.orderInfo.subPlayType === '64' || this.orderInfo.subPlayType === '69') {
              this.orderInfo.assumptionShow = true
            } else {
              this.orderInfo.assumptionShow = false
            }
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
                  // 遍历生成的popover必须添加唯一的显示与隐藏的标志
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
        .catch(error => {
          console.log(error)
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
            // 判断扫描枪是否扫描完
            if (latech.BCRScanIsCompleteFromJS() === true) { // eslint-disable-line
              // clearInterval(_this.timer)
              _this.scanTicket = latech.BCRGetTicketInfoFromJS() // eslint-disable-line
              latech.BCRStopScan() // eslint-disable-line
              if (_this.lastqrInfo === _this.scanTicket) {
                _this.$message({
                  type: 'error',
                  message: '此单已扫码，请扫码新的单据！'
                })
              } else {
                _this.lastqrInfo = _this.scanTicket
              }
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
      this.Mask = false
      this.enlargeImg = false
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
  .count-order{
    box-sizing: border-box;
    width: calc(100% - 60px);
    padding:20px;
    font-size: 20px;
    background: #ffffff;
    position: fixed;
    top: 110px;
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
  .el-table{
    font-size: 20px;
  }
  .page{
    margin-top: 15px;
    margin-left: 100px;
  }
  // 禁用的颜色
  .el-table .disabled-row {
    background: #FE4C40;
    color: #fff;
    font-size: 20px;
    .el-button{
      background: #FE4C40;
      color: #fff;
      border: none;
    }
  }
  // 订单详情
  .orderNum-popover{
    .el-dialog{
      margin-top: 0 !important;
      margin-bottom: 0;
    }
    .el-dialog__header{
      padding: 20px;
      .el-dialog__title{
        font-size: 24px;
      }
      .el-dialog__close{
        font-size: 28px;
      }
    }
    .el-dialog__body{
      padding: 0 20px 20px;
      .hoverContent{
        font-size: 20px;
        .tip{
          .el-col{
            margin-bottom: 15px;
            .grid-content{
              color: #FE4C40;
            }
          }
        }
        .el-row{
          width: 100%;
          margin: 0 0 10px 0!important;
          .el-col{
            padding: 0!important;
          }
          .grid-content{
            display: inline-block;
            color: #0485c1;
            &.red{
              color: #FE4C40;
            }
          }
        }
      }
      .contentBox{
        margin-top: 10px;
        overflow: hidden;
        .el-table{
          float: left;
        }
        .uploadImg{
          float: left;
          width: 30%;
          .el-button.is-disabled{
            color: #ffffff;
            background: #909399;
            border: 1px solid #909399;
          }
          .btn{
            text-align: center;
          }
          .no-image{
            margin: 0 auto;
            width: 200px;
            height: 250px;
            line-height: 250px;
            text-align: center;
            border: 1px solid #cccccc;
          }
          .img{
            margin: 0 auto;
            width: 250px;
            height: 500px;
            display: block;
          }
        }
      }
    }
    .noright{
      margin-top: 20px;
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
    bottom: 0;
    left: 50%;
    margin-left: -150px;
    z-index: 99999;
    overflow: auto;
    &::-webkit-scrollbar {
    display: none;
    }
    img{
      width: 100%;
    }
  }
}
</style>
