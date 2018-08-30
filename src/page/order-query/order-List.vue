<template>
  <div class="order-List">
    <div class="count-order">
      <el-row>
        <el-col :span="6"><div>今日销售：{{statisticData.printedOrderCount || 0}} 张</div></el-col>
        <el-col :span="6"><div>金额：{{(statisticData.printedOrderAmount / 100) || 0}} 元</div></el-col>
        <el-col :span="12">
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
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6"><span>当前订单： {{statisticData.unPrintOrderCount || 0}} 张</span></el-col>
        <el-col :span="6"><span>订单总额： {{(statisticData.unPrintOrderAmount / 100) || 0}} 元</span></el-col>
        <el-col :span="12"><span>获取时间： {{statisticData.assginTime ? statisticData.assginTime : '无'}}</span></el-col>
      </el-row>
    </div>

    <el-table
      :height="winHeight"
      style="width: 100%"
      ref="multipleTable8"
      :data="tableData"
      tooltip-effect="dark"
      border
      class="orderlist-table"
      v-loading="loading"
      element-loading-text="拼命加载中..."
      element-loading-spinner="el-icon-loading"
      @row-click="getOutPopover">
      <el-table-column
        prop="sequenceNumber"
        label="序号"
        min-width="40"
        align="center">
      </el-table-column>
      <el-table-column v-for="(item, index) in tableColumn"
        :key="index"
        :prop="item.prop"
        :label="item.label"
        :min-width="item.width"
        align="center">
      </el-table-column>
    </el-table>

    <el-dialog
      :visible.sync="showOutPopover"
      width="80%"
      center
      class="orderNum-popover"
      id="outPopover"
      title="订单详情"
      :close-on-click-modal="false">
      <div class="hoverContent">
        <el-row :gutter="10">
          <el-col :span="12">订单号：<div class="grid-content">{{orderInfo.serialNumber}}</div></el-col>
          <el-col :span="12">系统票号：<div class="grid-content">{{orderInfo.ticketInfoNumber}}</div></el-col>
        </el-row>
        <el-row class="tip" :gutter="20">
          <el-col :span="7">预计奖金：<div class="grid-content red">{{(orderInfo.maxMoney>=100000?`${orderInfo.maxMoney/100000}万`:orderInfo.maxMoney) || 0.00}}元</div></el-col>
          <el-col :span="5">彩种：<div class="grid-content">{{orderInfo.lotterykinds}}</div></el-col>
          <el-col :span="4">过关方式：<div class="grid-content">{{orderInfo.betTypeWord}}</div></el-col>
          <el-col :span="5">金额：<div class="grid-content">{{orderInfo.amount}}元</div></el-col>
          <el-col :span="3">倍数：<div class="grid-content">{{orderInfo.multiple}}倍</div></el-col>
        </el-row>
      </div>
      <div class="contentBox">
        <el-table :data="hoverData" border style="width: 70%">
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
            align="center"
            v-if="orderInfo.assumptionShow">
            <template slot-scope="scopeAssumption">
              <el-popover ref="innerPopover" popper-class="edit-popover fixed-popover" placement="bottom" width="200" v-model="scopeAssumption.row.assumptionFlag">
                <p>系统预设：<span>{{scopeAssumption.row.assumption}}</span></p>
                <p>正确预设：</p>
                <input class="editInputs" type="text" v-model="editAssumption" ref="focusAssumptionInput" placeholder="请输入内容"/>
                <div>
                  <el-button type="primary" size="mini" @click="getEditAssumption(scopeAssumption.row.matchUniqueId)">修改</el-button>
                </div>
                <el-button slot="reference" type="text" size="small" :disabled="!scopeAssumption.row.score || printFlag!==1" @click="showAssumptiondsPopover(scopeAssumption.row.matchUniqueId)">[{{scopeAssumption.row.assumption}}]</el-button>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column label="投注项" width="300" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.subPlayTypeWord}}</span>
              <el-popover ref="innerPopover" popper-class="edit-popover fixed-popover" v-for="(item1, index1) in scope.row.betItemsObj" :key="index1" trigger="click" placement="bottom" width="200" v-model="item1.flag">
                <p>系统赔率：<span>{{item1.odds}}</span></p>
                <p>正确赔率：</p>
                <input class="edictInput" autofocus="autofocus" type="text" v-model="editOdds" ref="focusOddsInput" placeholder="请输入正确赔率"/>
                <div class="edictBtn">
                  <button :ref="scope.row.matchUniqueId" :data-idx="index1" :data-row="JSON.stringify(scope.row)" :data-odd="item1.odds" @click="getEditOdds(scope.row, index1, item1.odds)">修改</button>
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
        <div class="uploadImg">
          <div class="btn">
            <el-button class="small" type="warning" :disabled="!submitFlag" @click="limitSale(orderInfo.ticketInfoNumber)">限售</el-button>
            <el-button
              class="submit-btn"
              type="success"
              :disabled="submitFlag"
              v-loading.fullscreen.lock="confirmDisabled"
              element-loading-background="rgba(0,0,0,0.4)"
              element-loading-text="拼命加载中..."
              @click="submitRealTicket">出票完成</el-button>
          </div>
          <img class="img" :src="imgStr" alt="" @click="enlarge">
        </div>
      </div>
    </el-dialog>

    <el-dialog
      title="是否确认票信息的内容？"
      :visible.sync="confirmFlag"
      width="30%"
      id="innerDialog"
      class="confirm-msg"
      :close-on-click-modal="false"
      top="30vh">
      <p class="tip">确认后将推送到客户，并且不能修改！</p>
      <p class="edit-content">赔率数据异常有：<span>{{validateOdds}}</span></p>
      <span slot="footer" class="dialog-footer">
        <el-button
          size="medium"
          type="primary"
          @click.stop="confirmSumbit"
          :disabled="sumbitDisabled"
          v-loading.fullscreen.lock="sumbitDisabled"
          element-loading-background="rgba(0,0,0,0.4)"
          element-loading-text="拼命加载中...">确 定</el-button>
        <el-button size="mini" @click.stop="cancelSumbit">取 消</el-button>
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
      id="limitSaleDialog"
      class="limit">
      <p>是否确定限售此票？</p>
      <span>系统票号：{{limitSaleData.ticketInfoNumber}}</span>
      <span slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          @click="confirmLimitSale"
          :disabled="limitSaleData.limitDisabled"
          v-loading.fullscreen.lock="limitSaleData.limitDisabled"
          element-loading-background="rgba(0,0,0,0.4)"
          element-loading-text="拼命加载中...">确 定</el-button>
        <el-button @click="cancelLimitSale">取 消</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="空间不足提示"
      :visible.sync="spaceVisible"
      width="30%"
      center>
      <span>当前设备磁盘空间剩余不足1GB，为保证设备正常运作。请备份票数据。为保证数据的安全及正确性，当前设备将锁定出票功能直到磁盘空间满足安全需求。</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="spaceVisible = false">取 消</el-button>
        <el-button type="primary" @click="exportClick">导出</el-button>
      </span>
    </el-dialog>

    <el-dialog :title="fileTitle" :visible.sync="fileVisible" width="585px" class="file">
      <export-file @fileCancel="fileCancel" @getFileName="getFileName"></export-file>
    </el-dialog>

    <el-dialog
      title="提示"
      :visible.sync="printVisible"
      :show-close="false"
      width="30%">
      <span>此订单已打印投注单, 是否继续打印?</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="printCancel">取 消</el-button>
        <el-button type="primary" @click="printQuery">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import ChangeBetContext from '../../utils/changeBetContext.js'
