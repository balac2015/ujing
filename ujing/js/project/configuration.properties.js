window.CONFIGURATION = {
    debug: true,
    com: {
        midea: {
            // 是否使用挡板时数据
            isMock: false,
            // 是否打印Stack
            isPrintStack: false,
            // 是否pc端测试
            isPcTest: true,
            // 是否完整版
            isFullApp: false,
            // 用户测试库
            userTest: {
                uid: 'test',
                ssoToken: '9JT...'
            },
            homePageUrl: 'oneWashHome',
            ssoToken: 'midea_sso_token',
            ssoTokenPlaceholder: '___mideatoken___',
            uidPlaceholder: '___uid___',
            mockPath: 'json/',
            cookie: '',
            //cookie: "session=Huv5Ju4uQZlTx-WnMxKIUw.CpaqsvfKIaHr1zI14EfGnrAb6AT42HBZwIPARwohderBPEVVTtOTvnBOyqvjR9eMf7ZDkqPQCQrJpKktYdHY6S1CzlS0Ugg0Wge82p7FlcFbdyq-ta2nWESc-urAYbCezvc0taSaLWhk7EX7stIaQPAvEcEIiD9StoYsEXp90Ig.1474966087834.604800000.zhbppam9cWmkbenFbslXfGZZmn0_DEXVWv_ZKKUQRus;",
            baseUrl: 'http://121.41.34.175:4000/',
            // baseUrl: 'http://10.73.16.80:80/', // 本地调试
            baseUrl2: 'http://xxx.com',
            pay: {
                getSign: 'http://121.41.34.175:3001/rsa/sign.htm', // 支付参数获取签名接口
                pay1pay: 'http://cdcs.pay1pay.com/in/weixin/pay.json' // 金融中心支付接口
            },
            // 高德地图API接口 写死的
            //mapUrl: 'http://restapi.amap.com/v3/assistant/inputtips?s=rsv3&key=45d29c6f1826ea0b2a30e84cfb43f922&platform=JS&logversion=2.0&sdkversion=1.3&appname=http%3A%2F%2Flocalhost%3A63342%2Fmedia-laundry%2Ffranchisee%2Findex.html%23%2Fmap&csid=7FB76A26-CF5C-49B5-BD45-77BE342AD01E&keywords=',
            methods: {
                test: '/test',
                storeFindStore: 'store/findStore', // 查找附件洗衣房
                searchStore: 'store/searchStore', // 搜索洗衣房
                getRecentlyUsedStore: 'store/getRecentlyUsedStore', // 最近使用洗衣房
                getStoreDetail: 'store/getStoreDetail', // 洗衣房详细信息
                getMessageList: 'user/getMessageList', // 我的消息
                deleteMessage: 'user/deleteMessage', // 删除消息
                findDeviceByQrcode: 'store/findDeviceByQrcode', // 通过条码查询设备
                getOrderList: 'order/getOrderList', // 我的订单
                getHistoryOrderList: 'order/getHistoryOrderList', // 历史订单
                cancelOrder: 'order/cancelOrder', // 取消订单
                deleteOrder: 'order/deleteOrder', // 删除订单
                switchDevice: 'order/switchDevice', // 更换机器
                getErrorDetail: 'order/getErrorDetail', // 获取故障详情
                stopDevice: 'order/stopDevice', // 紧急停机
                getCouponList: 'user/getCouponList', // 可用优惠券列表
                setAppointmentReminder: 'store/setAppointmentReminder', // 预约提醒
                createOrder: 'order/createOrder', // 预定机器
                getExpireCouponList: 'user/getExpireCouponList', // 已过期优惠券列表
                startSelfClean: 'order/startSelfClean', // 启动自洁
                startWash: 'order/startWash', // 启动洗衣
                pay: 'order/pay', // 订单支付
                useCoupon: 'user/useCoupon', // 支付完成后确定是否用了优惠券
                wechatPrepay: 'order/wechatPrepay', // 微信预支付
                feedBack: 'user/feedBack', // 反馈
                logout: 'user/logout', // 退出登录
                updateUserInfo: 'user/updateUserInfo', // 更改用户信息
                uploadImg: 'user/uploadImg', // 上传头像图片
                getVerifyCode: 'user/getVerifyCode', // 获取登录验证码
                shareCoupon: 'user/shareCoupon', // 优惠券分享
                earnCoupon: 'user/earnCoupon ', // 优惠券成功领取
                login: 'user/login', // 登录
                continueWash: 'order/continueWash', // 继续洗衣
                getHelpList: 'user/getHelpList', // 问题列表
                readMessage: 'user/readMessage', // 信息提醒
                hasNewMessage: 'user/hasNewMessage' // 信息提醒
            },
            states: {
                home: {
                    url: '/home?id',
                    templateUrl: 'template/home/home.html',
                    controller: 'homeCtrl',
                    cache: false
                },
                message: { // 消息
                    url: '/message?source',
                    templateUrl: 'template/message/message.html',
                    controller: 'messageCtrl',
                    cache: false
                },
                order: { // 订单
                    url: '/order',
                    templateUrl: 'template/order/order.html',
                    controller: 'orderCtrl',
                    cache: false
                },
                clearing: { // 自洁
                    url: '/clearing?orderId&deviceId',
                    templateUrl: 'template/order/clearing.html',
                    controller: 'clearingCtrl'
                },
                coupon: { // 优惠券
                    url: '/coupon?source',
                    templateUrl: 'template/personalCenter/coupon.html',
                    controller: 'couponCtrl',
                    cache: false
                },
                couponOverdue: { // 过期优惠券
                    url: '/couponOverdue',
                    templateUrl: 'template/personalCenter/couponOverdue.html',
                    controller: 'couponOverdueCtrl'
                },
                rule: { // 优惠券规则
                    url: '/rule',
                    templateUrl: 'template/personalCenter/rule.html',
                    controller: 'ruleCtrl'
                },
                list: {
                    url: '/list',
                    templateUrl: 'template/login/list.html',
                    //controller: 'listCtrl'
                    controller: 'nearCtrl'
                },
                oneWashHome: {
                    url: '/oneWashHome',
                    templateUrl: 'template/login/oneWashHome.html',
                    //controller: 'oneWashHomeCtrl'
                    controller: 'nearCtrl'
                },
                pay: {
                    url: '/pay?source',
                    templateUrl: 'template/home/pay.html',
                    controller: 'payCtrl',
                    cache: false
                },
                error: {
                    url: '/error',
                    resolve: {
                        errorObj: [
                            function() {
                                'use strict';

                                return this.self.error;
                            }
                        ]
                    },
                    controller: 'errorCtrl',
                    templateUrl: 'lib/template/error.html' // displays an error message
                },
                scanHome: { // 扫码二维码
                    url: '/scanHome?source',
                    templateUrl: 'template/home/scanHome.html',
                    controller: 'homeCtrl'
                },
                msgActivity: { // 扫码二维码
                    url: '/msgActivity',
                    templateUrl: 'template/message/msgActivity.html',
                    controller: 'msgActivityCtrl'
                },
                feedback: { // 我要吐槽
                    url: '/feedback',
                    templateUrl: 'template/personalCenter/feedback.html',
                    controller: 'feedbackCtrl'
                },
                personal: { // 个人中心
                    url: '/personal',
                    templateUrl: 'template/personalCenter/personal.html',
                    controller: 'personalCtrl',
                    cache: false
                },
                personalMsg: { // 个人信息
                    url: '/personalMsg',
                    templateUrl: 'template/personalCenter/personalMsg.html',
                    controller: 'personalMsgCtrl'
                },
                nickname: { // 个人信息
                    url: '/nickname',
                    templateUrl: 'template/personalCenter/nickname.html',
                    controller: 'nicknameCtrl'
                },
                setting: { // 设置
                    url: '/setting',
                    templateUrl: 'template/personalCenter/setting.html',
                    controller: 'settingCtrl'
                },
                tel: { // 电话tel
                    url: '/tel',
                    templateUrl: 'template/personalCenter/tel.html',
                    controller: 'telCtrl'
                },
                newMsgSetting: { // 新消息设置
                    url: '/newMsgSetting',
                    templateUrl: 'template/personalCenter/newMsgSetting.html',
                    controller: 'newMsgSettingCtrl'
                },
                updateMobile: { // 更换手机号
                    url: '/updateMobile',
                    templateUrl: 'template/personalCenter/updateMobile.html',
                    controller: 'updateMobileCtrl'
                },
                about: { // 关于U净
                    url: '/about',
                    templateUrl: 'template/personalCenter/about.html',
                    controller: 'aboutCtrl'
                },
                introduction: {
                    url: '/introduction',
                    templateUrl: 'template/personalCenter/introduction.html'
                },
                question: { // 关于U净
                    url: '/question',
                    templateUrl: 'template/personalCenter/question.html',
                    controller: 'questionCtrl'
                },
                pcTest: { // pcTest页面
                    url: '/pcTest',
                    templateUrl: 'template/pcTest.html',
                    controller: 'pcTestCtrl'
                },
                footer: {
                    url: '/footer',
                    controller: 'footerCtrl'
                }
            },
            actionRoutes: {
                // 默认角色
                '': {
                    // 角色1
                    1: {
                        index: 'oneWashHome',
                        states: [
                            'home',
                            'message',
                            'order.*',
                            'coupon',
                            'couponOverdue',
                            'rule',
                            'list',
                            'pay',
                            'error',
                            'oneWashHome',
                            'scanHome',
                            'msgActivity',
                            'feedback',
                            'personal',
                            'personalMsg',
                            'nickname',
                            'setting',
                            'tel',
                            'newMsgSetting',
                            'updateMobile',
                            'about',
                            'question',
                            'clearing',
                            'introduction',
                            'pcTest'
                        ]
                    }
                },
                Coupon: { // 优惠券
                    1: {
                        index: 'coupon',
                        states: [
                            'home',
                            'message',
                            'order.*',
                            'coupon',
                            'couponOverdue',
                            'rule',
                            'list',
                            'pay',
                            'error',
                            'oneWashHome',
                            'scanHome',
                            'msgActivity',
                            'feedback',
                            'personal',
                            'personalMsg',
                            'nickname',
                            'setting',
                            'tel',
                            'newMsgSetting',
                            'updateMobile',
                            'about',
                            'question',
                            'clearing',
                            'introduction',
                            'pcTest'
                        ]
                    }
                },
                Order: { // 订单
                    1: {
                        index: 'order',
                        states: [
                            'home',
                            'message',
                            'order.*',
                            'coupon',
                            'couponOverdue',
                            'rule',
                            'list',
                            'pay',
                            'error',
                            'oneWashHome',
                            'scanHome',
                            'msgActivity',
                            'feedback',
                            'personal',
                            'personalMsg',
                            'nickname',
                            'setting',
                            'tel',
                            'newMsgSetting',
                            'updateMobile',
                            'about',
                            'question',
                            'clearing',
                            'introduction',
                            'pcTest'
                        ]
                    }
                },
                Home: { // 首页
                    1: {
                        index: 'oneWashHome',
                        states: [
                            'home',
                            'message',
                            'order.*',
                            'coupon',
                            'couponOverdue',
                            'rule',
                            'list',
                            'pay',
                            'error',
                            'oneWashHome',
                            'scanHome',
                            'msgActivity',
                            'feedback',
                            'personal',
                            'personalMsg',
                            'nickname',
                            'setting',
                            'tel',
                            'newMsgSetting',
                            'updateMobile',
                            'about',
                            'question',
                            'clearing',
                            'introduction',
                            'pcTest'
                        ]
                    }
                },
                ScanCode: { //
                    1: {
                        index: 'scanHome',
                        states: [
                            'home',
                            'message',
                            'order.*',
                            'coupon',
                            'couponOverdue',
                            'rule',
                            'list',
                            'pay',
                            'error',
                            'oneWashHome',
                            'scanHome',
                            'msgActivity',
                            'feedback',
                            'personal',
                            'personalMsg',
                            'nickname',
                            'setting',
                            'tel',
                            'newMsgSetting',
                            'updateMobile',
                            'about',
                            'question',
                            'clearing',
                            'introduction',
                            'pcTest'
                        ]
                    }
                },
                PersonalCenter: {
                    1: {
                        index: 'personal',
                        states: [
                            'home',
                            'message',
                            'order.*',
                            'coupon',
                            'couponOverdue',
                            'rule',
                            'list',
                            'pay',
                            'error',
                            'oneWashHome',
                            'scanHome',
                            'msgActivity',
                            'feedback',
                            'personal',
                            'personalMsg',
                            'nickname',
                            'setting',
                            'tel',
                            'newMsgSetting',
                            'updateMobile',
                            'about',
                            'question',
                            'clearing',
                            'introduction',
                            'pcTest'
                        ]
                    }
                }
            },
            controllers: {
                baseCtrl: 'baseCtrl',
                homeCtrl: 'home/homeCtrl',
                payCtrl: 'home/payCtrl',
                messageCtrl: 'message/messageCtrl',
                couponCtrl: 'personalCenter/couponCtrl',
                couponOverdueCtrl: 'personalCenter/couponOverdueCtrl',
                ruleCtrl: 'personalCenter/ruleCtrl',
                orderCtrl: 'order/orderCtrl',
                //listCtrl: 'login/listCtrl',
                //oneWashHomeCtrl: 'login/oneWashHomeCtrl',
                nearCtrl: 'home/nearCtrl',
                scanHomeCtrl: 'home/scanHomeCtrl',
                msgActivityCtrl: 'message/msgActivityCtrl',
                feedbackCtrl: 'personalCenter/feedbackCtrl',
                personalMsgCtrl: 'personalCenter/personalMsgCtrl',
                nicknameCtrl: 'personalCenter/nicknameCtrl',
                personalCtrl: 'personalCenter/personalCtrl',
                settingCtrl: 'personalCenter/settingCtrl',
                telCtrl: 'personalCenter/telCtrl',
                newMsgSettingCtrl: 'personalCenter/newMsgSettingCtrl',
                updateMobileCtrl: 'personalCenter/updateMobileCtrl',
                aboutCtrl: 'personalCenter/aboutCtrl',
                questionCtrl: 'personalCenter/questionCtrl',
                clearingCtrl: 'order/clearingCtrl',
                pcTestCtrl: 'pcTestCtrl',
                footerCtrl: 'footerCtrl'
            }
        }
    },
    // 支持的所有多语言, 用逗号分隔, 如zh,en
    LANGUAGES: 'zh,en',
    // 默认使用的语言
    DEFAULT_LANGUAGE: 'en',
    MODULES_PATH: '',
    PROJECT_NAME: '/ujing'
};
