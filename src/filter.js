import Vue from 'vue'

Vue.filter('moneyFilter', money => {
    if (typeof money === 'undefined') {
        return '';
    }
    return parseFloat(money).toFixed(2);
})

Vue.filter('desensitization', phoneNum => {
    phoneNum = "" + phoneNum;
    return phoneNum.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2")
})

Vue.filter('formatDate', (timestamp, format) => {
    if (!timestamp) {
        return;
    }
    if ((timestamp + '').length > 10) {
        timestamp = parseInt(timestamp) / 1000;
    }
    switch (format) {
        case "is":
            return _getis(timestamp);
            break;
        case "Hi":
            return _getHi(timestamp);
            break;
        case "dHi":
            return _getdHi(timestamp);
            break;
        case "Y-m-d":
            return _getYear(timestamp) + "-" + _getMonth(timestamp) + "-" + _getDay(timestamp);
            break;
        case "Y.m.d":
            return _getYear(timestamp) + "." + _getMonth(timestamp) + "." + _getDay(timestamp);
            break;
        case "Y-m-d H:i:s":
            return _getYear(timestamp) + "-" + _getMonth(timestamp) + "-" + _getDay(timestamp) + " " + _getHour(timestamp) + ":" + _getMinute(timestamp) + ":" + _getSecond(timestamp);
            break;
        case "L-y-m-d":
            return _getYear(timestamp) + "年" + _getMonth(timestamp) + "月" + _getDay(timestamp) + "日";
            break;
        case "Y-m-d H:i":
            return _getYear(timestamp) + "-" + _getMonth(timestamp) + "-" + _getDay(timestamp) + " " + _getHour(timestamp) + ":" + _getMinute(timestamp);
            break;
        case "isChaRule":
            return _getChinaRule(timestamp);
            break;
    }

    function _getYear(input) {
        var date = new Date(input * 1000);
        return date.getFullYear();
    }

    function _getMonth(input) {
        var date = new Date(input * 1000);
        var month = date.getMonth() + 1;
        month = month < 10 ? "0" + month : month;
        return month;
    }

    function _getDay(input) {
        var date = new Date(input * 1000);
        var day = date.getDate();
        day = day < 10 ? "0" + day : day;
        return day;
    }

    function _getHour(input) {
        var date = new Date(input * 1000);
        var hour = date.getHours();
        hour = hour < 10 ? "0" + hour : hour;
        return hour;
    }

    function _getMinute(input) {
        var date = new Date(input * 1000);
        var minutes = date.getMinutes();
        minutes = minutes < 10 ? "0" + minutes : minutes;
        return minutes;
    }

    function _getSecond(input) {
        var date = new Date(input * 1000);
        var seconds = date.getSeconds();
        seconds = seconds < 10 ? "0" + seconds : seconds;
        return seconds;
    }

    function _getis(input) {
        var i = Math.floor(input / 60);
        var s = Math.floor(input - i * 60);
        i = i < 10 ? "0" + i : i;
        s = s < 10 ? "0" + s : s;
        return i > 0 ? (i + "分" + s + "秒") : (s + "秒");
    }

    function _getHi(input) {
        var h = Math.floor(input / 3600);
        var i = Math.ceil((input - h * 3600) / 60);
        h = h < 10 ? "0" + h : h;
        i = i < 10 ? "0" + i : i;
        return h > 0 ? (h + "小时" + i + "分钟") : (i + "分钟");
    }

    function _getdHi(input) {
        var d = Math.floor(input / (3600 * 24));
        var h = Math.floor((input - d * (3600 * 24)) / 3600);
        var i = Math.ceil((input - d * (3600 * 24) - h * 3600) / 60);
        d = d < 10 ? "0" + d : d;
        h = h < 10 ? "0" + h : h;
        i = i < 10 ? "0" + i : i;
        var str = "";
        str += d > 0 ? (d + "天") : "";
        str += h > 0 ? (h + "小时") : "";
        str += i + "分钟";
        return str;
    }

    /**
     * 过滤2018年8月5日
     */
    function _getChinaRule(input) {
        var arr = input.split('-');
        for (var i = 1; i < arr.length; i++) {
            if (arr[i].indexOf('0') == 0) {
                arr[i] = arr[i].substring(arr[i].length - 1, arr[i].length);
            }
        }
        return arr[0] + '年' + arr[1] + '月' + arr[2] + '日'
    }
})

Vue.filter('commonFormatFilter', (input, format) => {
    if (!input && input !== 0) {
        return;
    }
    switch (format) {
        case "bill_status":
            return _getbillStatusName(input);
            break;
        case "number_add_space":
            return _numberAddSpace(input);
            break;
        case "bind_status":
            return _bingManage(input);
            break;
        case "approval_status":
            return _approvalStatus(input);
            break;
        case "sex_status":
            return _sexStatus(input);
            break;
        case "account_type":
            return _accountType(input);
            break;
    }

    function _getbillStatusName(input) {
        var data = {
            '-1': '未知',
            '0': '发送失败',
            '1': '发送中',
            '2': '待缴费',
            '3': '支付成功',
            '4': '缴费成功',
            '5': '逾期关闭',
            '6': '账单关闭',
            '7': '发送超时',
        };
        return data[input];
    }

    function _numberAddSpace(input) {
        if (!input) {
            return '';
        }
        var arr = input.split("");
        var str = '';
        for (var i = 0; i < arr.length; i++) {
            if (i % 4 == 0) {
                str += '  ';
            }
            str += arr[i];
        }
        return str;
    }

    /**
     * 绑定管理查询状态过滤
     */
    function _bingManage(input) {
        var data = {
            '0': '未绑定',
            '1': '已绑定'
        };
        return data[input];
    }
    function _approvalStatus(input) {
        var data = {
            '0': '未审核',
            '1': '已审核'
        };
        return data[input];
    }
    /**
     * 性别判断
     */
    function _sexStatus(input) {
        var data = {
            '2': '女',
            '1': '男',
            '0': ''
        };
        return data[input];
    }

    function _accountType(input) {
        var data = {
            'B': '对公',
            'C': '对私',
        };
        return data[input];
    }
})

Vue.filter('plaPayTypeFilter', statusCode => {
    var temp;
    switch (statusCode) {
        case 1:
            temp = "现金";
            break;
        case 2:
            temp = "POS";
            break;
        case 3:
            temp = "银行";
            break;
        case 4:
            temp = "微信";
            break;
        case 5:
            temp = "支付宝";
            break;
        case 7:
            temp = "支付宝教育缴费";
            break;
        case 8:
            temp = "微信教育缴费";
            break;
        case 9:
            temp = "知了分期";
            break;
        case 12:
            temp = "信用卡分期";
            break;
        default:
            temp = "";
    }
    return temp;
})