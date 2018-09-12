<template>
  <div class="nav">
    <div class="top">
        <div class="top-left">
            <p>店铺名：{{storeInfo.storeName}}</p>
            <p>地址：{{storeInfo.storeAddress}}</p>
        </div>
        <div class="top-right">
          <el-menu
            :default-active="$route.path"
            class="el-menu-vertical"
            @open="handleOpen"
            @close="handleClose"
            @select="handleSelect">
            <el-menu-item
              index="/order-query/order-List"
              class="flex-item"
              :class="{'clear-style': clearStyle}"
              id="order-List"
              :disabled="$store.state.menuDisabled.orderList">
              <span class="icon-box" ref="orderList">
                <i class="icon iconfont icon-xiaofeimingxidan"></i>
                <span slot="title" class="icon-name">获取订单</span>
              </span>
            </el-menu-item>
            <button
              class="flex-item"
              :disabled="$store.state.menuDisabled.accountOrder"
              :class="{'examinDisabled': $store.state.menuDisabled.accountOrder, 'clear-style': clearStyle}"
              @click="managerLogin">
              <span class="icon-box" ref="accountOrder">
                <i class="el-icon-printer i-color"></i>
                <span slot="title" class="icon-name">订单结算</span>
              </span>
            </button>
            <el-menu-item
              :disabled="$store.state.menuDisabled.queryOrder"
              id="query-order"
              index="/order-query/query-order"
              class="flex-item"
              :class="{'clear-style': clearStyle}">
              <span class="icon-box" ref="queryOrder">
                <i class="icon iconfont icon-SQLshenhe"></i>
                <span slot="title" class="icon-name">查询</span>
              </span>
            </el-menu-item>

            <!-- <el-menu-item index="/order-query/query-order" class="flex-item" :class="{'clear-style': clearStyle}">
              <span class="icon-box" ref="queryOrder">
                <i class="icon iconfont icon-SQLshenhe"></i>
                <span slot="title" class="icon-name">查询</span>
              </span>
            </el-menu-item> -->
            <button
              class="flex-item"
              :disabled="$store.state.menuDisabled.queryOrder"
              :class="{'examinDisabled': $store.state.menuDisabled.queryOrder, 'hand-active': handActive}"
              @click="prizeDialogShow">
              <span class="icon-box" ref="prizeOrder">
                <i class="icon iconfont icon-accountbook"></i>
                <span slot="title" class="icon-name">兑奖</span>
              </span>
            </button>
            <el-menu-item
              index=""
              class="flex-item bigger"
              v-if="$store.state.activeIndex==='/order-query/examine-order'">
              <span class="icon-box" @click="quit">
                <i class="icon iconfont icon-logout"></i>
                <span slot="title" class="icon-name">管理员登出</span>
              </span>
            </el-menu-item>
            <el-menu-item
              index="quitSystem"
              class="flex-item last-item"
              :disabled="$store.state.menuDisabled.quitSystem"
              :class="{'clear-style': clearStyle}">
              <span class="icon-box">
                <i class="icon iconfont icon-poweroff"></i>
                <span slot="title" class="icon-name">退出系统</span>
              </span>
            </el-menu-item>
          </el-menu>
          <img class="logo" src="../assets/image/logo.png" alt="">
        </div>
    </div>

    <div class="content">
      <div class="content1">
        <router-view></router-view>
      </div>
    </div>

    <el-dialog
      title="登陆"
      :visible.sync="managerDialogVisible"
      width="500px"
      :show-close="false"
      center
      class="login">
      <el-form :model="managerForm" label-width="100px" :rules="rules" ref="ruleForm">
        <el-form-item label="用户名" prop="userAccount">
          <el-input v-model="managerForm.userAccount" autofocus="autofocus" ref="userAccount" auto-complete="off" maxlength="15"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="managerForm.password" ref="password" auto-complete="off" maxlength="15"></el-input>
        </el-form-item>
        <el-form-item label="验证码" prop="inputCode">
          <el-input class="code" v-model="managerForm.inputCode" ref="inputCode" auto-complete="off" maxlength="4"></el-input>
          <div @click="createCodeWord" class="managerLogin-right">{{validateCode}}</div>
        </el-form-item>
        <el-form-item class="last-item">
          <el-button type="primary" @click="sumbitManagerLogin('ruleForm')">登 陆</el-button>
          <el-button @click="cancleMangerLogin">取 消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 兑奖输入原始金额弹框 start -->
    <el-dialog
      title="输入票机余额（元）："
      :visible.sync="prizeDialogVisible"
      :show-close="false"
      width="30%"
      :close-on-click-modal="false"
      class="prize-dialog">
      <input v-model="originalAmount" ref="inputMoney" class="amount" placeholder="请输入金额">
      <span slot="footer" class="dialog-footer">
        <el-button @click="prizeDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="toPrizeOrder">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 兑奖输入原始金额弹框 start -->

    <!-- 兑奖退出统一提示 start -->
    <el-dialog
      title="提示"
      :visible.sync="prizeExitVisible"
      :show-close="false"
      width="30%"
      :close-on-click-modal="false"
      class="prize-dialog">
      <span>请核对当前票机兑奖票共<span class="xuan">{{totalTicket || 0}}</span>张<br>票机兑奖金额为<span class="xuan">{{totalMoney}}</span> 元</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="canclePrize">取 消</el-button>
        <el-button type="primary" @click="prizeExit">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 兑奖退出统一提示 end -->
  </div>
