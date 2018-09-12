// mathjs库
function returnEvenRound(num) {
    let numStr = String(num)
    let res = 0
    if (numStr.indexOf('.') > -1) {
      let threeFloatNum = numStr.split('.')[1].substr(2, 1)
      let twoFloatNum = numStr.split('.')[1].substr(1, 1)
      if (Number(threeFloatNum) !== 5) {
        res = +num.toFixed(2)
      } else {
        res = Number(twoFloatNum) % 2 === 0 ? Math.floor(num * 100) / 100 : Math.floor(num * 100 + 1) / 100
      }
    } else {
      res = num
    }
    return res
}
// 处理浮点数的乘法
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

// 处理浮点数的加法
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

var spArr = []
var isDg = false
function computeZHu (dataObj, bunch) {
    var obj = dataObj;
    spArr = []
    var dannum = 0
    var tuo = [],
        dan = []
    for (var o in obj) {
        if (obj[o].danx == 'false' || obj[o].danx == false) {
            tuo.push(obj[o].v.length)
        } else {
            dannum += 1
            dan.push(obj[o].v.length)
        }
    }

    var c = bunch
    var zhushu = 0;
    for (var i = 0; i < c.length; i++) {
        var pt = c[i].replace('x', '-')
        zhushu += parseInt(myCalc(pt, '1', tuo, dan, dannum, dannum))
    }
    return zhushu
}

function myCalc(PassType, WagerType, sa, sb, b0, b1) {
    if (sb.length == 0) return calc(PassType, WagerType, sa, sb);
    else {
        var wcount = 0;
        for (var k = b0; k <= b1; k++) {
            var bm = combinArray(sb, k);
            for (var j in bm) {
                wcount += calc(PassType, WagerType, sa, bm[j]);
            }
        }
        // console.log(wcount, 'wcount')
        return wcount;
    }
}

function calc(PassType, WagerType, sa, sb) {
    var WagerCount = 0;
    var t_list = PassType.split("-");
    var pc = parseInt(t_list[0], 10);
    if (WagerType == 1) {
        var AbsCount = sb.length;
        var len = pc - AbsCount;
        if (len == 0 && AbsCount > 0) {
            var pm = new Array(pc);
            for (var P in sb) {
                var AbsVoteC = sb[P];
                for (var k = 0; k < pc; k++) {
                    if (pm[k] == 0 || pm[k] == null) {
                        pm[k] = AbsVoteC;
                        break;
                    }
                }
            }
            var pstr = pm.slice(0, pc).join(",");
            eval("WagerCount += calcuteWC(PassType," + pstr + ");");
        } else {
            var arr = new Array();
            for (var I in sa) {
                arr[arr.length] = I;
            }
            var w = combinArray(arr, len);
            for (var I in w) {
                var splitArr = w[I];
                var pm = new Array(pc);
                for (var k = 0; k < pc; k++) {
                    var d = splitArr[k];
                    pm[k] = splitArr[k] != null ? sa[d] : 0;
                }
                if (AbsCount > 0) {
                    for (var P in sb) {
                        var AbsVoteC = sb[P];
                        for (var k = 0; k < pc; k++) {
                            if (pm[k] == 0 || pm[k] == null) {
                                pm[k] = AbsVoteC;
                                break;
                            }
                        }
                    }
                }
                var pstr = pm.slice(0, pc).join(",");
                eval("WagerCount += calcuteWC(PassType," + pstr + ");");
            }
        }
    } else if (WagerType == 2) {
        var t_list = PassType.split("-");
        var len = parseInt(t_list[0], 10);
        var arr = new Array();
        for (var I in sa) {
            arr[arr.length] = I;
        }
        var w = subsectionArray(arr, len);
        for (var I in w) {
            var splitArr = w[I];
            var pm = new Array(pc);
            for (var k = 0; k < pc; k++) {
                var d = splitArr[k];
                pm[k] = splitArr[k] != null ? sa[d] : 0;
            }
            var pstr = pm.slice(0, pc).join(",");
            eval("WagerCount += calcuteWC(PassType," + pstr + ");");
        }
    }
    return WagerCount;
}

function combinArray(arr, len) {
    var Re = new Array();
    arr.sort(asc);
    if (arr.length < len || len < 1) {
        return Re;
    } else if (arr.length == len) {
        Re[0] = arr;
        return Re;
    }
    if (len == 1) {
        for (var I in arr) {
            Re[I] = new Array();
            Re[I][0] = arr[I];
        }
        return Re;
    }
    if (len > 1) {
        for (var I in arr) {
            var arr_b = new Array();
            for (var J in arr) {
                if (J > I) arr_b[arr_b.length] = arr[J];
            }
            var s = combinArray(arr_b, len - 1);
            if (s.length > 0) {
                for (var K in s) {
                    var p = s[K];
                    p[p.length] = arr[I];
                    p.sort(asc);
                    Re[Re.length] = p;
                }
            }
        }
    }
    return Re;
}

function asc(x, y) {
    var a = parseFloat(x);
    var b = parseFloat(y);
    if (a > b)
        return 1;
    if (a <= b)
        return -1;
}

