/**
 * @file 附近洗衣房
 * @author ylp <lping.ye@partner.midea.com.cn>
 * @copyright Midea Co.Ltd 1968-2016
 * @license Released under the Commercial license.
 * @version 2016/04/26
 */
define(['ionic'], function() {
    'use strict';

    return [
        '$scope',
        'cService',
        'myWidgetFactory',
        '$rootScope',
        '$daggerSearch',
        '$timeout',
        '$topTip',
        'baseService',
        'cFactory',
        '$location',
        function($scope, cService, myWidgetFactory, $rootScope, $daggerSearch, $timeout, $topTip, baseService, cFactory, $location) {
            $scope.views = {
                isNear: true, // 先进入 oneWashHome 页 true，home 页 false
                isFirst: false,
                isRequest: false,
                isShowNotDataTips: false, // 是否显示没数据提示
                storeList: null, // 洗衣房列表
                recentlyUsedStoreList: null, // 常用洗衣房
                address: '', // 当前定位
                /**
                 * 定向跳转到 home 页
                 */
                directoryBack: function(item) {
                    localStorage.setItem('storeId', item.id);
                    $rootScope.jump('home');
                },
                refresh: function() {
                    getFindStore();
                },
                // 显示搜索页面及相关处理
                showSearch: function() {
                    $scope.search = function(text) {
                        $scope.searchText = text;
                        $timeout(function() { // 这个是$daggerSearch 的 onSearch 方法
                            $daggerSearch.search(text);
                        });
                    };

                    $scope.selectSearch = function(item) {
                        $scope.views.directoryBack(item);
                        $daggerSearch.hide();
                    };

                    $daggerSearch.show({
                        templateUrl: 'template/search.html',
                        scope: $scope,
                        id: '#LOCAL_HISTORY_KEY@EXAMPLE_OneWashHome',
                        searchText: $scope.searchText,
                        onSearch: function(keyword) {
                            if (!keyword && keyword !== 0) {
                                $topTip('请输入搜索值~~');

                                return;
                            }

                            getFindStore(keyword);
                        }
                    });
                },
                // 扫描二维码
                scanningCode: function() {
                    var result = function(str) {
                        //baseService.items.set('ujing', 'scanning', str);
                        //$rootScope.jump('scanHome', {
                        //    source: 'oneWashHome'
                        //});
                        findDeviceByQrcode(str);
                    };

                    if (ispc) {
                        result('pcTest11111111');
                    } else {
                        myWidgetFactory.scanningCode().then(function(data) {
                            var ios = data && typeof data === 'string';
                            var android = data && typeof data === 'object' && data.text;
                            alert( '扫码返回：' + JSON.stringify(data) );
                            var android = {
                                text: 'sdafasdf',
                                format: 'QR_CODE'
                            };

                            if (ios || android) {
                                result(data.text);
                            } else {
                                $topTip('获取扫描二维码失败！');
                            }
                        });
                    }
                },
                // 显示附近洗衣房列表
                showList: function() {
                    this.isFirst = !this.isFirst;
                    localStorage.setItem('hasLogined', true); // 是否第一次登录，!hasLogined 为没登过，否则有过登陆

                    if ($scope.views.storeList.length === 0) {
                        $rootScope.$broadcast('isWashShowFooter', true);
                    }
                },
                // todo: 待定功能，打开原生地图
                mapShow: function() {
                    var params = location ? [location.longitude, location.latitude] : '';

                    myWidgetFactory.getMap(params).then(function(res) {
                        /**
                         * 地图返回数据格式
                         * @type {{address: string, longitude: number, latitude: number}}
                         */
                        var androidMap = {
                            address: "广东省佛山市顺德区陈村镇碧水轩一街",
                            longitude: 113.222335,
                            latitude: 22.949402
                        };
                        // todo:地图暂时不修改定位
                        /*
                        alert('原生地图返回数据：' + JSON.stringify(res))

                        if (res) {
                            location = res;
                            $scope.views.address = res.address;
                            getFindStore();
                        }
                        */
                    });
                },
                // 刷新定位
                refreshAdress: function() {
                    location = null;
                    getLocationNow(function(coords) {
                        $scope.views.address = coords.address || '未知';
                    });
                }
            };

            var location,
                ispc = window.CONFIGURATION.com.midea.isPcTest;

            /**
             * findDeviceByQrcode 接口取得数据 res.data 的数据格式
             */
            var findDeviceByQrcodeFormat = {
                "_id": "57a3fd65833c832d1269657c",
                "endWorkTime": "2016-08-12T03:00:12.812Z",
                "statusUpdateTime": "2016-08-05T02:43:49.758Z",
                "status": "0",
                "franchiseeId": "57ac4aa00e16db4c493f9bba",
                "virtualId": "17592187230939",
                "no": "01",
                "sn": "0000DA11120651044165172100050000",
                "deviceTypeId": {
                    "_id": "572f27c853b2399024e080ee",
                    "type": "0xDA",
                    "shortName": "波轮机",
                    "__v": 0
                },
                "storeId": {
                    "_id": "57a3fc1c833c832d1269657b",
                    "mobile": "18617051881",
                    "businessEndTime": "23:59",
                    "businessStartTime": "6 5",
                    "address": "北滘镇美的大道6号",
                    "district": "56811581e48d662e5d8083c3",
                    "city": "56811537e48d662e5d807a3b",
                    "province": "568114f5e48d662e5d8079f4",
                    "coordinate": [
                        113.223065,
                        22.938403
                    ],
                    "franchiseeId": "57ac4aa00e16db4c493f9bba",
                    "serviceSubjectId": "57a3fab96e7a4d2612eb82cf",
                    "name": "1楼C118",
                    "enable": true,
                    "approveStatus": "02",
                    "applyTime": "2016-08-05T02:38:20.443Z",
                    "coupons": [],
                    "__v": 0
                },
                "addTime": "2016-08-05T02:43:49.757Z",
                "isSupportScan": true,
                "__v": 0,
                "qrCode": "whghashdjkasgkjasdjk",
                "orderId": "57ad32bf435a3f6c4ed42b1d",
                "shutDownTime": "2016-08-12T03:25:56.183Z",
                "washModelList": [
                    {
                        "deviceTypeId": "572f27c853b2399024e080ee",
                        "storeId": "57a3fc1c833c832d1269657b",
                        "deviceWashModelId": {
                            "_id": "57318775a69be7742970e0c5",
                            "deviceTypeId": "572f27c853b2399024e080ee",
                            "workmodel": "单脱水",
                            "command": "{\"wash_mode\":\"27\",\"wash\":\"1\"}",
                            "basePrice": "0.1",
                            "icon": "",
                            "time": "5min",
                            "description": "单脱水的描述说明",
                            "__v": 0
                        },
                        "washPrice": "0.1",
                        "promotionPrice": "",
                        "promotionStartTime": "",
                        "promotionEndTime": ""
                    },
                    {
                        "deviceTypeId": "572f27c853b2399024e080ee",
                        "storeId": "57a3fc1c833c832d1269657b",
                        "deviceWashModelId": {
                            "_id": "57318775a69be7742970e0c4",
                            "deviceTypeId": "572f27c853b2399024e080ee",
                            "workmodel": "大件洗",
                            "command": "{\"wash_mode\":\"18\",\"wash\":\"1\"}",
                            "basePrice": "0.1",
                            "icon": "",
                            "time": "15min",
                            "description": "大件洗的描述说明",
                            "__v": 0
                        },
                        "washPrice": "0.1",
                        "promotionPrice": "",
                        "promotionStartTime": "",
                        "promotionEndTime": ""
                    },
                    {
                        "deviceTypeId": "572f27c853b2399024e080ee",
                        "storeId": "57a3fc1c833c832d1269657b",
                        "deviceWashModelId": {
                            "_id": "57318775a69be7742970e0c3",
                            "deviceTypeId": "572f27c853b2399024e080ee",
                            "workmodel": "快速洗",
                            "command": "{\"wash_mode\":\"1\",\"wash\":\"1\"}",
                            "basePrice": "0.2",
                            "icon": "",
                            "time": "8min",
                            "description": "快速洗的描述说明",
                            "__v": 0
                        },
                        "washPrice": "0.2",
                        "promotionPrice": "",
                        "promotionStartTime": "",
                        "promotionEndTime": ""
                    },
                    {
                        "deviceTypeId": "572f27c853b2399024e080ee",
                        "storeId": "57a3fc1c833c832d1269657b",
                        "deviceWashModelId": {
                            "_id": "57318775a69be7742970e0c2",
                            "deviceTypeId": "572f27c853b2399024e080ee",
                            "workmodel": "标准洗",
                            "command": "{\"wash_mode\":\"0\",\"wash\":\"1\"}",
                            "basePrice": "0.1",
                            "icon": "",
                            "time": "15min",
                            "description": "标准洗的描述说明",
                            "__v": 0
                        },
                        "washPrice": "0.1",
                        "promotionPrice": "",
                        "promotionStartTime": "",
                        "promotionEndTime": ""
                    }
                ]
            };
            // 扫码获取洗衣房详情
            var findDeviceByQrcode = function(qrcode) {

                if (ispc) {
                    baseService.items.set('ujing', 'scanning', findDeviceByQrcodeFormat);
                    $rootScope.jump('scanHome', {
                        source: 'oneWashHome'
                    });
                } else {
                    cService.findDeviceByQrcode({
                        qrcode: qrcode
                    }).then(function(res) {
                        /*   $scope.views.isRequest = true;

                         if (res && res.result == 1 && res.data) {
                         //$scope.views.store = res.data;
                         result(res.data);
                         } else {
                         $topTip(res.msg);
                         $scope.views.directoryBack();
                         }*/
                        if (res && res.result === 1 && res.data) {
                            baseService.items.set('ujing', 'scanning', res.data);
                            $rootScope.jump('scanHome', {
                                source: 'oneWashHome'
                            });
                        } else {
                            $topTip(res.msg);
                        }
                    });
                }
            };

            // 获取手机定位
            var getLocationNow = function(callback) {
                var failure = function() {
                    cFactory.alert('抱歉~~获取地址失败！请先开启定位在打开应用').then(function() {
                        $rootScope.exit();
                    });
                };

                if (location) {
                    return callback(location);
                }

                return cService.getLocationNow().then(function(res) {
                    if (res && res.latitude && res.longitude) {
                        location = res;
                        callback(location);
                    } else {
                        failure();
                    }
                }, failure);
            };

            // 从接口获取洗衣房列表
            var getFindStore = function(keyword) {
                $scope.views.searchData = [];
                $scope.views.storeList = [];
                $scope.views.recentlyUsedStoreList = [];

                var storeList = [],
                    recentlyList = [],
                    params = {};

                getLocationNow(function(coords) {
                    params.lat = coords.latitude;
                    params.lont = coords.longitude;
                    $scope.views.address = coords.address || '未知';

                    params.keyword = !keyword ? '' : keyword;

                    cService.storeFindStore(params).then(function(res) {
                        $scope.views.isRequest = true;

                        if (res && res.result === 1 && res.data) {
                            storeList = res.data.storeList || [];
                            recentlyList = res.data.recentlyUsedStoreList || [];

                            $scope.views.recentlyUsedStoreList = recentlyList; // 最近使用用的洗衣房

                            // 附近没有洗衣房时的处理
                            if (storeList.length === 0) {
                                if (keyword) {
                                    $topTip('暂无相关信息~~');
                                    $scope.searchData = [];
                                } else {
                                    $topTip('暂无相关信息~~');

                                    if ($location.path().slice(1) == 'oneWashHome' && !!localStorage.getItem('hasLogined')) {
                                        $rootScope.$broadcast('isWashShowFooter', true);
                                    }
                                }
                            } else {
                                if (keyword) {
                                    $scope.views.searchData = storeList;
                                } else {
                                    $scope.views.storeList = storeList;
                                }
                            }
                        } else {
                            $topTip('附近暂无洗衣房信息！');

                            if ($location.path().slice(1) == 'oneWashHome' && !!localStorage.getItem('hasLogined')) {
                                $rootScope.$broadcast('isWashShowFooter', true);
                            }
                        }

                        $scope.$broadcast('scroll.refreshComplete');
                    }, function() {
                        $topTip('数据获取失败！请检查网络后重试');
                    });
                });
            };

            var init = function() {
                var storeId = localStorage.getItem('storeId'), // null 或 'undefined'
                    hasLogined = localStorage.getItem('hasLogined'),
                    router = $location.path().slice(1);

                // 第一次登录，没有 storeId，没有 hasLogined
/*                if (!hasLogined || (hasLogined && !storeId)) {
                    return console.log( 1 );
                    if (router === 'oneWashHome') {
                        //$scope.views.isNear = hasLogined;
                        $scope.views.isNear = false;
                        $scope.views.isFirst = hasLogined;
                        $rootScope.$broadcast('isWashShowFooter', true);
                        return getFindStore();
                    }

                    if (router === 'list') {
                        $topTip('获取洗衣房出错！');

                        return $rootScope.jump('oneWashHome');
                    }
                }*/
                // 首次进入，没 hasLogined，没 storeId
                if (!hasLogined && hasLogined !== 'false'){
                //if (hasLogined === null || hasLogined === 'false' || !hasLogined){
                    console.log(1)
                    $scope.views.isNear = true;
                    $scope.views.isFirst = true;

                    return getFindStore();
                }

                // 之前有过登录，有 storeId，有 hasLogined
                if (!!storeId && storeId !== 'undefined'){
                //if (storeId !== null || storeId !== 'undefined' || !!storeId){
                    console.log( 2 );
                    if (router === 'oneWashHome') {
                        $scope.views.isNear = false;
                        $scope.views.isFirst = false;

                        return $rootScope.jump('home');
                    }

                    if (router === 'list') {
                        //location = baseService.items.get('location', 'location');
                        //$scope.views.address = !location ? '未知' : location.address;
console.log( '-----------------------------------')
                        return getFindStore();
                    }
                }

                // 处理有 hasLogined，没 storeId
                if (router === 'oneWashHome') {
                    console.log(3)
                    $scope.views.isNear = true;
                    $scope.views.isFirst = false;
                    //$rootScope.$broadcast('isWashShowFooter', true);
                }
                return getFindStore();
            };

            init();

            $scope.$apply();
        }
    ]});
