/**
 * @file U净 home 页控
 * @author ytp <tianping.yan@partner.midea.com.cn>
 * @copyright Midea Co.Ltd 1968-2016
 * @license Released under the Commercial license.
 * @version 16/4/21
 */
define(['ionic', 'js/swiper.min'], function() {
    'use strict';

    return [
        '$rootScope',
        '$scope',
        'cService',
        '$ionicPopup',
        '$ionicActionSheet',
        '$timeout',
        '$ionicTabsDelegate',
        '$ionicModal',
        '$ionicScrollDelegate',
        'baseService',
        '$topTip',
        'cFactory',
        'myWidgetFactory',
        '$stateParams',
        '$location',
        function($rootScope, $scope, cService, $ionicPopup, $ionicActionSheet, $timeout, $ionicTabsDelegate, $ionicModal, $ionicScrollDelegate, baseService, $topTip, cFactory, myWidgetFactory, $stateParams, $location) {
            $scope.views = {
                isRequest: false, // 请求接口是否完成
                store: null, // 洗衣房数据
                deviceObj: null, // 单个设备对象
                deviceList: [], // 设备列表
                deviceIndex: 0,
                washList: [], // 洗衣模式列表
                washIndex: 0,
                order: {
                    isDry: false, // 是否为干衣机
                    slideList: ['10','20','30','40','50','60','70','80','90','100','110','120'], // 滑动组件数据
                    slideItem: '40min'// 初始滑动数据
                },
                isMalDevice: false, // 故障提醒
                // tabs 切换
                tabsToggle: function(index) {
                    deviceIndex = index;
                    this.deviceIndex = index;
                    this.order.isDry = this.deviceList[index] && this.deviceList[index].shortName === '干衣机';
                    $ionicTabsDelegate.select(index);
                    $ionicScrollDelegate.$getByHandle('small').resize();
                },
                // 洗衣模式的描述说明
                showDescription: function(item) {
                    // 清除前一个指令器
                    if (timer) {
                        $timeout.cancel(timer);

                        oldItem.isShowModel = false;
                    }

                    oldItem = item;
                    item.isShowModel = true;

                    timer = $timeout(function() {
                        item.isShowModel = false;
                    }, 6000);
                },
                // 预定
                reserveShow: function(event, item) {
                    var self = this;
                    event.stopPropagation();

                    // 显示 modal
                    var setReserveModal = function() {
                        self.order.shortName = !self.deviceObj ? self.deviceList[self.deviceIndex].shortName : self.deviceObj.shortName;

                        self.order.workmodel = item.deviceWashModelId.workmodel;
                        self.order.icon = item.deviceWashModelId.icon;
                        $scope.views.order.deviceTypeId = item.deviceTypeId;
                        $scope.views.order.deviceWashModelId = item.deviceWashModelId._id;
                        self.order.time = item.deviceWashModelId.time + 'min';
                        self.order.slideTime = self.order.time;
                        self.order.basePrice = item.promotionPrice || item.washPrice || item.deviceWashModelId.basePrice;
                        self.order.promotionPrice = item.promotionPrice;
                        self.order.payPrice = !item.promotionPrice ? self.order.basePrice : item.promotionPrice;

                        if (self.order.shortName === '干衣机') {
                            self.order.isDry = true;
                            self.order.slideTime = self.order.slideItem;
                            self.order.payPrice = self.order.basePrice * parseInt(self.order.slideTime);
                            self.order.payPrice /= 10;

                            if (swiperLevel) {
                                swiperLevel.slideTo(3, 0, false); // 默认到哪里
                            } else {
                                showLevel(); // 滚动选择框
                            }
                        }

                        $scope.reserve.show();
                    };

                    // 确保有登录
                    cService.userInfo(function() {
                        setReserveModal();
                    });
                },
                // 关闭 reserve
                reserveRemove: function() {
                    $scope.reserve.hide();
                },
                // 预订提交
                reservePay: function() {
                    createOrder();
                },
                // 打电话
                tel: function() {
                    var mobile = this.store.mobile || this.store.storeId.mobile;

                    if (!mobile) {
                        $topTip('没有可拨打的电话号码！');

                        return;
                    }

                    //var hideSheet =
                    $ionicActionSheet.show({
                        cssClass: 'ionic-action-tel',
                        buttons: [
                            {
                                text: '<b>' + mobile + '</b>'
                            }
                        ],
                        cancelText: '取消',
                        cancel: function() {
                            // 点击取消按钮操作
                        },
                        buttonClicked: function() {
                            myWidgetFactory.callPhone([mobile]).then();

                            //return true;
                        }
                    });
                    //$timeout(hideSheet, 3000);
                },
                // 预订提醒
                setAppointmentReminder: function() {
                    if (!$scope.views.deviceList || $scope.views.deviceList.length === 0) {
                        return;
                    }

                    var activeTab = $scope.views.deviceList[$scope.views.deviceIndex],
                        params = {
                            storeId: $scope.views.store._id, // 洗衣房ID
                            deviceType: activeTab && activeTab.washModelList[0] && activeTab.washModelList[0].deviceTypeId // 设备类型ID
                        };

                    var request = function() {
                            cService.setAppointmentReminder(params).then(function(res) {
                                if (res && res.result === 1) {
                                    $topTip('预订成功！');
                                } else {
                                    $topTip(res.msg);
                                }
                            }, function() {
                                $topTip('网络连接失败！');
                            });
                        };

                    cService.userInfo(request);
                },
                // 处理故障
                detailMalDevice: function() {
                    myWidgetFactory.switchTab([1]);
                },
                // 扫码
                scanningCode: function() {
                    var result = function(str) {
                        findDeviceByQrcode(str);
                        /*
                        baseService.items.set('ujing', 'scanning', str);
                        $rootScope.jump('scanHome', {
                            source: 'home'
                        });
                        */
                    };

                    if (ispc) {
                        result('pcTest11111111');
                    } else {
                        myWidgetFactory.scanningCode().then(function(data) {
                            var ios = data && typeof data === 'string';
                            var android = data && typeof data === 'object' && data.text;
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
                // 切换洗衣房
                switchStore: function() {
                    // 手机定位 getLocationNow() 获取到的数据格式
                    var location = {
                        address: $scope.views.store.address,
                        latitude: $scope.views.store.coordinate[1],
                        longitude: $scope.views.store.coordinate[0]
                    };

                    baseService.items.set('location', 'location', location);

                    $rootScope.jump('list', {
                        id: $scope.views.store._id
                    })
                },
                // 刷新页面
                refresh: function() {
                    init();
                },
                /**
                 * 定向跳转
                 * @param router {String} 路由，有参数则为跳向 message 页、list 页，无参数则为返回
                 */
                directoryBack: function(router) {
                    if (!router) {
                        var router = $location.search().source;

                        return !router ? $rootScope.goBack() : $rootScope.jump(router);
                    }

                    var source = !this.deviceObj ? 'home' : 'scanHome';

                    if (router === 'message') {
                        return cService.userInfo(function() {
                            $rootScope.jump(router, {
                                source: source
                            });
                        });
                    }

                    if (router === 'list') {
                        var location = {
                            address: $scope.views.store.address,
                            latitude: $scope.views.store.coordinate[1],
                            longitude: $scope.views.store.coordinate[0]
                        };
                        baseService.items.set('location', 'location', location);
                        //baseService.items.del('qrcode', 'qrcode');
                        baseService.items.del('ujing', 'scanning');

                        return $rootScope.jump('list');
                    }
                }
            };

            var ispc = window.CONFIGURATION.com.midea.isPcTest,
                isScanhome = false,
                deviceIndex = 0,
                storeId = '', // 洗衣房ID
                timer = null, // 计时器
                oldItem = null, // 点击计时器的前一个选项
                swiperLevel = null;

            // 滑动组件
            var showLevel = function() {
                $timeout(function() {
                    swiperLevel = new Swiper('.swiper-level-container', {
                                pagination: '.swiper-level-pagination',
                                slidesPerView: 5, // 分成多少个1屏
                                speed: 100,
                                centeredSlides: true, // 默认第一块居左，设置为true后居中
                                paginationClickable: false, // 点击那三个小点
                                spaceBetween: 0,
                                initialSlide: 2, // 跳到第几个（单位px）
                                loop: false, // 循环切换的
                                slideToClickedSlide: true,
                                onSlideChangeEnd: function(swiper) {
                                    $scope.views.order.slideTime = $scope.views.order.slideList[swiper.activeIndex] + 'min';
                                    $scope.views.order.payPrice = $scope.views.order.basePrice * parseInt($scope.views.order.slideTime);
                                    $scope.views.order.payPrice /= 10;
                                    $timeout(function() {
                                        if (swiperLevel && swiperLevel.update) {
                                            swiperLevel.update();
                                        }
                                    }, 0);
                        }
                    });
                }, 0);

                $timeout(function() {
                    if (swiperLevel && swiperLevel.update) {
                        swiperLevel.update();
                    }
                    swiperLevel.slideTo(3, 0, false); // 默认到哪里
                }, 50);
            };

            // 创建订单
            var createOrder = function() {
                var user = JSON.parse(localStorage.getItem('loginInfo'));

                var params = {
                    storeId: $scope.views.store._id,
                    // deviceId: washPay.deviceTypeId,扫码洗衣传入，普通洗衣不需要
                    //deviceTypeId: $scope.views.order.deviceTypeId,
                    deviceWashModelId: $scope.views.order.deviceWashModelId,
                    washPrice: $scope.views.order.basePrice,
                    payPrice: $scope.views.order.payPrice,
                    promotionPrice: $scope.views.order.promotionPrice,
                    mobile: user.mobile,
                    orderType: 'A',
                    serviceSubjectId: $scope.views.store.serviceSubjectId
                };

                if (isScanhome) {
                    params.devceId = $scope.views.deviceObj._id;
                } else {
                    params.deviceTypeId = $scope.views.order.deviceTypeId;
                }

                if ($scope.views.order.isDry) {
                    params.dryTime = parseInt($scope.views.order.slideTime);
                }


                cService.createOrder(params).then(function(res) {
                    $scope.reserve.hide();

                    if (res && res.result == 1) {
                        //baseService.items.set('payOrder', 'payOrder', params);
                        $rootScope.jump('order');
                    } else if (res && res.result == 250) {
                        cFactory.confirm('您还有一笔未付款订单，是否立即付款', '查看订单', '取消').then(function(res) {
                            if (res) {
                                $rootScope.jump('order');
                            }
                        });
                    } else {
                        $topTip(res.msg);
                        init();
                        //getStoreDetail(params.storeId);
                    }


                    // 创建订单后更新详情状态
                    $rootScope.$broadcast('updateStoreDetail');
                });
            };

            /**
             * getStoreDetail 接口取得数据 res.data 的数据格式
             */
            var getStoreDetailFormat = {
                '_id': '57c683fc7dd202af588f2136',
                'mobile': '18617051881',
                'businessEndTime': '23:59',
                'businessStartTime': '00:00',
                'address': '美的大道',
                'district': '56811581e48d662e5d8083c3',
                'city': '56811537e48d662e5d807a3b',
                'province': '568114f5e48d662e5d8079f4',
                'coordinate': [
                    113.223065,
                    22.938403
                ],
                'franchiseeId': '57ac4aa00e16db4c493f9bba',
                'serviceSubjectId': '57c68247985de0a8584862ae',
                'name': '1楼自定义',
                'isRemoved': false,
                'enable': true,
                'approveStatus': '02',
                'applyTime': '2016-08-31T07:15:08.143Z',
                'coupons': [],
                '__v': 0,
                'approveBy': '13425709275',
                'deviceList': [
                    {
                        'shortName': '干衣机',
                        'icon': '',
                        'free': 0,
                        'washModelList': [
                            {
                                'deviceTypeId': '572f27c853b2399024e080f0',
                                'storeId': '57c683fc7dd202af588f2136',
                                'deviceWashModelId': {
                                    '_id': '573188bf53218d6436f09b5b',
                                    'deviceTypeId': '572f27c853b2399024e080f0',
                                    'workmodel': '普通烘',
                                    'command': "{'wash_mode':'1','dewatering_speed':'4','temperature':'3','wash':'1'}",
                                    'basePrice': '0.1',
                                    'icon': '',
                                    'time': '10',
                                    'description': '标准烘的描述说明',
                                    '__v': 0
                                },
                                'washPrice': '0.1',
                                'promotionPrice': '',
                                'promotionStartTime': '',
                                'promotionEndTime': ''
                            },
                            {
                                'deviceTypeId': '572f27c853b2399024e080f0',
                                'storeId': '57c683fc7dd202af588f2136',
                                'deviceWashModelId': {
                                    '_id': '573188bf53218d6436f09b5a',
                                    'deviceTypeId': '572f27c853b2399024e080f0',
                                    'workmodel': '超强烘',
                                    'command': '{\'wash_mode\':\'10\',\'wash\':\'1\',\'dry_time\':\'120\'}',
                                    'basePrice': '0.1',
                                    'icon': '',
                                    'time': '10',
                                    'description': '超强烘的描述说明',
                                    '__v': 0
                                },
                                'washPrice': '0.1',
                                'promotionPrice': '',
                                'promotionStartTime': '',
                                'promotionEndTime': ''
                            }
                        ],
                        'no': '03'
                    },
                    {
                        'shortName': '波轮机',
                        'icon': '',
                        'free': 1,
                        'washModelList': [
                            {
                                'deviceTypeId': '572f27c853b2399024e080ee',
                                'storeId': '57c683fc7dd202af588f2136',
                                'deviceWashModelId': {
                                    '_id': '57318775a69be7742970e0c5',
                                    'deviceTypeId': '572f27c853b2399024e080ee',
                                    'workmodel': '单脱水',
                                    'command': '{\'wash_mode\':\'27\',\'wash\':\'1\'}',
                                    'basePrice': '0.1',
                                    'icon': '',
                                    'time': '5',
                                    'description': '单脱水的描述说明',
                                    '__v': 0
                                },
                                'washPrice': '0.1',
                                'promotionPrice': '',
                                'promotionStartTime': '',
                                'promotionEndTime': ''
                            },
                            {
                                'deviceTypeId': '572f27c853b2399024e080ee',
                                'storeId': '57c683fc7dd202af588f2136',
                                'deviceWashModelId': {
                                    '_id': '57318775a69be7742970e0c4',
                                    'deviceTypeId': '572f27c853b2399024e080ee',
                                    'workmodel': '大件洗',
                                    'command': '{\'wash_mode\':\'18\',\'wash\':\'1\'}',
                                    'basePrice': '0.1',
                                    'icon': '',
                                    'time': '15',
                                    'description': '大件洗的描述说明',
                                    '__v': 0
                                },
                                'washPrice': '0.1',
                                'promotionPrice': '',
                                'promotionStartTime': '',
                                'promotionEndTime': ''
                            },
                            {
                                'deviceTypeId': '572f27c853b2399024e080ee',
                                'storeId': '57c683fc7dd202af588f2136',
                                'deviceWashModelId': {
                                    '_id': '57318775a69be7742970e0c3',
                                    'deviceTypeId': '572f27c853b2399024e080ee',
                                    'workmodel': '快速洗',
                                    'command': '{\'wash_mode\':\'1\',\'wash\':\'1\'}',
                                    'basePrice': '0.2',
                                    'icon': '',
                                    'time': '8',
                                    'description': '快速洗的描述说明',
                                    '__v': 0
                                },
                                'washPrice': '0.2',
                                'promotionPrice': '',
                                'promotionStartTime': '',
                                'promotionEndTime': ''
                            },
                            {
                                'deviceTypeId': '572f27c853b2399024e080ee',
                                'storeId': '57c683fc7dd202af588f2136',
                                'deviceWashModelId': {
                                    '_id': '57318775a69be7742970e0c2',
                                    'deviceTypeId': '572f27c853b2399024e080ee',
                                    'workmodel': '标准洗',
                                    'command': '{\'wash_mode\':\'0\',\'wash\':\'1\'}',
                                    'basePrice': '0.1',
                                    'icon': '',
                                    'time': '15',
                                    'description': '标准洗的描述说明',
                                    '__v': 0
                                },
                                'washPrice': '0.1',
                                'promotionPrice': '',
                                'promotionStartTime': '',
                                'promotionEndTime': ''
                            }
                        ],
                        'no': '02'
                    },
                    {
                        'shortName': '滚筒机',
                        'icon': '',
                        'free': 1,
                        'washModelList': [
                            {
                                'deviceTypeId': '572f27c853b2399024e080ef',
                                'storeId': '57c683fc7dd202af588f2136',
                                'deviceWashModelId': {
                                    '_id': '57318736d80bebec27a84ccc',
                                    'deviceTypeId': '572f27c853b2399024e080ef',
                                    'workmodel': '单脱水',
                                    'command': "{'wash_mode':'9','dewatering_speed':'4','temperature':'0','wash':'1'}",
                                    'basePrice': '0.2',
                                    'time': '5',
                                    'description': '单脱水的描述说明',
                                    '__v': 0
                                },
                                'washPrice': '0.2',
                                'promotionPrice': '',
                                'promotionStartTime': '',
                                'promotionEndTime': ''
                            },
                            {
                                'deviceTypeId': '572f27c853b2399024e080ef',
                                'storeId': '57c683fc7dd202af588f2136',
                                'deviceWashModelId': {
                                    '_id': '57318736d80bebec27a84ccb',
                                    'deviceTypeId': '572f27c853b2399024e080ef',
                                    'workmodel': '大件洗',
                                    'command': "{'wash_mode':'1','dewatering_speed':'4','temperature':'3','wash':'1'}",
                                    'basePrice': '0.3',
                                    'icon': '',
                                    'time': '15',
                                    'description': '大件洗的描述说明',
                                    '__v': 0
                                },
                                'washPrice': '0.3',
                                'promotionPrice': '',
                                'promotionStartTime': '',
                                'promotionEndTime': ''
                            },
                            {
                                'deviceTypeId': '572f27c853b2399024e080ef',
                                'storeId': '57c683fc7dd202af588f2136',
                                'deviceWashModelId': {
                                    '_id': '57318736d80bebec27a84cca',
                                    'deviceTypeId': '572f27c853b2399024e080ef',
                                    'workmodel': '快速洗',
                                    'command': "{'wash_mode':'2','dewatering_speed':'4','temperature':'3','wash':'1'}",
                                    'basePrice': '1',
                                    'icon': '',
                                    'time': '8',
                                    'description': '快速洗的描述说明',
                                    '__v': 0
                                },
                                'washPrice': '1',
                                'promotionPrice': '',
                                'promotionStartTime': '',
                                'promotionEndTime': ''
                            },
                            {
                                'deviceTypeId': '572f27c853b2399024e080ef',
                                'storeId': '57c683fc7dd202af588f2136',
                                'deviceWashModelId': {
                                    '_id': '57318736d80bebec27a84cc9',
                                    'deviceTypeId': '572f27c853b2399024e080ef',
                                    'workmodel': '标准洗',
                                    'command': "{'wash_mode':'18','dewatering_speed':'4','temperature':'3','wash':'1'}",
                                    'basePrice': '0.1',
                                    'time': '25',
                                    'description': '滚筒洗衣机标准洗涤，洗涤时常25分钟',
                                    '__v': 0
                                },
                                'washPrice': '0.1',
                                'promotionPrice': '',
                                'promotionStartTime': '',
                                'promotionEndTime': ''
                            }
                        ],
                        'no': '01'
                    }
                ]
            };
            /**
             * 获取洗衣设备详情
             * @param storeId {String} 洗衣房id
             */
            var getStoreDetail = function(storeId) {
                var result = function(data) {
                    var store = data;
                    var deviceList = [];
                    var washList = [];

                    var deviceTypeId = baseService.items.get('deviceTypeId', 'deviceTypeId');

                    angular.forEach(store.deviceList, function(item, index) {
                        switch (item.shortName) {
                            case '滚筒机':
                                item.icon = item.icon || 'icon-drum';
                                deviceList[0] = item;
                                break;
                            case '干衣机':
                                item.icon = item.icon || 'icon-dry';
                                deviceList[2] = item;
                                break;
                            case '波轮机':
                                item.icon = item.icon || 'icon-pulsator';
                                deviceList[1] = item;
                                break;
                            default:
                                break;
                        }
                        angular.forEach(item.washModelList, function(wash) {
                            switch (wash.deviceWashModelId.workmodel) {
                                case '标准烘':
                                    wash.deviceWashModelId.icon = wash.deviceWashModelId.icon || 'standard-dry';
                                    break;
                                case '超强烘':
                                    wash.deviceWashModelId.icon = wash.deviceWashModelId.icon || 'super-dry';
                                    break;
                                case '普通烘':
                                    wash.deviceWashModelId.icon = wash.deviceWashModelId.icon || 'ordinary-dry';
                                    break;
                                case '单脱水':
                                    wash.deviceWashModelId.icon = wash.deviceWashModelId.icon || 'single-wash';
                                    break;
                                case '大件洗':
                                    wash.deviceWashModelId.icon = wash.deviceWashModelId.icon || 'big-wash';
                                    break;
                                case '快速洗':
                                    wash.deviceWashModelId.icon = wash.deviceWashModelId.icon || 'fast-wash';
                                    break;
                                case '标准洗':
                                    wash.deviceWashModelId.icon = wash.deviceWashModelId.icon || 'standard-wash';
                                    break;
                                default:
                                    washList = wash;
                                    break;
                            }
                        });
                        item.washModelList.sort(function(a, b) {
                            if (a.deviceWashModelId.time > b.deviceWashModelId.time) {
                                return 1;
                            }
                            if (a.deviceWashModelId.time < b.deviceWashModelId.time) {
                                return -1;
                            }
                            return 0;
                        });
                    });

                    angular.forEach(deviceList, function(item, index) {
                        if (item.washModelList[0].deviceTypeId == deviceTypeId) {
                            deviceIndex = index;
                        }

                    });

                    $scope.views.store = store;
                    $scope.views.deviceObj = null;
                    $scope.views.deviceList = deviceList;

                    if (store.deviceList.length === 0) {
                        $scope.views.deviceIndex = -1;
                        $scope.views.washModelList = [];
                    } else {
                        $scope.views.washList = store.deviceList[$scope.views.deviceIndex].washModelList;
                    }

                    baseService.items.set('ujing', 'mobile', store.mobile);

                    $timeout(function() {
                        $scope.views.tabsToggle(deviceIndex);
                        $scope.$broadcast('scroll.refreshComplete');
                    });
                };

                var failure = function() {
                    cFactory.alert('数据获取异常，请开启网络后重试！').then(function() {
                        window.localStorage.removeItem('storeId');
                        $rootScope.jump('oneWashHome');
                    });
                };

                cService.getStoreDetail({
                    storeId: storeId
                }).then(function(res) {
                    $scope.views.isRequest = true;

                    if (res && res.result && res.result === 1 && res.data) {
                        result(res.data);
                    } else {
                        failure();
                    }
                }, failure);
            };

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
                var result = function(data) {
                    data.washModelList.sort(function(a, b) {
                        var a = parseInt(a.deviceWashModelId.time);
                        var b = parseInt(b.deviceWashModelId.time);

                        return a > b ? 1 : a < b ? -1 : 0;
                    });
                    $scope.views.store = data;
                    $scope.views.deviceObj = data.deviceTypeId;
                    $scope.views.deviceList = null;
                    $scope.views.washList = data.washModelList;


                    baseService.items.set('ujing', 'mobile', data.storeId.mobile);
                };

                if (ispc) {
                    //result(findDeviceByQrcodeFormat);

                    baseService.items.set('ujing', 'scanning', findDeviceByQrcodeFormat);
                    $rootScope.jump('scanHome', {
                        source: 'home'
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
                                source: 'home'
                            });
                        } else {
                            $topTip(res.msg);
                        }
                    });
                }
            };

            var init = function() {
                var storageStr, // 获取缓存的数据
                    urlRouter = $location.path().slice(1), // 路由名
                    urlParams = $location.search(); // url 参数

                if (urlRouter === 'home') {
                    storageStr = localStorage.getItem('storeId'); // 获取洗衣房ID，取不到为 null

                    if (storageStr) {
                        isScanhome = false;
                        return getStoreDetail(storageStr);
                    }
                }

                if (urlRouter === 'scanHome') {
                    var data = baseService.items.get('ujing', 'scanning');

                    if (data) {
                        isScanhome = true;

                        data.washModelList.sort(function(a, b) {
                            var a = parseInt(a.deviceWashModelId.time);
                            var b = parseInt(b.deviceWashModelId.time);

                            return a > b ? 1 : a < b ? -1 : 0;
                        });
                        $scope.views.store = data;
                        $scope.views.deviceObj = data.deviceTypeId;
                        $scope.views.deviceList = null;
                        $scope.views.washList = data.washModelList;


                        baseService.items.set('ujing', 'mobile', data.storeId.mobile);

                        return;
                    }
                }

                return $rootScope.jump('oneWashHome');
            };
            init();

            // 订单显示模板
            $ionicModal.fromTemplateUrl('template/directivesTpl/reserve-modal.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function(modal) {
                $scope.reserve = modal;
            });

            // 页面跳转时移出 modal
            $scope.$on('$destroy', function() {
                $scope.reserve.remove();
            });

            $scope.$apply();
        }
    ];
});