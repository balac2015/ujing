/**
 * @file 订单
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
        '$daggerLoadingBar',
        '$rootScope',
        '$timeout',
        '$topTip',
        '$log',
        '$ionicListDelegate',
        '$ionicScrollDelegate',
        'myWidgetFactory',
        'cFactory',
        'baseService',
        '$interval',
        function($scope, cService, $daggerLoadingBar, $rootScope, $timeout, $topTip, $log, $ionicListDelegate, $ionicScrollDelegate, myWidgetFactory, cFactory, baseService, $interval) {
            $scope.views = {
                isNotMoreData: true, // 是否有更多数据
                isRequest: false,
                orderList: [], // 进行中订单列表
                historyList: [], // 历史订单列表
                orderStatus: 0, // 订单状态
                isHistRequest: false,
                isOrderRequest: false,
                // 取消订单
                cancelOrder: function(item) {
                    cFactory.confirm('是否要取消该订单？').then(function(res) {
                        if (res) {
                            cService.cancelOrder({orderId: item.orderId}).then(function(res) {
                                if (res && res.result === 1) {
                                    $topTip('取消订单成功！');
                                    getOrderList();
                                    //$scope.views.orderList.splice(index, 1);
                                    //$rootScope.$broadcast('updateStoreDetail');
                                } else {
                                    $topTip(res.msg);
                                }
                            });
                        }
                    });
                },
                // 删除订单
                deleteOrder: function(item, index) {
                    cFactory.confirm('是否删除该订单？').then(function(res) {
                        if (res) {
                            cService.deleteOrder({orderId: item.orderId}).then(function(res) {
                                if (res && res.result === 1) {
                                    $topTip('删除订单成功！');
                                    $ionicListDelegate.closeOptionButtons();
                                    $scope.views.historyList.splice(index, 1);
                                } else {
                                    $topTip(res.msg);
                                }
                            });
                        }
                    });
                },
                // 更换设备
                switchDevice: function(item) {
                    cFactory.confirm('是否更换该设备？').then(function(res) {
                        if (res) {
                            cService.switchDevice({orderId: item.orderId}).then(function(res) {
                                if (res && res.result === 1) {
                                    $topTip('更换设备成功！');
                                    //item.deviceNo = data.no;
                                    getOrderList();
                                } else {
                                    $topTip(res.msg);
                                }
                            });
                        }
                    });
                },
                // 故障处理
                getErrorDetail: function(item) {
                    var params = {
                        deviceId: item.deviceId,
                        orderId: item.orderId
                    };
                    cService.getErrorDetail(params).then(function(res) {

                        if (res && res.result == 1) {
                            cFactory.confirm(res.data).then(function(conf) {
                                if (conf) {
                                    cService.continueWash(params).then(function(msg) {
                                        if (msg && msg.result == 1) {
                                            getOrderList();
                                        } else {
                                            $topTip(msg.msg);
                                        }
                                    }, function() {
                                        $topTip('服务器请求失败，请稍后重试！');
                                    });
                                }
                            });
                        } else {
                            cService.alert(res.msg);
                        }
                    });

                    // todo: 修改为上面代码
                    /*
                    cFactory.confirm('是否要进行故障处理？').then(function(res) {
                        if (res) {
                            cService.getErrorDetail(params).then(function(res) {
                                if (res && res.result == 1) {

                                    cFactory.confirm(res.data).then(function(conf) {
                                        if (conf) {
                                            cService.continueWash(params).then(function(msg) {
                                                if (msg && msg.result == 1) {
                                                    getOrderList();
                                                } else {
                                                    $topTip(msg.msg);
                                                }
                                            }, function() {
                                                $topTip('服务器请求失败，请稍后重试！');
                                            });
                                        }
                                    });

                                    //$topTip('故障处理成功！');
                                    //
                                    //getOrderList();
                                }
                            });
                        }
                    });
                    */
                },
                // 紧急停机
                stopDevice: function(item) {
                    cFactory.confirm('是否要进行紧急停机？').then(function(res) {
                        if (res) {
                            cService.stopDevice({
                                deviceId: item.deviceId,
                                orderId: item.orderId
                            }).then(function(res) {
                                if (res && res.result == 1) {
                                    $topTip('紧急停机成功');
                                    getOrderList();
                                }
                            });
                        }
                    });
                },
                // 筒自洁
                startSelfClean: function(item) {
                    var startSelfClean = function() {
                        cService.startSelfClean({
                            orderId: item.orderId,
                            deviceId: item.deviceId
                        }).then(function(res) {
                            console.log('简自洁--------------', res);
                            if (res && res.result === 1) {
                                baseService.items.set('ujing', 'clearing', res.data);
                                $rootScope.jump('clearing', {
                                    deviceId: item.deviceId,
                                    orderId: item.orderId
                                });
                            } else {
                                init(res.msg);
                            }
                        });
                    };

                    // 自洁前进行扫码
                    var scanningCode = function() {
                        myWidgetFactory.scanningCode().then(function(data) {
                            if (data && data.text) {
                                startSelfClean(data.text);
                            }
                        });
                    };

                    function init(scan) {
                        if (!item.isSupportScan) {
                            return cFactory.confirm('请先按一下洗衣机上的自洁按钮，再点击确定启动自洁！').then(function(res) {
                                if (res) {
                                    startSelfClean();
                                }
                            });
                        }

                        // 第二次扫描
                        if (scan) {
                            return scanningCode();
                        }

                        // 第一次扫描
                        return cFactory.confirm('请扫描洗衣机上的二维码启动自洁。', '扫码').then(function(res) {
                            if (res) {
                                scanningCode();
                            }
                        });
                    }
                    init();
                },
                // 支付
                payStart: function(item) {
                    $rootScope.jump('pay', {
                        source: 'order'
                    });

                    //$rootScope.jump('pay', {
                    //    id: item.orderId
                    //});
                },
                onfresh: function(index) {
                    // 运行订单下拉刷新
                    if (index === 0) {
                        return getOrderList();
                    }

                    // 历史订单下拉刷新
                    if (index === 1) {
                        pageNum = 1;
                        //$scope.views.historyList = [];

                        return getHistoryOrderList();
                    }

                    // 历史订单加载更多
                    if (index === 2) {
                        pageNum += 1;

                        return getHistoryOrderList();
                    }
                },
                // 启动超时处理
                remainHandlerStart: function() {
                    $topTip('订单启动超出规定时间，订单自动取消！');

                    getOrderList();
                },
                // 支付超时处理
                remainHandlerPay: function(index) {
                    $topTip('已经超出规定时间，订单自动取消！');

                    getOrderList();
                },
                // 洗衣剩余时间处理
                remainHandlerRun: function(index) {
                    $topTip('洗衣已经完成，请及时取衣！');

                    getOrderList();
                },
                // 跳转时检测是否有登陆
                jumpCheckLogin: function(route) {
                    cService.userInfo(function() {
                        $rootScope.jump(route, {
                            source: 'order'
                        });
                    });
                },
                // 启动洗衣
                startWash: function(item) {
                    var tip1, tip2;

                    if (item.deviceTypeName.indexOf('干衣') === -1) {
                        tip1 = '放好衣物和洗衣液，并确定门已关闭，点击确定启动洗衣！';
                        tip2 = '启动洗衣成功！'
                    } else {
                        tip1 = '请放好衣物，保持衣物松散，并确定机门已关，点击确定按钮启动干衣';
                        tip2 = '启动烘衣成功！';
                    }
                    cFactory.confirm(tip1).then(function(res) {
                        if (res) {
                            cService.startWash({
                                orderId: item.orderId,
                                deviceId: item.deviceId
                            }).then(function(res) {
                                if (res && res.result === 1) {
                                    $topTip(tip2);
                                    getOrderList();
                                } else {
                                    $topTip(res.msg);
                                }
                            });
                        }
                    });
                }
            };
            var pageNum = 0; // 历史订单页面
            var timer = null;

            // 获取用户历史订单列表，请求历史订单接口
            var getHistoryOrderList = function() {
                var params = {
                    pageSize: 10, // 每页大小
                    pageNum: pageNum // 页号
                };

                cService.getHistoryOrderList(params).then(function(res) {
                    $scope.views.isHistRequest = true;

                    if (res && res.result === 1 && res.data.length > 0) {
                        if (pageNum > 1) {
                            $scope.views.historyList = $scope.views.historyList.concat(res.data);
                        } else {
                            $scope.views.historyList = res.data;
                        }

                        $scope.views.isNotMoreData = res.data.length >= 10; // 判断页码
                        $timeout(function() {
                            $scope.$broadcast('scroll.infiniteScrollComplete');
                            $ionicScrollDelegate.$getByHandle('small').resize();
                        }, 300);
                    } else {
                        $scope.views.isNotMoreData = false;
                    }

                }).finally(function() {
                    $scope.$broadcast('scroll.refreshComplete');
                });
            };

            // 获取用户订单列表，请求我的订单接口
            var getOrderList = function() {
                $scope.views.orderList = [];

                cService.getOrderList().then(function(res) {
                    $scope.views.isOrderRequest = true;

                    if (res && res.result === 1 && res.data.length > 0) {
                        $scope.views.orderList = res.data;
                        $interval.cancel(timer);
                        timer = $interval(function() {
                            getOrderList();
                        }, 60000);
                    } else {
                        $interval.cancel(timer);
                        $scope.views.remainHandlerPay = null;
                        $scope.views.remainHandlerStart = null;
                        $scope.views.remainHandlerRun = null;
                    }
                    $timeout(function() {
                        $ionicScrollDelegate.$getByHandle('mainScroll').resize();
                    }, 300);
                }).finally(function() {
                    $scope.$broadcast('scroll.refreshComplete');
                });
            };

            // 初始化
            cService.userInfo(getOrderList);

            // 页面跳转时移出清除计时器完成时的事件处理
            $scope.$on('$destroy', function() {
                $interval.cancel(timer);
                $scope.views.remainHandlerPay = null;
                $scope.views.remainHandlerStart = null;
                $scope.views.remainHandlerRun = null;
            });

            // 观察页面跳转
            //$scope.$on('$stateChangeSuccess', function(event, state, stateP, go, goP) {
            //    if (state.name === 'order') {
            //        $scope.views.orderRefresh();
            //    }
            //});

            // 监听订单状态，刷新
            //$rootScope.$on('updateOrder', function(e, d) {
            //    console.log('订单改变的状态：', d);
            //    $scope.views.orderRefresh();
            //});
            $scope.$apply();
        }
    ];
});
