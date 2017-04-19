/**
 * @file xxx
 * @author <liping.ye@midea.com.cn>
 * @copyright Midea Co.Ltd 1968-2015
 * @license Released under the Commercial license.
 * @since 1.0.1
 * @version 1.0.2 - 2016/6/29
 */
define(['angular', 'js/services'], function(angular) {
    'use strict';

    /* Filters */
    angular.module('cApp.filters', ['cApp.services'])

        /**
         *  保留6位小数点
         */
        .filter('keepSixPointNumber', function() {
            return function(num) {
                var number = '';
                if (num) {
                    number = num + '';
                    if (number.indexOf('.') !== -1) {
                        return number.substring(0, number.indexOf('.')+7);
                    }

                    return num;
                }
            };
        })
        /**
         * 营业时间过滤器，'12 12' 形式转为 '12:12' 形式
         */
        .filter('timeShop', function() {
            var result = [];

            return function(str) {
                if (!str) {
                    return '00:00';
                }

                result = str.split(' ');

                for (var i = result.length; i > 0; i -= 1) {
                    if (result[i - 1] < 10) {
                        result[i - 1] = '0' + parseInt(result[i - 1]);
                    }
                }

                return result.join(':');
            };
        })
        .filter('timeLag', function() {
            /**
             * 时间差：当前时间减去传入参数的时间
             * @params time 出入的时间
             * @params type
             */
            return function(time, type) {
                var num = 3600000;

                return Math.round((new Date() - new Date(time)) / num);
            };
        })
        .filter('timeDiff', function() {
            /**
             * 时间差：当前时间减去传入参数的时间
             * @params time 出入的时间
             * @params type
             */
            return function(time) {
                var s = 60 * 60 * 1000, // ms -> h
                    diff = new Date().getTime() - new Date(time).getTime();

                return parseFloat(diff / s).toFixed(2);
            };
        })
        // 设备状态
        .filter('deviceStatus', function() {
            return function(status) {
                var result = {
                    '0': '空闲',
                    '1': '工作',
                    '2': '故障',
                    '3': '停用',
                    '4': '离线'
                };

                return result[status] || '';
            };
        })
        .filter('formattime', function() {
            return function(data) {
                if (!data) {
                    return;
                }
                var endTime = null,
                    startTime = null,
                    timeStr = '';
                var formattingVal = function(x) {
                    return x > 10 ? x + '' : '0' + x;
                };

                endTime = new Date(data);
                timeStr = endTime.getFullYear() + formattingVal(endTime.getMonth()) + ' ' + formattingVal(endTime.getHours()) + ':' + formattingVal(endTime.getMinutes());

                return timeStr;
            }
        })
        // 小数点截取前两位
        .filter('digital', function() {
            return function(num) {
                return num ? parseInt(num * 100) / 100 : 0;
            }
        })
        /**
         * 订单接口的 status 值过滤
         */
        .filter('orderStatus', function() {
            return function(str, params) {
                var flag = params && params.indexOf('烘') >= 0 ? true : false;

                var status = {
                    '10': '预订',
                    '20': '支付成功',  // 支付成功
                    '30': '自洁中',
                    '35': '待启动',
                    '40': flag ? '烘衣中' : '洗涤中',
                    '50': flag ? '烘衣完成' : '洗涤完成', // 洗涤正常完成
                    '51': '支付超时', // 预订超时结束订单
                    '52': '启动超时', // 设备启动超时结束订单
                    '53': '取消订单', // 用户取消结束订单
                    '54': '故障', // 不可处理故障结束订单
                    '60': '故障', // 故障中(可处理故障)
                    '61': '故障', //自洁中故障
                    '62': '故障', // 自洁正常完成后故障
                    '63': '故障', // flag ? '烘衣故障' : '洗涤故障', //洗涤中故障
                    '64': '故障', // 预约中故障
                    '70': '设备离线', // 洗涤中故障
                    '7010': '设备离线',  // 预订阶段离线
                    '7020': '设备离线' //启动阶段离线
                    // TODO: 7030, 7035, 7040, 7050
                };

                return status['' + str] || '';
            };
        });
});
