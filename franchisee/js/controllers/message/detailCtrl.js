/**
 * @file 消息详情
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
        function($scope, cService, $timeout
        ) {
            $scope.views = {
            };

            $scope.$apply();
        }
    ];
});
