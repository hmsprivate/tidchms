require.config({
	baseUrl:"/js",
	paths: {
		"angular-bind-html-compile": "lib/angular/angular-bind-html-compile.min",
		"angular-tooltips": "lib/angular/angular-tooltips.min",
		"pagination": "lib/angular/pagination",
        "jquery-blockUI": "lib/jquery/jquery.blockUI",
        "jquery-layout": "lib/jquery/jquery.layout",
        "jquery-mdi": "lib/jquery/jquery.mdi",
        "jquery-dashboard": "lib/jquery/jquery.dashboard",
        "ng-dialog": "lib/ngdialog/ngDialog",
		"qunee": "lib/qunee/qunee-min",
		"qunee-common": "lib/qunee/qunee-common",
		//"highcharts": "lib/highcharts/highcharts.min",
		//"highcharts-legend": "lib/highcharts/highchart-legend.min",
        "http-interceptor-factory": "framework/factory/http-interceptor-factory",
        "dependency-resolver-factory": "framework/factory/dependency-resolver-factory",
        "exception-factory": "framework/factory/exception-factory",
        "config-manager-provider": "framework/provider/config-manager-provider",
        "window-reload-detect-provider": "framework/provider/window-reload-detect-provider",
        "html-filter": "framework/filter/html-filter",
        "header-controller": "apps/common/header-controller",
        "common-directive": "apps/common/common-directive",
        "route-config": "apps/route",
        "app": "apps/app"
	},
	shim: {
        "jquery-mdi": {
            deps: ["jquery-layout"]
        },
        "jquery-dashboard": {
        	deps: ["jquery-layout"]
        },
		"qunee-common": {
			deps: ["qunee"]
		},
		/*"highcharts-legend": {
			deps: ["highcharts"]
		},*/
        "app": {
        	deps: ["jquery-blockUI", "jquery-layout"]
        }
	}
});

require(["app"], function(app) {
    $(document).ready(function() {
		app.initialize();
    });
});