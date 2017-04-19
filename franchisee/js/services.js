/**
 * Created by Administrator on 2014/11/21.
 */
/* global CONFIGURATION */
define(['angular', 'lib/js/main/services'], function(angular) {
    var
        BASE = CONFIGURATION.com.midea.methods;

    'use strict';

    /* Services */
    angular.module('cApp.services', ['mApp.services'],
        function($httpProvider) {
            $httpProvider.defaults.headers = {
                'Content-Type': 'text/xml;UTF-8,application/x-www-form-urlencoded',
                'X-Requested-With': 'XMLHttpRequest',
                Accept: 'application/xml'
            };
        })
        // 自定义factory
        .factory('cFactory', [
            '$ionicPopup',
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
                    },
                    removePopup: function() {
                        if (this.commPopup) {
                            this.commPopup.close();
                        }
                    }
                };

                return funs;
            }
        ])
        .service('cService', [
            'baseService',
            'widgetFactory',
            '$q',
            'log',
            'myWidgetFactory',
            function(baseService, widgetFactory, $q, log, myWidgetFactory) {
                var BASE = window.CONFIGURATION.com.midea;

                var services = {
                    // 确保有登录
                    hasLogin: function(callback) {
                        /*
                        BASE.user = localStorage.getItem('userFranchisee') && JSON.parse(localStorage.getItem('userFranchisee'));
                        // 有登陆
                        if (BASE.user && BASE.user.cookie) {
                            BASE.cookie = BASE.user.cookie;
                            callback && callback(BASE.user);
                        } else {
                            // 获取用户信息
                            myWidgetFactory.getLoginInfo().then(function(res) {
                                if (res && res.cookie) {
                                    BASE.user = res;
                                    BASE.cookie = res.cookie;
                                    //baseService.items.set('loginInfo', 'loginInfo', res);
                                    localStorage.setItem('userFranchisee', JSON.stringify(res));
                                    callback && callback(res);
                                } else {
                                    // 拉起原生登录
                                    myWidgetFactory.doLogin().then(function(res) {});
                                }
                            });
                        }
                        */
                        if (BASE.isPcTest) {
                            var user = localStorage.getItem('userFranchisee');
                            BASE.user = JSON.parse(user);
                            BASE.cookie = JSON.parse(user).cookie;

                            return callback && callback(BASE.user);
                        }

                        console.log('进了 hasLogin:')
                        // 获取用户信息
                        myWidgetFactory.getLoginInfo().then(function(res) {
                            console.log('获取用户信息:', res);
                            if (res && res.cookie) {
                                BASE.user = res;
                                BASE.cookie = res.cookie;
                                baseService.items.set('loginInfo', 'loginInfo', res);
                                //localStorage.setItem('userFranchisee', JSON.stringify(res));
                                callback && callback(res);
                            } else {
                                cordova.exit();
                                // 拉起原生登录
                                myWidgetFactory.doLogin().then(function(res) {});
                            }
                        });
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

                        //services.hasLogin(); // 防止原生更换账户

                        console.log('request:', BASE.cookie)
                        if (!BASE.cookie) {
                            services.hasLogin();
                        }

                        option.headers = {
                            'Content-Type': 'text/xml;UTF-8,application/x-www-form-urlencoded',
                            'cke': BASE.cookie
                        };
                        params.isManager = BASE.user.isManager;

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

                        if (!BASE.isMock) {
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
                        return services.getUser().then(function (respond) {
                                // 设置uid和token
                                services.setLoginName(respond, params);
                                services.setToken(respond, params);

                                // 根据不同的请求方式，使用不同的请求方法
                                if (config.method == 'POST_FORMDATA') {
                                    var fd = new FormData();

                                    for (var i in params) {
                                        fd.append(i, params[i]);
                                    }

                                    return $q.when(baseService.postJsonData(url, fd, config))
                                        .then(function (result) {
                                            return result.data;
                                        }, logError);
                                } else if (config.method === 'POST_PAYLOAD') {
                                    delete config.method;

                                    return $q.when(baseService.postFormDataByPayload(url, params, config))
                                        .then(function (result) {
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
                                        .then(function (result) {
                                            return result.data;
                                        }, logError);
                                } else if (config.method == 'get') {

                                    //config = angular.extend(config, {
                                    //    headers: {
                                    //        'Content-Type': 'text/xml;UTF-8,application/x-www-form-urlencoded',
                                    //        'cke': window.CONFIGURATION.com.midea.cookie
                                    //    }
                                    //});
                                    return $q.when(baseService.getDataByGet(url, params, config))
                                        .then(function (result) {
                                            return result.data;
                                        }, logError);
                                } else if (config.method == 'json') {
                                    return $q.when(baseService.getJsonData(key, params, config))
                                        .then(function (result) {
                                            return result.data;
                                        }, logError);
                                } else if (config.method !== 'JSONP') {
                                    params.url = url;
                                    angular.extend(params, config);

                                    return $q.when(baseService.getData(params))
                                        .then(function (result) {
                                            // 你可以在这里定义返回的数据
                                            return result.data;
                                        }, logError);
                                } else {
                                    // JSONP
                                    angular.extend(config, {
                                        customCallback: 'callback',
                                    });

                                    return $q.when(baseService.getJsonPData(url, params, config))
                                        .then(function (result) {
                                            return result.data;
                                        }, logError);
                                }
                            });
                    },
                    post: function(key, params, option) {
                        var config = option || {};

                        config = angular.extend({
                            method: 'POST_PAYLOAD'
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
                     * 省市列表
                     * @returns {*}
                     */
                    getProvinceCities: function(params) {
                        var params = params || {};

                        return services.request('getProvinceCities', params);
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
                                longitude: 113.223065,
                                province: '广东省',
                                street: '怡和路'
                            };

                            defer.resolve(mapData);
                        } else {
                            return $q.when(widgetFactory.location()).then(function(value) {
                                // longitude(经度) + latitude（纬度）
                                // type的可选值为：gps:原始坐标系；baidu：百度经纬度；mapbar：图吧经纬度；
                                //console.log( '定位值：-----------------', value );
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
                    getMapSearchkeyWord: function(keyWord) {
                        var url = BASE.mapUrl + keyWord;

                        return services.request(url, {}, {
                            method: 'JSONP'
                        });
                    },
                    /**
                     * 创建管理人员
                     */
                    addManager: function(params) {
                        var params = params || {},
                            url = BASE.baseUrl + BASE.methods.addManager;

                        params.ssoToken = BASE.ssoTokenPlaceholder;

                        return services.post(url, params);
                    },
                    /**
                     * 管理人员列表
                     */
                    getManagerList: function(params) {
                        var params = params || {},
                            url = BASE.baseUrl + BASE.methods.getManagerList;

                        params.ssoToken = BASE.ssoTokenPlaceholder;

                        return services.get(url, params);
                    },
                    /**
                     * 管理人员信息修改
                     */
                    updateManagerInfo: function(params) {
                        var params = params || {},
                            url = BASE.baseUrl + BASE.methods.updateManagerInfo;

                        params.ssoToken = BASE.ssoTokenPlaceholder;

                        return services.post(url, params);
                    },
                    /**
                     * 删除管理人员
                     */
                    removeManager: function(params) {
                        var params = params || {},
                            url = BASE.baseUrl + BASE.methods.removeManager;

                        params.ssoToken = BASE.ssoTokenPlaceholder;

                        return services.post(url, params);
                    },
                    /**
                     * 获取消息
                     */
                    getMessageList: function(params) {
                        var params = params || {},
                            url = BASE.baseUrl + BASE.methods.getMessageList;

                        params.ssoToken = BASE.ssoTokenPlaceholder;

                        return services.get(url, params);
                    },
                    /**
                     * 删除消息
                     */
                    deleteMessage: function(params) {
                        var params = params || {},
                            url = BASE.baseUrl + BASE.methods.deleteMessage;



                        return services.get(url, params);
                    },
                    /**
                     * 获取服务主体列表
                     */
                    getServiceSubjectList: function(params) {
                        var params = params || {},
                            url = BASE.baseUrl + BASE.methods.getServiceSubjectList;

                        

                        return services.get(url, params);
                    },
                    /**
                     * 删除服务主体
                     * @params id
                     */
                    removeServiceSubject: function(id) {
                        var params = {
                                id: id
                            },

                            url = BASE.baseUrl + BASE.methods.removeServiceSubject;



                        return services.post(url, params);
                    },
                    /**
                     * 获取所有设备信息
                     */
                    getDeviceList: function(params) {
                        var params = params || {},
                            url = BASE.baseUrl + BASE.methods.getDeviceList;

                        params.ssoToken = BASE.ssoTokenPlaceholder;

                        return services.get(url, params);
                    },
                    /**
                     * 设备绑定二维码
                     */
                    bindQrcode: function(params) {
                        var params = params || {},
                            url = BASE.baseUrl + BASE.methods.bindQrcode;

                        params.ssoToken = BASE.ssoTokenPlaceholder;

                        return services.post(url, params);
                    },
                    /**
                     * 设备二维码解除绑定
                     */
                    unbindQrcode: function(params) {
                        var params = params || {},
                            url = BASE.baseUrl + BASE.methods.unbindQrcode;

                        params.ssoToken = BASE.ssoTokenPlaceholder;

                        return services.post(url, params);
                    },
                    /**
                     * 修改设备信息
                     */
                    updateDeviceInfo: function(params) {
                        var params = params || {},
                            url = BASE.baseUrl + BASE.methods.updateDeviceInfo;

                        params.ssoToken = BASE.ssoTokenPlaceholder;

                        return services.post(url, params);
                    },
                    /**
                     * 紧急停机
                     */
                    stop: function(params) {
                        var params = params || {},
                            url = BASE.baseUrl + BASE.methods.stop;

                        params.ssoToken = BASE.ssoTokenPlaceholder;

                        return services.post(url, params);
                    },
                    /**
                     * 重新启动
                     */
                    restart: function(params) {
                        var params = params || {},
                            url = BASE.baseUrl + BASE.methods.restart;

                        params.ssoToken = BASE.ssoTokenPlaceholder;

                        return services.post(url, params);
                    },
                    /**
                     * 禁用设备
                     */
                    disable: function(params) {
                        var params = params || {},
                            url = BASE.baseUrl + BASE.methods.disable;

                        params.ssoToken = BASE.ssoTokenPlaceholder;

                        return services.post(url, params);
                    },
                    /**
                     * 启用设备
                     */
                    reused: function(params) {
                        var params = params || {},
                            url = BASE.baseUrl + BASE.methods.reused;

                        params.ssoToken = BASE.ssoTokenPlaceholder;

                        return services.post(url, params);
                    },
                    /**
                     * 获取优惠券列表
                     *
                     */
                    getCouponList: function(params) {
                        var params = params || {},
                            url = BASE.baseUrl + BASE.methods.getCouponList;

                        params.ssoToken = BASE.ssoTokenPlaceholder;

                        return services.get(url, params);
                    },
                    /**
                     * 获取主体下的洗衣房
                     *
                     */
                    getStoreList: function(params) {
                        var params = params || {},
                            url = BASE.baseUrl + BASE.methods.getStoreList;

                        params.ssoToken = BASE.ssoTokenPlaceholder;

                        return services.get(url, params);
                    },
                    /**
                     * 地址
                     * @params {number} "": 身份数据 “1”: 城市数据，“2”: 区域数据
                     */
                    getAddressData: function(params) {
                        var params = params || {},
                            url = BASE.baseUrl + BASE.methods.getAddressData;

                        params.ssoToken = BASE.ssoTokenPlaceholder;

                        return services.get(url, params);
                    },
                    /**
                     * 添加服务主体
                     * @params {number} "": 身份数据 “1”: 城市数据，“2”: 区域数据
                     */
                    addServiceSubject: function(params) {
                        var params = params || {},
                            url = BASE.baseUrl + BASE.methods.addServiceSubject;

                        params.ssoToken = BASE.ssoTokenPlaceholder;

                        return services.post(url, params);
                    },
                    /**
                     * 获取基础数据
                     *
                     */
                    getBaseData: function(params) {
                        var params = params || {},
                            url = BASE.baseUrl + BASE.methods.getBaseData;

                        params.ssoToken = BASE.ssoTokenPlaceholder;

                        return services.get(url, params);
                    },
                    /**
                     * 添加设备
                     *
                     */
                    addDevice: function(params) {
                        var params = params || {},
                            url = BASE.baseUrl + BASE.methods.addDevice;

                        return services.post(url, params);
                    },
                    /**
                     * 获取所有洗衣房
                     *
                     */
                    getAllStore: function(params) {
                        var params = params || {},
                            url = BASE.baseUrl + BASE.methods.getAllStore;

                        params.ssoToken = BASE.ssoTokenPlaceholder;

                        return services.get(url, params);
                    },
                    /**
                     * 获取洗衣房下的设备
                     *
                     */
                    getLaundryDeviceList: function(params) {
                        var params = params || {},
                            url = BASE.baseUrl + BASE.methods.getLaundryDeviceList;

                        params.ssoToken = BASE.ssoTokenPlaceholder;

                        return services.get(url, params);
                    },
                    /**
                     * 返券
                     *
                     */
                    payCoupon: function(params) {
                        var params = params || {},
                            url = BASE.baseUrl + BASE.methods.payCoupon;

                        params.ssoToken = BASE.ssoTokenPlaceholder;

                        return services.post(url, params);
                    },
                    /**
                     * 删除洗衣房
                     */
                    removeStore: function(params) {
                        var params = params || {},
                            url = BASE.baseUrl + BASE.methods.removeStore;

                        params.ssoToken = BASE.ssoTokenPlaceholder;

                        return services.post(url, params);
                    },
                    /**
                     * 添加洗衣房
                     */
                    addStore: function(params) {
                        var params = params || {},
                            url = BASE.baseUrl + BASE.methods.addStore;

                        params.ssoToken = BASE.ssoTokenPlaceholder;

                        return services.post(url, params);
                    },
                    /**
                     * 获取订单详情
                     */
                    getOrder: function(params) {
                        var params = params || {},
                            url = BASE.baseUrl + BASE.methods.getOrder;

                        params.ssoToken = BASE.ssoTokenPlaceholder;

                        return services.get(url, params);
                    },
                    /**
                     * 过期卡券
                     */
                    getExpireCouponList: function(params) {
                        var params = params || {},
                            url = BASE.baseUrl + BASE.methods.getExpireCouponList;

                        params.ssoToken = BASE.ssoTokenPlaceholder;

                        return services.get(url, params);
                    },
                    /**
                     * 添加卡券
                     */
                    addCoupon: function(params) {
                        var params = params || {},
                            url = BASE.baseUrl + BASE.methods.addCoupon;

                        params.ssoToken = BASE.ssoTokenPlaceholder;

                        return services.post(url, params);
                    },
                    /**
                     * 获取洗衣房洗衣程序价格
                     *
                     */
                    getWashPrice: function(params) {
                        var params = params || {},
                            url = BASE.baseUrl + BASE.methods.getWashPrice;

                        params.ssoToken = BASE.ssoTokenPlaceholder;

                        return services.get(url, params);
                    },
                    /**
                     * 设定洗衣房洗衣程序价格
                     *
                     */
                    setWashPrice: function(params) {
                        var params = params || {},
                            url = BASE.baseUrl + BASE.methods.setWashPrice;

                        params.ssoToken = BASE.ssoTokenPlaceholder;

                        return services.post(url, params);
                    },
                    /**
                     * 经营总统计，获取收入和订单总的统计数据
                     *
                     */
                    statistics: function(params) {
                        var params = params || {},
                            url = BASE.baseUrl + BASE.methods.statistics;

                        params.ssoToken = BASE.ssoTokenPlaceholder;

                        return services.get(url, params);
                    },
                    /**
                     * 分类统计，按洗衣机分类统计收入和订单
                     */
                    classifiedStatistics: function(params) {
                        var params = params || {},
                            url = BASE.baseUrl + BASE.methods.classifiedStatistics;

                        params.ssoToken = BASE.ssoTokenPlaceholder;

                        return services.get(url, params);
                    },
                    /**
                     * 洗衣房信息修改
                     */
                    updateStoreInfo: function(params) {
                        var params = params || {},
                            url = BASE.baseUrl + BASE.methods.updateStoreInfo;

                        params.ssoToken = BASE.ssoTokenPlaceholder;

                        return services.post(url, params);
                    },
                    /**
                     * 修改已创建的服务主体信息
                     * @param params
                     * @returns {*}
                     */
                    updateServiceSubjectInfo: function(params) {
                        var params = params || {},
                            url = BASE.baseUrl + BASE.methods.updateServiceSubjectInfo;

                        params.ssoToken = BASE.ssoTokenPlaceholder;

                        return services.post(url, params);
                    },
                    /**
                     * 登录
                     */
                    userLogin: function(params) {
                        var params = params || {},
                            url = BASE.baseUrl + BASE.methods.userLogin;

                        params.ssoToken = BASE.ssoTokenPlaceholder;

                        return services.get(url, params);
                    },
                    /**
                     * 问题列表
                     * @param params
                     */
                    getHelpList: function(params) {
                        var params = params || {},
                            url = BASE.baseUrl + BASE.methods.getHelpList;

                        return services.get(url, params);
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
                    _Midea_Franchisee = 'MideaFranchisee',
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
                                //log('_error', 'widget error:', e);
                                defer.reject(e);
                            }
                        } else {
                            //log('_debug', 'Cordova is not exist');
                            defer.reject('Cordova is not exist');
                        }

                        return defer.promise;
                    },
                    /**
                     * name 打电话
                     * params [电话号码,'']
                     */
                    callPhone: function(params) {
                        return functions.callApi(_MIDEA_COMMON, 'callPhone', params);
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
                        return functions.callApi(_Midea_Franchisee, 'getLoginInfo', []);
                    },
                    /**
                     * name 打开登录界面
                     */
                    doLogin: function(params) {
                        return functions.callApi(_Midea_Franchisee, 'doLogin', []);
                    },
                    /**
                     * @param params 扫描二维码
                     * @returns {*}
                     */
                    scanningCode: function() {
                        return functions.callApi(_Midea_Franchisee, 'scanningCode', []);
                    },
                    /*
                     * 自定义方法
                     * 方法名和参数都是字符串
                     * 参数示例：['function1'， ‘funParams’]
                     * */
                    doFunction: function(param) {
                        return functions.callApi(_Midea_Franchisee, 'doFunction', [param.fun, param.params]);
                    },
                    /**
                     * 地图
                     */
                    getMap: function(params) {
                        return functions.callApi(_Midea_Franchisee, 'getMap', params);
                    },
                    /**
                     * 配网
                     */
                    registerDevice: function(params) {
                        return functions.callApi(_Midea_Franchisee, 'registerDevice', params);
                    }
                };

                return functions;
            }
        ]);
});
