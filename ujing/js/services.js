/**
 * Created by Administrator on 2014/11/21.
 */
define(['angular', 'lib/js/main/services'], function(angular) {
    'use strict';

    var BASE = CONFIGURATION.com.midea.methods;

    /* Services */
    angular.module('cApp.services', ['mApp.services'],
        function($httpProvider) {
            $httpProvider.defaults.headers = {
                'Content-Type': 'text/xml;UTF-8,application/x-www-form-urlencoded',
                'X-Requested-With': 'XMLHttpRequest',
                Accept: 'application/xml'
            };
        })
        .factory('cFactory', ['$ionicPopup',
            function($ionicPopup) {
            var funs = {
                commPopup: null,
                alert: function(msg, okText) {
                    var option = {
                        cssClass: 'ionic-popup',
                        title: '',
                        template: msg,
                        buttons: [
                            {
                                text: okText || '确定',
                                type: 'OK',
                                onTap: function() {
                                    return true;
                                }
                            }
                        ]
                    };

                    if (this.commPopup) {
                        this.commPopup.close();
                    }

                    return (this.commPopup = $ionicPopup.alert(option));
                },
                confirm: function(msg, okText, cancelText) {
                    var option = {
                        cssClass: 'ionic-popup',
                        title: '',
                        template: msg,
                        buttons: [
                            {
                                text: cancelText || '取消',
                                type: 'Cancel',
                                onTap: function() {
                                    return false;
                                }
                            },
                            {
                                text: okText || '确定',
                                type: 'OK',
                                onTap: function() {
                                    return true;
                                }
                            }
                        ]
                    };

                    if (this.commPopup) {
                        this.commPopup.close();
                    }

                    return (this.commPopup = $ionicPopup.confirm(option));
                }
            };

            return funs;
        }])
        .factory('httpInterceptor', ['$q', '$injector', 'myWidgetFactory', '$log',function($q, $injector, myWidgetFactory, $log) {
            var httpInterceptor = {
                'responseError' : function(response) {
                    return $q.reject(response);
                },
                'response' : function(response) {
                    if (response.status === 200 && response.data && response.data.result === 2000) {
                        myWidgetFactory.doLogin().then(function(res) {
                            $log.log('httpInterceptor 中的登录：' + res);
                        });
                    }
                    return response;
                },
                'request' : function(config) {
                    return config;
                },
                'requestError' : function(config){
                    return $q.reject(config);
                }
            };

            return httpInterceptor;
        }])
        .service('cService', [
            'baseService',
            'widgetFactory',
            '$q',
            '$log',
            'log',
            'myWidgetFactory',
            function(baseService, widgetFactory, $q, $log, log, myWidgetFactory) {
                var BASE = window.CONFIGURATION.com.midea;

                var services = {
                    /*
                    * 拉起登录页面：有登录信息则执行回调，没有登录则拉起登录后获取登录信息再执行回调
                    * @params {function} 回调函数
                    * */
                    userInfo: function(callback) {
                        var self = this,
                            user =  localStorage.getItem('loginInfo');

                        if (!user || user == 'null' || user == 'undefined') {
                            myWidgetFactory.doLogin().then(function(res) {
                                self.loginInfo(callback);
                            });
                        } else {
                            callback && callback(JSON.parse(user));
                        }
                    },
                    /*
                    * 获取登录信息，有登录信息设置 cookie，执行回调，没有登录信息只设置 loginInfo: ''
                    * @params {function} 回调函数
                    * */
                    loginInfo: function(callback) {
                        var user = localStorage.getItem('loginInfo');

                        // 没有登录信息
                        if (!user || user == 'null' || user == 'undefined') {
                            myWidgetFactory.getLoginInfo().then(function(res) {
                                if (res && res.cookie) {
                                    localStorage.setItem('loginInfo', JSON.stringify(res));
                                    BASE.cookie = res.cookie;
                                    callback && callback(res);
                                } else {
                                    localStorage.setItem('loginInfo', '');
                                }
                            });
                        // 有缓存的登录信息
                        } else {
                            BASE.cookie = JSON.parse(user).cookie;
                            callback && callback(JSON.parse(user));
                        }
                    },
                    /**
                     * 从底座获取用户信息，获取第一次之后会作缓存
                     * @returns {*}
                     */
                    getUser: function() {
                        var
                            defer = $q.defer(),
                            promise = defer.promise,
                            user = baseService.items.get('common', 'user'); // 检查是否存在缓存

                        if (user) {
                            // 如果存在缓存，直接resolve缓存
                            defer.resolve(user);
                        } else {
                            // 不存在缓存的情况下，调用底座接口获取
                            widgetFactory.getUser().then(function(r) {
                                if (r) {
                                    // 缓存用户信息
                                    baseService.items.set('common', 'user', r);
                                }
                                defer.resolve(r);
                            }, function() {
                                // PC端测试时候，从本地测试配置中获取测试用户信息
                                var errResponse = CONFIGURATION.com.midea.isPcTest ? CONFIGURATION.com.midea.userTest : {};

                                defer.resolve(errResponse);
                            });
                        }

                        return promise;
                    },
                    /**
                     * 为参数对象添加token
                     * 具体用法：
                     * 在参数中，使参数值等于CONFIGURATION.com.midea.ssoTokenPlaceholder的值，该方法会自动替换正确的值
                     * @param respond 获取用户的respond
                     * @param params 参数对象
                     * @returns {*}
                     */
                    setToken: function(respond, params) {
                        var token = respond.ssoToken || (CONFIGURATION.com.midea.isPcTest ? CONFIGURATION.com.midea.userTest.ssoToken : '');

                        services.setHolderValue(params, CONFIGURATION.com.midea.ssoTokenPlaceholder, token);

                        return params;
                    },
                    /**
                     * 为参数对象添加uid
                     * 具体用法：
                     * 在参数中，使参数值等于CONFIGURATION.com.midea.uidPlaceholder，该方法会自动替换正确的值
                     * @param respond 获取用户的respond
                     * @param params 参数对象
                     * @returns {*}
                     */
                    setLoginName: function(respond, params) {
                        var uid = respond.uid || (CONFIGURATION.com.midea.isPcTest ? CONFIGURATION.com.midea.userTest.uid : '');

                        services.setHolderValue(params, CONFIGURATION.com.midea.uidPlaceholder, uid);

                        return params;
                    },
                    /**
                     * 递归object用value的值替换掉所有出现的placeholder的值
                     * @param object 递归对象
                     * @param placeholder 要替换的值
                     * @param value 替换后的值
                     */
                    setHolderValue: function(object, placeholder, value) {
                        angular.forEach(object, function(item, key) {
                            if (angular.isObject(item)) {
                                services.setHolderValue(item, placeholder, value);
                            } else if (angular.isString(item) && item.indexOf(placeholder) !== -1) {
                                // 创建正则RegExp对象
                                var reg = new RegExp(placeholder, 'g');

                                object[key] = item.replace(reg, value);
                            }
                        });
                    },
                    /**
                     * 统一请求方法， 该方法可按需求修改
                     * @param key 请求地址
                     * @param params 参数
                     * @param option $http配置参数，配置参数的method默认为JSONP，可选值为POSTFORMDATA、get、post
                     * @returns {*}
                     */
                    request: function(key, params, option) {
                        key = key || '';
                        params = params || {};
                        option = option || {};

                        var
                            config = {},
                            url = key,
                            baseUrl = option.hasOwnProperty('baseUrl') ? option.baseUrl : BASE.baseUrl,
                            keyExtend = option.hasOwnProperty('keyExtend') ? option.keyExtend : '',
                            urlParams = option.hasOwnProperty('urlParams') ? option.urlParams : {},
                            logError = function(msg, status, headers, config_) {
                                try {
                                    var err = {};

                                    err.key = key;
                                    err.params = params;
                                    err.msg = msg;
                                    err.status = status;
                                    err.headers = headers;
                                    err.config = config_;
                                    log("_error", err);

                                    return err;
                                } catch (e) {
                                    log("_error", e);

                                    return e;
                                }
                            };

                        if (BASE.isMock) {
                            url = BASE.mockPath + key + '.json';
                        } else {
                            if (url && url.indexOf('http://') < 0) {
                                url = baseUrl + BASE.methods[key];
                            }
                        }

                        if (url && url.indexOf('http://') < 0 && (window.jasmine || window.karma)) {
                            url = '/base' + (url.indexOf('/') === 0 ? url : '/' + url);
                        }

                        if (!BASE.isMock && config.method !== 'POST_PAYLOAD') {
                            url += keyExtend;
                            url += '?' + baseService.seriesParams(urlParams);
                        }

                        if (BASE.isMock) {
                            config = angular.extend(option, {
                                method: 'get'
                            });
                        } else {
                            config = angular.extend({
                                method: 'JSONP'
                            }, option);
                        }

                        if (config.hasOwnProperty('keyExtend')) {
                            delete config.keyExtend;
                        }

                        if (config.hasOwnProperty('baseUrl')) {
                            delete config.baseUrl;
                        }

                        //log("==================== request params =============");
                        //log(baseUrl, url, keyExtend, params, config);

                        // 先获取用户信息
                        return services.getUser().then(function(respond) {
                            // 设置uid和token
                            services.setLoginName(respond, params);
                            services.setToken(respond, params);

                            var getLocal = localStorage.getItem('loginInfo'),
                                user = null,
                                cke = '';

                            if (getLocal && getLocal !== 'null' && getLocal !== 'undefined') {
                                user = JSON.parse(getLocal);
                                cke = user && user.cookie;
                            }

                            config = angular.extend({
                                headers: {
                                    'Content-Type': 'text/xml;UTF-8,application/x-www-form-urlencoded',
                                    cke: BASE.cookie
                                }
                            }, config);

                            // 根据不同的请求方式，使用不同的请求方法
                            if (config.method == 'POST_FORMDATA') {
                                var fd = new FormData();

                                for (var i in params) {
                                    fd.append(i, params[i]);
                                }

                                return $q.when(baseService.postJsonData(url, fd, config))
                                    .then(function(result) {
                                        return result.data;
                                    }, logError);
                            } else if (config.method === 'POST_PAYLOAD') {
                                delete config.method;
                                
                                return $q.when(baseService.postFormDataByPayload(url, params, config))
                                    .then(function(result) {
                                        return result.data;
                                    }, logError);
                            } else if (config.method == 'post' || config.method == 'POST_JSON') {
                                if (config.method == 'POST_JSON') {
                                    params = JSON.stringify(params);

                                    config = angular.extend({
                                        headers: {
                                            'Content-Type': 'application/json;charset=UTF-8'
                                        }
                                    }, config);
                                }
                                return $q.when(baseService.postJsonData(url, params, config))
                                    .then(function(result) {
                                        if (result.data.result === 2000) {
                                            return services.userInfo();
                                        }
                                        return result.data;
                                    }, logError);
                            } else if (config.method == 'get') {
                                return $q.when(baseService.getDataByGet(url, params, config))
                                    .then(function(result) {
                                        if (result.data.result === 2000) {
                                            return services.userInfo();
                                        }
                                        return result.data;
                                    }, logError);
                            } else if (config.method == 'json') {
                                return $q.when(baseService.getJsonData(key, params, config))
                                    .then(function(result) {
                                        return result.data;
                                    }, logError);
                            } else if (config.method !== 'JSONP') {
                                params.url = url;
                                angular.extend(params, config);

                                return $q.when(baseService.getData(params))
                                    .then(function(result) {
                                        // 你可以在这里定义返回的数据
                                        return result.data;
                                    }, logError);
                            } else {
                                // JSONP
                                angular.extend(config, {
                                    customCallback: 'callback'
                                });

                                return $q.when(baseService.getJsonPData(url, params, config))
                                    .then(function(result) {
                                        return result.data;
                                    }, logError);
                            }
                        });
                    },
                    post: function(key, params, option) {
                        var config = option || {};

                        config = angular.extend({
                            method: 'POST_JSON'
                        }, config);

                        return services.request(key, params, config);
                    },
                    get: function(key, params, config) {
                        var config = config || {};

                        config = angular.extend({
                            method: 'get'
                        }, config);

                        return services.request(key, params, config);
                    },
                    jsonp: function(key, params, config) {
                        var config = config || {};

                        config = angular.extend({
                            method: 'JSONP'
                        }, config);

                        return services.request(key, params, config);
                    },
                    /**
                     * 查找附近洗衣房
                     * params   lat: 113.223065
                     * params   lont: 22.938403
                     */
                    storeFindStore: function(params) {
                        var url = BASE.baseUrl + BASE.methods.storeFindStore;

                        return services.get(url, params);
                    },
                    /**
                     * 获取当前位置的经纬度,返回的内容包括：
                     * address: '广东省佛山市顺德区怡和路靠近美的总部大楼'
                     * city: '佛山市'
                     * citycode: '0757'
                     * district: '顺德区'
                     * latitude: 22.934392
                     * longitude: 113.220649
                     * province: '广东省'
                     * street: '怡和路'
                     */
                    getLocationNow: function() {
                        var defer = $q.defer(),
                            promise = defer.promise;

                        if (BASE.isPcTest) {
                            var mapData = {
                                address: '广东省佛山市顺德区怡和路靠近美的总部大楼',
                                city: '佛山市',
                                citycode: '0757',
                                district: '顺德区',
                                latitude: 22.938403,
                                //latitude: 122.938403,
                                longitude: 113.223065,
                                province: '广东省',
                                street: '怡和路'
                            };

                            defer.resolve(mapData);
                        } else {
                            return $q.when(widgetFactory.location()).then(function(value) {
                                // longitude(经度) + latitude（纬度）
                                // type的可选值为：gps:原始坐标系；baidu：百度经纬度；mapbar：图吧经纬度；
                                if (value.longitude) {
                                    return value;
                                } else {
                                    // 获取失败直接返回空对象，以免出错
                                    return {
                                        address: '',
                                        city: '',
                                        citycode: '',
                                        district: '',
                                        latitude: '',
                                        longitude: '',
                                        province: '',
                                        street: '',
                                        exChange: {
                                            B: '',
                                            G: '',
                                            lat: '',
                                            lng: ''
                                        }
                                    };
                                }
                            });
                        }

                        return promise;
                    },
                    /**
                     * 查找附近洗衣房
                     * params   leyword
                     */
                    searchStore: function(params) {
                        var url = BASE.baseUrl + BASE.methods.searchStore;

                        return services.get(url, params);
                    },
                    /**
                     * 使用过洗衣房
                     * params   storeId 洗衣房id
                     */
                    getStoreDetail: function(params) {
                        var params = params || {},
                            url = BASE.baseUrl + BASE.methods.getStoreDetail;

                        return services.get(url, params);
                    },
                    /**
                     * 我的消息
                     */
                    getMessageList: function(params) {
                        var params = params || {},
                            url = BASE.baseUrl + BASE.methods.getMessageList;

                        return services.get(url, params);
                    },
                    /**
                     * 删除消息
                     * params   msgId 消息 id
                     */
                    deleteMessage: function(params) {
                        var params = params || {},
                            url = BASE.baseUrl + BASE.methods.deleteMessage;
                        return services.post(url, params, {
                            method: 'POST_PAYLOAD'
                        });
                    },
                    /**
                     * 通过条码查询设备
                     * params   storeId 洗衣房id
                     */
                    findDeviceByQrcode: function(params) {
                        var params = params || {},
                            url = BASE.baseUrl + BASE.methods.findDeviceByQrcode;

                        return services.get(url, params);
                    },
                    /**
                     * 我的订单
                     */
                    getOrderList: function(params) {
                        var params = params || {},
                            url = BASE.baseUrl + BASE.methods.getOrderList;

                        return services.get(url, params);
                    },
                    /**
                     * 历史订单
                     */
                    getHistoryOrderList: function(params) {
                        var params = params || {},
                            url = BASE.baseUrl + BASE.methods.getHistoryOrderList;

                        return services.get(url, params);
                    },
                    /**
                     * 取消订单
                     */
                    cancelOrder: function(params) {
                        var params = params || {},
                            url = BASE.baseUrl + BASE.methods.cancelOrder;

                        return services.post(url, params, {
                            method: 'POST_PAYLOAD'
                        });
                    },
                    /**
                     * 删除订单
                     */
                    deleteOrder: function(params) {
                        var params = params || {},
                            url = BASE.baseUrl + BASE.methods.deleteOrder;

                        return services.post(url, params, {
                            method: 'POST_PAYLOAD'
                        });
                    },
                    /**
                     * 更换机器
                     */
                    switchDevice: function(params) {
                        var params = params || {},
                            url = BASE.baseUrl + BASE.methods.switchDevice;

                        return services.post(url, params, {
                            method: 'POST_PAYLOAD'
                        });
                    },
                    /**
                     * 获取故障详情
                     */
                    getErrorDetail: function(params) {
                        var params = params || {},
                            url = BASE.baseUrl + BASE.methods.getErrorDetail;

                        return services.get(url, params);
                    },
                    /**
                     * 紧急停机
                     */
                    stopDevice: function(params) {
                        var params = params || {},
                            url = BASE.baseUrl + BASE.methods.stopDevice;

                        return services.post(url, params, {
                            method: 'POST_PAYLOAD'
                        });
                    },
                    /**
                     * 可用优惠券列表
                     */
                    getCouponList: function(params) {
                        var params = params || {},
                            url = BASE.baseUrl + BASE.methods.getCouponList;

                        return services.get(url, params);
                    },
                    /**
                     * 已过期优惠券列表
                     */
                    getExpireCouponList: function(params) {
                        var params = params || {},
                            url = BASE.baseUrl + BASE.methods.getExpireCouponList;

                        return services.get(url, params);
                    },
                    /**
                     * 空闲提醒
                     * @params storeId	洗衣房ID
                     * @params deviceType	设备类型
                     */
                    setAppointmentReminder: function(params) {
                        var params = params || {},
                            url = BASE.baseUrl + BASE.methods.setAppointmentReminder;

                        return services.post(url, params, {
                            method: 'POST_PAYLOAD'
                        });
                    },
                    /**
                     * 空闲提醒
                     * @params storeId	洗衣房ID
                     * @params deviceId	设备ID
                     * @params washModelId	洗衣程序ID
                     * @params washPrice 洗衣程序价格
                     * @params promotionPrice  洗衣程序促销价格
                     */
                    createOrder: function(params) {
                        var params = params || {},
                            url = BASE.baseUrl + BASE.methods.createOrder;

                        return services.post(url, params, {
                            method: 'POST_PAYLOAD'
                        });
                    },
                    /**
                     * 启动自洁
                     */
                    startSelfClean: function(params) {
                        var params = params || {},
                            url = BASE.baseUrl + BASE.methods.startSelfClean;

                        return services.get(url, params, {
                            method: 'POST_PAYLOAD'
                        });
                    },
                    /**
                     * 启动洗衣
                     */
                    startWash: function(params) {
                        var params = params || {},
                            url = BASE.baseUrl + BASE.methods.startWash;

                        return services.post(url, params, {
                            method: 'POST_PAYLOAD'
                        });
                    },
                    /**
                     * 订单支付
                     */
                    pay: function(params) {
                        var params = params || {},
                            url = BASE.baseUrl + BASE.methods.pay;

                        return services.get(url, params);
                    },
                    /**
                     * 支付完成后确定是否用了优惠券
                     */
                    useCoupon: function(params) {
                        var params = params || {},
                            url = BASE.baseUrl + BASE.methods.useCoupon;

                        return services.post(url, params, {
                            method: 'POST_PAYLOAD'
                        });
                    },
                    /**
                     * 微信预支付
                     */
                    wechatPrepay: function(params) {
                        var params = params || {},
                            url = BASE.baseUrl + BASE.methods.wechatPrepay;

                        return services.post(url, params, {
                            method: 'POST_PAYLOAD'
                        });
                    },
                    /**
                     * 我要反馈
                     */
                    feedBack: function(params) {
                        var params = params || {},
                            url = BASE.baseUrl + BASE.methods.feedBack;

                        return services.post(url, params, {
                            method: 'POST_PAYLOAD'
                        });
                    },
                    /**
                     * 退出登录
                     */
                    logout: function(params) {
                        var params = params || {},
                            url = BASE.baseUrl + BASE.methods.logout;

                        return services.get(url, params);
                    },
                    /**
                     * 更改用户信息
                     */
                    updateUserInfo: function(params) {
                        var params = params || {},
                            url = BASE.baseUrl + BASE.methods.updateUserInfo;

                        return services.get(url, params);
                    },
                    /**
                     * 上传头像信息
                     */
                    uploadImg: function(params) {
                        var params = params || {},
                            url = BASE.baseUrl + BASE.methods.uploadImg;

                        return services.post(url, params, {
                            method: 'POST_PAYLOAD'
                        });
                    },
                    /**
                     * 获取登录验证码
                     */
                    getVerifyCode: function(params) {
                        var params = params || {},
                            url = BASE.baseUrl + BASE.methods.getVerifyCode;

                        return services.get(url, params);
                    },
                    getMapSearchkeyWord: function(keyWord) {
                        var url = BASE.mapUrl + keyWord;

                        return services.request(url, {}, {
                            method: 'JSONP'
                        });
                    },
                    /**
                     * 优惠券成功领取
                     * @param params
                     * @returns {Object} {couponId: ''}
                     */
                    shareCoupon: function(params) {
                        var params = params || {},
                            url = BASE.baseUrl + BASE.methods.shareCoupon;

                        return services.get(url, params);
                    },
                    /**
                     * 优惠券成功领取
                     * @param params
                     * @returns {Object} {couponId: ''}
                     */
                    earnCoupon: function(params) {
                        var params = params || {},
                            url = BASE.baseUrl + BASE.methods.earnCoupon;

                        return services.post(url, params);
                    },
                    /**
                     * 登录接口
                     * @param params
                     * @returns {Object} {couponId: ''}
                     */
                    login: function(params) {
                        var params = params || {},
                            url = BASE.baseUrl + BASE.methods.login;

                        return services.post(url, params, {
                            method: 'POST_PAYLOAD'
                        });
                    },
                    // 继续洗衣
                    continueWash: function(params) {
                        var params = params || {},
                            url = BASE.baseUrl + BASE.methods.continueWash;

                        return services.post(url, params, {
                            method: 'POST_PAYLOAD'
                        });
                    },
                    /**
                     * 问题列表
                     * @param params
                     */
                    getHelpList: function(params) {
                        var params = params || {},
                            url = BASE.baseUrl + BASE.methods.getHelpList;

                        return services.get(url, params);
                    },
                    /**
                     * 是否有新消息
                     * @param params
                     */
                    hasNewMessage: function(params) {
                        var params = params || {},
                            url = BASE.baseUrl + BASE.methods.hasNewMessage;

                        return services.get(url, params);
                    },
                    /**
                     * 更新消息已阅状态
                     * @param params {Object}
                     */
                    readMessage: function(params) {
                        var params = params || {},
                            url = BASE.baseUrl + BASE.methods.readMessage;

                        return services.post(url, params, {
                            method: 'POST_PAYLOAD'
                        });
                    }
                };

                return services;
            }
        ])
        .factory('myWidgetFactory', [
            '$q',
            'log',
            function($q, log) {
                var
                    _MIDEA_COMMON = 'MideaCommon',
                    /*_MIDEA_USER = 'MideaUser',
                    _MIDEA_BARCODE = 'MideaBarcode',
                    _MIDEA_MAP = 'MideaMap',
                    _MIDEA_ANNTO = 'MideaAnnto',
                    _MIDEA_SALE = 'MideaSale',
                    _MIDEA_OUT = 'MideaOut',*/
                    _Midea_Washer = 'MideaWasher',
                    functions = {};

                functions = {
                    callApi: function(name, method, params) {
                        var defer = $q.defer();

                        if (window.cordova) {
                            try {
                                cordova.exec(function(msg) {
                                    defer.resolve(msg);
                                }, function(msg) {
                                    defer.reject(msg);
                                }, name, method, params || []);
                            } catch (e) {
                                log('_error', 'widget error:', e);
                                defer.reject(e);
                            }
                        } else {
                            log('_debug', 'Cordova is not exist');
                            defer.reject('Cordova is not exist');
                        }

                        return defer.promise;
                    },
                    /**
                     * name 打电话
                     * params [电话号码,'']
                     */
                    callPhone: function(params) {
                        return functions.callApi(_Midea_Washer, 'callPhone', params);
                    },
                    /**
                     * name 获取登录信息
                     *    {
                             "_id": "572afba38a92a7cc128ee446",
                             "mobile": "13625041174",
                             "portrait": "78789454545",
                             "nickname": "zmq"
                          }
                     没数据为空
                     */
                    getLoginInfo: function(params) {
                        return functions.callApi(_Midea_Washer, 'getLoginInfo', []);
                    },
                    /**
                     * name 打开登录界面
                     */
                    doLogin: function(params) {
                        return functions.callApi(_Midea_Washer, 'doLogin', []);
                    },
                    // 退出登录
                    logout: function(params) {
                        return functions.callApi(_Midea_Washer, 'logout', []);
                    },
                    /**
                     * name 底部栏跳转
                     * params 0首页，1 订单
                     */
                    switchTab: function(params) {
                        return functions.callApi(_Midea_Washer, 'switchTab', params);
                    },
                    /**
                     * 支付宝支付
                     * @param {Array} 数组项：
                     * out_trade_no 订单ID、
                     * price 支付金额、
                     * body 商品描述
                     */
                    alipay: function(params) {
                        return functions.callApi(_Midea_Washer, 'alipay', params);
                    },
                    /**
                     * 微信支付
                     * @param {Array} 数组项：
                     * out_trade_no 订单ID、
                     * price 支付金额、
                     * body 商品描述
                     */
                    wechatPay: function(params) {
                        return functions.callApi(_Midea_Washer, 'wechatPay', params);
                    },
                    /**
                     * @param params 扫描二维码
                     * @returns {*}
                     */
                    scanningCode: function() {
                        return functions.callApi(_Midea_Washer, 'scanningCode', []);
                    },
                    /**
                     * 自定义方法
                     * 方法名和参数都是字符串
                     * 参数示例：['function1'， ‘funParams’]
                     */
                    doFunction: function(param) {
                        return functions.callApi(_Midea_Washer, 'doFunction', [param.fun, param.params]);
                    },
                    /**
                     * 接收新消息
                     * @params {Boolean}
                     */
                    getNotificationStatus: function(params) {
                        return functions.callApi(_Midea_Washer, 'getNotificationStatus', params);
                    },
                    /**
                     * 声音提醒
                     * @params {Boolean}
                     */
                    setSoundAlert: function(params) {
                        return functions.callApi(_Midea_Washer, 'setSoundAlert', params);
                    },
                    /**
                     * 震动提醒
                     * @params {Boolean}
                     */
                    setShockAlert: function(params) {
                        return functions.callApi(_Midea_Washer, 'setShockAlert', params);
                    },
                    /**
                     * 地图
                     */
                    getMap: function(params) {
                        return functions.callApi(_Midea_Washer, 'getMap', params);
                    },
                    /**
                     * 分享
                     * {String} type 好友，朋友圈，QQ
                     * {String} url 分享页URL
                     * {String} imagePath 图片地址
                     * {String} title 标题
                     * {String} content 内容
                     */
                    share: function(params) {
                        return functions.callApi(_Midea_Washer, 'share', params);
                    },
                    /**
                     * 当前版本
                     */
                    currentVersion: function(params) {
                        return functions.callApi(_Midea_Washer, 'currentVersion', params);
                    },
                    /**
                     * 更新版本
                     **/
                    updateVersion: function(params) {
                        return functions.callApi(_Midea_Washer, 'updateVersion', params);
                    }
                };

                return functions;
            }
        ]);
});