function calcuteWC(passtype, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o) {
    var re = 0;
    a = a == null ? 0 : parseInt(a, 10);
    b = b == null ? 0 : parseInt(b, 10);
    c = c == null ? 0 : parseInt(c, 10);
    d = d == null ? 0 : parseInt(d, 10);
    e = e == null ? 0 : parseInt(e, 10);
    f = f == null ? 0 : parseInt(f, 10);
    g = g == null ? 0 : parseInt(g, 10);
    h = h == null ? 0 : parseInt(h, 10);
    i = i == null ? 0 : parseInt(i, 10);
    j = j == null ? 0 : parseInt(j, 10);
    k = k == null ? 0 : parseInt(k, 10);
    l = l == null ? 0 : parseInt(l, 10);
    m = m == null ? 0 : parseInt(m, 10);
    n = n == null ? 0 : parseInt(n, 10);
    o = o == null ? 0 : parseInt(o, 10);
    switch (passtype) {
        case "1-1":
            re = a;
            break;
        case "2-1":
            re = a * b;
            break;
        case "2-3":
            re = (a + 1) * (b + 1) - 1;
            break;
        case "3-1":
            re = a * b * c;
            break;
        case "3-3":
            re = a * b + a * c + b * c;
            break;
        case "3-4":
            re = a * b * c + a * b + a * c + b * c;
            break;
        case "3-7":
            re = (a + 1) * (b + 1) * (c + 1) - 1;
            break;
        case "4-1":
            re = a * b * c * d;
            break;
        case "4-4":
            re = a * b * c + a * b * d + a * c * d + b * c * d;
            break;
        case "4-5":
            re = (a + 1) * (b + 1) * (c + 1) * (d + 1) - (a * (b + c + d + 1) + b * (c + d + 1) + (c + 1) * (d + 1));
            break;
        case "4-6":
            re = a * b + a * c + a * d + b * c + b * d + c * d;
            break;
        case "4-11":
            re = (a + 1) * (b + 1) * (c + 1) * (d + 1) - (a + b + c + d + 1);
            break;
        case "4-15":
            re = (a + 1) * (b + 1) * (c + 1) * (d + 1) - 1;
            break;
        case "5-1":
            re = a * b * c * d * e;
            break;
        case "5-5":
            re = a * b * c * d + a * b * c * e + a * b * d * e + a * c * d * e + b * c * d * e;
            break;
        case "5-6":
            re = a * b * c * d * e + a * b * c * d + a * b * c * e + a * b * d * e + a * c * d * e + b * c * d * e;
            break;
        case "5-10":
            re = a * b + a * c + a * d + a * e + b * c + b * d + b * e + c * d + c * e + d * e;
            break;
        case "5-16":
            re = (a + 1) * (b + 1) * (c + 1) * (d + 1) * (e + 1) - (a * (b + c + d + e + 1) + b * (c + d + e + 1) + c * (d + e + 1) + (d + 1) * (e + 1));
            break;
        case "5-20":
            re = a * b * c + a * b * d + a * b * e + a * c * d + a * c * e + a * d * e + b * c * d + b * c * e + b * d * e + c * d * e + a * b + a * c + a * d + a * e + b * c + b * d + b * e + c * d + c * e + d * e;
            break;
        case "5-26":
            re = (a + 1) * (b + 1) * (c + 1) * (d + 1) * (e + 1) - (a + b + c + d + e + 1);
            break;
        case "5-31":
            re = (a + 1) * (b + 1) * (c + 1) * (d + 1) * (e + 1) - 1;
            break;
        case "6-1":
            re = a * b * c * d * e * f;
            break;
        case "6-6":
            re = a * b * c * d * e + a * b * c * d * f + a * b * c * e * f + a * b * d * e * f + a * c * d * e * f + b * c * d * e * f;
            break;
        case "6-7":
            re = a * b * c * d * e * f + a * b * c * d * e + a * b * c * d * f + a * b * c * e * f + a * b * d * e * f + a * c * d * e * f + b * c * d * e * f;
            break;
        case "6-15":
            re = a * b + a * c + a * d + a * e + a * f + b * c + b * d + b * e + b * f + c * d + c * e + c * f + d * e + d * f + e * f;
            break;
        case "6-20":
            re = a * b * c + a * b * d + a * b * e + a * b * f + a * c * d + a * c * e + a * c * f + a * d * e + a * d * f + a * e * f + b * c * d + b * c * e + b * c * f + b * d * e + b * d * f + b * e * f + c * d * e + c * d * f + c * e * f + d * e * f;
            break;
        case "6-22":
            re = a * b * c * d * e * f + a * b * c * d * e + a * b * c * d * f + a * b * c * e * f + a * b * d * e * f + a * c * d * e * f + b * c * d * e * f + a * b * c * d + a * b * c * e + a * b * c * f + a * b * d * e + a * b * d * f + a * b * e * f + a * c * d * e + a * c * d * f + a * c * e * f + a * d * e * f + b * c * d * e + b * c * d * f + b * c * e * f + b * d * e * f + c * d * e * f;
            break;
        case "6-35":
            re = a * b * c + a * b * d + a * b * e + a * b * f + a * c * d + a * c * e + a * c * f + a * d * e + a * d * f + a * e * f + b * c * d + b * c * e + b * c * f + b * d * e + b * d * f + b * e * f + c * d * e + c * d * f + c * e * f + d * e * f + a * b + a * c + a * d + a * e + a * f + b * c + b * d + b * e + b * f + c * d + c * e + c * f + d * e + d * f + e * f;
            break;
        case "6-42":
            re = (a + 1) * (b + 1) * (c + 1) * (d + 1) * (e + 1) * (f + 1) - (a * (b + c + d + e + f + 1) + b * (c + d + e + f + 1) + c * (d + e + f + 1) + d * (e + f + 1) + (e + 1) * (f + 1));
            break;
        case "6-50":
            re = (a + 1) * (b + 1) * (c + 1) * (d + 1) * (e + 1) * (f + 1) - (a + b + c + d + e + f + 1) - (a * b * c * d * e + a * b * c * d * f + a * b * c * e * f + a * b * d * e * f + a * c * d * e * f + b * c * d * e * f + a * b * c * d * e * f);
            break;
        case "6-57":
            re = (a + 1) * (b + 1) * (c + 1) * (d + 1) * (e + 1) * (f + 1) - (a + b + c + d + e + f + 1);
            break;
        case "6-63":
            re = (a + 1) * (b + 1) * (c + 1) * (d + 1) * (e + 1) * (f + 1) - 1;
            break;
        case "7-1":
            re = a * b * c * d * e * f * g;
            break;
        case "7-7":
            re = a * b * c * d * e * f + a * b * c * d * e * g + a * b * c * d * f * g + a * b * c * e * f * g + a * b * d * e * f * g + a * c * d * e * f * g + b * c * d * e * f * g;
            break;
        case "7-8":
            re = a * b * c * d * e * f * g + a * b * c * d * e * f + a * b * c * d * e * g + a * b * c * d * f * g + a * b * c * e * f * g + a * b * d * e * f * g + a * c * d * e * f * g + b * c * d * e * f * g;
            break;
        case "7-21":
            re = a * b * c * d * e + a * b * c * d * f + a * b * c * d * g + a * b * c * e * f + a * b * c * e * g + a * b * c * f * g + a * b * d * e * f + a * b * d * e * g + a * b * d * f * g + a * b * e * f * g + a * c * d * e * f + a * c * d * e * g + a * c * d * f * g + a * c * e * f * g + a * d * e * f * g + b * c * d * e * f + b * c * d * e * g + b * c * d * f * g + b * c * e * f * g + b * d * e * f * g + c * d * e * f * g;
            break;
        case "7-35":
            re = a * b * c * d + a * b * c * e + a * b * c * f + a * b * c * g + a * b * d * e + a * b * d * f + a * b * d * g + a * b * e * f + a * b * e * g + a * b * f * g + a * c * d * e + a * c * d * f + a * c * d * g + a * c * e * f + a * c * e * g + a * c * f * g + a * d * e * f + a * d * e * g + a * d * f * g + a * e * f * g + b * c * d * e + b * c * d * f + b * c * d * g + b * c * e * f + b * c * e * g + b * c * f * g + b * d * e * f + b * d * e * g + b * d * f * g + b * e * f * g + c * d * e * f + c * d * e * g + c * d * f * g + c * e * f * g + d * e * f * g;
            break;
        case "7-120":
            re = (a + 1) * (b + 1) * (c + 1) * (d + 1) * (e + 1) * (f + 1) * (g + 1) - (a + b + c + d + e + f + g + 1);
            break;
        case "8-1":
            re = a * b * c * d * e * f * g * h;
            break;
        case "8-8":
            re = a * b * c * d * e * f * g + a * b * c * d * e * f * h + a * b * c * d * e * g * h + a * b * c * d * f * g * h + a * b * c * e * f * g * h + a * b * d * e * f * g * h + a * c * d * e * f * g * h + b * c * d * e * f * g * h;
            break;
        case "8-9":
            re = a * b * c * d * e * f * g * h + a * b * c * d * e * f * g + a * b * c * d * e * f * h + a * b * c * d * e * g * h + a * b * c * d * f * g * h + a * b * c * e * f * g * h + a * b * d * e * f * g * h + a * c * d * e * f * g * h + b * c * d * e * f * g * h;
            break;
        case "8-28":
            re = a * b * c * d * e * f + a * b * c * d * e * g + a * b * c * d * e * h + a * b * c * d * f * g + a * b * c * d * f * h + a * b * c * d * g * h + a * b * c * e * f * g + a * b * c * e * f * h + a * b * c * e * g * h + a * b * c * f * g * h + a * b * d * e * f * g + a * b * d * e * f * h + a * b * d * e * g * h + a * b * d * f * g * h + a * b * e * f * g * h + a * c * d * e * f * g + a * c * d * e * f * h + a * c * d * e * g * h + a * c * d * f * g * h + a * c * e * f * g * h + a * d * e * f * g * h + b * c * d * e * f * g + b * c * d * e * f * h + b * c * d * e * g * h + b * c * d * f * g * h + b * c * e * f * g * h + b * d * e * f * g * h + c * d * e * f * g * h;
            break;
        case "8-56":
            re = a * b * c * d * e + a * b * c * d * f + a * b * c * d * g + a * b * c * d * h + a * b * c * e * f + a * b * c * e * g + a * b * c * e * h + a * b * c * f * g + a * b * c * f * h + a * b * c * g * h + a * b * d * e * f + a * b * d * e * g + a * b * d * e * h + a * b * d * f * g + a * b * d * f * h + a * b * d * g * h + a * b * e * f * g + a * b * e * f * h + a * b * e * g * h + a * b * f * g * h + a * c * d * e * f + a * c * d * e * g + a * c * d * e * h + a * c * d * f * g + a * c * d * f * h + a * c * d * g * h + a * c * e * f * g + a * c * e * f * h + a * c * e * g * h + a * c * f * g * h + a * d * e * f * g + a * d * e * f * h + a * d * e * g * h + a * d * f * g * h + a * e * f * g * h + b * c * d * e * f + b * c * d * e * g + b * c * d * e * h + b * c * d * f * g + b * c * d * f * h + b * c * d * g * h + b * c * e * f * g + b * c * e * f * h + b * c * e * g * h + b * c * f * g * h + b * d * e * f * g + b * d * e * f * h + b * d * e * g * h + b * d * f * g * h + b * e * f * g * h + c * d * e * f * g + c * d * e * f * h + c * d * e * g * h + c * d * f * g * h + c * e * f * g * h + d * e * f * g * h;
            break;
        case "8-70":
            re = a * b * c * d + a * b * c * e + a * b * c * f + a * b * c * g + a * b * c * h + a * b * d * e + a * b * d * f + a * b * d * g + a * b * d * h + a * b * e * f + a * b * e * g + a * b * e * h + a * b * f * g + a * b * f * h + a * b * g * h + a * c * d * e + a * c * d * f + a * c * d * g + a * c * d * h + a * c * e * f + a * c * e * g + a * c * e * h + a * c * f * g + a * c * f * h + a * c * g * h + a * d * e * f + a * d * e * g + a * d * e * h + a * d * f * g + a * d * f * h + a * d * g * h + a * e * f * g + a * e * f * h + a * e * g * h + a * f * g * h + b * c * d * e + b * c * d * f + b * c * d * g + b * c * d * h + b * c * e * f + b * c * e * g + b * c * e * h + b * c * f * g + b * c * f * h + b * c * g * h + b * d * e * f + b * d * e * g + b * d * e * h + b * d * f * g + b * d * f * h + b * d * g * h + b * e * f * g + b * e * f * h + b * e * g * h + b * f * g * h + c * d * e * f + c * d * e * g + c * d * e * h + c * d * f * g + c * d * f * h + c * d * g * h + c * e * f * g + c * e * f * h + c * e * g * h + c * f * g * h + d * e * f * g + d * e * f * h + d * e * g * h + d * f * g * h + e * f * g * h;
            break;
        case "8-247":
            re = (a + 1) * (b + 1) * (c + 1) * (d + 1) * (e + 1) * (f + 1) * (g + 1) * (h + 1) - (a + b + c + d + e + f + g + h + 1);
            break;
        case "9-1":
            re = a * b * c * d * e * f * g * h * i;
            break;
        case "10-1":
            re = a * b * c * d * e * f * g * h * i * j;
            break;
        case "11-1":
            re = a * b * c * d * e * f * g * h * i * j * k;
            break;
        case "12-1":
            re = a * b * c * d * e * f * g * h * i * j * k * l;
            break;
        case "13-1":
            re = a * b * c * d * e * f * g * h * i * j * k * l * m;
            break;
        case "14-1":
            re = a * b * c * d * e * f * g * h * i * j * k * l * m * n;
            break;
        case "15-1":
            re = a * b * c * d * e * f * g * h * i * j * k * l * m * n * o;
            break;
        default:
            break;
    }
    return re;
}


