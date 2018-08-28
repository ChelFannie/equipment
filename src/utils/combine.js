// 周几固定数据
const dateObj = {
    '1': '1000',
    '2': '0100',
    '3': '0010',
    '4': '0001',
    '5': '1000',
    '6': '0100',
    '7': '0010'
}
const specialDate = {
    '1': '周一',
    '2': '周二',
    '3': '周三',
    '4': '周四',
    '5': '周五',
    '6': '周六',
    '7': '周日'
}
const numD = [500, 400, 200, 100, 50, 40, 20, 10, 5, 4, 2, 1]
const multipleD = [50, 40, 30, 20, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1]
// 数字在字符串的位置
const numOBJ = {
    '1': 1,
    '2': 2,
    '4': 3,
    '5': 4,
    '10': 5,
    '20': 6,
    '40': 7,
    '50': 8,
    '100': 9,
    '200': 10,
    '400': 11,
    '500': 12
}
// 倍数在字符串的位置
const multipleOBJ = {
    '1': 1,
    '2': 2,
    '3': 3,
    '4': 4,
    '5': 5,
    '6': 6,
    '7': 7,
    '8': 8,
    '9': 9,
    '10': 10,
    '20': 11,
    '30': 12,
    '40': 13,
    '50': 14
}
// 篮球大小分
const sizeOBJB = {
    "1": '1000',
    "2": '0100',
    "1,2": '1100'
}
// 篮球让分胜负
const letOBJB = {
    "0": '1000',
    "1": '0100',
    "0,1": '1100'
}
// 篮球胜负
const winOBJB = {
    "1": '0100',
    "2": '1000',
    "1,2": '1100'
}
// 篮球胜负差
const badOBJB = {
    "01": 1,
    "02": 2,
    "03": 5,
    "04": 6,
    "05": 9,
    "06": 10,
    "51": 3,
    "52": 4,
    "53": 7,
    "54": 8,
    "55": 11,
    "56": 12
}
// 足球胜平负/让球胜平负
const winOBJF = {
    "0": '0010',
    "1": '0100',
    "3": '1000',
    "0,1": '0110',
    "0,3": '1010',
    "1,3": '1100',
    "0,1,3": '1110',
}
// 足球总进球
const goalOBJ = {
    '0': 1,
    '1': 2,
    '2': 3,
    '3': 4,
    '4': 5,
    '5': 6,
    '6': 7,
    '7': 8
}
// 足球半全场
const floatOBJ = {
    '33': 1,
    '31': 2,
    '30': 3,
    '13': 5,
    '11': 6,
    '10': 7,
    '03': 9,
    '01': 10,
    '00': 11
}
// 足球比分
const scoreOBJ = {
    '10': 1,
    '42': 2,
    '24': 3,
    '01': 4,
    '20': 5,
    '50': 6,
    '05': 7,
    '02': 8,
    '21': 9,
    '51': 10,
    '15': 11,
    '12': 12,
    '30': 13,
    '52': 14,
    '25': 15,
    '03': 16,
    '31': 17,
    '3A': 18,
    '0A': 19,
    '13': 20,
    '32': 21,
    '00': 22,
    '33': 23,
    '23': 24,
    '40': 25,
    '11': 26,
    '1A': 27,
    '04': 28,
    '41': 29,
    '22': 30,
    '14': 32
}

const branchObjB = {
    '01': '1-5',
    '02': '6-10',
    '03': '11-15',
    '04': '16-20',
    '05': '21-25',
    '06': '26+',
    '51': '1-5',
    '52': '6-10',
    '53': '11-15',
    '54': '16-20',
    '55': '21-25',
    '56': '26+',
}
const halfObjF = {
    '33': '胜胜',
    '31': '胜平',
    '30': '胜负',
    '13': '平胜',
    '11': '平平',
    '10': '平负',
    '03': '负胜',
    '01': '负平',
    '00': '负负'
}
const letwinObjF = {
    '0': '负',
    '1': '平',
    '3': '胜',
}

