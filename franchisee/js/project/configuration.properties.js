window.CONFIGURATION = {
    debug: true,
    com: {
        midea: {
            user: '',
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
            homePageUrl: 'home',
            ssoToken: 'midea_sso_token',
            ssoTokenPlaceholder: '___mideatoken___',
            uidPlaceholder: '___uid___',
            mockPath: 'json/',
            //cookie: 'session=e6cWdPfa9KocupIfYM8SQw.robD3Dv7ZPBy9QKy_Rdg903G4cK5MoU-qBEKfuPE5CFRpvdsRryl_LRAVHxTHfJmlQ4R9cH2J5eqQEYp1r6nwCM8nyouumPMZa4GDLX_ZM3BChZ-ieoeUx0YDL30l1esRl_IJfftICSQ7r7sFTbV8C3hQFsO-WljdZlA9i1ObOyOV5n8mlVRs4Lb5jc_jIBLMOWnKD_CdwizfA9NfZDKxwi7hhRJQtuzPdRaz8IK-ca8k3p90gNcpt7Vct7uFit2SIf7HTmkdxywSykgciwrCIYSjhxbmDUtWpZkF-MwBE97zBUDXyHhethbaatuQhCAhMkBMcNX60nDCmD48nK5ROEttxd_HoJAILZ-vLAskV3sSkSQAX9iU5VQ62u5yehPuOiVlQ58KKo2eCj0D8XJS4E4WDyFJ2RpqjPLBLKZI4zHhKab-QahAclwZc2bXrEH.1472474771615.604800000.8-Plh93KVH1LjNNCP34TOjJyESlpqZryWe46TrAMKvY',
            cookie: '',
            baseUrl: 'http://121.41.34.175:4000/',
            // baseUrl: 'http://10.73.16.145:4000/', // 测试IP
            baseUrl2: 'http://xxx.com',
            // 高德地图API接口 写死的
            mapUrl: 'http://restapi.amap.com/v3/assistant/inputtips?s=rsv3&key=45d29c6f1826ea0b2a30e84cfb43f922&platform=JS&logversion=2.0&sdkversion=1.3&appname=http%3A%2F%2Flocalhost%3A63342%2Fmedia-laundry%2Ffranchisee%2Findex.html%23%2Fmap&csid=7FB76A26-CF5C-49B5-BD45-77BE342AD01E&keywords=',
            methods: {
                test: '/test',
                userLogin: 'franchisee/user/login', // 登录
                addManager: 'franchisee/user/addManager', // 创建管理人员
                getManagerList: 'franchisee/user/getManagerList', // 管理人员列表
                updateManagerInfo: 'franchisee/user/updateManagerInfo', // 管理人员信息修改
                removeManager: 'franchisee/user/removeManager', // 删除管理人员
                getMessageList: 'franchisee/user/getMessageList', // 获取消息
                deleteMessage: 'franchisee/user/deleteMessage', // 删除消息
                statistics: 'franchisee/user/statistics', // 经营总统计
                classifiedStatistics: 'franchisee/user/classifiedStatistics', // 分类统计
                getServiceSubjectList: 'franchisee/store/getServiceSubjectList', // 获取服务主体列表
                updateServiceSubjectInfo: 'franchisee/store/updateServiceSubjectInfo', // 修改主体信息
                removeServiceSubject: 'franchisee/store/removeServiceSubject', // 删除服务主体
                addServiceSubject: 'franchisee/store/addServiceSubject', // 添加服务主体
                getStoreList: 'franchisee/store/getStoreList', // 获取主体下的洗衣房
                addStore: 'franchisee/store/addStore', // 添加洗衣房
                updateStoreInfo: 'franchisee/store/updateStoreInfo', // 洗衣房信息修改
                removeStore: 'franchisee/store/removeStore', // 删除洗衣房
                getLaundryDeviceList: 'franchisee/store/getDeviceList', // 获取洗衣房下的设备
                addDevice: 'franchisee/store/addDevice', // 添加设备
                getWashPrice: 'franchisee/store/getWashPrice', // 获取洗衣房洗衣程序价格
                setWashPrice: 'franchisee/store/setWashPrice', // 设定洗衣房洗衣程序价格
                getDeviceList: 'franchisee/device/getDeviceList', // 获取所有设备信息
                bindQrcode: 'franchisee/device/bindQrcode', // 设备绑定二维码
                unbindQrcode: 'franchisee/device/unbindSn', // 设备二维码解除绑定
                updateDeviceInfo: 'franchisee/device/updateDeviceInfo', // 修改设备信息
                stop: 'franchisee/device/stop', // 紧急停机
                disable: 'franchisee/device/disable', // 禁用/启用设备
                getOrder: 'franchisee/order/getOrder', // 获取订单
                payCoupon: 'franchisee/coupon/payCoupon', // 返券
                addCoupon: 'franchisee/coupon/addCoupon', // 添加优惠券
                getCouponList: 'franchisee/coupon/getCouponList', // 优惠券列表
                getExpireCouponList: 'franchisee/coupon/getExpireCouponList', // 获取过期优惠券
                getAllStore: 'franchisee/store/getAllStore', // 所有的洗衣房
                getAddressData: 'franchisee/store/getAddressData', // 获取地址数据
                getBaseData: 'franchisee/getBaseData', // 获取基础数据
                getHelpList: 'user/getHelpList', // 问题列表
                restart: 'franchisee/device/restart' // 重新启动机器
            },
            states: {
                home: {
                    url: '/home',
                    templateUrl: 'template/home.html',
                    controller: 'homeCtrl'
                },
                laundry: { // 洗衣店
                    url: '/laundry',
                    templateUrl: 'template/laundry/laundry.html',
                    controller: 'laundryCtrl',
                    cache: false
                },
                laundryEdit: {
                    url: '/laundryEdit',
                    templateUrl: 'template/laundry/laundryEdit.html',
                    controller: 'laundryEditCtrl'
                },
                storeEdit: {
                    url: '/storeEdit?id',
                    templateUrl: 'template/laundry/storeEdit.html',
                    controller: 'storeEditCtrl'
                },
                examine: { // 审核
                    url: '/examine?id',
                    templateUrl: 'template/laundry/examine.html',
                    controller: 'examineCtrl'
                },
                store: {
                    url: '/store',
                    templateUrl: 'template/laundry/store.html',
                    controller: 'storeCtrl',
                    cache: false
                },
                statistics: { // 经营统计
                    url: '/statistics',
                    templateUrl: 'template/statistics.html',
                    controller: 'statisticsCtrl'
                },
                pricing: { // 经营统计
                    url: '/pricing',
                    templateUrl: 'template/pricing.html',
                    controller: 'pricingCtrl'
                },
                coupon: { // 分析领券活动
                    url: '/coupon',
                    templateUrl: 'template/uCoupon/coupon.html',
                    controller: 'couponCtrl'
                },
                expired: { // 过期活动
                    url: '/expired',
                    templateUrl: 'template/uCoupon/expired.html',
                    controller: 'expiredCtrl'
                },
                activity: { // 活动详情、创建活动
                    url: '/activity',
                    templateUrl: 'template/uCoupon/activity.html',
                    controller: 'activityCtrl'
                },
                personnel: { // 人员管理
                    url: '/personnel',
                    templateUrl: 'template/personManage/personnel.html',
                    controller: 'personnelCtrl',
                    cache: false
                },
                rights: { // 人员权限
                    url: '/rights',
                    templateUrl: 'template/personManage/rights.html',
                    controller: 'rightsCtrl'
                },
                orderManage: { // 订单管理
                    url: '/orderManage',
                    templateUrl: 'template/orderManage/orderManage.html',
                    controller: 'orderManageCtrl'
                },
                message: { // 消息中心
                    url: '/message',
                    templateUrl: 'template/message/message.html',
                    controller: 'messageCtrl'
                },
                detail: { // 消息详情
                    url: '/detail',
                    templateUrl: 'template/message/detail.html',
                    controller: 'detailCtrl'
                },
                help: {
                    url: '/help',
                    templateUrl: 'template/help.html',
                    controller: 'helpCtrl'
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
                myDevice: { // 我的设备
                    url: '/myDevice',
                    templateUrl: 'template/myDevice/myDevice.html',
                    controller: 'myDeviceCtrl'
                },
                myDeviceSearch: { // 我的设备搜索
                    url: '/myDeviceSearch',
                    templateUrl: 'template/myDevice/myDeviceSearch.html',
                    controller: 'myDeviceSearchCtrl'
                },
                setDevice: { // 配置设备参数
                    url: '/setDevice',
                    //cache: 'false',
                    templateUrl: 'template/myDevice/setDevice.html',
                    controller: 'setDeviceCtrl'
                },
                shrink: {
                    url: '/shrink',
                    cache: 'false',
                    templateUrl: 'template/shrink.html',
                    controller: 'shrinkCtrl'
                }
            },
            actionRoutes: {
                // 默认角色
                '': {
                    // 角色1
                    1: {
                        index: 'home',
                        states: [
                            'home',
                            'error',
                            'laundry',
                            'laundryEdit',
                            'storeEdit',
                            'examine',
                            'store',
                            'myDevice',
                            'myDeviceSearch',
                            'statistics',
                            'pricing',
                            'coupon',
                            'expired',
                            'activity',
                            'personnel',
                            'rights',
                            'orderManage',
                            'message',
                            'detail',
                            'setDevice',
                            'shrink',
                            'help'
                        ]
                    }
                },
                addDevice: { // 添加设备
                    1: {
                        index: 'setDevice',
                        states: [
                            'home',
                            'error',
                            'laundry',
                            'laundryEdit',
                            'storeEdit',
                            'examine',
                            'store',
                            'myDevice',
                            'myDeviceSearch',
                            'statistics',
                            'pricing',
                            'coupon',
                            'expired',
                            'activity',
                            'personnel',
                            'rights',
                            'orderManage',
                            'message',
                            'detail',
                            'setDevice',
                            'shrink',
                            'help'
                        ]
                    }
                },
                laundryManage: { // 洗衣房管理
                    1: {
                        index: 'laundry',
                        states: [
                            'home',
                            'error',
                            'laundry',
                            'laundryEdit',
                            'storeEdit',
                            'examine',
                            'store',
                            'myDevice',
                            'myDeviceSearch',
                            'statistics',
                            'pricing',
                            'coupon',
                            'expired',
                            'activity',
                            'personnel',
                            'rights',
                            'orderManage',
                            'message',
                            'detail',
                            'setDevice',
                            'shrink',
                            'help'
                        ]
                    }
                },
                deviceManage: { // 设备管理
                    1: {
                        index: 'myDevice',
                        states: [
                            'home',
                            'error',
                            'laundry',
                            'laundryEdit',
                            'storeEdit',
                            'examine',
                            'store',
                            'myDevice',
                            'myDeviceSearch',
                            'statistics',
                            'pricing',
                            'coupon',
                            'expired',
                            'activity',
                            'personnel',
                            'rights',
                            'orderManage',
                            'message',
                            'detail',
                            'setDevice',
                            'shrink',
                            'help'
                        ]
                    }
                },
                orderManage: { // 订单管理
                    1: {
                        index: 'orderManage',
                        states: [
                            'home',
                            'error',
                            'laundry',
                            'laundryEdit',
                            'storeEdit',
                            'examine',
                            'store',
                            'myDevice',
                            'myDeviceSearch',
                            'statistics',
                            'pricing',
                            'coupon',
                            'expired',
                            'activity',
                            'personnel',
                            'rights',
                            'orderManage',
                            'message',
                            'detail',
                            'setDevice',
                            'shrink',
                            'help'
                        ]
                    }
                },
                pricing: { // 定价
                    1: {
                        index: 'pricing',
                        states: [
                            'home',
                            'error',
                            'laundry',
                            'laundryEdit',
                            'storeEdit',
                            'examine',
                            'store',
                            'myDevice',
                            'myDeviceSearch',
                            'statistics',
                            'pricing',
                            'coupon',
                            'expired',
                            'activity',
                            'personnel',
                            'rights',
                            'orderManage',
                            'message',
                            'detail',
                            'setDevice',
                            'shrink',
                            'help'
                        ]
                    }
                },
                statistics: { // 经营统计
                    1: {
                        index: 'statistics',
                        states: [
                            'home',
                            'error',
                            'laundry',
                            'laundryEdit',
                            'storeEdit',
                            'examine',
                            'store',
                            'myDevice',
                            'myDeviceSearch',
                            'statistics',
                            'pricing',
                            'coupon',
                            'expired',
                            'activity',
                            'personnel',
                            'rights',
                            'orderManage',
                            'message',
                            'detail',
                            'setDevice',
                            'shrink',
                            'help'
                        ]
                    }
                },
                personManage: { // 人员管理
                    1: {
                        index: 'personnel',
                        states: [
                            'home',
                            'error',
                            'laundry',
                            'laundryEdit',
                            'storeEdit',
                            'examine',
                            'store',
                            'myDevice',
                            'myDeviceSearch',
                            'statistics',
                            'pricing',
                            'coupon',
                            'expired',
                            'activity',
                            'personnel',
                            'rights',
                            'orderManage',
                            'message',
                            'detail',
                            'setDevice',
                            'shrink',
                            'help'
                        ]
                    }
                },
                shareActivity: { // 分享领券活动
                    1: {
                        index: 'coupon',
                        states: [
                            'home',
                            'error',
                            'laundry',
                            'laundryEdit',
                            'storeEdit',
                            'examine',
                            'store',
                            'myDevice',
                            'myDeviceSearch',
                            'statistics',
                            'pricing',
                            'coupon',
                            'expired',
                            'activity',
                            'personnel',
                            'rights',
                            'orderManage',
                            'message',
                            'detail',
                            'setDevice',
                            'shrink',
                            'help'
                        ]
                    }
                },
                message: { // 消息
                    1: {
                        index: 'message',
                        states: [
                            'home',
                            'error',
                            'laundry',
                            'laundryEdit',
                            'storeEdit',
                            'examine',
                            'store',
                            'myDevice',
                            'myDeviceSearch',
                            'statistics',
                            'pricing',
                            'coupon',
                            'expired',
                            'activity',
                            'personnel',
                            'rights',
                            'orderManage',
                            'message',
                            'detail',
                            'setDevice',
                            'shrink',
                            'help'
                        ]
                    }
                },
                help: {
                    1: {
                        index: 'help',
                        states: [
                            'home',
                            'error',
                            'laundry',
                            'laundryEdit',
                            'storeEdit',
                            'examine',
                            'store',
                            'myDevice',
                            'myDeviceSearch',
                            'statistics',
                            'pricing',
                            'coupon',
                            'expired',
                            'activity',
                            'personnel',
                            'rights',
                            'orderManage',
                            'message',
                            'detail',
                            'setDevice',
                            'shrink',
                            'help'
                        ]
                    }
                }
            },
            controllers: {
                baseCtrl: 'baseCtrl',
                homeCtrl: 'homeCtrl',
                laundryCtrl: 'laundry/laundryCtrl',
                examineCtrl: 'laundry/examineCtrl',
                storeCtrl: 'laundry/storeCtrl',
                storeEditCtrl: 'laundry/storeEditCtrl',
                laundryEditCtrl: 'laundry/laundryEditCtrl',
                myDeviceCtrl: 'myDevice/myDeviceCtrl',
                myDeviceSearchCtrl: 'myDevice/myDeviceSearchCtrl',
                statisticsCtrl: 'statisticsCtrl',
                pricingCtrl: 'pricingCtrl',
                couponCtrl: 'uCoupon/couponCtrl',
                expiredCtrl: 'uCoupon/expiredCtrl',
                activityCtrl: 'uCoupon/activityCtrl',
                personnelCtrl: 'personManage/personnelCtrl',
                rightsCtrl: 'personManage/rightsCtrl',
                orderManageCtrl: 'orderManage/orderManageCtrl',
                messageCtrl: 'message/messageCtrl',
                detailCtrl: 'message/detailCtrl',
                setDeviceCtrl: 'myDevice/setDeviceCtrl',
                shrinkCtrl: 'shrinkCtrl',
                helpCtrl: 'helpCtrl'
            }
        }
    },
    // 支持的所有多语言, 用逗号分隔, 如zh,en
    LANGUAGES: 'zh,en',
    // 默认使用的语言
    DEFAULT_LANGUAGE: 'en',
    MODULES_PATH: '',
    PROJECT_NAME: '/franchisee'
};
