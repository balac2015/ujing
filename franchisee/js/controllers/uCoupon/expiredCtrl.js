/**
 * @file 过期活动
 * @author ytp ylp <tianping.yan@partner.midea.com.cn>
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
        '$topTip',
        '$log',
        function($scope, cService, $timeout, $topTip, $log) {
            $scope.views = {
                isShowNotDataTips: false, // 没数据提示
                couponList: [], // 卡券列表
                /*
                * 获取过期卡券
                * */
                getExpireCouponList: function() {
                    var self = this;
                    var params = {

                    };

                    cService.getExpireCouponList().then(function(res) {
                        $log.info(res);
                        if (res && res.result === 1) {
                            self.couponList = res.data || [];
                            self.isShowNotDataTips = self.couponList.length > 0 ? false : true;
                        }
                    }, function() {
                        $topTip('网络超时');
                    });
                }
            };
            $scope.views.getExpireCouponList();
            $scope.$apply();
        }
    ];
});
