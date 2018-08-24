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
                <el-menu-item index="/order-query/order-List" class="flex-item" id="order-List" :disabled="$store.state.menuDisabled.orderList">
                    <span class="icon-box" ref="orderList">
                        <i class="icon iconfont icon-xiaofeimingxidan"></i>
                        <span slot="title" class="icon-name">获取订单</span>
                    </span>
                </el-menu-item>
                <el-menu-item index="/order-query/examine-order" class="flex-item" :disabled="$store.state.menuDisabled.accountOrder">
                    <span class="icon-box" ref="accountOrder">
                        <i class="el-icon-printer i-color"></i>
                        <span slot="title" class="icon-name">订单结算</span>
                    </span>
                </el-menu-item>
                <el-menu-item index="" class="flex-item bigger"  v-if="$store.state.activeIndex==='/order-query/examine-order'">
                    <span class="icon-box" @click="quit">
                        <i class="icon iconfont icon-logout"></i>
                        <span slot="title" class="icon-name">管理员登出</span>
                    </span>
                </el-menu-item>
                <el-menu-item :disabled="$store.state.menuDisabled.queryOrder" id="query-order" index="/order-query/query-order" class="flex-item">
                    <span class="icon-box" ref="queryOrder">
                        <i class="icon iconfont icon-SQLshenhe"></i>
                        <span slot="title" class="icon-name">查询</span>
                    </span>
                </el-menu-item>

                <!-- <el-menu-item index="/order-query/query-order" class="flex-item">
                    <span class="icon-box">
                        <i class="icon iconfont icon-SQLshenhe"></i>
                        <span slot="title" class="icon-name">查询</span>
                    </span>
                </el-menu-item> -->
                <el-menu-item :disabled="$store.state.menuDisabled.queryOrder" index="/order-query/prize-order" class="flex-item">
                    <span class="icon-box">
                        <i class="icon iconfont icon-accountbook"></i>
                        <span slot="title" class="icon-name">兑奖</span>
                    </span>
                </el-menu-item>
                <el-menu-item index="quitSystem" class="flex-item last-item" :disabled="$store.state.menuDisabled.quitSystem">
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
          <el-input v-model="managerForm.userAccount" auto-complete="off" maxlength="15"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="managerForm.password" auto-complete="off" maxlength="15"></el-input>
        </el-form-item>
        <el-form-item label="验证码" prop="inputCode">
          <el-input class="code" v-model="managerForm.inputCode" auto-complete="off" maxlength="4"></el-input>
          <div @click="createCodeWord" class="managerLogin-right">{{validateCode}}</div>
        </el-form-item>
        <el-form-item class="last-item">
          <el-button type="primary" @click="sumbitManagerLogin('ruleForm')">登 陆</el-button>
          <el-button @click="cancleMangerLogin">取 消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
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
      }
    }
  },
  watch: {
    '$store.state.keyboardCode': function (val) {
      console.log('watch', val)
      switch (val) {
        case 111:
          this.$refs.orderList.click()
          break
        case 106:
          this.$refs.accountOrder.click()
          break
        case 109:
          this.$refs.queryOrder.click()
          break
        case 8:
          this.managerDialogVisible = false
          break
        case 0:
          this.sumbitManagerLogin('ruleForm')
          break
        default:
          break
      }
    }
  },
  created () {
    this.storeInfo = JSON.parse(sessionStorage.getItem('storeInfo'))
    console.log('nav页面')
    const _this = this
    document.onkeydown = function (e) {
      console.log('nav', e.keyCode)
      if (e.keyCode === 144) {
        return
      }
      switch (e.keyCode) {
        case 111:
          _this.$refs.orderList.click()
          break
        case 106:
          _this.$refs.accountOrder.click()
          break
        case 109:
          _this.$refs.queryOrder.click()
          break
        case 8:
          _this.managerDialogVisible = false
          break
        case 0:
          _this.sumbitManagerLogin('ruleForm')
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
      // console.log(index, indexPath)
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
        // this.validateFlag = true
        if (this.validateFlag) {
          let form = {
            userAccount: this.managerForm.userAccount,
            password: this.managerForm.password
          }
          req1('toggleLogin', form).then(res => {
            if (res.code === '00000') {
              this.managerDialogVisible = false
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
      this.managerDialogVisible = false
      this.$nextTick(() => {
        this.$refs.accountOrder.parentNode.classList.remove('is-active')
      })
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
    }
  }
}
</script>
<style lang="less">
.nav{
    width: 100%;
    height: 100%;
    overflow: hidden;
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
                    &.bigger{
                      width: 130px;
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
    .el-menu-item.is-active{
        background-color: rgba(255,  255, 255, .5) !important;
        // color: #333333 !important;
        // i{
        //     color: #909399!important;
        // }
    }
}
</style>
