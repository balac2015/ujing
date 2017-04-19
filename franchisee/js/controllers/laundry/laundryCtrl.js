/**
 * @file 洗衣店
 * @author ytp <tianping.yan@partner.midea.com.cn>
 * @copyright Midea Co.Ltd 1968-2016
 * @license Released under the Commercial license.
 * @version 16/5/4
 */
define(['ionic'], function() {
    'use strict';

    return [
        '$rootScope',
        '$scope',
        'cService',
        'baseService',
        '$state',
        function($rootScope, $scope, cService, baseService, $state) {
            $scope.views = {
                isManager: false,
                principalList: [], // 服务主体列表
                // 跳转到洗衣房列表
                goStore: function(item) {
                    if (item === 'laundryEdit') {
                        baseService.items.del('laundry', 'item');
                    } else {
                        baseService.items.set('laundry', 'item', item);
                    }

                    $state.go('store');
                }
            };

            // 获取服务主体洗衣房
            var getServiceSubjectList = function() {
                var laundryList = baseService.items.get('laundry', 'list');

                //if (laundryList) {
                //    $scope.views.principalList = laundryList;
                //    return;
                //}
                cService.getServiceSubjectList().then(function(res) {
                    /**
                     * getServiceSubjectList 接口数据
                     */
                    var getServiceSubjectListFormat = {
                        msg: '操作成功',
                        result: 1,
                        data: [
                            {
                                _v: 0,
                                _id: "57c68247985de0a8584862ae",
                                address: "美的大道",
                                city: {
                                    _id: '56811537e48d662e5d807a3b',
                                    code: '440600',
                                    name: '佛山市'
                                },
                                district: {
                                    _id: "56811581e48d662e5d8083c3",
                                    code: "440606",
                                    name: "顺德区"
                                },
                                franchiseeId: "57ac4aa00e16db4c493f9bba",
                                isRemoved: false,
                                name: "美的总部大楼",
                                planDeviceNum: 10,
                                planStoreNum: 10,
                                province: {
                                    _id: "568114f5e48d662e5d8079f4",
                                    code: "440000",
                                    name: "广东省"
                                },
                                serviceAttrId: {
                                    __v: 0,
                                    _id: "572c4ae3a7bde77c3194a6ad",
                                    name: "学校"
                                }
                            }
                        ]
                    };
                    if (res && res.result === 1 && res.data && res.data.length > 0) {
                        $scope.views.principalList = res.data;
                        baseService.items.set('laundry', 'list', res.data);
                    }
                });
            };

            var BASE = window.CONFIGURATION.com.midea;

            var init = function() {
                $scope.views.isManager = BASE.user.isManager;

                if ($scope.views.isManager) {
                    $state.go('store');
                } else {
                    getServiceSubjectList();
                }
            };
            cService.hasLogin(init);
            //init();


            // 服务主体修改，d = 'add' 新增,"update" 修改
            $rootScope.$on('laundryUpdate', function(event, status) {
                if (status === 'add' || status === 'update' || status === 'remove') {
                    baseService.items.del('laundry', 'list');
                    baseService.items.del('laundry', 'item');
                    getServiceSubjectList();
                }
            });

            $scope.$apply();
        }
    ];
});