var ZQ = {}
ZQ.muliptile = 1
ZQ.spzValue = ''
ZQ.betJson = {}
ZQ.betArr = []
ZQ.min = ''

var ptHash = new Hash();
ptHash.set('1', {
    key: '1',
    units: 1,
    matchCount: 1,
    passMatchs: [1],
    text: '单关',
    value: 1
});
ptHash.set('2-1', {
    key: '2-1',
    units: 1,
    matchCount: 2,
    passMatchs: [2],
    text: '2x1',
    value: 2
});
ptHash.set('3-1', {
    key: '3-1',
    units: 1,
    matchCount: 3,
    passMatchs: [3],
    text: '3x1',
    value: 4
});
ptHash.set('3-3', {
    key: '3-3',
    units: 3,
    matchCount: 3,
    passMatchs: [2],
    text: '3x3',
    value: 8
});
ptHash.set('3-4', {
    key: '3-4',
    units: 4,
    matchCount: 3,
    passMatchs: [2, 3],
    text: '3x4',
    value: 16
});
ptHash.set('4-1', {
    key: '4-1',
    units: 1,
    matchCount: 4,
    passMatchs: [4],
    text: '4x1',
    value: 32
});
ptHash.set('4-4', {
    key: '4-4',
    units: 4,
    matchCount: 4,
    passMatchs: [3],
    text: '4x4',
    value: 64
});
ptHash.set('4-5', {
    key: '4-5',
    units: 5,
    matchCount: 4,
    passMatchs: [3, 4],
    text: '4x5',
    value: 128
});
ptHash.set('4-6', {
    key: '4-6',
    units: 6,
    matchCount: 4,
    passMatchs: [2],
    text: '4x6',
    value: 256
});
ptHash.set('4-11', {
    key: '4-11',
    units: 11,
    matchCount: 4,
    passMatchs: [2, 3, 4],
    text: '4x11',
    value: 512
});
ptHash.set('5-1', {
    key: '5-1',
    units: 1,
    matchCount: 5,
    passMatchs: [5],
    text: '5x1',
    value: 1024
});
ptHash.set('5-5', {
    key: '5-5',
    units: 5,
    matchCount: 5,
    passMatchs: [4],
    text: '5x5',
    value: 2048
});
ptHash.set('5-6', {
    key: '5-6',
    units: 6,
    matchCount: 5,
    passMatchs: [4, 5],
    text: '5x6',
    value: 4096
});
ptHash.set('5-10', {
    key: '5-10',
    units: 10,
    matchCount: 5,
    passMatchs: [2],
    text: '5x10',
    value: 8192
});
ptHash.set('5-16', {
    key: '5-16',
    units: 16,
    matchCount: 5,
    passMatchs: [3, 4, 5],
    text: '5x16',
    value: 16384
});
ptHash.set('5-20', {
    key: '5-20',
    units: 20,
    matchCount: 5,
    passMatchs: [2, 3],
    text: '5x20',
    value: 32768
});
ptHash.set('5-26', {
    key: '5-26',
    units: 26,
    matchCount: 5,
    passMatchs: [2, 3, 4, 5],
    text: '5x26',
    value: 65536
});
ptHash.set('6-1', {
    key: '6-1',
    units: 1,
    matchCount: 6,
    passMatchs: [6],
    text: '6x1',
    value: 131072
});
ptHash.set('6-6', {
    key: '6-6',
    units: 6,
    matchCount: 6,
    passMatchs: [5],
    text: '6x6',
    value: 262144
});
ptHash.set('6-7', {
    key: '6-7',
    units: 7,
    matchCount: 6,
    passMatchs: [5, 6],
    text: '6x7',
    value: 524288
});
ptHash.set('6-15', {
    key: '6-15',
    units: 15,
    matchCount: 6,
    passMatchs: [2],
    text: '6x15',
    value: 1048576
});
ptHash.set('6-20', {
    key: '6-20',
    units: 20,
    matchCount: 6,
    passMatchs: [3],
    text: '6x20',
    value: 2097152
});
ptHash.set('6-22', {
    key: '6-22',
    units: 22,
    matchCount: 6,
    passMatchs: [4, 5, 6],
    text: '6x22',
    value: 4194304
});
ptHash.set('6-35', {
    key: '6-35',
    units: 35,
    matchCount: 6,
    passMatchs: [2, 3],
    text: '6x35',
    value: 8388608
});
ptHash.set('6-42', {
    key: '6-42',
    units: 42,
    matchCount: 6,
    passMatchs: [3, 4, 5, 6],
    text: '6x42',
    value: 16777216
});
ptHash.set('6-50', {
    key: '6-50',
    units: 50,
    matchCount: 6,
    passMatchs: [2, 3, 4],
    text: '6x50',
    value: 33554432
});
ptHash.set('6-57', {
    key: '6-57',
    units: 57,
    matchCount: 6,
    passMatchs: [2, 3, 4, 5, 6],
    text: '6x57',
    value: 67108864
});
ptHash.set('7-1', {
    key: '7-1',
    units: 1,
    matchCount: 7,
    passMatchs: [7],
    text: '7x1',
    value: 134217728
});
ptHash.set('7-7', {
    key: '7-7',
    units: 7,
    matchCount: 7,
    passMatchs: [6],
    text: '7x7',
    value: 268435456
});
ptHash.set('7-8', {
    key: '7-8',
    units: 8,
    matchCount: 7,
    passMatchs: [6, 7],
    text: '7x8',
    value: 536870912
});
ptHash.set('7-21', {
    key: '7-21',
    units: 21,
    matchCount: 7,
    passMatchs: [5],
    text: '7x21',
    value: 1073741824
});
ptHash.set('7-35', {
    key: '7-35',
    units: 35,
    matchCount: 7,
    passMatchs: [4],
    text: '7x35',
    value: -2147483648
});
ptHash.set('7-120', {
    key: '7-120',
    units: 120,
    matchCount: 7,
    passMatchs: [2, 3, 4, 5, 6, 7],
    text: '7x120',
    value: 1
});
ptHash.set('8-1', {
    key: '8-1',
    units: 1,
    matchCount: 8,
    passMatchs: [8],
    text: '8x1',
    value: 2
});
ptHash.set('8-8', {
    key: '8-8',
    units: 8,
    matchCount: 8,
    passMatchs: [7],
    text: '8x8',
    value: 4
});
ptHash.set('8-9', {
    key: '8-9',
    units: 9,
    matchCount: 8,
    passMatchs: [7, 8],
    text: '8x9',
    value: 8
});
ptHash.set('8-28', {
    key: '8-28',
    units: 28,
    matchCount: 8,
    passMatchs: [6],
    text: '8x28',
    value: 16
});
ptHash.set('8-56', {
    key: '8-56',
    units: 56,
    matchCount: 8,
    passMatchs: [5],
    text: '8x56',
    value: 32
});
ptHash.set('8-70', {
    key: '8-70',
    units: 70,
    matchCount: 8,
    passMatchs: [4],
    text: '8x70',
    value: 64
});
ptHash.set('8-247', {
    key: '8-247',
    units: 247,
    matchCount: 8,
    passMatchs: [2, 3, 4, 5, 6, 7, 8],
    text: '8x247',
    value: 128
});
ptHash.set('9-1', {
    key: '9-1',
    units: 1,
    matchCount: 9,
    passMatchs: [9],
    text: '9x1',
    value: 2
});
ptHash.set('10-1', {
    key: '10-1',
    units: 1,
    matchCount: 10,
    passMatchs: [10],
    text: '10x1',
    value: 2
});
ptHash.set('11-1', {
    key: '10-1',
    units: 1,
    matchCount: 11,
    passMatchs: [11],
    text: '11x1',
    value: 2
});
ptHash.set('12-1', {
    key: '11-1',
    units: 1,
    matchCount: 12,
    passMatchs: [12],
    text: '12x1',
    value: 2
});
ptHash.set('13-1', {
    key: '12-1',
    units: 1,
    matchCount: 13,
    passMatchs: [13],
    text: '13x1',
    value: 2
});
ptHash.set('14-1', {
    key: '13-1',
    units: 1,
    matchCount: 14,
    passMatchs: [14],
    text: '14x1',
    value: 2
});
ptHash.set('15-1', {
    key: '14-1',
    units: 1,
    matchCount: 15,
    passMatchs: [15],
    text: '15x1',
    value: 2
});



