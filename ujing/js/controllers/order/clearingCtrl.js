/**
 * @file 筒自洁
 * @author ytp <tianping.yan@partner.midea.com.cn>
 * @copyright Midea Co.Ltd 1968-2016
 * @license Released under the Commercial license.
 * @version 16/4/21
 */
define(['ionic'], function() {
    'use strict';

    return [
        '$scope',
        'cService',
        'widgetFactory',
        '$ionicPopup',
        '$ionicModal',
        '$rootScope',
        'baseService',
        'myWidgetFactory',
        '$timeout',
        '$log',
        'cFactory',
        '$topTip',
        '$stateParams',
        function($scope, cService, widgetFactory, $ionicPopup, $ionicModal, $rootScope, baseService, myWidgetFactory, $timeout, $log, cFactory, $topTip, $stateParams) {
            $scope.views = {
                title: '', // 标题
                orderStatus: 20, // 订单状态
                time: '', // 倒计时
                // 倒计时完成时的处理
                remainResult: function() {
                    this.title = '筒自洁（已完成）';
                    $scope.views.orderStatus = 35;
                },
                // 启动洗衣
                onStart: function() {
                    return $rootScope.jump('order');

                    if (this.orderStatus === 20) {
                        cFactory.alert('正在筒自洁中……');

                        return;
                    }

                    if (this.orderStatus === 40) {
                        cFactory.alert('洗衣已经在洗涤中……！');

                        return;
                    }

                    if (this.orderStatus === 35) {
                        cFactory.startWash({
                            orderId: orderId,
                            deviceId: deviceId
                        }, function() {
                            $topTip('启动洗衣成功！');
                            $scope.views.orderStatus = 40;
                        });
                    }
                },
                backPage: function() {
                    // 启动洗衣、洗衣完成则返回订单页
                    $rootScope.jump('order');
                }
            };

            // 免费筒自洁
            var startSelfClean = function(orderId, deviceId) {
                cService.startSelfClean({
                    orderId: orderId,
                    deviceId: deviceId
                }).then(function(res) {
                    console.log('免费简自洁----------', res);

                    if (res && res.result == 1) {
                        $scope.views.title = '简自洁（进行中）';
                        $scope.views.orderStatus = 30;

                        $scope.views.time = res.remainTime; // 以秒的数字计算
                    } else {
                        cFactory.alert(res.msg).then(function() {
                            //$scope.views.orderStatus = 20;
                            $rootScope.jump('order');
                        });
                    }
                });
            };

            var clearing = baseService.items.get('ujing', 'clearing');

            console.log('================================', clearing);

            if (clearing && clearing.remainTime) {
                $scope.views.title = '简自洁（进行中）';
                $scope.views.orderStatus = 30;

                $scope.views.time = clearing.remainTime; // 以秒的数字计算

                //$timeout(function() {
                //    $rootScope.jump('order')
                //}, 30000);
            } else {
                $topTip('获取数据失败！');
                $rootScope.jump('order');
            }


/*
            var orderId = $stateParams.orderId || '',
                deviceId = $stateParams.deviceId || '';

            if (orderId && deviceId) {
                startSelfClean(orderId, deviceId);
            } else {
                cFactory.alert('获取数据异常，请重新尝试！').then(function() {
                    $rootScope.jump('order');
                })
            }
            */
            $scope.$apply();
        }
    ];
});
