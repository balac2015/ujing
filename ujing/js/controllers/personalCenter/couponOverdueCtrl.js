/**
 * @file 已过期优惠券
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
        '$log',
        function($scope, cService, $log) {
            $scope.views = {
                couponList: [], // 过期优惠券列表
                isRequest: false
            };

            /**
             * 已过期优惠券列表接口
             */
            cService.getExpireCouponList().then(function(res) {
                $log.info('已过期优惠券列表接口：', res);
                $scope.views.isRequest = true;

                if (res && res.result === 1 && res.data.length > 0) {
                    $scope.views.couponList = res.data;
                }
            });
            $scope.$apply();
        }
    ];
});