function computePrice(dataObj, bunch) { //胜平负和让球胜平负计算奖金
    var obj = dataObj;
    var ggWay = []
    ZQ.spzValue = ''
    
    var cuan = bunch

    for (var k = 0; k < cuan.length; k++) {
        ggWay.push(cuan[k].replace('x', '-'))
    }
    var n = 0;
    for (var o in obj) {
        spArr[n] = new Array()
        var getR = []
        getR = obj[o].r

        ZQ.spzValue += obj[o].no + ","
        for (var j = 0; j < getR.length; j++) {
            spArr[n].push(getR[j])
        }
        ZQ.spzValue += getR.join('/')
        if (obj[o].danx[0] == 'false' || obj[o].danx[0] == false) {
            ZQ.spzValue += ',0//'
        } else {
            ZQ.spzValue += ',1//'
        }
        n += 1

    }

    ZQ.spzValue = ZQ.spzValue.substr(0, ZQ.spzValue.length - 2)
    return gusuan(ggWay)

}

function gusuan(ggWay) {
    var mul = ZQ.muliptile; //倍数
    var lType = ''
    var maxprize = 0,
        minprize = 0;
    // var minP=$("#minprize"),maxP=$("#maxprize");
    if (mul == 0) {
        // minP.text(minprize);
        // maxP.text(maxprize);
        return;
    }
    //var items=parseInt($('.the_selected').text());
    //var items=$(".selhidden").val()
    var items = 222
    // isDg = true
    if (isDg) { //是否是单关
        if (items > 0) {
            var maxSp = 0,
                minSp = 1000;
            for (var sp in spArr) {
                if (parseFloat(spArr[sp][0]) < parseFloat(minSp)) {
                    minSp = spArr[sp][0];
                }
                maxSp += parseFloat(spArr[sp][spArr[sp].length - 1]); //wulong 转化成float
            }
            if (lType == 'rf') {
                minprize = (mul * minSp).toFixed(2) * 2;
                maxprize = (mul * maxSp).toFixed(2) * 2;
            } else {
                minprize = (mul * minSp).toFixed(2);
                maxprize = (mul * maxSp).toFixed(2);
            }
        }
        // console.log(minprize, maxprize)
        // minP.text(minprize);
        // maxP.text(maxprize);
    } else {

        if (items > 1) {

            var tempMinArr = [];
            var minPassCount = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0); //用于普通过关计算最小
            var min = 1000;
            for (var passWay in ggWay) {
                var passType = ptHash.get(ggWay[passWay]);
                var minPass = passType.passMatchs[0];
                min = min < minPass ? min : minPass;
            }

            var cc = 0; //最小奖金出现的次数
            for (var passWay in ggWay) {
                var isdc = passWay.split("-")[1] != 1;
                var passType = ptHash.get(ggWay[passWay]);
                var minPass = passType.passMatchs[0];
                minPassCount[minPass]++;
                var arr = gusuangg(ggWay[passWay], min);
                tempMinArr.push(arr[0] * mul);
                maxprize += arr[1] * mul;
                if (isdc) {
                    cc += arr[2];
                }
            }
            tempMinArr.sort(asc);
        } else {
            // $("#minprize").text(minprize);
            // $("#maxprize").text(maxprize);
            // console.log(13, maxprize)
        }
        ZQ.biggestPrize = maxprize / mul;
    }
    return maxprize
}

function Hash() {
    this.length = 0;
    this.items = new Array();
    for (var i = 0; i < arguments.length; i += 2) {
        if (typeof (arguments[i + 1]) != 'undefined') {
            this.items[arguments[i]] = arguments[i + 1];
            this.length++;
        }
    };
    this.removeItem = function (in_key) {
        var tmp_previous;
        if (typeof (this.items[in_key]) != 'undefined') {
            this.length--;
            var tmp_previous = this.items[in_key];
            delete this.items[in_key];
        }
        return tmp_previous;
    };
    this.getItem = function (in_key) {
        return this.items[in_key];
    };
    this.setItem = function (in_key, in_value) {
        var tmp_previous;
        if (typeof (in_value) != 'undefined') {
            if (typeof (this.items[in_key]) == 'undefined') {
                this.length++;
            } else {
                tmp_previous = this.items[in_key];
            }

            this.items[in_key] = in_value;
        }
        return tmp_previous;
    };
    this.hasItem = function (in_key) {
        return typeof (this.items[in_key]) != 'undefined';
    };
    this.clear = function () {
        for (var i in this.items) {
            delete this.items[i];
        }
        this.length = 0;
    };
    this.set = this.setItem;
    this.get = this.getItem;
    this.put = this.set;
}

