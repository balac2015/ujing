/**
 * @file 优惠券
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
        '$location',
        '$log',
        '$stateParams',
        'baseService',
        function($scope, cService, $rootScope, $location, $log, $stateParams, baseService) {
            $scope.views = {
                couponList: null, // 可用优惠券列表
                isRequest: false,
                /*
                * 支付获取选择优惠券
                * */
                onSelectCard: function(item) {
                    if ($stateParams.source && $stateParams.source === 'pay' && item._id) {
                        // todo: 改为后台校验洗衣房
               /*         var storeId = window.localStorage.getItem('storeId');

                        if (storeId && storeId != item.storeId._id) {
                            $topTip('该优惠券不适用于当前洗衣房！');

                            return;
                        }*/

                        baseService.items.set('coupon', 'item', {
                            id: item._id,
                            type: item.couponType,
                            value: item.value
                        });

                        $rootScope.jump('pay', {
                            source: 'coupon'
                        });
                    }
                }
            };
            // 可用优惠券列表接口
            var getCouponList = function() {
                var couponList = baseService.items.get('coupon', 'list');

                if (couponList) {
                    $scope.views.couponList = couponList;

                    return;
                }

                cService.getCouponList().then(function(res) {
                    $scope.views.isRequest =true;

                    if (res && res.result === 1 && res.data.length > 0) {
                        $scope.views.couponList = res.data;
                    }
                });
            };

            getCouponList();
            $scope.$apply();
        }
    ];
});
