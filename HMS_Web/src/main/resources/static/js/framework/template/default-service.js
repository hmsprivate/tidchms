define(["app"], function(app) {
    app.service("defaultService", ["$rootScope", "$http", function($http, $rootScope) {
		"use strict";
        
		// property
		var self = this;

		// method


		// event-handler


		// function
		function initialize() {    

		}
		
		function getData(url, parameter) {
			var promise = new Promise(function(resolve, reject) {
				$http({
					method : "POST",
					url : url,
					data : JSON.stringify(parameter),
					headers : {
						"Content-Type" : "application/json"
					}
				}).then(function(data, status, headers, config) {
					resolve(data.data);
				}, function(data, status, headers, config) {
					reject(status);
				});
			});
			return promise;
		}
        
		initialize();
	}]);
});