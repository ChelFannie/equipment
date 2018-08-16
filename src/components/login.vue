<template>
  <div class="login">
      <div class="content">
          <div class="loginCon">
            <!-- <p class="title">设备界面登录</p> -->
            <img class="logo" src="../assets/image/logo.png" alt="">
            <el-form ref="form" :model="form" label-width="100px" class="form">
                <el-form-item label="用户名：">
                    <el-input class="user" v-model="form.userAccount" placeholder="用户名"></el-input>
                </el-form-item>
                <el-form-item  label="密   码：">
                    <el-input class="pass" type="password" v-model="form.password" placeholder="密码"></el-input>
                </el-form-item>
                <!-- <div class="code">
                  <el-form-item>
                      <el-input class="left" v-model="inputCode" placeholder="验证码"></el-input>
                  </el-form-item>
                  <div @click="createCode" class="right">{{validateCode}}</div>
                </div> -->
            </el-form>
            <el-button type="primary" size="medium" class="btn" @click="login">登录</el-button>
          </div>
      </div>
  </div>
</template>
<script>
import req from '../api/login/login.js'
export default {
  data () {
    return {
      form: {
        userAccount: '',
        password: ''
      },
      validateCode: '',
      inputCode: '',
      validateFlag: false
    }
  },
  created () {
    this.createCode()
    localStorage.setItem('winHeight', document.body.scrollHeight)
  },
  methods: {
    login () {
      if (this.form.userAccount === '' || this.form.password === '') {
        this.$message({
          message: '请填写完整信息!',
          type: 'warning'
        })
        return
      }
      // this.validate()
      // if (this.validateFlag) {
      req('login', this.form).then(res => {
        if (res.code === '00000') {
          sessionStorage.setItem('token', res.data.token)
          this.$store.commit('token', res.data.token)
          let storeInfo = {
            storeAddress: res.data.storeAddress,
            storeName: res.data.storeName
          }
          sessionStorage.setItem('storeInfo', JSON.stringify(storeInfo))
          this.$store.commit('setActiveIndex', '')
          localStorage.setItem('setActiveIndex', '')
          // let setMenuDisabled = {
          //   orderList: false,
          //   accountOrder: true,
          //   queryOrder: true
          // }
          // this.$store.commit('setMenuDisabled', setMenuDisabled)
          // localStorage.setItem('setMenuDisabled', JSON.stringify(setMenuDisabled))
          this.$router.push({path: '/'})
        } else {
          this.$message({
            message: res.msg,
            type: 'warning'
          })
          // 刷新验证码
          this.createCode()
          this.inputCode = ''
        }
      })
      // }
    },
    createCode () {
      let code = ''
      let codeLength = 4
      let random = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
      for (let i = 0; i < codeLength; i++) {
        let index = Math.floor(Math.random() * 36)
        code += random[index]
      }
      this.validateCode = code
    },
    validate () {
      this.inputCode = this.inputCode.toUpperCase()
      if (this.inputCode.length <= 0) {
        this.$message({
          message: '请输入验证码！',
          type: 'warning'
        })
      } else if (this.inputCode !== this.validateCode) {
        this.$message({
          message: '验证码输入错误！',
          type: 'warning'
        })
        // 刷新验证码
        this.createCode()
        // 清空文本框
        this.inputCode = ''
      } else {
        this.validateFlag = true
      }
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
            height: 300px;
            background:#ffffff;
            position: absolute;
            left: 0;
            right: 0;
            top: 70px;
            bottom: 0;
            margin: auto;
            text-align: center;
            border-radius: 10px;
            .logo{
              width: 300px;
              position: absolute;
              left: 0;
              right: 0;
              top: -150px;
              margin: auto;
            }
            .form{
              margin: 40px auto 20px;
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
            .btn{
              width: 200px;
              height: 60px;
              font-size: 22px;
            }
        }
    }
}
</style>
