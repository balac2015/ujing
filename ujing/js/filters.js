/**
 * @file U净 过滤器
 * @author ytp <tianping.yan@partner.midea.com.cn>
 * @copyright Midea Co.Ltd 1968-2016
 * @license Released under the Commercial license.
 * @version 16/4/21
 */
define(['angular', 'js/services'], function(angular) {
    'use strict';

    /* Filters */
    angular.module('cApp.filters', ['cApp.services'])
        /**
         * 格式化距离，1000米以下显示m，千米以上显示km
         */
        .filter('formatDistance', function() {
            return function(distance) {
                return (!distance ? '0.00' : (distance).toFixed(2)) + ' km';
            };
        })
        /**
         * 洗衣机订单状态值
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
        })
        /**
         * 秒 298 转换为 00:00 形式
         */
        .filter('countdown', function() {
            return function(time) {
     /*           if (!Number(time, split)) {
                    return '00:00';
                }*/
                var time = !time ? 0 : time, // 以秒为单位的时间
                    spit = !spit ? ':' : spit; // 分隔符，默认 :

                var h = parseInt(time / 3600),
                    min = parseInt(time % 3600 / 60),
                    s = parseInt(time % 3600 % 60);

                var bits = function(num) {
                    return num >= 10 ? num : '0' + (!num ? 0 : num);
                };

                return h <= 0 ? bits(min) + spit + bits(s) : bits(h) + spit + bits(min) + spit + bits(s);

        /*        var m = Math.floor(time / 60),
                    s = time % 60;
                var toDouble = function(num) {
                    return num >= 0 && num < 10 ? '0' + num : num;
                };

                return toDouble(m) + ':' + toDouble(s);*/
            };
        })
        /**
         * 优惠券类型
         */
        .filter('couponType', function() {
            return function(str) {
                var type = {
                    '1': '首单免', // 首次注册券
                    '2': '折扣券', // 打折
                    '3': '金额券' // 金额
                };

                return type['' + str] || '';
            };
        })
        .filter('messageType', function() {
            return function(type, handler) {
                // 有 handler 存在对消息类型的处理方式
                var tips = {
                    '0': '消息',
                    '10': '阅读全文',
                    '20': '查看优惠券', // 券类消息
                    '30': '查看该订单', // 订单相关消息
                    '31': '预订洗衣机', // 空闲机
                    '32': '订单完成分享券',
                    '40': '去处理' // 设备消息 type: 40
                };

                var tip = {
                    '0': '消息',
                    '10': '活动消息',
                    '20': '优惠券提醒', // 券类消息
                    '30': '订单提醒', // 订单相关消息
                    '31': '空闲提醒', // 空闲机
                    '32': '订单完成分享券',
                    '40': '故障提醒' // 设备消息 type: 40
                };

                return handler ? (tips['' + type] || '') : (tip['' + type] || '');
            };
        })
        .filter('currencyNumber', function() {
            return function(num) {
                //console.log(num);
                //var num = num.toString().replace('$', '');

                return '' + (!num ? 0 : parseFloat(num)).toFixed( 2);
                //return '￥' + (!num ? 0 : parseFloat(num)).toFixed( 2);

                //return !num ? '' : (num + '').indexOf('$') === -1 ? '￥' + num : '￥' + num.replace('$', '');
            };
        })
        .filter('formatNum', function() {
            return function(number) {
                //if (number) {
                //    number = number + '';
                //
                //    return number.indexOf('$') === -1 ? '￥' + number : '￥' + number.replace('$', '');
                //}

                return !number ? '' : (number + '').indexOf('$') === -1 ? '￥' + number : '￥' + number.replace('$', '');
            };
        });
});
