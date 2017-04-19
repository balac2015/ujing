/**
 * @file 我的设备
 * @author <liping.ye@midea.com.cn>
 * @copyright Midea Co.Ltd 1968-2015
 * @license Released under the Commercial license.
 * @since 1.0.1
 * @version 1.0.2 - 2016/5/4
 */
define(['ionic'], function() {
    'use strict';

    return [
        '$scope',
        'cService',
        'widgetFactory',
        '$ionicScrollDelegate',
        '$topTip',
        '$timeout',
        function($scope, cService, widgetFactory, $ionicScrollDelegate, $topTip, $timeout) {

            $scope.views = {
                deviceList: [],
                nWorking: 0,
                nFree: 0,
                nError: 0,
                nDisabled: 0,
                activated: '',
                isRequest: false,
                tabsToggle: function(type) { // 选择tab
                    var delegate = $ionicScrollDelegate.$getByHandle('myScroll');
                    delegate.scrollTop();

                    $scope.views.deviceList = deviceList[type];
                    $scope.views.activated = type;
                    tabsActived = type;
                    this.selectDeviceIndex = -1;
                    console.log($scope.views.deviceList)
                },
                selectDeviceIndex: 0, // 默认第 0 项展开
                /**
                 * 子项的展开与收缩
                 * @param index 当前点击项的下标
                 */
                selectDevice: function(index) {
                    if (this.selectDeviceIndex !== index) {
                        this.selectDeviceIndex = index;
                    } else {
                        this.selectDeviceIndex = -1;
                    }
                },
                // 设备列表操作后的重新请求接口
                onSelect: function() {
                    var i = $scope.views.selectDeviceIndex;
                    $scope.views.selectDeviceIndex = -1;
                    $topTip('设备操作处理成功！！');

                    getDeviceList(function() {
                        $scope.views.selectDeviceIndex = i;
                    });
                },
                // 刷新页面
                refresh: function() {
                    getDeviceList(function() {
                        $scope.views.tabsToggle(tabsActived);
                        $timeout(function() {
                            $scope.$broadcast('scroll.refreshComplete');
                        }, 300);
                    });
                }
            };

            var tabsActived = 'working';

            var deviceList = {
                working: [], // 工作设备列表
                free: [], // 空闲设备列表
                error: [], // 故障设备列表
                disabled: [] // 停用设备列表
            };

            /**
             * 获取所有设备信息
             */
            var getDeviceList = function(callback) {
                var data = null;

                cService.getDeviceList().then(function(res) {
                    $scope.views.isRequest = true;
                    // 设备信息接口返回数据的格式
                    var getDeviceListFormat = {
                        working: [
                            {
                                storeName: '北郊商业广场洗衣房',
                                storeId: '572d84ae21844e282d618e86',
                                deviceList: [
                                    {
                                        _id: '5730560060ab7c842621d467',
                                        deviceTypeId: '572f27c853b2399024e080f0A',
                                        deviceTypeName: '滚筒洗衣机',
                                        no: '01',
                                        sn: 'sn',
                                        qrCode: '654321',
                                        storeId: {
                                            _id: '572d84ae21844e282d618e86',
                                            name: '北郊商业广场洗衣房',
                                            province: '572c4758f55c662ef97607f7',
                                            city: '572c4777f55c662ef97607f8',
                                            district: '572c47f5f55c662ef97607f9',
                                            address: '北郊商业广场',
                                            mobile: '13625041174',
                                            serviceSubjectId: '572c5032f55c662ef97607fa',
                                            franchiseeId: '572c4d90f54960bc1d41fdb8',
                                            businessStartTime: '2016-05-07T06:01:18.399Z',
                                            businessEndTime: '2016-05-07T06:01:18.399Z',
                                            approveStatus: '2',
                                            approveBy: '',
                                            approveTime: null,
                                            ratio: '5',
                                            coordinate: [
                                                113.222417,
                                                22.938546
                                            ],
                                            __v: 1,
                                            enable: true,
                                            applyTime: null,
                                            coupons: [
                                                {
                                                    title: '七夕活动分享券',
                                                    value: 7,
                                                    effectiveDays: 20,
                                                    flag: '20160616021519',
                                                    _id: '576243f81080aff4312ece66',
                                                    isEnable: true,
                                                    activityEndTime: '2017-05-02T16:00:00.000Z',
                                                    activityStartTime: '2016-05-02T16:00:00.000Z',
                                                    stores: []
                                                }
                                            ]
                                        },
                                        franchiseeId: '572c4d90f54960bc1d41fdb8',
                                        status: '1',
                                        virtualId: 'virtualId',
                                        reservationWaitTime: 10,
                                        bootWaitTime: 10,
                                        __v: 0,
                                        orderId: null,
                                        addTime: '2016-06-16T07:02:18.138Z',
                                        isSupportScan: false
                                    },
                                    {
                                        _id: '5733fdc8578c86a421f3283b',
                                        deviceTypeId: '572f27c853b2399024e080f0B',
                                        deviceTypeName: '干衣机',
                                        no: '02',
                                        sn: 'sn1234',
                                        qrCode: '987',
                                        storeId: {
                                            _id: '572d84ae21844e282d618e86',
                                            name: '北郊商业广场洗衣房',
                                            province: '572c4758f55c662ef97607f7',
                                            city: '572c4777f55c662ef97607f8',
                                            district: '572c47f5f55c662ef97607f9',
                                            address: '北郊商业广场',
                                            mobile: '13625041174',
                                            serviceSubjectId: '572c5032f55c662ef97607fa',
                                            franchiseeId: '572c4d90f54960bc1d41fdb8',
                                            businessStartTime: '2016-05-07T06:01:18.399Z',
                                            businessEndTime: '2016-05-07T06:01:18.399Z',
                                            approveStatus: '2',
                                            approveBy: '',
                                            approveTime: null,
                                            ratio: '5',
                                            coordinate: [
                                                113.222417,
                                                22.938546
                                            ],
                                            __v: 1,
                                            enable: true,
                                            applyTime: null,
                                            coupons: [
                                                {
                                                    title: '七夕活动分享券',
                                                    value: 7,
                                                    effectiveDays: 20,
                                                    flag: '20160616021519',
                                                    _id: '576243f81080aff4312ece66',
                                                    isEnable: true,
                                                    activityEndTime: '2017-05-02T16:00:00.000Z',
                                                    activityStartTime: '2016-05-02T16:00:00.000Z',
                                                    stores: []
                                                }
                                            ]
                                        },
                                        franchiseeId: '572c4d90f54960bc1d41fdb8',
                                        status: '1',
                                        virtualId: '654321',
                                        reservationWaitTime: 10,
                                        bootWaitTime: 0,
                                        orderId: null,
                                        addTime: '2016-06-16T07:02:18.142Z',
                                        isSupportScan: false
                                    }
                                ]
                            },
                            {
                                storeName: '医科大学洗衣房',
                                storeId: '572d865221844e282d618e91',
                                deviceList: [
                                    {
                                        _id: '5730560060ab7c842621d469',
                                        deviceTypeId: '572f27c853b2399024e080ef',
                                        deviceTypeName: '波轮洗衣机',
                                        no: '01',
                                        sn: 'sn',
                                        qrCode: 'qrcode',
                                        storeId: {
                                            _id: '572d865221844e282d618e91',
                                            name: '医科大学洗衣房',
                                            province: '572c4758f55c662ef97607f7',
                                            city: '572c4777f55c662ef97607f8',
                                            district: '572c47f5f55c662ef97607f9',
                                            address: '医科大学洗衣房',
                                            mobile: '13625041174',
                                            serviceSubjectId: '572c5032f55c662ef97607fa',
                                            franchiseeId: '572c4d90f54960bc1d41fdb8',
                                            businessStartTime: '2016-05-07T06:08:18.784Z',
                                            businessEndTime: '2016-05-07T06:08:18.784Z',
                                            approveStatus: '2',
                                            approveBy: '',
                                            approveTime: null,
                                            ratio: '5',
                                            coordinate: [
                                                113.221078,
                                                22.93474
                                            ],
                                            __v: 1,
                                            enable: true,
                                            applyTime: null,
                                            coupons: [
                                                {
                                                    title: '七夕活动分享券',
                                                    value: 7,
                                                    effectiveDays: 20,
                                                    flag: '20160616021519',
                                                    _id: '576243f81080aff4312ece67',
                                                    isEnable: true,
                                                    activityEndTime: '2017-05-02T16:00:00.000Z',
                                                    activityStartTime: '2016-05-02T16:00:00.000Z',
                                                    stores: []
                                                }
                                            ]
                                        },
                                        franchiseeId: '572c4d90f54960bc1d41fdb8',
                                        status: '0',
                                        virtualId: 'virtualId',
                                        reservationWaitTime: 10,
                                        bootWaitTime: 10,
                                        __v: 0,
                                        addTime: '2016-06-16T07:02:18.141Z',
                                        isSupportScan: false
                                    },
                                    {
                                        _id: '5730560060ab7c842621d46a',
                                        deviceTypeId: '572f27c853b2399024e080f0',
                                        deviceTypeName: '滚筒洗衣机',
                                        no: '01',
                                        sn: 'sn',
                                        qrCode: 'qrcode',
                                        storeId: {
                                            _id: '572d865221844e282d618e91',
                                            name: '医科大学洗衣房',
                                            province: '572c4758f55c662ef97607f7',
                                            city: '572c4777f55c662ef97607f8',
                                            district: '572c47f5f55c662ef97607f9',
                                            address: '医科大学洗衣房',
                                            mobile: '13625041174',
                                            serviceSubjectId: '572c5032f55c662ef97607fa',
                                            franchiseeId: '572c4d90f54960bc1d41fdb8',
                                            businessStartTime: '2016-05-07T06:08:18.784Z',
                                            businessEndTime: '2016-05-07T06:08:18.784Z',
                                            approveStatus: '2',
                                            approveBy: '',
                                            approveTime: null,
                                            ratio: '5',
                                            coordinate: [
                                                113.221078,
                                                22.93474
                                            ],
                                            __v: 1,
                                            enable: true,
                                            applyTime: null,
                                            coupons: [
                                                {
                                                    title: '七夕活动分享券',
                                                    value: 7,
                                                    effectiveDays: 20,
                                                    flag: '20160616021519',
                                                    _id: '576243f81080aff4312ece67',
                                                    isEnable: true,
                                                    activityEndTime: '2017-05-02T16:00:00.000Z',
                                                    activityStartTime: '2016-05-02T16:00:00.000Z',
                                                    stores: []
                                                }
                                            ]
                                        },
                                        franchiseeId: '572c4d90f54960bc1d41fdb8',
                                        status: '0',
                                        virtualId: 'virtualId',
                                        reservationWaitTime: 10,
                                        bootWaitTime: 10,
                                        __v: 0,
                                        addTime: '2016-06-16T07:02:18.142Z',
                                        isSupportScan: false
                                    },
                                    {
                                        _id: '5730560060ab7c842621d468',
                                        deviceTypeId: '572f27c853b2399024e080ee',
                                        deviceTypeName: '干衣机',
                                        no: '001',
                                        sn: 'sn',
                                        qrCode: '123',
                                        storeId: {
                                            _id: '572d865221844e282d618e91',
                                            name: '医科大学洗衣房',
                                            province: '572c4758f55c662ef97607f7',
                                            city: '572c4777f55c662ef97607f8',
                                            district: '572c47f5f55c662ef97607f9',
                                            address: '医科大学洗衣房',
                                            mobile: '13625041174',
                                            serviceSubjectId: '572c5032f55c662ef97607fa',
                                            franchiseeId: '572c4d90f54960bc1d41fdb8',
                                            businessStartTime: '2016-05-07T06:08:18.784Z',
                                            businessEndTime: '2016-05-07T06:08:18.784Z',
                                            approveStatus: '2',
                                            approveBy: '',
                                            approveTime: null,
                                            ratio: '5',
                                            coordinate: [
                                                113.221078,
                                                22.93474
                                            ],
                                            __v: 1,
                                            enable: true,
                                            applyTime: null,
                                            coupons: [
                                                {
                                                    title: '七夕活动分享券',
                                                    value: 7,
                                                    effectiveDays: 20,
                                                    flag: '20160616021519',
                                                    _id: '576243f81080aff4312ece67',
                                                    isEnable: true,
                                                    activityEndTime: '2017-05-02T16:00:00.000Z',
                                                    activityStartTime: '2016-05-02T16:00:00.000Z',
                                                    stores: []
                                                }
                                            ]
                                        },
                                        franchiseeId: '572c4d90f54960bc1d41fdb8',
                                        status: '0',
                                        virtualId: 'virtualId',
                                        reservationWaitTime: 10,
                                        bootWaitTime: 10,
                                        __v: 0,
                                        addTime: '2016-06-11T06:55:13.714Z',
                                        isSupportScan: false
                                    }
                                ]
                            }
                        ],
                        free: [
                            {
                                storeName: '美的总部洗衣房',
                                storeId: '572d865221844e282d618e91FREE',
                                deviceList: [
                                    {
                                        _id: '5730560060ab7c842621d469',
                                        deviceTypeId: '572f27c853b2399024e080ef',
                                        deviceTypeName: '波轮洗衣机',
                                        no: '01',
                                        sn: 'sn',
                                        qrCode: 'qrcode',
                                        storeId: {
                                            _id: '572d865221844e282d618e91FREE',
                                            name: '美的总部洗衣房',
                                            province: '572c4758f55c662ef97607f7',
                                            city: '572c4777f55c662ef97607f8',
                                            district: '572c47f5f55c662ef97607f9',
                                            address: '美的总部洗衣房',
                                            mobile: '13625041174',
                                            serviceSubjectId: '572c5032f55c662ef97607fa',
                                            franchiseeId: '572c4d90f54960bc1d41fdb8',
                                            businessStartTime: '2016-05-07T06:08:18.784Z',
                                            businessEndTime: '2016-05-07T06:08:18.784Z',
                                            approveStatus: '2',
                                            approveBy: '',
                                            approveTime: null,
                                            ratio: '5',
                                            coordinate: [
                                                113.221078,
                                                22.93474
                                            ],
                                            __v: 1,
                                            enable: true,
                                            applyTime: null,
                                            coupons: [
                                                {
                                                    title: '七夕活动分享券',
                                                    value: 7,
                                                    effectiveDays: 20,
                                                    flag: '20160616021519',
                                                    _id: '576243f81080aff4312ece67',
                                                    isEnable: true,
                                                    activityEndTime: '2017-05-02T16:00:00.000Z',
                                                    activityStartTime: '2016-05-02T16:00:00.000Z',
                                                    stores: []
                                                }
                                            ]
                                        },
                                        franchiseeId: '572c4d90f54960bc1d41fdb8',
                                        status: '0',
                                        virtualId: 'virtualId',
                                        reservationWaitTime: 10,
                                        bootWaitTime: 10,
                                        __v: 0,
                                        addTime: '2016-06-16T07:02:18.141Z',
                                        isSupportScan: false
                                    }
                                ]
                            }
                        ],
                        error: [
                            {
                                storeName: '北郊商业广场洗衣房',
                                storeId: '572d865221844e282d618e91ERROR',
                                deviceList: [
                                    {
                                        _id: '5730560060ab7c842621d467',
                                        deviceTypeId: '572f27c853b2399024e080f0',
                                        no: '01',
                                        sn: 'sn',
                                        qrCode: '654321',
                                        storeId: {
                                            _id: '572d84ae21844e282d618e86',
                                            name: '北郊商业广场洗衣房',
                                            province: '572c4758f55c662ef97607f7',
                                            city: '572c4777f55c662ef97607f8',
                                            district: '572c47f5f55c662ef97607f9',
                                            address: '北郊商业广场',
                                            mobile: '13625041174',
                                            serviceSubjectId: '572c5032f55c662ef97607fa',
                                            franchiseeId: '572c4d90f54960bc1d41fdb8',
                                            businessStartTime: '2016-05-07T06:01:18.399Z',
                                            businessEndTime: '2016-05-07T06:01:18.399Z',
                                            approveStatus: '2',
                                            approveBy: '',
                                            approveTime: null,
                                            ratio: '5',
                                            coordinate: [
                                                113.222417,
                                                22.938546
                                            ],
                                            __v: 1,
                                            enable: true,
                                            applyTime: null,
                                            coupons: [
                                                {
                                                    title: '七夕活动分享券',
                                                    value: 7,
                                                    effectiveDays: 20,
                                                    flag: '20160616021519',
                                                    _id: '576243f81080aff4312ece66',
                                                    isEnable: true,
                                                    activityEndTime: '2017-05-02T16:00:00.000Z',
                                                    activityStartTime: '2016-05-02T16:00:00.000Z',
                                                    stores: []
                                                }
                                            ]
                                        },
                                        franchiseeId: '572c4d90f54960bc1d41fdb8',
                                        status: '2',
                                        virtualId: 'virtualId',
                                        reservationWaitTime: 10,
                                        bootWaitTime: 10,
                                        __v: 0,
                                        orderId: null,
                                        addTime: '2016-06-16T07:02:18.138Z',
                                        isSupportScan: false
                                    },
                                    {
                                        _id: '5733fdc8578c86a421f3283b',
                                        deviceTypeId: '572f27c853b2399024e080f0',
                                        no: '02',
                                        sn: 'sn1234',
                                        qrCode: '987',
                                        storeId: {
                                            _id: '572d84ae21844e282d618e86',
                                            name: '北郊商业广场洗衣房',
                                            province: '572c4758f55c662ef97607f7',
                                            city: '572c4777f55c662ef97607f8',
                                            district: '572c47f5f55c662ef97607f9',
                                            address: '北郊商业广场',
                                            mobile: '13625041174',
                                            serviceSubjectId: '572c5032f55c662ef97607fa',
                                            franchiseeId: '572c4d90f54960bc1d41fdb8',
                                            businessStartTime: '2016-05-07T06:01:18.399Z',
                                            businessEndTime: '2016-05-07T06:01:18.399Z',
                                            approveStatus: '2',
                                            approveBy: '',
                                            approveTime: null,
                                            ratio: '5',
                                            coordinate: [
                                                113.222417,
                                                22.938546
                                            ],
                                            __v: 1,
                                            enable: true,
                                            applyTime: null,
                                            coupons: [
                                                {
                                                    title: '七夕活动分享券',
                                                    value: 7,
                                                    effectiveDays: 20,
                                                    flag: '20160616021519',
                                                    _id: '576243f81080aff4312ece66',
                                                    isEnable: true,
                                                    activityEndTime: '2017-05-02T16:00:00.000Z',
                                                    activityStartTime: '2016-05-02T16:00:00.000Z',
                                                    stores: []
                                                }
                                            ]
                                        },
                                        franchiseeId: '572c4d90f54960bc1d41fdb8',
                                        status: '2',
                                        virtualId: '654321',
                                        reservationWaitTime: 10,
                                        bootWaitTime: 0,
                                        orderId: null,
                                        addTime: '2016-06-16T07:02:18.142Z',
                                        isSupportScan: false
                                    },
                                ]
                            },
                            {
                                storeName: '汉庭酒店洗衣房',
                                storeId: '572d865221844e282d618e91FREE2',
                                deviceList: [
                                    {
                                        _id: '5730560060ab7c842621d469',
                                        deviceTypeId: '572f27c853b2399024e080ef',
                                        no: '01',
                                        sn: 'sn',
                                        qrCode: 'qrcode',
                                        storeId: {
                                            _id: '572d865221844e282d618e91',
                                            name: '汉庭酒店洗衣房',
                                            province: '572c4758f55c662ef97607f7',
                                            city: '572c4777f55c662ef97607f8',
                                            district: '572c47f5f55c662ef97607f9',
                                            address: '汉庭酒店洗衣房',
                                            mobile: '13625041174',
                                            serviceSubjectId: '572c5032f55c662ef97607fa',
                                            franchiseeId: '572c4d90f54960bc1d41fdb8',
                                            businessStartTime: '2016-05-07T06:08:18.784Z',
                                            businessEndTime: '2016-05-07T06:08:18.784Z',
                                            approveStatus: '2',
                                            approveBy: '',
                                            approveTime: null,
                                            ratio: '5',
                                            coordinate: [
                                                113.221078,
                                                22.93474
                                            ],
                                            __v: 1,
                                            enable: true,
                                            applyTime: null,
                                            coupons: [
                                                {
                                                    title: '七夕活动分享券',
                                                    value: 7,
                                                    effectiveDays: 20,
                                                    flag: '20160616021519',
                                                    _id: '576243f81080aff4312ece67',
                                                    isEnable: true,
                                                    activityEndTime: '2017-05-02T16:00:00.000Z',
                                                    activityStartTime: '2016-05-02T16:00:00.000Z',
                                                    stores: []
                                                }
                                            ]
                                        },
                                        franchiseeId: '572c4d90f54960bc1d41fdb8',
                                        status: '0',
                                        virtualId: 'virtualId',
                                        reservationWaitTime: 10,
                                        bootWaitTime: 10,
                                        __v: 0,
                                        addTime: '2016-06-16T07:02:18.141Z',
                                        isSupportScan: false
                                    },
                                    {
                                        _id: '5730560060ab7c842621d46a',
                                        deviceTypeId: '572f27c853b2399024e080f0',
                                        no: '01',
                                        sn: 'sn',
                                        qrCode: 'qrcode',
                                        storeId: {
                                            _id: '572d865221844e282d618e91',
                                            name: '汉庭酒店洗衣房',
                                            province: '572c4758f55c662ef97607f7',
                                            city: '572c4777f55c662ef97607f8',
                                            district: '572c47f5f55c662ef97607f9',
                                            address: '汉庭酒店洗衣房',
                                            mobile: '13625041174',
                                            serviceSubjectId: '572c5032f55c662ef97607fa',
                                            franchiseeId: '572c4d90f54960bc1d41fdb8',
                                            businessStartTime: '2016-05-07T06:08:18.784Z',
                                            businessEndTime: '2016-05-07T06:08:18.784Z',
                                            approveStatus: '2',
                                            approveBy: '',
                                            approveTime: null,
                                            ratio: '5',
                                            coordinate: [
                                                113.221078,
                                                22.93474
                                            ],
                                            __v: 1,
                                            enable: true,
                                            applyTime: null,
                                            coupons: [
                                                {
                                                    title: '七夕活动分享券',
                                                    value: 7,
                                                    effectiveDays: 20,
                                                    flag: '20160616021519',
                                                    _id: '576243f81080aff4312ece67',
                                                    isEnable: true,
                                                    activityEndTime: '2017-05-02T16:00:00.000Z',
                                                    activityStartTime: '2016-05-02T16:00:00.000Z',
                                                    stores: []
                                                }
                                            ]
                                        },
                                        franchiseeId: '572c4d90f54960bc1d41fdb8',
                                        status: '0',
                                        virtualId: 'virtualId',
                                        reservationWaitTime: 10,
                                        bootWaitTime: 10,
                                        __v: 0,
                                        addTime: '2016-06-16T07:02:18.142Z',
                                        isSupportScan: false
                                    },
                                    {
                                        _id: '5730560060ab7c842621d468',
                                        deviceTypeId: '572f27c853b2399024e080ee',
                                        no: '001',
                                        sn: 'sn',
                                        qrCode: '123',
                                        storeId: {
                                            _id: '572d865221844e282d618e91',
                                            name: '汉庭酒店洗衣房',
                                            province: '572c4758f55c662ef97607f7',
                                            city: '572c4777f55c662ef97607f8',
                                            district: '572c47f5f55c662ef97607f9',
                                            address: '汉庭酒店洗衣房',
                                            mobile: '13625041174',
                                            serviceSubjectId: '572c5032f55c662ef97607fa',
                                            franchiseeId: '572c4d90f54960bc1d41fdb8',
                                            businessStartTime: '2016-05-07T06:08:18.784Z',
                                            businessEndTime: '2016-05-07T06:08:18.784Z',
                                            approveStatus: '2',
                                            approveBy: '',
                                            approveTime: null,
                                            ratio: '5',
                                            coordinate: [
                                                113.221078,
                                                22.93474
                                            ],
                                            __v: 1,
                                            enable: true,
                                            applyTime: null,
                                            coupons: [
                                                {
                                                    title: '七夕活动分享券',
                                                    value: 7,
                                                    effectiveDays: 20,
                                                    flag: '20160616021519',
                                                    _id: '576243f81080aff4312ece67',
                                                    isEnable: true,
                                                    activityEndTime: '2017-05-02T16:00:00.000Z',
                                                    activityStartTime: '2016-05-02T16:00:00.000Z',
                                                    stores: []
                                                }
                                            ]
                                        },
                                        franchiseeId: '572c4d90f54960bc1d41fdb8',
                                        status: '0',
                                        virtualId: 'virtualId',
                                        reservationWaitTime: 10,
                                        bootWaitTime: 10,
                                        __v: 0,
                                        addTime: '2016-06-11T06:55:13.714Z',
                                        isSupportScan: false
                                    }
                                ]
                            }
                        ],
                        disabled: [
                            {
                                storeName: '美的总部洗衣房',
                                storeId: '572d865221844e282d618e91FREE',
                                deviceList: [
                                    {
                                        _id: '5730560060ab7c842621d469',
                                        deviceTypeId: '572f27c853b2399024e080ef',
                                        deviceTypeName: '波轮洗衣机',
                                        no: '01',
                                        sn: 'sn',
                                        qrCode: 'qrcode',
                                        storeId: {
                                            _id: '572d865221844e282d618e91FREE',
                                            name: '美的总部洗衣房',
                                            province: '572c4758f55c662ef97607f7',
                                            city: '572c4777f55c662ef97607f8',
                                            district: '572c47f5f55c662ef97607f9',
                                            address: '美的总部洗衣房',
                                            mobile: '13625041174',
                                            serviceSubjectId: '572c5032f55c662ef97607fa',
                                            franchiseeId: '572c4d90f54960bc1d41fdb8',
                                            businessStartTime: '2016-05-07T06:08:18.784Z',
                                            businessEndTime: '2016-05-07T06:08:18.784Z',
                                            approveStatus: '2',
                                            approveBy: '',
                                            approveTime: null,
                                            ratio: '5',
                                            coordinate: [
                                                113.221078,
                                                22.93474
                                            ],
                                            __v: 1,
                                            enable: true,
                                            applyTime: null,
                                            coupons: [
                                                {
                                                    title: '七夕活动分享券',
                                                    value: 7,
                                                    effectiveDays: 20,
                                                    flag: '20160616021519',
                                                    _id: '576243f81080aff4312ece67',
                                                    isEnable: true,
                                                    activityEndTime: '2017-05-02T16:00:00.000Z',
                                                    activityStartTime: '2016-05-02T16:00:00.000Z',
                                                    stores: []
                                                }
                                            ]
                                        },
                                        franchiseeId: '572c4d90f54960bc1d41fdb8',
                                        status: '3',
                                        virtualId: 'virtualId',
                                        reservationWaitTime: 10,
                                        bootWaitTime: 10,
                                        __v: 0,
                                        addTime: '2016-06-16T07:02:18.141Z',
                                        isSupportScan: false
                                    }
                                ]
                            }
                        ]
                    };

                    if (res && res.result === 1 && res.data) {
                        data = res.data;

                        deviceList.working = data.working;
                        deviceList.free = data.free;
                        deviceList.error = data.error;
                        deviceList.disabled = data.disabled;

                        $scope.views.deviceList = deviceList[$scope.views.activated];

                        var eachList = function(list) {
                            var count = 0;

                            angular.forEach(list, function(item) {
                                count += item.deviceList.length;
                            });

                            return count;
                        };

                        $scope.views.nWorking = eachList(deviceList.working);
                        $scope.views.nFree = eachList(deviceList.free);
                        $scope.views.nError = eachList(deviceList.error);
                        $scope.views.nDisabled = eachList(deviceList.disabled);

                        callback && callback();
                    }
                });
            };

            // 默认工作中
            $scope.views.activated = tabsActived;
            getDeviceList();

            $scope.$apply();
        }
    ];
});
