/**
 * @file 更换手机号
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
        '$interval',
        'baseService',
        '$rootScope',
        function($scope, cService, $topTip, $interval, baseService, $rootScope) {
            var timer = null, // 计时器
                userInfo = null;

            $scope.views = {
                mobile: '', // 原来电话
                newMobile: '', // 新的电话
                verifyCode: '',
                btnText: '获取验证码',
                // 获取验证码
                getVerification: function() {
                    var that = this;
                    var n = 60; // 计时
                    var mobile = Number(that.newMobile);

                    if (that.mobile == that.newMobile) {
                        $topTip('不能修改为原号码！');

                        return;
                    }

                    if (!/^1\d{10}$/.test(mobile)) {
                        $topTip('请正确填写手机号！');

                        return;
                    }

                    if (timer) {
                        $topTip('请在一分钟后重试！');

                        return;
                    }
                    // 倒计时
                    var handler = function() {

                        if (n > 1) {
                            n -= 1;
                            if (n < 10) {
                                n = '0' + n;
                            }
                            that.btnText = '剩余 ' + n + ' 秒';
                        } else {
                            $interval.cancel(timer);
                            timer = null;
                            that.btnText = '获取验证码';
                        }
                    };

                    handler();
                    timer = $interval(handler, 1000);
                    cService.getVerifyCode({
                        mobile: that.mobile
                    }).then(function(res) {
                        $topTip(res.msg);

                        if (res && res.result !== 1) {
                            $interval.cancel(timer);
                            timer = null;
                            that.btnText = '获取验证码';
                        }
                    });
                },
                // 提交数据
                postVerification: function() {
                    var that = this;
                    var mobile = Number(that.newMobile);

                    var params = {
                        //nickname: that.nickname,
                        mobile: mobile,
                        verifyCode: that.verifyCode
                    };

                    if (that.mobile == that.newMobile) {
                        $topTip('不能修改为原号码！');

                        return;
                    }
                    if (!/^1\d{10}$/.test(mobile)) {
                        $topTip('请正确填写手机号！');

                        return;
                    }

                    if (!params.verifyCode) {
                        $topTip('验证码不能为空！');

                        return;
                    }

                    cService.updateUserInfo(params).then(function(res) {
                        if (res && res.result === 1) {
                            $topTip('更换手机成功！');
                            userInfo = angular.extend(userInfo, {
                                mobile: params.mobile
                            });
                            $rootScope.userInfo(userInfo);
                            $rootScope.$broadcast('updateUserInfo');
                        }
                    });
                }
            };

            // 初始化提示用户信息
            var init = function() {
                var userInfo = $rootScope.userInfo();

                if (userInfo) {
                    $scope.views.mobile = userInfo.mobile;
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
