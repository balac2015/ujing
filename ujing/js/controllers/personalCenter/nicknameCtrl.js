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
        'cService',
        '$topTip',
        '$rootScope',
        'baseService',
        function($scope, cService, $topTip, $rootScope, baseService) {

            var nicknameOrTel = baseService.items.get('nicknameOrTel', 'nicknameOrTel');
            $scope.views = {
                placeholder: '请输入昵称', // 提示
                nickname: '',
                save: function() {
                    if (!this.nickname) {
                        $topTip('请输入要修改的昵称！');

                        return;
                    }
                    cService.updateUserInfo({
                        nickname: $scope.views.nickname
                    }).then(function(res) {
                        if (res && res.result === 1) {
                            $topTip('修改昵称成功！');
                            userInfo = angular.extend(userInfo, {
                                nickname: $scope.views.nickname
                            });
                            $rootScope.userInfo(userInfo);
                            $rootScope.$broadcast('updateUserInfo');
                            $rootScope.goBack();
                        }
                    });
                }
            };
            var userInfo;

            // 初始化提示用户信息
            var init = function() {
                userInfo = $rootScope.userInfo();

                if (userInfo) {
                    $scope.views.nickname = userInfo.nickname;
                }
            };
            init();
            $scope.$apply();
        }
    ];
});
