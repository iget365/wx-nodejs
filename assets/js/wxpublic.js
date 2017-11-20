const url = location.href.replace(/#.+/g, '');
const req = new Request(`/jsapi?url=${url}`, {method: 'GET'});

fetch(req).then(res => {//todo
    return res.json();
}).then(res => {
    wx.config({
        debug: false,
        appId: res.appId,
        timestamp: res.timestamp,
        nonceStr: res.noncestr,
        signature: res.signature,
        jsApiList: ['getNetworkType', 'scanQRCode', 'getLocation', 'openLocation', 'chooseWXPay'],
    });
});


wx.ready(() => {
    console.log('jsapi ready.');
});
wx.error(err => {
    console.error(err);
});

document.getElementById('getNetWorkType').addEventListener('click', e => {
    wx.getNetworkType({
        success: res => {
            const networkType = res.networkType;

            alert(networkType);
        },
        fail: err => {
            console.error(err);
        }
    });
}, false);
document.getElementById('scanQRCode').addEventListener('click', e => {
    wx.scanQRCode({
        needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果
        scanType: ["qrCode","barCode"],
        success: res => {
            const result = res.resultStr;

            alert(result);
        },
        fail: err => {
            console.error(err);
        }
    });
}, false);
document.getElementById('openCurrentLocation').addEventListener('click', e => {
    wx.getLocation({
        type: 'wgs84',
        success: res => {
            const { latitude, longitude, speed, accuracy } = res;
            wx.openLocation({
                latitude,
                longitude,
                name: '当前位置',
                address: '这里是北京的某个点，欢迎你',
                scale: 22, // 地图缩放级别,整形值,范围从1~28。默认为最大
                infoUrl: 'http://map.baidu.com' // 在查看位置界面底部显示的超链接,可点击跳转
            });
        },
        fail: err => {
            console.error(err);
        }
    });
}, false);
document.getElementById('chooseWXPay').addEventListener('click', e => {
    return;
    wx.chooseWXPay({
        timestamp: 0, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
        nonceStr: '', // 支付签名随机串，不长于 32 位
        package: '', // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
        signType: '', // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
        paySign: '', // 支付签名
        success: res => {
            // 支付成功后的回调函数
        }
    });
}, false);