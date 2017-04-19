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
        'cService',
        '$topTip',
        '$rootScope',
        'baseService',
        'cFactory',
        'myWidgetFactory',
        function($scope, cService, $topTip, $rootScope, baseService, cFactory, myWidgetFactory) {
            $scope.views = {
                mobile: '',
                setting: function(type) {},
                leaving: function() {
                    cFactory.confirm('确定退出该账户？').then(function(click) {
                        if (click) {
                            cService.logout().then(function(res) {

                                if (res && res.result === 1) {
                                    // 原生 logout 没有处理回调
                                    myWidgetFactory.logout().then();

                                    window.localStorage.clear();
                                    //baseService.items.del('ujing', 'qrcode');
                                    baseService.items.del('ujing', 'scanning');
                                    $rootScope.$broadcast('updateUserInfo', 'remove');
                                    cService.loginInfo();
                                    localStorage.setItem('hasLogined', true);
                                    $rootScope.jump('oneWashHome');
                                } else {
                                    $topTip('退出登录失败，请稍后重试！');
                                }
                            });
                        }
                    });
                }
            };
            /*
             * 初始化函数
             * */
            var init = function() {
                var userInfo = $rootScope.userInfo(); // baseService.items.get('userInfo', 'userInfo');

                if (userInfo) {
                    $scope.views.mobile = userInfo.mobile;
                }
            };
            $rootScope.$on('updateUserInfo', function(e, d) {
                init();
            });
            init();
            $scope.$apply();
        }
    ];
});
