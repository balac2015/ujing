/**
 * @file PC调试获取cookie
 * @author <liping.ye@midea.com.cn>
 * @copyright Midea Co.Ltd 1968-2015
 * @license Released under the Commercial license.
 * @since 1.0.1
 * @version 1.0.2 - 2016/8/18
 */
define(['ionic'], function() {
    'use strict';

    return [
        '$scope',
        'cService',
        '$topTip',
        function($scope, cService, $topTip) {
            $scope.views = {
                mobile: '18617051881', // 手机号码
                verifyCode: null, // 验证码
                /*
                 * 获取验证码
                 * */
                getVerifyCode: function() {
                    var params = {
                        mobile: this.mobile
                    };
                    cService.getVerifyCode(params).then(function(res) {
                        console.log(res);
                        if (res && res.result === 1) {
                            $topTip('验证码已发送到手机');
                        } else {
                            $topTip('验证码发送失败');
                        }
                    });
                },
                /*
                 * 登录
                 * 说明 请求必须是http请求才能访问 set-cookie值，
                 * 所以平时测试，直接在network中粘贴出来调试
                 * */
                login: function() {
                    var params = {
                        mobile: this.mobile,
                        verifyCode: this.verifyCode
                    };
                    $.ajax({
                        url: 'http://121.41.34.175:4000/user/login',
                        type:'POST',
                        data: params,
                        success: function(res, status, xhr){
                            // console.log(res);
                            console.log('*******######');
                            console.log(xhr.getResponseHeader('Set-Cookie'));
                        },
                        beforeSend: function(req){
                            req.setRequestHeader('cke', 'session=M_IyClA2CyOe_waeXX16Ow.nluljQ0gt6n_m25QlRpZ7g47FMIwxZyneOQrzqYxikMfkRGo8lAlGF2AompYUeOrXbCTfZqNS0AL_-VQIG2fF5R5-n2z0KOPaYrK3J0rfUzNaudxzz8g8fMra3rS7SwoiJBiUxeRMD66NsxKuqTrpoBA5ectqNLJQVcEyZ76iK4ZZnDdFfTr9jdAeoT43ArQm4CUVwR6MmSiRpPOvigkpcHJJ_RrmnnkTTePdQDtJE53cwedarhHu4TCq2sH7sUyIXi_nxPX0QTh8OjB0sKhZUyZCr2DHAIrrNA3n2ovXivDlWmq3d-edq2QxB8BTKqHX6qbLzPwT2XpnNelCUsvhBCboPoLSVv9--T6RpeXe3Nzy7I3n2w8Gq-tOq7J2OSL.1470913989934.604800000.rOGmkN869pw78kL45VUzhK4q9wJBXCG4eJ-pK1_pzto')
                        }
                    })
                },
                /*
                * 初始化测试
                * */
                init: function() {
                    var loginInfo = {
                        cookie: 'session=UDmOuoXHmCC5-CYiImPsKA.FE5Hz7hUvrHU4t_D25Y61QPKSNzIYgtWQngRMtcMLp_cpOTXiyHMZwEhtCHCTc6RLjpqNEWx9FLh7Lx_tdWuZ1IkOnjJcIGMsbEWpl86UGWzjiPAuimXFXlG-zUfCa0b-OEbZbEgUH1q-UZZpbNPuZSDjmQfZ36JtJDZB86rmjCwROpVYboi65ALuHI53lBOh_WgDk9TBHTriQSevtqVXw.1476153015586.604800000.tySk_jVfmKMa_M_88441eNkmB9_kKCJrMaHqWA---_k',
                        mobile: '18617051881', // 手机号
                        // isLogin: true, // 是否登录
                        id: '57b6dc6d8236bd7b6222b0f2',
                        nickname: '豆瓣', // 昵称
                        portrait: '/upload/1471860332987.jpg', // 头像
                        hasNewMessage: true // 是否含有信息未读接口
                    };
                    // PC测试保存测试值
                    window.localStorage.setItem('loginInfo', JSON.stringify(loginInfo));
                },
                setCookie: function(){
                    var loginInfo = {
                        cookie: this.cookie,
                        mobile: '18617051881', // 手机号
                        nickname: '豆瓣', // 昵称
                        portrait: '/upload/1471860332987.jpg', // 头像
                        hasNewMessage: false // 是否含有信息未读接口
                    };
                    // PC测试保存测试值
                    window.localStorage.setItem('loginInfo', JSON.stringify(loginInfo));
                }
            };
            $scope.views.init();
            $scope.$apply();
        }
    ];
});