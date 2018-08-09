<template>
  <div class="order-List">
    <div class="detail">
      <div>今日销售：{{statisticData.printedOrderCount || 0}} 张</div>
      <div>金额：{{(statisticData.printedOrderAmount / 100) || 0}} 元</div>
      <div class="timer">订单剩余时间：
        <span class="remaining-time">0</span>
        <span class="remaining-time">0</span>
        <span class="remaining-time">:</span>
        <span class="remaining-time">0</span>
        <span class="remaining-time">0</span>
        <span class="remaining-time">:</span>
        <span class="remaining-time">0</span>
        <span class="remaining-time">0</span>
      </div>
    </div>
    <div class="count-order">
      <span>当前订单： {{statisticData.unPrintOrderCount || 0}} 张</span>
      <span>订单总额： {{(statisticData.unPrintOrderAmount / 100) || 0}} 元</span>
      <span>获取时间： {{statisticData.assginTime ? statisticData.assginTime : '无'}}</span>
    </div>
    <el-table
      height="450"
      style="width: 100%"
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      border
      class="orderlist-table">
      <el-table-column
        prop="serialNumber"
        label="系统编号"
        width="250"
        align="center">
        <template slot-scope="outScope">
          <el-button @click="getOutPopover(outScope.row)" :disabled="outScope.row.flag">{{ outScope.row.serialNumber }}</el-button>
        </template>
      </el-table-column>
      <el-table-column v-for="(item, index) in tableColumn"
        :key="index"
        :prop="item.prop"
        :label="item.label"
        :width="item.width"
        align="center">
      </el-table-column>
    </el-table>
    <el-pagination
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
      </div>
      <el-table :data="hoverData" border class="noright" style="width: 100%">
        <el-table-column
          prop="orderNum"
          label="编号"
          align="center">
        </el-table-column>
        <el-table-column
          prop="host"
          label="主队"
          align="center">
        </el-table-column>
        <el-table-column
          prop="guest"
          label="客队"
          align="center">
        </el-table-column>
        <el-table-column
          prop="assumption"
          label="预设"
          align="center">
          <template slot-scope="scopeAssumption">
            <el-popover ref="innerPopover" popper-class="edit-popover" placement="bottom" width="200" v-model="scopeAssumption.row.assumptionFlag">
              <p>系统预设：<span>{{scopeAssumption.row.assumption}}</span></p>
              <p>正确预设：</p>
              <el-input v-model="editAssumption" placeholder="请输入内容"></el-input>
              <div style="text-align: right; margin-top: 10px;">
                <el-button type="primary" size="mini" @click="getEditAssumption(scopeAssumption.row.matchUniqueId)">修改</el-button>
              </div>
              <el-button slot="reference" type="text" size="small" :disabled="!scopeAssumption.row.score || printFlag!==1" @click="showAssumptiondsPopover(scopeAssumption.row.matchUniqueId)">[{{scopeAssumption.row.assumption}}]</el-button>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="投注项" width="214" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.lotteryTypeWord}}{{scope.row.subPlayTypeWord}}</span>
            <el-popover ref="innerPopover" popper-class="edit-popover" v-for="(item1, index1) in scope.row.betItemsObj" :key="index1" trigger="click" placement="bottom" width="200" v-model="item1.flag">
              <p>系统赔率：<span>{{item1.odds}}</span></p>
              <p>正确赔率：</p>
              <el-input v-model="editOdds" placeholder="请输入内容"></el-input>
              <div style="text-align: right; margin-top: 10px;">
                <el-button type="primary" size="mini" @click="getEditOdds(scope.row, index1, item1.odds)">修改</el-button>
              </div>
              <el-button
                slot="reference"
                type="text"
                size="small"
                @click="showOddsPopover(scope.row, item1.odds)"
                :disabled="printFlag!==1">[{{item1.key}}{{item1.odds}}]</el-button>
            </el-popover>
          </template>
        </el-table-column>
      </el-table>
      <div class="btn-box">
        <div v-if="printFlag===1">
          <el-button class="submit-btn" type="primary" size="medium" @click="submitRealTicket" :disabled="confirmDisabled">出票完成</el-button>
          <el-button type="danger" size="medium" @click="limitSale(orderInfo.ticketInfoNumber)">限售</el-button>
        </div>
      </div>
      <div class="uploadImg">
        <img class="img" :src="imgStr" alt="" @click="enlarge">
      </div>
    </el-dialog>
    <el-dialog
      title="是否确认票信息的内容？"
      :visible.sync="confirmFlag"
      width="30%"
      center
      id="innerDialog"
      class="confirm-msg">
      <!-- <p>是否确认票信息的内容？</p> -->
      <p class="tip">确认后将推送到客户，并且不能修改！</p>
      <p class="edit-content">赔率数据异常有：<span>{{validateOdds}}</span></p>
      <span slot="footer" class="dialog-footer">
        <el-button size="medium" type="primary" @click.stop="confirmSumbit"
        v-loading.fullscreen.lock="fullscreenLoading"
        element-loading-text="数据提交中...">确 定</el-button>
        <el-button size="medium" @click.stop="cancelSumbit">取 消</el-button>
      </span>
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
import getResultStr from '../../utils/combine.js'
export default {
  data () {
    return {
      tableColumn: [
        {prop: 'lotteryTypeWord', label: '彩种类型', 'min-width': '100'},
        {prop: 'multiple', label: '倍数', 'min-width': '50'},
        {prop: 'amount', label: '金额', 'min-width': '100'},
        {prop: 'lastPrintDate', label: '最迟出票时间', 'min-width': '150'},
        {prop: 'printFlagWord', label: '状态', 'min-width': '70'}
      ],
      tableData: [],
      pageIndex: 1,
      pageSize: 10,
      totalCount: 0,
      ticketInfoNumber: '',
      orderInfo: {},
      hoverData: [],
      showOutPopover: false,
      editAssumption: '',
      editOdds: '',
      statisticData: {},
      timer: null,
      imgStr: '',
      Mask: false,
      enlargeImg: false,
      spans: [],
      reaminingTime: 0,
      printFlag: null,
      // 落地票号
      realTicketNumber: '',
      confirmFlag: false,
      showClose: false,
      validateOdds: '',
      confirmDisabled: false,
      fullscreenLoading: false
    }
  },
  watch: {
    '$store.state.activeIndex' (val) {
      if (val === '/order-query/order-List') {
        this.getData()
        this.timerId = setInterval(() => {
          if (this.reaminingTime) {
            this.reaminingTime--
            this.timeGo()
          } else {
            clearInterval(this.timerId)
          }
        }, 1000)
      }
    },
    showOutPopover (val) {
      if (!val) {
        try {
          this.timer !== null && clearInterval(this.timer)
          latech.ScannerStopFromJS() // eslint-disable-line
        } catch (error) {
          console.log('打印机')
        }
      }
    },
    reaminingTime (val) {
      // console.log(val)
      if (val === 0) {
        clearInterval(this.timerId)
      }
    }
  },
  created () {
    document.addEventListener('click', () => {
      this.showOutPopover = false
    })
  },
  mounted () {
    if (this.$store.state.activeIndex) {
      this.getData()
      this.timerId = setInterval(() => {
        if (this.reaminingTime) {
          this.reaminingTime--
          this.timeGo()
        } else {
          clearInterval(this.timerId)
        }
      }, 1000)
    }
    document.getElementById('outPopover').addEventListener('click', (event) => {
      let assumptionFlag = false
      this.hoverData.map(item => {
        if (item.assumptionFlag) {
          assumptionFlag = true
        }
        let flag = false
        item.betItemsObj.map(item1 => {
          if (item1.flag) {
            flag = true
          }
        })
        if (flag) {
          item.betItemsObj.map(item1 => {
            item1.flag = false
          })
        }
      })
      if (assumptionFlag) {
        this.hoverData.map(item => {
          item.assumptionFlag = false
        })
      }
      event.stopPropagation()
    })
    document.getElementById('innerDialog').addEventListener('click', (event) => {
      event.stopPropagation()
    })
    this.spans = document.querySelector('.timer').children
  },
  methods: {
    getData () {
      let memberParams = {
        page: this.pageIndex,
        pageSize: this.pageSize
      }
      req('getOrderList', memberParams)
        .then(res => {
          if (res.code === '00000') {
            this.$store.commit('setMenuDisabled', true)
            localStorage.setItem('setMenuDisabled', true)
            this.reaminingTime = res.data.reaminingTime ? parseInt(res.data.reaminingTime / 1000) : 0
            // this.reaminingTime = 30
            this.statisticData = res.data.statistic
            res.data.orderList.result.map(val => {
              val.lotteryType = ChangeBetContext.lotteryType(val.lotteryType)
              val.printFlagWord = ChangeBetContext.printFlag(val.printFlag)
              val.subPlayType = ChangeBetContext.subPlayType(val.subPlayType)
              val.amount = (val.amount / 100).toFixed(2)
              val.awardAmount = (val.awardAmount / 100).toFixed(2)
              val.flag = false
              val.lotteryTypeWord = `${val.lotteryType}${val.subPlayType}`
            })
            this.tableData = res.data.orderList.result
            this.totalCount = res.data.orderList.totalCount
          } else {
            this.$message({
              type: 'error',
              message: res.msg
            })
          }
        })
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.getData()
    },
    handleCurrentChange (val) {
      this.pageIndex = val
      this.getData()
    },
    getOutPopover (rows) {
      this.printFlag = rows.printFlag
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
            this.tableData.map(item => {
              if (item.serialNumber === rows.serialNumber) {
                this.$set(item, 'flag', false)
              }
            })
          }
        })
    },
    getPopoverData (rows) {
      this.imgStr = ''
      req('getTicketInfo', {ticketInfoNumber: this.ticketInfoNumber})
        .then(res => {
          if (res.code === '00000') {
            let orderInfo = res.data.orderInfo
            orderInfo.lotteryTypeWord = ChangeBetContext.lotteryType(orderInfo.lotteryType)
            orderInfo.subPlayTypeWord = ChangeBetContext.subPlayType(orderInfo.subPlayType)
            orderInfo.amount = (orderInfo.amount / 100).toFixed(2)
            this.orderInfo = orderInfo
            this.orderInfo.lotterykinds = `${orderInfo.lotteryTypeWord}${orderInfo.subPlayTypeWord}`
            if (rows.printFlag === 1) { // 未出票状态才能读票
              let obj = JSON.parse(JSON.stringify(this.orderInfo))
              obj['betContext'] = JSON.parse(obj['betContext'])
              let resultObj = getResultStr(obj)
              try {
                this.printTicket(resultObj)
                this.readTicket()
              } catch (error) {
                console.log('打印机')
              }
            } else {
              this.orderInfo.printResult && (this.imgStr = this.orderInfo.printResult)
            }
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
            this.tableData.map(item => {
              if (item.serialNumber === rows.serialNumber) {
                this.$set(item, 'flag', false)
              }
            })
          }
        })
    },
    getEditAssumption (matchUniqueId) {
      if (this.editAssumption) {
        if (this.editAssumption > 0) {
          this.editAssumption = this.editAssumption.indexOf('+') > -1 ? this.editAssumption : `+${this.editAssumption}`
        }
        this.hoverData.map(item => {
          if (item.matchUniqueId === matchUniqueId) {
            this.$set(item, 'assumption', this.editAssumption)
            this.$set(item, 'score', this.editAssumption)
            this.$set(item, 'assumptionFlag', false)
          }
        })
      } else {
        this.hoverData.map(item => {
          this.$set(item, 'assumptionFlag', false)
        })
      }
    },
    getEditOdds (rows, betItemsObjIndex, editOdds) {
      if (this.editOdds) {
        rows.betItemsObj.map((val, index) => {
          if (betItemsObjIndex === index) {
            Object.keys(val).map((val1, index1) => {
              if (val[val1] === editOdds) {
                val[val1] = this.editOdds
                val.flag = false
              } else if (val1 === rows.matchUniqueId) {
                for (let key in val[val1]) {
                  val[val1][key] = this.editOdds
                }
              }
            })
          }
        })
      } else {
        rows.betItemsObj.map(val => {
          val.flag = false
        })
      }
    },
    showOddsPopover (rows, odds) {
      this.editOdds = ''
      this.hoverData.map(item => {
        item.betItemsObj.map(item1 => {
          this.$set(item1, 'flag', false)
          if (item.matchUniqueId === rows.matchUniqueId && (item1.odds === odds)) {
            this.$set(item1, 'flag', true)
          }
        })
      })
    },
    showAssumptiondsPopover (matchUniqueId) {
      this.editAssumption = ''
      this.hoverData.map(item => {
        this.$set(item, 'assumptionFlag', false)
        if (item.matchUniqueId === matchUniqueId) {
          this.$set(item, 'assumptionFlag', true)
        }
      })
    },
    printTicket (obj) {
      // latech.printInit() // eslint-disable-line
      if (obj.status === '1') {
        latech.printBMPFromJS(obj.resultStr) // eslint-disable-line
      } else {
        console.log(123)
        latech.printStringFormJS(obj.resultStr) // eslint-disable-line
        // latech.printFeedLineFromJS(1) // eslint-disable-line
        // latech.printCutPaperFromJS() // eslint-disable-line
      }
    },
    readTicket () {
      // 读票机初始化
      if (latech.ScannerInit() === 0) { // eslint-disable-line
        // 读票机开始
        if (latech.ScannerStart() === true) { // eslint-disable-line
          const _this = this
          _this.timer = setInterval(function () {
            let flag = latech.ScanIsComplete() // eslint-disable-line
            // console.log(flag)
            if (flag === true) { // 判断读票机是否读完票
              // clearInterval(_this.timer)
              // 获取图片大小
              let size = latech.ScannerGetOriginImageSize() // eslint-disable-line
              //  获取图片
              _this.imgStr = latech.ScannerGetOriginImage(size) // eslint-disable-line
              _this.realTicketNumber = latech.ScannerGetTicketInfoFromJS() // eslint-disable-line
              //  退票
              latech.ScannerRollBackFromJS() // eslint-disable-line
              _this.imgStr = 'data:image/bmp;base64,' + _this.imgStr
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
    },
    timeGo () {
      let minutes = parseInt(this.reaminingTime / 60)
      let seconds = parseInt(this.reaminingTime - minutes * 60)
      let minutes1 = parseInt(minutes / 10)
      let minutes2 = minutes % 10
      let seconds1 = parseInt(seconds / 10)
      let seconds2 = seconds % 10
      this.spans[3].innerHTML = minutes1
      this.spans[4].innerHTML = minutes2
      this.spans[6].innerHTML = seconds1
      this.spans[7].innerHTML = seconds2
    },
    limitSale (ticketInfoNumber) {
      req('limitSale', {'ticketInfoNumber': ticketInfoNumber})
        .then(res => {
          console.log(res)
        })
    },
    submitRealTicket () {
      // if (this.printFlag !== 1) {
      //   let msg = this.printFlag === 2 ? '已出票' : '出票失败'
      //   this.$message({
      //     type: 'error',
      //     message: `改票状态为${msg}，禁止读票！`
      //   })
      //   return
      // }
      console.log(1, this.realTicketNumber)
      if (!this.realTicketNumber || !this.imgStr) {
        this.$message({
          type: 'error',
          message: '请正常读票！'
        })
        return
      }
      this.confirmDisabled = true
      this.betContextOdds = []
      this.hoverData.map(item => {
        let obj = {}
        if (this.orderInfo.subPlayType === '59' || this.orderInfo.subPlayType === '69') {
          let arr = []
          let objMix = {}
          item.betItemsObj.map(item1 => {
            arr.push(item1[item.matchUniqueId])
          })
          objMix[item.subPlayType] = arr
          obj[item.matchUniqueId] = objMix
          if (item.score) {
            item.subPlayType === '64' ? obj['totalScore'] = item.score : obj['score'] = item.score
          }
        } else {
          let arr = []
          item.betItemsObj.map(item1 => {
            arr.push(item1[item.matchUniqueId])
          })
          obj[item.matchUniqueId] = arr
          if (item.score) {
            if (this.orderInfo.subPlayType === '64') {
              obj['totalScore'] = item.score
            }
            if (this.orderInfo.subPlayType === '61') {
              obj['score'] = item.score
            }
          }
        }
        this.betContextOdds.push(obj)
      })
      let params = {
        subPlayType: this.orderInfo.subPlayType,
        betContextOdds: JSON.stringify(this.betContextOdds)
      }
      console.log(params)
      this.validateOdds = ''
      req('validateTicketOdds', params)
        .then(res => {
          if (res.code === '20038') {
            res.data.map(item => {
              Object.keys(item).map(key => {
                this.validateOdds += ChangeBetContext.changeMatchUniqueId(key) + '，'
              })
            })
            this.validateOdds = this.validateOdds.substring(0, this.validateOdds.length - 1)
            this.confirmFlag = true
            // this.confirmDisabled = false
          } else if (res.code === '00000') {
            this.confirmSumbit()
          } else {
            this.$message({
              type: 'error',
              message: res.msg || '提交失败！'
            })
          }
          this.confirmDisabled = false
        })
    },
    cancelSumbit () {
      this.confirmFlag = false
    },
    confirmSumbit () {
      this.confirmFlag = false
      this.fullscreenLoading = true
      this.showOutPopover = false
      let params = {
        ticketInfoNumber: this.ticketInfoNumber,
        realTicketNumber: this.realTicketNumber,
        betContextOdds: JSON.stringify(this.betContextOdds),
        printResult: this.imgStr
      }
      req('editTicket', params)
        .then(res => {
          if (res.code === '00000') {
            // this.fullscreenLoading = false
            this.$message({
              type: 'success',
              message: '成功'
            })
            this.confirmFlag = false
            this.showOutPopover = false
          } else {
            this.$message({
              type: 'error',
              message: res.msg
            })
            this.showOutPopover = true
          }
          this.fullscreenLoading = false
        })
    }
  },
  destroyed () {
    try {
      clearInterval(this.timer)
      latech.ScannerStopFromJS() // eslint-disable-line  
    } catch (error) {
      console.log('打印机')
    }
  },
  beforeDestroy () {
    clearInterval(this.timerId)
  }
}
</script>
<style lang="less">
.order-List{
  .detail{
    box-sizing: border-box;
    width: calc(100% - 60px);
    line-height: 40px;
    color: #1f2f3d;
    font-size: 20px;
    padding: 20px 20px 0;
    position: fixed;
    top: 90px;
    left: 30px;
    z-index: 998;
    background: #ffffff;
    div{
      display: inline-block;
      margin-right: 50px;
    }
    .timer{
      span{
        color: #FE4C40!important;
        font-size: 22px!important;
      }
    }
  }
  .count-order{
    box-sizing: border-box;
    width: calc(100% - 60px);
    padding:0 20px 10px;
    height: 30px;
    font-size: 16px;
    background: #ffffff;
    position: fixed;
    top: 150px;
    left: 30px;
    z-index: 998;
    border-bottom: 1px solid #4dafdb;
    span{
      margin-right: 50px;
    }
  }
  .orderlist-table{
    font-size: 14px!important;
    margin-top: 90px;
    .el-table__header-wrapper{
      th{
        padding: 5px 0;
      }
    }
    .el-table__row{
      td{
        padding: 7px 0;
        .cell{
          padding: 0;
          .el-button{
            padding: 15px 10px;
          }
        }
      }
    }
  }
  .page{
    margin-top: 15px;
    margin-left: 100px;
    text-align:center;
    margin:20px 0;
  }
  .el-button--primary{
    margin: 8px 0;
  }
  .el-table .cell{
    cursor: pointer;
  }
  .orderNum-popover{
    .el-dialog__header{
      padding: 0;
    }
    .noright{
      margin-top: 20px;
      font-size: 14px!important;
      .el-table__header-wrapper{
        th{
          padding: 5px 0;
        }
      }
      .el-table__row{
        td{
          padding: 0;
          .cell{
            padding: 0;
            .el-button{
              // font-size: 12px;
              padding: 15px 10px;
            }
          }
        }
      }
    }
    .hoverContent{
      display: flex;
      flex-wrap: wrap;
      font-size: 14px;
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
    .el-dialog{
      margin-top: 0 !important;
      margin-bottom: 0;
    }
    .btn-box{
      margin-top: 10px;
      text-align: center;
    }
  }
  .confirm-msg{
    .el-dialog{
      width: 450px!important;
      .el-dialog__body{
        padding: 0 20px;
        font-size: 16PX;
        .tip{
          text-align: center;
          color: #EB5528;
        }
        .edit-content{
          margin: 0;
          span{
            color: #4daedb;
            line-height: 30px;
          }
        }
      }
    }
    .el-button+.el-button {
      margin-left: 50px;
    }
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
  .orderNum-popover{
    .el-button.is-disabled{
      color: #D9D6CF!important;
    }
  }
}
</style>
