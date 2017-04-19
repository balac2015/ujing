/**
 * @file 昵称
 * @author <liping.ye@midea.com.cn>
 * @copyright Midea Co.Ltd 1968-2015
 * @license Released under the Commercial license.
 * @since 1.0.1
 * @version 1.0.2 - 2016/7/9
 */
define(['ionic'], function() {
    'use strict';

    return [
        '$scope',
        'baseService',
        '$rootScope',
        function($scope, baseService, $rootScope) {
            $scope.views = {
                mobile: '',
                portrait: ''
            };
            var userInfo = null;
            var init = function() {
                userInfo = $rootScope.userInfo();

                if (userInfo) {
                    $scope.views.mobile = userInfo.mobile.replace(userInfo.mobile.slice(3, 7), '****');
                    $scope.views.portrait = userInfo.portrait;
                }
            };
            init();
            $rootScope.$on('updateUserInfo', function(e, d) {
                init();
            });
            $scope.$apply();
        }
    ];
});
