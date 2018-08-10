<template>
  <div class="nav">
    <div class="top">
        <div class="top-left">
            <p>店铺名：{{storeInfo.storeName}}</p>
            <p>地址：{{storeInfo.storeAddress}}</p>
        </div>
        <div class="top-right">
            <el-menu
                :default-active="activeIndex"
                class="el-menu-vertical"
                @open="handleOpen"
                @close="handleClose"
                @select="handleSelect">
                <el-menu-item index="/order-query/order-List" class="flex-item" :disabled="$store.state.menuDisabled">
                    <span class="icon-box">
                        <i class="el-icon-tickets i-color"></i>
                        <span slot="title" class="icon-name">获取订单</span>
                    </span>
                </el-menu-item>
                <el-menu-item index="/order-query/account-order" class="flex-item" :disabled="!$store.state.menuDisabled ||$store.state.activeIndex==='/order-query/examine-order'">
                    <span class="icon-box">
                        <i class="el-icon-printer  i-color"></i>
                        <span slot="title" class="icon-name">订单结算</span>
                    </span>
                </el-menu-item>
                <button class="flex-item loginOut" v-if="$store.state.activeIndex==='/order-query/examine-order'">
                    <span class="icon-box" @click="quit">
                        <i class="el-icon-upload2  i-color"></i>
                        <span class="icon-name">登出</span>
                    </span>
                </button>
            </el-menu>
        </div>
    </div>
    <div class="content">
        <div class="content1">
            <router-view></router-view>
        </div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      activeIndex: this.$store.state.activeIndex,
      storeInfo: {}
    }
  },
  created () {
    if (!this.activeIndex) {
    //   this.$router.push('/')
      this.$store.commit('setMenuDisabled', false)
      localStorage.setItem('setMenuDisabled', false)
    }
    this.storeInfo = JSON.parse(sessionStorage.getItem('storeInfo'))
  },
  mounted () {
  },
  methods: {
    handleSelect (index, indexPath) {
      this.activeIndex = index
      this.$store.commit('setActiveIndex', index)
      this.$router.push({path: index})
    },
    handleOpen (val) {
    },
    handleClose () {

    },
    quit () {
      let lastToken = sessionStorage.getItem('lastToken')
      sessionStorage.setItem('token', lastToken)
      this.$store.commit('token', lastToken)
      this.$router.push({path: '/'})
    }
  }
}
</script>
<style lang="less" scoped>
.nav{
    width: 100%;
    height: 100%;
    overflow: hidden;
    .top{
        width: 100%;
        height: 90px;
        position: relative;
        z-index: 999;
        box-sizing: border-box;
        background-color: #4dafdb;
        box-shadow: 0 2px 10px rgba(39,54,78,.2);
        display: flex;
        .top-left{
            display: inline-block;
            font-size: 16px;
            color: #fff;
            background: #228fbd;
            padding: 15px 30px;
            position: relative;
            p{
                margin: 0;
                line-height: 30px;
                vertical-align: middle;
            }
        }
        .top-left::after{
            display: inline-block;
            content: "";
            width: 15px;
            height: 90px;
            background:#2d97c5;
            position: absolute;
            right: 0;
            top: 0;
        }
        .top-right{
            flex: 1;
            padding: 0 30px;
            .el-menu-vertical{
                display: flex;
                flex-flow: row nowrap;
                background: transparent;
                .flex-item{
                    width: 110px;
                    height: 90px;
                    line-height: 90px;
                    text-align: center;
                    padding: 0!important;
                    .icon-box{
                        display: inline-block;
                        line-height: normal;
                        vertical-align: middle;
                        i{
                            display: block;
                            text-align: center;
                            width: 100%;
                            font-size: 32px;
                            margin-bottom: 15px;
                            color: #ffffff;
                        }
                        .icon-name{
                            display: inline-block;
                            font-size: 16px;
                            color: #fff;
                        }
                    }
                    &.loginOut{
                        border: none;
                        outline: none;
                        background: #4dafdb;
                    }
                }
            }
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
            overflow-x: hidden;
            overflow-y: auto;
            padding: 20px;
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
    .el-menu-item.is-active{
        background-color: rgba(255,  255, 255, .5) !important;
        // color: #333333 !important;
        // i{
        //     color: #909399!important;
        // }
    }
}
</style>
