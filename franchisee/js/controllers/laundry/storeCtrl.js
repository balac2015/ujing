/**
 * @file 洗衣店详情
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
        'baseService',
        '$rootScope',
        '$state',
        '$location',
        'log',
        function($scope, cService, $timeout, baseService, $rootScope, $state, $location, log) {
            $scope.views = {
                isManager: false,
                name: '', // 服务主体名称
                detailList: [], // 洗衣房列表
                // 单个洗衣房跳转
                goDevice: function(item) {
                    baseService.items.set('store', 'item', item);

                    $state.go('examine', {
                        id: item._id
                    });
                },
                goLaundryDetail: function() {
                    $state.go('laundryEdit', {
                        id: laundryItem._id
                    });
                },
                routerBack: function() {
                    if (this.isManager) {
                        $rootScope.exit();
                    } else {
                        $rootScope.goBack();
                    }
                }
            };

            // 根据主体 id 获取洗衣房列表
            var getStoreList = function(laundry) {
                var id = 'isManager 为 true';

                if (laundry) {
                    var storeList = baseService.items.get('store', 'list');
                    id = laundry._id;

                    //if (storeList && storeList[0].serviceSubjectId == laundry._id) {
                    //    $scope.views.detailList = storeList;
                    //
                    //    return;
                    //}
                }

                cService.getStoreList({
                    id: id
                }).then(function(res) {
                    // getStoreList 接口数据
                    var getStoreListFormat = [
                        {
                            __v: 0,
                            _id: '57a1a99571cda1b176219b8b',
                            address: 'footloose',
                            applyTime: '2016-08-03T08:21:41.386Z',
                            approveStatus: '1',
                            businessEndTime: '23:00',
                            businessStartTime: '6:00',
                            city: {
                                _id: '56811537e48d662e5d807a3d',
                                code: '441600',
                                name: '河源市'
                            },
                            coordinate: [113.209887, 22.957388],
                            coupons: [],
                            district: {
                                _id: '56811580e48d662e5d8082cd',
                                code: '441601',
                                name: '市辖区'
                            },
                            dryDeviceNum: 0,
                            enable: true,
                            franchiseeId: '579c085b5c74cba23f4b02bb',
                            mobile: '18617051881',
                            name: '8-3洗衣房',
                            province: {
                                _id: '568114f5e48d662e5d8079f4',
                                code: '440000',
                                name: '广东省'
                            },
                            serviceSubjectId: '579eb7cd5f8d38565ca99cda',
                            washDeviceNum: 2
                        }
                    ];

                    if (res && res.result === 1 && res.data && res.data.length > 0) {
                        $scope.views.detailList = res.data;
                        baseService.items.set('store', 'list', res.data);
                    }
                });
            };

            var laundryItem;

            var init = function() {
                laundryItem = baseService.items.get('laundry', 'item');

                if (laundryItem && laundryItem._id) {
                    $scope.views.name = laundryItem.name;

                    getStoreList(laundryItem);
                } else {
                    if (window.CONFIGURATION.com.midea.user.isManager) {
                        $scope.views.isManager = true;
                        laundryItem = {};

                        return getStoreList();
                    }

                    $topTip('获取数据出错！');

                    $rootScope.goBack();
                }
            };
            init();

            // 洗衣房有改变时，服务主体 ID
            $rootScope.$on('updateStore', function(e, d) {
                if (d) {
                    baseService.items.del('store', 'list');
                    init();
                }
            });
            $scope.$apply();
        }
    ];
});
