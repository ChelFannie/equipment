<template>
  <div class="query-order">
    <div class="search-condition">
      <el-form ref="form" label-width="100px" size="mini">
        <el-form-item label="订单号">
          <el-input v-model="form.serialNumber" maxlength="30"></el-input>
        </el-form-item>
        <el-form-item label="落地票号">
          <el-input v-model="form.qrInfo" maxlength="30"></el-input>
        </el-form-item>
        <el-form-item label="彩种">
          <el-select v-model="form.subPlayType" placeholder="请选择">
            <el-option
              v-for="item in subPlayTypeSelect"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="出票状态">
          <el-select v-model="form.printFlag" placeholder="请选择">
            <el-option
              v-for="item in printFlagSelect"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="中奖状态">
          <el-select v-model="form.awardFlag" placeholder="请选择">
            <el-option
              v-for="item in awardFlagSelect"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="结算状态">
          <el-select v-model="form.settleStatus" placeholder="请选择">
            <el-option
              v-for="item in settleFlagSelect"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="创建时间">
          <el-date-picker
            v-model="form.beginCreateDate"
            type="datetime"
            placeholder="选择开始时间"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            default-time="00:00:00"
            @change="getTime">
          </el-date-picker>
          <span> 至 </span>
          <el-date-picker
            v-model="form.endCreateDate"
            type="datetime"
            placeholder="选择结束时间"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            default-time="23:59:59">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <el-button @click="queryOrder" type="primary">查询</el-button>
      <el-button @click="empty" type="primary">清空</el-button>
    </div>
    <!-- <div class="detail">
      <span>今日销售：{{statisticData.printedOrderCount || 0}} 张</span>
      <span>金额：{{(statisticData.printedOrderAmount / 100) || 0}} 元</span>
      <span>提交时间：{{submitSettleTime}}</span>
    </div> -->

    <div class="count-order">
      <span class="count-all">审核统计：&nbsp;</span>
      <span>张数：{{accountData.pages || 0}}张</span>
      <span>销售总额： {{(accountData.amounts).toFixed(2) || 0}}元</span>
      <span>奖金： {{(accountData.awardAmounts).toFixed(2) || 0}}元</span>
      <span>结算金额： {{(accountData.operateMoney).toFixed(2) || 0}}元</span>
    </div>

    <el-table
      height="350"
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      border
      style="width: 100%"
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

    <el-pagination
      v-if="tableData.length"
      class="page"
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pageIndex"
      :page-size="pageSize"
      :page-sizes="[10, 50, 100, 200, 300, 500]"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalCount">
    </el-pagination>

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
        <p class="hoverItem">创建时间: <span class="substance">{{orderInfo.createDate}}</span></p>
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
        {prop: 'typeWords', label: '彩种类型', 'min-width': '100'},
        {prop: 'multiple', label: '倍数', 'min-width': '50'},
        {prop: 'amountWord', label: '金额', 'min-width': '100'},
        {prop: 'awardAmountWord', label: '奖金', 'min-width': '100'},
        {prop: 'awardFlagWord', label: '中奖', 'min-width': '100'},
        {prop: 'printFlagWord', label: '出票', 'min-width': '100'},
        {prop: 'settleStatusWord', label: '结算', 'min-width': '100'}
      ],
      tableData: [],
      pageIndex: 1,
      pageSize: 10,
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
      scanTicket: '',
      timer: null,
      imgStr: '',
      Mask: false,
      enlargeImg: false,
      loading: false,
      form: {
        serialNumber: '',
        qrInfo: '',
        subPlayType: '',
        printFlag: '',
        awardFlag: '',
        settleStatus: '',
        beginCreateDate: '',
        endCreateDate: ''
      },
      // 彩种
      subPlayTypeSelect: [
        {value: '51', label: '足球胜平负'},
        {value: '52', label: '足球比分'},
        {value: '53', label: '足球总进球'},
        {value: '54', label: '足球半全场'},
        {value: '56', label: '足球让球胜平负'},
        {value: '59', label: '足球混合过关'},
        {value: '61', label: '篮球让分胜负'},
        {value: '62', label: '篮球胜负'},
        {value: '63', label: '篮球胜分差'},
        {value: '64', label: '篮球大小分'},
        {value: '69', label: '篮球混合过关'}
      ],
      // 出票状态
      printFlagSelect: [
        // {value: 1, label: '未出票'},
        {value: 2, label: '已出票'},
        {value: 3, label: '出票失败'}
      ],
      // 中奖状态
      awardFlagSelect: [
        {value: 1, label: '已中奖'},
        {value: 2, label: '未中奖'}
      ],
      // 结算状态
      settleFlagSelect: [
        {value: 0, label: '未可结算'},
        {value: 1, label: '可结算'},
        {value: 2, label: '待审核'},
        {value: 3, label: '审核通过'}
      ],
      searchFlag: false
    }
  },
  watch: {
    scanTicket (val) {
      console.log(val, '落地票号')
      this.$nextTick(() => {
        this.$set(this.form, 'qrInfo', val)
        this.queryOrder()
      })
    }
  },
  created () {
    if (!this.$store.state.setActiveIndex) {
      this.$store.commit('setActiveIndex', localStorage.getItem('setActiveIndex'))
    }
    let setMenuDisabled = {
      orderList: false,
      accountOrder: false,
      queryOrder: false,
      uitSystem: false
    }
    this.$store.commit('setMenuDisabled', setMenuDisabled)
    localStorage.setItem('setMenuDisabled', JSON.stringify(setMenuDisabled))
    this.getData()
    document.addEventListener('click', () => {
      this.showOutPopover = false
    })
  },
  mounted () {
    try {
      this.scan()
    } catch (error) {
      console.log('条码枪')
    }
    document.getElementById('outPopover').addEventListener('click', (event) => {
      event.stopPropagation()
    })
  },
  methods: {
    getTime () {
      console.log(this.form.beginCreateDate)
      // console.log(this.form.beginCreateDate.split(' '))
      // 转为二进制
    },
    // 获取列表
    getData () {
      this.searchFlag || Object.keys(this.form).map(key => {
        this.form[key] = ''
      })
      let nullFlag = false
      Object.keys(this.form).map(key => {
        this.form[key] !== '' && (nullFlag = true)
      })
      nullFlag || (this.searchFlag = false)
      let memberParams = {
        ...this.form,
        page: this.pageIndex,
        pageSize: this.pageSize,
        printFlags: '1,2,3'
      }
      this.loading = true
      req('getOrderList', memberParams)
        .then(res => {
          if (res.code === '00000') {
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
              val.printFlagWord = ChangeBetContext.printFlag(val.printFlag)
              val.amount = val.amount / 100
              val.awardAmount = val.awardAmount / 100
              val.awardFlagWord = val.awardFlag === 1 ? '已中奖' : '未中奖'
              val.amountWord = (val.amount).toFixed(2)
              val.awardAmountWord = (val.awardAmount).toFixed(2)
              val.flag = false
              amounts += val.amount
              awardAmounts += val.awardAmount
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
    },
    // 查询列表
    queryOrder () {
      this.pageIndex = 1
      this.searchFlag = true
      this.getData()
    },
    empty () {
      Object.keys(this.form).map(key => {
        this.form[key] = ''
      })
      this.searchFlag = false
      this.pageIndex = 1
      this.getData()
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
    },
    // 更改查询条数
    handleSizeChange (val) {
      this.pageSize = val
      this.getData()
    },
    // 分页查询
    handleCurrentChange (val) {
      this.pageIndex = val
      this.getData()
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
.query-order{
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
  .search-condition{
    .el-form-item{
      float: left;
      margin-left: 10px;
      .el-input{
        width: 180px!important;
      }
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
    // border-bottom: 1px solid #4dafdb;
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
    background: #D3D3D3;
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
