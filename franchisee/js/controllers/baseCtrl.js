/**
 * Created by Administrator on 14-12-29.
 */
define([], function() {
    'use strict';

    return [
        'widgetFactory',
        '$rootScope',
        '$state',
        '$ionicPopup',
        'baseService',
        '$location',
        '$ionicPlatform',
        'myWidgetFactory',
        '$topTip',
        'cService',
        function(widgetFactory, $rootScope, $state, $ionicPopup, baseService, $location, $ionicPlatform, myWidgetFactory, $topTip, cService) {
            $rootScope.flag = {};
            // 苹果状态栏变色
            widgetFactory.hideFloat();
            widgetFactory.changeColor([
                76,
                107,
                197,
                1
            ]);
            /**
             *  跳转页面函数
             *  yelp
             * @param toUrl 路径
             * @param toParams 跳转函数
             */
            $rootScope.stateGo = function(toUrl, toParams, setName) {
                var params = toParams || {};

                if (setName) {
                    baseService.items.set(setName, setName, toParams);
                }
                $state.go(toUrl, params);
            };

            // 硬件返回
            $ionicPlatform.registerBackButtonAction(function() {
                var route = ['setDevice', 'laundry', 'myDevice', 'orderManage', 'pricing', 'statistics', 'personnel', 'coupon', 'message'];
                var path = $location.path().slice(1);

                if (path && route.indexOf(path) === -1) {
                    $rootScope.goBack();
                } else {
                    $rootScope.exit();
                }
            }, 100, 'main');

            // 获取登录信息
            cService.hasLogin();
        }
    ];
});
