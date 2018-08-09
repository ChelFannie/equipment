<template>
  <div class="order-information">
    <div class="top">订单基本信息 <el-button class="return" size="medium" type="primary" @click="goBack">返回</el-button></div>
    <div class="detail">
      <div>
          <p>订单号：<span class="substance">{{detailData.serialNumber}}</span></p>
          <p>彩种：<span class="substance">{{detailData.subPlayType}}</span></p>
          <p>类型：<span class="substance">{{detailData.lotteryType}}</span></p>
          <p>金额：<span class="substance">{{detailData.amount}}元</span></p>
          <p>归属地：<span class="substance">{{detailData.address}}</span></p>
          <p>订单时间：<span class="substance">{{detailData.createDate}}</span></p>
          <p>渠道：<span class="substance">{{detailData.regFrom}}</span></p>
          <p>支付状态：<span class="substance">{{detailData.payFlag}}</span></p>
          <p>订单状态：<span class="substance">{{detailData.printFlag}}</span></p>
          <p>失效时间：<span class="substance">2018-07-30 12:09:15</span></p>
          <!-- <p>支付渠道：<span class="substance">WechatPay</span></p> -->
      </div>
    </div>
    <el-table
      :data="tableData"
      border
      class="noright"
      style="width: 1000px;">
      <el-table-column prop="ticketInfoNumber" label="系统票号" width="300" align="center">
        <template slot-scope="outScope">
          <el-button @click="getPopoverData(outScope.row)" :disabled="outPopoverDisabled">{{ outScope.row.ticketInfoNumber }}</el-button>
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
    <el-dialog
      title="确认"
      :visible.sync="confirmFlag"
      width="30%"
      center
      :show-close="showClose">
      <p>是否确认票信息的内容？</p>
      <p>确认后将推送到客户，并且不能修改！</p>
      <p class="edit-content">赔率数据异常有：<span>{{validateOdds}}</span></p>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click.stop="confirmSumbit"
        v-loading.fullscreen.lock="fullscreenLoading"
        element-loading-text="数据提交中...">确 定</el-button>
        <el-button size="small" @click.stop="cancelSumbit">取 消</el-button>
      </span>
    </el-dialog>
    <el-popover v-model="showOutPopover" id="outPopover" ref="outPopover" placement="right" popper-class="orderNum-popover">
      <div class="hoverInput">
        <span>落地票号:</span>
        <el-input v-model="realTicketNumber" placeholder="请输入内容"></el-input>
        <el-button type="primary" size="small" @click="submitRealTicket" :disabled="confirmDisabled">确认票</el-button>
      </div>
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
      <el-table :data="hoverData" border class="noright">
        <!-- <el-table-column v-for="(item, index) in hoverColumn"
          :key="index"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
          align="center">
        </el-table-column> -->
        <el-table-column
          prop="orderNum"
          label="编号"
          width="120"
          align="center">
        </el-table-column>
        <el-table-column
          prop="host"
          label="主队"
          width="140"
          align="center">
        </el-table-column>
        <el-table-column
          prop="guest"
          label="客队"
          width="140"
          align="center">
        </el-table-column>
        <el-table-column
          prop="assumption"
          label="预设"
          width="69"
          align="center">
          <template slot-scope="scopeAssumption">
            <el-popover ref="innerPopover" popper-class="edit-popover" placement="bottom" width="200" v-model="scopeAssumption.row.assumptionFlag">
              <p>系统预设：<span>{{scopeAssumption.row.assumption}}</span></p>
              <p>正确预设：</p>
              <el-input v-model="editAssumption" placeholder="请输入内容"></el-input>
              <div style="text-align: right; margin-top: 10px;">
                <el-button type="primary" size="mini" @click="getEditAssumption(scopeAssumption.row.matchUniqueId)">修改</el-button>
              </div>
              <el-button slot="reference" type="text" size="small" :disabled="!scopeAssumption.row.score" @click="showAssumptiondsPopover(scopeAssumption.row.matchUniqueId)">[{{scopeAssumption.row.assumption}}]</el-button>
              <!-- <el-button slot="reference" type="text" size="small" @click="showAssumptiondsPopover(scopeAssumption.row.matchUniqueId)">[{{scopeAssumption.row.assumption}}]</el-button> -->
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="投注项" width="230" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.lotteryTypeWord}}{{scope.row.subPlayTypeWord}}</span>
            <!-- <i-popover :data="scope.row"></i-popover> -->
            <el-popover ref="innerPopover" popper-class="edit-popover" v-for="(item1, index1) in scope.row.betItemsObj" :key="index1" trigger="click" placement="bottom" width="200" v-model="item1.flag">
              <p>系统赔率：<span>{{item1.odds}}</span></p>
              <p>正确赔率：</p>
              <el-input v-model="editOdds" placeholder="请输入内容"></el-input>
              <div style="text-align: right; margin-top: 10px;">
                <el-button type="primary" size="mini" @click="getEditOdds(scope.row, index1, item1.odds)">修改</el-button>
              </div>
              <el-button slot="reference" type="text" size="small" @click="showOddsPopover(scope.row, item1.odds)">[{{item1.key}}{{item1.odds}}]</el-button>
            </el-popover>
          </template>
        </el-table-column>
      </el-table>
      <div class="uploadImg">
        <input type="file" name="file" accept="image/jpg,image/png,image/jpeg" @change="onFileChange" id="imgFile" class="userinfo_upload"><br>
        <img class="img" :src="imgsrc" alt="">
      </div>
    </el-popover>
  </div>