function gusuangg(ggWay, minPassAll) {
    var passType = ptHash.get(ggWay);
    var minPass = passType.passMatchs[0];
    // console.log(minPass, 'minPass')
    var passNum = Number(passType.text.substr(0, 1))
    // console.log(passNum, '过关场次')
    /*是不是串1的*/
    var mp = parseInt(ggWay.split("-")[1]) == 1;
    /*取出所有的奖金数组*/
    var minArr = [];
    var maxArr = [];
    var danMinArr = [];
    var danMaxArr = [];
    var minAward;
    var maxAward;
    var mintimes = 0; //最小奖金重复次数
    //	var tempAward = 0.0;

    var minSp;
    var maxSp;
    if (mp) {
        for (var y = 0; y < spArr.length; y++) {
            var tempArr = spArr[y];
            minSp = 9999999;
            maxSp = -9999999;
            if (tempArr) {
                for (var m = 0; m < tempArr.length; m++) {
                    if (parseFloat(tempArr[m]) < parseFloat(minSp)) {
                        minSp = tempArr[m];
                    }
                    if (parseFloat(tempArr[m]) > parseFloat(maxSp)) {
                        maxSp = tempArr[m];
                    }
                }
                var danNo = ZQ.spzValue.split('//');
                var danM = danNo[y].split(',');
                if (danM[2] == '1') {
                    danMinArr.push(minSp);
                    danMaxArr.push(maxSp);
                } else {
                    minArr.push(minSp);
                    maxArr.push(maxSp);
                    /************************************alert(maxArr);***************************************/
                }
            }
        }
    } else {
        for (var y = 0; y < spArr.length; y++) {
            var tempArr = spArr[y];
            minSp = 9999999;
            maxSp = -9999999;
            if (tempArr) {
                for (var m = 0; m < tempArr.length; m++) {
                    if (parseFloat(tempArr[m]) < parseFloat(minSp)) {
                        minSp = tempArr[m];
                    }
                    if (parseFloat(tempArr[m]) > parseFloat(maxSp)) {
                        maxSp = tempArr[m];
                    }
                }
                minArr.push(minSp);
                maxArr.push(maxSp);
            }
        }
    }
    if (minArr.length != maxArr.length) {
        return [0, 0];
    }
    minArr.sort(asc);
    maxArr.sort(desc);
    if (isDg) { // 是否为单关
        minAward = minArr[0];
        maxAward = 0;
        for (var i = 0; i < minArr.length; i++) {
            maxAward += maxArr[i];
        }
    } else if (mp) { // 是串1的情况
        var pass = minPass;
        var danSize = danMinArr.length;
        var undanSize = minArr.length;
        danMinArr.sort(asc);
        /*模糊定胆*/
        var danMinHit = danSize;

        minAward = 1;
        for (var i = 0; i < danMinHit; i++) {
            minAward *= danMinArr[i];
        }
        var min_arr = [];
        for (var i = danMinHit; i < danSize; i++) {
            min_arr.push(danMinArr[i]);
        }
        min_arr = min_arr.concat(minArr);
        min_arr.sort(asc);
        var len = pass - danMinHit;
        for (var i = 0; i < len; i++) {
            minAward *= min_arr[i];
        }
        minAward *= 2;
        maxAward = 0;
        var countMaxFn = function (dan) {
            C3(danSize, dan, function (comb1, n1, m1) {
                var award = 1;
                var pos = 0;
                for (var k = 0; k < n1; k++) {
                    if (comb1[k] == true) {
                        award *= danMaxArr[k];
                        pos++;
                        if (pos == m1)
                            break;
                    }
                }
                C3(undanSize, pass - m1, function (comb2, n2, m2) {
                    var award2 = award;
                    var pos2 = 0;
                    for (var k2 = 0; k2 < n2; k2++) {
                        if (comb2[k2] == true) {
                            // award2 *= maxArr[k2];
                            award2 = mul(award2, maxArr[k2])
                            pos2++;
                            if (pos2 == m2)
                                break;
                        }
                    }
                    // award2 *= 2;
                    award2 = mul(award2, 2);
                    if (passNum === 2 || passNum === 3) {
                      award2 = award2 > 200000 ? 200000 : award2
                    } else if (passNum === 4 || passNum === 5) {
                      award2 = award2 > 500000 ? 500000 : award2
                    } else if (passNum === 6 || passNum === 7 || passNum === 8) {
                      award2 = award2 > 1000000 ? 1000000 : award2
                    }
                    // console.log(award2, 'award1是串1 的情况')
                    // maxAward += award2;
                    maxAward = FloatAdd(maxAward, returnEvenRound(award2));
                });
            });
        };

        for (var dan = danMinHit; dan <= danSize; dan++) {
            countMaxFn(dan);
        }
    } else { // 不是串1的情况
        minAward = 1;
        for (var i = 0; i < minPass; i++) {
            minAward *= minArr[i];
        }
        minAward *= 2;
        maxAward = 0; //最大奖金
        var chuan = parseInt(ggWay.split("-")[0]);
        var maxTempArr;
        var flag = false;
        C3(maxArr.length, chuan, function (comb1, n, m) {
            for (var i = 0; i < minPassAll & minPassAll == minPass; i++) {
                if (!comb1[comb1.length - i - 1]) {
                    flag = false;
                    break;
                } else {
                    flag = true;
                }
            }
            if (flag) {
                mintimes++;
            }
            maxTempArr = [];
            for (var j = 0; j < comb1.length; j++) { //临时的赔率最大,串小于场数组合场次的SP存入数组
                if (comb1[j]) {
                    maxTempArr.push(maxArr[j]);
                }
            }
            for (var i = 0, l = passType.passMatchs.length; i < l; i++) {
                if (passType.passMatchs[i] == chuan) {
                    var award = 1;
                    var pos = 0;
                    for (var k = 0; k < maxArr.length; k++) {
                        if (comb1[k] == true) {
                            // award *= maxArr[k];
                            award = mul(award, maxArr[k])
                            pos++;
                            if (pos == m)
                                break;
                        }
                    }
                    // award *= 2;
                    award = mul(award, 2)
                    if (passNum === 2 || passNum === 3) {
                        award = award > 200000 ? 200000 : award
                    } else if (passNum === 4 || passNum === 5) {
                        award = award > 500000 ? 500000 : award
                    } else if (passNum === 6 || passNum === 7 || passNum === 8) {
                        award = award > 1000000 ? 1000000 : award
                    }
                    // console.log(award, 'award2过关方式是非串1，但排列组合的组合方式的长度等于场次数')
                    // maxAward += award;
                    maxAward = FloatAdd(maxAward, returnEvenRound(award));
                } else { //小于串的情况继续拆
                    C3(chuan, passType.passMatchs[i], function (comb2, n, m) {
                        var award = 1;
                        var pos = 0;
                        for (var k = 0; k < n; k++) {
                            if (comb2[k] == true) {
                                // award *= maxTempArr[k];
                                award = mul(award, maxArr[k])
                                pos++;
                                if (pos == m)
                                    break;
                            }
                        }
                        // award *= 2;
                        award = mul(award, 2)
                        if (minPass === 2 || minPass === 3) {
                            award = award > 200000 ? 200000 : award
                        } else if (minPass === 4 || minPass === 5) {
                            award = award > 500000 ? 500000 : award
                        } else if (minPass === 6 || minPass === 7 || minPass === 8) {
                            award = award > 1000000 ? 1000000 : award
                        }
                        // console.log(award, 'award3过关方式是非串1，但排列组合的组合方式的长度小于场次数')
                        // maxAward += award;
                        maxAward = FloatAdd(maxAward, returnEvenRound(award));
                    });
                }
            }
        });
    }
    // /*算出来的最大最小奖金开始进行计算*/
    // console.log(maxAward, 'maxAward')
    return [minAward, maxAward, mintimes];
}

function desc(x, y) {
    var a = parseFloat(x);
    var b = parseFloat(y);
    if (a >= b)
        return -1;
    if (a < b)
        return 1;
}

function C3(n, m, callbackFn) {
    if (m < 0 || m > n) {
        return;
    }
    var bs = [];
    for (var i = 0; i < m; i++) {
        bs[i] = true;
    }
    if (n == m) {
        callbackFn(bs, n, m);
        return;
    }
    for (var i = m; i < n; i++) {
        bs[i] = false;
    }
    if (m == 0) {
        callbackFn(bs, n, m);
        return;
    }
    var flag = true;
    var tempFlag = false;
    var pos = 0;
    var sum = 0;
    do {
        sum = 0;
        pos = 0;
        tempFlag = true;
        callbackFn(bs, n, m);

        for (var i = 0; i < n - 1; i++) {
            if (bs[i] == true && bs[i + 1] == false) {
                bs[i] = false;
                bs[i + 1] = true;
                pos = i;
                break;
            }
        }

        for (var i = 0; i < pos; i++) {
            if (bs[i] == true) {
                sum++;
            }
        }
        for (var i = 0; i < pos; i++) {
            if (i < sum) {
                bs[i] = true;
            } else {
                bs[i] = false;
            }
        }


        for (var i = n - m; i < n; i++) {
            if (bs[i] == false) {
                tempFlag = false;
                break;
            }
        }
        if (tempFlag == false) {
            flag = true;
        } else {
            flag = false;
        }
    } while (flag);
    callbackFn(bs, n, m);
}

