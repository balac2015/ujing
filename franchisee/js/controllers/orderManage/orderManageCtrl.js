/**
 * @file 订单管理
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
        '$daggerSearch',
        '$daggerLoadingBar',
        '$log',
        '$topTip',
        function($scope, cService, $timeout, $daggerSearch, $daggerLoadingBar, $log, $topTip) {

            $scope.views = {
                tipsText: '输入相关信息搜索',
                searchVal: null, // 搜索值
                orderList: [], // 订单列表
                isNotMoreData: false,
                /*
                 * 返券
                 * */
                teturnTicket: function(item) {
                    var params = {
                        orderId: item.orderId
                    };

                    cService.payCoupon(params).then(function(res) {
                        $log.info(res);
                        if (res && res.result === 1) {
                            $topTip(res.msg);
                        } else if (res && res.result === 0) {
                            $topTip('返券失败：' + res.msg);
                        }
                    });
                },
                /*
                 * 重新启动机器
                 * */
                continue: function(item) {
                    var params = {
                        deviceId: item.deviceId
                    };

                    cService.restart(params).then(function(res) {
                        $log.info(res);
                        if (res && res.result === 1) {
                            $topTip('重启执行成功');
                        }
                    });
                },
                /*
                 * enter键搜索
                 * */
                onSearch: function($event) {
                    if ($event.keyCode !== 13 || !this.searchVal) {
                        return;
                    }
                    this.getOrder();
                },
                getOrder: function(index) {
                    if (!/^\d{1,15}/.test(this.searchVal)) {
                        $topTip('请输入正确的订单号或手机号');
                        return;
                    }

                    if (!index) {
                        pageNum = 1;
                    }

                    if (index == 1) {
                        pageNum += 1;
                    }

                    var self = this;
                    var params = {
                        pageSize: 10,
                        pageNum: pageNum,
                        data: this.searchVal || '1234567890'
                    };

                    cService.getOrder(params).then(function(res) {
                        if (res && res.result === 1) {
                            self.orderList = pageNum > 1 ? self.orderList.concat(res.data) : res.data;

                            $scope.views.isNotMoreData = res.data.length >= 10; // 判断页码

                        }
                        $timeout(function() {
                            $scope.$broadcast('scroll.infiniteScrollComplete');
                            $ionicScrollDelegate.$getByHandle('small').resize();
                        }, 300);
                    }, function() {
                        $scope.views.isNotMoreData = false;
                        $topTip('网络超时');
                    });
                }
            };

            var pageNum = 0;

            // $scope.views.getOrder();
            $scope.$apply();
        }
    ];
});
