define(["http-interceptor-factory", "exception-factory", "html-filter",
        "route-config",
        "dependency-resolver-factory",
        "config-manager-provider",
        "window-reload-detect-provider",
        "apps/common/header-controller",
        "apps/common/data-service",
        "apps/popup/popup-factory",
        "angular-tooltips",
        "pagination",
        "qunee",
        "qunee-common",
        "ng-dialog"
        //"highcharts"
    ],
    function(httpInterceptorFactory, exceptionFactory, htmlFilter, routeConfig, dependencyResolverFactory, configManagerProvider, windowReloadDetectProvider, headerController, dataService, popupFactory) {
        "use strict";

        var app = angular.module("app", ["ngRoute", "ngCookies", "ngMessages", "ngAria", "pascalprecht.translate", "ui.grid", "ui.grid.treeView", "ui.grid.selection", "720kb.tooltips", "vs-repeat", "ui.bootstrap", "ngDialog"])
	        .factory("HttpInterceptor", ["$q", httpInterceptorFactory])
	        .factory("PopupSearch", ["ngDialog", "$translate", "$rootScope", popupFactory])
	        .provider("ConfigManager", [configManagerProvider])
	        .provider("WindowReloadDetect", [windowReloadDetectProvider])
	        .filter("html", ["$sce", htmlFilter])
	        .controller("HeaderCtrl", ["$scope", "$location", "$route", headerController])
        	.service("DataService", ["$rootScope", "$http", dataService]);

        app.initialize = initialize;

        // angularjs 초기화 이전에 필요한 데이터를 초기화
        var _resources = {};

        function initializeResource() {
            var $injector = angular.injector(["ng"]);
            var $q = $injector.get('$q');
            var $http = $injector.get('$http');
            var deferred = $q.defer();
            var urls = {
                constant: $http.get("/constant/" + location.hostname + ".json"),
                timeoffset: $http.get("/service/time/timeoffset.json?clientDateTime=" + moment().local().format("YYYY-MM-DD HH:mm:ss")),
                user:$http.get("/session-info")
            };

            $q.all(urls).then(function(results) {
                _resources.constant = results.constant.data;
                _resources.timeoffset = results.timeoffset.data.data;
                _resources.user = results.user.data.data;
                
                // 1초 정도 차이가 나면 의미가 있다고 판단하여 시간을 보정한다
                if (Math.abs(_resources.timeoffset) > 1000) {
					moment.now = () => {
						_resources.timeoffset + Date.now();
					}
				}
                
                deferred.resolve(_resources);
            });

            return deferred.promise;
        }

        function config($routeProvider, $locationProvider, $controllerProvider, $httpProvider, $compileProvider, $filterProvider, $provide, $translateProvider, ConfigManagerProvider) {
            app.controller = $controllerProvider.register;
            app.directive = $compileProvider.directive;
            app.filter = $filterProvider.register;
            app.factory = $provide.factory;
            app.service = $provide.service;

            $httpProvider.interceptors.push("HttpInterceptor");

            $provide.decorator("$exceptionHandler", exceptionFactory);

            $translateProvider.useStaticFilesLoader({
                prefix: "/message/",
                suffix: ".json"
            });
            $translateProvider.preferredLanguage("ko_KR");

            ConfigManagerProvider.initialize(_resources.constant, _resources.user);
            console.debug("INIT-CONST TEST CODE:" + ConfigManagerProvider.get("TEST.MSG"));
            console.debug("INIT-USER:" + ConfigManagerProvider.getUser());
            
            if (routeConfig.routes) {
                angular.forEach(routeConfig.routes, function(route, path) {
                    $routeProvider.when(path, {
                        templateUrl: route.templateUrl,
                        resolve: dependencyResolverFactory(route.dependencies)
                    });
                });
            }
            if (routeConfig.defaultRoutePath) {
                $routeProvider.otherwise({
                    redirectTo: routeConfig.defaultRoutePath
                });
            }

            // performance-option
            $httpProvider.useApplyAsync(true);
        }

        function initialize() {
            initializeResource().then(function() {
                app.run(function() {
                	$("body").show();
                	
                   /* $("#container").layout({
                        gap: "0px",
                        debug:false,
                        excludes: ["indicator", "blockUI", "overlay", "ui-resizable-helper"]
                    });
                    
                    gnb();*/
                });

                app.config(config);
                angular.bootstrap(document, ["app"]);
            });
        }

        return app;
    });