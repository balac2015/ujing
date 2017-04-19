/**
 * Created by Administrator on 2014/11/21.
 */
/* global console */
/* global cordova */
require(['angular', 'js/app', 'lib/js/main/routeWithoutLoadingBar'], function(angular) {
    'use strict';

    // 启动app
    function init() {
        //console.log('==start===');
        angular.bootstrap(document, ['cApp']);
    }

    // 处理错误信息
    function error(msg, data) {
        window.CONFIGURATION.errorMsg = msg;
        init();
    }

    // 配置路由和入口参数
    function setExtra(data) {
        if (data && data.extra && data.extra.action) {
            console.log('获取路由成功', data);
            window.CONFIGURATION.extra = data.extra;
            init();
        } else {
            // console.log('默认路由', data);
            window.CONFIGURATION.extra = typeof window.CONFIGURATION.extra === 'undefined' ? false : window.CONFIGURATION.extra;
            init();
        }
    }

    // 获取底座入口参数
    function getExtra(data) {
        if (data) {
            window.CONFIGURATION.response = data;
            /*if (data.role) {
                console.log('获取角色成功', data);
                window.CONFIGURATION.role = data.role;
            } else {
                console.log('获取角色失败', data);
            }*/
            try {
                cordova.exec(function(msg) {
                    setExtra(msg);
                }, function(msg) {
                    error('获取路由失败, 请退出重试! ', msg);
                }, 'MideaCommon', 'getExtra', [window.CONFIGURATION.PROJECT_NAME.replace('/', '')] || []);
            } catch (e) {
                error('系统出错了, 请退出重试. ', e);
            }
        } else {
            error('用户信息不正确, 请退出重试! ', data);
        }
    }

    // 获取用户信息
    function getUserMap() {
        // 部分功能的APP
        /*try {
            cordova.exec(function(data) {
                getExtra(data);
            }, function(data) {
                error('获取用户角色失败, 请退出重试! ', data);
            }, 'MideaUser', 'getUser', []); // getUser 不行就用 getUserMap
        } catch (e) {
            error('系统出错了, 请退出重试! ', e);
        }*/
        getExtra(true);
    }

    if (window.CONFIGURATION.com.midea.isPcTest){
        getUserMap();
    } else {
        document.addEventListener("deviceready", getUserMap, false);
    }
});