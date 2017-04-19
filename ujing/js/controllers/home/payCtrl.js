/**
 * @file 登陆跳转页
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
        'cFactory',
        '$topTip',
        '$location',
        '$stateParams',
        '$daggerLoadingBar',
        function($scope, cService, widgetFactory, $ionicPopup, $ionicModal, $rootScope, baseService, myWidgetFactory, $timeout, cFactory, $topTip, $location, $stateParams, $daggerLoadingBar) {
            $scope.views = {
                isRequest: false, // 是否请求接口成功
                orderState: 10, // 订单状态
                orderStatus: 10, // 订单状态

                isPayZero: false, // 使用优惠券后支付价格是否为 0
                isDryLaundry: false, // 是否为干衣机
                payTime: 600, // 待支付支付倒计时
                startTime: 600, // 待洗衣倒计时
                cleanTime: 360, // 自洁倒计时
                order: {}, // 订单数据

                // 预订超时结束订单，只处理停留在当前页面时
                remainHandlerPay: function() {
                    var path = $location.path();

                    if (this.orderStatus > 10) { // 已经支付成功
                        return;
                    }

                    if (path === '/pay') {
                        cFactory.alert('已经超过支付时间，请重新进行下单！', '返回首页').then(function(res) {
                            if (res) {
                                $rootScope.jump('home');
                            }
                        });
                    }
                },
                // 设备启动超时结束订单，只处理停留在当前页面时
                timeOutStart: function() {
                    var path = $location.path();

                    if (path === '/pay') {
                        cFactory.alert('启动限定时间已到，机器已被释放，退款将于2小时内退回！', '返回首页').then(function() {
                            $rootScope.jump('home');
                        });
                    }
                },

                // 自洁完成处理
                timeOutClean: function() {
                    if (this.orderStatus != 30) {

                        return;
                    }

                    this.orderStatus = 35;
                },
                isHasCoupon: false, // 是否使用优惠券
                isCouponFirst: false, // 是否有免单券
                coupon: { // 优惠券
                    id: '',
                    type: '',
                    value: '',
                    show: '' // 页面显示结果
                },
                payValue: '', // 支付金额
                payType: -1, // 支付方式
                clearTitle: '简自洁（进行中）',
                payWayList: [
                    {
                        text: '支付宝',
                        value: '0',
                        clsName: 'pay-alipay'
                    },
                    {
                        text: '微信支付',
                        value: '1',
                        clsName: 'pay-weixin'
                    }
                ],
                payWayChange: function(item) {
                    localStorage.setItem('ujing-payType', item.value); // 缓存支付类型
                },
                // 支付
                onPay: function() {
                    $daggerLoadingBar.start();
                    var self = this,
                        outTradeNo = self.order.orderId,
                        body = self.order.deviceTypeName + self.order.deviceNo + self.order.workModle,
                        money = self.payValue * 100 < 1 ? 1 : parseInt(self.payValue * 100); // 打折时会出现小数点问题

                    /**
                     * 支付完成后的处理
                     * @param res {Object、Boolean} 原生返回数据
                     */
                    var payed = function(res) {
                        $daggerLoadingBar.complete();
                        var result = res.result || false;

                        // 支付成功
                        var success = function() {
                            self.remainHandlerPay = null;
                            self.startTime = 600;

                            self.orderStatus = 20; // 待启动
                            baseService.items.del('coupon', 'item');

                            $timeout(function() {
                                $rootScope.jump('order');
                            }, 5000);
                        };

                        /**
                         * 使用优惠券接口：只通知后台有使用了优惠券，只要调用都会返回成功
                         * @param couponId 优惠券ID
                         * @param orderId 订单ID
                         */
                        var useCoupon = function(couponId, orderId) {
                            cService.useCoupon({
                                couponId: couponId,
                                orderId: orderId
                            }).then(success, success);
                        };

                        // 支付成功
                        if (!result || result == 'false') {
                            cFactory.alert('支付失败！');
                        } else {
                            if ($scope.views.isHasCoupon) {
                                useCoupon(self.coupon.id, self.order.orderId);
                            } else {
                                success();
                            }
                        }
                    };

                    if (self.isPayZero) {
                        return payed({result: true});
                    }

                    /**
                     * 支付处理
                     * @param outTradeNo 订单ID
                     * @param totalFee 支付金额：分
                     * @param body 商品描述
                     */
                    var paying = function(outTradeNo, totalFee, body) {
                        // 原生支付接口请求参数
                        var params = [];
                        params.push(outTradeNo, totalFee, body);

                        // 支付宝支付
                        if ($scope.views.payType == 0) {
                            myWidgetFactory.alipay(params).then(function(res) {
                                payed(res);
                            });

                            // 微信支付
                        } else if ($scope.views.payType == 1) {
                            myWidgetFactory.wechatPay(params).then(function(res) {
                                payed(res);
                            });
                        }
                    };

                    if ($scope.views.payType < 0 || $scope.views.payType > $scope.views.payWayList.length) {
                        cFactory.alert('请选择支付方式！');

                        return;
                    }

                    // 订单ID、支付金额、商品描述
                    paying(outTradeNo, money, body);
                },
                // 免费筒自洁
                onClear: function() {
                    if (this.orderStatus == 30) {
                        $topTip('简自洁进行中……');

                        return;
                    }

                    if (this.orderStatus == 35) {
                        $topTip('简自洁已完成！');

                        return;
                    }

                    cFactory.startSelfClean({
                        orderId: $scope.views.order.orderId,
                        deviceId: $scope.views.order.deviceId,
                        isSupportScan: $scope.views.order.isSupportScan
                    }, function() {
                        $rootScope.jump('clearing', {
                            orderId: $scope.views.order.orderId,
                            deviceId: $scope.views.order.deviceId
                        });
                        $scope.views.orderStatus = 30;
                    });
                },
                // 直接启动洗衣
                onStart: function() { // 启动洗衣
                    if ($scope.views.orderStatus === 30) {
                        cFactory.alert('请等待简自洁完成，再启动洗衣');

                        return;
                    }

                    if ($scope.views.orderStatus == 20 || $scope.views.orderStatus == 35) {
                        // 调用启动接口前先弹窗提示洗衣机正常，确定后回掉 startWash
                        cFactory.startWash({
                            orderId: $scope.views.order.orderId,
                            deviceId: $scope.views.order.deviceId
                        }, function() {
                            // $scope.views.orderStatus = 40; 有跳轉，省略狀態的改變
                            $topTip('启动洗衣成功！');
                            $rootScope.jump('order');
                        });
                    }
                },
                // 跳转页面
                goCoupon: function(route, param) {
                    if (this.isCouponFirst) {
                        $topTip('请优先使用免单券！');

                        return;
                    }
                    $rootScope.jump(route, {
                        source: param
                    });
                }
            };

            // 可用优惠券列表接口
            var getCouponList = function() {
                cService.getCouponList().then(function(res) {
                    if (res && res.result === 1) {
                        $scope.views.coupon.show = res.data.length + '张';
                        baseService.items.set('coupon', 'list', res.data);

                        // 筛选首单免
                        angular.forEach(res.data, function(item) {
                            if (item.couponType == 1) {
                                $scope.views.isHasCoupon = true;
                                $scope.views.isCouponFirst = true;
                                $scope.views.coupon.id = item._id;
                                $scope.views.coupon.type = item.couponType;
                                $scope.views.coupon.value = 0;
                                $scope.views.coupon.show = '首单免';
                                $scope.views.payValue = 0;
                                $scope.views.isPayZero = true;
                            }
                        });
                    }
                });
            };

            /*
             * 判断是否有使用优惠券
             * @params value {Number} 订单本身的支付金额
             */
            var hasCoupon = function(value) {
                var coupon = baseService.items.get('coupon', 'item');

                if ($stateParams.source && $stateParams.source === 'coupon' && coupon) {
                    $scope.views.isHasCoupon = true;
                    $scope.views.coupon.id = coupon.id;
                    $scope.views.coupon.type = coupon.type;
                    $scope.views.coupon.value = coupon.value;

                    if (coupon.type == 1) {

                        $scope.views.isCouponFirst = true;

                        $scope.views.coupon.show = '首单免';
                        $scope.views.payValue = 0;
                        $scope.views.isPayZero = true;
                    }
                    if (coupon.type == 2) {
                        $scope.views.isCouponFirst = false;
                        $scope.views.coupon.show = coupon.value + '折';
                        $scope.views.payValue = value * coupon.value * 0.1;
                        $scope.views.payValue =  $scope.views.payValue < 0.01 ? 0.01 :  $scope.views.payValue;
                    }
                    if (coupon.type == 3) {
                        $scope.views.isCouponFirst = false;
                        $scope.views.coupon.show = '￥' + coupon.value;
                        $scope.views.payValue = value - coupon.value;
                        if ($scope.views.payValue <= 0) {
                            $scope.views.payValue = 0;
                            $scope.views.isPayZero = true;
                        }
                    }
                } else {
                    getCouponList();
                }
            };

            // 获取用户订单接口
            var getOrderList = function() {
                cService.getOrderList().then(function(res) {
                    $scope.views.isRequest = true;

                    if (res && res.result === 1 && res.data.length > 0) {
                        // 待支付订单筛选
                        angular.forEach(res.data, function(item) {
                             // 待支付
                            if (item.status == 10) {
                                $scope.views.payTime = item.washLeftTime;

                                if (item.deviceTypeName.indexOf('干衣') !== -1) {
                                    $scope.views.isDryLaundry = true;
                                }

                                $scope.views.orderStatus = item.status;
                                $scope.views.order = item;
                                $scope.views.payValue = item.payPrice;
                            }
                        });

                        var payTypeCache = localStorage.getItem('ujing-payType'); // 从缓存里取支付类型，没有缓存默认取第一个方式
                        $scope.views.payType = payTypeCache ? payTypeCache : 0;

                        // 订单本身的支付金额
                        //var value = $scope.views.order.promotionPrice > 0 ? $scope.views.order.promotionPrice : $scope.views.order.washPrice;
                        hasCoupon($scope.views.payValue);
                    } else {
                        $topTip('获取支付订单失败！');
                        $rootScope.jump('home');
                    }
                });
            };

            // todo: 待删监听优惠券更新
            /*$rootScope.$on('updateCoupon', function(e, coupon) {
                getCouponList();
            });*/

            // 页面跳转时移出清除计时器完成时的事件处理
            $scope.$on('$destroy', function() {
                $scope.views.remainHandlerPay = null;
            });


            getOrderList();

            $scope.$apply();
        }
    ];
});
