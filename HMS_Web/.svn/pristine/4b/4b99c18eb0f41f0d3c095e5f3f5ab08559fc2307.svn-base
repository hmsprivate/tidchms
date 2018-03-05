define(["app", "apps/common/rackdiagram/rack-model"], function(app, Rack) {
	app.controller("TestCtrl", ["$scope", "$http", function($scope, $http) {
		"use strict";

		// property
		var testCtrl = this;
		testCtrl.data = generateData();
		testCtrl.rackDiagramControl = {};
		
		console.log('RACK DRAW DATA :: ',testCtrl.data);
		
		$scope.rack = new Rack();
		$scope.customDragClass = function() {
			ap($scope);
			if ($scope.rack.hwType == "010") {
				return "draggable-node";
			}
			
			return "draggable-rack";
		}
		
		testCtrl.logs = [];

		// method
		testCtrl.addRackComplete = function(value) {
			testCtrl.logs.push(debug("ADD-RACK-COMPLETE", JSON.stringify(value)));
			ap($scope);
		}
		testCtrl.addNodeComplete = function(value) {
			testCtrl.logs.push(debug("ADD-RACK-COMPLETE", JSON.stringify(value)));
			ap($scope);
		}
		testCtrl.updateRackComplete = function(value) {
			testCtrl.logs.push(debug("UPDATE-RACK-COMPLETE", JSON.stringify(value)));
			ap($scope);
		}
		testCtrl.updateNodeComplete = function(value) {
			testCtrl.logs.push(debug("UPDATE-RACK-COMPLETE", JSON.stringify(value)));
			ap($scope);
		}
		testCtrl.selectRack = function(value) {
			testCtrl.logs.push(debug("SELECT-RACK", JSON.stringify(value)));
			ap($scope);			
		}
		testCtrl.selectNode = function(value) {
			testCtrl.logs.push(debug("SELECT-NODE", JSON.stringify(value)));
			ap($scope);			
		}
		testCtrl.getData = function() {
			console.log(testCtrl.rackDiagramControl.getData());
		}
		
		// event-handler


		// function
		function debug(...args) {
			var result = args.join("\t");
			return moment().local().format("YYYY-MM-DD hh:mm:ss") + "\t" + result;		
		}
		
    	function generateData() {
    		var list = [];
    		var rack = new Rack();
    		rack.rackColumnName = "node";
    		rack.hwType = "001";
    		rack.horizontal = 1;
    		rack.vertical = 1;
    		rack.unitSize = 5;
    		rack.holeNo = 1;
    		rack.hwName = "BM-SERVER";
    		rack.rackId = "";
    		list.push(rack);
    		
    		return list;
    	}
    	
		function initialize() {    
			angular.element(document).ready(function() {
				$.validLayout();
			});
			
			// add-rack
			$("#add-rack").draggable({
				revert: true,
				cursor: "pointer",
				start: function() {
					ap($scope);
				}
			}).data("rack", $scope.rack);
		}
		
		initialize();
	}]);
});