/**
 * @file U净底部栏
 * @author yantp <tianping.yan@partner.midea.com.cn>
 * @copyright Midea Co.Ltd 1968-2016
 * @license Released under the Commercial license.
 * @version 16/8/30
 */
define(['ionic'], function() {
    'use strict';

    return [
        '$scope',
        '$rootScope',
        '$location',
        '$ionicHistory',
        'cService',
        function($scope, $rootScope, $location, $ionicHistory, cService) {
            $scope.views = {
                isShowFooter: false,
                activeNav: '',
                footerList: ['home', 'order', 'personal'],
                toggleNav: function(nav) {
                    var pagesSwitch = function() {
                        $scope.views.activeNav = nav;
                        $rootScope.jump(nav, urlParam[nav]);
                    };

                    $ionicHistory.nextViewOptions({
                        disableAnimate: true,
                        disableBack: true
                    });

                    if (nav === 'order') {
                        return cService.userInfo(pagesSwitch);
                    } else {
                        return pagesSwitch();
                    }
                }
            };

            var urlParam = {};

            var init = function() {

                var hasFooterRouter = ['home', 'order', 'personal', 'scanHome', 'oneWashHome'],
                    locationRouter = $location.path().slice(1),
                    locationParam = $location.search();

                if (hasFooterRouter.indexOf(locationRouter) !== -1) {
                    if (locationRouter === 'home' || locationRouter === 'scanHome' || locationRouter === 'oneWashHome') {
                        $scope.views.footerList[0] = locationRouter;
                    }

                    if (!urlParam[locationRouter]) {
                        urlParam[locationRouter] = locationParam;
                    }

                    $scope.views.activeNav = locationRouter;

                    if (locationRouter === 'oneWashHome') {
                        $scope.views.isShowFooter = false;
                    } else {
                        $scope.views.isShowFooter = true;
                    }
                } else {
                    $scope.views.isShowFooter = false;
                }
            };

            init();

            // 只对首次登录页作监听
            $rootScope.$on('isWashShowFooter', function() {
                var id = localStorage.getItem('storeId');
                $scope.views.isShowFooter = (!!id && id !== 'undefined') ? false : true;
            });

            // 观察路由的变化
            $rootScope.$on('$stateChangeSuccess', function(event, toState) {
                init();
            });
            $scope.$apply();
        }
    ];
});