var typeMap = {
    'r1c1': ['1_1'],
    'r2c1': ['2_1'],
    'r3c1': ['3_1'],
    'r4c1': ['4_1'],
    'r5c1': ['5_1'],
    'r6c1': ['6_1'],
    'r7c1': ['7_1'],
    'r8c1': ['8_1'],
    'r3c3': ['2_3'],
    'r3c4': ['2_3', '3_1'],
    'r4c4': ['3_4'],
    'r4c5': ['3_4', '4_1'],
    'r4c6': ['2_6'],
    'r4c11': ['2_6', '3_4', '4_1'],
    'r5c5': ['4_5'],
    'r5c6': ['4_5', '5_1'],
    'r5c10': ['2_10'],
    'r5c16': ['3_10', '4_5', '5_1'],
    'r5c20': ['2_10', '3_10'],
    'r5c26': ['2_10', '3_10', '4_5', '5_1'],
    'r6c6': ['5_6'],
    'r6c7': ['5_6', '6_1'],
    'r6c15': ['2_15'],
    'r6c20': ['3_20'],
    'r6c22': ['4_15', '5_6', '6_1'],
    'r6c35': ['2_15', '3_20'],
    'r6c42': ['3_20', '4_15', '5_6', '6_1'],
    'r6c50': ['2_15', '3_20', '4_15'],
    'r6c57': ['2_15', '3_20', '4_15', '5_6', '6_1'],
    'r7c7': ['6_7'],
    'r7c8': ['6_7', '7_1'],
    'r7c21': ['5_21'],
    'r7c35': ['4_35'],
    'r7c120': ['2_21', '3_35', '4_35', '5_21', '5_7', '7_1'],
    'r8c8': ['7_8'],
    'r8c9': ['7_8', '8_1'],
    'r8c28': ['6_28'],
    'r8c56': ['5_56'],
    'r8c70': ['4_70'],
    'r8c247': ['2_28', '3_56', '4_70', '5_56', '6_28', '7_8', '8_1']
}

// getCalculate(objData1)
function getCalculate(objData, bunch){
    let dataObj = {}
    objData.selectData.map(val => {
        let obj = {}
        obj['danx'] = ['false']
        obj['g'] = val.guest
        obj['h'] = val.host
        obj['name'] = val.matchTimes
        obj['no'] = val.matchUniqueId
        obj['rq'] = '1'
        obj['w'] = []
        let r = []
        let v = []
        val.selectData.map(val1 => {
            r.push(val1.val)
            v.push(val1.key) 
        })
        obj['r'] = r
        obj['v'] = v
        dataObj[val.matchUniqueId] = obj
    })
   return {
    zhu: computeZHu(dataObj, bunch),
    price: computePrice(dataObj, bunch)
   }
}

var OverArry = []
var newCArry = []

function hunheComputeHunhe(objData, bunch) {
    var schem = [],
        danmaArr = []
        spArr = []
    var index = -1;
    objData['selectData'].map(val => {
        index += 1
        schem[index] = new Array()
        var score = '',
            score1 = '',
            score2 = '',
            score3 = '',
            score4 = '',
            json = {},
            strmax = '',
            strmax1 = ''
        let dan = 0
        val.selectData.map(val1 => {
            if (objData.lotteryType === '51' && objData.subPlayType === '59') {
                if (val.type === 'winFlatLoss') {
                    let v = -1
                    switch (val1.key) {
                        case '主胜':
                            v = 3
                            break
                        case '平':
                            v = 1
                            break
                        case '主负':
                            v = 0
                            break
                        default:
                            break;
                    }
                    score += '501' + "^" + v + "^" + val1.val + "^" + val.matchUniqueId + "^" + dan + "-/"
                } else if (val.type === 'letwinFlatLoss') {
                    let v = -1
                    switch (val1.key) {
                        case '主胜':
                            v = 3
                            break
                        case '平':
                            v = 1
                            break
                        case '主负':
                            v = 0
                            break
                        default:
                            break;
                    }
                    score1 += '511' + "^" + v + "^" + val1.val + "^" + val.matchUniqueId + "^" + dan + "-/"
                } else if (val.type === 'score') {
                    score2 += '502' + "^" + val1.key + "^" + val1.val + "^" + val.matchUniqueId + "^" + dan + "-/"
                } else if (val.type === 'goals') {
                    score2 += '503' + "^" + val1.key + "^" + val1.val + "^" + val.matchUniqueId + "^" + dan + "-/"
                } else if (val.type === 'halfFull') {
                    score2 += '504' + "^" + val1.key + "^" + val1.val + "^" + val.matchUniqueId + "^" + dan + "-/"
                }
            } else if (objData.lotteryType === '61' && objData.subPlayType === '69') {
                if (val.type === 'winLoss') {
                  let v = -1
                  switch (val1.key) {
                    case '主胜':
                      v = 3
                      break
                    case '主负':
                      v = 0
                      break
                    default:
                      break;
                  }
                  score += '501' + "^" + v + "^" + val1.val + "^" + val.matchUniqueId + "^" + dan + "-/"
                } else if (val.type === 'letWinLoss') {
                  let v = -1
                  switch (val1.key) {
                    case '主胜':
                      v = 3
                      break
                    case '主负':
                      v = 0
                      break
                    default:
                      break;
                  }
                  score1 += '511' + "^" + v + "^" + val1.val + "^" + val.matchUniqueId + "^" + dan + "-/"
                } else if (val.type === 'sizePoints') {
                    let v = -1
                    switch (val1.key) {
                      case '大分':
                        v = 3
                        break
                      case '小分':
                        v = 0
                        break
                      default:
                        break;
                    }
                    score1 += '503' + "^" + v + "^" + val1.val + "^" + val.matchUniqueId + "^" + dan + "-/"
                } else if (val.type === 'victoryDifference') {
                  score2 += '502' + "^" + val1.key + "^" + val1.val + "^" + val.matchUniqueId + "^" + dan + "-/"
                }
            }
        })
        let ss = score.substr(0, score.lastIndexOf('/'))
        let ss1 = score1.substr(0, score1.lastIndexOf('/'))
        let ss2 = score2.substr(0, score2.lastIndexOf('/'))
        let ss3 = score3.substr(0, score3.lastIndexOf('/'))
        let ss4 = score4.substr(0, score4.lastIndexOf('/'))
        if (ss !== '') {
            ss += "~"
            schem[index].push(ss)
        }
        if (ss1 !== '') {
            ss1 += "~"
            schem[index].push(ss1)
        }
        if (ss2 !== '') {
            ss2 += "~"
            schem[index].push(ss2)
        }
        if (ss3 !== '') {
            ss3 += "~"
            schem[index].push(ss3)
        }
        if (ss4 !== '') {
            ss4 += "~"
            schem[index].push(ss4)
        }
    })
    var zhushu = 0
    var maxprice = 0
    var minprice = 0
    var c = bunch

    for (var i = 0; i < c.length; i++) {
        OverArry = [];
        var xzcg = c[i].split('x');
        var passway = typeMap['r' + xzcg[0] + 'c' + xzcg[1]];
        var pwy = [];
        for (var b = 0; b < passway.length; b++) {
            pwy.push(passway[b].charAt(0));
        }
        var psy = pwy.join(',');
        var methods = 0;
        if (xzcg[1] > 1) {
            methods = 1;
        } else {
            methods = 0;
        }
        startRecon(schem, psy, methods, danmaArr, xzcg[0]);
        zhushu += OverArry.length

        maxprice += parseFloat(reconBonusHunhe(newsHunheChem(objData), psy, methods, danmaArr, xzcg[0])) * parseInt(1);
    }

    let dataObj = {}
    objData.selectData.map(val => {
        let obj = {}
        obj['danx'] = ['false']
        obj['g'] = val.guest
        obj['h'] = val.host
        obj['name'] = val.matchTimes
        obj['no'] = val.matchUniqueId
        obj['rq'] = '1'
        obj['w'] = []
        let r = []
        let v = []
        val.selectData.map(val1 => {
            r.push(val1.val)
            v.push(val1.key) 
        })
        obj['r'] = r
        obj['v'] = v
        dataObj[val.matchUniqueId] = obj
    })
    return {
        zhu: zhushu,
        price: computePrice(dataObj, bunch)
    }
}

