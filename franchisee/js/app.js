/**
 * Created by Administrator on 2014/11/21.
 */
/* global console */
define([
    'angular',
    'js/services',
    'lib/js/main/controllers',
    'lib/js/main/directives',
    'lib/js/main/appControllers',
    'angular_animate',
    'angular_ui_router',
    'js/directives',
    'ionic_angular',
    'angular_sanitize',
    'lib/js/main/ios9BrowserPatch',
    'daggerSearch',
    'daggerLoading',
    'js/filters'
], function(angular) {
    'use strict';

    // Declare app level module which depends on filters, and services
    return angular.module('cApp', [
        'mApp.controllers',
        'mApp.directives',
        'cApp.services',
        'cApp.directives',
        'cApp.controllers',
        'ngAnimate',
        'ui.router',
        'ionic',
        'ngSanitize',
        'ngIOS9UIWebViewPatch',
        'dagger',
        'dagger-loading-bar',
        'cApp.filters'
    ], function() {
        console.log('Enter cApp');
    });
});
