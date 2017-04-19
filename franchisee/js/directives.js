/**
 * Created by Administrator on 2014/12/22.
 */
require.config({
    paths: {
        mc: 'js/tools/mobiscroll.custom-2.5.2.min'
    },
    shim: {
        mc: {
            deps: ['jquery']
        }
    }
});
define(['angular', 'mc','js/services'], function(angular) {
    'use strict';

    /* Directives */
    angular.module('cApp.directives', ['cApp.services'])
        .directive('notDataTips', function() {
            return {
                restrict: 'AE',
                template: '<div class="not-data-tips">' + '<i class="tips-img"></i>' + '<p>暂无相关信息~~</p>' + '</div>'
            };
        })
        .directive('areaFull', ['$parse', 'cService', '$ionicScrollDelegate', '$timeout', 'popupRight', '$rootScope', '$topTip',
            function($parse, cService, $ionicScrollDelegate, $timeout, popupRight, $rootScope, $topTip) {
                return {
                    restrict: 'EA',
                    scope: {
                        onSelect: '&',
                        ngIf: '=?',
                        ngShow: '=?',
                        selectLevel: '='
                    },
                    link: function($scope) {
                        var popup, currentName,level = 1,address = '',
                            addressObj = {}; // 地址存储对象

                        $scope.areaData = [];
                        var callback = $parse($scope.onSelect),
                            currentP = {};

                        $scope.search = {
                            value: ''
                        };
                        $scope.ctrl = {
                            showCity: false
                        };
                        $scope.close = function() {
                            if ($scope.ngIf) {
                                $scope.ngIf = false;
                            }

                            if ($scope.ngShow) {
                                $scope.ngShow = false;
                            }
                            popup.close();
                        };
                        $scope.$watch('ngIf', function(o, n) {
                            if (o && !n) {
                                $scope.close();
                            }
                        });
                        $scope.$watch('ngShow', function(o, n) {
                            if (o && !n) {
                                $scope.close();
                            }
                        });

                        $scope.getProvinceData = function(val, callBack) {
                            // TODO: 测试数据
                            /*var data = {
                             data: [
                             {
                             code: "1101",
                             fullName: "北京市市辖区",
                             name: "市辖区"
                             }
                             ]
                             };

                             for (var i = 0; i < 30; i++) {
                             data.data.push({
                             code: "1102",
                             fullName: "北京市县",
                             name: i + "县"
                             });
                             }
                             callBack(data);*/
                            cService.getAddressData({
                                code: val || '',
                                level: address || ''
                            }).then(function(res) {
                                if (res) {
                                    if (callBack) {
                                        callBack(res);
                                    }
                                } else {
                                    $topTip('获取省市数据失败！');
                                }
                            }, function(error) {
                                // statistics('Delivery', '获取省市数据失败');
                                $topTip('获取省市数据失败！');
                            });
                        };

                        $scope.getProvinceData('', function(data) {
                            $scope.areaData = data.data;
                            $timeout(function() {
                                popup = popupRight.show('template/directivesTpl/areaselectfull.html', $scope);
                            }, 200);
                        });
                        // 市
                        $scope.pClick = function(p) {
                            // currentName = p.name;
                            address = 1;
                            addressObj.province = p;
                                $scope.getProvinceData(p.code, function(data) {
                                    if (data) {
                                        $scope.cList = data.data;
                                        // currentP = p;
                                        if ($scope.cList.length) {
                                            $scope.ctrl.showCity = true;
                                        } else {
                                            callback.call($scope, {
                                                $event: addressObj// currentP
                                            });
                                            $scope.close();
                                        }
                                    }
                                });
                        };
                        // 县区
                        $scope.cClick = function(p) {
                            // currentName = currentName + '-' + p.name;
                            address = 2;
                            $scope.getProvinceData(p.code, function(data) {
                                if (data) {
                                    $scope.cList = data.data;
                                    // currentP = p;

                                    if ($scope.cList.length && $scope.selectLevel > level) {
                                        $scope.ctrl.showCity = true;
                                        level = level + 1;
                                        addressObj.city = p; // 市
                                    } else {
                                        addressObj.area = p; // 县区
                                        // currentP.name = currentName;
                                        callback.call($scope, {
                                            $event: addressObj// currentP
                                        });
                                        $scope.close();
                                    }
                                }
                                $timeout(function() {
                                    $ionicScrollDelegate.$getByHandle('selectList2').scrollTop();
                                }, 0);
                            });
                        };
                        $scope.closeRightScroll = function() {
                            $scope.ctrl.showCity = false;
                            level = 1;
                        };
                        $scope.$watch('search.value', function() {
                            $timeout(function() {
                                $ionicScrollDelegate.$getByHandle('selectList').scrollTop();
                            }, 0);
                        });
                    }
                };
            }])
        .directive('showCircle', [
            '$timeout',
            function($timeout) {
                return {
                    restrict: 'EA',
                    scope: {
                        process: '=?'
                    },
                    template: '<canvas width="{{width}}" height="{{height}}" class="canvas-degree"></canvas>',
                    controller: ['$scope', '$element', '$attrs', function($scope, $element, $attrs) {
                        var dpr = document.documentElement.getAttribute('data-dpr');

                        $scope.width = parseInt($attrs.width);
                        $scope.height = parseInt($attrs.height);
                        $scope.bigFont = 60;
                        $scope.smallFont = 30;

                        $scope.border = $attrs.border ? parseInt($attrs.border) : 0 ; // 内外圆形的间距

                        // $scope.process = $attrs.process ? parseInt($attrs.process) : 100; // 进度
                        $scope.colorStart = $attrs.colorstart; // 进度的颜色值
                        $scope.colorEnd = $attrs.colorend; // 进度的颜色值

                        $scope.dataDpr = 1;

                        if (document.documentElement.getAttribute('data-dpr') !== undefined) {
                            $scope.dataDpr = parseInt(document.documentElement.getAttribute('data-dpr'));
                        }

                        if ($scope.dataDpr === 2) {
                            $scope.width = parseInt($scope.width * 2);
                            $scope.height = parseInt($scope.height * 2);
                            $scope.border = parseInt($scope.border * 2);
                            $scope.bigFont = parseInt($scope.bigFont * 2);
                            $scope.smallFont = parseInt($scope.smallFont * 2);
                        } else if ($scope.dataDpr === 3) {
                            $scope.width = parseInt($scope.width  * 3);
                            $scope.height = parseInt($scope.height  * 3);
                            $scope.border = parseInt($scope.border  * 3);
                            $scope.bigFont = parseInt($scope.bigFont  * 3);
                            $scope.smallFont = parseInt($scope.smallFont * 3);
                        }

                        $scope.drawPic = function() {
                            var ctx = $element.find('canvas')[0].getContext('2d');

                            $timeout(function() {
                                // 百分比图例
                                // ***开始画一个灰色的圆
                                ctx.beginPath();
                                // 坐标移动到圆心
                                ctx.moveTo($scope.width / 2, $scope.height / 2);

                                // x	圆的中心的 x 坐标。
                                // y	圆的中心的 y 坐标。
                                // r	圆的半径。
                                // sAngle	起始角，以弧度计。（弧的圆形的三点钟位置是 0 度）。
                                // eAngle	结束角，以弧度计。
                                // counterclockwise	可选。规定应该逆时针还是顺时针绘图。False = 顺时针，true = 逆时针。

                                // 画圆,圆心是 $scope.width / 2,$scope.height / 2,半径$scope.width / 2,从角度0开始,画到2PI结束,最后一个参数是方向顺时针还是逆时针
                                ctx.arc($scope.width / 2, $scope.height / 2, $scope.width / 2, 0, Math.PI * 2, false);
                                ctx.lineWidth = 8.0;
                                ctx.closePath();
                                // 填充颜色
                                // ctx.strokeStyle = 'red';
                                // ctx.lineWidth = 2.0;
                                // ctx.stroke();
                                // TODO:process 允许大于100%
                                //if ($scope.process > 100) {
                                //    $scope.process = 100;
                                //}
                                //
                                //if ($scope.process < 0) {
                                //    $scope.process = 0;
                                //}

                                if ($scope.process < 100) {
                                    ctx.fillStyle = '#dee0e6'; // 蓝色
                                } else {
                                    var my_gradient2 = ctx.createLinearGradient(0, 0, $scope.width, $scope.height);

                                    my_gradient2.addColorStop(0, '#' + $scope.colorStart);
                                    my_gradient2.addColorStop(1, '#' + $scope.colorEnd);
                                    ctx.fillStyle = my_gradient2;
                                }

                                ctx.fill();

                                if ($scope.process != 0) { // 控件设计初规定￥scope.process范围 0-100
                                    // 画进度
                                    ctx.beginPath();
                                    // 画扇形的时候这步很重要,画笔不在圆心画出来的不是扇形
                                    ctx.moveTo($scope.width / 2 , $scope.height / 2);
                                    // 跟上面的圆唯一的区别在这里,不画满圆,画个扇形
                                    ctx.arc($scope.width / 2, $scope.height / 2, $scope.width / 2, -0.5 * Math.PI, (1 - $scope.process / 100) * (2 * Math.PI) - Math.PI / 2, false);
                                    ctx.lineWidth = 8.0;
                                    ctx.closePath();
                                    var my_gradient = ctx.createLinearGradient(0, 0, $scope.width, $scope.height);

                                    my_gradient.addColorStop(0, '#' + $scope.colorStart);
                                    my_gradient.addColorStop(1, '#' + $scope.colorEnd);
                                    ctx.fillStyle = my_gradient;
                                    ctx.fill();
                                }

                                // 画内部空白
                                ctx.beginPath();
                                ctx.moveTo($scope.width / 2, $scope.height / 2);
                                ctx.arc($scope.width / 2, $scope.height / 2, $scope.width / 2 - $scope.border, 0, Math.PI * 2, true);
                                ctx.lineWidth = 8.0;
                                ctx.closePath();
                                ctx.fillStyle = '#fff'; // 蓝色
                                ctx.fill();

                                // 在中间写字
                                /*ctx.font = 'bold ' + $scope.bigFont + 'px Arial';
                                 ctx.fillStyle = '#656565';
                                 ctx.textAlign = 'center';
                                 ctx.textBaseline = 'middle';
                                 ctx.moveTo($scope.width / 2, $scope.height / 2);
                                 ctx.fillText('有效', $scope.width / 2, $scope.height / 2);*/

                                // 写百分号
                                /*ctx.font = 'bold ' + $scope.smallFont + 'px Arial';
                                 ctx.fillStyle = '#fff';
                                 ctx.textAlign = 'top';
                                 ctx.textBaseline = 'right';
                                 ctx.moveTo($scope.width * 0.73, $scope.height * 0.4);
                                 ctx.fillText('%', $scope.width * 0.8, $scope.height * 0.45);*/
                            });
                        };
                        // $scope.drawPic();
                    }],
                    compile: function($element) {
                        return function($scope) {
                            $scope.$watch('process', function(inProcess) {
                                if (inProcess !== undefined) {
                                    // $scope.progress = inProcess;
                                    $scope.drawPic();
                                }
                            });
                        };
                    }
                };
            }
        ])
        .directive('weightPick', [
            function() {
                return {
                    restrict: 'AE',
                    scope: {
                        datePick: '=',
                        value: '=',
                        maxValue: '='
                    },
                    template: '<input id="get-weight" type="text" ng-model="value">',
                    compile: function() {
                        return function($scope, $element) {
                            var minutesArry = []; // 月份
                            var hoursArry = []; // 月份
                            var getInteger = function() {
                                for (var i = 0; i < $scope.maxValue; i++) {
                                    (function(i) {
                                        if (i < 10) {
                                            i = '0' + i;
                                        }
                                        hoursArry.push(i);
                                    })(i);
                                }

                                for (var j = 0; j < 60; j++) {
                                    (function(j) {
                                        if (j < 10) {
                                            j = '0' + j;
                                        }
                                        minutesArry.push(j);
                                    })(j);
                                }
                            };
                            var n = parseInt(document.documentElement.getAttribute('data-dpr'));

                            $scope.$watch('maxValue', function(newValue) {
                                if (newValue) {
                                    getInteger();
                                    var opt = {
                                        theme: 'mobiscroll', // 皮肤样式
                                        display: 'inline', // 显示方式
                                        mode: 'scroller', // 日期选择模式
                                        lang: 'zh',
                                        wheels: [[
                                            hoursArry, // 小时位数
                                            minutesArry // 分钟位数
                                        ]],
                                        rows: 5,
                                        width: 90,
                                        height: 40, // 40 * n,
                                        fixedWidth: 150
                                    };

                                    $element.find('input').mobiscroll().scroller(opt);
                                    $element.find('.dw-i').addClass('font-weight');
                                }
                            });
                        };
                    }
                };
            }
        ])
        .directive('accordion', function() {
            return {
                restrict: 'AE',
                scope: {},
                transclude: true,
                template: '<div ng-transclude></div>',
                replace: true,
                controller: function() {}
            };
        })
        // 设备列表
        .directive('laundryDeviceList', ['cService',
            'widgetFactory',
            '$ionicActionSheet',
            '$ionicModal',
            'cFactory',
            '$topTip',
            '$ionicListDelegate',
            '$parse',
            function(cService, widgetFactory, $ionicActionSheet, $ionicModal, cFactory, $topTip, $ionicListDelegate, $parse) {
            return {
                restrict: 'AE',
                scope: {
                    deviceList: '=', // 设备列表数据
                    onSelect: '&', // 选择事件
                    refresh: '&'
                },
                templateUrl: 'template/directivesTpl/device-list.html',
                replace: true,
                controller: ['$scope', function(scope) {
                    var onSelect = $parse(scope.onSelect);
                    $ionicModal.fromTemplateUrl('template/directivesTpl/set-device.html', {
                        scope: scope,
                        animation: 'slide-in-up'
                    }).then(function(modal) {
                        scope.modal = modal;
                    });
                    scope.temp = {
                        isEnable: false,
                        hideModal: function() {
                            scope.modal.hide();
                        },
                        onSubmit: function(device) {
                            var params = {
                                deviceId: device._id,
                                no: device.no,
                                isEnable: this.isEnable ? 0 : 1
                            };

                            console.log( device );

                            if (params.no === '') {
                                cFactory.alert('编号不能为空！！');

                                return;
                            }
                            // 停用时间 shutDownTime
                            cService.updateDeviceInfo(params).then(function(res) {
                                if (res && res.result === 1) {
                                    scope.modal.hide();
                                    // $topTip('设备已经处于' + (!params.isEnable ? '停用' : '空闲') + '状态');
                                    // scope.deviceList.splice(scope.deviceList.indexOf(device), 1);
                                    //onSelect.call(scope, {result: res.result}); 带参数的传递
                                    onSelect.call(scope);
                                }
                            });
                        }
                    };
                    scope.views = {
                        // 设备绑定二维码
                        bindQrcode: function(device) {
                            var req = function(params) {
                                console.log('进行设备绑定');
                                cService.bindQrcode(params).then(function(res) {
                                    if (res && res.result === 1) {
                                        $topTip('设备二维码绑定成功');
                                    }
                                });
                            };
                            var scanCordova = function() {
                                widgetFactory.scan().then(function(data) {
                                    if (data) {
                                        req({
                                            deviceId: device._id,
                                            //qrcode: device.qrcode
                                            qrcode: data.text
                                        });
                                    } else {
                                        cFactory.alert('获取扫码失败！');
                                    }
                                });
                            };

                            cFactory.confirm('绑定设备二维码，会覆盖当前二维码设置，确定进行扫码绑定？').then(function(res) {
                                if (res) {
                                    scanCordova();
                                }
                            });
                        },
                        // 设备二维码解除绑定
                        unbindQrcode: function(device, index) {
                            cFactory.confirm('确定要解除当前设备的绑定？').then(function(res) {
                                if (res) {
                                    cService.unbindQrcode({
                                        deviceId: device._id
                                    }).then(function(res) {
                                        if (res && res.result === 1) {
                                            // 解除绑定成功，刷新页面
                                            //scope.deviceList.splice(index, 1);
                                            //$ionicListDelegate.closeOptionButtons();
                                            $parse(scope.refresh).call(scope);
                                            $topTip('解除绑定成功！');
                                        } else {
                                            $topTip(res.msg);
                                        }
                                    });
                                }
                            });
                        },
                        // 修改设备信息
                        updateDeviceInfo: function(device) {
                            scope.temp.device = device;
                            deviceNo = device.no;
                            scope.modal.show();
                        },
                        // 紧急停机
                        stop: function(device) {
                            var params = {
                                deviceId: device._id
                            };
                            var req = function(params) {
                                cService.stop(params).then(function(res) {
                                    console.log(params, '\n, res', res);

                                    if (res && res.result === 1) {
                                        onSelect.call(scope);
                                    }
                                });
                            };

                            if (device.status == 1) {
                                cFactory.confirm('该设备当前正在工作中，确定要紧急停机？').then(function(res) {
                                    if (res) {
                                        req(params);
                                    }
                                });
                            }

                            if (device.status == 2) {
                                cFactory.confirm('停机故障中的设备？').then(function(res) {
                                    if (res) {
                                        req(params);
                                    }
                                });
                            }
                        },
                        // 重新启动
                        restart: function(device) {
                            var req = function(params) {
                                cService.restart(params).then(function(res) {
                                    if (res && res.result === 1) {
                                        onSelect.call(scope);
                                    } else {
                                        $topTip('重新启动操作失败！');
                                    }
                                });
                            };
                            // device.status == 2 时
                            cFactory.confirm('重新启动故障中的设备？').then(function(res) {
                                if (res) {
                                    req({
                                        deviceId: device._id
                                    });
                                }
                            })
                        },
                        // 重新启动
                        disable: function(device) {
                            var req = function(params) {
                                cService.disable(params).then(function(res) {
                                    if (res && res.result === 1) {
                                        onSelect.call(scope);
                                    }
                                });
                            };
                            // device.status == 3 时
                            cFactory.confirm('启用停用中的设备？').then(function(res) {
                                req({
                                    deviceId: device._id,
                                    isEnable: 1
                                });
                            })
                        },
                        // 打电话
                        telAction: function(device) {
                            var buttons = [
                                {
                                    text: device.storeId.mobile,
                                    handler: function() {
                                        //
                                    }
                                }
                            ];

                            getAction(buttons);
                        },
                        // 更多
                        moreAction: function(device) {
                            var buttons = [];

                            if (device.status == 2) { // 故障
                                buttons = [
                                    {
                                        text: '返券补偿',
                                        handler: function() {
                                            payCoupon(device);
                                        }
                                    }
                                ];
                            } else if (device.status == 3) { // 停用
                                buttons = [
                                    {
                                        text: '解绑',
                                        handler: function() {
                                            scope.views.unbindQrcode(device);
                                        }
                                    },
                                    {
                                        text: '扫一扫',
                                        handler: function() {
                                            scope.views.bindQrcode(device);
                                        }
                                    },
                                    {
                                        text: '编辑',
                                        handler: function() {
                                            scope.views.updateDeviceInfo(device);
                                        }
                                    }
                                ];
                            }

                            getAction(buttons);
                        }
                    };
                    var deviceNo = ''; // 编号
                    var getAction = function(buttons) {
                        var hideSheet = $ionicActionSheet.show({
                            buttons: buttons,
                            cancelText: '取消',
                            cancel: function() {
                                console.log('点击了取消');
                            },
                            buttonClicked: function(index) {
                                console.log(index);
                                buttons[index].handler();
                                return true;
                            }
                        });
                    };
                    // 反券
                    var payCoupon = function(device) {
                        cService.payCoupon({
                            orderId: device.orderId._id
                        }).then(function(res) {
                            console.log( res );
                        });
                    };
                }]
            };
        }])
        // 日期选择器
        .directive('datePick', [
            function() {
                return {
                    restrict: 'AE',
                    scope: {
                        datePick: '=',
                        value: '=',
                        defaultValue: '=', // 默认日期
                        minAndMaxDate: '=' // 最大最小日期限制
                    },
                    template: '<input ng-show="true" id="demo" type="text" ng-model="value">',
                    compile: function() {
                        return function($scope, $element, $attr) {
                            var minAndMaxDate = $scope.minAndMaxDate,
                                currYear = new Date().getFullYear(),
                                minDate = minAndMaxDate && minAndMaxDate.minDate ? new Date(minAndMaxDate.minDate) : new Date(),
                                //maxDate = minAndMaxDate && minAndMaxDate.maxDate ? new Date(minAndMaxDate.maxDate) : new Date(new Date(currYear, (new Date()).getMonth(), (new Date()).getDate()));
                                maxDate = minAndMaxDate && minAndMaxDate.maxDate ? new Date(minAndMaxDate.maxDate) : new Date(3016, 1, 1);

                            var opt = {
                                theme: 'mobiscroll', //皮肤样式
                                display: 'inline', //显示方式
                                mode: 'scroller', //日期选择模式
                                lang: 'zh',
                                dateFormat: 'yyyy-mm-dd',
                                dateOrder: 'yymmdd',
                                dayText: '日',
                                monthText: '月',
                                yearText: '年',
                                minDate: minDate, // 开始年份
                                maxDate: maxDate // 结束年份
                            };

                            $element.find('input').mobiscroll().date(opt);
                            $scope.$watch('defaultValue', function(newValue) {
                                if (newValue) {
                                    console.log(newValue);
                                    $element.find('input').mobiscroll('setDate', new Date(newValue));
                                }
                            });
                        };
                    }
                };
            }
        ])
        .directive('myList', [function() {
            return {
                restrict: 'AE',
                scope: {},
                template: '<ion-list class="transparent-animation"><ion-item ng-repeat="item in listData track by $index" on-click="chooseParent()"></ion-item> </ion-list>',
                compile: function() {
                    return function($scope, $elem, $attr) {
                        var listData = $attr.listData;
                    };
                }
            };
        }])
});
