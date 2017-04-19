/**
 * @file 设置
 * @author ytp <tianping.yan@partner.midea.com.cn>
 * @copyright Midea Co.Ltd 1968-2016
 * @license Released under the Commercial license.
 * @version 16/4/21
 */
define(['ionic'], function() {
    'use strict';

    return [
        '$scope',
        'myWidgetFactory',
        function($scope, myWidgetFactory) {
            $scope.views = {
                isReceive: true, // 接受新消息
                // 设置新消息
                setReceive: function() {
                    console.log( this.isReceive );
                },

                isMessage: true, // 通知显示消息内容
                isAnti: true, // 防骚扰
                isSound: true, // 声音提醒
                isShock: true, // 震动提醒
                // 设置消息内容
                setMessage: function() {},
                // 设置骚扰模式
                setAnti: function() {},
                // 设置声音
                setSound: function() {
                    var params = [].concat(this.isSound);
                    myWidgetFactory.setSoundAlert(params).then(function(res) {
                        console.log('-----------------声音', res);
                    });
                },
                // 设置震动
                setShock: function() {
                    var params = [].concat(this.isShock);
                    myWidgetFactory.setShockAlert(params).then(function(res) {
                        console.log('-----------------震动', res);
                    });
                }
            };
            // 从原生获取接收新消息设置
            var getNotificationStatus = function() {
                myWidgetFactory.getNotificationStatus().then(function(res) {
                    console.log('-----------------接收新消息', res);
                });
            };
            getNotificationStatus();
            $scope.$apply();
        }
    ];
});