function startRecon(arr, type, mcnType, danmaArr, mcn) {

    var types = type.split(',');
    newCArry = [];
    var oneAr;
    if (mcnType == 1) {
        oneAr = dgRecon(arr, mcn, danmaArr);
    }
    for (var k = 0; k < types.length; k++) {
        if (mcnType == 1) {
            for (var i = 0; i < oneAr.length; i++) {
                var twoAr = oneAr[i].substring(0, oneAr[i].length - 1).split('~');
                newCArry = [];
                myfind(new Array(), twoAr, types[k]);
                for (var s = 0; s < newCArry.length; s++) {
                    var threeAr = newCArry[s].split(',');
                    if (newCArry[s].indexOf('/') != -1) {
                        var thrnewAr = [];
                        for (var d = 0; d < threeAr.length; d++) {
                            thrnewAr.push(threeAr[d].split('/'));
                        }
                        var fourAr = doExchange(thrnewAr);
                        for (var l = 0; l < fourAr.length; l++) {
                            OverArry.push(fourAr[l]);
                        }
                    } else {
                        OverArry.push(newCArry[s].replace(/[,]/g, ''));
                    }
                }

            }
        } else {
            var fiveAr = [];
            for (var y = 0; y < arr.length; y++) {
                var lsstr = '';
                try {
                    var arryAr = arr[y].split(',');
                    for (var g = 0; g < arryAr.length; g++) {
                        lsstr += arryAr[g];
                    }
                } catch (e) {
                    for (var g = 0; g < arr[y].length; g++) {
                        lsstr += arr[y][g];
                    }
                }
                lsstr = lsstr.replace(/[/]/g, '~');
                fiveAr.push(lsstr.substring(0, lsstr.length - 1));
            }

            myfind(new Array(), fiveAr, types[k]);
            var cabArr = newCArry;
            for (var e = 0; e < cabArr.length; e++) {
                var dyArr = cabArr[e].split(',');

                var newsiteArr = [];
                for (var r = 0; r < dyArr.length; r++) {
                    newsiteArr.push(dyArr[r].split('~'));
                }
                var nstArr = doExchange(newsiteArr);
                for (var w = 0; w < nstArr.length; w++) {
                    if (danmaArr.length > 0) {
                        var flagDan = true;
                        for (var u = 0; u < danmaArr.length; u++) {
                            if (nstArr[w].indexOf(danmaArr[u]) == -1) {
                                flagDan = false;
                                break;
                            }
                        }
                        if (flagDan) {
                            OverArry.push(nstArr[w]);
                        }
                    } else {
                        OverArry.push(nstArr[w]);
                    }
                }
            }
        }
    }
}

function myfind(has, other, n) {
    if (n == 0) {
        newCArry.push(has.join(","));
        return;
    }
    if (other.length < n) {
        return;
    }
    var one = other.shift();
    var newhas = has.concat();
    var newother = other.concat();
    has.push(one);
    myfind(has, other, n - 1);
    myfind(newhas, newother, n);
    return has;
}

function doExchange(doubleArrays) {
    var len = doubleArrays.length;
    if (len >= 2) {
        var len1 = doubleArrays[0].length;
        var len2 = doubleArrays[1].length;
        var newlen = len1 * len2;
        var temp = new Array(newlen);
        var index = 0;
        for (var i = 0; i < len1; i++) {
            for (var j = 0; j < len2; j++) {
                temp[index] = doubleArrays[0][i] + doubleArrays[1][j];
                index++;
            }
        }
        var newArray = new Array(len - 1);
        for (var i = 2; i < len; i++) {
            newArray[i - 1] = doubleArrays[i];
        }
        newArray[0] = temp;
        return doExchange(newArray);
    } else {
        return doubleArrays[0];
    }
}

function reconBonusHunhe(arr, type, mcnType, danmaArr, mcn) {
    OverArry = [];
    var bonus = 0;
    startRecon(arr, type, mcnType, danmaArr, mcn);
    /*var dyArr = [];
     for(var s=0;s<arr.length;s++)
     {
     dyArr.push(arr[s][arr[s].length-1]);
     }
     startRecon(dyArr,type,mcnType,danmaArr,mcn);
     */
    for (var i = 0; i < OverArry.length; i++) {
        var oneBonAr = OverArry[i].substring(0, OverArry[i].length - 1).split('-');
        var bus = 1;
        for (var s = 0; s < oneBonAr.length; s++) {
            var bons = oneBonAr[s].split('^');
            bus *= parseFloat(bons[2]);
        }
        bonus += bus * 2;
    }
    return parseFloat(bonus).toFixed(2);
}

