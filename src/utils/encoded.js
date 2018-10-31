
// 过关方式
const passMode = {
  'single': '01',
  '2x1': '02',
  '3x1': '02',
  '3x3': '03',
  '3x4': '04',
  '4x1': '02',
  '4x4': '03',
  '4x5': '04',
  '4x6': '05',
  '4x11': '07',
  '5x1': '02',
  '5x5': '03',
  '5x6': '04',
  '5x10': '05',
  '5x16': '07',
  '5x20': '08',
  '5x26': '10',
  '6x1': '02',
  '6x6': '03',
  '6x7': '04',
  '6x15': '05',
  '6x20': '06',
  '6x22': '08',
  '6x35': '09',
  '6x42': '11',
  '6x50': '12',
  '6x57': '14',
  '7x1': '02',
  '7x7': '03',
  '7x8': '04',
  '7x21': '05',
  '7x35': '06',
  '7x120': '07',
  '8x1': '02',
  '8x8': '03',
  '8x9': '04',
  '8x28': '05',
  '8x56': '06',
  '8x70': '07',
  '8x247': '08'
}

// const freeMode = {

// }

let enCode = {
  F1: '05 ',
  F2: '03 ',
  F3: '01 ',
  F5: '04 ',
  F8: '15 ',
  0: '16 ',
  1: '07 ',
  2: '0D ',
  3: '10 ',
  4: '09 ',
  5: '0C ',
  6: '12 ',
  7: '0E ',
  8: '0B ',
  9: '11 ',
  '退格': '0F ',
  '兑奖': '06 ',
  'Enter': '13 ',
  'ESC': '14 '
}
const specialCode = {
  '3A': '90',
  '1A': '99',
  '0A': '09'
}
const typeCode = {
  51: '1',
  52: '2',
  53: '3',
  54: '4',
  56: '6',
  61: '1',
  62: '2',
  63: '3',
  64: '4'
}
function getSingleChar (str) {
  return String(str).split('')
}
// 数字型转换
function numberCode (data) {
  let result = ''
  getSingleChar(data).map(val => { result += enCode[val] })
  return result
}

function getCode (dataObj) {
  let resultCode = ''
  // 彩种
  resultCode += numberCode(dataObj.lotteryType)
  resultCode += numberCode(dataObj.subPlayType)

  // 投注项
  if (dataObj.subPlayType !== '59' && dataObj.subPlayType !== '69') {
    JSON.parse(dataObj.betContext).map(val => {
      for (const key in val) {
        resultCode += numberCode(key.substr(10, 4))
        val[key].map((item, index) => {
          if (dataObj.subPlayType === '63' && item.substr(0, 1) === '5') {
            resultCode += numberCode('1' + item.substr(1, 1))
          } else if (dataObj.subPlayType === '61' && item === '0') {
            resultCode += numberCode('2')
          } else if (item !== '3A' && item !== '1A' && item !== '0A') {
            resultCode += numberCode(item)
          } else {
            resultCode += numberCode(specialCode[item])
          }
        })
        resultCode += enCode['F1']
      }
    })
  } else {
    JSON.parse(dataObj.betContext).map(val => {
      for (const key in val) {
        resultCode += numberCode(key.substr(10, 4))
        for (const key1 in val[key]) {
          resultCode += enCode[typeCode[key1]]
          val[key][key1].map(item => {
            if (key1 === '63' && item.substr(0, 1) === '5') {
              resultCode += numberCode('1' + item.substr(1, 1))
            } else if (key1 === '61' && item === '0') {
              resultCode += numberCode('2')
            } else if (item !== '3A' && item !== '1A' && item !== '0A') {
              resultCode += numberCode(item)
            } else {
              resultCode += numberCode(specialCode[item])
            }
          })
        }
        resultCode += enCode['F1']
      }
    })
  }
  // 倍数
  resultCode += enCode['F5'] + numberCode(dataObj.multiple) + enCode['Enter']
  // 过关方式
  if (dataObj.betType !== 'single') {
    if (dataObj.betType.includes('x')) { // M串N
      resultCode += enCode['F2'] + numberCode(passMode[dataObj.betType]) + enCode['Enter']
    } else { // 自由过关
      resultCode += enCode['F8']
      JSON.parse(dataObj.betType).map(val => {
        resultCode += enCode[val]
      })
      resultCode += enCode['F8'] + enCode['Enter']
    }
  } else { // 单关
    resultCode += enCode['F2'] + numberCode(passMode[dataObj.betType]) + enCode['Enter']
  }

  return dataObj.amount >= 200
    // ? enCode['ESC'] + enCode['ESC'] + enCode['ESC'] + enCode['ESC'] + resultCode + enCode['Enter']
    ? enCode['ESC'] + enCode['ESC'] + enCode['ESC'] + enCode['ESC'] + resultCode + enCode['Enter'] + enCode['ESC'] + enCode['ESC']
    : enCode['ESC'] + enCode['ESC'] + resultCode
}

export default getCode
