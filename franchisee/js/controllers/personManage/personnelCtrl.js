/**
 * @file 创建管理员、人员管理
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
        '$ionicListDelegate',
        '$topTip',
        '$rootScope',
        'cFactory',
        'baseService',
        function($scope, cService, $ionicListDelegate, $topTip, $rootScope, cFactory, baseService) {
            $scope.views = {
                isRequest: false,
                managerList: [],
                /**
                * 跳到 right 页
                * @params item {obj} 人员信息
                */
                detail: function(item) {
                    if (!item) {
                        baseService.items.del('person', 'item');

                        return $rootScope.stateGo('rights');
                    }

                    if (typeof item === 'object') {
                        baseService.items.set('person', 'item', item);

                        return $rootScope.stateGo('rights');
                    }
                },
                /**
                 * 删除人员信息
                 * @params item {obj} 人员信息
                 * @params index {number} 人员信息
                 * @params $event {obj} 事件对象
                 */
                remove: function(item, index, $event) {
                    $event.stopPropagation();
                    cFactory.confirm('是否删除？').then(function(res) {
                        if (res) {
                            cService.removeManager({
                                id: item.id
                            }).then(function(res) {
                                if (res && res.result === 1) {
                                    $scope.views.managerList.splice(index, 1);
                                    $ionicListDelegate.closeOptionButtons();
                                    $topTip('删除人员成功');
                                }
                            });
                        }
                    });
                }
            };
            /**
             * 获取人员信息
             */
            var getManagerList = function() {
                cService.getManagerList().then(function(res) {
                    $scope.views.isRequest = true;

                    if (res && res.result === 1 && res.data) {
                        $scope.views.managerList = res.data;
                    }
                });
            };

            baseService.items.del('franchisee', 'shrink');
            cService.hasLogin(getManagerList);
            //getManagerList();
            // 添加管理员，响应事件
            //$rootScope.$on('personUpdate', function(event, status) {
            //    if (status === 'insert' || status === 'update') {
            //        getManagerList();
            //    }
            //});
            $scope.$apply();
        }
    ];
});
