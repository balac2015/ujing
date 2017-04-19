/**
 * @file 审核
 * @author ytp <tianping.yan@partner.midea.com.cn>
 * @copyright Midea Co.Ltd 1968-2016
 * @license Released under the Commercial license.
 * @version 16/5/4
 */
define(['ionic'], function() {
    'use strict';

    return [
        '$scope',
        'cService',
        'baseService',
        '$ionicScrollDelegate',
        '$timeout',
        '$rootScope',
        '$state',
        '$location',
        'log',
        'cFactory',
        function($scope, cService, baseService, $ionicScrollDelegate, $timeout, $rootScope, $state, $location, log, cFactory) {
            $scope.views = {
                title: '', // 洗衣房名称
                isExamine: false, // 未通过审核
                isEmpty: false, // 是否有设备
                isRequest: false,
                selectDeviceIndex: -1, // 列表数组选中的下标
                deviceList: [], // 设备列表
                /**
                 * 洗衣房列表卷帘效果
                 * @param index 需要展开、收起的下标
                 */
                selectDevice: function(index) {
                    if (this.selectDeviceIndex !== index) {
                        this.selectDeviceIndex = index;
                    } else {
                        this.selectDeviceIndex = -1;
                    }
                    $timeout(function() {
                        $ionicScrollDelegate.$getByHandle('mainScroll').scrollTop(true);
                    }, 30);
                },
                goStoreDetail: function() {
                    $state.go('storeEdit', {
                        id: storeItem._id
                    });
                },
                goDevice: function() {
                    $state.go('setDevice');
                }
            };

            var getLaundryDeviceList = function(storeItem) {
                var starts = storeItem.approveStatus;

                cService.getLaundryDeviceList({
                    id: storeItem._id
                }).then(function(res) {
                    $scope.views.isRequest = true;

                    if (res && res.result === 1 && res.data) {
                        var idList = [],
                            deviceList = [],
                            i = -1,
                            j = -1;

                        angular.forEach(res.data, function(item) {
                            j = idList.indexOf(item._id);
                            if (j === -1) {
                                i += 1;
                                idList[i] = item._id;
                                deviceList[i] = [];
                                deviceList[i].push(item);
                            } else {
                                deviceList[i].push(item);
                            }
                        });
                        $scope.views.deviceList = deviceList;
                    }
                });
            };

            var storeItem = baseService.items.get('store', 'item');
console.log( storeItem );
            var init = function(item) {
                if (!item) {
                    return cFactory.alert('该服务主体下已经没有洗衣房，请重新添加！').then(function(res) {
                        if (res) {
                            $rootScope.goBack();
                        }
                    });
                }

                $scope.views.title = item.name;

                if (item.approveStatus == '02') {
                    $scope.views.isExamine = true;
                    $scope.views.examineTip = '新建的洗衣房还没有设备喔！';

                    return getLaundryDeviceList(item);
                }

                if (item.approveStatus == '01') {
                    $scope.views.isRequest = true;
                    $scope.views.examineTip = '洗衣房还在审核中……';

                    return;
                }

                if (item.approveStatus == '03') {
                    $scope.views.isRequest = true;
                    $scope.views.examineTip = '洗衣房审核不通过，请联系相关负责人！';

                    return;
                }
            };

            init(storeItem);

            $rootScope.$on('updateStore', function(e, d) {
                init(d.data);
            });

            $rootScope.$on('$destory', function() {
                cFactory.removePopup();
            });
            $scope.$apply();
        }
    ];
});
