/**
 * @file 创建管理人员、管理员信息
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
        '$timeout',
        '$location',
        '$topTip',
        '$rootScope',
        'baseService',
        '$ionicHistory',
        function($scope, cService, $timeout, $location, $topTip, $rootScope, baseService, $ionicHistory) {
            $scope.views = {
                isEdit: true, // 可编辑
                name: '', // 姓名
                tel: '', // 手机号码
                passwdInit: '', // 初始密码
                passwdSure: '', // 确认密码
                rightsName: '', // 需要显示的管理权限名称
                storeName: '', // 需要显示的洗衣房名称

                /**
                 * 指令器的显示，根据传入的参数显示不同的数据
                 * @param type {String} 洗衣房 'store'、设备类型 'modal'
                 */
                onSelect: function(type) {
                    shrinkType = type;

                    if (type === 'rights') {
                        baseService.items.set('franchisee', 'shrink', {
                            type: 'rights',
                            data: rightsSelected
                        });

                        return $rootScope.stateGo('shrink');
                    }

                    if (type === 'store') {
                        baseService.items.set('franchisee', 'shrink', {
                            type: 'store',
                            select: 'checkbox',
                            data: storeSelected
                        });

                        return $rootScope.stateGo('shrink');
                    }
                },
                // 提交人员管理的更新（创建、修改）
                onCreate: function() {
                    if (!this.name) {
                        $topTip('姓名不能为空');

                        return;
                    }
                    if (!this.tel) {
                        $topTip('手机号码不能为空');

                        return;
                    }
                    if (!/^1[3|4|5|7|8]\d{9}$/.test(this.tel)) {
                        $topTip('手机号码格式错误');

                        return;
                    }
                    if (this.isEdit && !this.passwdInit) {
                        $topTip('密码不能为空');

                        return;
                    }

                    if (this.isEdit && !/^[0-9A-Za-z]{6}$/.test(this.passwdInit)) {
                        $topTip('密码格式不正确');

                        return;
                    }

                    if (this.isEdit && this.passwdInit !== this.passwdSure) {
                        $topTip('初始密码与确认密码不相同！！');

                        return;
                    }

                    if (!this.storeName) {
                        $topTip('管理范围不能为空');

                        return;
                    }

                    if (!this.rightsName) {
                        $topTip('管理权限不能为空');

                        return;
                    }

                    var params = angular.extend({}, {
                        name: $scope.views.name,
                        mobile: $scope.views.tel,
                        password: $scope.views.passwdInit,
                        manageStoreList: JSON.stringify(storeIds)
                    }, rightsSubmit);

                    if (this.isEdit) {
                        addManager(params);
                    } else {
                        updateManagerInfo(params);
                    }

                }
            };

            var shrinkType = '', // 'right', 'store'
                storeSelected = [],
                storeIds = [],
                rightsSubmit = {},
                rightsSelected = [];

            /**
             * 获取所有洗衣房
             * @param storeIds 已有的洗衣房ID数组
             */
            var getAllStore = function(storeIds) {
                var allStoreList = baseService.items.get('franchisee', 'getAllStore');

                if (allStoreList) {
                    handler(allStoreList);

                    return;
                }

                cService.getAllStore().then(function(res) {
                    if (res && res.result === 1 && res.data.length > 0) {
                        handler(res.data);
                        baseService.items.set('franchisee', 'getAllStore', res.data);
                    }
                });

                function handler(data) {
                    storeSelected = data;

                    if (storeIds.length === 0) {
                        return;
                    }

                    var storeName = '';

                    angular.forEach(storeSelected, function(list) {
                        list.checked = list.storeList.length > 0;

                        angular.forEach(list.storeList, function(item) {
                            if (storeIds.indexOf(item._id) !== -1) {
                                storeName += ',' + item.name;
                                item.checked = true;
                            } else {
                                list.checked = false;
                            }
                        });
                    });
                    $scope.views.storeName = storeName.slice(1);
                }
            };

            /**
             * 设置权限管理数据
             * @param data {Array}
             */
            var setRights = function(data) {
                var rightsName = '';
                var rights = [
                    {
                        shortName: '洗衣房管理',
                        _id: 'storeManage',
                        checked: data ? (rightsName += ',洗衣房管理', data.storeManage) : false
                    },
                    {
                        shortName: '设备管理',
                        _id: 'deviceManage',
                        checked: data ? (rightsName += ',设备管理', data.deviceManage) : false
                    },
                    {
                        shortName: '订单管理',
                        _id: 'orderManage',
                        checked: data ? (rightsName += ',订单管理', data.orderManage) : false
                    },
                    {
                        shortName: '定价管理',
                        _id: 'priceManage',
                        checked: data ? (rightsName += ',定价管理', data.priceManage) : false
                    },
                    {
                        shortName: '统计管理',
                        _id: 'statisticsManage',
                        checked: data ? (rightsName += ',统计管理', data.statisticsManage) : false
                    },
                    {
                        shortName: '优惠券管理',
                        _id: 'couponManage',
                        checked: data ? (rightsName += ',优惠券管理', data.couponManage) : false
                    }
                   /* ,
                    {
                        shortName: '人员管理',
                        _id: 'manManage',
                        checked: data ? (rightsName += ',人员管理', data.manManage) : false
                    }*/
                ];
                $scope.views.rightsName = rightsName.slice(1);
                rightsSelected = rights;
            };

            // 创建管理人员
            var addManager = function(params) {
                cService.addManager(params).then(function(res) {
                    if (res && res.result === 1) {
                        $rootScope.stateGo('personnel');
                        // todo:待删
                        //$rootScope.$emit('personUpdate', 'insert');
                        //$rootScope.goBack();
                        //$ionicHistory.goBack();
                    } else {
                        $topTip(res.msg);
                    }
                }, function() {
                    $topTip('网络连接超时');
                });
            };
            // 修改管理人员
            var updateManagerInfo = function(params) {
                var params = angular.extend({}, params, {id: personItem.id});

                cService.updateManagerInfo(params).then(function(res) {
                    if (res && res.result === 1) {
                        $topTip('修改管理人成功！！');
                        $rootScope.stateGo('personnel');
                        // todo:待删
                        //$rootScope.$emit('personUpdate', 'update');
                        //$rootScope.goBack();
                        //$ionicHistory.goBack();
                    } else {
                        $topTip(res.msg);
                    }
                }, function() {
                    $topTip('网络连接超时');
                });
            };

            var personItem;

            var init = function() {
                personItem = baseService.items.get('person', 'item') || {};

                $scope.views.isEdit = !personItem.id;

                $scope.views.name = personItem.name || '';
                $scope.views.tel = personItem.mobile || '';
                setRights(!personItem.id ? undefined : personItem);
                getAllStore(personItem.manageStoreList || []);
            };
            init();

            // 观察页面跳转,设置限定范围
            $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState) {
                // 从 shrink 页面返回
                if (fromState.name === 'shrink' && toState.name === 'rights') {
                    var shrink = baseService.items.get('franchisee', 'shrink');
                    var showName = '';

                    if (shrink.type === 'rights') {
                        angular.forEach(shrink.data, function(item) {
                            rightsSubmit[item._id] = item.checked;

                            if (item.checked) {
                                showName += ',' + item.shortName;
                            }
                        });

                        return $scope.views.rightsName = showName.slice(1);
                    }

                    if (shrink.type === 'store') {
                        angular.forEach(shrink.data, function(list) {
                            angular.forEach(list.storeList, function(item) {
                                if (item.checked) {
                                    storeIds.push(item._id);
                                    showName += ',' + item.name;
                                }
                            });
                        });

                        return $scope.views.storeName = showName.slice(1);
                    }
                }
            });

            $scope.$apply();
        }
    ];
});