// 过关方式
const passMode = {
    '2x1': '10000000',
    '3x1': '01000000',
    '3x3': '00100000',
    '3x4': '00010000',
    '4x1': '10000000',
    '4x4': '01000000',
    '4x5': '00100000',
    '4x6': '00010000',
    '4x11': '00001000',
    '5x1': '10000000',
    '5x5': '01000000',
    '5x6': '00100000',
    '5x10': '00010000',
    '5x16': '00001000',
    '5x20': '00000100',
    '5x26': '00000010',
    '6x1': '10000000',
    '6x6': '01000000',
    '6x7': '00100000',
    '6x15': '00010000',
    '6x20': '00001000',
    '6x22': '00000100',
    '6x35': '00000010',
    '6x42': '00000001',
    '6x50': '10000000',
    '6x57': '01000000',
    '7x1': '10000000',
    '7x7': '01000000',
    '7x8': '00100000',
    '7x21': '00010000',
    '7x35': '00001000',
    '7x120': '00000100',
    '8x1': '10000000',
    '8x8': '01000000',
    '8x9': '00100000',
    '8x28': '00010000',
    '8x56': '00001000',
    '8x70': '00000100',
    '8x247': '00000010'
}
// 过关类型
const passType = {
    'single': '000010000000000' + '\n',
    'n*m1': '000000100000000' + '\n',
    'n*m2': '000000000100000' + '\n'
}
// 篮球关数
const threeStrB = '010101010110100' + '\n' + '000100000000000' + '\n'
const sixStrB = '010101010011100' + '\n' + '010100000000000' + '\n'
const eightStrB = '010101010110010' + '\n' + '001100000000000' + '\n'
// 足球关数
const threeStrF = '010101010111100' + '\n' + '000010000000000' + '\n'
const sixStrF = '010101010111100' + '\n' + '010010000000000' + '\n'
const eightStrF = '010101011100010' + '\n' + '001010000000000' + '\n'


let resultNUM = []
let specialStr = ''
let specialFlag = false

