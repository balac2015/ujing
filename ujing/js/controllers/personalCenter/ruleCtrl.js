/**
 * @file 优惠券使用规则
 * @author ytp <tianping.yan@partner.midea.com.cn>
 * @copyright Midea Co.Ltd 1968-2016
 * @license Released under the Commercial license.
 * @version 16/4/21
 */
define(['ionic'], function() {
    'use strict';

    return [
        '$scope',
        '$ionicActionSheet',
        'myWidgetFactory',
        'baseService',
        function($scope, $ionicActionSheet, myWidgetFactory, baseService) {
            $scope.views = {
                mobile: '',
                tel: function(mobile) {
                    if (!mobile) {
                        $topTip('没有可拨打的电话号码！');

                        return;
                    }
                    //var hideSheet =
                    $ionicActionSheet.show({
                        cssClass: 'ionic-action-tel',
                        buttons: [
                            {
                                text: '<b>' + mobile + '</b>'
                            }
                        ],
                        cancelText: '取消',
                        cancel: function() {
                            // 点击取消按钮操作
                        },
                        buttonClicked: function() {
                            myWidgetFactory.callPhone([mobile]).then();
                        }
                    });
                }
            };
            $scope.views.mobile = baseService.items.get('ujing', 'mobile') || '';
            $scope.$apply();
        }
    ];
});
