<template>
  <div class="account-order">
    <div class="detail">
      <span>今日销售：{{statisticData.printedOrderCount || 0}} 张</span>
      <span>金额：{{(statisticData.printedOrderAmount / 100) || 0}} 元</span>
      <div class="btn">
        <el-button type="primary" size="medium" @click="submitToSettle">结算</el-button>
        <el-button type="success" size="medium" @click="managerLogin">登陆</el-button>
      </div>
    </div>
    <div class="count-order">
      <p class="count-all">结算统计：&nbsp;</p>
      <span>张数：{{accountData.pages || 0}}张</span>
      <span>销售总额： {{(accountData.amounts).toFixed(2) || 0}}元</span>
      <span>奖金： {{(accountData.awardAmounts).toFixed(2) || 0}}元</span>
      <span>结算金额： {{(accountData.operateMoney).toFixed(2) || 0}}元</span>
    </div>
    <el-table
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      border
      style="width: 100%"
      @selection-change="handleSelectionChange"
      :row-class-name="tableRowClassName">
      <el-table-column
        type="selection"
        :selectable="selectable">
      </el-table-column>
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
      class="page"
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pageIndex"
      :page-size="pageSize"
      :page-sizes="[10, 50, 100, 150, 200, 300, 500]"
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
            <span v-for="(item1, index1) in scope.row.betItemsObj" :key="index1">[{{item1.key}}({{item1.odds}})]</span>
          </template>
        </el-table-column>
      </el-table>
      <div class="uploadImg">
        <img class="img" :src="orderInfo.printResult" alt="">
      </div>
    </el-dialog>
    <el-dialog
      title="登陆"
      :visible.sync="managerDialogVisible"
      width="500px"
      center
      class="login">
      <el-form :model="managerForm" label-width="80px" :rules="rules" ref="ruleForm">
        <el-form-item label="用户名" prop="userAccount">
          <el-input v-model="managerForm.userAccount" auto-complete="off" maxlength="15"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="managerForm.password" auto-complete="off" maxlength="15"></el-input>
        </el-form-item>
        <el-form-item label="验证码" prop="inputCode">
          <el-input class="code" v-model="managerForm.inputCode" auto-complete="off" maxlength="4"></el-input>
          <div @click="createCodeWord" class="managerLogin-right">{{validateCode}}</div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="sumbitManagerLogin('ruleForm')">登 陆</el-button>
          <el-button @click="managerDialogVisible = false">取 消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    {{operationAccounts}}
  </div>
</template>

