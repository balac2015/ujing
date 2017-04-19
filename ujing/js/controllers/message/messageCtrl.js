/**
 * @file 消息列表
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
        '$rootScope',
        '$ionicActionSheet',
        '$log',
        '$timeout',
        '$ionicScrollDelegate',
        '$location',
        'myWidgetFactory',
        '$stateParams',
        'baseService',
        function($scope, cService, $rootScope, $ionicActionSheet, $log, $timeout, $ionicScrollDelegate, $location, myWidgetFactory, $stateParams, baseService) {
            $scope.views = {
                baseUrl: window.CONFIGURATION.com.midea.baseUrl,
                isRequestData: false, // 是否请求过数据
                isNotMoreData: true, // 是否有更多数据
                isShowDelete: false, // 显示删除按钮
                delIndex: null, // 删除条数
                messageList: [], // 消息列表
                pageNum: 0, // 页码
                /**
                 * 根据消息类型处理消息
                 * @param item 单条消息数据
                 */
                handlerMessage: function(item) {
                    var page = '';
                    var params = {};

                    if (item.type === '10' || item.type === '32' || item.type === '0') { // 详情
                        page = 'msgActivity';
                        baseService.items.set('messageItem', 'messageItem', item);
                    } else if (item.type === '20') { // 跳优惠券列表
                        page = 'coupon';
                        params = {
                            source: 'message'
                        };
                        baseService.items.del('couponList', 'couponList');
                    } else if (item.type === '31') { // 跳主页
                        localStorage.setItem('storeId', item.storeId);
                        baseService.items.set('deviceTypeId', 'deviceTypeId', item.deviceTypeId);
                        page = 'home';
                    } else { // 条订单列表：type:30, 40
                        page = 'order';
                    }
                    console.log( item );
                     $rootScope.jump(page, params);
                },
                /**
                 * 删除消息
                 * @param id 消息 _id
                 */
                deleteMessage: function(event, id, index) {
                    event.stopPropagation();
                    if (!$scope.views.isShowDelete) {
                        return;
                    }

                    var hideSheet = $ionicActionSheet.show({
                        cssClass: 'ionic-action-tel',
                        buttons: [
                            {
                                text: '<b class="delMsg">删除</b>'
                            }
                        ],
                        cancelText: '取消',
                        cancel: function() {
                            // 点击取消按钮操作
                        },
                        buttonClicked: function() {
                            delMsg(id, function() {
                                $scope.views.isShowDelete = false;
                                $scope.views.messageList.splice(index, 1);
                                hideSheet();
                            });

                            return true;
                        }
                    });
                },
                /**
                 * name 加载更多信息
                 */
                loadMoreData: function(direction) {
                    // 下拉刷新
                    if (direction === 'up') {
                        $scope.views.pageNum = 1;
                    }
                    // 上拉刷新
                    if (direction === 'down') {
                        $scope.views.pageNum += 1;
                    }
                    var params = {
                        pageSize: 10, // 每页大小
                        pageNum: $scope.views.pageNum // 页号
                    };

                    cService.getMessageList(params).then(function(res) {
                        if (res && res.result === 1 && res.data.length > 0) {

                            if (direction === 'down') {
                                $scope.views.messageList = $scope.views.messageList.concat(res.data);
                            }
                            if (direction === 'up') {
                                $scope.views.messageList = res.data;
                            }

                            if (res.data && res.data.length >= params.pageSize) {
                                $scope.views.isNotMoreData = true; // 判断页码
                                //$scope.views.pageNum += 1;
                            } else {
                                $scope.views.isNotMoreData = false;
                            }

                            $timeout(function() {
                                $scope.$broadcast('scroll.infiniteScrollComplete');
                                $ionicScrollDelegate.$getByHandle('small').resize();
                            }, 300);
                        } else {
                            $scope.views.isNotMoreData = false;
                        }
                        $scope.views.isRequestData = true;
                    }).finally(function() {
                        $scope.$broadcast('scroll.refreshComplete');
                    });
                },
                /**
                 * 消息的可编辑、取消
                 */
                onEdit: function() {
                    if (this.messageList.length === 0) {
                        return;
                    }
                    this.isShowDelete = !this.isShowDelete;
                },
                /*
                 * 后退或者跳去home页面
                 * */
                retreat: function() {
                    // source存在则说明正常打开应用，不存在则说明是消息推送跳转到message页面
                    if (source) {
                        $rootScope.goBack();
                    } else {
                        $rootScope.jump('home', {
                            id: window.localStorage.getItem('storeId')
                        });
                    }
                },
                /*
                 * 更新消息已阅状态
                 * */
                readMessage: function() {
                    var userInfo = $rootScope.userInfo();
                    $rootScope.userInfo({
                        hasNewMessage: false
                    });
                    $rootScope.flag.hasMsg = false;
                    if (userInfo && userInfo.id) {
                        cService.readMessage().then(function(res) {});
                    }
                }
            };
            var h5Route = ['home', 'order', 'personal'],
                source = $stateParams.source;
            /**
             * 删除消息
             */
            var delMsg = function(msgId, callback) {
                cService.deleteMessage({
                    msgId: msgId
                }).then(function(res) {
                    $log.info('删除消息', res);

                    if (res && res.result === 1 && typeof callback === 'function') {
                        callback();
                    }
                });
            };
            // 不存在就更新数据 不是推送消息进来的
            if (h5Route.indexOf(source) === -1) {
                $scope.views.loadMoreData();
            }
            // 更新消息状态
            $scope.views.readMessage();
            $scope.$apply();
        }
    ];
});
