/**
 * @file 消息详情
 * @author <liping.ye@midea.com.cn>
 * @copyright Midea Co.Ltd 1968-2015
 * @license Released under the Commercial license.
 * @since 1.0.1
 * @version 1.0.2 - 2016/5/10
 */
define(['ionic'], function() {
    'use strict';

    return [
        '$scope',
        '$rootScope',
        '$ionicActionSheet',
        'myWidgetFactory',
        'cService',
        'cFactory',
        'baseService',
        function($scope, $rootScope, $ionicActionSheet, myWidgetFactory, cService, cFactory, baseService) {
            $scope.views = {
                baseUrl: window.CONFIGURATION.com.midea.baseUrl,
                title: '',
                messageItem: '',
                paySuccessShare: false,
                onShare: function() {
                    var type = '';

                    $ionicActionSheet.show({
                        cssClass: 'share-action-sheet',
                        buttons: [
                            {
                                text: '<a class="share-item"><img src="./images/share_wechat.png"><span>微信好友</span></a>'
                            },
                            {
                                text: '<a class="share-item"><img src="./images/friends_circle.png"><span>微信朋友圈</span></a>'
                            },
                            {
                                text: '<a class="share-item"><img src="./images/share_qq.png"><span>QQ分享</span></a>'
                            },
                            {
                                text: '<a class="share-cancel">取消</a>'
                            }
                        ],
                        titleText: '<div class="share-des">请选择分享方式</div><div class="dotted-line"></div>',
                        buttonClicked: function(index) {
                            if (index === 0) {
                                // 微信好友
                                type = 'friend';
                            } else if (index === 1) {
                                // 微信朋友圈
                                type = 'circle';
                            } else if (index === 2) {
                                // QQ分享
                                type = 'qq';
                            }
                            share(type);

                            return true;
                        }
                    });
                }
            };
            var coupon = {},
                store = {},
                getLocal = localStorage.getItem('loginInfo'),
                storeId = '',
                user = {};

            var storeName = [];

            if (getLocal && getLocal !== 'null' && getLocal !== 'undefined') {
                //user = getLocal;
                user.nickname = JSON.parse(getLocal).nickname;
                user.id = JSON.parse(getLocal).id;
            }
            // 分享调用
            var share = function(type) {
                var params = {
                    type: type,
                    url: 'http://121.41.34.175:4000/share.html?coupon=' + encodeURI(JSON.stringify(coupon) + '&user=' + JSON.stringify(user)),
                    imagePath: 'http://121.41.34.175:4000/share.png',
                    title: '土豪老板送券啦，领券任性洗~',
                    content: '小U送券啦，任性的送你一张券，拿去洗衣服用吧~'
                };
                var arr = [].concat(params.type, params.url, params.imagePath, params.title, params.content);

                myWidgetFactory.share(arr).then(function(res) {
                    alert('原生分享返回：' + JSON.stringify(res) );
                    // 分享成功，调用后台领赏
                    if (res) {
                        cService.earnCoupon({
                            couponId: coupon._id
                        }).then(function(res) {});
                    }
                });
            };

            // 优惠券分享
            var shareCoupon = function(item) {
                cService.shareCoupon({
                    couponId: item.couponId
                }).then(function(res) {
                    console.log('优惠券分享：', res );
                    if (res && res.result == 1 && res.data) {
                        coupon.value = res.data.value;
                        // coupon.unit = res.data.unit;
                        coupon.activeityEndTime = res.data.activityEndTime;
                        coupon._id = res.data._id;

                        // TODO res.data.stores 洗衣房数组 storeId, storeName
                        angular.forEach(res.data.stores, function(item) {
                            storeName.push(item.storeName);
                        });
                        //store.id = res.data.store._id;
                        //store.name = res.data.store.name;
                    }
                });
            };

            var messageItem = baseService.items.get('messageItem', 'messageItem');
console.log('数据：', messageItem);
            if (messageItem) {
                $scope.views.messageItem = messageItem;

                if (messageItem.paySuccess || (messageItem.type == 32 && messageItem.couponId)) {
                    shareCoupon(messageItem);
                }
            } else {
                cFactory.alert('获取数据失败！请重新尝试').then(function() {
                    $rootScope.goBack();
                });
            }
            $scope.$apply();
        }
    ];
});
