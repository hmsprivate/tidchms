define(["app"], function(app) {
	app.controller("FloorPlanSettingCtrl", ["$rootScope", "$scope", "DataService", "ConfigManager", 
		function($rootScope, $scope, DataService, ConfigManager) {
		"use strict";
		
		// Properties
		var floorPlanSettingCtrl = this;
		floorPlanSettingCtrl.floorPlan = {};
		floorPlanSettingCtrl.floorPlan.dcBasicInfo = {};		//데이터센터 기본정보.
		floorPlanSettingCtrl.floorPlan.floorList = [];			//층 목록.
		floorPlanSettingCtrl.floorPlan.mgrList =[];				//데이터센터 담당자 목록.
		
		floorPlanSettingCtrl.managerObj = {};					//담당자 객체.

		floorPlanSettingCtrl.isSave = true;
		
		// method
		// 데이터센터 생성.
		floorPlanSettingCtrl.createDatacenter = function(){
			
		}
		// 데이터센터 저장.
		floorPlanSettingCtrl.saveDatacenter = function(){
			
		}
		// 데이터센터 수정
		floorPlanSettingCtrl.updateDatacenter = function(){
			
		}
		// 데이터센터 삭제.
		floorPlanSettingCtrl.removeDatacenter = function(){
			
		}
		// 층 생성.
		floorPlanSettingCtrl.createFloor = function(){
			
		}
		// 층 삭제.
		floorPlanSettingCtrl.removefloor = function(){
			
		}
		// Room(상면) 생성.
		floorPlanSettingCtrl.createRoom = function(floor){
			
		}
		// Room(상면) 삭제
		floorPlanSettingCtrl.removeRoom = function(floor){
			
		}
		// 데이터센터 CODE 유효성체크.
		floorPlanSettingCtrl.validate = function(){
			console.log('validate : ', floorPlanSettingCtrl.floorPlan.dcBasicInfo.NICK_ID);
		}
		// 담당자 추가" 
		floorPlanSettingCtrl.createManager = function(){
			
		}
		// 담당자 삭제.
		floorPlanSettingCtrl.removeManager = function(){
			
		}
		
		
		// function
		function initialField(){
			floorPlanSettingCtrl.floorPlan.dcBasicInfo.DATACENTER_ID = '자동생성(UUID)';
			floorPlanSettingCtrl.floorPlan.dcBasicInfo.RACK_UNIT = '1';
			
		}
		function initialize() {

			angular.element(document).ready(function() {
				$.validLayout();
			});

			initialField();
		}
		
		function setSelectedResource(){
			
		}
		
		initialize();
	}]);
});