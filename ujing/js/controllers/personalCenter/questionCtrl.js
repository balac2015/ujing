/**
 * @file 常见问题
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
        function($scope, cService, $topTip) {
            $scope.views = {
                questionList: null, // 问题列表
                showIndex: null, // 展示索引
                /*
                * 查看问题
                * */
                toView: function(index) {
                    if (this.showIndex === index) {
                        this.showIndex = '';
                    } else {
                        this.showIndex = index;
                    }
                },
                /*
                * 获取问题列表
                * */
                getHelpList: function() {
                    var that = this;

                    cService.getHelpList().then(function(res) {
                        if (res && res.result === 1) {
                            that.questionList = res.data;
                        } else {
                            $topTip('服务器繁忙~~');
                        }
                    }, function() {
                        $topTip('服务器繁忙~~');
                    });
                }
            };
            $scope.views.getHelpList();
            $scope.$apply();
        }
    ];
});
