define([], function () {
	return function ($rootScope, $http) {
		"use strict";

		// method
		this.httpGet = function (url, param, resultHandler) {
			if (url == null || url == "")
				return;

			if (param && param.text)
				url = param.text;

			return executeAjax("GET", url, param, resultHandler);
		};

		this.httpPost = function (url, param, resultHandler) {
			if (url == null || url == "")
				return;

			return executeAjax("POST", url, param, resultHandler);
		};

		this.httpPut = function (url, param, resultHandler) {
			if (url == null || url == "")
				return;

			return executeAjax("PUT", url, param, resultHandler);
		};

		this.httpDelete = function (url, param, resultHandler) {
			if (url == null || url == "")
				return;

			return executeAjax("DELETE", url, param, resultHandler);
		};


		// function
		function executeAjax(method, url, param, resultHandler) {
			 $http({
				method: method,
				url: url,
				data: JSON.stringify(param),
				headers: {
					"Content-Type": "application/json"
				}
			}).then(function (data) {
				if(resultHandler) {
					resultHandler(data.data);
				}
			});
		}
	};
});