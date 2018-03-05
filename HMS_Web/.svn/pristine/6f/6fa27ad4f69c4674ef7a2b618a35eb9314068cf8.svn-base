angular.module("app", []).controller("IndexCtrl", ["$scope", "$http", function($scope, $http) {
	"use strict";

	// property
	var indexCtrl = this;
	indexCtrl.user = {
		username:"admin",
		password: "admin"
	}

	// method
	indexCtrl.login = function() {
		$http({
			method: "POST",
			url: "/login",
			data: JSON.stringify(indexCtrl.user),
			headers: {
				"Content-Type": "application/json"
			}
		}).then(function(data) {
			var result = data.data;
			if (result.result == 1) {
				window.location = "hms";
			} else {
				alert(result.errorMessage);
			}
		});	 
	};

	// event-handler


	// function
	
}]);