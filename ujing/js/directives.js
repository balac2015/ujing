/**
 * Created by Administrator on 2014/12/22.
 */
define(['angular', 'js/services'], function(angular) {
    'use strict';

    /* Directives */
    angular.module('cApp.directives', ['cApp.services'])
        .directive('washList', function() {
            return {
                restrict: 'E',
                templateUrl: 'template/directivesTpl/washList.html',
                scope: {
                    sendData: '=',
                    clickFun: '&'
                },
                replace: false,
                link: function($scope, $element) {
                }
            };
        })
        .directive('iconStore', function() {
            return {
                restrict: 'E',
                template: '<i class="{{bindClass}}"></i>',
                scope: {
                    iconClass: '@', // 'icon-device', 'icon-model', 'icon-pay', 'icon-order', 'icon-history'
                    storeIcon: '@', // 后台返回的图标
                    storeName: '@' // 名称
                },
                replace: true,
                link: function(scope) {
                    var storeClass;
                    scope.bindClass = '';

                    switch (scope.storeName) {
                        case '滚筒机':
                            storeClass = scope.storeIcon || 'icon-drum';
                            break;
                        case '干衣机':
                            storeClass = scope.storeIcon || 'icon-dry';
                            break;
                        case '波轮机':
                            storeClass = scope.storeIcon || 'icon-pulsator';
                            break;
                        case '标准烘':
                            storeClass = scope.storeIcon || 'standard-dry';
                            break;
                        case '超强烘':
                            storeClass = scope.storeIcon || 'super-dry';
                            break;
                        case '普通烘':
                            storeClass = scope.storeIcon || 'ordinary-dry';
                            break;
                        case '单脱水':
                            storeClass = scope.storeIcon || 'single-wash';
                            break;
                        case '大件洗':
                            storeClass = scope.storeIcon || 'big-wash';
                            break;
                        case '快速洗':
                            storeClass = scope.storeIcon || 'fast-wash';
                            break;
                        case '标准洗':
                            storeClass = scope.storeIcon || 'standard-wash';
                            break;
                        default:
                            break;
                    }

                    scope.bindClass = storeClass + ' ' + scope.iconClass;
                }
            };
        })
        .directive('address', function() {
            return {
                restrict: 'AE',
                templateUrl: 'template/directivesTpl/address.html',
                scope: {
                    addressText: '=',
                    time: '=',
                    mobile: '='
                },
                replace: true,
                controller: function($scope, $ionicActionSheet, myWidgetFactory, $log) {
                    $scope.tel = function() {
                        var hideSheet = $ionicActionSheet.show({
                            cssClass: 'ionic-action-tel',
                            buttons: [
                                {
                                    text: '<b>' + $scope.mobile + '</b>'
                                }
                            ],
                            cancelText: '取消',
                            cancel: function() {
                                // 点击取消按钮操作
                            },
                            buttonClicked: function(index) {
                                // TODO:调用底座拨打电话
                                var params = [$scope.mobile,''];

                                myWidgetFactory.callPhone(params).then(function(data) {
                                    $log.log('SUCC');
                                });
                                hideSheet();

                                return true;
                            }
                        });
                    };
                },
                link: function() {}
            };
        })
        .directive('notDataTips', function() {
            return {
                restrict: 'AE',
                template: '<div class="not-data-tips">' + '<i class="tips-img"></i>' + '<p>暂无相关信息~~</p>' + '</div>'
            };
        })
        .directive('remainText', ['$interval', '$parse', function($interval, $parse) {
            return {
                restrict: 'AE',
                scope: {
                    changeTime: '@', // 改变的时间
                    overHandler: '&'
                },
                template: '<span>{{changeTime | countdown}}</span>',
                replace: true,
                link: function(scope) {
                    var timer = null,
                        overHandler = $parse(scope.overHandler);

                    if (timer) {
                        $interval.cancel(timer);
                    }
                    timer = $interval(function() {
                        if (parseInt(scope.changeTime) > 0) {
                            scope.changeTime = parseInt(scope.changeTime) - 1;
                        } else {
                            $interval.cancel(timer);

                            if (overHandler) {
                                overHandler.call(scope);
                            }
                        }
                    }, 1000);
                }
            };
        }])
        .directive('remainCircle', ['$interval', '$parse', function($interval, $parse) {
            return {
                restrict: 'AE',
                scope: {
                    remainRun: '@', // 已经运行了的时间
                    remainAmount: '@', // 总时间
                    width: '@',
                    height: '@',
                    line: '@',
                    overHandler: '&'
                },
                transclude: true,
                template: '<div class="circle-time">' +
                '<span ng-transclude class="remain-text"></span><br><b class="remain-num">{{showTime | countdown}}</b>' +
                '</div>',
                replace: true,
                controller: ['$scope', '$element', function(scope, element) {
                    var stop = null,
                        overHandler = $parse(scope.overHandler);

                    var dpr = document.documentElement.getAttribute('data-dpr'),
                        width = scope.width * dpr,
                        height = scope.height * dpr,
                        x = width / 2,
                        y = height / 2,
                        line = scope.line * dpr,
                        radius = (x - line),
                        startAngle = 2 * Math.PI / 3,
                        endAngle = 7 * Math.PI / 3,
                        count = 1,
                        canvas = '<canvas class="canvas-circle" width="' + width + '" height="' + height + '"></canvas>',
                        ctx = angular.element(element[0]).append(canvas).find('canvas')[0].getContext('2d');

                    var draw = function(s, e) {
                        ctx.save();
                        ctx.beginPath();
                        ctx.arc(x, y, radius, s, e, false);
                        ctx.stroke();
                        ctx.restore();
                    };

                    var gradientColor = ctx.createLinearGradient(0, 0, width, height);

                    gradientColor.addColorStop(0, '#8067c4'); // （渐变开始位置， 开始颜色）
                    gradientColor.addColorStop(1, '#5e98e3'); // （渐变结束位置， 结束颜色）

                    ctx.strokeStyle = gradientColor;
                    ctx.lineWidth = line;
                    draw(startAngle, endAngle);

                    ctx.strokeStyle = '#ebeff4';

                    var runed = scope.remainRun || 0;   // 已经运行了的时间
                    var amount = scope.remainAmount;    // 需要运行的总时间
                    var num;
                    var diff = amount - runed;

                    if (!runed || runed == amount) {
                        diff = amount;
                        scope.showTime = amount;
                        endAngle = startAngle;
                        num = 2;
                    } else {
                        diff = amount > runed ? amount - runed : 0;
                        scope.showTime = runed;

                        num = diff / amount * 5 + 2;
                        endAngle = (num + 5 * count / amount) * Math.PI / 3;
                    }

                    var canvasAnimation = function() {
                        if (scope.showTime > 0) {
                            endAngle = (num + 5 * count / amount) * Math.PI / 3;
                            draw(startAngle, endAngle);
                            scope.showTime = scope.showTime - 1;
                            count += 1;
                        } else {
                            $interval.cancel(stop);
                            if (overHandler) {
                                overHandler.call(scope);
                            }
                        }
                    };
                    draw(startAngle, endAngle);
                    $interval.cancel(stop);
                    stop = $interval(canvasAnimation, 1000);
                }]
            };
        }]);
});