// 足球6关8关
function combineF(dataObj) {
    let dataArr = []
    // 一场赛事数据长度判断
    let len = 0
    if(dataObj.lotteryType == '51'){
        len = dataObj.betContext.length > 3 
            ? dataObj.betContext.length > 6
                ? 9
                : 11
            : 22
    } else{
        len = dataObj.betContext.length > 3 ? 10 : 14
    }
        
    for(let i=0; i< dataObj.betContext.length; i++){
        for (const key in dataObj.betContext[i]) {
            let obj = {}
            for(let i=0; i<len; i++){
                obj[i] = '0000'
            }
            // 计算周几
            let _date = parseInt(key.substring(10, 11))
            switch (true) {
                case _date > 4:
                    obj['2'] = dateObj[key.substring(10, 11)]
                    break;
                case _date < 5:
                    obj['1'] = dateObj[key.substring(10, 11)]
                    break;
                default:
                    break;
            }

            // 数字计算
            resultNUM = []
            getNUM(parseInt(key.substring(11, 14)), numD)
            let str = '000000000000'
            for(let i = 0;i<resultNUM.length; i++){
                str = str.substr(0, numOBJ[resultNUM[i]]-1) + '1' + str.substr(numOBJ[resultNUM[i]], 12)
            }
            obj['3'] = str.substr(0, 4)
            obj['4'] = str.substr(4, 4)
            obj['5'] = str.substr(8, 4)
            
            // 投注项计算
            // dataObj.betContext[i][key].sort()
            switch (dataObj.subPlayType) {
                case '51':
                    dataObj.betContext[i][key].sort()
                    obj['7'] = winOBJF[String(dataObj.betContext[i][key])]
                    break;
                case '52':
                    dataObj.betContext[i][key].sort()
                    let str = getSplitStr(dataObj.betContext[i][key], scoreOBJ, 32)
                    obj['9'] = str.substr(0, 4)
                    obj['10'] = str.substr(4, 4)
                    obj['11'] = str.substr(8, 4)
                    obj['12'] = str.substr(12, 4)
                    obj['13'] = str.substr(16, 4)
                    obj['14'] = str.substr(20, 4)
                    obj['15'] = str.substr(24, 4)
                    obj['16'] = str.substr(28, 4)
                    break;
                case '53':
                    dataObj.betContext[i][key].sort()
                    let str1 = getSplitStr(dataObj.betContext[i][key], goalOBJ, 8)
                    if(len == 11){
                        obj['9'] = str1.substr(0, 4)
                        obj['10'] = str1.substr(4, 4)
                    }else{
                        obj['20'] = str1.substr(0, 4)
                        obj['21'] = str1.substr(4, 4)
                    }
                    break;
                case '54':
                    dataObj.betContext[i][key].sort()
                    let str2 = getSplitStr(dataObj.betContext[i][key], floatOBJ, 12)
                    obj['17'] = str2.substr(0, 4)
                    obj['18'] = str2.substr(4, 4)
                    obj['19'] = str2.substr(8, 4)
                    break;
                case '56':
                    dataObj.betContext[i][key].sort()
                    obj['8'] = winOBJF[String(dataObj.betContext[i][key])]    
                    break;
                case '59':
                    for (const key1 in dataObj.betContext[i][key]) {
                        dataObj.betContext[i][key][key1].sort()
                        switch (key1) {
                            case '51':
                                obj['7'] = winOBJF[String(dataObj.betContext[i][key][key1])]
                                break;
                            case '52':
                                let str = getSplitStr(dataObj.betContext[i][key][key1], scoreOBJ, 32)
                                obj['9'] = str.substr(0, 4)
                                obj['10'] = str.substr(4, 4)
                                obj['11'] = str.substr(8, 4)
                                obj['12'] = str.substr(12, 4)
                                obj['13'] = str.substr(16, 4)
                                obj['14'] = str.substr(20, 4)
                                obj['15'] = str.substr(24, 4)
                                obj['16'] = str.substr(28, 4)
                                break;
                            case '53':
                                let str1 = getSplitStr(dataObj.betContext[i][key][key1], goalOBJ, 8)
                                if(len == 11){
                                    obj['9'] = str1.substr(0, 4)
                                    obj['10'] = str1.substr(4, 4)
                                }else{
                                    obj['20'] = str1.substr(0, 4)
                                    obj['21'] = str1.substr(4, 4)
                                } 
                                break;
                            case '54':
                                let str2 = getSplitStr(dataObj.betContext[i][key][key1], floatOBJ, 12)
                                obj['17'] = str2.substr(0, 4)
                                obj['18'] = str2.substr(4, 4)
                                obj['19'] = str2.substr(8, 4) 
                                break;
                            case '56':
                                obj['8'] = winOBJF[String(dataObj.betContext[i][key][key1])]    
                                break;
                            default:
                                break;
                        }
                    } 
                    break;
                case '61':
                    dataObj.betContext[i][key].sort()
                    obj['8'] = letOBJB[String(dataObj.betContext[i][key])]
                    break;
                case '62':
                    dataObj.betContext[i][key].sort()
                    len == 10
                        ? obj['9'] = winOBJB[String(dataObj.betContext[i][key])]
                        : obj['13'] = winOBJB[String(dataObj.betContext[i][key])]
                    break;
                case '63':
                    dataObj.betContext[i][key].sort()
                    let str3 = getSplitStr(dataObj.betContext[i][key], badOBJB, 12)
                    obj['10'] = str3.substr(0, 4)
                    obj['11'] = str3.substr(4, 4)
                    obj['12'] = str3.substr(8, 4)
                    break;
                case '64':
                    dataObj.betContext[i][key].sort()
                    obj['7'] = sizeOBJB[String(dataObj.betContext[i][key])]    
                    break;
                case '69':
                    for (const key1 in dataObj.betContext[i][key]) {
                        dataObj.betContext[i][key][key1].sort()
                        switch (key1) {
                            case '61':
                                obj['8'] = letOBJB[String(dataObj.betContext[i][key][key1])]
                                break;
                            case '62':
                                len == 10
                                    ? obj['9'] = winOBJB[String(dataObj.betContext[i][key][key1])]
                                    : obj['13'] = winOBJB[String(dataObj.betContext[i][key][key1])] 
                                break;
                            case '63':
                                let str3 = getSplitStr(dataObj.betContext[i][key][key1], badOBJB, 12)
                                obj['10'] = str3.substr(0, 4)
                                obj['11'] = str3.substr(4, 4)
                                obj['12'] = str3.substr(8, 4)
                                break;
                            case '64':
                                obj['7'] = sizeOBJB[String(dataObj.betContext[i][key][key1])]    
                                break;
                            default:
                                break;
                        }
                    } 
                    break;
                default:
                    break;
            }
            dataArr.push(obj)
        }
    }
    return dataArr.length % 3 == 0 ? dataArr : addObj(dataArr, len)
}

