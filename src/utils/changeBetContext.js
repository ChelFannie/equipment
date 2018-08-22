import {getCalculate, hunheComputeHunhe} from '../utils/fastCombine'
class changeBetContext {
  // 转换彩种
  static lotteryType (val) {
    let lotteryType = ''
    switch (val) {
      case '51':
        lotteryType = '足球'
        break
      case '61':
        lotteryType = '篮球'
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

  // 转换彩种(转为文字)
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

  // 转换彩种(转为type)
  static subPlayTypeToType (val) {
    let type = ''
    switch (val) {
      case '51':
        type = 'winFlatLoss'
        break
      case '56':
        type = 'letwinFlatLoss'
        break
      case '52':
        type = 'score'
        break
      case '53':
        type = 'goals'
        break
      case '54':
        type = 'halfFull'
        break
      case '61':
        type = 'letWinLoss'
        break
      case '62':
        type = 'winLoss'
        break
      case '63':
        type = 'victoryDifference'
        break
      case '64':
        type = 'sizePoints'
        break
      default:
        break
    }
    return type
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
        // settleStatus = '审核中'
        settleStatus = '待审核'
        break
      case 3:
        settleStatus = '审核通过'
        break
      case 5:
        settleStatus = '审核成功'
        break
      default:
        break
    }
    return settleStatus
  }

  // 得到单关最高奖金
  static getSingleMaxMoney (obj, multiple) {
    let maxMoney = 0
    obj.map(element => {
      Object.keys(element).map(matchUniqueId => {
        let singleMax = 0
        element[matchUniqueId].map(ele => {
          let numVal = 0
          for (let oddskey in ele) {
            numVal = JSON.parse(ele[oddskey])
            singleMax = numVal > singleMax ? numVal : singleMax
          }
        })
        // maxMoney += singleMax * multiple * 2
        maxMoney += singleMax * 2
      })
    })
    // return maxMoney
    maxMoney = changeBetContext.evenRound(changeBetContext.evenRound(maxMoney, 2) * multiple, 2)
    return maxMoney
  }

  // 得到过关方式最高奖金
  static getPassMaxMoney (calcData, eddOddsFlag) {
    // console.log(calcData)
    let obj = {
      lotteryType: calcData.orderInfo.lotteryType,
      subPlayType: calcData.orderInfo.subPlayType,
      type: 'pass'
    }
    let selectData = calcData.betContextList
    selectData.map(item => {
      item.selectData = item.betItemsObj
      item.matchTimes = item.matchUniqueId.substring(item.matchUniqueId.length - 3)
      if (calcData.orderInfo.subPlayType === '59' || calcData.orderInfo.subPlayType === '69') {
        item.type = changeBetContext.subPlayTypeToType(item.subPlayType)
      }
      item.selectData.map(ele => {
        // if (ele.key) { // 点击修改
        if (eddOddsFlag) { // 点击修改
          ele.val = ele.odds
        } else { // 第一次点击
          for (let keys in ele) {
            ele.val = ele[keys]
            ele.key = changeBetContext.bet(item.subPlayType, keys)
          }
        }
      })
    })
    obj.selectData = selectData
    let betTypeArr = []
    if (Object.prototype.toString.call(calcData.orderInfo.betType) === '[object String]') {
      // console.log('M*N')
      betTypeArr = [calcData.orderInfo.betType]
    } else {
      // console.log('自由过关')
      let betType = JSON.parse(calcData.orderInfo.betType)
      betType.map(item => {
        betTypeArr.push(`${item}x1`)
      })
    }
    let dataInfo = {}
    if (calcData.orderInfo.subPlayType === '59' || calcData.orderInfo.subPlayType === '69') {
      dataInfo = hunheComputeHunhe(obj, betTypeArr)
    } else {
      // console.log(obj, 'obj')
      // console.log(betTypeArr, 'betTypeArr')
      dataInfo = getCalculate(obj, betTypeArr)
    }
    console.log(dataInfo)
    // 注数
    // let zhushu = dataInfo.zhu
    // 投注金额
    // maxMoney = zhushu * calcData.orderInfo.multiple * 2
    return dataInfo
  }

  // 四舌五入六成双算法
  static evenRound (num, decimalPlaces) {
    let d = decimalPlaces || 0
    let m = Math.pow(10, d)
    let n = +(d ? num * m : num).toFixed(8) // Avoid rounding errors
    let i = Math.floor(n)
    let f = n - i
    // let i = Math.floor(n),
    //   f = n - i
    let e = 1e-8 // Allow for rounding errors in f
    let r = (f > 0.5 - e && f < 0.5 + e) ? ((i % 2 === 0) ? i : i + 1) : Math.round(n)
    return d ? r / m : r
  }

  // 自动补零
  static returnFloat (maxMoney) {
    let floatMaxMoney = 0
    if (maxMoney.toString().split('.').length) {
      if (maxMoney.toString().split('.')[1].length === 1) {
        floatMaxMoney = `${maxMoney}0`
      } else {
        floatMaxMoney = maxMoney
      }
    } else if (maxMoney.indexof('.') === -1) {
      console.log(2222222)
      floatMaxMoney = `${maxMoney}.00`
    }
    return floatMaxMoney
  }
}

export default changeBetContext
