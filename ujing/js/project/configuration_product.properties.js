window.CONFIGURATION = {
    debug: false,
    com: {
        midea: {
            // 是否使用挡板时数据
            isMock: false,
            // 是否打印Stack
            isPrintStack: false,
            // 是否pc端测试
            isPcTest: false,
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
            baseUrl: 'http://xxx.com',
            methods: {},
            states: {
                home: {
                    url: '/home',
                    templateUrl: 'template/home.html',
                    controller: 'homeCtrl'
                },
                coupon: { // 优惠券
                    url: '/coupon',
                    templateUrl: 'template/coupon.html',
                    controller: 'couponCtrl'
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
                            'coupon',
                            'error'
                        ]
                    }
                }
            },
            controllers: {
                baseCtrl: 'baseCtrl',
                homeCtrl: 'homeCtrl',
                couponCtrl: 'couponCtrl'
            }
        }
    },
    // 支持的所有多语言, 用逗号分隔, 如zh,en
    LANGUAGES: 'zh,en',
    // 默认使用的语言
    DEFAULT_LANGUAGE: 'en',
    MODULES_PATH: '',
    PROJECT_NAME: '/___identifier___'
};
