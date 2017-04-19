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
        '$ionicPlatform',
        '$location',
        '$interval',
        'myWidgetFactory',
        '$ionicHistory',
        'cService',
        '$stateParams',
        function(widgetFactory, $rootScope, $state, $ionicPopup, $ionicPlatform, $location, $interval, myWidgetFactory, $ionicHistory, cService, $stateParams) {
            $rootScope.flag = {
                isTipsError: false, // 顶部的故障提示
                hasMsg: false // 是否有新消息提示
            };
            // 判断是否PC测试
            $rootScope.isPcTest = window.CONFIGURATION.com.midea.isPcTest;
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
            $rootScope.jump = function(route, toParams) {
                var params = toParams || {};
                $state.go(route, params);
            };

            // 硬件返回
            $ionicPlatform.registerBackButtonAction(function() {
                var exitPath = ['/home', '/oneWashHome', '/order', '/personal'], // 需要exit退出的路由
                    locationPath = $location.path();

                if (exitPath.indexOf(locationPath) !== -1) {
                    $rootScope.exit();
                } else {
                    if (['/pay', '/clearing'].indexOf(locationPath) !== -1 || (locationPath.indexOf('/message') >= 0 && !$stateParams.source)) {
                        $rootScope.jump('order');

                        return;
                    } else {
                        $rootScope.goBack();
                    }
                }
            }, 100, 'main');
            /**
            * 底座原生推送消息
            *
            */
            document.addEventListener('mideaDeviceUnbindMsg', function(event) {
                if (event.message) {
                    $rootScope.flag.isTipsError = false;
                } else {
                    $rootScope.flag.isTipsError = true;
                }
                $rootScope.$evalAsync();
            }, false);
            /*
            * 本地存储信息
            * @paramsObj {Object} 需要改变的本地存储值
            * */
            $rootScope.userInfo = function(paramsObj) {
                var userInfo = localStorage.getItem('loginInfo') || null,
                    paramsObj = paramsObj || null;

                if (userInfo && userInfo !== 'null' && userInfo !== 'undefined') {
                    try {
                        userInfo = JSON.parse(localStorage.getItem('loginInfo')) || {};
                    } catch(e) {
                        userInfo = {};
                    }
                }
                // 重新保存
                if (userInfo && paramsObj && typeof userInfo === 'object') {

                    for (var i in paramsObj) {
                        userInfo[i] = paramsObj[i];
                    }
                    localStorage.setItem('loginInfo', JSON.stringify(userInfo));
                }

                return userInfo;
            };
            /*
            * 获取有没消息提醒
            * */
            var getMsgTip = function(res) {
                if (res && res.hasNewMessage) {
                    $rootScope.flag.hasMsg = true;
                } else {
                    $rootScope.flag.hasMsg = false;
                }
            };

            // 定时刷新消息图标
            $interval(function() {
                cService.hasNewMessage().then(function(res) {
                    $rootScope.isMessage = res && res.result == 1 && res.data;
                });
            }, 60000);


            // 获取登录信息
            cService.loginInfo();
        }
    ];
});