</template>
<script>
// import IPopover from '../../components/common/i-popover'
import req from '../../api/order-list/index.js'
import ChangeBetContext from '../../utils/changeBetContext.js'
var addressData = require('../../utils/addressData.json')
export default {
  components: {
    // IPopover
  },
  data () {
    return {
      serialNumber: '',
      detailData: {},
      tableColumn: [
        {label: '设备', prop: 'memberId', width: '150'},
        {label: '店铺', prop: 'storeName', width: '140'},
        {label: '金额', prop: 'amount', width: '100'},
        {label: '下发时间', prop: 'assignTime', width: '100'},
        {label: '出票时间', prop: 'uploadTime', width: '100'},
        {label: '出票状态', prop: 'printFlag', width: '108'}
      ],
      tableData: [],
      orderInfo: {},
      hoverColumn: [
        {label: '编号', prop: 'matchUniqueId', width: '150'},
        {label: '主队', prop: 'host', width: '140'},
        {label: '客队', prop: 'guest', width: '140'},
        {label: '预设', prop: 'assumption', width: '69'}
      ],
      hoverData: [],
      ticketInfoNumber: '',
      realTicketNumber: '',
      confirmFlag: false,
      showClose: false,
      editOdds: '',
      editAssumption: '',
      imgsrc: '',
      betContextOdds: '',
      showOutPopover: false,
      editRows: {},
      fullscreenLoading: false,
      validateOdds: '',
      confirmDisabled: false,
      outPopoverDisabled: false
    }
  },
  created () {
    if (this.$route.params.serialNumber) {
      this.serialNumber = this.$route.params.serialNumber
      sessionStorage.setItem('serialNumber', this.serialNumber)
    } else {
      this.serialNumber = sessionStorage.getItem('serialNumber')
    }
    this.getData()
    document.addEventListener('click', () => {
      this.showOutPopover = false
    })
  },
  mounted () {
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
  },
  methods: {
    getData () {
      req('queryTicketList', {serialNumber: this.serialNumber})
        .then(res => {
          if (res.code === '00000') {
            let orderInfoVo = res.data.orderInfoVo
            orderInfoVo.lotteryType = ChangeBetContext.lotteryType(orderInfoVo.lotteryType)
            orderInfoVo.regFrom === 1 ? orderInfoVo.regFrom = '中石化' : orderInfoVo.regFrom = '自营'
            orderInfoVo.payFlag = ChangeBetContext.payFlag(orderInfoVo.payFlag)
            orderInfoVo.printFlag = ChangeBetContext.printFlag(orderInfoVo.printFlag)
            orderInfoVo.subPlayType = ChangeBetContext.subPlayType(orderInfoVo.subPlayType)
            orderInfoVo.amount = (orderInfoVo.amount / 100).toFixed(2)
            let city = ''
            let province = ''
            addressData.data.map(element => {
              element.childList.length && element.childList.map(ele => {
                if (orderInfoVo.adCode === ele.regionCode) {
                  city = ele.regionName
                  province = element.regionName.indexOf('(') > -1 ? element.regionName.split('(')[0] : element.regionName
                }
              })
            })
            this.detailData = orderInfoVo
            this.detailData.address = `${province}${city}`
            // 表格数据
            if (!res.data.ticketInfoVoPage.result.length) {
              return
            }
            let ticketInfoVoPage = res.data.ticketInfoVoPage.result
            ticketInfoVoPage.map(val => {
              val.printFlag = ChangeBetContext.printFlag(val.printFlag)
              val.amount = (val.amount / 100).toFixed(2)
              val.flag = false
              this.tableData.push(val)
            })
          } else if (res.code === '10009') {
            this.$router.push('/login')
          } else {
            this.$message({
              type: 'error',
              message: res.msg
            })
          }
        })
    },
    onFileChange (e) {
      let files = e.target.files || e.dataTransfer.files
      if (!files.length) {
        return
      }
      this.createImage(files[0])
    },
    createImage (file) {
      let reader = new FileReader()
      let vm = this
      reader.onload = (e) => {
        vm.imgsrc = e.target.result
      }
      reader.readAsDataURL(file)
    },
    goBack () {
      this.$router.push({name: '订单列表'})
    },
    getPopoverData (row) {
      this.editRows = row
      this.outPopoverDisabled = true
      this.ticketInfoNumber = row.ticketInfoNumber
      req('getTicketInfo', {ticketInfoNumber: this.ticketInfoNumber})
        .then(res => {
          if (res.code === '00000') {
            let orderInfo = res.data.orderInfo
            orderInfo.lotteryTypeWord = ChangeBetContext.lotteryType(orderInfo.lotteryType)
            orderInfo.subPlayTypeWord = ChangeBetContext.subPlayType(orderInfo.subPlayType)
            orderInfo.amount = (orderInfo.amount / 100).toFixed(2)
            this.orderInfo = orderInfo
            this.orderInfo.lotterykinds = `${orderInfo.lotteryTypeWord}${orderInfo.subPlayTypeWord}`
            this.imgsrc = this.orderInfo.printResult
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
            this.realTicketNumber = ''
            // this.imgsrc = ''
            this.showOutPopover = true
            this.outPopoverDisabled = false
          } else if (res.code === '10009') {
            this.$router.push('/login')
          } else {
            this.$message({
              type: 'error',
              message: res.msg
            })
          }
        })
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
    showAssumptiondsPopover (matchUniqueId) {
      this.editAssumption = ''
      this.hoverData.map(item => {
        this.$set(item, 'assumptionFlag', false)
        if (item.matchUniqueId === matchUniqueId) {
          this.$set(item, 'assumptionFlag', true)
        }
      })
    },
    submitRealTicket () {
      if (!this.realTicketNumber) {
        this.$message({
          type: 'error',
          message: '请输入落地票号'
        })
        return
      } else if (!this.imgsrc) {
        this.$message({
          type: 'error',
          message: '请上传图片'
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
            // this.orderInfo.subPlayType === '64' ? obj['totalScore'] = item.score : obj['score'] = item.score
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
          if (res.code === '20038') {
            res.data.map(item => {
              Object.keys(item).map(key => {
                this.validateOdds += ChangeBetContext.changeMatchUniqueId(key) + '，'
              })
            })
            this.validateOdds = this.validateOdds.substring(0, this.validateOdds.length - 1)
            this.confirmFlag = true
            this.confirmDisabled = false
          } else if (res.code === '10009') {
            this.$router.push('/login')
          } else {
            this.$message({
              type: 'error',
              message: res.msg
            })
          }
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
        printResult: this.imgsrc
      }
      // console.log(params)
      req('editTicket', params)
        .then(res => {
          if (res.code === '00000') {
            this.fullscreenLoading = false
            this.$message({
              type: 'success',
              message: '修改成功'
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
        })
    }
  }
}
</script>
<style lang="less">
.order-information{
  width: 1000px;
  .top{
    font-size: 24px;
    line-height: 30px;
    margin: 30px 0 20px;
    overflow: hidden;
    &::before{
      content: '';
      display: inline-block;
      width: 2px;
      height: 30px;
      background: red;
      margin-right: 10px;
      vertical-align: middle;
    }
    .return{
      float: right;
    }
  }
  .el-tag--medium {
    cursor: pointer;
  }
  .el-dialog__header{
    padding-bottom: 0;
    font-weight: 700;
  }
  .el-dialog--center .el-dialog__body {
    text-align: center;
    padding: 0 20px;
    font-weight: 700;
    .edit-content{
      text-align: left;
      font-weight: normal;
    }
  }
  .detail{
    font-size: 18px;
    line-height: 30px;
    p{
      display: inline-block;
      margin: 10px 40px 0 0;
    }
    .substance{
      color: #4daedb;
    }
  }
}
  .orderNum-popover{
    width: 700px !important;
    top: 315px !important;
    left: 575px!important;
    // height: 1000px;
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
      .img{
        margin-top: 10px;
        width: 500px;
      }
    }
  }
</style>
