/**
 * @file 定价
 * @author ytp <tianping.yan@partner.midea.com.cn>
 * @copyright Midea Co.Ltd 1968-2016
 * @license Released under the Commercial license.
 * @version 16/5/4
 */
define(['ionic'], function() {
    'use strict';

    return [
        '$scope',
        '$rootScope',
        'cService',
        '$timeout',
        '$topTip',
        'cFactory',
        '$ionicScrollDelegate',
        '$filter',
        'baseService',
        function($scope, $rootScope, cService, $timeout, $topTip, cFactory, $ionicScrollDelegate, $filter, baseService ) {
            $scope.views = {
                isRequest: false,
                isHandler: true,
                isShowPrice: false,
                handlerText: '确定',
                storeName: '',
                showDeviceTypeId: '',
                laundryList: [],
                deviceType: [],
                isSelectedIndex: -1,
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
                onHandler: function() {
                    if (this.isShowPrice) {
                        this.isShowPrice = false;
                        this.isSelectedIndex = 0;
                        this.handlerText = '确定';
                        storeIds = [];

                        return;
                    }

                    var name = '';

                    angular.forEach(this.laundryList, function(list) {
                        angular.forEach(list.storeList, function(item) {
                            if (item.checked) {
                                name += ',' + item.name;
                                storeIds.push(item._id);
                            }
                        });
                    });

                    if (storeIds.length === 0) {
                        return $topTip('请先选择洗衣房，再进行定价！');
                    }

                    if (storeIds.length === 1) {
                        getWashPrice(storeIds[0]);
                    } else {
                        this.deviceWashModel = localDeviceWashModel;
                    }
                    this.storeName = name.slice(1);
                    this.isSelectedIndex = -1;
                    this.isShowPrice = true;
                    this.handlerText = '取消';
                },
                selectPriceTab: function(id) {
                    this.showDeviceTypeId = id;
                },
                priceSubmit: function() {
                    var data = this.deviceWashModel;
                    var result = [];
                    var flag = false;

                    for (var i = 0, l = data.length; i < l; i++) {
                        if (!data[i].washPrice) {
                            this.selectPriceTab(data[i].deviceTypeId._id);

                            return $topTip(data[i].deviceTypeId.shortName + data[i].workmodel + '不能为空!');
                        }

                        if (data[i].washPrice <= data[i].promotionPrice) {
                            return $topTip(data[i].deviceTypeId.shortName + data[i].workmodel + '促销价格应小于洗衣价格!');
                        }

                        if (!data[i].promotionPrice) {
                            data[i].promotionPrice = 0;
                            flag = true;
                        }

                        result.push({
                            deviceTypeId: data[i].deviceTypeId._id,
                            deviceWashModelId: data[i]._id,
                            washPrice: data[i].washPrice,
                            promotionPrice: data[i].promotionPrice || 0
                        });
                    }

                    if (flag) {
                        cFactory.confirm('没有完整填写促销价格，确定提交定价？？').then(function(res) {
                            setWashPrice({
                                storeArray: storeIds, // 洗衣房 id 数组
                                priceArray: result // 洗涤程序价格数组
                            });
                        });
                    } else {
                        if (!this.startSelected) {
                            return $topTip('请选择促销开始时间！');
                        }
                        if (!this.endSelected) {
                            return $topTip('请选择促销结束时间！');
                        }
                        setWashPrice({
                            storeArray: storeIds, // 洗衣房 id 数组
                            priceArray: result, // 洗涤程序价格数组
                            promotionStartTime: $scope.views.startSelected,
                            promotionEndTime: $scope.views.endSelected
                        });
                    }
                },

                isShowMask: false,
                startDatePicker: false,
                startDate: 0,
                startDefault: $filter('date')(new Date(), 'yyyy/MM/dd'),
                startSelected: '', // 促销开始时间
                endDatePicker: false,
                endDate: 0,
                endDefault: $filter('date')(new Date(), 'yyyy/MM/dd'),
                endSelected: '', // 促销结束时间
                // 显示时间选择
                showMask: function() {
                    if (this.isShowMask) {
                        this.closeDatePicker();
                    } else {
                        this.isShowMask = true;
                    }
                },
                // 关闭时间选择
                closeMash: function() {
                    this.closeDatePicker();
                },
                /**
                 * 选择开始时间、结束时间
                 * @param time {String} 'start' 或 'end'
                 */
                chooseDatePicker: function(time) {
                    console.log( time );
                    this.startDatePicker = false;
                    this.endDatePicker = false;
                    dateType = time;

                    if (this.isShowMask) {
                        this.closeDatePicker();
                    } else {
                        this.isShowMask = true;
                    }

                    dateSelected = this[time + 'Selected'];
                    this[time + 'DatePicker'] = true;
                },
                /**
                 * 时间选择点击确定、取消
                 * @param handler {String} 'cancel' 或 'sure'
                 */
                closeDatePicker: function(handler) {
                    var self = this;
                    var close = function() {
                        self.isShowMask = false;
                        self.startDatePicker = false;
                        self.endDatePicker = false;
                    };
                    close();

                    if (!handler || handler === 'cancel') {
                        this[dateType + 'Selected'] = dateSelected;

                        return;
                    }

                    if (handler === 'sure') {
                        if (!this.startSelected || !this.endSelected) {
                            this[dateType + 'Selected'] = this[dateType + 'Default'];

                            return;
                        }

                        if (this.startSelected > this.endSelected) {
                            this[dateType + 'Selected'] = dateSelected;
                            $topTip('开始时间不能大于结束时间！');

                            return;
                        }
                    }
                },
                // 点击后退的处理
                onCancel: function() {
                    if (this.handlerText === '取消') {
                        cFactory.alert('正在定价中，确定要退出？').then(function() {
                            $rootScope.exit();
                        })
                    } else {
                        $rootScope.exit();
                    }
                }
            };

            var storeIds = [],
                localDeviceWashModel = [],
                dateSelected, dateType; // 日期选择相关

            $scope.$watch('views.startDate', function(newVal) {
                if (newVal) {
                    var timeArr = newVal.split('-');
                    var selected = timeArr[0] + '-' + timeArr[1] + '-' + timeArr[2];
                    $scope.views.startSelected = selected;
                }
            });
            $scope.$watch('views.endDate', function(newVal) {
                if (newVal) {
                    var timeArr = newVal.split('-');
                    var selected = timeArr[0] + '-' + timeArr[1] + '-' + timeArr[2];
                    $scope.views.endSelected = selected;
                }
            });

            // 遍历接口数据，配置表单字段
            var traverPrice = function(deviceType, deviceWashModel) {
                $scope.views.deviceType = deviceType;
                localDeviceWashModel = deviceWashModel;
                $scope.views.deviceWashModel = deviceWashModel;
                $scope.views.showDeviceTypeId = deviceType[0]._id;

                return;

                var baseData = [];
                var isSingle = isHasPriceSingle; // 单个定价是否有过定价

                angular.forEach(typeList, function(list, index) {
                    angular.forEach(modelList, function(item) {
                        if (!baseData[index]) {
                            baseData[index] = {
                                _id: list._id,
                                _v: list.__v,
                                shortName: list.shortName,
                                type: list.type,
                                storeId: ids,
                                washModel: []
                            };
                        }

                        if (baseData[index] && list._id === item.deviceTypeId._id) {
                            baseData[index].washModel.push({
                                _id: isSingle ? item.deviceWashModelId._id : item._id,
                                _v: isSingle ? item.deviceWashModelId.__v : item.__v,
                                command: isSingle ? item.deviceWashModelId.command : item.command,
                                description: isSingle ? item.deviceWashModelId.description : item.description,
                                icon: isSingle ? item.deviceWashModelId.icon : item.icon,
                                time: isSingle ? item.deviceWashModelId.time : item.time,
                                workmodel: isSingle ? item.deviceWashModelId.workmodel : item.workmodel,

                                washPrice: isSingle ? item.washPrice : item.basePrice,
                                //promotionPrice: isSingle ? item.promotionPrice : undefined,
                                promotionPrice: isSingle && item.promotionPrice > 0 ? item.promotionPrice : undefined,
                                promotionStartTime: isSingle ? item.promotionStartTime : undefined,
                                promotionEndTime: isSingle ? item.promotionEndTime : undefined
                            });
                        }
                    });
                });
                $scope.views.baseData = baseData;
            };

            // 设置洗衣房洗衣程序价格
            var setWashPrice = function(params) {
                params.storeArray = JSON.stringify(params.storeArray);
                params.priceArray = JSON.stringify(params.priceArray);

                cService.setWashPrice(params).then(function(res) {
                    if (res && res.result === 1) {
                        $topTip('定价成功！！！');
                    } else {
                        $topTip('定价失败！！！');
                    }
                });
            };

            // 获取单个洗衣房洗衣程序价格
            var getWashPrice = function(id) {
                cService.getWashPrice({
                    id: id
                }).then(function(res) {
                    if (res && res.result === 1 && res.data.length > 0) {
                        $scope.views.deviceWashModel = res.data;

                        if (res.data[0].promotionPrice > 0) {
                            $scope.views.startSelected = $filter('date')(res.data[0].promotionStartTime || new Date(), 'yyyy/MM/dd');
                            $scope.views.endSelected = $filter('date')(res.data[0].promotionEndTime || new Date(), 'yyyy/MM/dd');
                        }
                    }
                });
            };
            // 获取基础数据：筛选出设备类型
            var getBaseData = function() {
                var baseData = baseService.items.get('franchisee', 'baseData');

                if (baseData) {
                    return traverPrice(baseData.deviceType, baseData.deviceWashModel);
                }

                cService.getBaseData().then(function(res) {
                    if (res && res.result === 1 && res.data) {
                        return traverPrice(res.data.deviceType, res.data.deviceWashModel);
                        baseService.items.set('franchisee', 'baseData', res.data);
                    } else {
                        $topTip('获取基础数据失败！');
                    }
                });
            };

            // 获取所有洗衣房
            var getAllStore = function() {
                var allStoreList = baseService.items.get('franchisee', 'getAllStore');

                if (allStoreList) {
                    $scope.views.isRequest = true;
                    $scope.views.laundryList = allStoreList;
                    $timeout(getBaseData, 1000); // 推迟执行
                    return;
                }

                cService.getAllStore().then(function(res) {
                    $scope.views.isRequest = true;
                    if (res && res.result === 1 && res.data.length > 0) {
                        $scope.views.laundryList = res.data;
                        baseService.items.set('franchisee', 'getAllStore', res.data);
                        $timeout(getBaseData, 1000); // 推迟执行
                    }
                });
            };

            // 确保有登陆
            cService.hasLogin(getAllStore);
            //getAllStore();

            $scope.$apply();
        }
    ];
});
