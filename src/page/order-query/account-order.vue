<template>
  <div class="account-order">
    <div class="count-order">
      <p class="count-all">结算统计：&nbsp;</p>
      <span>张数：{{accountData.pages || 0}}张</span>
      <span>销售总额： {{(accountData.amounts).toFixed(2) || 0}}元</span>
      <span>奖金： {{(accountData.awardAmounts).toFixed(2) || 0}}元</span>
      <span>结算金额： {{(accountData.operateMoney).toFixed(2) || 0}}元</span>
      <div class="btn">
        <el-button type="success" size="medium" @click="managerLogin">登陆</el-button>
        <el-button type="primary" size="medium" @click="submitToSettle">结算</el-button>
      </div>
    </div>

    <el-table
      :height="winHeight"
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      border
      style="width: 100%"
      @selection-change="handleSelectionChange"
      :row-class-name="tableRowClassName"
      v-loading="loading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading">
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
      v-if="tableData.length"
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
            <span v-for="(item1, index1) in scope.row.betItemsObj" :key="index1">[{{item1.key}}&nbsp;({{item1.odds}})]</span>
          </template>
        </el-table-column>
      </el-table>
      <div class="uploadImg">
        <!-- <img class="img" :src="orderInfo.printResult" alt=""> -->
        <img class="img" :src="imgStr" alt="" @click="enlarge">
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
          <el-input type="password" v-model="managerForm.password" auto-complete="off" maxlength="15"></el-input>
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

    <div class="Mask" v-if="Mask" @click="maskClick"></div>
    <div class="enlarge" v-if="enlargeImg">
      <img :src="imgStr" alt="" @click="narrow">
    </div>

    {{operationAccounts}}
  </div>
</template>