function newsHunheChem(objData) {
    var bet = [],
        arrs = [],
        arrnumber = [],
        HybridStrings = [],
        suanJ = [],
        option = [],
        newHY = []
    ZQ.betJson = {}
    ZQ.betArr = []
    ZQ.min = []
    objData.selectData.map(val => {
        bet=[]
        option=[]
        arrs=[]
        arrnumber=[]
        HybridStrings=[]
        val.selectData.map(val1 => {
            if (objData.lotteryType === '51' && objData.subPlayType === '59') {
                if (val.type === 'winFlatLoss') {
                    let v = -1
                    switch (val1.key) {
                        case '主胜':
                            v = '3'
                            break
                        case '平':
                            v = '1'
                            break
                        case '主负':
                            v = '0'
                            break
                        default:
                            break;
                    }
                    arrnumber.push(v)
                    bet.push({'gn':'501','sp':val1.val,'s':'','val':v})
                    HybridStrings.push('501'+"^"+v+"^"+val1.val+"^"+val.matchUniqueId+"^")
                    // option.push(v+'^'+val1.val+'^'+val.date.substring(10, 14) + val.matchTimes+'~')
                    option.push(v+'^'+val1.val+'^'+ val.matchTimes+'~')
                } else if (val.type === 'letwinFlatLoss') {
                    let v = -1
                    switch (val1.key) {
                        case '主胜':
                            v = '3R'
                            break
                        case '平':
                            v = '1R'
                            break
                        case '主负':
                            v = '0R'
                            break
                        default:
                            break;
                    }
                    arrnumber.push(v)
                    bet.push({'gn':'511','sp':val1.val,'s':'','val':v})
                    HybridStrings.push('511'+"^"+v+"^"+val1.val+"^"+val.matchUniqueId+"^")
                    // option.push(v+'^'+val1.val+'^'+val.date.substring(10, 14) + val.matchTimes+'~')
                    option.push(v+'^'+val1.val+'^'+ val.matchTimes+'~')
                } else if (val.type === 'score') {
                    arrnumber.push(val1.key)
                    bet.push({'gn':'502','sp':val1.val,'s':'','val':val1.key})
                    HybridStrings.push('502'+"^"+val1.key+"^"+val1.val+"^"+val.matchUniqueId+"^")
                    // option.push(val1.key+'^'+val1.val+'^'+val.date.substring(10, 14) + val.matchTimes+'~')
                    option.push(val1.key+'^'+val1.val+'^' + val.matchTimes+'~')
                } else if (val.type === 'goals') {
                    arrnumber.push(val1.key)
                    bet.push({'gn':'503','sp':val1.val,'s':'','val':val1.key})
                    HybridStrings.push('503'+"^"+val1.key+"^"+val1.val+"^"+val.matchUniqueId+"^")
                    // option.push(val1.key+'^'+val1.val+'^'+val.date.substring(10, 14) + val.matchTimes+'~')
                    option.push(val1.key+'^'+val1.val+'^' + val.matchTimes+'~')
                } else if (val.type === 'halfFull') {
                    arrnumber.push(val1.key)
                    bet.push({'gn':'504','sp':val1.val,'s':'','val':val1.key})
                    HybridStrings.push('504'+"^"+val1.key+"^"+val1.val+"^"+val.matchUniqueId+"^")
                    // option.push(val1.key+'^'+val1.val+'^'+val.date.substring(10, 14) + val.matchTimes+'~')
                    option.push(val1.key+'^'+val1.val+'^' + val.matchTimes+'~')
                }
            } else if (objData.lotteryType === '61' && objData.subPlayType === '69') {
                if (val.type === 'winLoss') {
                  let v = -1
                  switch (val1.key) {
                    case '主胜':
                      v = '3'
                      break
                    case '主负':
                      v = '0'
                      break
                    default:
                      break;
                  }
                  arrnumber.push(v)
                  bet.push({
                    'gn': '501',
                    'sp': val1.val,
                    's': '',
                    'val': v
                  })
                  HybridStrings.push('501' + "^" + v + "^" + val1.val + "^" + val.matchUniqueId + "^")
                //   option.push(v + '^' + val1.val + '^' + val.date.substring(10, 14) + val.matchTimes + '~')
                  option.push(v + '^' + val1.val + '^' + val.matchTimes + '~')
                } else if (val.type === 'letWinLoss') {
                  let v = -1
                  switch (val1.key) {
                    case '主胜':
                      v = '3R'
                      break
                    case '主负':
                      v = '0R'
                      break
                    default:
                      break;
                  }
                  arrnumber.push(v)
                  bet.push({
                    'gn': '511',
                    'sp': val1.val,
                    's': '',
                    'val': v
                  })
                  HybridStrings.push('511' + "^" + v + "^" + val1.val + "^" + val.matchUniqueId + "^")
                //   option.push(v + '^' + val1.val + '^' + val.date.substring(10, 14) + val.matchTimes + '~')
                  option.push(v + '^' + val1.val + '^' + val.matchTimes + '~')
                } else if (val.type === 'sizePoints') {
                    let v = -1
                    switch (val1.key) {
                      case '大分':
                        v = '3Q'
                        break
                      case '小分':
                        v = '0Q'
                        break
                      default:
                        break;
                    }
                    arrnumber.push(v)
                    bet.push({
                      'gn': '503',
                      'sp': val1.val,
                      's': '',
                      'val': v
                    })
                    HybridStrings.push('503' + "^" + v + "^" + val1.val + "^" + val.matchUniqueId + "^")
                    // option.push(v + '^' + val1.val + '^' + val.date.substring(10, 14) + val.matchTimes + '~')
                    option.push(v + '^' + val1.val + '^' + val.matchTimes + '~')
                } else if (val.type === 'victoryDifference') {
                  arrnumber.push(val1.key)
                  bet.push({
                    'gn': '502',
                    'sp': val1.val,
                    's': '',
                    'val': val1.key
                  })
                  HybridStrings.push('502' + "^" + val1.key + "^" + val1.val + "^" + val.matchUniqueId + "^")
                //   option.push(val1.key + '^' + val1.val + '^' + val.date.substring(10, 14) + val.matchTimes + '~')
                  option.push(val1.key + '^' + val1.val + '^' + val.matchTimes + '~')
                }
            }
            arrs.push(val1.val)
            bet.push()
        })
        ZQ.betArr.push({
            arrnumber: arrnumber,
            arrs: arrs,
            bet: bet,
            gall: "0",
            // gamenum: val.date.substring(10, 14) + val.matchTimes,
            gamenum: val.matchTimes,
            hbsg: HybridStrings.join('|'),
            ht: val.host,
            id: val.matchUniqueId,
            // lg: val.leagueName,
            matchCode: val.matchUniqueId,
            opn: option.join('|'),
            rq: "-1",
            // stopselldate: val.date,
            vt: val.guest
        })
    })

    var OverPortfolio = ZQ.betArr;

    var sjarr = []
    for (var k = 0; k < OverPortfolio.length; k++) {
        var sr = OverPortfolio[k].hbsg.split("|");
        var arr = {
            '501': {},
            '502': {},
            '503': {},
            '504': {},
            '511': {}
        };
        var yhstr = '';
        var newHbsg = [];
        sjarr[k] = {
            '501': [],
            '502': [],
            '503': [],
            '504': [],
            '511': []
        };
        for (var s = 0; s < sr.length; s++) {
            sr[s] = sr[s] + OverPortfolio[k].gall + "-";
            yhstr += sr[s] + OverPortfolio[k].gall + "~|";
            newHbsg.push(sr[s]);
            var S_a = sr[s].replace(/[~]/g, "").replace(/[ ]/, "");
            var so = S_a.split("^");
            arr[so[0]][so[1]] = so[2]; //so[2]=501,so[0]=3,so[1]=3.20
            sjarr[k][so[0]].push(sr[s]);
        }
        var budGet = yusuanMainHunhe(sr);
        //var budGet = yusuanMainHunhe(arr,OverPortfolio[k].rq);
        var bdt = budGet['max'];
        var tsr = [];
        var tsr1 = []
        var bdt1 = budGet['min'];
        for (var y = 0; y < bdt.length; y++) {
            tsr.push(bdt[y].gn + "^" + bdt[y].val + "^" + bdt[y].brouns + "^" + OverPortfolio[k].matchCode + "^" + OverPortfolio[k].gall + "-~");
        }
        for (var x = 0; x < bdt1.length; x++) {
            tsr1.push(bdt1[x].gn + "^" + bdt1[x].val + "^" + bdt1[x].brouns + "^" + OverPortfolio[k].matchCode + "^" + OverPortfolio[k].gall + "-~");
        }
        ZQ.min.push(tsr1)
        newHY.push(tsr);
    }

    return newHY
}

function yusuanMainHunhe(sr) {
    var maxArray = []
    var minArray = []
    var minObj = {
        brouns: 9999999,
        val: '',
        gn: ''
    }
    var maxObj = {
        brouns: 0,
        val: '',
        gn: ''
    }
    for (var i = 0; i < sr.length; i++) {
        var srs = sr[i].split('^');
        if (srs[2] > maxObj.brouns) {
            maxObj.brouns = srs[2]
            maxObj.val = srs[1]
            maxObj.gn = srs[0]
        }
        if (srs[2] < minObj.brouns) {
            minObj.brouns = srs[2]
            minObj.val = srs[1]
            minObj.gn = srs[0]
        }
    }
    maxArray[0] = maxObj;
    minArray[0] = minObj;
    return {
        'max': maxArray,
        'min': minArray
    };
}
function dgRecon(arr,mcn,danmaArr){
    var newdgAr= [];
    var toArrNewObj = [];
    for(var m=0;m<arr.length;m++)
    {
        toArrNewObj.push(arr[m]);
        if(toArrNewObj[m].length>1){
            try{
                toArrNewObj[m] = toArrNewObj[m].join(',').replace(/[,]/g,'=');
            }catch(e){
                //exception e , this toArrNewObj[m] length is 1
            }
        }
    }
    myfind(new Array(),toArrNewObj,mcn);
    for(var i=0;i<newCArry.length;i++)
    {
        if(newCArry[i].indexOf('=')!=-1){
            var toArr= newCArry[i].split(',');
            var lstoAr = [];
            for(var s=0;s<toArr.length;s++){
                lstoAr.push(toArr[s].split('='));
            }
            var newchangeAr = doExchange(lstoAr);
            for(var j=0;j<newchangeAr.length;j++){
                if(danmaArr.length>0){
                    var dcFlat = true;
                    for(var g=0;g<danmaArr.length;g++){
                        if(newchangeAr[j].indexOf(danmaArr[g])==-1){
                            dcFlat=false;
                            break;
                        }
                    }
                    if(dcFlat){
                        newdgAr.push(newchangeAr[j]);
                    }
                }else{
                    newdgAr.push(newchangeAr[j]);
                }
                //newdgAr.push(newchangeAr[j]);
            }
        }else{
            if(danmaArr.length>0){
                var dcFlat = true;
                for(var t=0;t<danmaArr.length;t++){
                    if(newCArry[i].indexOf(danmaArr[t])==-1){
                        dcFlat=false;
                        break;
                    }
                }
                if(dcFlat){newdgAr.push(newCArry[i]);}
            }else{
                newdgAr.push(newCArry[i]);
            }
        }
    }
    return newdgAr;
}
export {hunheComputeHunhe, getCalculate ,mul, FloatAdd}
