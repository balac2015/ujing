/**
 * @file 经营统计
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
        '$timeout',
        '$ionicScrollDelegate',
        '$topTip',
        '$filter',
        'baseService',
        function($scope, cService, $timeout, $ionicScrollDelegate, $topTip, $filter, baseService) {
            $scope.views = {
                statisticsData: null, // 统计数据
                statisticsList: [],
                laundryList: [],
                laundrySelected: null,
                isShowLaundry: false,
                statisticsItem: {},
                activeProcess: 10,
                paidProcess: 10,
                cancelProcess: 10,
                // 主体下拉的改变
                laundryChange: function(item) {
                    laundryItem = item;

                    this.statisticsList = [];
                    classifiedStatistics({
                        serviceSubjectId: !item ?  '' : item._id,
                        startTime: self.startSelected,
                        endTime: self.endSelected
                    });
                },
                isShowMask: false,
                isShowDate: false,
                startDatePicker: false,
                startDate: 0,
                startSelected: $filter('date')(new Date(new Date().getFullYear(), new Date().getMonth(), 1), 'yyyy-MM-dd'), // 开始选择时间
                endDatePicker: false,
                endDate: 0,
                minAndMaxDate: {
                    minDate: new Date(2000, 1, 1) // 统计允许的最小时间
                },
                endSelected: $filter('date')(new Date(), 'yyyy-MM-dd'), // 结束选择时间
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
                    this.startDatePicker = false;
                    this.endDatePicker = false;
                    this.isShowDate = true;
                    dateType = time;

                    dateSelected = this[time + 'Selected'];
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
                        this[dateType + 'Selected'] = dateSelected;

                        return;
                    }

                    if (handler === 'sure') {
                        if (this.startSelected > this.endSelected) {
                            this[dateType + 'Selected'] = dateSelected;
                            $topTip('开始时间不能大于结束时间！');

                            return;
                        }

                        statistics({
                            startTime: self.startSelected,
                            endTime: self.endSelected,
                            serviceSubjectId: self.laundryItem ? self.laundryItem._id : ''
                        });
                    }
                },
                // todo: 待删
                chooseLaundry: function(event, item, index) {
                 /*   console.log(111111111111111111111111111111111111111)
                    var self = this;
                    event.stopPropagation();
                    self.isShowLaundry = false;
                    self.laundryItem = item;
                    if (self.laundryList.indexOf(laundrySelected) === -1) {
                        self.laundryList.unshift(laundrySelected);
                    }

                    classifiedStatistics({
                        serviceSubjectId: !laundryItem ?  '' : laundryItem._id,
                        startTime: self.startSelected,
                        endTime: self.endSelected
                    });*/
                },
                cleanLaundry: function(event) {
                    event.stopPropagation();
                },
                showList: function(event) {
                    event.stopPropagation();
                    this.isShowLaundry = !this.isShowLaundry;
                }
            };
            var pageSize = 0, // 消息页每页大小
                pageNum = 1, // 页号
                laundrySelected = '--全部服务主体--',
                laundryList = [],
                laundryItem = null,
                dateSelected, dateType; // 日期选择相关

            $scope.$watch('views.startDate', function(newVal) {
                if (newVal) {
                    $scope.views.startSelected = newVal;
                }
            });
            $scope.$watch('views.endDate', function(newVal) {
                if (newVal) {
                    $scope.views.endSelected = newVal;
                }
            });

            // 获取服务主体数据
            var getServiceSubjectList = function() {
                laundryList = baseService.items.get('laundry', 'list');

                if (laundryList) {
                    $scope.views.laundryList = laundryList;

                    return;
                }

                cService.getServiceSubjectList().then(function(res) {
                    if (res && res.result === 1 && res.data && res.data.length > 0) {
                        laundryList = res.data;
                        $scope.views.laundryList = laundryList;
                        baseService.items.set('laundry', 'list', laundryList);
                    }
                });
            };

            // 分类统计，按洗衣机分类统计收入和订单
            var classifiedStatistics = function(option) {
                var statisticsList = [];
                var params = {
                    serviceSubjectId: option.serviceSubjectId || '',
                    startTime: option.startTime || '',
                    endTime: option.endTime || '',
                    pageNum: pageNum,
                    pageSize: pageSize
                };

                cService.classifiedStatistics(params).then(function(res) {

                    if (res && res.result === 1 && res.data.length > 0) {

                        angular.forEach(res.data, function(item) {
                            statisticsList.push({
                                storeName: item.storeName,
                                income: {
                                    realIncomes: parseInt(item.income.realIncomes * 100) / 100,
                                    refund: parseInt(item.income.refund * 100) / 100,
                                    totalIncomes: parseInt(item.income.totalIncomes * 100) / 100
                                },
                                order: {
                                    activeOrders: parseInt(item.order.activeOrders * 100) / 100,
                                    cancelOrders: parseInt(item.order.cancelOrders * 100) / 100,
                                    paidOrders: parseInt(item.order.paidOrders * 100) / 100,
                                    refundOrders: parseInt(item.order.refundOrders * 100) / 100,
                                    totalOrders: parseInt(item.order.totalOrders * 100) / 100
                                }
                            });
                        });
                    }
                    $scope.views.statisticsList = statisticsList;
                    $ionicScrollDelegate.$getByHandle('small').resize();
                });
            };

            // 经营总统计，获取收入和订单总的统计数据
            var statistics = function(params) {
                var attr = {};

                cService.statistics(params).then(function(res) {
                    console.log( '统计数据=============', res );
                    if (res && res.result === 1 && res.data) {
                        attr.activeOrders = parseInt(res.data.activeOrders * 100) / 100;
                        attr.cancelOrders = parseInt(res.data.cancelOrders * 100) / 100;
                        attr.paidOrders = parseInt(res.data.paidOrders * 100) / 100;
                        attr.realIncomes = parseInt(res.data.realIncomes * 100) / 100;
                        attr.refund = parseInt(res.data.refund * 100) / 100;
                        attr.refundOrders = parseInt(res.data.refundOrders * 100) / 100;
                        attr.totalIncomes = parseInt(res.data.totalIncomes * 100) / 100;
                        attr.totalOrders = parseInt(res.data.totalOrders * 100) / 100;

                        $scope.views.statisticsData = attr;

                        // 统计当月1号到今天数据
                        classifiedStatistics({
                            serviceSubjectId: !laundryItem ?  '' : laundryItem._id,
                            endTime: $scope.views.endSelected,
                            startTime: $scope.views.startSelected
                        });

                        $timeout(getServiceSubjectList, 800);
                    }
                });
            };
            // 初始化
            statistics();
            $scope.$apply();
        }
    ];
});
