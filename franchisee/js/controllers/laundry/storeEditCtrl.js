/**
 * @file 洗衣房信息
 * @author ytp <tianping.yan@partner.midea.com.cn>
 * @copyright Midea Co.Ltd 1968-2016
 * @license Released under the Commercial license.
 * @version 16/5/4
 */
define(['ionic'], function() {
    'use strict';

    return [
        '$scope',
        'cService',
        'myWidgetFactory',
        'baseService',
        '$ionicScrollDelegate',
        '$timeout',
        '$rootScope',
        '$state',
        '$stateParams',
        'cFactory',
        '$topTip',
        '$ionicModal',
        '$filter',
        'log',
        function($scope, cService, myWidgetFactory, baseService, $ionicScrollDelegate, $timeout, $rootScope, $state, $stateParams, cFactory, $topTip, $ionicModal, $filter, log) {
            $scope.views = {
                isEdit: false, // 创建、修改洗衣房标识
                name: '', // 主体名称
                isShowMask: false, // 是否显示时间蒙版
                storeBind: {
                    title: '', // 页面 title
                    name: '', // 洗衣房名称
                    name1: '', // 层级1
                    name2: '', // 层级2
                    name3: '', // 层级3
                    address: '', // 详细地址
                    coordinate: '', // 经纬度
                    businessStartTime: '', // 营业开始时间
                    businessEndTime: '', // 应用结束时间
                    enable: '' // 新增时是否停用的状态
                },
                toggleIndex: 0, // 自定义、层级
                // 自定义、层级的切换
                toggleSwitcher: function(index) {
                    this.toggleIndex = index;
                },
                isTimeEnd: false, // 是否选择了结束时间，调用指令器时用到
                maxValue: 24, // 小时的滚轮
                // 删除
                onRemove: function() {
                    if (!storeId) {
                        return;
                    }
                    cFactory.confirm('<p>确定要删除洗衣房信息吗？</p>').then(function(res) {
                        if (res) {
                            removeStore(storeId);
                        }
                    });
                },
                // 修改保存
                updateStore: function() {
                    var name, // 洗衣房名称
                        self = this;

                    if (!this.isEdit || (self.isEdit && self.toggleIndex === 0)) {
                        name = self.storeBind.title;
                    }

                    if (this.isEdit && this.toggleIndex === 1) {
                        name = this.storeBind.title1 + this.storeBind.title2 + this.storeBind.title3;
                    }

                    if (!name) {
                        $topTip('洗衣房名称不能为空！');

                        return;
                    }

                    if (!this.isEdit && !this.storeBind.address) {
                        $topTip('详细地址不能为空！');

                        return;
                    }

                    if (!self.storeBind.mobile) {
                        $topTip('手机号码不能为空！');

                        return;
                    }

                    if (!/^1[3|4|5|7|8]\d{9}$/.test(self.storeBind.mobile)) {
                        $topTip('电话号码格式不正确');

                        return;
                    }

                    var options = {
                        name: name, // 洗衣房名称
                        lat: coordinate.split(',')[1], // 纬度
                        lont: coordinate.split(',')[0], // 经度
                        businessStartTime: $filter('timeShop')(self.storeBind.businessStartTime), // 营业开始时间
                        businessEndTime: $filter('timeShop')(self.storeBind.businessEndTime), // 应用结束时间
                        mobile: self.storeBind.mobile,
                        enable: self.state // 启用状态
                    };

                    if (this.isEdit) {
                        options.serviceSubjectId = laundryItem._id; // 所属服务主体ID
                        addStore(options);
                    } else {
                        options.id = storeId; // 洗衣房ID
                        updateStoreInfo(options);
                    }
                },
                // 点击营业时间
                timeModalShow: function(timeType) {
                    this.isTimeEnd = timeType === 'businessEndTime' ? true : false;
                    this.isShowMask = true;
                    timeOld = this.storeBind[timeType];
                    timeTypes = timeType; // timeEnd timeStart
                },
                // 关闭滑动时间
                timeModalHide: function($event, opeater) {
                    this.isShowMask = false;

                    if (opeater && opeater === 'cancel') {
                        if (this.isTimeEnd) {
                            this.storeBind.businessEndTime = timeOld;
                        } else {
                            this.storeBind.businessStartTime = timeOld;
                        }
                    }

                    if ($filter('timeShop')(this.storeBind.businessEndTime) === '00:00') {
                        $topTip('结束时间不能为00:00!');

                        if (this.isTimeEnd) {
                            this.storeBind.businessEndTime = timeOld;
                        } else {
                            this.storeBind.businessStartTime = timeOld;
                        }

                        return;
                    }

                    if (opeater && opeater === 'sure' && $filter('timeShop')(this.storeBind.businessStartTime) > $filter('timeShop')(this.storeBind.businessEndTime)) {
                        $topTip('开始时间不能大于结束时间!');

                        if (this.isTimeEnd) {
                            this.storeBind.businessEndTime = timeOld;
                        } else {
                            this.storeBind.businessStartTime = timeOld;
                        }
                    }

                },
                // 获取定位
                locationMap: function() {
                    getMap(coordinate);
                },
                state: true, // 当前状态：停用
                stateList: [// 状态的列表
                    {
                        text: '停用',
                        value: false
                    },
                    {
                        text: '启用',
                        value: true
                    }
                ],
                /**
                 * 单选框切换时的操作
                 * @param item 数组中的项
                 * @param selected 获取当前选中的值，
                 */
                radioChange: function(item, selected) {
                    $scope[selected] = item.value;
                }
            };

            var timeOld = '', // 时间旧值
                timeTypes = '', // 时间类型
                coordinate = '', // 定位
                laundryItem = baseService.items.get('laundry', 'item'),
                storeItem = baseService.items.get('store', 'item'),
                storeId = $stateParams.id,
                status = 0;

            // 更新本地存储的数据
            var updateStore = function(handler, data) {
                $rootScope.$broadcast('updateStore', storeId);

                if (handler === 'add') {
                    return;
                }

                //var storeList = baseService.items.get('storeList', 'storeList');
                var storeList = baseService.items.get('store', 'list');
                var idList = [],
                    index = 0;

                angular.forEach(storeList, function(item) {
                    console.log( item );
                    idList.push(item._id);
                });

                index = idList.indexOf(storeId);

                if (handler === 'delete' && index >= 0) {
                    storeList.splice(index, 1);
                    //baseService.items.set('storeItem', 'storeItem', storeList[0]);
                    //baseService.items.set('storeList', 'storeList', storeList);
                    baseService.items.set('store', 'item', storeList[0]);
                    baseService.items.set('store', 'list', storeList);
                }

                if (handler === 'update' && index >= 0) {
                    storeItem = angular.extend({}, storeItem, data);
                    storeList[index] = storeItem;
                    //baseService.items.set('storeItem', 'storeItem', storeItem);
                    //baseService.items.set('storeList', 'storeList', storeList);
                    baseService.items.set('store', 'item', storeItem);
                    baseService.items.set('store', 'list', storeList);
                }
            };

            // 删除洗衣房
            var removeStore = function(id) {
                //var storeList = baseService.items.get('storeList', 'storeList'),
                var storeList = baseService.items.get('store', 'list'),
                    storeItem,
                    i;
                cService.removeStore({
                    id: id
                }).then(function(res) {
                    if (res && res.result === 1) {
                        $topTip('删除洗衣房成功');
                        angular.forEach(storeList, function(item, index) {
                            if (item._id === id) {
                                i = index;
                            }
                        });
                        storeList.splice(i, 1);
                        if (storeList.length === 0) {
                            storeItem = null;
                        } else {
                            storeItem = storeList[i - 1 === -1 ? 0 : i - 1];
                        }
                        //baseService.items.set('storeList', 'storeList', storeList);
                        //baseService.items.set('storeItem', 'storeItem', storeItem);
                        baseService.items.set('store', 'list', storeList);
                        baseService.items.set('store', 'item', storeItem);
                        $rootScope.$broadcast('updateStore', {
                            id: storeId,
                            type: 'remove',
                            data: storeItem
                        });
                        //updateStore('delete');
                        $rootScope.goBack();
                    }
                });
            };

            // 修改洗衣房
            var updateStoreInfo = function(options) {
                //var storeItem = baseService.items.get('storeItem', 'storeItem');
                var storeItem = baseService.items.get('store', 'item');

                cService.updateStoreInfo(options).then(function(res) {
                    console.log('修改洗衣房', res);

                    if (res && res.result === 1 && res.data) {
                        $topTip('修改洗衣房成功');

                        storeItem = angular.extend({}, storeItem, {
                            businessEndTime: options.businessEndTime,
                            businessStartTime: options.businessStartTime,
                            enable: options.enable,
                            coordinate: [options.lont, options.lat],
                            mobile: options.mobile,
                            name: options.name
                        });
                        //baseService.items.set('storeItem', 'storeItem', storeItem);
                        baseService.items.set('store', 'item', storeItem);
                        $rootScope.$broadcast('updateStore', {
                            id: storeId,
                            type: 'update',
                            data: storeItem
                        });
                        //updateStore('update', res.data);
                        $rootScope.goBack();
                    }
                });
            };

            // 创建洗衣房
            var addStore = function(options) {
                cService.addStore(options).then(function(res) {
                    console.log('添加洗衣房', res);

                    if (res && res.result === 1 && res.data) {
                        $topTip('添加洗衣房成功');
                        $rootScope.$broadcast('updateStore', {
                            id: res.data._id,
                            type: 'add',
                            data: res.data
                        });
                        //updateStore('add');
                        $rootScope.goBack();
                    }
                });
            };

            // 原生打开地图
            var getMap = function(coordinateParams) {
                var params = '';
                if (coordinateParams) {
                    params = coordinateParams.split(',');
                }
                myWidgetFactory.getMap(params).then(function(res) {
                    log(res);
                    $scope.views.storeBind.coordinate = coordinate = $filter('keepSixPointNumber')(res.longitude) + ',' + $filter('keepSixPointNumber')(res.latitude);
                });
            };

            // 获取当前定位
            var getLocation = function(callback) {
                cService.getLocationNow().then(function(res) {
                    log('获取到的当前定位：', res);
                    if (res && res.latitude && res.longitude) {

                        coordinate = $filter('keepSixPointNumber')(res.longitude) + ',' + $filter('keepSixPointNumber')(res.latitude);
                        callback && callback();
                    } else {
                        $topTip('抱歉~~获取地址失败！');
                    }
                }, function() {
                    $topTip('抱歉~~获取定位失败！');
                });
            };

            // 初始化洗衣房数据
            var setStoreData = function(data) {
                var storeInfo = {};
                storeInfo.title = data ? data.name : '';
                storeInfo.title1 = '';
                storeInfo.title2 = '';
                storeInfo.title3 = '';
                storeInfo.address = data ? data.address : '';
                storeInfo.businessStartTime = data ? data.businessStartTime : '00:00';
                storeInfo.businessEndTime = data ? data.businessEndTime : '23:59';
                storeInfo.mobile = data ? data.mobile : '';
                coordinate = data ? (data.coordinate).toString() : coordinate;
                storeInfo.coordinate = coordinate;
                $scope.views.state = data ? data.enable : false;
                $scope.views.storeBind = storeInfo;
            };

            $scope.views.name = laundryItem && laundryItem.name;

            if (!storeId) { // 新增
                $scope.views.isEdit = true;
                getLocation(setStoreData);
            } else { // 详情，storeItem._id === storeId
                $scope.views.isEdit = false;
                setStoreData(storeItem);

                status = parseInt(storeItem.approveStatus);

                if (status === 1) { // 待审核
                    $scope.views.status = '待审核';
                } else if (status === 2) { // 通过
                    $scope.views.status = '通过';
                } else if (status === 3) { // 不通过
                    $scope.views.status = '不通过';
                }
            }
            $scope.$apply();
        }
    ];
});
