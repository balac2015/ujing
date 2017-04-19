/**
 * @file 配置设备参数
 * @author ytp <tianping.yan@partner.midea.com.cn>
 * @copyright Midea Co.Ltd 1968-2016
 * @license Released under the Commercial license.
 * @version 16/5/24
 */
define(['ionic'], function() {
    'use strict';

    return [
        '$scope',
        'cService',
        'widgetFactory',
        'myWidgetFactory',
        '$rootScope',
        '$ionicModal',
        'cFactory',
        '$topTip',
        'baseService',
        '$location',
        function($scope, cService, widgetFactory, myWidgetFactory, $rootScope, $ionicModal, cFactory, $topTip, baseService, $location) {
            $scope.views = {
                numberPattern: /[0-9]/,
                no: '', // 设备编号
                device: {}, // 设备类型
                store: {}, // 洗衣房
                allStoreList: [], // 所有洗衣房数据
                isSupportScan: false, // 是否支持扫码自洁
                isStore: false, // 是否有洗衣房
                isRequest: false,
                /**
                 * 路由切换
                 * @param router {String} 目标路由
                 * @param type {String} 判断跳到 shrink 页中选项的类型
                 */
                routerGo: function(router, type) {
                    if (type === 'device') {
                        baseService.items.set('franchisee', 'shrink', {
                            type: 'device'
                        });
                    }

                    if (type === 'store') {
                        baseService.items.set('franchisee', 'shrink', {
                            type: 'store',
                            select: 'radio',
                            data: storeSelected
                        });
                    }

                    return $rootScope.stateGo(router, {
                        source: 'setDevice'
                    });
                },
                // 点击提交配置设备参数的表单
                onSubmitTest: function() {
                    if (this.no === '') {
                        return $topTip('设备编号不能为空！');
                    }

                    if (Number.isNaN(Number(this.no))) {
                        return $topTip('设备编号必须全部为数字！');
                    }
                    if (!this.storeName) {
                        return $topTip('洗衣房不能为空！');
                    }

                    if (!this.deviceName) {
                        return $topTip('设备类型不能为空！');
                    }

                    if (!this.isStart) {
                        return $topTip('洗衣二维码未录入！');
                    }

                    registerDeviceResult.qrcode = qrcode;
                    registerDeviceResult.no = this.no;
                    registerDeviceResult.storeId = storeId;
                    registerDeviceResult.deviceTypeId = deviceSubmit._id;
                    registerDeviceResult.isSupportScan = this.isSupportScan;

                    // 添加设备
                    cService.addDevice(registerDeviceResult).then(function(res) {
                        alert('addDevice 接口返回：' + JSON.stringify(res));

                        if (res && res.result === 1) {
                            cFactory.alert('配网并添加成功！').then(function(res) {
                                $rootScope.goBack();
                            });
                        }
                    });
                },
                isStart: '', // 二维码是否识别
                // 配网
                registerDevice: function() {
                    myWidgetFactory.registerDevice().then(function(msg) {
                        if (msg && msg.sn && msg.deviceId) {
                            addDevice(msg);
                        } else {
                            $topTip('设备配网失败！');
                        }
                    });
                },
                // 扫描
                scanning: function() {
                    myWidgetFactory.scanningCode().then(function(res) {
                        //alert('原生扫码返回：' + JSON.stringify(res));
                        if (res.text) {
                            $scope.views.isStart = true;
                            qrcode = res.text;
                        }
                    });
                }
            };

            var storeSelected = [],
                storeId = '',
                deviceSubmit = {};

            var serviceSubjectId = '',
                qrcode =  '',
                registerDeviceResult = null;

            // 添加设备
            var addDevice = function(registerData) {

                if ($scope.views.no === '') {
                    return $topTip('设备编号不能为空！');
                }

                if (Number.isNaN(Number($scope.views.no))) {
                    return $topTip('设备编号必须全部为数字！');
                }

                if (!$scope.views.storeName) {
                    return $topTip('洗衣房不能为空！');
                }

                if (!$scope.views.deviceName) {
                    return $topTip('设备类型不能为空！');
                }

                if (!$scope.views.isStart) {
                    return $topTip('洗衣二维码未录入！');
                }

                var params = {
                    serviceSubjectId: serviceSubjectId, // 服務主躰ID
                    qrcode: qrcode,
                    storeId: storeId, // 所属洗衣房 ID
                    deviceTypeId: deviceSubmit._id, // 设备类型 ID
                    no: $scope.views.no, // 设备编号
                    isSupportScan: $scope.views.isSupportScan, // 是否支持扫码自洁
                    sn: registerData.sn, // sn 码
                    virtualId: registerData.deviceId // 虚拟 ID
                };


                // 添加设备
                cService.addDevice(params).then(function(res) {
                    //alert('addDevice 接口返回：' + JSON.stringify(res));

                    if (res && res.result === 1) {
                        cFactory.alert('配网并添加成功！').then(function() {
                            $rootScope.exit();
                        });
                    } else {
                        res.msg && $topTip(res.msg);
                    }
                });
            };

            /**
             * 获取所有洗衣房
             * @param storeIds 已有的洗衣房ID数组
             */
            var getAllStore = function() {
                var allStoreList = baseService.items.get('franchisee', 'getAllStore');

                var storeItem = baseService.items.get('store', 'item');

                // examine 页面跳过来的
                if (storeItem) {
                    storeId = storeItem._id;
                    serviceSubjectId = storeItem.serviceSubjectId;
                    $scope.views.storeName = storeItem.name;
                }

                //if (allStoreList) {
                //    $scope.views.isRequest = true;
                //    $scope.views.isStore = true;
                //    return storeSelected = allStoreList;
                //}

                cService.getAllStore().then(function(res) {
                    $scope.views.isRequest = true;
                    if (res && res.result === 1 && res.data.length > 0) {
                        $scope.views.isStore = true;
                        storeSelected = res.data;
                        baseService.items.set('franchisee', 'getAllStore', storeSelected);

                        //for (var i = 0; i < res.data.length; i++) {
                        //    if (res.data[i].storeList.length > 0) {
                        //        $scope.views.isStore = true;
                        //        break;
                        //    }
                        //    $scope.views.isStore = false;
                        //}
                    }
                });
            };

            cService.hasLogin(getAllStore);
            //getAllStore();

            // 观察页面跳转,设置限定范围
            $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState) {
                // 从 shrink 页面返回
                if (fromState.name === 'shrink' && toState.name === 'setDevice') {
                    var shrink = baseService.items.get('franchisee', 'shrink');
                    var showName = '';

                    if (shrink.type === 'device') {
                        angular.forEach(shrink.data, function(item) {
                            if (item.checked) {
                                deviceSubmit = item;
                            }
                        });

                        return $scope.views.deviceName = deviceSubmit.shortName;
                    }

                    if (shrink.type === 'store') {
                        angular.forEach(shrink.data, function(list) {
                            angular.forEach(list.storeList, function(item) {
                                if (item.checked) {
                                    console.log( item );
                                    storeId = item._id;
                                    showName += ',' + item.name;
                                    serviceSubjectId = list._id;
                                }
                            });
                        });

                        return $scope.views.storeName = showName.slice(1);
                    }
                }
            });

            $scope.$apply();
        }
    ];
});
