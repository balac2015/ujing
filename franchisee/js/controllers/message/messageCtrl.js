/**
 * @file 消息中心
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
        'cFactory',
        '$ionicScrollDelegate',
        '$topTip',
        '$log',
        function($scope, cService, $timeout, cFactory, $ionicScrollDelegate, $topTip, $log) {
            var pageSize = 20, // 消息页每页大小
                pageNum = 1; // 页号

            var getMessageList = function() {
                var params = {
                    pageSize: pageSize, // 每页大小
                    pageNum: pageNum // 页号
                };

                cService.getMessageList(params).then(function(res) {
                    $scope.views.isRequestSucc = true;

                    if (res && res.result === 1) {
                        if (res.data.length > 0) {
                            $scope.views.messageList = $scope.views.messageList.concat(res.data);

                            if (res.data && res.data.length >= pageSize) {
                                $scope.views.isNotMoreData = true; // 判断页码
                            } else {
                                $scope.views.isNotMoreData = false;
                            }
                            pageNum += 1;
                            $timeout(function() {
                                $scope.$broadcast('scroll.infiniteScrollComplete');
                                $ionicScrollDelegate.$getByHandle('small').resize();
                            }, 300);
                        } else {
                            $scope.views.isNotMoreData = false;
                        }
                    }
                });
            };
            $scope.views = {
                isNotMoreData: true, // 是否有更多数据
                isRequestSucc: false, // 是否成功请求接口
                isShowDelete: false,
                isAllSelect: false, // 全选/全不选
                messageList: [],
                /**
                 * 单选
                 * @param {Number} 数组的下标
                 */
                onItemSelect: function(index) {
                    this.messageList[index].checked = !this.messageList[index].checked;
                },
                /**
                 * 全选/全不选
                 */
                onItemAllSelect: function() {
                    var that = this;

                    that.isAllSelect = !that.isAllSelect;

                    angular.forEach(that.messageList, function(item) {
                        if (item) {
                            item.checked = that.isAllSelect;
                        }
                    });
                },
                /**
                 * 删除操作
                 */
                onItemDelete: function() {
                    var list = this.messageList,
                        indexList = [],
                        id = '';

                    angular.forEach(list, function(item, index) {
                        if (!item) {
                            indexList.push(index);
                        } else if (item.checked) {
                            id += item._id + '-';
                            indexList.push(index);
                        }
                    });

                    var params = {
                        messageList: id.slice(0, id.length - 1)
                    };

                    // 删除数据的接口
                    cService.deleteMessage(params).then(function(res) {
                        if (res && res.result === 1) {
                            $topTip('消息删除成功！！');

                            angular.forEach(indexList, function(item) {
                                list.splice(item, 1, undefined);
                            });

                            if (list.length === indexList.length) {
                                list.length = 0;
                                this.isShowDelete = !this.isShowDelete;
                            }
                        }
                    });
                },
                /**
                 * 点击编辑按钮
                 */
                onItemEdit: function() {
                    this.isShowDelete = !this.isShowDelete;
                    angular.forEach(this.messageList, function(item) {
                        if (item) {
                            item.checked = false;
                        }
                    });
                },
                /**
                 * 获取消息列表
                 */
                loadMoreData: function() {
                    cService.hasLogin(getMessageList);
                }
            };

            $scope.$apply();
        }
    ];
});
