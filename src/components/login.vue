<template>
  <div class="login">
      <div class="content">
          <div class="loginCon">
            <img class="logo" src="../assets/image/logo.png" alt="">
            <div class="wrap">
              <el-form ref="form" :model="form" label-width="100px" class="form">
                  <el-form-item label="用户名：">
                      <el-input class="user" ref="user" v-model="form.userAccount" autofocus="autofocus" placeholder="请输入用户名"></el-input>
                  </el-form-item>
                  <el-form-item  label="密   码：">
                      <el-input class="pass" type="password" ref="password" v-model="form.password" placeholder="请输入密码"></el-input>
                  </el-form-item>
                  <!-- <div class="code">
                    <el-form-item>
                        <el-input class="left" v-model="inputCode" placeholder="验证码"></el-input>
                    </el-form-item>
                    <div @click="createCode" class="right">{{validateCode}}</div>
                  </div> -->
              </el-form>
              <div class="btnbox">
                <el-button class="leftBtn" type="warning"  @click="statusCheck">设备检测</el-button>
                <div class="rightBtn">
                  <div class="success" v-if="statusCheckFlag">
                    <span>设备检测成功</span>
                    <i class="el-icon-success"></i>
                  </div>
                  <div class="danger" v-if="!statusCheckFlag">
                    <span>请检测设备</span>
                    <i class="el-icon-warning"></i>
                  </div>
                </div>
              </div>
              <el-button type="primary" size="medium" class="btn" @click="login">登录</el-button>
            </div>
          </div>
          <button class="mimi" @click="exit"></button>
      </div>
  </div>
