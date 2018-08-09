class changeBetContext {
  // 转换彩种
  static lotteryType (val) {
    let lotteryType = ''
    switch (val) {
      case '51':
        lotteryType = '竞彩足球'
        break
      case '61':
        lotteryType = '竞彩篮球'
        break
      case '01':
        lotteryType = '超级大乐透'
        break
      case '04':
        lotteryType = '七星彩'
        break
      case '05':
        lotteryType = ' 排列五'
        break
      case '03':
        lotteryType = '排列三'
        break
      default:
        break
    }
    return lotteryType
  }

  // 转换彩种
  static subPlayType (val) {
    let subPlayType = ''
    switch (val) {
      case '51':
        subPlayType = '胜平负'
        break
      case '52':
        subPlayType = '比分'
        break
      case '53':
        subPlayType = '总进球'
        break
      case '54':
        subPlayType = '半全场'
        break
      case '56':
        subPlayType = '让球胜平负'
        break
      case '59':
        subPlayType = '混合过关'
        break
      case '61':
        subPlayType = '让分胜负'
        break
      case '62':
        subPlayType = '胜负'
        break
      case '63':
        subPlayType = '胜分差'
        break
      case '64':
        subPlayType = '大小分'
        break
      case '69':
        subPlayType = '混合过关'
        break
      default:
        break
    }
    return subPlayType
  }

  // 转换投注项
  static bet (subPlayType, val) {
    let bet = ''
    switch (subPlayType) {
      case '51':
      case '56':
        switch (val) {
          case '3':
            bet = '主胜'
            break
          case '1':
            bet = '平'
            break
          case '0':
            bet = '主负'
            break
          default:
            break
        }
        break
      case '52':
        switch (val) {
          case '3A':
            bet = '胜其他'
            break
          case '1A':
            bet = '平其他'
            break
          case '0A':
            bet = '负其他'
            break
          default:
            let arr = val.split('')
            bet = arr[0] + ':' + arr[1]
            break
        }
        break
      case '53':
        // subPlayType = '总进球'
        switch (val) {
          case '0':
            bet = '0球'
            break
          case '1':
            bet = '1球'
            break
          case '2':
            bet = '2球'
            break
          case '3':
            bet = '3球'
            break
          case '4':
            bet = '4球'
            break
          case '5':
            bet = '5球'
            break
          case '6':
            bet = '6球'
            break
          default:
            bet = '7+球'
            break
        }
        break
      case '54':
        // subPlayType = '半全场'
        switch (val) {
          case '33':
            bet = '胜胜'
            break
          case '31':
            bet = '胜平'
            break
          case '30':
            bet = '胜负'
            break
          case '13':
            bet = '平胜'
            break
          case '11':
            bet = '平平'
            break
          case '10':
            bet = '平负'
            break
          case '03':
            bet = '负胜'
            break
          case '01':
            bet = '负平'
            break
          case '00':
            bet = '负负'
            break
          default:
            break
        }
        break
      // case '59':
      //   subPlayType = '混合过关'
      //   break
      case '61':
        // subPlayType = '让分胜负'
        switch (val) {
          case '0':
            bet = '让分主负'
            break
          case '1':
            bet = '让分主胜'
            break
          default:
            break
        }
        break
      case '62':
        // subPlayType = '胜负'
        switch (val) {
          case '1':
            bet = '主胜'
            break
          case '2':
            bet = '主负'
            break
          default:
            break
        }
        break
      case '63':
        // subPlayType = '胜分差'
        switch (val) {
          case '01':
            bet = '客胜1-5'
            break
          case '02':
            bet = '客胜6-10'
            break
          case '03':
            bet = '客胜11-15'
            break
          case '04':
            bet = '客胜16-20'
            break
          case '05':
            bet = '客胜21-25'
            break
          case '06':
            bet = '客胜26+'
            break
          case '51':
            bet = '主胜1-5'
            break
          case '52':
            bet = '主胜6-10'
            break
          case '53':
            bet = '主胜11-15'
            break
          case '54':
            bet = '主胜16-20'
            break
          case '55':
            bet = '主胜21-25'
            break
          case '56':
            bet = '主胜26+'
            break
          default:
            break
        }
        break
      case '64':
        // subPlayType = '大小分'
        switch (val) {
          case '1':
            bet = '大'
            break
          case '2':
            bet = '小'
            break
          default:
            break
        }
        break
      // case '69':
      //   subPlayType = '混合过关'
      //   break
      default:
        break
    }
    return bet
  }

  // 转换订单打印状态
  static printFlag (val) {
    let printFlag = ''
    switch (val) {
      // case 0:
      //   printFlag = '未打印'
      //   break
      // case 1:
      //   printFlag = '已下发'
      //   break
      // case 2:
      //   printFlag = '打印成功'
      //   break
      // case 3:
      //   printFlag = '打印失败'
      //   break
      case 1:
        printFlag = '未出票'
        break
      case 2:
        printFlag = '已出票'
        break
      case 3:
        printFlag = '出票失败'
        break
      default:
        break
    }
    return printFlag
  }

  // 转换订单支付状态
  static payFlag (val) {
    let payFlag = ''
    switch (val) {
      case 0:
        payFlag = '未支付'
        break
      case 1:
        payFlag = '支付确认中'
        break
      case 2:
        payFlag = '支付成功'
        break
      case 3:
        payFlag = '支付失败'
        break
      default:
        break
    }
    return payFlag
  }

  // 转换赛事
  static changeMatchUniqueId (val) {
    let str = val.substring(val.length - 4)
    let orderNum = ''
    switch (str[0]) {
      case '1':
        orderNum = `周一${str.substring(1)}`
        break
      case '2':
        orderNum = `周二${str.substring(1)}`
        break
      case '3':
        orderNum = `周三${str.substring(1)}`
        break
      case '4':
        orderNum = `周四${str.substring(1)}`
        break
      case '5':
        orderNum = `周五${str.substring(1)}`
        break
      case '6':
        orderNum = `周六${str.substring(1)}`
        break
      case '7':
        orderNum = `周日${str.substring(1)}`
        break
      default:
        break
    }
    return orderNum
  }

  // 转换订单支付状态
  static settleStatus (val) {
    let settleStatus = ''
    switch (val) {
      case 0:
        settleStatus = '未可结算'
        break
      case 1:
        settleStatus = '可结算'
        break
      case 2:
        settleStatus = '审核中'
        break
      case 3:
        settleStatus = '审核通过'
        break
      default:
        break
    }
    return settleStatus
  }
}

export default changeBetContext