// 得到(半全场，总进球，胜分差)整长度字符串
function getSplitStr(arr, obj, len){
    let _arr = []
    arr.map(val => {
        _arr.push(obj[val])
    })
    let str = ''
    for(let i=0; i<len; i++){
        str += '0'
    }
    for(let i = 0;i<_arr.length; i++){
        str = str.substr(0, _arr[i]-1) + '1' + str.substr(_arr[i], len)
    }
    return str
}

// 获取篮球特殊情况的结果
function getSpecialStr(obj){
    for (const key in obj) {
        let date = specialDate[key.substring(10, 11)]
        let guest = '客胜['
        let host = '主胜['
        obj[key].map(val => {
            val.split('')[0] == '5'
                ? host += branchObjB[val] + ','
                : guest += branchObjB[val] + ','
        })
        guest = guest != '客胜[' ? guest.substr(0, guest.length-1) + ']' : ''
        host = host != '主胜[' ? host.substr(0, host.length-1) + ']' : ''
        return date + key.substring(11, 14) + guest + host
    }
}
// 获取足球特殊情况的结果
function getSpecialStrF(obj, subPlayType){
    for (const key in obj) {
        let date = specialDate[key.substring(10, 11)]
        let str = ''
        obj[key].sort()
        obj[key].map(val => {
            if(subPlayType == '54') {
                str += halfObjF[val] + ','
            }else{
                if(val == '3A') {
                    str += '胜其他,'
                } else if(val == '1A') {
                    str += '平其他,'
                } else if(val == '0A') {
                    str += '负其他,'
                } else{
                    str += val.substr(0, 1) + ':' + val.substr(1, 2) + ','
                }
            }
        })
        str = str.substr(0, str.length - 1)
        return date + key.substring(11, 14) + '[' + str + ']'
    }
}

