<template>
  <div class="login">
      <div class="content">
          <div class="loginCon">
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
                <span class="deviceSelect">设备选择:</span>
                <div class="rightBtn1">
                  <el-radio v-model="radio" :disabled="disabledFlag" @change="radioChange(0)" label="0" class="el-dialog1" border size="medium">打印机</el-radio>
                  <el-radio v-model="radio" :disabled="disabledFlag" @change="radioChange(1)" label="1" class="el-dialog1" border size="medium">机械键盘</el-radio>
                </div>
              </div>
              <div class="btnbox" v-if="radio==0">
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
      LAFlag: false,
      statusCheckFlag: false,
      focusRecord: 0,
      radio: '3',
      disabledFlag: true,
      serialPortStatus: -10,
      printStatus: -10
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
    try {
      this.serialPortStatus = LA.getDeviceNumberKeyboadrd() // eslint-disable-line
      this.printStatus = LA.printStatusFromJS() // eslint-disable-line
      if (this.serialPortStatus === '0' && this.printStatus === 0) {
        this.radio = '2'
        this.disabledFlag = false
      } else if (this.serialPortStatus === '0') {
        this.radio = '1'
        this.statusCheckFlag = true
        this.$store.commit('setDeviceStatus', 1)
      } else if (this.printStatus === 0) {
        this.radio = '0'
        this.statusCheckFlag = false
        this.$store.commit('setDeviceStatus', 0)
      } else {
        this.disabledFlag = false
      }
    } catch (error) {
      console.log('设备选择错误', error)
    }
  },
  methods: {
    login () {
      // let objStr9 = {
      //   amount: 200,
      //   betContext: JSON.stringify([{'FB201807277001': ['1', '0']}, {'FB201807287002': ['1', '3']}]),
      //   betType: '2x1',
      //   lotteryType: '51',
      //   multiple: 3,
      //   pot: 20,
      //   subPlayType: '51'
      // }
      // let enCode = getCode(objStr9)
      // console.log(enCode, 'encode')
      // try {
      //   LA.cotrolKeyboard(enCode, 500, 200) // eslint-disable-line
      //   // LA.cotrolKeyboard('16')
      // } catch (error) {
      //   console.log(error)
      // }
      if (this.form.userAccount === '' || this.form.password === '') {
        this.$message({message: '请填写完整信息!', type: 'warning'})
        return
      }
      if (this.radio === '2') {
        this.$message({message: '请选择设备!', type: 'warning'})
        return
      }
      if (this.radio === '3') {
        this.$message({message: '请选择设备!', type: 'warning'})
        return
      }
      if (this.radio !== '0' || this.radio !== '1') {
        try {
          let serialPortStatus = LA.getDeviceNumberKeyboadrd() // eslint-disable-line
          let printStatus = LA.printStatusFromJS() // eslint-disable-line
          if (serialPortStatus !== '0' && printStatus !== 0) {
            this.disabledFlag = false
            this.statusCheckFlag = false
            this.$message({message: '请接入设备!', type: 'warning'})
            return
          } else if (serialPortStatus === '0' && printStatus !== 0) {
            this.radio = '1'
            this.statusCheckFlag = true
            this.$store.commit('setDeviceStatus', 1)
          } else if (serialPortStatus !== '0' && printStatus === 0) {
            this.radio = '0'
            this.$store.commit('setDeviceStatus', 0)
          }
        } catch (error) {
          console.log('设备选择错误', error)
        }
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
      this.LAFlag = true
      try {
        this.printTicket(this.QRcode)
        this.readTicket()
      } catch (error) {
        console.log('打印机读票机错误', error)
      }
    },
    // 打印机
    printTicket (QRcode) {
      let printStatus = LA.printStatusFromJS() // eslint-disable-line
      if (printStatus === 0) {
        LA.printSampleBMPFromJS(QRcode) // eslint-disable-line
      } else {
        let str = `打印机异常，异常code: ${printStatus}`
        this.getTicketError(str)
      }
    },
    readTicket () {
      // 读票机初始化
      if (LA.ScannerInit() === 0) { // eslint-disable-line
        const _this = this
        // 读票机开始
        if (LA.ScannerStart() === true) { // eslint-disable-line
          this.timer = setInterval(function () {
            let flag = LA.ScanIsComplete() // eslint-disable-line
            if (flag === true) { // 判断读票机是否读完票
              let realTicketNumber = LA.ScannerGetTicketInfoFromJS() // eslint-disable-line
              //  退票
              LA.ScannerRollBackFromJS() // eslint-disable-line
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
          let errCode = LA.ScannerGetLastErrorCodeFromJS() // eslint-disable-line
          let str = `读票机异常，异常code: ${errCode}`
          this.getTicketError(str)
        }
      } else {
        let errCode = LA.ScannerGetLastErrorCodeFromJS() // eslint-disable-line
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
        LA.exitApp() // eslint-disable-line
      } catch (error) {
        console.log('退出错误', error)
      }
    },
    radioChange (val) {
      if (val) {
        // if (this.serialPortStatus === '0') {
        this.statusCheckFlag = true
        this.$store.commit('setDeviceStatus', 1)
        // }
      } else {
        this.statusCheckFlag = false
        this.$store.commit('setDeviceStatus', 0)
      }
    }
  },
  destroyed () {
    try {
      clearInterval(this.timer)
      this.LAFlag && LA.ScannerStopFromJS() // eslint-disable-line
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
                margin-top: 20px;
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
                .deviceSelect{
                  font-size: 20px;
                  color: #606266;
                  float: left;
                  margin-left: 10px;
                  line-height: 45px;
                }
                .rightBtn1{
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
    .el-radio--medium.is-bordered{
      padding: 10px 10px 0 10px;
    }
    .el-radio.is-bordered{
      border: 2px solid #dcdfe6;
    }
    // .el-radio__input.is-disabled .el-radio__inner, .el-radio__input.is-disabled.is-checked .el-radio__inner{
    //   background-color: none;
    //   border-color: #409EFF;
    // }
    .el-radio__input.is-checked .el-radio__inner {
      border-color: #409EFF;
      background: #409EFF;
    }
}
.el-dialog1{ -webkit-backface-visibility: hidden; }
</style>
