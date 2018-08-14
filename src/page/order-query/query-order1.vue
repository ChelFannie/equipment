<template>
  <div class="query-order">
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
      height="350"
      style="width: 100%"
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      border
      class="orderlist-table"
      v-loading="loading"
      element-loading-text="拼命加载中..."
      element-loading-spinner="el-icon-loading">
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
                @click="showOddsPopover(scope.row, item1.odds, index1)"
                :disabled="printFlag!==1">[{{item1.key}}&nbsp;({{item1.odds}})]</el-button>
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

    <el-dialog
      title="提示"
      :visible.sync="limitSaleData.limitSaleFlag"
      width="30%"
      center
      id="limitSaleDialog">
      <p>是否确定限售此票？</p>
      <span>系统票号：{{limitSaleData.ticketInfoNumber}}</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="confirmLimitSale" :disabled="limitSaleData.limitDisabled">确 定</el-button>
        <el-button @click="cancelLimitSale">取 消</el-button>
      </span>
    </el-dialog>

    <!-- <el-dialog
      title="空间不足提示"
      :visible.sync="spaceVisible"
      width="30%"
      center>
      <span>当前设备磁盘空间剩余不足1GB，为保证设备正常运作。请备份票数据。为保证数据的安全及正确性，当前设备将锁定出票功能直到磁盘空间满足安全需求。</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="spaceVisible = false">取 消</el-button>
        <el-button type="primary" @click="exportClick">导出</el-button>
      </span>
    </el-dialog> -->

    <!-- <el-dialog :title="fileTitle" :visible.sync="fileVisible" width="585px" class="file">
      <export-file @fileCancel="fileCancel" @getFileName="getFileName"></export-file>
    </el-dialog> -->
  </div>
