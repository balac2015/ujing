/**
 * @file 个人中心
 * @author ytp <tianping.yan@partner.midea.com.cn>
 * @copyright Midea Co.Ltd 1968-2016
 * @license Released under the Commercial license.
 * @version 16/7/21
 */
define(['ionic'], function() {
    'use strict';

    return [
        '$scope',
        'cService',
        '$topTip',
        '$rootScope',
        '$state',
        '$ionicActionSheet',
        'baseService',
        '$log',
        function($scope, cService, $topTip, $rootScope, $state, $ionicActionSheet, baseService, $log) {
            $scope.views = {
                couponCount: 0, // 优惠券数量
                nickname: '', // 昵称
                mobile: '', // 电话
                portrait: '', // 头像URL
                userInfo: {}, // 个人信息
                loginMsg: null, // 登录信息
                baseUrl: window.CONFIGURATION.com.midea.baseUrl, // 当前地址
                // 获取个人信息
                jumpCheckLogin: function(url) {
                    var params = {
                        source: 'personal'
                    };
                    if (this.loginMsg && this.loginMsg.mobile) {
                        $rootScope.jump(url, params);
                    } else {
                        cService.userInfo(function() {
                            $scope.views.init();
                        });
                    }
                },
                /*
                 * 分享
                 * */
                onShare: function() {
                    $ionicActionSheet.show({
                        cssClass: 'share-action-sheet',
                        buttons: [
                            {
                                text: '<a class="share-item"><img src="./images/friends_circle.png"><span>微信好友</span></a>'
                            },
                            {
                                text: '<a class="share-item"><img src="./images/friends_circle.png"><span>微信朋友圈</span></a>'
                            },
                            {
                                text: '<a class="share-item"><img src="./images/friends_circle.png"><span>QQ分享</span></a>'
                            },
                            {
                                text: '<a class="share-cancel">取消</a>'
                            }
                        ],
                        titleText: '<div class="share-des">请选择分享方式</div><div class="dotted-line"></div>',
                        buttonClicked: function(index) {
                            if (index === 0) {
                                // 微信好友
                            } else if (index === 1) {
                                // 微信朋友圈
                            } else if (index === 2) {
                                // QQ分享
                            }

                            return true;
                        }
                    });
                },
                // home、scanHome 页面跳转的确定
                checkJump: function() {
                    var flag = baseService.items.get('homeTypePage', 'homeTypePage');

                    if (flag && flag.route) {
                        if (flag.route === 'home') {
                            $rootScope.jump('home', {
                                id: flag.state
                            })
                        }

                        if (flag.route === 'scanHome') {
                            $rootScope.jump('scanHome', {
                                qrcode: flag.state
                            })
                        }
                    }
                },
                /*
                 * 可用优惠券列表接口
                 * @params {function}  callback
                 * */
                getCouponList: function(callback) {
                    cService.getCouponList().then(function(res) {
                        $scope.views.isRequest =true;

                        if (res && res.result === 1 && res.data.length > 0) {
                            $scope.views.couponList = res.data;
                            baseService.items.set('coupon', 'list', res.data);
                            callback && callback(res.data);
                        }
                    });
                },
                /*
                 * 初始化函数
                 * */
                init: function() {
                    var getLocal = $rootScope.userInfo();
                    $log.log(getLocal);
                    if (getLocal && getLocal !== 'undefined' && getLocal !== 'null') {
                        this.loginMsg = getLocal;
                    }

                    if (this.loginMsg && this.loginMsg.mobile) {
                        this.userInfo.mobile = this.mobile = this.loginMsg.mobile;
                        this.userInfo.nickname = this.nickname = this.loginMsg.nickname;
                        this.userInfo.portrait = this.portrait = this.loginMsg.portrait;
                        $rootScope.userInfo(this.userInfo);
                        // 获取优惠券数量，并缓存优惠券数据
                        this.getCouponList(function(list) {
                            $scope.views.couponCount = list.length;
                        });
                    }
                }
            };
            $scope.views.init();
            $scope.$apply();
        }
    ];
});
