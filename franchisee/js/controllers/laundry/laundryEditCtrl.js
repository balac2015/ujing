/**
 * @file 新增服务主体、洗衣店信息
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
        'cFactory',
        '$location',
        '$ionicModal',
        '$topTip',
        '$rootScope',
        'baseService',
        'log',
        '$stateParams',
        '$ionicHistory',
        function($scope, cService, $timeout, cFactory, $location, $ionicModal, $topTip, $rootScope, baseService, log, $stateParams, $ionicHistory) {

            $scope.views = {
                isEdit: false,
                laundryBind: null,
                laundryBindFormat: {
                    title: '', // view 标题
                    attr: '', // 属性类型
                    name: '', // 名称
                    area: '', // 省市区
                    address: '', // 详细地址
                    numLaundry: '', // 计划洗衣房数量
                    numEquipment: '' // 结婚设备数量
                },
                switchList: [], // 属性项目
                switchIndex: -1, // 切换项的 index
                // 主体属性之间的切换
                switchTabs: function(index) {
                    this.switchIndex = index;
                },
                // 创建、保存主体
                updateLaundry: function() {
                    if (this.switchIndex < 0 || this.switchIndex > this.switchList.length) {
                        $topTip('请选择主体属性!');

                        return;
                    }

                    if (!this.laundryBind.name) {
                        $topTip('请输入服务主体名称!');

                        return;
                    }

                    if (this.laundryBind.name.length > 20) {
                        $topTip('服务主体名称字数不能超过20个字符!');

                        return;
                    }

                    if (!this.laundryBind.area) {
                        $topTip('请选择所在地区!');

                        return;
                    }

                    if (!this.laundryBind.address) {
                        $topTip('请输入详细地址!');

                        return;
                    }

                    if (this.laundryBind.address.length > 50) {
                        $topTip('地址长度过长，字数不能超过50个字符');

                        return;
                    }

                    if (!this.laundryBind.numLaundry) {
                        $topTip('请输入计划洗衣房数量！');

                        return;
                    }

                    if (!this.laundryBind.numEquipment) {
                        $topTip('请输入计划设备数量');

                        return;
                    }

                    var laundryBind = this.laundryBind;

                    var option = {
                        name: laundryBind.name, // 主体名称
                        provinceId: areaResult.province._id, // 省ID
                        cityId: areaResult.city._id, // 市ID
                        districtId: areaResult.area._id, // 区域ID
                        address: laundryBind.address, // 地址
                        planStoreNum: laundryBind.numLaundry, // 计划洗衣房数量
                        planDeviceNum: laundryBind.numEquipment // 计划设备数量
                    };

                    if (this.isEdit) {
                        option.serviceAttrId = this.switchList[this.switchIndex]._id;// 服务主体属性ID
                        onCreate(option);
                    } else {
                        option.id = laundryId;
                        option.serviceAttr = this.switchList[this.switchIndex];
                        onUpdate(option);
                    }
                },
                isShowArea: false, // 是否显示地区选择
                // 显示地区选择
                showArea: function() {
                    this.isShowArea = true;
                },
                // 选中地区中的省、市、区
                selectedArea: function(item) {
                    areaResult = item;
                    this.laundryBind.area = item.province.name + item.city.name + item.area.name;
                },
                // 删除服务主体，测试用
                onRemove: function() {
                    cService.removeServiceSubject(laundryId).then(function(res) {
                        if (res && res.result === 1) {
                            $topTip('删除成功！');
                            $rootScope.$emit('laundryUpdate', 'remove');
                            $rootScope.stateGo('laundry');
                        }
                    });
                }
            };
            var areaResult = {};

            // 创建服务主体
            var onCreate = function(options) {
                cService.addServiceSubject(options).then(function(res) {
                    if (res && res.result == 1) {
                        $topTip('创建成功！');
                        $rootScope.$emit('laundryUpdate', 'add');
                        //$rootScope.goBack();
                        $ionicHistory.goBack();
                    }
                });
            };

            // 修改服务主体
            var onUpdate = function(options) {
                cService.updateServiceSubjectInfo(options).then(function(res) {
                    if (res && res.result === 1) {
                        $topTip('修改成功!');
                        $rootScope.$emit('laundryUpdate', 'update');
                        $rootScope.stateGo('laundry');
                    }
                });
            };

            // 获取基础数据
            var getBaseData = function(attr) {
                var baseData = baseService.items.get('franchisee', 'baseData');

                if (baseData && baseData.serviceAttr) {
                    handler(baseData);

                    return;
                }

                cService.getBaseData().then(function(res) {
                    if (res && res.result === 1 && res.data) {
                        handler(res.data);
                        baseService.items.set('franchisee', 'baseData', res.data);
                    } else {
                        $topTip('获取基础数据失败');
                        $scope.goBack();
                    }
                });

                function handler(data) {
                    var i = 0; // 默认选中第一个属性
                    $scope.views.switchList = data.serviceAttr;

                    if (attr) {
                        angular.forEach(data, function(item, index) {
                            if (item._id === attr._id) {
                                i = index;
                            }
                        });
                    }
                    $scope.views.switchIndex = i;
                }
            };

            var laundryId;

            var init = function() {
                var laundryItem = baseService.items.get('laundry', 'item');
                var laundryBind;

                // 新增
                if (!laundryItem) {
                    $scope.views.isEdit = true;
                    areaResult = {
                        province: {},
                        city: {},
                        area: {}
                    };
                    laundryBind = {
                        title: '新增服务主体', // view 标题
                        attr: '', // 属性类型
                        name: '', // 名称
                        area: '', // 省市区
                        address: '', // 详细地址
                        numLaundry: '', // 计划洗衣房数量
                        numEquipment: '' // 结婚设备数量
                    };
                    $scope.views.laundryBind = laundryBind;
                    getBaseData();

                // 修改
                } else {
                    $scope.views.isEdit = false;
                    laundryId = laundryItem._id;
                    areaResult = {
                        province: laundryItem.province,
                        city: laundryItem.city,
                        area: laundryItem.district
                    };
                    laundryBind = {
                        title: laundryItem.name, // view 标题
                        attr: laundryItem.serviceAttrId, // 属性类型
                        name: laundryItem.name, // 名称
                        area: laundryItem.province.name + laundryItem.city.name + laundryItem.district.name, // 省市区
                        address: laundryItem.address, // 详细地址
                        numLaundry: laundryItem.planStoreNum, // 计划洗衣房数量
                        numEquipment: laundryItem.planDeviceNum // 结婚设备数量
                    };
                    $scope.views.laundryBind = laundryBind;
                    getBaseData(laundryItem.serviceAttrId);
                }
            };

            init();

            $scope.$apply();
        }
    ];
});