<script>
// import iPopover from '../../components/common/i-popover'
import ChangeBetContext from '../../utils/changeBetContext.js'
import loginValidate from '../../utils/loginValidate.js'
import req from '../../api/order-list/index.js'
import req1 from '../../api/login/login.js'
export default {
  components: {
    // iPopover
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
      managerDialogVisible: false,
      managerForm: {
        userAccount: '',
        password: '',
        inputCode: ''
      },
      validateCode: '',
      validateFlag: false,
      rules: {
        userAccount: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ],
        inputCode: [
          { required: true, message: '请输入验证码', trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    '$store.state.activeIndex' (val) {
      if (val === '/order-query/account-order') {
        this.getData()
      }
    }
  },
  computed: {
    operationAccounts () {
      this.operationAccount()
      return ''
    }
  },
  created () {
    if (localStorage.getItem('setMenuDisabled')) {
      this.$store.commit('setMenuDisabled', true)
    }
    this.getData()
    document.addEventListener('click', () => {
      this.showOutPopover = false
    })
  },
  mounted () {
    document.getElementById('outPopover').addEventListener('click', (event) => {
      event.stopPropagation()
    })
  },
  methods: {
    getData () {
      let memberParams = {
        page: this.pageIndex,
        pageSize: this.pageSize
      }
      req('getSettleList', memberParams)
        .then(res => {
          if (res.code === '00000') {
            this.accountData.rebatePoint = res.data.store.rebatePoint / 100
            this.statisticData = res.data.statistic
            res.data.orderList.result.map(val => {
              val.lotteryTypeWord = ChangeBetContext.lotteryType(val.lotteryType)
              val.printFlag = ChangeBetContext.printFlag(val.printFlag)
              val.subPlayTypeWord = ChangeBetContext.subPlayType(val.subPlayType)
              val.settleStatusWord = ChangeBetContext.settleStatus(val.settleStatus)
              val.amount = val.amount / 100
              val.awardAmount = val.awardAmount / 100
              val.amountWord = (val.amount).toFixed(2)
              val.awardAmountWord = (val.awardAmount).toFixed(2)
              val.flag = false
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
    handleSelectionChange (val) {
      // 得到被选中的所有的值
      this.accountData.amounts = 0
      this.accountData.awardAmounts = 0
      this.accountData.pages = val.length
      this.accountData.accountList = val
      this.accountData.accountList.map(item1 => {
        this.accountData.amounts += item1.amount
        this.accountData.awardAmounts += item1.awardAmount
      })
    },
    operationAccount () {
      this.accountData.operateMoney = this.accountData.amounts - (this.accountData.awardAmounts + this.accountData.amounts * this.accountData.rebatePoint)
    },
    selectable (row, index) {
      return row.settleStatus === 1
    },
    tableRowClassName ({row, rowIndex}) {
      if (row.settleStatus !== 1) {
        return 'disabled-row'
      }
      return ''
    },
    getOutPopover (rows) {
      this.tableData.map(item => {
        if (item.serialNumber === rows.serialNumber) {
          this.$set(item, 'flag', true)
        }
      })
      req('getOrderDetail', {serialNumber: rows.serialNumber})
        .then(res => {
          if (res.code === '00000') {
            res.data.ticketInfoVoPage.result && (this.ticketInfoNumber = res.data.ticketInfoVoPage.result[0].ticketInfoNumber)
            this.getPopoverData()
          } else {
            this.$message({
              type: 'error',
              message: res.msg
            })
          }
        })
    },
    getPopoverData () {
      req('getTicketInfo', {ticketInfoNumber: this.ticketInfoNumber})
        .then(res => {
          if (res.code === '00000') {
            // console.log(res.data)
            let orderInfo = res.data.orderInfo
            orderInfo.lotteryTypeWord = ChangeBetContext.lotteryType(orderInfo.lotteryType)
            orderInfo.subPlayTypeWord = ChangeBetContext.subPlayType(orderInfo.subPlayType)
            orderInfo.amount = (orderInfo.amount / 100).toFixed(2)
            this.orderInfo = orderInfo
            this.orderInfo.lotterykinds = `${orderInfo.lotteryTypeWord}${orderInfo.subPlayTypeWord}`
            if (!this.orderInfo.printResult || this.orderInfo.printResult.indexOf('data:image/bmp;base64,MTIzNDU2IG5vIGNvbW1pdGUgaW1hZ2U=') > -1) {
              this.printResultFlag = true
            } else {
              this.printResultFlag = false
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
          }
        })
    },
    submitToSettle () {
      if (!this.accountData.accountList.length) {
        this.$message({
          type: 'error',
          message: '请选择可结算订单！'
        })
        return
      }
      let serialNumberArr = []
      this.accountData.accountList.map(item => {
        serialNumberArr.push(item.serialNumber)
      })
      req('submitToSettle', {'serialNumbers': JSON.stringify(serialNumberArr)})
        .then(res => {
          if (res.code === '00000') {
            this.$message({
              type: 'success',
              message: '结算成功！'
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
    managerLogin () {
      this.managerDialogVisible = true
      this.validateCode = loginValidate.createCode()
    },
    createCodeWord () {
      this.validateCode = loginValidate.createCode()
    },
    validate () {
      this.managerForm.inputCode = this.managerForm.inputCode.toUpperCase()
      if (this.managerForm.inputCode.length <= 0) {
        this.$message({
          message: '请输入验证码！',
          type: 'warning'
        })
      } else if (this.managerForm.inputCode !== this.validateCode) {
        this.$message({
          message: '验证码输入错误！',
          type: 'warning'
        })
        // 刷新验证码
        loginValidate.createCode()
        // 清空文本框
        this.managerForm.inputCode = ''
      } else {
        this.validateFlag = true
      }
    },
    sumbitManagerLogin (ruleForm) {
      this.$refs[ruleForm].validate(valid => {
        if (!valid) {
          this.$message({
            message: '请填写完整信息!',
            type: 'warning'
          })
          return
        }
        this.validate()
        if (this.validateFlag) {
          let form = {
            userAccount: this.managerForm.userAccount,
            password: this.managerForm.password
          }
          req1('toggleLogin', form).then(res => {
            if (res.code === '00000') {
              localStorage.setItem('lastToken', localStorage.getItem('token'))
              localStorage.setItem('token', res.data)
              this.$store.commit('token', res.data)
              this.managerDialogVisible = false
              this.$router.push({name: '审核订单'})
              this.$message({
                message: res.msg,
                type: 'success'
              })
            } else {
              this.$message({
                message: res.msg,
                type: 'warning'
              })
              // 刷新验证码
              this.validateCode = loginValidate.createCode()
              this.managerForm.inputCode = ''
            }
          })
        }
      })
    }
  }
}
</script>

<style lang="less">
.account-order{
  .detail{
    font-weight: 400;
    color: #1f2f3d;
    font-size: 20px;
    >span{
      display: inline-block;
      width: 180px;
    }
    .btn{
      float: right;
    }
  }
  .count-order{
    width: 100%;
    border-bottom: 1px solid #4dafdb;
    overflow: hidden;
    padding-bottom: 20px;
    margin-bottom: 20px;
    .count-all{
      display: inline-block;
      margin: 0;
      width: 180px;
    }
    span{
      display: inline-block;
      width: 180px;
    }
  }
  .page{
    margin-top: 15px;
    margin-left: 100px;
  }
  .el-pagination{
    text-align:center;
    margin:20px 0;
  }
  // 禁用的颜色
  .el-table .disabled-row {
    background: #D3D3D3;
  }
  .login{
    .el-dialog__header{
      padding: 20px 0 0;
    }
    .el-dialog__body{
      text-align: center;
      .el-form-item__label{
        display: inline-block;
        float: none;
      }
      .el-form-item__content{
        width: 300px!important;
        display: inline-block;
        // display: inline-block;
        margin: 0!important;
        margin-left: 0!important;
        .code{
          width: 180px!important;
        }
        .managerLogin-right{
          float: right;
          width: 100px;
          height: 40px;
          line-height: 40px;
          background: #409EFF;
          color: #fff;
          letter-spacing: 6px;
          cursor:pointer;
        }
      }
    }
  }
  .el-dialog{
    .popper__arrow{
      top: 2% !important;
    }
    // .hoverInput{
    //   display: flex;
    //   align-items: center;
    //   span{
    //     width: 100px;
    //   }
    //   .el-input__inner{
    //     width: 545px;
    //     height: 33px;
    //   }
    // }
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
      text-align: center;
      .no-image{
        margin: 0 auto;
        width: 200px;
        height: 300px;
        border: 1px solid #cccccc;
      }
      .img{
        margin: 10px auto;
        max-width: 400px;
      }
    }
  }
}
</style>
