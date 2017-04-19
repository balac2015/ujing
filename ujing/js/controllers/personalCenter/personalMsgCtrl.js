/**
 * @file 个人设置
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
        'baseService',
        'picture',
        '$rootScope',
        function($scope, cService, $topTip, baseService, picture, $rootScope) {
            var baseUrl = window.CONFIGURATION.com.midea.baseUrl;
            var userInfo = null;

            $scope.views = {
                profilePicUrl: '', // 头像
                nickname: '', // 昵称
                tel: '', // 手机号码
                // 修改头像
                setPicture: function() {
                    var feedback = function() {
                        picture.getBase64Codes(false, function(imgList) {
                            var params = {
                                imgData: 'data:image/jpg;base64,' + imgList[0].replace(/\+/g, '%2B')
                            };

                            cService.uploadImg(params).then(function(res) {
                                if (res && res.result === 1) {
                                    $topTip('头像修改成功！', {
                                        timeout: 2000
                                    });
                                    $scope.views.profilePicUrl = baseUrl + res.data.portrait;
                                    userInfo = angular.extend(userInfo, {
                                        portrait: res.data.portrait
                                    });
                                    $rootScope.userInfo(userInfo);
                                    $rootScope.$broadcast('updateUserInfo');
                                } else {
                                    $topTip('头像修改失败！', {
                                        timeout: 2000
                                    });
                                }
                            }, function(err) {
                                $topTip('无法连接服务器，请检查网络连接！');
                            });
                        });
                    };

                    picture.selectPicture({
                        isSingle: true,
                        allowEdit: true,
                        feedback: feedback
                    });
                }
            };

            var init = function() {
                userInfo = $rootScope.userInfo();

                if (userInfo) {
                    $scope.views.nickname = userInfo.nickname;
                    $scope.views.tel = userInfo.mobile;
                    $scope.views.profilePicUrl = baseUrl + userInfo.portrait;
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
