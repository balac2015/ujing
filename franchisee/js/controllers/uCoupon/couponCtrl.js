/**
 * @file 分析领券活动
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
        '$log',
        '$state',
        'baseService',
        '$rootScope',
        function($scope, cService, $timeout, $log, $state, baseService, $rootScope) {
            $scope.views = {
                couponList: [],
                storeList: [],
                /**
                 * 切换路由
                 * @param item{Object} 优惠券信息
                 */
                goRouter: function(item) {
                    if (!item) {
                        baseService.items.del('coupon', 'item');
                    } else {
                        baseService.items.set('coupon', 'item', item);
                    }
                    $state.go('activity');
                }
            };

            // 获取优惠券列表数据
            var getCouponList = function() {
                var couponList = baseService.items.get('coupon', 'list');

                if (couponList) {
                    $scope.views.couponList = couponList;

                    return;
                }

                cService.getCouponList().then(function(res) {

                    // 接口返回的数据格式
                    var couponForm = {
                        __v: 0,
                        _id: "57baa9d8915ebdf379a8f6b7",
                        activityEndTime: "2016-08-24T00:00:00.000Z",
                        activityStartTime: "2016-08-15T00:00:00.000Z",
                        amount: 2,
                        couponType: "2",
                        effectiveDays: 2,
                        franchiseeId: "57ac4aa00e16db4c493f9bba",
                        isEnable: true,
                        stores: [
                            {
                                _id: "57baa9d8915ebdf379a8f6b8",
                                storeId: {
                                    _id: "",
                                    name: ""
                                }
                            }
                        ],
                        title: "测试券",
                        unit: "折",
                        value: 1
                    };

                    if (res && res.result === 1 && res.data.length > 0) {
                        $scope.views.couponList = res.data;
                        baseService.items.set('coupon', 'list', res.data);
                    }
                });
            };
            // 确保有登陆
            cService.hasLogin(getCouponList);
            //getCouponList();

            // 增加分享券券
            $rootScope.$on('couponUpdate', function() {
                baseService.items.del('coupon', 'item');
                baseService.items.del('coupon', 'list');
                $timeout(getCouponList, 500);
            });
            $scope.$apply();
        }
    ];
});