// 增加空数据，保持一行3场赛事格式
function addObj(arr, len){
    let obj = {}
    for(let i=0; i<len; i++){
        obj[i] = '0000'
    }
    arr.push(obj)
    if(arr.length % 3 == 0){
        return arr
    }
    addObj(arr, len)
    return arr
}
// 得到各个相加的数字
function getNUM(_num, _numArr){
    for (let i = 0; i < _numArr.length; i++) {
        if (_num - _numArr[i] > 0) {
            resultNUM.push(_numArr[i])
            getNUM(_num - _numArr[i], _numArr)
            break
        }
        if(_num - _numArr[i] == 0){
            resultNUM.push(_numArr[i])
            return
        }
    }
}
// 过关方式计算
function passCombineB(dataObj){
    let obj = {
        '0': '00000000',
        '1': '00000000',
        '2': '00000000',
        '3': '00000000',
        '4': '00000000'
    }
    if(dataObj.betType != 'single') {
        specialFlag && (dataObj.betType = '3x1')
        // 过关方式
        switch (dataObj.betType.substr(0,1)) {
            case '2':
                obj['1'] = passMode[dataObj.betType]
                break;
            case '3':
                obj['1'] = passMode[dataObj.betType]
                break;
            case '4':
                obj['1'] = passMode[dataObj.betType]
                break;
            case '5':
                obj['2'] = passMode[dataObj.betType]
                break;
            case '6':
                dataObj.betType.split('x')[1] >= 50 
                ? obj['4'] = passMode[dataObj.betType]
                : obj['3'] = passMode[dataObj.betType]
                break;
            case '7':
                obj['1'] = passMode[dataObj.betType]
                break;
            case '8':
                obj['2'] = passMode[dataObj.betType]
                break;
            default:
                break;
        }
    }

    // 倍数计算
    resultNUM = []
    getNUM(dataObj.multiple, multipleD)
    let str = '0000000000000000'
    for(let i = 0;i<resultNUM.length; i++){
        str = str.substr(0, multipleOBJ[resultNUM[i]]-1) + '1' + str.substr(multipleOBJ[resultNUM[i]], 16)
    }
    let obj1 = {
        '0': '0000',
        '1': str.substr(0, 4),
        '2': str.substr(4, 4),
        '3': str.substr(8, 4),
        '4': str.substr(12, 4)
    }
    // 组合
    str = ''
    for (const key in obj) {
        str += '0' + obj[key] + obj1[key] + '00' + '\n'
    }
    return str
}