import req from '../../api/order-list/index.js'
import getResultStr from '../../utils/combine.js'
import formatDateTime from '../../utils/format.js'
import exportFile from '../../components/order-query/exportFile'
export default {
  inject: ['reload'],
  components: {
    exportFile
  },
  data () {
    return {
      tableColumn: [
        {prop: 'serialNumber', label: '系统编号', width: '260'},
        {prop: 'lotteryTypeWord', label: '彩种类型', width: '120'},
        {prop: 'multiple', label: '倍数', width: '80'},
        {prop: 'amount', label: '金额', width: '100'},
        {prop: 'lastPrintDate', label: '最迟出票时间', width: '180'},
        {prop: 'printFlagWord', label: '状态', width: '100'}
      ],
      // 订单列表
      tableData: [],
      pageIndex: 1,
      pageSize: 100,
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
      // 倒计时时间2
      reaminingTime: 0,
      // 出票状态
      printFlag: null,
      // 落地票号
      realTicketNumber: '',
      // 是否确认提交
      confirmFlag: false,
      // 是否确认提交禁用
      sumbitDisabled: false,
      showClose: false,
      // 后端返回的异常赔率值
      validateOdds: '',
      confirmDisabled: false,
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
      spaceFlag: false,
      // 屏幕高度
      winHeight: 0,
      // 是否存在未出票
      exitNoOutTicketFlag: false,
      timerId: null,
      // 开启定时器
      openTimerId: false,
      tableDataLen: 0,
      // 已打印的数据
      printList: [],
      // 是否打印弹出框标志
      printVisible: false,
      // 是否打印弹出框当前的数据
      printOneData: {},
      // 限售和出票标志位
      submitFlag: false,
      // 修改赔率弹框标志
      keyOddFalg: false,
      // 修改预设弹框标志
      keyAssumptionFalg: false,
      // 保存读票成功的信息
      keepTicketInfo: {
        serialNumber: '',
        qrInfo: '',
        imgStr: ''
      },
      // 保存当前票据的serialNumber
      ticketInfoSerialNumber: '',
      // 记录修改的是那一场赔率
      oddIndex: -1,
      // 记录修改的场次赔率是哪一个
      oddIndexNum: -1,
      // 记录修改的是那一场预设
      AssumptionIndex: -1
    }
  },
  watch: {
    '$store.state.activeIndex' (val) {
      this.getSpaceSize()
      if (this.spaceFlag) {
        this.$store.commit('setActiveIndex', '')
        localStorage.setItem('setActiveIndex', '')
        let setMenuDisabled = {
          orderList: false,
          accountOrder: true,
          queryOrder: true,
          quitSystem: true
        }
        this.$store.commit('setMenuDisabled', setMenuDisabled)
        localStorage.setItem('setMenuDisabled', JSON.stringify(setMenuDisabled))
        return
      }
      if (val === '/order-query/order-List' && !this.exitNoOutTicketFlag) {
        this.takeOrderToPrint()
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
      if (val === 0) {
        this.printList = []
        this.printVisible = false
        this.$nextTick(() => {
          this.reaminingTime = 0
          this.openTimerId = false
          clearInterval(this.timerId)
          // 关闭票详情页弹出框
          this.showOutPopover = false
          this.confirmFlag = false
          this.sumbitDisabled = false
          this.confirmDisabled = false
          // 关闭限售弹出框
          this.limitSaleData.limitSaleFlag = false
          this.limitSaleData.limitDisabled = false
          // 关闭图片放大的遮罩
          this.Mask = false
          this.enlargeImg = false
          this.submitFlag = false
          this.keyOddFalg = false
          this.keyAssumptionFalg = false
          // 关闭修改预设值和赔率弹出框
          this.hoverData.map(item => {
            this.$set(item, 'assumptionFlag', false)
            item.betItemsObj.map(item1 => {
              this.$set(item1, 'flag', false)
            })
          })
          // 清除保存的图片信息
          localStorage.removeItem('keepTicketInfo')
        })
        this.getData()
        this.exitNoOutTicketFlag = false
        this.$store.commit('setActiveIndex', '')
        localStorage.setItem('setActiveIndex', '')
        let setMenuDisabled = {
          orderList: false,
          accountOrder: false,
          queryOrder: false,
          quitSystem: false
        }
        this.$store.commit('setMenuDisabled', setMenuDisabled)
        localStorage.setItem('setMenuDisabled', JSON.stringify(setMenuDisabled))
      } else if (val > 0) {
        this.openTimerId = true
      }
    },
    openTimerId (val) {
      if (this.reaminingTime > 0) {
        this.timerId = setInterval(() => {
          if (this.reaminingTime) {
            this.reaminingTime--
            this.timeGo()
          }
        }, 1000)
      }
    },
    tableData (val) {
      if (this.tableDataLen !== val.length && val.length === 0 && this.reaminingTime >= 0) {
        this.$nextTick(() => {
          this.reaminingTime = 0
          this.openTimerId = false
          clearInterval(this.timerId)
        })
        console.log('清除')
        // 清除保存的图片信息
        localStorage.removeItem('keepTicketInfo')
      }
    }
  },
  created () {
    this.getSpaceSize()
    document.addEventListener('click', () => {
      this.showOutPopover = false
    })
    this.winHeight = localStorage.getItem('winHeight') - 285
  },
  mounted () {
    if (this.$store.state.activeIndex === '/order-query/order-List') {
      // 已经有路由的切换
      this.takeOrderToPrint()
    } else if (!this.$store.state.activeIndex) {
      // 默认路由跳转到当前页面，初始化
      this.getData()
    }
    // 倒计时定时器
    this.spans = document.getElementsByClassName('timer')[0].children
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
    // console.log('获取页面')
    // 注册键盘事件
    const _this = this
    document.onkeydown = function (e) {
      // console.log('获取', e.keyCode)
      if (e.keyCode === 144) {
        return
      }
      switch (e.keyCode) {
        case 97:
          _this.showOutPopover || (_this.tableData.length > 0 && _this.getOutPopover(_this.tableData[0]))
          break
        case 98:
          _this.showOutPopover || (_this.tableData.length > 1 && _this.getOutPopover(_this.tableData[1]))
          break
        case 99:
          _this.showOutPopover || (_this.tableData.length > 2 && _this.getOutPopover(_this.tableData[2]))
          break
        case 100:
          _this.showOutPopover || (_this.tableData.length > 3 && _this.getOutPopover(_this.tableData[3]))
          break
        case 101:
          _this.showOutPopover || (_this.tableData.length > 4 && _this.getOutPopover(_this.tableData[4]))
          break
        case 102:
          _this.showOutPopover || (_this.tableData.length > 5 && _this.getOutPopover(_this.tableData[5]))
          break
        case 103:
          _this.showOutPopover || (_this.tableData.length > 6 && _this.getOutPopover(_this.tableData[6]))
          break
        case 104:
          _this.showOutPopover || (_this.tableData.length > 7 && _this.getOutPopover(_this.tableData[7]))
          break
        case 105:
          _this.showOutPopover || (_this.tableData.length > 8 && _this.getOutPopover(_this.tableData[8]))
          break
        case 8:
          if (_this.keyOddFalg || _this.keyAssumptionFalg) { // 关闭修改赔率弹框
            _this.editOdds = _this.editOdds.substr(0, _this.editOdds.length)
            // 关闭修改预设值和赔率弹出框
            if (!_this.editOdds.length) {
              _this.hoverData.map(item => {
                _this.$set(item, 'assumptionFlag', false)
                item.betItemsObj.map(item1 => {
                  _this.$set(item1, 'flag', false)
                })
              })
              _this.keyOddFalg = false
              _this.keyAssumptionFalg = false
            }
            return
          }
          if (!_this.confirmFlag && !_this.limitSaleData.limitSaleFlag) { // 关闭限售确认框和提交确认框
            if (_this.showOutPopover) {
              if (_this.printVisible) {
                _this.printVisible = false
              } else {
                _this.showOutPopover = false
              }
            }
          } else {
            _this.confirmFlag = false
            _this.limitSaleData.limitSaleFlag = false
          }
          _this.$store.commit('setkeyboardCode', 8)
          break
        case 0:
          if (_this.keyOddFalg) { // 修改赔率完成enter
            let obj = _this.hoverData[_this.oddIndex]
            let idx = _this.$refs[obj.matchUniqueId][_this.oddIndexNum].dataset.idx
            let odd = _this.$refs[obj.matchUniqueId][_this.oddIndexNum].dataset.odd
            _this.getEditOdds(obj, parseInt(idx), odd)
            return
          }
          if (_this.keyAssumptionFalg) { // 修改预设完成enter
            let id = _this.hoverData[_this.AssumptionIndex].matchUniqueId
            _this.getEditAssumption(id)
            return
          }
          if (_this.confirmFlag) { // 修改赔率出票完成enter
            _this.confirmSumbit()
            return
          }
          if (_this.limitSaleData.limitSaleFlag) { // 修限售完成enter
            _this.confirmLimitSale()
            return
          }
          if (_this.showOutPopover) { // 详情弹框标志
            if (_this.printVisible) { // 是否已打印enter
              _this.printQuery(e)
              _this.printVisible = false
            } else {
              if (_this.submitFlag) { // 限售和出票提交enter
                _this.limitSale(_this.orderInfo.ticketInfoNumber)
              } else {
                _this.submitRealTicket()
              }
            }
          }
          // _this.$store.commit('setkeyboardCode', 0)
          break
        case 111:
          _this.$store.commit('setkeyboardCode', 111)
          break
        case 106:
          _this.$store.commit('setkeyboardCode', 106)
          break
        case 107:
          _this.$store.commit('setkeyboardCode', 107)
          break
        case 109:
          _this.$store.commit('setkeyboardCode', 109)
          break
        default:
          break
      }
    }
  },
  methods: {
    takeOrderToPrint () {
      req('takeOrderToPrint')
        .then(res => {
          if (res.code === '00000') {
            this.getData()
          } else if (res.code === '20039') {
            // 已经存在未出票单据
            this.exitNoOutTicketFlag = true
            this.getData()
          } else {
            this.$message({
              type: 'error',
              message: res.msg
            })
            let setMenuDisabled = {
              orderList: false,
              accountOrder: false,
              queryOrder: false,
              quitSystem: false
            }
            this.$store.commit('setMenuDisabled', setMenuDisabled)
            localStorage.setItem('setMenuDisabled', JSON.stringify(setMenuDisabled))
          }
        })
        .catch(error => {
          console.log(error)
        })
    },
    // 获取订单列表
    getData () {
      let memberParams = {
        page: this.pageIndex,
        pageSize: this.pageSize,
        printFlag: 1
      }
      this.loading = true
      req('getOrderList', memberParams)
        .then(res => {
          if (res.code === '00000') {
            this.loading = false
            this.statisticData = res.data.statistic
            if (res.data.orderList.result.length) {
              this.exitNoOutTicketFlag = true
              let setMenuDisabled = {
                orderList: true,
                accountOrder: true,
                queryOrder: true,
                quitSystem: true
              }
              this.$store.commit('setMenuDisabled', setMenuDisabled)
              localStorage.setItem('setMenuDisabled', JSON.stringify(setMenuDisabled))
              // console.log(res.data.reaminingTime, '存在票，倒计时')
              // 暂定解决前后台倒计时差异为1秒
              if (res.data.reaminingTime > 0) {
                this.reaminingTime = Math.ceil((res.data.reaminingTime + 1000) / 1000)
              }
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
              // 序号
              let sequenceNumberObj = JSON.parse(localStorage.getItem('sequenceNumber'))
              if (sequenceNumberObj === null) {
                sequenceNumberObj = {
                  value: 0,
                  date: new Date(new Date().getTime()).toDateString()
                  // count: 0
                }
              } else {
                if (sequenceNumberObj['date'] !== new Date(new Date().getTime()).toDateString()) {
                  // 每天早上7点清零
                  if (parseInt(formatDateTime(new Date().getTime()).substr(11, 2)) >= 7) {
                    sequenceNumberObj['value'] = 0
                    sequenceNumberObj['date'] = new Date(new Date().getTime()).toDateString()
                  }
                }
              }
              this.tableData.map(val => {
                sequenceNumberObj['value'] = sequenceNumberObj['value'] + 1
                val['sequenceNumber'] = sequenceNumberObj['value']
              })
              localStorage.setItem('sequenceNumber', JSON.stringify({value: sequenceNumberObj['value'], date: sequenceNumberObj['date']}))
            } else {
              // 不存在票
              this.$message({
                type: 'warning',
                message: '当前无票！'
              })
              this.exitNoOutTicketFlag = false
              this.reaminingTime = res.data.reaminingTime ? Math.ceil(res.data.reaminingTime) : 0
              this.$store.commit('setActiveIndex', '')
              localStorage.setItem('setActiveIndex', '')
              this.tableData = res.data.orderList.result
              this.totalCount = res.data.orderList.totalCount
              let setMenuDisabled = {
                orderList: false,
                accountOrder: false,
                queryOrder: false,
                quitSystem: false
              }
              this.$store.commit('setMenuDisabled', setMenuDisabled)
              localStorage.setItem('setMenuDisabled', JSON.stringify(setMenuDisabled))
            }
          } else {
            this.$message({
              type: 'error',
              message: res.msg
            })
            this.$store.commit('setActiveIndex', '')
            localStorage.setItem('setActiveIndex', '')
            let setMenuDisabled = {
              orderList: false,
              accountOrder: false,
              queryOrder: false
            }
            this.$store.commit('setMenuDisabled', setMenuDisabled)
            localStorage.setItem('setMenuDisabled', JSON.stringify(setMenuDisabled))
          }
          this.tableDataLen = this.tableData.length
        })
        .catch(error => {
          console.log(error)
        })
    },
    // 获取订单信息
    getOutPopover (rows, event, column) {
      // 保存读票的订单号
      this.ticketInfoSerialNumber = rows.serialNumber
      let keepTicketInfo = JSON.parse(localStorage.getItem('keepTicketInfo'))
      if (!keepTicketInfo || !keepTicketInfo.serialNumber) {
        keepTicketInfo = {
          serialNumber: rows.serialNumber,
          qrInfo: '',
          imgStr: ''
        }
        localStorage.setItem('keepTicketInfo', JSON.stringify(keepTicketInfo))
      }
      this.orderInfo = {}
      this.hoverData = []
      this.ticketInfoNumber = ''
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
        .catch(error => {
          console.log(error)
        })
    },
    // 获取票面信息
    getPopoverData (rows) {
      this.imgStr = ''
      this.submitFlag = false
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
            //     this.$message({
            //       type: 'error',
            //       message: '数据出现异常，请联系开发人员！'
            //     })
            //     // this.$alert('数据出现异常，请联系开发人员！', '错误提示', {
            //     //   confirmButtonText: '确定',
            //     //   type: 'error',
            //     //   showClose: false,
            //     //   callback: action => {
            //     //     console.log('后台数据出现异常，请检查！')
            //     //   }
            //     // })
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
            } catch (error) {
              console.log(error, '过关方式与赛事场次对不上')
            }
            this.showOutPopover = true
            this.confirmDisabled = false
            // 获取信息
            let orderInfo = res.data.orderInfo
            orderInfo.maxMoney = maxMoney
            orderInfo.lotteryTypeWord = ChangeBetContext.lotteryType(orderInfo.lotteryType)
            orderInfo.subPlayTypeWord = ChangeBetContext.subPlayType(orderInfo.subPlayType)
            orderInfo.amount = (orderInfo.amount / 100).toFixed(2)
            if (orderInfo.betType === 'single') {
              orderInfo.betTypeWord = '单关'
            } else if (Object.prototype.toString.call(orderInfo.betType) === '[object String]') {
              orderInfo.betTypeWord = orderInfo.betType
            } else {
              orderInfo.betTypeWord = JSON.parse(orderInfo.betType)
            }
            this.orderInfo = orderInfo
            this.orderInfo.lotterykinds = `${orderInfo.lotteryTypeWord}${orderInfo.subPlayTypeWord}`
            if (this.orderInfo.subPlayType === '61' || this.orderInfo.subPlayType === '64' || this.orderInfo.subPlayType === '69') {
              this.orderInfo.assumptionShow = true
            } else {
              this.orderInfo.assumptionShow = false
            }
            if (rows.printFlag === 1) { // 未出票状态（printFlag=1）才能读票
              let obj = JSON.parse(JSON.stringify(this.orderInfo))
              obj['betContext'] = JSON.parse(obj['betContext'])
              let resultObj = getResultStr(obj)
              this.latechFlag = true
              try {
                if (this.printList.includes(rows.serialNumber)) {
                  this.printVisible = true
                  this.printOneData = {resultObj: resultObj, serialNumber: rows.serialNumber}
                } else {
                  this.printList.push(rows.serialNumber)
                  this.printTicket(resultObj, rows.serialNumber)
                }
                this.readTicket(rows.serialNumber)
              } catch (error) {
                console.log('打印机读票机', error)
              }
              // 如果此票已经读票成功，就显示图片
              let keepTicketInfo = JSON.parse(localStorage.getItem('keepTicketInfo'))
              if (keepTicketInfo.serialNumber === rows.serialNumber && keepTicketInfo.qrInfo) {
                this.imgStr = keepTicketInfo.imgStr
                this.realTicketNumber = keepTicketInfo.qrInfo
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
        .catch(error => {
          console.log(error)
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
        // 给修改的赔率自动补零
        this.editOdds = ChangeBetContext.returnFloat(this.editOdds)
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
        // 计算奖金
        let hoverData = JSON.parse(JSON.stringify(this.hoverData))
        let orderInfo = JSON.parse(JSON.stringify(this.orderInfo))
        if (orderInfo.betType === 'single') {
          let betContextOdds = []
          hoverData.map(item => {
            let obj = {}
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
            betContextOdds.push(obj)
          })
          let maxMoney = ChangeBetContext.returnFloat((ChangeBetContext.getSingleMaxMoney(betContextOdds, orderInfo.multiple)))
          maxMoney = maxMoney >= 100000 ? 100000 : maxMoney
          this.$set(this.orderInfo, 'maxMoney', maxMoney)
        } else {
          let calcData = {
            betContextList: hoverData,
            orderInfo: orderInfo
          }
          let editOddsFlag = true
          let dataInfo = ChangeBetContext.getPassMaxMoney(calcData, editOddsFlag)
          // let maxMoney = ChangeBetContext.returnFloat(ChangeBetContext.evenRound(ChangeBetContext.evenRound(dataInfo.price, 2) * calcData.orderInfo.multiple, 2))
          let maxMoney = ChangeBetContext.returnFloat(ChangeBetContext.returnEvenRound(ChangeBetContext.returnEvenRound(dataInfo.price) * calcData.orderInfo.multiple))
          // 过关场次
          let tablelen = calcData.betContextList.length
          if (tablelen === 2 || tablelen === 3) {
            maxMoney = maxMoney >= 200000 ? 200000 : maxMoney
          } else if (tablelen === 4 || tablelen === 5) {
            maxMoney = maxMoney >= 500000 ? 500000 : maxMoney
          } else if (tablelen >= 6 && tablelen <= 8) {
            maxMoney = maxMoney >= 1000000 ? 1000000 : maxMoney
          }
          this.$set(this.orderInfo, 'maxMoney', maxMoney)
        }
      } else {
        rows.betItemsObj.map(val => {
          val.flag = false
        })
      }
      this.keyOddFalg = false
      this.keyAssumptionFalg = false
      this.oddIndex = -1
    },
    showOddsPopover (rows, odds, editIndex) {
      this.editOdds = ''
      let len = 0
      this.hoverData.map((item, index) => {
        len += item.betItemsObj.length
        item.betItemsObj.map((item1, index1) => {
          this.$set(item1, 'flag', false)
          if (item.matchUniqueId === rows.matchUniqueId && (index1 === editIndex) && (item1.odds === odds)) {
            this.$set(item1, 'flag', true)
            this.keyOddFalg = true
            this.oddIndex = index
            this.oddIndexNum = index1
          }
        })
      })
      for (let i = 0; i < len; i++) {
        this.$nextTick(() => {
          this.$refs.focusOddsInput[i].focus()
        })
      }
    },
    showAssumptiondsPopover (matchUniqueId) {
      this.editAssumption = ''
      let len = this.hoverData.length
      this.hoverData.map((item, index) => {
        this.$set(item, 'assumptionFlag', false)
        if (item.matchUniqueId === matchUniqueId) {
          this.$set(item, 'assumptionFlag', true)
          this.keyAssumptionFalg = true
          this.AssumptionIndex = index
        }
      })
      for (let i = 0; i < len; i++) {
        this.$nextTick(() => {
          this.$refs.focusAssumptionInput[i].focus()
        })
      }
    },
    // 打印机
    printTicket (obj, orderNum) {
      // let printStatus = latech.printStatusFromJS() // eslint-disable-line
      // console.log(1, printStatus)
      if (obj.status === '1') {
        latech.printBMPFromJS(obj.resultStr, orderNum) // eslint-disable-line
      } else {
        // latech.printInit() // eslint-disable-line
        latech.printStringFormJS(obj.resultStr, orderNum) // eslint-disable-line
        // latech.printFeedLineFromJS(10) // eslint-disable-line
        // latech.printCutPaperFromJS() // eslint-disable-line
      }
    },
    readTicket (ORnumber) {
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
              let ORreg = /^OR\d{25}$/
              let QRreg = /^\d{20}\s\d{8}$/
              if (ORreg.test(_this.realTicketNumber)) {
                if (ORnumber === _this.realTicketNumber) {
                  _this.submitFlag = true
                } else {
                  _this.$message({
                    type: 'error',
                    message: '请投入与订单号一致的投资单'
                  })
                }
              } else if (QRreg.test(_this.realTicketNumber)) { // 读票成功
                _this.submitFlag = false
                let keepTicketInfo = JSON.parse(localStorage.getItem('keepTicketInfo'))
                if (_this.ticketInfoSerialNumber === keepTicketInfo.serialNumber) {
                  keepTicketInfo.qrInfo = _this.realTicketNumber
                  keepTicketInfo.imgStr = _this.imgStr
                  localStorage.setItem('keepTicketInfo', JSON.stringify(keepTicketInfo))
                }
              } else {
                _this.$message({
                  type: 'error',
                  message: '请正常读票！'
                })
              }
              console.log('QR码:' + _this.realTicketNumber)
            }
          }, 200)
        } else {
          this.getTicketError()
        }
      } else {
        this.getTicketError()
      }
    },
    // 获取读票机错误信息
    getTicketError () {
      this.showOutPopover = false
      let errCode = latech.ScannerGetLastErrorCodeFromJS() // eslint-disable-line
      this.reload()
      this.$confirm(`读票机异常，代码:${errCode}`, '错误', {
        confirmButtonText: '确定',
        showCancelButton: false,
        type: 'error',
        closeOnClickModal: false,
        callback: action => {
          sessionStorage.removeItem('token')
          this.$store.commit('token', '')
          this.$router.push({path: '/login'})
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
      let reg = /^\d{20}\s\d{8}$/
      if (!reg.test(this.realTicketNumber)) {
        this.$message({
          type: 'error',
          message: '请投入正确票单！'
        })
        this.realTicketNumber = ''
        return
      }
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
              // objMix['totalScore'] = item.score
              obj['totalScore'] = item.score
            }
            if (item.subPlayType === '61') {
              // objMix['score'] = item.score
              obj['score'] = item.score
            }
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
              message: res.msg
            })
          }
          this.confirmDisabled = false
        })
        .catch(error => {
          console.log(error)
        })
    },
    cancelSumbit () {
      this.confirmFlag = false
      this.showOutPopover = true
    },
    // 提交数据，出票完成
    confirmSumbit () {
      this.sumbitDisabled = true
      try {
        latech.saveImageFromJS(this.ticketInfoNumber, this.imgStr.substr(21, this.imgStr.length-1)) // eslint-disable-line
        this.imgStr = latech.getBinaryzationBMP(this.imgStr.substr(21, this.imgStr.length-1)) // eslint-disable-line
      } catch (error) {
        console.log('保存图片错误', error)
      }
      let params = {
        ticketInfoNumber: this.ticketInfoNumber,
        qrInfo: this.realTicketNumber,
        betContextOdds: JSON.stringify(this.betContextOdds),
        printResult: this.imgStr
      }
      req('editTicket', params)
        .then(res => {
          if (res.code === '00000') {
            this.confirmFlag = false
            this.showOutPopover = false
            this.sumbitDisabled = false
            this.tableData.map((item, index) => {
              if (item.serialNumber === this.orderInfo.serialNumber) {
                this.$delete(this.tableData, index)
              }
            })
            // 出票成功，将保存的票信息删除
            localStorage.removeItem('keepTicketInfo')
            this.$message({
              type: 'success',
              message: '出票成功'
            })
            this.getData()
          } else if (res.code === '20041') {
            this.confirmFlag = false
            this.showOutPopover = true
            this.sumbitDisabled = false
            this.$message({
              type: 'error',
              message: '此票已读票成功，请更换票据读票！'
            })
          } else {
            this.confirmFlag = true
            this.showOutPopover = true
            this.sumbitDisabled = false
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
            this.tableData.map((item, index) => {
              if (item.serialNumber === this.orderInfo.serialNumber) {
                this.$delete(this.tableData, index)
                this.getData()
              }
            })
            this.limitSaleData.limitSaleFlag = false
            this.limitSaleData.limitDisabled = false
            this.showOutPopover = false
            this.$message({
              type: 'success',
              message: '限售成功'
            })
          } else {
            this.$message({
              type: 'error',
              message: res.msg
            })
            this.limitSaleData.limitSaleFlag = true
            this.limitSaleData.limitDisabled = false
            this.showOutPopover = true
          }
        })
        .catch(error => {
          console.log(error)
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
        console.log('读磁盘错误', error)
      }
    },
    fileCancel () {
      this.fileVisible = false
    },
    getFileName (val) {
      this.fileTitle = val
    },
    // 是否打印弹出框取消
    printCancel (e) {
      this.printVisible = false
      e.stopPropagation()
      // this.showOutPopover = true
    },
    // 是否打印弹出框确认
    printQuery (e) {
      this.printVisible = false
      e.stopPropagation()
      try {
        this.printTicket(this.printOneData.resultObj, this.printOneData.serialNumber)
      } catch (error) {
        console.log(error)
      }
    }
  },
  destroyed () {
    clearInterval(this.timerId)
    try {
      clearInterval(this.timer)
      this.latechFlag && latech.ScannerStopFromJS() // eslint-disable-line
    } catch (error) {
      console.log('读票机关闭错误', error)
    }
  }
}
</script>
<style lang="less">
.order-List{
  .count-order{
    box-sizing: border-box;
    width: calc(100% - 60px);
    height: 80px;
    padding:10px 20px;
    font-size: 20px;
    background: #ffffff;
    position: fixed;
    top: 110px;
    left: 30px;
    z-index: 998;
    border-bottom: 1px solid #4dafdb;
    overflow: hidden;
    .el-row{
      line-height: 30px;
      .timer{
        span{
          color: #FE4C40;
        }
      }
    }
  }
  .orderlist-table{
    font-size: 20px!important;
    .el-table__header-wrapper{
      th{
        padding: 10px 0;
      }
    }
    .el-table__row{
      td{
        padding: 15px 0;
        .cell{
          padding: 0;
          .el-button{
            padding: 15px 10px;
          }
        }
      }
    }
    // .el-table__row:hover{
    //   background: #000;
    // }
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
      text-align: left!important;
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
            &.fontr{
              text-align: right;
            }
          }
          .grid-content{
            display: inline-block;
            color: #0485c1;
            letter-spacing: 1px;
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
            margin: 10px auto;
            width: 250px;
            height: 500px;
            display: block;
          }
        }
      }
    }
    .el-dialog{
      margin-top: 0 !important;
      margin-bottom: 0;
    }
  }
  .confirm-msg,.limit{
    .el-dialog{
      width: 450px!important;
      .el-dialog__body{
        padding: 0 20px;
        font-size: 20px!important;
        .tip{
          text-align: center;
          color: #EB5528;
        }
        .edit-content{
          margin: 0;
          span{
            color: #0485c1;
            line-height: 30px;
          }
        }
      }
      .el-button{
        font-size: 20px;
        padding: 13px 30px;
      }
      .el-dialog__close{
        font-size: 30px;
      }
      .el-dialog__title{
        font-size: 23px;
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
  .el-button+.el-button {
    margin-left: 50px!important;
  }
  .file{
    .el-dialog__body{
      padding: 0px;
      padding-bottom: 20px !important;
    }
  }
  .el-dialog{
    font-size: 20px;
    text-align: center;
    .el-dialog__header{
      .el-dialog__title{
        font-size: 26px;
        color: #606266;
      }
    }
    .el-dialog__body{
      font-size: 20px;
      text-align: center;
    }
    .el-dialog__footer{
      text-align: center;
    }
  }
}
// 修改赔率小弹框
.el-popover {
  font-size: 20px;
  .el-input__inner{
    font-size: 20px;
  }
  .edictInput{
    line-height: 35px;
    font-size: 20px;
    width: 100%;
    padding: 0 10px;
    box-sizing: border-box;
  }
  .edictBtn{
    text-align: right;
    margin-top: 10px;
    button{
      font-size: 20px;
      white-space: nowrap;
      cursor: pointer;
      color: #fff;
      background-color: #409eff;
      border: 1px solid #409eff;
      -webkit-appearance: none;
      text-align: center;
      outline: none;
      padding: 5px 15px;
      border-radius: 4px;
    }
  }
}
.el-table{
  font-size: 20px;
}
.small{
  font-size: 16px!important;
  padding: 10px 20px!important;
}
// .fixed-popover{
//   top: 100px !important;
// }
</style>
