/**
 * @file 我的设备搜索
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
        '$topTip',
        '$ionicScrollDelegate',
        '$ionicListDelegate',
        '$log',
        '$timeout',
        function($scope, cService, $topTip, $ionicScrollDelegate, $ionicListDelegate, $log, $timeout) {
            $scope.views = {
                isRequest: false,
                laundryList: [],
                deviceList: [],
                listItemIndex: 0,
                // 服务主体列表的选择
                selectList: function(index, item) {
                    if (!$scope.views.laundryList[index].storeList || $scope.views.laundryList[index].storeList.length === 0) {
                        $topTip(item + '下没有洗衣房！');

                        return;
                    }
                    if (this.listItemIndex !== index) {
                        this.listItemIndex = index;
                    } else {
                        this.listItemIndex = -1;
                    }
                    this.laundryName = item;
                    $timeout(function() {
                        $ionicScrollDelegate.$getByHandle('mainScroll').resize();
                    }, 0);
                },
                // 洗衣房列表的选择
                selectItem: function(item) {
                    store = item;
                    this.laundryItem = store.name;
                    getLaundryDeviceList(store._id);
                },
                laundryName: '',
                laundryItem: null,
                // 点击了我的洗衣店
                onLaundry: function() {
                    this.listItemIndex = -1;
                    this.laundryName = '';
                    this.deviceList.length = 0;
                },
                // 设备列表操作后的重新请求接口
                onSelect: function() {
                    $topTip('设备操作处理成功！！');
                    $ionicListDelegate.closeOptionButtons();
                    this.selectItem(store);
                }
            };
            var store = null;

            var getLaundryDeviceList = function(id) {
                cService.getLaundryDeviceList({
                    id: id
                }).then(function(res) {
                    if (res && res.result === 1) {
                        if (res.data.length > 0) {
                            $scope.views.deviceList = res.data;
                        } else {
                            $topTip('该洗衣房下没有设备！！');
                        }
                    }
                });
            };

            // 获取所有洗衣房
            var getAllStore = function() {
                cService.getAllStore().then(function(res) {
                    $log.info('所有洗衣房-------------------------', res);
                    $scope.views.isRequest = true;

                    if (res && res.result === 1) {
                        $scope.views.laundryList = res.data;
                        $scope.views.laundryName = res.data.length > 0 ? res.data[0].serviceSubjectName : '';
                    }
                });
            };

            getAllStore();
            $scope.$apply();
        }
    ];
});
