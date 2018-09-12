/**
 * 因为js对于浮点数的加减乘除的计算不准确，所以需要自己重新写新的算法
 * 或者可以使用mathjs库 https: //www.jianshu.com/p/4f63f0003a56
 * http: //mathjs.org/docs/index.html
 */

/**
 * 处理浮点数的加法
 * @param {Number} a
 * @param {Number} b
 */
function FloatAdd(a, b) {
  var c, d, e;
  try {
    c = a.toString().split(".")[1].length;
  } catch (f) {
    c = 0;
  }
  try {
    d = b.toString().split(".")[1].length;
  } catch (f) {
    d = 0;
  }
  return e = Math.pow(10, Math.max(c, d)), (mul(a, e) + mul(b, e)) / e;
}

/**
 * 处理浮点数的减法
 * @param {Number} a
 * @param {Number} b
 */
function sub(a, b) {
  var c, d, e;
  try {
    c = a.toString().split(".")[1].length;
  } catch (f) {
    c = 0;
  }
  try {
    d = b.toString().split(".")[1].length;
  } catch (f) {
    d = 0;
  }
  return e = Math.pow(10, Math.max(c, d)), (mul(a, e) - mul(b, e)) / e;
}

/**
 * 处理浮点数的除法
 * @param {Number} a
 * @param {Number} b
 */
function div(a, b) {
  var c, d, e = 0,
    f = 0;
  try {
    e = a.toString().split(".")[1].length;
  } catch (g) {}
  try {
    f = b.toString().split(".")[1].length;
  } catch (g) {}
  return c = Number(a.toString().replace(".", "")), d = Number(b.toString().replace(".", "")), mul(c / d, Math.pow(10, f - e));
}

/**
 * 处理浮点数的乘法
 * @param {Number} a
 * @param {Number} b
 */

function mul(a, b) {
  var c = 0,
    d = a.toString(),
    e = b.toString();
  try {
    c += d.split(".")[1].length;
  } catch (f) {}
  try {
    c += e.split(".")[1].length;
  } catch (f) {}
  return Number(d.replace(".", "")) * Number(e.replace(".", "")) / Math.pow(10, c);
}

/**
 * 将数字转为千分位的格式
 * @param {Number} n
 */
function getQianfenWei(n) {
  let fen = []
  let arr = []
  if (n.toString().indexOf('.') > -1) {
    fen = n.toString().split('.')[1]
    arr = n.toString().split('.')[0].toString().split('')
  } else {
    fen = ['00']
    arr = n.toString()
  }
  let result = []
  let cs = 0
  for (let i = arr.length - 1; i >= 0; i--) {
    cs++
    result.unshift(arr[i])
    if (!(cs % 3) && i !== 0) {
      result.unshift(',')
    }
  }
  result = result.join('') + '.' + fen
  return result
}

/**
 * 将短横线连接的字符串转为驼峰
 * @param {String} str - 需要转换的字符
 */
function getTuoFeng(str) {
  let strArr = str.split('')
  for (let i = 0; i < strArr.length; i++) {
    if (strArr[i] === '-') {
      strArr.splice(i, 1)
      if (i < strArr.length) {
        strArr[i] = strArr[i].toUpperCase()
      }
    }
  }
  return strArr.join('')
}

/**
 * 四舍五入六成双算法(银行)
 * @param {Number} num - 要处理的数字
 * @param {Number} decimalPlaces - 保留的小数位
 */
function evenRound(num, decimalPlaces) {
  let d = decimalPlaces || 0
  let m = Math.pow(10, d)
  let n = +(d ? num * m : num).toFixed(8) // Avoid rounding errors
  let i = Math.floor(n)
  let f = n - i
  let e = 1e-8 // Allow for rounding errors in f
  let r = (f > 0.5 - e && f < 0.5 + e) ? ((i % 2 === 0) ? i : i + 1) : Math.round(n)
  return d ? r / m : r
}