function getResultStr(dataObj){
    let shutStr = ''
    let dataArr = []
    specialStr = ''
    specialFlag = false
    // 特殊情况判断
    if (dataObj.subPlayType == '52' || dataObj.subPlayType == '54' || dataObj.subPlayType == '63'){
        if(dataObj.betContext.length > 3){
            switch (dataObj.subPlayType) {
                case '63':
                    specialStr = '篮球胜分差:'
                    break;
                case '52':
                    specialStr = '足球比分:'
                    break;
                case '54':
                    specialStr = '足球半全场:'
                    break;
                default:
                    break;
            }
            dataObj.betContext.map(val => {
                specialStr += dataObj.subPlayType == '63'
                       ? getSpecialStr(val)
                       : getSpecialStrF(val, dataObj.subPlayType)
            })
            specialStr += '  过关类型:' + (dataObj.betType == 'single' ? '单关' : dataObj.betType)
            specialStr += '  倍数:' + dataObj.multiple
            return {status: '0', resultStr: specialStr}
        }
    }
    if (dataObj.subPlayType == '59' || dataObj.subPlayType == '69'){
        if(dataObj.betContext.length == 4){
            let falg = false
            dataObj.betContext.map((val,index) => {
                for (const key in val) {
                    for (const key1 in val[key]) {
                        if(key1 == '54' || key1 == '52' || key1 == '63') {
                            falg = true
                        }
                    }
                }
            })
            if (falg) {
                switch (dataObj.subPlayType) {
                    case '59':
                        specialStr = '足球混合:'
                        break;
                    case '69':
                        specialStr = '篮球混合:'
                        break;
                    default:
                        break;
                }
                dataObj.betContext.map((val,index) => {
                    for (const key in val) {
                        for (const key1 in val[key]) {
                            switch (key1) {
                                case '51':
                                    specialStr += '足球胜平负:'
                                    specialStr += specialDate[key.substring(10, 11)]
                                    specialStr += key.substring(11, 14) + '[ '
                                    val[key][key1].map(val1 => {
                                        specialStr += letwinObjF[val1] + ' '
                                    })
                                    specialStr += '] '
                                    break;
                                case '52':
                                    specialStr += '足球比分:'
                                    specialStr += getSpecialStrF({[key]: val[key][key1]}, '52') + ' '
                                    break
                                case '53':
                                    specialStr += '足球总进球:'
                                    specialStr += specialDate[key.substring(10, 11)]
                                    specialStr += key.substring(11, 14) + '[ '
                                    val[key][key1].sort()
                                    val[key][key1].map(val1 => {
                                        specialStr += val1 + ' '
                                    })
                                    specialStr += '] '
                                    break;
                                case '54':
                                    specialStr += '足球半全场:'
                                    specialStr += getSpecialStrF({[key]: val[key][key1]}, '54') + ' '
                                    break;
                                case '56':
                                    specialStr += '足球让球胜平负:'
                                    specialStr += specialDate[key.substring(10, 11)]
                                    specialStr += key.substring(11, 14) + '[ '
                                    val[key][key1].map(val1 => {
                                        specialStr += letwinObjF[val1] + ' '
                                    })
                                    specialStr += '] '
                                    break;
                                case '61':
                                    specialStr += '篮球让分胜负:'
                                    specialStr += specialDate[key.substring(10, 11)]
                                    specialStr += key.substring(11, 14) + '[ '
                                    val[key][key1].map(val1 => {
                                        specialStr += (val1 == '1' ? '胜' : '负')+ ' '
                                    })
                                    specialStr += '] '
                                    break;
                                case '62':
                                    specialStr += '篮球胜负:'
                                    specialStr += specialDate[key.substring(10, 11)]
                                    specialStr += key.substring(11, 14) + '[ '
                                    val[key][key1].map(val1 => {
                                        specialStr += (val1 == '1' ? '胜' : '负')+ ' '
                                    })
                                    specialStr += '] '
                                    break;
                                case '63':
                                    specialStr += '篮球胜分差:'
                                    specialStr += getSpecialStr({[key]: val[key][key1]}) + ' '
                                    break;
                                case '64':
                                    specialStr += '篮球大小分:'
                                    specialStr += specialDate[key.substring(10, 11)]
                                    specialStr += key.substring(11, 14) + '[ '
                                    val[key][key1].map(val1 => {
                                        specialStr += (val1 == '1' ? '大' : '小')+ ' '
                                    })
                                    specialStr += '] '
                                    break;
                                default:
                                    break;
                            }
                        }
                    }
                })
                specialStr += '  过关方式:' + dataObj.betType
                specialStr += '  倍数:' + dataObj.multiple
                return {status: '0', resultStr: specialStr}
            }
        }
    }
    
    if(dataObj.betContext.length<=3) {
        shutStr = dataObj.lotteryType == '61' ? threeStrB : threeStrF
    } else if (3 < dataObj.betContext.length && dataObj.betContext.length <= 6) {
        shutStr = dataObj.lotteryType == '61' ? sixStrB : sixStrF
    } else {
        shutStr = dataObj.lotteryType == '61' ? eightStrB : eightStrF
    }
    dataArr = combineF(dataObj)
    
    let str = ''
    for(let i=0; i<dataArr.length/3; i++){
        for (const key in dataArr[i]) {
            str += '0' + dataArr[3*i][key] + dataArr[3*i+1][key] + dataArr[3*i+2][key] + '00' + '\n'
        }
    }
    let passTypeStr = ''
    if (dataObj.betType == 'single'){
        passTypeStr = passType[dataObj.betType]
    } else{
        if(dataObj.subPlayType != '69' && dataObj.subPlayType != '59') {
            passTypeStr = passType['n*m1']
        }else{
            passTypeStr = passType['n*m2']
        }
    }
    // console.log(1, specialStr)
    // return {result: shutStr + passTypeStr + str + passCombineB(dataObj) + '000000000000001', specialStr: specialStr}
    // return shutStr + passTypeStr + str + passCombineB(dataObj) + '000000000000001'
    return {status: '1', resultStr: shutStr + passTypeStr + str + passCombineB(dataObj) + '000000000000001'}
}

export default getResultStr
