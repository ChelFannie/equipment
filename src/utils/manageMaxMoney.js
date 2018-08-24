import {getCalculate, hunheComputeHunhe} from './fastCombine'
import changeBetContext from './changeBetContext'

class manageMaxMoney {
/**
 * 四舍五入六成双算法
 * @param {Number} num - 要处理的数字
 * @param {Number} decimalPlaces - 保留的小数位
 */
  static evenRound (num, decimalPlaces) {
    let d = decimalPlaces || 0
    let m = Math.pow(10, d)
    let n = +(d ? num * m : num).toFixed(8) // Avoid rounding errors
    let i = Math.floor(n)
    let f = n - i
    let e = 1e-8 // Allow for rounding errors in f
    let r = (f > 0.5 - e && f < 0.5 + e) ? ((i % 2 === 0) ? i : i + 1) : Math.round(n)
    return d ? r / m : r
  }

  /**
   * 自动补零
   * @param {Number} maxMoney - 要补零的数字
   */
  static returnFloat (maxMoney) {
    let floatMaxMoney = 0
    let maxMoneyString = ''
    if (Object.prototype.toString.call(maxMoney) === '[object Number]') {
      maxMoneyString = maxMoney.toString()
    } else {
      maxMoneyString = maxMoney
    }
    if (maxMoneyString.indexOf('.') > -1 && maxMoneyString.split('.').length) {
      if (maxMoneyString.split('.')[1].length === 1) {
        floatMaxMoney = `${maxMoney}0`
      } else {
        floatMaxMoney = maxMoney
      }
    } else if (maxMoneyString.indexOf('.') === -1) {
      floatMaxMoney = `${maxMoney}.00`
    }
    return floatMaxMoney
  }

  /**
   * 得到过关方式最高奖金
   * @param {Object} calcData - 必须传入的参数
   * @param {Boolean} editOddsFlag - 是否是修改赔率,奖金更新计算
   */
  static getPassMaxMoney (calcData, editOddsFlag) {
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
        if (editOddsFlag) { // 点击修改
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
    if (Object.prototype.toString.call(calcData.orderInfo.betType) === '[object String]') { // M*N
      // console.log('M*N')
      betTypeArr = [calcData.orderInfo.betType]
    } else { // 自由过关
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
}

export default manageMaxMoney
