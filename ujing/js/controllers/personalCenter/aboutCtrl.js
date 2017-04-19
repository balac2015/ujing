/**
 * @file 关于U净
 * @author yelp <tianping.yan@partner.midea.com.cn>
 * @copyright Midea Co.Ltd 1968-2016
 * @license Released under the Commercial license.
 * @version 16/4/21
 */
define(['ionic'], function() {
    'use strict';

    return [
        '$scope',
        '$rootScope',
        'myWidgetFactory',
        '$topTip',
        'cFactory',
        function($scope, $rootScope, myWidgetFactory, $topTip, cFactory) {
            $scope.views = {
                version: '1.0.25',
                // 更新版本
                updateVersion: function() {
                    myWidgetFactory.updateVersion().then(function(res) {
                        alert('原生 updateVersion 返回：' + JSON.stringify(res))
                        var androidFromt = {
                            "result": 1
                        };
                        if (res && res.result == 1) {
                            $topTip('当前最新版');
                        }
                    }, function() {
                        if (!$rootScope.isPcTest) {
                            $topTip('更新失败');
                        }
                    });
                },
                // 当前版本
                currentVersion: function() {
                    myWidgetFactory.currentVersion().then(function(res) {
                        // 原生返回格式：
                        var androidFromt = {
                            "result": "1.0.25"
                        };
                        var iosFromt = 1023;
                        $scope.views.version = res.result || res;
                    });
                },
                // 新版介绍
                introduction: function() {
                    //cFactory.alert('新版本功能说明~~~~~~~~~~~~');
                },
                // 评分
                score: function() {}
            };
            $scope.views.currentVersion();
            $scope.$apply();
        }
    ];
});