</template>
<script>
import req from '../api/login/login.js'
// import getCode from '../utils/encoded.js'
export default {
  inject: ['reload'],
  data () {
    return {
      form: {
        userAccount: '',
        password: ''
      },
      QRcode: '',
      timer: null,
      latechFlag: false,
      statusCheckFlag: false,
      focusRecord: 0
    }
  },
  created () {
    localStorage.setItem('winHeight', document.body.scrollHeight)
    const _this = this
    document.onkeydown = function (e) {
      // console.log('nav', e.keyCode)
      if (e.keyCode === 144) {
        return
      }
      switch (e.keyCode) {
        case 0:
          _this.login()
          break
        case 109:
          _this.focusRecord--
          if (_this.focusRecord === 0) {
            _this.$refs.user.focus()
            return false
          } else if (_this.focusRecord === -1) {
            _this.focusRecord = 0
            return false
          }
          break
        case 107:
          _this.focusRecord++
          if (_this.focusRecord === 1) {
            _this.$refs.password.focus()
            return false
          } else if (_this.focusRecord === 2) {
            _this.focusRecord = 1
            return false
          }
          break
        case 106:
          _this.statusCheck()
          return false
          break // eslint-disable-line
        default:
          break
      }
    }
  },
  mounted () {
    this.$refs.user.focus()
  },
  methods: {
    login () {
      // let objStr9 = {
      //   amount: 200,
      //   betContext: [{'FB201807277001': ['1', '0']}, {'FB201807287002': ['1', '3']}],
      //   betType: '2x1',
      //   lotteryType: '51',
      //   multiple: 3,
      //   pot: 20,
      //   subPlayType: '51'
      // }
      // let enCode = getCode(objStr9)
      // console.log(enCode, 'encode')
      // try {
      //   latech.cotrolKeyboard(enCode, 500, 200) // eslint-disable-line
      //   // latech.cotrolKeyboard('16')
      // } catch (error) {
      //   console.log(error)
      // }
      if (this.form.userAccount === '' || this.form.password === '') {
        this.$message({
          message: '请填写完整信息!',
          type: 'warning'
        })
        return
      }
      // this.statusCheckFlag = true
      if (this.statusCheckFlag) {
        req('login', this.form).then(res => {
          if (res.code === '00000') {
            sessionStorage.setItem('token', res.data.token)
            this.$store.commit('token', res.data.token)
            let storeInfo = {
              storeAddress: res.data.storeAddress,
              storeName: res.data.storeName,
              storeType: res.data.storeType
            }
            // 店铺类型:1.集中出票点 2.散铺
            sessionStorage.setItem('storeInfo', JSON.stringify(storeInfo))
            this.$store.commit('setActiveIndex', '')
            localStorage.setItem('setActiveIndex', '')
            this.$router.push({path: '/'})
          } else {
            this.$message({
              message: res.msg,
              type: 'warning'
            })
          }
        })
          .catch(error => {
            console.log(error)
          })
      } else {
        this.$message({
          message: '请先进行状态检测',
          type: 'warning'
        })
      }
    },
    createCode (codeLength) {
      let code = ''
      let random = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
      for (let i = 0; i < codeLength; i++) {
        let index = Math.floor(Math.random() * 36)
        code += random[index]
      }
      return code
    },
    statusCheck () {
      this.QRcode = this.createCode(16)
      this.latechFlag = true
      try {
        this.printTicket(this.QRcode)
        this.readTicket()
      } catch (error) {
        console.log('打印机读票机错误', error)
      }
    },
    // 打印机
    printTicket (QRcode) {
      let printStatus = latech.printStatusFromJS() // eslint-disable-line
      if (printStatus === 0) {
        latech.printSampleBMPFromJS(QRcode) // eslint-disable-line
      } else {
        let str = `打印机异常，异常code: ${printStatus}`
        this.getTicketError(str)
      }
    },
    readTicket () {
      // 读票机初始化
      if (latech.ScannerInit() === 0) { // eslint-disable-line
        const _this = this
        // 读票机开始
        if (latech.ScannerStart() === true) { // eslint-disable-line
          this.timer = setInterval(function () {
            let flag = latech.ScanIsComplete() // eslint-disable-line
            if (flag === true) { // 判断读票机是否读完票
              let realTicketNumber = latech.ScannerGetTicketInfoFromJS() // eslint-disable-line
              //  退票
              latech.ScannerRollBackFromJS() // eslint-disable-line
              if (_this.QRcode === realTicketNumber) {
                _this.statusCheckFlag = true
              } else {
                _this.statusCheckFlag = false
                _this.$message({
                  type: 'error',
                  message: '请投入正确的设备检测码'
                })
              }
            }
          }, 200)
        } else {
          let errCode = latech.ScannerGetLastErrorCodeFromJS() // eslint-disable-line
          let str = `读票机异常，异常code: ${errCode}`
          this.getTicketError(str)
        }
      } else {
        let errCode = latech.ScannerGetLastErrorCodeFromJS() // eslint-disable-line
        let str = `读票机异常，异常code: ${errCode}`
        this.getTicketError(str)
      }
    },
    // 获取读票机错误信息
    getTicketError (str) {
      this.reload()
      this.$confirm(str, '错误', {
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
    exit () {
      try {
        latech.exitApp() // eslint-disable-line
      } catch (error) {
        console.log('退出错误', error)
      }
    }
  },
  destroyed () {
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
.login{
    width: 100%;
    height: 100%;
    .content{
        width: 100%;
        height: 100%;
        margin: 0 auto;
        background-image: url('../assets/image/login2.jpg');
        background-size:100% 100%;
        position: relative;
        font-size: 20px;
        color: #000000;
        .loginCon{
            width: 500px;
            background:transparent;
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            text-align: center;
            border-radius: 10px;
            .logo{
              width: 300px;
              margin-bottom: 10px;
            }
            .wrap{
              padding: 30px 0;
              background:#ffffff;
              border-radius: 10px;
              .form{
                text-align: center;
                .el-form-item{
                  display: inline-block;
                  .el-form-item__label{
                    font-size: 20px;
                  }
                  .el-form-item__content{
                    margin-left: 0;
                    .el-input{
                      font-size: 20px;
                      input{
                        width: 320px;
                        height: 50px;
                        padding-left: 50px;
                        background: #ffffff;
                        color: #000000;
                      }
                      &.user:before{
                        content:'';
                        display:inline-block;
                        width:25px;
                        height:25px;
                        background:url('../assets/image/user.png');
                        background-size:100% 100%;
                        position: absolute;
                        top: 0;
                        bottom: 0;
                        margin: auto;
                        margin-left:10px;
                      }
                      &.pass:before{
                        content:'';
                        display:inline-block;
                        width:20px;
                        height:25px;
                        background:url('../assets/image/pass.png');
                        background-size:100% 100%;
                        position: absolute;
                        top: 0;
                        bottom: 0;
                        margin: auto;
                        margin-left:10px;
                      }
                    }
                  }
                }
                .code{
                  width: 320px;
                  display: inline-block;
                  overflow: hidden;
                  .el-form-item{
                    width: 200px;
                    float: left;
                    margin-bottom: 0;
                    .left{
                      input{
                        width: 200px;
                        padding-left: 10px;
                      }
                    }
                  }
                  .right{
                    float: right;
                    width: 100px;
                    height: 50px;
                    line-height: 50px;
                    background: #409EFF;
                    color: #fff;
                    letter-spacing: 6px;
                    cursor:pointer;
                  }
                }
              }
              .btnbox{
                width: 420px;
                overflow: hidden;
                margin: 0 auto 20px;
                .leftBtn{
                  float: left;
                  font-size: 20px;
                }
                .rightBtn{
                  float: right;
                  line-height: 46px;
                  .success{
                    color: #67c23a;
                  }
                  .danger{
                    color: #f56c6c;
                  }
                  i{
                    margin-left: 8px;
                  }
                }
              }
              .btn{
                width: 420px;
                height: 60px;
                font-size: 22px;
              }
            }
        }
        .mimi{
          position: absolute;
          left: 10px;
          top: 120px;
          width: 10px;
          height: 10px;
          background: #aa30ff;
          outline: none;
          border: 1px solid #9f3eff;
          border-radius: 5px;
        }
    }
}
</style>