<script>
import ChangeBetContext from '../../utils/changeBetContext.js'
import loginValidate from '../../utils/loginValidate.js'
import req from '../../api/order-list/index.js'
import req1 from '../../api/login/login.js'
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
      // 票面的投注信息
      hoverData: [],
      // 票面信息
      orderInfo: {},
      // 销售与订单信息
      statisticData: {},
      // 审核信息
      accountData: {
        // 销售张数
        pages: 0,
        // 销售金额
        amounts: 0,
        // 奖金
        awardAmounts: 0,
        // 结算金额
        operateMoney: 0,
        // 比例
        rebatePoint: 0,
        // 可结算列表
        accountList: []
      },
      managerDialogVisible: false,
      managerForm: {
        userAccount: '',
        password: '',
        inputCode: ''
      },
      // 验证码
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
      },
      // 图片
      imgStr: '',
      Mask: false,
      enlargeImg: false,
      // 是否可结算的标志
      auditLoginFlag: false,
      loading: false,
      winHeight: 0
    }
  },
  watch: {
    // '$store.state.activeIndex' (val) {
    //   if (val === '/order-query/account-order') {
    //     let setMenuDisabled = {
    //       orderList: true,
    //       accountOrder: false
    //     }
    //     this.$store.commit('setMenuDisabled', setMenuDisabled)
    //     localStorage.setItem('setMenuDisabled', JSON.stringify(setMenuDisabled))
    //     this.getData()
    //   }
    // }
  },
  computed: {
    operationAccounts () {
      this.operationAccount()
      return ''
    }
  },
  created () {
    if (JSON.parse(localStorage.getItem('setMenuDisabled')).orderList) {
      let setMenuDisabled = {
        orderList: false,
        accountOrder: false,
        queryOrder: false
      }
      this.$store.commit('setMenuDisabled', setMenuDisabled)
    }
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
    // 获取列表数据
    getData () {
      let memberParams = {
        page: this.pageIndex,
        pageSize: this.pageSize
      }
      this.loading = true
      req('getSettleList', memberParams)
        .then(res => {
          if (res.code === '00000') {
            this.loading = false
            this.auditLoginFlag = res.data.auditLoginFlag
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
    // 得到被选中的所有的值
    handleSelectionChange (val) {
      this.accountData.amounts = 0
      this.accountData.awardAmounts = 0
      this.accountData.pages = val.length
      this.accountData.accountList = val
      this.accountData.accountList.map(item1 => {
        this.accountData.amounts += item1.amount
        this.accountData.awardAmounts += item1.awardAmount
      })
    },
    // 计算结算金额
    operationAccount () {
      this.accountData.operateMoney = this.accountData.amounts - (this.accountData.awardAmounts + this.accountData.amounts * this.accountData.rebatePoint)
    },
    // 只要不是可结算状态就被禁用，不计入结算金额里
    selectable (row, index) {
      return row.settleStatus === 1
    },
    // 给不可结算的数据添加禁用颜色
    tableRowClassName ({row, rowIndex}) {
      if (row.settleStatus !== 1) {
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
            this.imgStr = this.orderInfo.printResult
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
            this.showOutPopover = true
          } else {
            this.$message({
              type: 'error',
              message: res.msg
            })
          }
          this.tableData.map(item => {
            if (this.orderInfo.serialNumber === item.serialNumber) {
              this.$set(item, 'flag', false)
            }
          })
        })
    },
    // 结算
    submitToSettle () {
      let flag = false
      this.tableData.map(item => {
        if (item.settleStatus === 2) {
          flag = true
        }
      })
      // 列表中如果有审核包（即有待审核），则不能再次点击结算
      if (flag) {
        this.$message({
          type: 'error',
          message: '已经有待审核的订单，不可再次结算！'
        })
      } else {
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
      }
    },
    // 检验管理员是否可以登陆
    managerLogin () {
      if (this.auditLoginFlag) {
        this.managerDialogVisible = true
        this.managerForm = {
          userAccount: this.managerForm.userAccount,
          password: '',
          inputCode: ''
        }
        this.validateCode = loginValidate.createCode()
      } else {
        this.$message({
          message: '没有待审核的订单',
          type: 'warning'
        })
      }
    },
    // 生成验证码
    createCodeWord () {
      this.validateCode = loginValidate.createCode()
    },
    // 检验验证码
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
        this.validateCode = loginValidate.createCode()
        // 清空文本框
        this.managerForm.inputCode = ''
      } else {
        this.validateFlag = true
      }
    },
    // 管理员登陆
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
        this.validateFlag = true
        if (this.validateFlag) {
          let form = {
            userAccount: this.managerForm.userAccount,
            password: this.managerForm.password
          }
          req1('toggleLogin', form).then(res => {
            if (res.code === '00000') {
              sessionStorage.setItem('lastToken', sessionStorage.getItem('token'))
              sessionStorage.setItem('token', res.data.token)
              this.$store.commit('token', res.data.token)
              this.$store.commit('setActiveIndex', '/order-query/examine-order')
              localStorage.setItem('setActiveIndex', '/order-query/examine-order')
              this.$router.push({name: '审核订单'})
              let setMenuDisabled = {
                orderList: false,
                accountOrder: false,
                queryOrder: false
              }
              this.$store.commit('setMenuDisabled', setMenuDisabled)
              localStorage.setItem('setMenuDisabled', JSON.stringify(setMenuDisabled))
              this.managerDialogVisible = false
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
  }
}
</script>

<style lang="less">
.account-order{
  .count-order{
    box-sizing: border-box;
    width: calc(100% - 60px);
    height: 80px;
    line-height: 50px;
    font-size: 18px;
    background: #ffffff;
    position: fixed;
    top: 110px;
    left: 30px;
    z-index: 998;
    border-bottom: 1px solid #4dafdb;
    padding: 20px 20px 10px;
    .count-all{
      display: inline-block;
      margin: 0;
    }
    >span{
      display: inline-block;
      width: 180px;
    }
    .btn{
      float: right;
      .el-button--medium{
        padding: 15px 40px;
        font-size: 18px;
        border-radius: 10px;
      }
    }
  }
  .page{
    margin-top: 15px;
    margin-left: 100px;
  }
  .el-pagination{
    text-align:center;
    margin:20px 0;
    *{
      font-size: 20px;
    }
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
        margin: 0!important;
        margin-left: 0!important;
        .code{
          width: 180px!important;
          margin-right: 20px;
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
      .el-button+.el-button {
        margin-left: 50px;
      }
    }
  }
  .orderNum-popover{
    .el-dialog{
      margin-top: 0 !important;
      margin-bottom: 0;
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
}
</style>
