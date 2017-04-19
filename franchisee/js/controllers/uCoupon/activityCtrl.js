/**
 * @file 活动详情、创建活动
 * @author ytp ylp <tianping.yan@partner.midea.com.cn>
 * @copyright Midea Co.Ltd 1968-2016
 * @license Released under the Commercial license.
 * @version 16/5/4
 */
define(['ionic'], function() {
    'use strict';

    return [
        '$scope',
        'cService',
        '$timeout',
        '$ionicModal',
        '$location',
        '$rootScope',
        'baseService',
        '$topTip',
        '$log',
        '$stateParams',
        '$filter',
        'log',
        function($scope, cService, $timeout, $ionicModal, $location, $rootScope, baseService, $topTip, $log, $stateParams, $filter, log) {
            $scope.views = {
                isEdit: false, // 是否可编辑
                title: '', // 活动名称
                storeName: '', // 显示的洗衣房名称
                discount: '', // 折扣值
                effectiveDays: '', // 有效期
                couponConfig: { // 限定范围
                    maxValue: 9,
                    minValue: 5
                }, // 限制范围
                // 创建优惠券
                addCoupon: function() {
                    if (!this.isEdit) {
                        return $topTip('程序错误！');
                    }

                    if (!this.title) {
                        return $topTip('请输入活动名称');
                    }

                    if (!this.storeName) {
                        return $topTip('请选择限用范围');
                    }
                    if (parseFloat(this.discount) > this.couponConfig.maxValue || parseFloat(this.discount) < this.couponConfig.minValue) {
                        return $topTip('折扣在' + this.couponConfig.minValue + '-' + this.couponConfig.maxValue + '之间');
                    }
                    if (!this.startTime) {
                        return $topTip('请输入派券开始时间');
                    }

                    if (!this.endTime) {
                        return $topTip('请输入派券结束时间');
                    }

                    if (!this.effectiveDays) {
                        return $topTip('请输入有效天数');
                    }

                    cService.addCoupon({
                        title: $scope.views.title,
                        storeIdArray: JSON.stringify(storeSubmit),
                        value: $scope.views.discount + '',
                        activityStartTime: $scope.views.startTime,
                        activityEndTime: $scope.views.endTime,
                        effectiveDays: $scope.views.effectiveDays
                    }).then(function(res) {
                        if (res && res.result === 1) {
                            $topTip('创建成功');
                            $rootScope.$broadcast('couponUpdate', 'insert');
                            $rootScope.goBack();
                        } else {
                            $topTip(res.msg);
                        }
                    }, function() {
                        $topTip('网络延迟~~');
                    });
                },
                /**
                 * 指令器的显示，根据传入的参数显示不同的数据
                 */
                goRouter: function() {
                    if (!this.isEdit) {
                        return;
                    }

                    baseService.items.set('franchisee', 'shrink', {
                        type: 'store',
                        select: 'checkbox',
                        data: storeSelected
                    });

                    return $rootScope.stateGo('shrink');
                },

                isShowMask: false,
                isShowDate: false,
                startDatePicker: false, // 显示开始时间插件
                endDatePicker: false, // 显示结束时间插件
                minAndMaxDate: { // 最大最小值日期
                    minDate: new Date(),
                    maxDate: new Date(new Date().getTime() + 24*365*60*60*1000)
                },
                endDate: $filter('date')(new Date(new Date().getTime() + 24*30*60*60*1000), 'yyyy-MM-dd'), // 默认结束时间
                startDate: $filter('date')(new Date(), 'yyyy-MM-dd'), // 默认开始时间
                startTime: '', // $filter('date')(new Date(), 'yyyy-MM-dd'), // 显示开始时间
                endTime: '', // $filter('date')(new Date(new Date().getTime() + 24*30*60*60*1000), 'yyyy-MM-dd'), // 显示结束时间
                // 显示时间选择
                showMask: function() {
                    if (this.isShowMask) {
                        this.closeDatePicker();
                    } else {
                        this.isShowMask = true;
                    }
                },
                // 关闭时间选择
                closeMash: function() {
                    this.closeDatePicker();
                },
                /**
                 * 选择开始时间、结束时间
                 * @param time {String} 'start' 或 'end'
                 */
                chooseDatePicker: function(time) {
                    if (this.isShowMask) {
                        this.closeDatePicker();
                    } else {
                        this.isShowMask = true;
                    }
                    this.startDatePicker = false;
                    this.endDatePicker = false;
                    this.isShowDate = true;
                    dateType = time;

                    dateSelected = this[time + 'Time'];
                    this[time + 'DatePicker'] = true;
                },
                /**
                 * 时间选择点击确定、取消
                 * @param handler {String} 'cancel' 或 'sure'
                 */
                closeDatePicker: function(handler) {
                    var self = this;
                    var close = function() {
                        self.isShowMask = false;
                        self.isShowDate = false;
                        self.startDatePicker = false;
                        self.endDatePicker = false;
                    };
                    close();

                    if (!handler || handler === 'cancel') {
                        this[dateType + 'Time'] = dateSelected;

                        return;
                    }

                    if (handler === 'sure') {
                        if (this.startTime > this.endTime) {
                            this[dateType + 'Time'] = dateSelected;
                            $topTip('开始时间不能大于结束时间！');

                            return;
                        }
                    }
                },
            };

            var storeSelected = [], // 限用范围相关
                storeSubmit = [];

            var dateSelected, dateType; // 日期选择相关
          /*  $scope.$watch('views.startDate', function(newVal) {
                if (newVal) {
                    $scope.views.startTime = newVal;
                }
            });
            $scope.$watch('views.endDate', function(newVal) {
                if (newVal) {
                    $scope.views.endTime = newVal;
                }
            });*/

            // 获取所有洗衣房数据
            var getAllStore = function() {
                var allStoreList = baseService.items.get('franchisee', 'getAllStore');

                if (allStoreList) {
                    storeSelected = allStoreList;

                    return;
                }

                cService.getAllStore().then(function(res) {
                    if (res && res.result === 1 && res.data.length > 0) {
                        storeSelected = res.data;
                    }
                });
            };

            // 获取基础数据
            var getBaseData = function() {
                var baseData = baseService.items.get('franchisee', 'baseData');

                if (baseData && baseData.couponConfig) {
                    $scope.views.couponConfig = baseData.couponConfig;

                    return;
                }

                cService.getBaseData().then(function (res) {
                    if (res && res.result === 1 && res.data) {
                        $scope.views.couponConfig = res.data.couponConfig;
                        baseService.items.set('franchisee', 'baseData', res.data);
                    } else {
                        $topTip('获取基础数据失败');
                        $scope.goBack();
                    }
                });
            };

            // 初始化函数
            var init = function() {
                var couponItem = baseService.items.get('coupon', 'item');

                if (!couponItem) {
                    $scope.views.isEdit = true;
                    getBaseData();
                    getAllStore();
                    $scope.$watch('views.startDate', function(newVal) {
                        if (newVal) {
                            $scope.views.startTime = newVal;
                        }
                    });
                    $scope.$watch('views.endDate', function(newVal) {
                        if (newVal) {
                            $scope.views.endTime = newVal;
                        }
                    });
                    return;
                }

                var names = '';
                $scope.views.isEdit = false;

                $scope.views.title = couponItem.title;
                $scope.views.discount = couponItem.value;
                $scope.views.startTime = $filter('date')(couponItem.activityStartTime, 'yyyy-MM-dd');
                $scope.views.endTime = $filter('date')(couponItem.activityEndTime, 'yyyy-MM-dd');
                $scope.views.effectiveDays = couponItem.effectiveDays;

                angular.forEach(couponItem.stores, function(item) {
                    names += ',' + item.storeName;
                });
                $scope.views.storeName = names.slice(1);
            };
            init();

            // 观察页面跳转,设置限定范围
            $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState) {
                // 从 shrink 页面返回
                if (fromState.name === 'shrink' && toState.name === 'activity') {
                    var shrink = baseService.items.get('franchisee', 'shrink');
                    var showName = '';

                    angular.forEach(shrink.data, function(list) {
                        angular.forEach(list.storeList, function(item) {
                            if (item.checked) {
                                //storeIds.push(item._id);
                                storeSubmit.push({
                                    id: item._id,
                                    name: item.name
                                });
                                showName += ',' + item.name;
                            }
                        });
                    });

                    $scope.views.storeName = showName.slice(1);
                }
            });
/*
            // 观察页面跳转,设置限定范围
            $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState) {
                var limitActivityList = baseService.items.get('listData', 'laundry'),
                    limitStr = '',
                    storeIdArray = [];

                // 返回分享领券活动 清空限定范围
                if (toState.name === 'coupon') {
                    baseService.items.set('activity', 'item', null);
                    baseService.items.set('page', 'activity', null);
                    baseService.items.set('listData', 'laundry', null);
                }
            });
            */
            $scope.$apply();
        }
    ];
});