</template>
<script>
import req1 from '../api/login/login.js'
import loginValidate from '../utils/loginValidate.js'
export default {
  data () {
    return {
      activeIndex: this.$store.state.activeIndex,
      storeInfo: {},
      // 管理员登陆弹出框
      managerDialogVisible: false,
      // 兑奖前弹框
      prizeDialogVisible: false,
      prizeExitVisible: false,
      // 原始金额
      originalAmount: '',
      // 兑奖后总金额及票数
      totalTicket: '',
      totalMoney: '',
      // 更改选中样式
      handActive: false,
      clearStyle: false,
      // 兑奖转到订单结算开关
      decidePrizeExit: false,
      managerForm: {
        userAccount: '',
        password: '',
        inputCode: ''
      },
      // 验证码
      validateCode: '',
      validateFlag: false,
      focusRecord: 0,
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
    '$store.state.keyboardCode': function (val) {
      // console.log('watch', val)
      switch (val) {
        case 111:
          if (!this.prizeDialogVisible) {
            this.managerDialogVisible || this.$refs.orderList.click()
          }
          break
        case 106:
          if (!this.prizeDialogVisible) {
            if (this.managerDialogVisible) {
              this.cancleMangerLogin()
            } else {
              this.$refs.accountOrder.click()
            }
          }
          // this.managerDialogVisible && this.cancleMangerLogin()
          break
        case 107:
          if (this.managerDialogVisible) {
            this.focusRecord++
            this.$store.commit('setkeyboardCode', -1)
            if (this.focusRecord === 1) {
              this.$refs.password.focus()
            } else if (this.focusRecord === 2) {
              this.$refs.inputCode.focus()
            } else if (this.focusRecord === 3) {
              this.focusRecord = 2
            }
          } else if (this.prizeDialogVisible) {
            this.prizeDialogVisible = false
          } else {
            this.$refs.prizeOrder.click()
          }
          break
        case 109:
          if (!this.prizeDialogVisible) {
            if (this.managerDialogVisible) {
              this.focusRecord--
              this.$store.commit('setkeyboardCode', -1)
              if (this.focusRecord === 0) {
                this.$refs.userAccount.focus()
              } else if (this.focusRecord === 1) {
                this.$refs.password.focus()
              } else if (this.focusRecord === -1) {
                this.focusRecord = 0
              }
            } else {
              this.$refs.queryOrder.click()
            }
          }
          // this.$refs.queryOrder.click()
          break
        case 8:
          // this.cancleMangerLogin()
          if (this.prizeExitVisible) {
            this.canclePrize()
          }
          break
        case 0:
          if (this.managerDialogVisible) {
            this.sumbitManagerLogin('ruleForm')
          } else if (this.prizeDialogVisible) {
            this.toPrizeOrder()
          } else if (this.prizeExitVisible) {
            this.prizeExit()
          }
          break
        default:
          break
      }
      this.$store.commit('setkeyboardCode', -1)
      // console.log('watch', val)
    },
    managerDialogVisible: function (val) {
      this.$store.commit('setManagerFlag', val)
    },
    prizeDialogVisible: function (val) {
      this.$store.commit('setOriginalPrizeFlag', val)
    },
    prizeExitVisible: function (val) {
      this.$store.commit('setPrizeExitFlag', val)
    }
  },
  created () {
    if (localStorage.getItem('setActiveIndex') === '/order-query/prize-order') {
      this.handActive = true
    }
    this.storeInfo = JSON.parse(sessionStorage.getItem('storeInfo'))
    const _this = this
    document.onkeydown = function (e) {
      // console.log('nav', e.keyCode)
      if (e.keyCode === 144) {
        return
      }
      switch (e.keyCode) {
        case 111:
          if (!_this.prizeDialogVisible) {
            _this.managerDialogVisible || _this.$refs.orderList.click()
          }
          break
        case 106:
          if (!_this.prizeDialogVisible) {
            if (_this.managerDialogVisible) {
              _this.cancleMangerLogin()
            } else {
              _this.$refs.accountOrder.click()
            }
          }
          break
        case 107:
          // console.log(1232)
          if (_this.managerDialogVisible) {
            _this.focusRecord++
            if (_this.focusRecord === 1) {
              _this.$refs.password.focus()
              return false
            } else if (_this.focusRecord === 2) {
              _this.$refs.inputCode.focus()
              return false
            } else if (_this.focusRecord === 3) {
              _this.focusRecord = 2
              return false
            }
          } else if (_this.prizeDialogVisible) {
            _this.prizeDialogVisible = false
          } else {
            _this.$refs.prizeOrder.click()
          }
          break
        case 109:
          if (!_this.prizeDialogVisible) {
            if (_this.managerDialogVisible) {
              _this.focusRecord--
              if (_this.focusRecord === 0) {
                _this.$refs.userAccount.focus()
                return false
              } else if (_this.focusRecord === 1) {
                _this.$refs.password.focus()
                return false
              } else if (_this.focusRecord === -1) {
                _this.focusRecord = 0
                return false
              }
            } else {
              _this.$refs.queryOrder.click()
            }
          }
          // _this.managerDialogVisible || _this.$refs.queryOrder.click()
          break
        case 8:
          // _this.cancleMangerLogin()
          if (_this.prizeExitVisible) {
            _this.canclePrize()
          }
          break
        case 0:
          if (_this.managerDialogVisible) {
            _this.sumbitManagerLogin('ruleForm')
          } else if (_this.prizeDialogVisible) {
            _this.toPrizeOrder()
          } else if (_this.prizeExitVisible) {
            _this.prizeExit()
          }
          break
        default:
          break
      }
    }
  },
  mounted () {
  },
  methods: {
    handleSelect (index, indexPath) {
      this.toIndex = index
      if (localStorage.getItem('setActiveIndex') === '/order-query/prize-order') {
        // 获取兑奖页面传回的累积总金额及累积兑奖票
        this.totalTicket = sessionStorage.getItem('totalTicket')
        this.totalMoney = sessionStorage.getItem('totalMoney')
        this.prizeExitVisible = true
        return
      }
      if (index === '/order-query/examine-order') {
        this.managerDialogVisible = true
        this.validateCode = loginValidate.createCode()
        this.managerForm = {
          userAccount: '',
          password: '',
          inputCode: ''
        }
        return
      } else if (index === 'quitSystem') {
        sessionStorage.removeItem('token')
        this.$store.commit('token', '')
        this.$router.push({name: '登录'})
        return
      }
      this.activeIndex = index
      this.$store.commit('setActiveIndex', index)
      localStorage.setItem('setActiveIndex', index)
      this.$router.push({path: index})
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
    managerLogin () {
      this.toIndex = '/order-query/examine'
      if (localStorage.getItem('setActiveIndex') === '/order-query/prize-order') {
        // 获取兑奖页面传回的累积总金额及累积兑奖票
        this.totalTicket = sessionStorage.getItem('totalTicket')
        this.totalMoney = sessionStorage.getItem('totalMoney')
        this.prizeExitVisible = true
        return
      }
      this.focusRecord = 0
      this.managerDialogVisible = true
      this.$nextTick(() => {
        this.$refs.userAccount.focus()
      })
      this.validateCode = loginValidate.createCode()
      this.managerForm = {
        userAccount: '',
        password: '',
        inputCode: ''
      }
    },
    // 管理员登陆
    sumbitManagerLogin (ruleForm) {
      // this.focusRecord = 0
      this.$refs[ruleForm].validate(valid => {
        if (!valid) {
          this.$message({
            message: '请填写完整信息!',
            type: 'warning'
          })
          return
        }
        this.validate()
        // this.validateFlag = true
        if (this.validateFlag) {
          let form = {
            userAccount: this.managerForm.userAccount,
            password: this.managerForm.password
          }
          req1('toggleLogin', form).then(res => {
            if (res.code === '00000') {
              this.managerDialogVisible = false
              // 考虑从兑奖页面跳转
              this.handActive = false
              this.clearStyle = false
              sessionStorage.setItem('lastToken', sessionStorage.getItem('token'))
              sessionStorage.setItem('token', res.data.token)
              this.$store.commit('token', res.data.token)
              this.$store.commit('setActiveIndex', '/order-query/examine-order')
              localStorage.setItem('setActiveIndex', '/order-query/examine-order')
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
    },
    cancleMangerLogin () {
      if (this.decidePrizeExit) {
        this.handActive = true
      }
      this.managerDialogVisible = false
      this.$store.commit('setPrizeCancelFlag', true)
    },
    handleOpen (val) {
    },
    handleClose () {

    },
    quit () {
      let lastToken = sessionStorage.getItem('lastToken')
      sessionStorage.setItem('token', lastToken)
      this.$store.commit('token', lastToken)
      this.$store.commit('setActiveIndex', '')
      let setMenuDisabled = {
        orderList: false,
        accountOrder: true,
        queryOrder: true,
        quitSystem: true
      }
      this.$store.commit('setMenuDisabled', setMenuDisabled)
      localStorage.setItem('setMenuDisabled', JSON.stringify(setMenuDisabled))
      this.$router.push({path: '/'})
    },
    exitSystem () {
      sessionStorage.removeItem('token')
      this.$store.commit('token', '')
      this.$router.push({name: '登录'})
    },
    toPrizeOrder () {
      this.originalAmount = this.originalAmount.replace(/(^\s*)|(\s*$)/g, '')
      let reg = /(^[0]{1}[.]{1}([0]{0,1}[1-9]{0,2})$)|(^[1-9]\d{0,}[.]{1}\d{1,2}$)|(^[0-9]\d{0,}$)/
      let flag = reg.test(this.originalAmount)
      if (!flag) {
        this.$message({
          type: 'error',
          message: '请输入正确的金额数字！',
          onClose: () => {
            this.$refs.inputMoney.focus()
            this.originalAmount = ''
          }
        })
        this.originalAmount = ''
        return
      }
      if (this.originalAmount) {
        sessionStorage.setItem('originalAmount', this.originalAmount)
        this.$router.push({name: '兑奖页面'})
        this.$store.commit('setActiveIndex', '/order-query/prize-order')
        localStorage.setItem('setActiveIndex', '/order-query/prize-order')
        this.handActive = true
        this.clearStyle = true
        this.prizeDialogVisible = false
      } else {
        this.$message({
          type: 'error',
          message: '请输入原始金额！'
        })
      }
    },
    prizeExit () {
      if (this.toIndex === '/order-query/examine') {
        this.managerDialogVisible = true
        this.prizeExitVisible = false
        this.decidePrizeExit = true
        this.validateCode = loginValidate.createCode()
        this.managerForm = {
          userAccount: '',
          password: '',
          inputCode: ''
        }
        this.$nextTick(() => {
          this.$refs.userAccount.focus()
        })
      } else if (this.toIndex === 'quitSystem') {
        sessionStorage.removeItem('token')
        this.$store.commit('token', '')
        this.$router.push({name: '登录'})
      } else {
        this.$router.push(this.toIndex)
        this.handActive = false
        this.clearStyle = false
        this.prizeExitVisible = false
        this.$store.commit('setActiveIndex', this.toIndex)
        localStorage.setItem('setActiveIndex', this.toIndex)
      }
    },
    prizeDialogShow () {
      if (localStorage.getItem('setActiveIndex') !== '/order-query/prize-order') {
        this.prizeDialogVisible = true
        this.$nextTick(() => {
          this.$refs.inputMoney.focus()
          this.originalAmount = ''
        })
      }
    },
    canclePrize () {
      this.prizeExitVisible = false
      this.$store.commit('setPrizeCancelFlag', true)
    }
  }
}
</script>
<style lang="less">
.nav{
    width: 100%;
    height: 100%;
    overflow: hidden;
    // 仿element-menu的active样式
    .hand-active{
      background: #035bda !important;
    }
    .top{
        width: 100%;
        height: 110px;
        position: relative;
        z-index: 999;
        box-sizing: border-box;
        background-color: #04285c;
        box-shadow: 0 2px 10px rgba(39,54,78,.2);
        display: flex;
        .top-left{
            display: inline-block;
            font-size: 20px;
            color: #fff;
            background: #073679;
            padding: 20px 30px;
            position: relative;
            p{
                margin: 0;
                line-height: 35px;
                vertical-align: middle;
                white-space: nowrap;
                max-width: 400px;
                overflow: hidden;
                text-overflow: ellipsis;
            }
        }
        .top-left::after{
            display: inline-block;
            content: "";
            width: 15px;
            height: 110px;
            background:#031e44;
            position: absolute;
            right: 0;
            top: 0;
        }
        .top-right{
            flex: 1;
            padding: 0 20px;
            .el-menu-vertical{
                display: flex;
                flex-flow: row nowrap;
                background: transparent;
                .flex-item{
                    width: 110px;
                    height: 100px;
                    line-height: 100px;
                    text-align: center;
                    padding: 0!important;
                    letter-spacing: 3px;
                    border-radius: 10px;
                    margin: 5px 10px;
                    border: 3px solid hsl(0, 0%, 100%);
                    background: #04285c;
                    outline: none;
                    &.bigger{
                      width: 130px;
                      position: absolute;
                      right: 350px;
                    }
                    .icon-box{
                        display: inline-block;
                        line-height: normal;
                        vertical-align: middle;
                        i{
                            display: block;
                            text-align: center;
                            width: 100%;
                            font-size: 36px;
                            margin-bottom: 8px;
                            color: #ffffff;
                        }
                        .icon-name{
                            display: inline-block;
                            font-size: 20px;
                            color: #fff;
                        }
                    }
                    &.loginOut{
                        border: none;
                        outline: none;
                        background: #4dafdb;
                    }
                    &.is-active{
                        background: #035bda!important;
                    }
                    &.examinDisabled{
                      background: #04285c;
                      opacity: 0.25;
                      cursor: not-allowed;
                    }
                    &.clear-style{
                      background: #04285c !important;
                    }
                }
                .last-item{
                    position: absolute;
                    right: 220px;
                }
            }
        }
        .logo{
            width: 200px;
            position: absolute;
            right: 30px;
            top: 0;
            bottom: 0;
            margin: auto;
        }
    }
    .content{
        box-sizing: border-box;
        width: 100%;
        height: calc(100% - 90px);
        padding: 0 30px;
        display: flex;
        flex-flow: row nowrap;
        justify-content: space-between;
        .content1{
            flex: 1;
            background: #ffffff;
            overflow: hidden;
            padding: 85px 20px 20px;
        }
        /*滚动条样式*/
        .content1::-webkit-scrollbar {
            width: 6px;
            height: 6px;
        }
        .content1::-webkit-scrollbar-thumb {
            border-radius: 10px;
            background: #dedee4;
        }
        .content1::-webkit-scrollbar-track {
            border-radius: 0;
            background: #f4f4f4;
        }
    }
    .login{
      .el-dialog__header{
        padding: 30px 0;
        .el-dialog__title{
          font-size: 26px;
        }
        .el-dialog__close{
          font-size: 32px;
        }
      }
      .el-dialog__body{
        text-align: center;
        padding: 0 25px 30px;
        .el-form-item{
          text-align: center;
          font-size: 0;
          &.last-item{
            margin-bottom: 0;
            button{
              font-size: 20px;
              padding: 12px 30px;
            }
          }
          .el-form-item__label{
            font-size: 20px;
            display: inline-block;
            float: none;
          }
          .el-form-item__content{
            width: 300px;
            display: inline-block;
            margin-left: 0!important;
            .el-input__inner{
              font-size: 20px;
            }
            .code{
              width: 180px;
              margin-right: 20px;
            }
            .managerLogin-right{
              text-align: center;
              float: right;
              width: 100px;
              line-height: 40px;
              background: #409EFF;
              color: #fff;
              letter-spacing: 6px;
              cursor:pointer;
              font-size: 20px;
            }
          }
        }
        .el-button+.el-button {
          margin-left: 50px;
        }
      }
    }
    .prize-dialog{
      .el-dialog__body{
        text-align: center;
      }
      .el-dialog__footer{
        text-align: center;
        .el-button+.el-button {
          margin-left: 50px;
        }
      }
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
    .el-menu-item.is-active{
        background-color: rgba(255,  255, 255, .5) !important;
    }
    .el-dialog__body{
      font-size: 20px;
      .xuan{
        margin: 0 10px;
        color: red;
      }
    }
}
</style>