</template>
<script>
import ChangeBetContext from '../../utils/changeBetContext.js'
import req from '../../api/order-list/index.js'
import getResultStr from '../../utils/combine.js'
// import exportFile from '../../components/order-query/exportFile'
export default {
  // components: {
  //   exportFile
  // },
  data () {
    return {
      tableColumn: [
        {prop: 'lotteryTypeWord', label: '彩种类型', 'min-width': '100'},
        {prop: 'multiple', label: '倍数', 'min-width': '50'},
        {prop: 'amount', label: '金额', 'min-width': '100'},
        {prop: 'lastPrintDate', label: '最迟出票时间', 'min-width': '150'},
        {prop: 'printFlagWord', label: '状态', 'min-width': '70'}
      ],
      // 订单列表
      tableData: [],
      pageIndex: 1,
      pageSize: 10,
      // 列表总条数
      totalCount: 0,
      // 系统票号：
      ticketInfoNumber: '',
      // 票面信息
      orderInfo: {},
      // 票面的投注信息
      hoverData: [],
      // 控制弹出票面信息弹出框的显示与隐藏
      showOutPopover: false,
      // 修改的预设值（预设值指让分值，暂时只有竞彩篮球让分胜负，胜分差才有）
      editAssumption: '',
      // 修改的赔率
      editOdds: '',
      // 销售与订单信息
      statisticData: {},
      timer: null,
      // 票面详情的图片
      imgStr: '',
      Mask: false,
      enlargeImg: false,
      spans: [],
      // 倒计时时间
      reaminingTime: 0,
      // 出票状态
      printFlag: null,
      // 落地票号
      realTicketNumber: '',
      confirmFlag: false,
      showClose: false,
      // 后端返回的异常赔率值
      validateOdds: '',
      confirmDisabled: false,
      fullscreenLoading: false,
      // 限售信息
      limitSaleData: {
        limitSaleFlag: false,
        ticketInfoNumber: '',
        limitDisabled: false
      },
      // 是否有使用读票机标志
      latechFlag: false,
      // 空间不足弹框
      spaceVisible: false,
      loading: false,
      // 文件夹选择弹框
      fileVisible: false,
      // 文件夹弹框标题
      fileTitle: '文件: /',
      // 空间不足标志
      spaceFlag: false
    }
  },
  watch: {
    '$store.state.activeIndex' (val) {
      this.getSpaceSize()
      // if (this.spaceFlag) {
      //   this.$store.commit('setActiveIndex', '')
      //   localStorage.setItem('setActiveIndex', '')
      //   let setMenuDisabled = {
      //     orderList: false,
      //     accountOrder: true,
      //     queryOrder: false
      //   }
      //   this.$store.commit('setMenuDisabled', setMenuDisabled)
      //   localStorage.setItem('setMenuDisabled', JSON.stringify(setMenuDisabled))
      //   return
      // }
      if (this.$store.state.activeIndex && (val === '/order-query/query-order')) {
        this.getData()
        // this.takeOrderToPrint()
        // this.timerId = setInterval(() => {
        //   if (this.reaminingTime) {
        //     this.reaminingTime--
        //     this.timeGo()
        //   } else {
        //     clearInterval(this.timerId)
        //   }
        // }, 1000)
      }
    },
    showOutPopover (val) {
      if (!val) {
        try {
          this.timer !== null && clearInterval(this.timer)
          this.latechFlag && latech.ScannerStopFromJS() // eslint-disable-line
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
    this.getSpaceSize()
    document.addEventListener('click', () => {
      this.showOutPopover = false
    })
  },
  mounted () {
    // 倒计时定时器
    this.spans = document.getElementsByClassName('timer')[0].children
    if (this.$store.state.activeIndex) {
      // this.getData()
      this.takeOrderToPrint()
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
    document.getElementById('limitSaleDialog').addEventListener('click', (event) => {
      event.stopPropagation()
    })
  },
  methods: {
    takeOrderToPrint () {
      req('takeOrderToPrint')
        .then(res => {
          if (res.code === '00000') {
            this.getData()
          } else {
            this.$message({
              type: 'error',
              message: res.msg
            })
          }
        })
    },
    // 获取订单列表
    getData () {
      let memberParams = {
        page: this.pageIndex,
        pageSize: this.pageSize
      }
      this.loading = true
      req('getOrderList', memberParams)
        .then(res => {
          if (res.code === '00000') {
            this.loading = false
            this.reaminingTime = res.data.reaminingTime ? parseInt(res.data.reaminingTime / 1000) : 0
            // this.reaminingTime = 2 * 28 * 54
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
            let setMenuDisabled = {
              orderList: true,
              accountOrder: false,
              queryOrder: true
            }
            this.$store.commit('setMenuDisabled', setMenuDisabled)
            localStorage.setItem('setMenuDisabled', JSON.stringify(setMenuDisabled))
          } else {
            this.$message({
              type: 'error',
              message: res.msg
            })
            this.$store.commit('setActiveIndex', '')
            localStorage.setItem('setActiveIndex', '')
            let setMenuDisabled = {
              orderList: false,
              accountOrder: true,
              queryOrder: true
            }
            this.$store.commit('setMenuDisabled', setMenuDisabled)
            localStorage.setItem('setMenuDisabled', JSON.stringify(setMenuDisabled))
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
    // 获取订单信息
    getOutPopover (rows) {
      // 出票状态
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
              this.tableData.map(item => {
                if (item.serialNumber === rows.serialNumber) {
                  this.$set(item, 'flag', false)
                }
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
          this.tableData.map(item => {
            if (item.serialNumber === rows.serialNumber) {
              this.$set(item, 'flag', false)
            }
          })
        })
    },
    // 获取票面信息
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
            if (rows.printFlag === 1) { // 未出票状态（printFlag=1）才能读票
              let obj = JSON.parse(JSON.stringify(this.orderInfo))
              obj['betContext'] = JSON.parse(obj['betContext'])
              let resultObj = getResultStr(obj)
              this.latechFlag = true
              try {
                this.printTicket(resultObj)
                this.readTicket()
              } catch (error) {
                console.log('打印机')
              }
            } else {
              this.latechFlag = false
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
            this.confirmDisabled = false
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
    // 修改预设值
    getEditAssumption (matchUniqueId) {
      // 没有修改内容，就关闭弹框，如果修改了，则替换原数据
      if (this.editAssumption) {
        // 如果获取用户输入的预设值数据没有'+',需要添加
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
    // 修改赔率
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
    showOddsPopover (rows, odds, editIndex) {
      this.editOdds = ''
      this.hoverData.map(item => {
        item.betItemsObj.map((item1, index1) => {
          this.$set(item1, 'flag', false)
          if (item.matchUniqueId === rows.matchUniqueId && (index1 === editIndex) && (item1.odds === odds)) {
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
        // latech.printInit() // eslint-disable-line
        latech.printStringFormJS(obj.resultStr) // eslint-disable-line
        // latech.printFeedLineFromJS(10) // eslint-disable-line
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
    // 订单剩余时间
    timeGo () {
      let hours = parseInt(this.reaminingTime / 60 / 60)
      let minutes = parseInt(this.reaminingTime / 60 - hours * 60)
      let seconds = parseInt(this.reaminingTime - hours * 60 * 60 - minutes * 60)
      let hours1 = parseInt(hours / 10)
      let hours2 = hours % 10
      let minutes1 = parseInt(minutes / 10)
      let minutes2 = minutes % 10
      let seconds1 = parseInt(seconds / 10)
      let seconds2 = seconds % 10
      this.spans[0].innerHTML = hours1
      this.spans[1].innerHTML = hours2
      this.spans[3].innerHTML = minutes1
      this.spans[4].innerHTML = minutes2
      this.spans[6].innerHTML = seconds1
      this.spans[7].innerHTML = seconds2
    },
    // 检验是否有赔率异常
    submitRealTicket () {
      // 必须读票后，获取到图片和落地票号才能提交
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
          if (item.score) {
            if (item.subPlayType === '64') {
              objMix['totalScore'] = item.score
            }
            if (item.subPlayType === '61') {
              objMix['score'] = item.score
            }
            // item.subPlayType === '64' ? objMix['totalScore'] = item.score : objMix['score'] = item.score
          }
          obj[item.matchUniqueId] = objMix
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
      this.validateOdds = ''
      req('validateTicketOdds', params)
        .then(res => {
          if (res.code === '20038') { // 赔率有异常
            res.data.map(item => {
              Object.keys(item).map(key => {
                this.validateOdds += ChangeBetContext.changeMatchUniqueId(key) + '，'
              })
            })
            this.validateOdds = this.validateOdds.substring(0, this.validateOdds.length - 1)
            this.confirmFlag = true
          } else if (res.code === '00000') {
            // 返回'00000'，说明是没有赔率异常
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
    // 提交数据，出票完成
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
            this.$message({
              type: 'success',
              message: '读票成功'
            })
            try {
              latech.saveImageFromJS(this.ticketInfoNumber, this.imgStr.substr(21, this.imgStr.length-1)) // eslint-disable-line
            } catch (error) {
              console.log('保存图片')
            }
            this.confirmFlag = false
            this.showOutPopover = false
            this.getData()
          } else {
            this.$message({
              type: 'error',
              message: res.msg
            })
            this.showOutPopover = true
          }
          this.fullscreenLoading = false
        })
    },
    // 取消限售
    cancelLimitSale () {
      this.limitSaleData.limitSaleFlag = false
    },
    // 限售
    confirmLimitSale () {
      this.limitSaleData.limitDisabled = true
      req('limitSale', {'ticketInfoNumber': this.limitSaleData.ticketInfoNumber})
        .then(res => {
          if (res.code === '00000') {
            this.limitSaleData.limitSaleFlag = false
            this.limitSaleData.limitDisabled = false
            this.showOutPopover = false
            this.$message({
              type: 'success',
              message: '限售成功'
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
    limitSale (ticketInfoNumber) {
      this.limitSaleData = {
        'limitSaleFlag': true,
        'ticketInfoNumber': ticketInfoNumber
      }
    },
    // 导出事件
    exportClick () {
      this.spaceVisible = false
      this.fileVisible = true
    },
    // 得到磁盘空间
    getSpaceSize () {
      try {
        let numStr = latech.getAvailableMemorySizeFromJS() // eslint-disable-line
        if (numStr < 1024) {
          this.spaceFlag = true
          this.spaceVisible = true
        } else {
          this.spaceFlag = false
          this.spaceVisible = false
        }
      } catch (error) {
        console.log('读磁盘')
      }
    },
    fileCancel () {
      this.fileVisible = false
    },
    getFileName (val) {
      this.fileTitle = val
    }
  },
  destroyed () {
    try {
      clearInterval(this.timer)
      this.latechFlag && latech.ScannerStopFromJS() // eslint-disable-line
    } catch (error) {
      console.log('打印机')
    }
  },
  beforeDestroy () {
    // clearInterval(this.timerId)
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
    padding: 10px 20px 0;
    position: fixed;
    top: 100px;
    left: 30px;
    z-index: 998;
    background: #ffffff;
    overflow: hidden;
    div{
      display: inline-block;
      width: 300px;
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
    height: 35px;
    font-size: 16px;
    background: #ffffff;
    position: fixed;
    top: 150px;
    left: 30px;
    z-index: 998;
    border-bottom: 1px solid #4dafdb;
    overflow: hidden;
    span{
      display: inline-block;
      width: 300px;
    }
  }
  .orderlist-table{
    font-size: 14px!important;
    // margin-top: 90px;
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
      color: #FE4C40!important;
    }
  }
  .el-button+.el-button {
    margin-left: 50px!important;
  }
  .file{
    .el-dialog__body{
      padding: 0px;
      padding-bottom: 20px !important;
    }
  }
}
</style>
