define([], function() {
	return function($scope, $location, $route, $interval) {
		"use strict";

		// property
		var headerCtrl = this;
		
		headerCtrl.currentPage = "mdi";
		
		// method
		headerCtrl.navigate = function(url) {
            console.log("NAVIGATE TO", url);
            $location.path(url);
		};
		
		headerCtrl.reload = function(url) {
			if(window.location.pathname + window.location.hash  == url) {
				$route.reload();
			} else {
				window.location = url;
			}
		}
		
		// event-handler
		

		// function
		function initialize() {
		}
		
		initialize();
	};
});