/**
 * @file 我要吐槽
 * @author ytp <tianping.yan@partner.midea.com.cn>
 * @copyright Midea Co.Ltd 1968-2016
 * @license Released under the Commercial license.
 * @version 16/7/4
 */
define(['ionic'], function() {
    'use strict';

    return [
        '$rootScope',
        '$scope',
        'cService',
        '$topTip',
        function($rootScope, $scope, cService, $topTip) {
            $scope.views = {
                fast: [
                    {
                        text: '闪退',
                        value: 0
                    },
                    {
                        text: '卡顿',
                        value: 1
                    },
                    {
                        text: '死机',
                        value: 2
                    },
                    {
                        text: '界面错位',
                        value: 3
                    }
                ],
                feedType: -1,
                abnormal: null,
                contact: null,
                isMaxLength: false,
                // 提交
                onSubmit: function() {
                    var that = this,
                        option = that.feedType === -1 ? '' : that.fast[that.feedType].text,
                        content = that.abnormal || '',
                        params = null;

                    if (!option && !content) {
                        $topTip('亲，填写了反馈内容再让我们改进吧！');

                        return;
                    }

                    var feedback = function(data) {
                        var userAgent = window.navigator.userAgent;
                        params = {
                            userId: data.userInfo,
                            option: option, // 反馈选项
                            content: content, // 其它内容
                            mobileInfo: userAgent,
                            contact: that.contact || '' // 联系方式
                        };
                        cService.feedBack(params).then(function(res) {
                            if (res && res.result === 1) {
                                $topTip('反馈建议已提交！');
                                $rootScope.goBack();
                            }
                        });
                    };
                    // 确保用户登录
                    cService.userInfo(function(data) {
                        feedback(data);
                    });
                },
                abnormalChange: function() {
                    //
                }
            };
            $rootScope.isHome = true;
            $scope.$apply();
        }
    ];
});
