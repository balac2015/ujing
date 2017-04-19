/**
 * @file
 * @author ytp <tianping.yan@partner.midea.com.cn>
 * @copyright Midea Co.Ltd 1968-2016
 * @license Released under the Commercial license.
 * @version 16/5/4
 */
define(['ionic'], function() {
    'use strict';

    return [
        '$rootScope',
        '$scope',
        'cService',
        'baseService',
        '$state',
        '$topTip',
        '$location',
        function($rootScope, $scope, cService, baseService, $state, $topTip, $location) {
            $scope.views = {
                title: '',
                level: 1, // 几级选项 1, 2
                select: '', // 两级选项时是否有多选：'radio', 'checkbox'
                isSelectedIndex: -1, // 控制二级选项的显示
                shrinkList: [], // 绑定的数据
                routerBack: function() {
                    baseService.items.set('franchisee', 'shrink', {
                        type: type,
                        data: cache
                    });

                    $rootScope.goBack();
                },
                /**
                 * 权限管理，设备类型的选择
                 * @param index 下标
                 * @param list 选项
                 */
                onSelected: function(index, list) {
                    if (this.select === 'radio') {
                        angular.forEach(this.shrinkList, function (item) {
                            item.checked = false;
                        });
                    }

                    list.checked = !list.checked;
                },
                /**
                 * 下拉
                 * @param index 下标
                 * @param list 选项
                 * @returns {*}
                 */
                onDropDown: function(index, list) {
                    if (list.storeList.length === 0) {
                        return $topTip('该服务主体下没有洗衣房！');
                    }

                    if (this.isSelectedIndex === index) {
                        return this.isSelectedIndex = -1;
                    }

                    return this.isSelectedIndex = index;
                },
                /**
                 * 洗衣房一级选择
                 * @param list 选项
                 * @param event
                 * @returns {*}
                 */
                onSelectedAll: function(list, event) {
                    event.stopPropagation();

                    if (list.storeList.length === 0) {
                        list.checked = false;
                        return $topTip('该服务主体下没有洗衣房！');
                    }

                    angular.forEach(list.storeList, function(item) {
                        if (item.approveStatus == '02') {
                            item.checked = list.checked;
                        }
                    });
                },
                /**
                 * 洗衣房二级选择
                 * @param event
                 * @param list 一级选项
                 * @param item 二级选项
                 * @param select 是否点击的圆圈
                 */
                onSubChoose: function(event, list, item, select) {
                    event && event.stopPropagation();

                    if (item.approveStatus != '02') {
                        return $topTip('该洗衣房正在审核中……');
                    }

                    if (this.select !== 'checkbox') {
                        var flag = item.checked;

                        angular.forEach(this.shrinkList, function(list) {
                            angular.forEach(list.storeList, function(item) {
                                item.checked = false;
                            });
                        });

                        if (select !== undefined) {
                            item.checked = !flag;
                        } else {
                            item.checked = flag;
                        }

                        return;
                    }

                    if (select !== undefined) {
                        item.checked = !item.checked;
                    }

                    list.checked = true;

                    angular.forEach(list.storeList, function(item) {
                        angular.forEach(list.storeList, function(item) {
                            if (item.approveStatus == '02') {
                                if (!item.checked) {
                                    list.checked = false;
                                }
                            } else {
                                list.checked = false;
                            }
                        });
                    });
                },
                // 提交
                onSubmit: function() {
                    var flag = false;

                    if (this.level === 1) {
                        angular.forEach(this.shrinkList, function(item) {
                            if (item.checked) {
                                flag = true;
                            }
                        });
                    } else if (this.level === 2) {
                        angular.forEach(this.shrinkList, function(list) {
                            angular.forEach(list.storeList, function(item) {
                                if (item.checked) {
                                    flag = true;
                                }
                            });
                        });
                    }

                    if (!flag) {
                        return $topTip('请至少选择一项吧！');
                    }
                    //baseService.items.set('franchisee', 'shrink', this.shrinkList);
                    baseService.items.set('franchisee', 'shrink', {
                        type: type,
                        data: $scope.views.shrinkList
                    });
                    $rootScope.goBack();
                }
            };

            var type, cache;
            cService.hasLogin();
            // 获取基础数据：筛选出设备类型
            var getBaseData = function(selected) {
                var baseData = baseService.items.get('franchisee', 'baseData');

                var deviceTypeFormat = {
                    _id: '',
                    shortName: '滚筒机',
                    type: '0xDB'
                };
                if (baseData && baseData.serviceAttr) {
                   $scope.views.shrinkList = baseData.deviceType;

                    return;
                }

                cService.getBaseData().then(function(res) {
                    if (res && res.result === 1 && res.data) {
                        $scope.views.shrinkList = res.data.deviceType;
                        baseService.items.set('franchisee', 'baseData', res.data);
                    } else {
                        $topTip('获取数据失败');
                        $scope.goBack();
                    }
                });
            };

            var init = function() {
                var shrink = baseService.items.get('franchisee', 'shrink');

                if (!shrink || !shrink.type) {
                    $topTip('数据获取异常！');
                    $rootScope.goBack();

                    return;
                }

                type = shrink.type;
                cache = shrink.data;

                switch(type) {
                    case 'rights':
                        $scope.views.title = '权限选择';
                        $scope.views.level = 1;
                        $scope.views.select = 'checkbox';
                        $scope.views.shrinkList = shrink.data;
                        //setRights(shrink.data);
                        break;
                    case 'device':
                        $scope.views.title = '洗衣模式选择';
                        $scope.views.level = 1;
                        $scope.views.select = 'radio';
                        getBaseData(shrink.data);
                        break;
                    case 'store':
                        $scope.views.title = '洗衣房选择';
                        $scope.views.level = 2;
                        $scope.views.select = shrink.select;
                        $scope.views.shrinkList = shrink.data;
                    default:
                        break;
                }
            };
            cService.hasLogin(init);
            //init();

            $scope.$apply();
        }
    ];
});
