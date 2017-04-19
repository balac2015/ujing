/**
 * Created  by Administrator on 14-12-29.
 */
define(['ionic'], function() {
    'use strict';

    return [
        '$scope',
        'cService',
        'baseService',
        '$filter',
        '$topTip',
        '$location',
        function($scope, cService, baseService, $filter, $topTip, $location) {

            $scope.views = {
                endDate: 0,
                endSelected: $filter('date')(new Date(), 'yyyy-MM-dd'), // 结束选择时间
                isShowDatePick: false,
                onDateRick: function() {
                    this.isShowDatePick = true;
                },

                userLogin: function() {
                    var params = {
                        //mobile: '15015566370',
                        mobile: '18617051881',
                        password: '123456'
                        //password: '111111a'
                    };
                    cService.userLogin(params).then(function(res) {
                        console.log( res );
                        if (res && res.result == 1) {
                            userData = res.data;
                        }
                    });
                },
                cookie: '',
                setCookie: function() {
                    if (!userData) {
                        $topTip('點擊登陸 ');

                        return;
                    }

                    if (!this.cookie) {
                        $topTip('添加 cookie ');

                        return;
                    }

                    userData.cookie = this.cookie;
                    window.CONFIGURATION.com.midea.cookie = this.cookie;

                    localStorage.setItem('userFranchisee', JSON.stringify(userData));
                }
            };
            var userData;

            if (window.CONFIGURATION.com.midea.isPcTest) {
                //$scope.views.userLogin();
            }

            $scope.$apply();
        }
    ];
});