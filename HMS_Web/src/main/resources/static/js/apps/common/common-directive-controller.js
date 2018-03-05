define(["app"], function(app) {
	app.controller("CommonDirectiveCtrl", ["$rootScope", "$scope", "$http", "ngDialog", "ConfigManager", "HistorySearch", function($rootScope, $scope, $http, ngDialog, ConfigManager, HistorySearch) {
		"use strict";

		var commonDirectiveCtrl = this;
		
		// common-directive.js
		// select-box-directive
		commonDirectiveCtrl.selectBoxDirectiveSelectModel = [
			{label: "TEST1", value: "test1"},
			{label: "TEST2", value: "test2"},
			{label: "TEST3", value: "test3"},
		]
		
		// pagination.js
		// pagination-directive
		commonDirectiveCtrl.totalPage = 100;
		commonDirectiveCtrl.itemsPerPage = 20;
		commonDirectiveCtrl.maxSize = 10;
		commonDirectiveCtrl.currentPage = 1;
		commonDirectiveCtrl.selectPage = function(value) {
			console.log("SELECT-PAGE:", value);
		}

		// app.vendor.min.js
		// ng-dialog
		commonDirectiveCtrl.ngDialog = function() {
			// https://github.com/likeastore/ngDialog 참조
			ngDialog.open({
				template : '<div> Hello!! </div>',
				plain: true,
				showClose: true,
				disableAnimation: true
			});
		}

		commonDirectiveCtrl.showTreePop = function(){

			$scope.selectNodeInfo = {
				selectId : 8326,
				selectType : 'rack'
			};
			ngDialog.open({
				template : '<div>'+
							'<resource-tree-directive  use-checkbox="false" user-selectnodeinfo="selectNodeInfo" auto-expand="false" use-bottombox="false"></resource-tree-directive>'+
							'</div>',
				plain: true,
				showClose: true,
				scope : $scope,
				disableAnimation: true
			});

			ap($scope);

		};

		commonDirectiveCtrl.showDiagramPop = function(dcid, roomid){
			ngDialog.open({
				template : '<div style="width:1000px; height: 500px">'+
				'<floor-diagram-directive version-type="release" editable-diagram="false" use-change-mode-btn="false" use-config-btn="false" use-add-on-btn="false" injection-dc-id="'+dcid+'" injection-type="room" injection="true" injection-id="'+roomid+'" width="100%" height="100%"></floor-diagram-directive>'+
				'</div>',
				plain: true,
				showClose: true,
				disableAnimation: true
			});
		};


		commonDirectiveCtrl.showRackDiagramPop = function(){
			$scope.selectedTreeNode = ConfigManager.getSelectedTreeData();
			ngDialog.open({
				template : '<div style="width:1000px; height: 500px">'+
				'<rack-info-directive tree-node="selectedTreeNode" id="rackDiagramArea"></rack-info-directive>'+
				'</div>',
				plain: true,
				showClose: true,
				scope : $scope,
				disableAnimation: true
			});
			ap($scope);
		};

		commonDirectiveCtrl.openHistoryPop = function(){
			HistorySearch.openPop("test");
		}

		function initialize() {    
			angular.element(document).ready(function() {
				$.validLayout();
			});

			// date-picker
			$(".date").datepicker({
				showOn : "both", //이미지로 사용 button , both : 엘리먼트와 이미지 동시사용
				buttonText : "",
				dateFormat : 'yy-mm-dd' //2017-03-31 MOD ko용
			});

			$rootScope.$on('SELECTED_RESOURCE', function(event, data){
				commonDirectiveCtrl.selectedTreeData = data;
			});

		}
		
		initialize();
	}]);
});