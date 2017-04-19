/**
 * @file 常见问题
 * @author ytp <tianping.yan@partner.midea.com.cn>
 * @copyright Midea Co.Ltd 1968-2016
 * @license Released under the Commercial license.
 * @version 16/7/21
 */
define(['ionic'], function() {
    'use strict';

    return [
        '$scope',
        'cService',
        '$topTip',
        function($scope, cService, $topTip) {
            $scope.views = {
                questionList: null, // 问题列表
                showIndex: null, // 展示索引
                /*
                 * 查看问题
                 * */
                showList: function(index) {
                    if (this.showIndex === index) {
                        this.showIndex = '';
                    } else {
                        this.showIndex = index;
                    }
                }
            };
            // 获取问题列表
            var getHelpList = function() {
                $scope.views.questionList = [
                    {
                        question: '1.如何绑定设备？',
                        answer: '<p>第一步：注册加盟商账号，下载U净App</p><p>第二步：设置服务主体，建立洗衣房</p><p>第三步：设备栏，点击右上角【+新设备】，扫机器前身码，填写相应的信息，配网成功，最后扫描机器的顶盖码，完成绑定</p>'
                    },
                    {
                        question: '2.如何设置定位？',
                        answer: '<p>手机打开定位设置，U净公众号允许提供位置信息，建立洗衣房时点击获取地址位置即可</p>'
                    },
                    {
                        question: '3.设备离线怎么办？',
                        answer: '<p>第一步：检查机器是否通电</p><p>第二步：检查机器屏显是否显示WIFI图标</p><p>第三步：如以上正常，等待机器自动上线</p>'
                    },
                    {
                        question: '4.洗衣房位置如何选择?',
                        answer: '<p>1)事先现场勘察洗衣房所在位置的信号强度，哪个运营商的信号强度高且稳定</p><p>2)洗衣房不要过于封闭，不要选址在高层建筑物当中</p><p>3)联系相应运营商咨询布线和网络开通问题</p>'
                    },
                    {
                        question: '5.洗衣机无法启动？',
                        answer: '<p>第一步：确认机器是否通电和进水</p><p>第二步：订单管理查看订单，是否点击了启动</p><p>第三步：如以上正常，机器未启动，请联系管理员</p>'
                    },
                    {
                        question: '6.扫码无服务列表怎么办？',
                        answer: '<p>第一步：检查机器是否通电</p><p>第二步：查看机器屏显是否显示E系列字段</p><p>第三步：如以上正常，机器仍不能使用，请联系管理员</p>'
                    }
                ];
                /*
                 var that = this;

                 cService.getHelpList().then(function(res) {
                 if (res && res.result === 1) {
                 that.questionList = res.data;
                 } else {
                 $topTip('服务器繁忙~~');
                 }
                 }, function() {
                 $topTip('服务器繁忙~~');
                 });
                 */
            };
            cService.hasLogin(getHelpList);

            $scope.$apply();
        }
    ];
});
