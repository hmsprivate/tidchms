define(["app", "apps/group/group-model", "apps/group/group-filter-model"], function(app, TargetModel, ResourceFilter){
	app.controller("GroupMgmtCtrl",["$scope", "DataService", "$translate", "uiGridConstants", "ngDialog", "$interval", "PopupSearch", "$rootScope", "$route",
		function($scope, DataService, $translate, uiGridConstants, ngDialog, $interval, PopupSearch, $rootScope, $route) {
		"use strict";
		
		var groupMgmtCtrl = this;
		var nodeSeq  = null;
		 
		// 검색조건 객체.
		groupMgmtCtrl.filter = new ResourceFilter();
		
		groupMgmtCtrl.groupList = [];
		
		groupMgmtCtrl.gridPluginOptions = {};
		groupMgmtCtrl.gridTaskOptions = {};
		groupMgmtCtrl.gridNodeOptions = {};
		groupMgmtCtrl.gridUnNodeOptions = {};
		
		groupMgmtCtrl.gridPluginApi = null;
		groupMgmtCtrl.gridTaskApi = null;
		groupMgmtCtrl.gridNodeApi = null;
		
		groupMgmtCtrl.ipInfo = null;
		groupMgmtCtrl.nodeName = null;
		
		groupMgmtCtrl.searchPopType = null;
		
		// Panel Control Toggle.
		groupMgmtCtrl.showTargetPluginPanel = true;
		groupMgmtCtrl.showTargetTaskPanel = true;
		groupMgmtCtrl.showTargetNodePanel = true;
		
		$scope.pluginTypes = ['Collector', 'Processor', 'Publisher'];
		$scope.checked_pluginType = ['Collector', 'Processor', 'Publisher'];
		$scope.selectedSeq = "";
		$scope.selectedName = "";
		$scope.typeList = [];
		
		// pagination.js
		// pagination-directive
		groupMgmtCtrl.totalPage = '';
		groupMgmtCtrl.itemsPerPage = 23;
		groupMgmtCtrl.maxSize = 10;
		groupMgmtCtrl.currentPage = 1;
		
		/* server select box 검색*/
		groupMgmtCtrl.searchServerTypeModel= [
			{label: "All", 			value: ""},
			{label: "VM", 			value: "VM"},
			{label: "PM", 			value: "PM"}
		];
		
		// Panel Control Toggle.
		groupMgmtCtrl.showTargetPluginPanelToggle = function(){groupMgmtCtrl.showTargetPluginPanel = !groupMgmtCtrl.showTargetPluginPanel;}
		groupMgmtCtrl.showTargetTaskPanelToggle = function(){groupMgmtCtrl.showTargetTaskPanel = !groupMgmtCtrl.showTargetTaskPanel;}
		groupMgmtCtrl.showTargetNodePanelToggle = function(){groupMgmtCtrl.showTargetNodePanel = !groupMgmtCtrl.showTargetNodePanel;}
		
		
		//grid show 여부
		groupMgmtCtrl.gridPluginShow = true;
		groupMgmtCtrl.gridTaskShow = true;
		groupMgmtCtrl.gridNodeShow = true;
		groupMgmtCtrl.gridUnNodeShow = true;
		
		
		
		/**
		 * 화면 초기화 작업
		 */
		groupMgmtCtrl.settingUiInit = function() {
			gridPluginList();	//plugin grid setting
			gridTaskList();	//task grid setting
			gridNodeList();	//node grid setting
			
			// group 코드 리스트 조회
            DataService.httpPost('/group/getGroupList.json', {}, function(result) {
                if (result.result == 1) {
                	$scope.selectedSeq = result.data["0"].agreementSeq;
                	$scope.selectedName = result.data["0"].agreementName;
                	
                	//UnKnown 그룹일 경우 node list만 보여준다.
                	if($scope.selectedSeq == 1){
                		groupMgmtCtrl.gridPluginShow = false;
                		groupMgmtCtrl.gridTaskShow = false;
                		groupMgmtCtrl.gridNodeShow = false;
                		groupMgmtCtrl.gridUnNodeShow = true;
                	}else{
                		groupMgmtCtrl.gridPluginShow = true;
                		groupMgmtCtrl.gridTaskShow = true;
                		groupMgmtCtrl.gridNodeShow = true;
                		groupMgmtCtrl.gridUnNodeShow = false;
                	}
                	
                	groupMgmtCtrl.filter.groupId = result.data["0"].agreementSeq;
                	groupMgmtCtrl.groupList = result.data;
                	
                	
                	pluginDetailList();	//plugin 데이터 조회
        			taskDetailList();	//task 데이터 조회
        			nodeDetailList();	//node 데이터 조회
                }
            });
            ap($scope);
		};
		
		$rootScope.groupListInfo = function() {
			// group 코드 리스트 조회
            DataService.httpPost('/group/getGroupList.json', {}, function(result) {
                if (result.result == 1) {
                	$scope.selectedSeq = result.data["0"].agreementSeq;
                	$scope.selectedName = result.data["0"].agreementName;
                	
                	//UnKnown 그룹일 경우 node list만 보여준다.
                	if($scope.selectedSeq == 1){
                		groupMgmtCtrl.gridPluginShow = false;
                		groupMgmtCtrl.gridTaskShow = false;
                		groupMgmtCtrl.gridNodeShow = false;
                		groupMgmtCtrl.gridUnNodeShow = true;
                	}else{
                		groupMgmtCtrl.gridPluginShow = true;
                		groupMgmtCtrl.gridTaskShow = true;
                		groupMgmtCtrl.gridNodeShow = true;
                		groupMgmtCtrl.gridUnNodeShow = false;
                	}
                	
                	groupMgmtCtrl.filter.groupId = result.data["0"].agreementSeq;
                	groupMgmtCtrl.groupList = result.data;
                }
            });
            ap($scope);
		};
		
		
		/*------------------------------------- 컬럼 정렬 처리-------------------------------------------------------*/
		// plugin 컬럼별 정렬하기.
		groupMgmtCtrl.sortPluginChanged = function ( grid, sortColumns ) {
			if(sortColumns.length > 0){
		        var direction = sortColumns[0].sort.direction;
		        var field = sortColumns[0].name;
		        var exp = "";
		
		        switch(direction) {
			        case uiGridConstants.ASC:
			            exp = "ASC";
			            break;
			        case uiGridConstants.DESC:
			            exp = "DESC";
			            break;
			        case undefined:
			            return;
		        }
		        
		        groupMgmtCtrl.filter.plugOrder = field;
		        groupMgmtCtrl.filter.plugExp = exp;
		        getPluginList(groupMgmtCtrl.filter);
			}
	    };
		

		// Task 컬럼별 정렬하기.
		groupMgmtCtrl.sortTaskChanged = function ( grid, sortColumns ) {
			if(sortColumns.length > 0){
		        var direction = sortColumns[0].sort.direction;
		        var field = sortColumns[0].name;
		        var exp = "";
		
		        switch(direction) {
			        case uiGridConstants.ASC:
			            exp = "ASC";
			            break;
			        case uiGridConstants.DESC:
			            exp = "DESC";
			            break;
			        case undefined:
			            return;
		        }
		        
		        groupMgmtCtrl.filter.taskOrder = field;
		        groupMgmtCtrl.filter.taskExp = exp;
		        getTaskList(groupMgmtCtrl.filter);
			}
	    };
		
		
		// node 컬럼별 정렬하기.
		groupMgmtCtrl.sortNodeChanged = function ( grid, sortColumns ) {
			if(sortColumns.length > 0){
		        var direction = sortColumns[0].sort.direction;
		        var field = sortColumns[0].name;
		        var exp = "";
		
		        switch(direction) {
			        case uiGridConstants.ASC:
			            exp = "ASC";
			            break;
			        case uiGridConstants.DESC:
			            exp = "DESC";
			            break;
			        case undefined:
			            return;
		        }
		        
		        groupMgmtCtrl.filter.order = field;
		        groupMgmtCtrl.filter.exp = exp;
		        groupMgmtCtrl.filter.pageIndex = 1;
		        getNodeList(groupMgmtCtrl.filter);
			}
	    };
		
		/*------------------------------------- 데이터 조회 처리-------------------------------------------------------*/
		// plugin 조회
		groupMgmtCtrl.onPluginSearch = function(){
			groupMgmtCtrl.filter.plugOrder = '';
			groupMgmtCtrl.filter.plugExp = '';
	        groupMgmtCtrl.filter.pluginType = $scope.checked_pluginType;
	        getPluginList(groupMgmtCtrl.filter);
		};
		
		// task 조회
		groupMgmtCtrl.onTaskSearch = function(){
			groupMgmtCtrl.filter.taskOrder = '';
			groupMgmtCtrl.filter.taskExp = '';
	        
	        getTaskList(groupMgmtCtrl.filter);
		};
		
		// node 조회
		groupMgmtCtrl.onNodeSearch = function(){
			groupMgmtCtrl.filter.pageIndex = 1;
			groupMgmtCtrl.filter.order = '';
			groupMgmtCtrl.filter.exp = '';
	        
	        getNodeList(groupMgmtCtrl.filter);
		};
		
		//통합검색
		$scope.getSearchCondition = function(searchParam){
			console.log('SEARCH_PARAM:', searchParam);
			
			groupMgmtCtrl.filter.isDefault = "-1";
			groupMgmtCtrl.filter.hostName = null;
			groupMgmtCtrl.filter.serialNumber = null;
			groupMgmtCtrl.filter.nodeType = null;
			groupMgmtCtrl.filter.ip = null;
			groupMgmtCtrl.filter.osName = null;
			groupMgmtCtrl.filter.manufacture = null;
			
			if(searchParam.param_hostName) {
				groupMgmtCtrl.filter.hostName = searchParam.param_hostName;
			}
			
			if(searchParam.param_serialNumber) {
				groupMgmtCtrl.filter.serialNumber = searchParam.param_serialNumber;	
			}
			
			if(searchParam.param_nodeType) {
				groupMgmtCtrl.filter.nodeType = searchParam.param_nodeType;
			}
			
			if(searchParam.param_ip) {
				groupMgmtCtrl.filter.ip = searchParam.param_ip;
			}
			
			if(searchParam.param_osName) {
				groupMgmtCtrl.filter.osName = searchParam.param_osName;
			}
			
			if(searchParam.param_manufacture) {
				groupMgmtCtrl.filter.manufacture = searchParam.param_manufacture;
			}
			
			if(searchParam.param_TotalSearch != null  && searchParam.param_TotalSearch != undefined && searchParam.param_TotalSearch != ''){
				groupMgmtCtrl.filter.isDefault = "1";
				groupMgmtCtrl.filter.hostName = searchParam.param_TotalSearch;
				groupMgmtCtrl.filter.serialNumber = searchParam.param_TotalSearch;
				groupMgmtCtrl.filter.nodeType = searchParam.param_TotalSearch;
				groupMgmtCtrl.filter.ip = searchParam.param_TotalSearch;
				groupMgmtCtrl.filter.osName = searchParam.param_TotalSearch;
				groupMgmtCtrl.filter.manufacture = searchParam.param_TotalSearch;
			}
			
			getNodeList();
		};
		
		
		// 페이징 버튼 클릭 처리
		groupMgmtCtrl.selectPage = function() {
			groupMgmtCtrl.filter.pageIndex = groupMgmtCtrl.currentPage;
			getNodeList(groupMgmtCtrl.filter);
		};
		
		// Node 상세 팝업.
		groupMgmtCtrl.getNodeDetail = function(param){
            var request = {};
            request.nodeSeq = param.nodeSeq;
            PopupSearch.openNodeDetailPop(request);
        };
		
		//Node Status 팝업
		groupMgmtCtrl.getNodeStatus = function(param){
            var request = {};
            request.agreementSeq = param.agreementSeq;
            request.hostName = param.hostName;
            request.ip = param.ip;
            request.restApiPort = param.restApiPort;
            request.nodeName = param.hostName;
            request.nodeSeq = param.nodeSeq;
            
            PopupSearch.openNodeStatusPop(request);
        };
		
		
		// Plugin 팝업.
		groupMgmtCtrl.getPluginPopup = function(){
            var request = {};
            request.agreementSeq = $scope.selectedSeq;
            request.ipInfo = groupMgmtCtrl.ipInfo;
            request.nodeName = groupMgmtCtrl.nodeName;
            PopupSearch.openPluginPop(request);
        };
		
		// Task 팝업.
		groupMgmtCtrl.getTaskPopup = function(){
            var request = {};
            request.agreementSeq = $scope.selectedSeq;
            request.ipInfo = groupMgmtCtrl.ipInfo;
            request.nodeName = groupMgmtCtrl.nodeName;
            PopupSearch.openTaskPop(request);
        };
		
		
		// Node 팝업.
		groupMgmtCtrl.getNodePopup = function(){
	        var request = {};
	        request.agreementSeq = $scope.selectedSeq;
	        request.agreementName = $scope.selectedName;
	        request.ipInfo = groupMgmtCtrl.ipInfo;
	        PopupSearch.openNodePop(request);
	    };
		
		// group add 팝업.
		groupMgmtCtrl.getGroupAddPopup = function(){
	        PopupSearch.openGroupAddPop();
	    };
		
		// group delete 팝업.
		groupMgmtCtrl.getGroupDelPopup = function(){
	        PopupSearch.openGroupDelPop();
	    };
		
		// group list에서 클릭시 사용 node list
		groupMgmtCtrl.getNodeList = function(agreementSeq, agreementName) {

			$scope.selectedSeq = agreementSeq;
			$scope.selectedName = agreementName;

			if($scope.selectedSeq == "" || $scope.selectedSeq == "1"){
				groupMgmtCtrl.searchPopType = "noGroup";
			}else{
				groupMgmtCtrl.searchPopType = "group";
			}
			
			
			onSearchInit();
			groupMgmtCtrl.filter.pageCount = groupMgmtCtrl.itemsPerPage;
			groupMgmtCtrl.filter.groupId = $scope.selectedSeq;
			
			//UnKnown 그룹일 경우 node list만 보여준다.
        	if($scope.selectedSeq == 1){
        		groupMgmtCtrl.gridPluginShow = false;
        		groupMgmtCtrl.gridTaskShow = false;
        		groupMgmtCtrl.gridNodeShow = false;
        		groupMgmtCtrl.gridUnNodeShow = true;
        		nodeDetailList(groupMgmtCtrl.filter);
        	}else{
        		groupMgmtCtrl.gridPluginShow = true;
        		groupMgmtCtrl.gridTaskShow = true;
        		groupMgmtCtrl.gridNodeShow = true;
        		groupMgmtCtrl.gridUnNodeShow = false;
        		
        		pluginDetailList(groupMgmtCtrl.filter);
            	taskDetailList(groupMgmtCtrl.filter);
    			nodeDetailList(groupMgmtCtrl.filter);
        	}
	    };
	    
	    //plugin 삭제 rest api call
	    groupMgmtCtrl.onPluginDelete = function(){
			var pluginTypeList = [];
			var pluginNameList = [];
			var pluginVersionList = [];
			
	      	var rows = groupMgmtCtrl.gridPluginApi.grid.api.grid.rows;
	      	
	      	
	      	for(var i=0;i<rows.length;i++) {
	      		var entity = rows[i].entity;
	      		if(entity.checked) {
	      			pluginTypeList.push(entity.pluginType);
	      			pluginNameList.push(entity.pluginName);
	      			pluginVersionList.push(entity.pluginVersion);
	      		}
	      	}
	      	
	      	if(pluginTypeList.length == 0){
	      		alert("No data selected.");
	      		return false;
	  		}
	      	
	      	var ipInfo = groupMgmtCtrl.ipInfo;
	      	var nodeName = groupMgmtCtrl.nodeName;
	      	deletePlugin(ipInfo, nodeName, pluginTypeList, pluginNameList, pluginVersionList);
		};
	    
		
		//task 삭제 rest api call
		groupMgmtCtrl.onTaskDelete = function(){
			var taskIdList = [];
	      	var rows = groupMgmtCtrl.gridTaskApi.grid.api.grid.rows;
	      	
	      	for(var i=0;i<rows.length;i++) {
	      		var entity = rows[i].entity;
	      		if(entity.checked) {
	      			
	      			if(entity.taskState == 'Running'){
	      				alert("A running task can not be deleted.");
	      				taskIdList = [];
	      				return false;
	      			}
	      			
	      			taskIdList.push(entity.taskId);
	      		}
	      	}
	      	
	      	if(taskIdList.length == 0){
	      		alert("No data selected.");
	      		return false;
	  		}
	      	
	      	var ipInfo = groupMgmtCtrl.ipInfo;
	      	var nodeName = groupMgmtCtrl.nodeName;
	      	deleteTask(ipInfo, nodeName, taskIdList);
		};
	    
	    
		
		// reset버튼 클릭시 검색조건 초기화
		groupMgmtCtrl.onNodeSearchInit = function() {
			groupMgmtCtrl.filter.pageCount = "";
			groupMgmtCtrl.filter.hostName = "";
			groupMgmtCtrl.filter.serialNumber = "";
			groupMgmtCtrl.filter.nodeType = "";
			groupMgmtCtrl.filter.ip = "";
			groupMgmtCtrl.filter.osName = "";
			groupMgmtCtrl.filter.manufacture = "";
	    };
		
	    //node 삭제 rest api call
		groupMgmtCtrl.onNodeDelete = function(){
			var hostNameList = [];
        	var rows = groupMgmtCtrl.gridNodeApi.grid.api.grid.rows;
        	
        	
        	for(var i=0;i<rows.length;i++) {
        		var entity = rows[i].entity;
        		if(entity.checked) {
        			hostNameList.push(entity.hostName);
        		}
        	}
        	
        	if(hostNameList.length == 0){
        		alert("No data selected.");
        		return false;
    		}
        	
        	var groupName = rows[0].entity.agreementName;
        	var nodeName = groupMgmtCtrl.nodeName;
        	deleteNode(groupName, nodeName, hostNameList);
		};
		
		
		//---------------------------------------------------------------------------------------------------------------
		
		
		//plugin sync
		groupMgmtCtrl.onPluginSync = function(){
	      	var ipInfo = groupMgmtCtrl.ipInfo;
	      	var nodeName = groupMgmtCtrl.nodeName;
			
			groupMgmtCtrl.restInfo = {
					"node_name" : nodeName
    				,"type" : "plugin"
    		}
			
			DataService.httpPost('/group/sync.json', groupMgmtCtrl.restInfo, function(result) {
                if (result.data == 'completed') {
                	$rootScope.getPluginList();
                }else{
                	alert(result.errorMessage);
                }
            });
		};
		
		
		//task sync
		groupMgmtCtrl.onTaskSync = function(){
			var ipInfo = groupMgmtCtrl.ipInfo;
	      	var nodeName = groupMgmtCtrl.nodeName;
	      	
			groupMgmtCtrl.restInfo = {
					"node_name" : nodeName
    				,"type" : "task"
    		}
			
			DataService.httpPost('/group/sync.json', groupMgmtCtrl.restInfo, function(result) {
                if (result.data == 'completed') {
                	$rootScope.getTaskList();
                }else{
                	alert(result.errorMessage);
                }
            });
		};
		
		
		//node sync
		groupMgmtCtrl.onNodeSync = function(){
			var ipInfo = groupMgmtCtrl.ipInfo;
	      	var nodeName = groupMgmtCtrl.nodeName;
	      	
			groupMgmtCtrl.restInfo = {
					"agreement_name" : $scope.selectedName
					,"node_name" : nodeName
    				,"type" : "agreement_management"
    		}
			
			DataService.httpPost('/group/sync.json', groupMgmtCtrl.restInfo, function(result) {
                if (result.data == 'completed') {
                	$rootScope.getNodeList();
                }else{
                	alert(result.errorMessage);
                }
            });
		};
		
		
		//node trash bin 이동
		groupMgmtCtrl.onNodeTrashBinMove = function(){
			var NodeSeqTrashBinList = [];
        	var rows = groupMgmtCtrl.gridNodeApi.grid.api.grid.rows;
        	
        	
        	for(var i=0;i<rows.length;i++) {
        		var entity = rows[i].entity;
        		if(entity.checked) {
        			NodeSeqTrashBinList.push(entity.nodeSeq);
        		}
        	}
        	
        	if(NodeSeqTrashBinList.length == 0){
        		alert("No data selected.");
        		return false;
    		}

        	insertNodeTrashBin(NodeSeqTrashBinList);
		};
		
		
		//Node Trash Bin 팝업
		groupMgmtCtrl.getNodeTrashBinPopup = function(){
			$scope.popup = ngDialog.open({
				template: '/trashBin-popup-info',
                className:"ngdialog-theme-default",
                showClose:false,
                disableAnimation: true,
                cache:false,
                closeByDocument:false,
                closeByEscape:false, 
                scope:$scope
            }).closePromise.then(function(data) {
            	$rootScope.getNodeList();
            });; 
		};
		
		
		/*groupMgmtCtrl.exportCsv = function(type) {
			var url = "/group/excelDownload.json";
        	var obj = groupMgmtCtrl.filter;
        	
        	excelDownload(url, type, obj);
		};*/
		
		// event-handler
		// 윈도우 리사이즈.
		/*angular.element(window).on('resize', function () {
			setTimeout(function() {
				groupMgmtCtrl.gridPluginApi.core.handleWindowResize();
				groupMgmtCtrl.gridTaskApi.core.handleWindowResize();
				groupMgmtCtrl.gridNodeApi.core.handleWindowResize();
            }, 300);
        });*/
		
		
		
		
		// function
		/*function excelDownload(url, type, obj) {
			alert("Output up to 65000 lines.");
			
			var form = document.getElementById("excelForm");
        	var jqueryF = $('#excelForm');
        	jqueryF.empty();
        	
        	form.setAttribute("method","post");                    
        	form.setAttribute("action",url);
        	//form.setAttribute("contentType","application/json");
        	
        	
        	var input_id = document.createElement("input");  
        	input_id.setAttribute("type", "hidden");                 
        	input_id.setAttribute("name", "fileType");                        
        	input_id.setAttribute("value", type);                          
        	form.appendChild(input_id);
        	
        	var input_id = document.createElement("input");  
        	input_id.setAttribute("type", "hidden");                 
        	input_id.setAttribute("name", "param");                        
        	input_id.setAttribute("value", JSON.stringify(obj));                          
        	form.appendChild(input_id);
        	form.submit();
		};
		*/
		
		
		//group list 검색 
		function searchGroupList() {
    		// group 코드 리스트 조회
            DataService.httpPost('/group/getGroupList.json', {}, function(result) {
                if (result.result == 1) {
                	$scope.selectedSeq = result.data["0"].agreementSeq;
                	groupMgmtCtrl.filter.groupId = result.data["0"].agreementSeq;
                	groupMgmtCtrl.groupList = result.data;
                }
            });
            ap($scope);
    	};
		
    	
    	/*------------------------------------- grid data 조회-------------------------------------------------------*/
    	
    	//plugin list 검색 
		function pluginDetailList() {
			getPluginList();
    	};
    	
    	//plugin popup에서 등록 완료후 호출할 함수
        $rootScope.getPluginList = function() {
        	getPluginList();
        };
		
		//plugin list (필터기능)
		function getPluginList() {
			groupMgmtCtrl.filter.pluginType = $scope.checked_pluginType;
	        DataService.httpPost("/group/getPluginList.json", groupMgmtCtrl.filter, function(result) {
                if (result.result == 1) {
                	groupMgmtCtrl.gridPluginOptions.data = result.data;
                }
            });
            ap($scope);
        };
        
        //task list 검색 
		function taskDetailList() {
			getTaskList();
		};
		
		//task popup에서 등록 완료후 호출할 함수
        $rootScope.getTaskList = function() {
        	getTaskList();
        };
		
		//plugin list (필터기능)
		function getTaskList() {
		    DataService.httpPost("/group/getTaskList.json", groupMgmtCtrl.filter, function(result) {
		      if (result.result == 1) {
	          	groupMgmtCtrl.gridTaskOptions.data = result.data;
	          }
	      });
	      ap($scope);
		};
    	
    	//node list 검색 
		function nodeDetailList() {
			groupMgmtCtrl.onNodeSearchInit();
			getNodeList();
    	};
		
		//node list (필터기능)
		function getNodeList() {
			groupMgmtCtrl.filter.pageCount = groupMgmtCtrl.itemsPerPage;
	        DataService.httpPost("/group/getNodeList.json", groupMgmtCtrl.filter, refreshGridHandler);
        };
        
        //node popup에서 등록 완료후 호출할 함수
        $rootScope.getNodeList = function() {
        	getNodeList();
        };
		
		
		// 초기화 버튼으로 검색조건 초기화
		function onSearchInit(){
			groupMgmtCtrl.filter.pageCount = "";
			groupMgmtCtrl.filter.hostName = "";
			groupMgmtCtrl.filter.serialNumber = "";
			groupMgmtCtrl.filter.nodeType = "";
			groupMgmtCtrl.filter.ip = "";
			groupMgmtCtrl.filter.osName = "";
			groupMgmtCtrl.filter.manufacture = "";
			
			$scope.checked_pluginType = ['Collector', 'Processor', 'Publisher'];
			
			groupMgmtCtrl.showTargetPluginPanel = true;
			groupMgmtCtrl.showTargetTaskPanel = true;
			groupMgmtCtrl.showTargetNodePanel = true;
			
			$("input:checkbox[id='pluginGridAllCheck']").attr("checked", false);
			$("input:checkbox[id='taskGridAllCheck']").attr("checked", false);
			$("input:checkbox[id='nodeGridAllCheck']").attr("checked", false);
	    };
		
		function refreshGridHandler(data) {
			var result = data.data;
        	console.log(result);
        	
        	// 주어진 데이터를 통해 GRID 리프레쉬한다.
        	groupMgmtCtrl.gridNodeOptions.data = result.list;
        	
        	if($scope.selectedSeq == 1){
        		groupMgmtCtrl.gridUnNodeOptions.data = result.list;
        	}else{
        		groupMgmtCtrl.gridNodeOptions.data = result.list;
        	}

        	//node 정보가 없으면 plugin, task 생성,삭제 버튼 disabled
        	if(result.count == 0){
        		$("#pluginSync").prop("disabled", true);
        		$("#pluginLoad").prop("disabled", true);
        		$("#pluginUnLoad").prop("disabled", true);
        		//$("#taskSync").prop("disabled", true);
        		$("#taskLoad").prop("disabled", true);
        		$("#taskUnLoad").prop("disabled", true);
        	}else{
        		$("#pluginSync").prop("disabled", false);
        		$("#pluginLoad").prop("disabled", false);
        		$("#pluginUnLoad").prop("disabled", false);
        		//$("#taskSync").prop("disabled", false);
        		$("#taskLoad").prop("disabled", false);
        		$("#taskUnLoad").prop("disabled", false);
        	}
        	
        	groupMgmtCtrl.totalPage = result.count;
        	
        	if(result.list.length > 0){
        		if(result.list[0].ip != null && result.list[0].restApiPort != null){
        			groupMgmtCtrl.ipInfo = result.list[0].ip + ":" + result.list[0].restApiPort;
        			groupMgmtCtrl.nodeName = result.list[0].hostName;
        		}
        	}
            
            // select 0-index
        	if($scope.selectedSeq == 1){
        		if (!groupMgmtCtrl.gridUnNodeOptions.data || groupMgmtCtrl.totalPage == 0) {
                    return;
                }
        	}else{
        		if (!groupMgmtCtrl.gridNodeOptions.data || groupMgmtCtrl.totalPage == 0) {
                    return;
                }
        	}
            ap($scope);
        };
        
        
        //plugin delete rest api call
		function deletePlugin(ipInfo, nodeName, pluginTypeList, pluginNameList, pluginVersionList) {
			if(!confirm("Are you sure you want to delete the selected Plugin?")) {
		  		return false;
		  	}
			
			groupMgmtCtrl.deletePluginInfo = {
					"ip" : ipInfo
					,"node_name" : nodeName
					,"tempApiType" : "/v1/plugins/"
					,"pluginTypeList" : pluginTypeList
					,"pluginNameList" : pluginNameList
					,"pluginVersionList" : pluginVersionList
			}
			
			// group plugin 삭제
			DataService.httpPost('/group/deletePlugin.json', groupMgmtCtrl.deletePluginInfo, function(result) {
				if (result.result == 1) {
					var result = JSON.parse(result.data);
  	
					if (result.meta.code == 200) {
						$rootScope.getPluginList();
						alert("It has been deleted.");
					}else {
						alert("Failed : HTTP error code : "+ result.meta.code + " : " + result.meta.message);
					}
				}else{
					alert(result.errorMessage);
				}
			});
			ap($scope);
		};
		
		//task delete rest api call
		function deleteTask(ipInfo, nodeName, taskIdList) {
			if(!confirm("Are you sure you want to delete the selected Task?")) {
		  		return false;
		  	}
			
			groupMgmtCtrl.deleteTaskInfo = {
					"ip" : ipInfo
					,"tempApiType" : "/v1/tasks/"
					,"node_name" : nodeName
					,"taskIdList" : taskIdList
			}
			
			// group task 삭제
			DataService.httpPost('/group/deleteTask.json', groupMgmtCtrl.deleteTaskInfo, function(result) {
				if (result.result == 1) {
					var result = JSON.parse(result.data);
  	
					if (result.meta.code == 200) {
						getTaskList(function(){
							groupMgmtCtrl.gridTaskApi.selection.clearSelectedRows();
						});
						alert("It has been deleted.");
					}else {
						alert("Failed : HTTP error code : "+ result.meta.code + " : " + result.meta.message);
					}
				}else{
					alert(result.errorMessage);
				}
			});
			ap($scope);
		};
		
		//node delete rest api call
		function deleteNode(groupName, nodeName, hostNameList) {
			var refreshList = false;
			
			//전체선택한 상태 확인
			if(groupMgmtCtrl.totalPage == hostNameList.length){
				//전체 노드를 삭제하게 되면 그룹 타스크가 삭제 됩니다. 타스크도 삭제 하시겠습니까?
				if(!confirm("If you delete the entire node, the group task is deleted.\nAre you sure you want to delete the task?")) {
					refreshList = false;
	        	}else{
	        		refreshList = true;
	        	}
				
				if(refreshList == false){
					// ok 버튼을 클릭하면 node만 삭제 됩니다. 삭제하시겠습니까?
					if(!confirm("If you click the Ok button deletes only the node.\nAre you sure you want to delete?")) {
						return false;
					}
				}
				
				
			}else{
				if(!confirm("Are you sure you want to delete the selected node?")) {
					refreshList = null;
	        		return false;
	        	}else{
	        		refreshList = false;
	        	}
			}
			
			var url = "";
			if(refreshList == true){
				//task,  node 전부 삭제
				url = "/group/deleteAllNode.json";
			}else if(refreshList == false){
				url = "/group/deleteNode.json";
			}else{
				return false;
			}
			
			
			groupMgmtCtrl.deleteGroupInfo = {
					"ip" : groupMgmtCtrl.ipInfo
					,"node_name" : nodeName
    				,"apiType" : "/v1/tribe/agreements/" + groupName + "/leave"
    				,"nodeNameList" : hostNameList
    				,"groupName" : groupName
    				,"groupId" : groupMgmtCtrl.filter.groupId
    		}
			
    		// group node 삭제
            DataService.httpPost(url, groupMgmtCtrl.deleteGroupInfo, function(result) {
                if (result.result == 1) {
                	var result = JSON.parse(result.data);
                	
                	if (result.meta.code == 200) {
                		getNodeList(function(){
                			groupMgmtCtrl.gridNodeApi.selection.clearSelectedRows();
						});
                		$rootScope.getPluginList();
                		getTaskList(function(){
							groupMgmtCtrl.gridTaskApi.selection.clearSelectedRows();
						});
                		
						alert("It has been deleted.");
					}else {
						alert("Failed : HTTP error code : "+ result.meta.code + " : " + result.meta.message);
					}
                }else{
                	alert(result.errorMessage);
                }
            });
            ap($scope);
    	};
    	
    	//node trash bin move
    	function insertNodeTrashBin(NodeSeqTrashBinList){
    		if(!confirm("Are you sure you want to move to the trash Bin?")) {
				return false;
			}
    		
    		groupMgmtCtrl.nodeTrashBinInfo = {
					"nodeSeqTrashBinList" : NodeSeqTrashBinList
    		}
			
            DataService.httpPost("/group/setNodeTrashBin.json", groupMgmtCtrl.nodeTrashBinInfo, function(result) {
                if (result.result == 1) {
                	//$route.reload();
                	getNodeList(function(){
            			groupMgmtCtrl.gridNodeApi.selection.clearSelectedRows();
					});
                }else{
                	alert(result.errorMessage);
                }
            });
            ap($scope);
    	};
    	
    	
    	
		
		/*------------------------------------- grid 초기화 처리-------------------------------------------------------*/
		// plugin GRID 초기화.
		function gridPluginList(){
			
            var columnDefs = [{
				name : ' ',
				field : 'checked',
				cellTemplate : '<div class="ui-grid-cell-contents" style="padding: 2px 0px 0px 12px; "><input type="checkbox" ng-init="row.entity.checked=false" ng-model="row.entity.checked" style="position:relative;" ng-click="grid.appScope.onClickCheckbox(row)"/><label class="no-txt" /></div>',
				headerCellTemplate : '<div class="ui-grid-cell-contents" style="padding: 2px 0px 0px 12px; border-top:none"><input type="checkbox" id="pluginGridAllCheck" ng-model="grid.appScope.allChecked" style="position:relative;z-index:99999;" ng-click="grid.appScope.onClickCheckboxHeader()" /><label class="no-txt" /></div>',
				width : 40,
				resizable : false,
				enableColumnMenu : false,
				enableSorting : false,
				cellTooltip : true,
				headerTooltip : true
			},{
                name: 'agreement_name',
                field: 'agreementName',
                displayName: $translate.instant("GROUP.GROUP"),
                width: 110,
                cellClass: 'txt-c',
				headerCellClass: 'txt-c',
                enableColumnMenu: false,
                cellTooltip:true,
                headerTooltip:true
            }, {
                name: 'plugin_name',
                field: 'pluginName',
                displayName: $translate.instant("COMMON.NAME"),
                width: 120,
                cellClass: 'txt-c',
				headerCellClass: 'txt-c',
                enableColumnMenu: false,
                cellTooltip:true,
                headerTooltip:true
            }, {
                name: 'plugin_version',
                field: 'pluginVersion',
                displayName: $translate.instant("GROUP.VERSION"),
                width: 100,
                cellClass: 'txt-c',
				headerCellClass: 'txt-c',
                enableColumnMenu: false,
                cellTooltip:true,
                headerTooltip:true
            }, {
                name: 'plugin_type',
                field: 'pluginType',
                displayName: $translate.instant("GROUP.TYPE"),
                width: 130,
                cellClass: 'txt-c',
				headerCellClass: 'txt-c',
                enableColumnMenu: false,
                cellTooltip:true,
                headerTooltip:true
            }, {
                name: 'plugin_signed',
                field: 'pluginSigned',
                displayName: $translate.instant("PLUGIN.SIGNED"),
                width: 100,
                cellClass: 'txt-c',
				headerCellClass: 'txt-c',
                enableColumnMenu: false,
                cellTooltip:true,
                headerTooltip:true
            }, {
                name: 'plugin_status',
                field: 'pluginStatus',
                displayName: $translate.instant("PLUGIN.STATUS"),
                width: 100,
                cellClass: 'txt-c',
				headerCellClass: 'txt-c',
                enableColumnMenu: false,
                cellTooltip:true,
                headerTooltip:true
            }, {
                name: 'plugin_loaded_timestamp',
                field: 'pluginLoadedTimestamp',
                displayName: $translate.instant("PLUGIN.LOADED") + " "+ $translate.instant("COMMON.TIMESTAMP") ,
                width: 200,
                cellClass: 'txt-c',
				headerCellClass: 'txt-c',
                enableColumnMenu: false,
                cellTooltip:true,
                headerTooltip:true
            }, {
                name: 'plugin_href',
                field: 'pluginHref',
                displayName: $translate.instant("COMMON.HREF"),
                cellTooltip:true,
                headerTooltip:true,
                //width: 583,
                enableColumnMenu: false,
                headerTooltip:true,
                headerCellClass: 'txt-c',
                cellClass: 'txt-l'
            }];
            
    		// plugin GRID OPTIONS
            groupMgmtCtrl.gridPluginOptions = {
            		columnDefs:columnDefs,
            		//enableRowSelection: true, 
    				enableRowHeaderSelection: false,
    				multiSelect: false,
    				modifierKeysToMultiSelect: false,
    				noUnselect: true,
    				enableColumnResizing: true,
    				enableHorizontalScrollbar:uiGridConstants.scrollbars.ALWAYS,
                    excessRows:10,
                    rowHeight: 30,
                    appScopeProvider: {
                        onRowClick: function(row) {
                            if (!row) {
                                return;
                            }
                            //groupMgmtCtrl.filter.reqId = row.entity.reqId;
                            //groupMgmtCtrl.filter.phase = null;
            	 			//groupMgmtCtrl.filter.serviceName = null;
                            
                            //groupMgmtCtrl.getNodeDetail(row.entity);
                        },
                        onClickCheckbox : function(row) {
    						console.log(row);
    					},
    					onClickCheckboxHeader : function(row) {
    						var rows = groupMgmtCtrl.gridPluginApi.grid.api.grid.rows;
    						for (var i = 0; i < rows.length; i++) {
    							rows[i].entity.checked = groupMgmtCtrl.gridPluginApi.grid.appScope.allChecked;
    						}
    					},
                    },
                    onRegisterApi: function(gridApi){
                        groupMgmtCtrl.gridPluginApi = gridApi;
                        groupMgmtCtrl.gridPluginApi.core.on.sortChanged($scope, groupMgmtCtrl.sortPluginChanged);
                    },
                    rowTemplate: "<div ng-dblclick=\"grid.appScope.onRowClick(row)\" ng-repeat=\"(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name\" class=\"ui-grid-cell\" ng-class=\"{ 'ui-grid-row-header-cell': col.isRowHeader }\" ui-grid-cell dbl-click-row></div>",
    		};
		};
		
		// task GRID 초기화.
		function gridTaskList(){
            var columnDefs = [{
				name : ' ',
				field : 'checked',
				cellTemplate : '<div class="ui-grid-cell-contents" style="padding: 2px 0px 0px 12px; "><input type="checkbox" ng-init="row.entity.checked=false" ng-model="row.entity.checked" style="position:relative;" ng-click="grid.appScope.onClickCheckbox(row)"/><label class="no-txt" /></div>',
				headerCellTemplate : '<div class="ui-grid-cell-contents" style="padding: 2px 0px 0px 12px; border-top:none"><input type="checkbox" id="taskGridAllCheck" ng-model="grid.appScope.allChecked" style="position:relative;z-index:99999;" ng-click="grid.appScope.onClickCheckboxHeader()" /><label class="no-txt" /></div>',
				width : 40,
				resizable : false,
				enableColumnMenu : false,
				enableSorting : false,
				cellTooltip : true,
				headerTooltip : true
			},{
                name: 'action',
                field: 'action',
                displayName: $translate.instant("TASK.ACTION"),
                cellTemplate: 
                						'<div class="ui-grid-cell-contents" style="padding-left:5px" ng-if="row.entity.taskState == \'Ended\'"></div>'
                					+'<div class="ui-grid-cell-contents" style="padding-left:5px" ng-if="row.entity.taskState == \'Disabled\'"><button type="button" class="btn-cr2" title="Start" ng-click="grid.appScope.onEnableClick(row)" ng-if="row.entity.taskState == \'Disabled\'">Enable</button></div>'
                					+'<div class="ui-grid-cell-contents" style="padding-left:5px" ng-if="row.entity.taskState == \'Running\'"><button type="button" class="btn-gy" title="Start" ng-click="grid.appScope.onStopClick(row)" ng-if="row.entity.taskState == \'Running\'">Stop</button></div>'
                					+'<div class="ui-grid-cell-contents" style="padding-left:5px" ng-if="row.entity.taskState == \'Stopped\'"><button type="button" class="btn-cr2" title="Start" ng-click="grid.appScope.onStartClick(row)" ng-if="row.entity.taskState == \'Stopped\'">Start</button></div>'
                	,
                width: 80,
                cellClass: 'txt-c',
                headerCellClass: 'txt-c',
                enableSorting:false,
                cellTooltip:true,
                headerTooltip:true,
                enableColumnMenu: false,
                headerTooltip:true
            }, {
                name: 'agreement_name',
                field: 'agreementName',
                displayName: $translate.instant("GROUP.GROUP"),
                width: 110,
                cellClass: 'txt-c',
                headerCellClass: 'txt-c',
                enableColumnMenu: false,
                cellTooltip:true,
                headerTooltip:true
            }, {
                name: 'task_id',
                field: 'taskId',
                displayName: $translate.instant("TASK.ID"),
                width: 300,
                cellClass: 'txt-c',
                headerCellClass: 'txt-c',
                enableColumnMenu: false,
                cellTooltip:true,
                headerTooltip:true
            }, {
                name: 'task_name',
                field: 'taskName',
                displayName: $translate.instant("COMMON.NAME"),
                width: 300,
                cellClass: 'txt-c',
                headerCellClass: 'txt-c',
                enableColumnMenu: false,
                cellTooltip:true,
                headerTooltip:true
            }, {
                name: 'task_deadline',
                field: 'taskDeadline',
                displayName: $translate.instant("TASK.DEADLINE"),
                width: 70,
                cellClass: 'txt-c',
                headerCellClass: 'txt-c',
                enableColumnMenu: false,
                cellTooltip:true,
                headerTooltip:true
            }, {
                name: 'task_creation_timestamp',
                field: 'taskCreationTimestamp',
                displayName: $translate.instant("TASK.CREATION") + " "+ $translate.instant("COMMON.TIMESTAMP"),
                width: 150,
                cellClass: 'txt-c',
                headerCellClass: 'txt-c',
                enableColumnMenu: false,
                cellTooltip:true,
                headerTooltip:true
            }, {
                name: 'task_last_run_timestamp',
                field: 'taskLastRunTimestamp',
                displayName: $translate.instant("TASK.LAST_RUN") + " "+ $translate.instant("COMMON.TIMESTAMP"),
                width: 150,
                cellClass: 'txt-c',
                headerCellClass: 'txt-c',
                enableColumnMenu: false,
                cellTooltip:true,
                headerTooltip:true
            }, {
                name: 'task_hit_count',
                field: 'taskHitCount',
                displayName: $translate.instant("TASK.HIT_COUNT"),
                width: 80,
                enableColumnMenu: false,
                cellTooltip:true,
                headerTooltip:true,
                headerCellClass: 'txt-c',
                cellClass: 'txt-r'
            }, {
                name: 'task_state',
                field: 'taskState',
                displayName: $translate.instant("TASK.TASK_STATE"),
                width: 100,
                cellClass: 'txt-c',
                headerCellClass: 'txt-c',
                cellTooltip:true,
                headerTooltip:true,
                enableColumnMenu: false,
                headerTooltip:true
            }, {
                name: 'task_href',
                field: 'taskHref',
                displayName: $translate.instant("COMMON.HREF"),
                width: 550,
                cellTooltip:true,
                headerTooltip:true,
                enableColumnMenu: false,
                headerTooltip:true,
                headerCellClass: 'txt-c',
                cellClass: 'txt-l'
            }];
            
    		// task GRID OPTIONS
            groupMgmtCtrl.gridTaskOptions = {
            		columnDefs:columnDefs,
            		//enableRowSelection: true, 
    				enableRowHeaderSelection: false,
    				multiSelect: false,
    				modifierKeysToMultiSelect: false,
    				noUnselect: true,
    				enableColumnResizing: true,
                    enableHorizontalScrollbar:uiGridConstants.scrollbars.ALWAYS,
                    excessRows:10,
                    rowHeight: 30,
                    appScopeProvider: {
                        onRowDblClick: function(row) {
                            if (!row) {
                                return;
                            }
                            //alert(row.entity.taskState);
                            //groupMgmtCtrl.filter.reqId = row.entity.reqId;
                            //groupMgmtCtrl.filter.phase = null;
            	 			//groupMgmtCtrl.filter.serviceName = null;
                            
                            //groupMgmtCtrl.getNodeDetail(row.entity);
                        },
            			onClickCheckbox : function(row) {
    						console.log(row);
    					},
    					onClickCheckboxHeader : function(row) {
    						var rows = groupMgmtCtrl.gridTaskApi.grid.api.grid.rows;
    						for (var i = 0; i < rows.length; i++) {
    							rows[i].entity.checked = groupMgmtCtrl.gridTaskApi.grid.appScope.allChecked;
    						}
    					},
    					onStartClick : function(row){
    						var taskId = row.entity.taskId;
    						
    						groupMgmtCtrl.startTaskInfo = {
    								"ip" : groupMgmtCtrl.ipInfo
    								,"node_name" : groupMgmtCtrl.nodeName
    			    				,"apiType" : "/v1/tasks/" + taskId + "/start"
    			    		}
    						
    			    		// task start rest api call
    			            DataService.httpPost('/group/startTask.json', groupMgmtCtrl.startTaskInfo, function(result) {
    			                if (result.result == 1) {
    			                	var result = JSON.parse(result.data);
    			                	
    			                	if (result.meta.code == 200) {
    			                		//sync api 호출 후 화면 리로드 작업
    			                		getTaskList(groupMgmtCtrl.filter);
    								}else {
    									alert("Failed : HTTP error code : "+ result.meta.code + " : " + result.meta.message);
    								}
    			                }else{
    			                	alert(result.errorMessage);
    			                }
    			            });
    			            ap($scope);
    					},
    					onStopClick : function(row){
							var taskId = row.entity.taskId;
    						
    						groupMgmtCtrl.startTaskInfo = {
    								"ip" : groupMgmtCtrl.ipInfo
    								,"node_name" : groupMgmtCtrl.nodeName
    			    				,"apiType" : "/v1/tasks/" + taskId + "/stop"
    			    		}
    						
    			    		// task stop rest api call
    			            DataService.httpPost('/group/stopTask.json', groupMgmtCtrl.startTaskInfo, function(result) {
    			                if (result.result == 1) {
    			                	var result = JSON.parse(result.data);
    			                	
    			                	if (result.meta.code == 200) {
    			                		//sync api 호출 후 화면 리로드 작업
    			                		getTaskList(groupMgmtCtrl.filter);
    								}else {
    									alert("Failed : HTTP error code : "+ result.meta.code + " : " + result.meta.message);
    								}
    			                }else{
    			                	alert(result.errorMessage);
    			                }
    			            });
    			            ap($scope);
    						
    					},
    					onEnableClick : function(row){
							var taskId = row.entity.taskId;
    						
    						groupMgmtCtrl.startTaskInfo = {
    								"ip" : groupMgmtCtrl.ipInfo
    								,"node_name" : groupMgmtCtrl.nodeName
    			    				,"apiType" : "/v1/tasks/" + taskId + "/enable"
    			    		}
    						
    			    		// task stop rest api call
    			            DataService.httpPost('/group/stopTask.json', groupMgmtCtrl.startTaskInfo, function(result) {
    			                if (result.result == 1) {
    			                	var result = JSON.parse(result.data);
    			                	
    			                	if (result.meta.code == 200) {
    			                		//sync api 호출 후 화면 리로드 작업
    			                		getTaskList(groupMgmtCtrl.filter);
    								}else {
    									alert("Failed : HTTP error code : "+ result.meta.code + " : " + result.meta.message);
    								}
    			                }else{
    			                	alert(result.errorMessage);
    			                }
    			            });
    			            ap($scope);
    						
    					}
                    },
                    onRegisterApi: function(gridApi){
                        groupMgmtCtrl.gridTaskApi = gridApi;
                        groupMgmtCtrl.gridTaskApi.core.on.sortChanged($scope, groupMgmtCtrl.sortTaskChanged);
                    },
                    rowTemplate: "<div ng-dblclick=\"grid.appScope.onRowDblClick(row)\" ng-repeat=\"(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name\" class=\"ui-grid-cell\" ng-class=\"{ 'ui-grid-row-header-cell': col.isRowHeader }\" ui-grid-cell dbl-click-row></div>",
    		};
		};
		
		
		// node GRID 초기화.
		function gridNodeList(){
            var columnDefs = [{
				name : ' ',
				field : 'checked',
				cellTemplate : '<div class="ui-grid-cell-contents" style="padding: 2px 0px 0px 12px; "><input type="checkbox" ng-init="row.entity.checked=false" ng-model="row.entity.checked" style="position:relative;" ng-click="grid.appScope.onClickCheckbox(row)"/><label class="no-txt" /></div>',
				headerCellTemplate : '<div class="ui-grid-cell-contents" style="padding: 2px 0px 0px 12px; border-top:none"><input type="checkbox" id="nodeGridAllCheck" ng-model="grid.appScope.allChecked" style="position:relative;z-index:99999;" ng-click="grid.appScope.onClickCheckboxHeader()" /><label class="no-txt" /></div>',
				width : 40,
				resizable : false,
				enableColumnMenu : false,
				enableSorting : false,
				cellTooltip : true,
				headerTooltip : true
			}, {
                name: 'status',
                field: 'status',
                displayName: $translate.instant("TASK.ACTION"),
                cellTemplate: '<div class="ui-grid-cell-contents" style="padding-left:5px"><button type="button" class="btn-gy" title="Start" ng-click="grid.appScope.onNodeStatusClick(row)" ">Info</button></div>',
                width: 80,
                cellClass: 'txt-c',
                headerCellClass: 'txt-c',
                enableSorting:false,
                cellTooltip:true,
                headerTooltip:true,
                enableColumnMenu: false,
                headerTooltip:true
            }, {
                name: 'agreement_name',
                field: 'agreementName',
                displayName: $translate.instant("GROUP.GROUP"),
                width: 110,
                cellClass: 'txt-c',
                headerCellClass: 'txt-c',
                enableColumnMenu: false,
                cellTooltip:true,
                headerTooltip:true
            }, {
                name: 'host_name',
                field: 'hostName',
                displayName: $translate.instant("GROUP.HOST_NAME"),
                width: 220,
                cellClass: 'txt-c',
                headerCellClass: 'txt-c',
                enableColumnMenu: false,
                cellTooltip:true,
                headerTooltip:true
            }, {
                name: 'serialnumber',
                field: 'serialNumber',
                displayName: $translate.instant("GROUP.SERIAL_NUMBER"),
                width: 130,
                cellClass: 'txt-c',
                headerCellClass: 'txt-c',
                enableColumnMenu: false,
                cellTooltip:true,
                headerTooltip:true
            }, {
                name: 'ip',
                field: 'ip',
                displayName: $translate.instant("GROUP.IP"),
                width: 130,
                cellClass: 'txt-c',
                headerCellClass: 'txt-c',
                enableColumnMenu: false,
                cellTooltip:true,
                headerTooltip:true
            }, {
                name: 'cpu_cnt',
                field: 'cpuCnt',
                displayName: $translate.instant("GROUP.CPU_COUNT"),
                width: 90,
                enableColumnMenu: false,
                cellTooltip:true,
                headerTooltip:true,
                headerCellClass: 'txt-c',
                cellClass: 'txt-r'
            }, {
                name: 'cpu_type',
                field: 'cpuType',
                displayName: "CPU Model",
                width: 280,
                cellClass: 'txt-l',
                headerCellClass: 'txt-c',
                cellTooltip:true,
                headerTooltip:true,
                enableColumnMenu: false,
                headerTooltip:true
            }, {
                name: 'memory',
                field: 'memory',
                displayName: $translate.instant("GROUP.MEMORY"),
                width: 80,
                cellClass: 'txt-c',
                headerCellClass: 'txt-c',
                enableColumnMenu: false,
                cellTooltip:true,
                headerTooltip:true
            }, {
                name: 'disk',
                field: 'disk',
                displayName: $translate.instant("GROUP.DISK"),
                width: 80,
                cellClass: 'txt-c',
                headerCellClass: 'txt-c',
                enableColumnMenu: false,
                cellTooltip:true,
                headerTooltip:true
            }, {
                name: 'node_type',
                field: 'nodeType',
                displayName: $translate.instant("GROUP.TYPE"),
                width: 80,
                cellClass: 'txt-c',
                headerCellClass: 'txt-c',
                cellTooltip:true,
                headerTooltip:true,
                enableColumnMenu: false,
                headerTooltip:true
            }, {
                name: 'os_name',
                field: 'osName',
                displayName: $translate.instant("GROUP.OS") + " "+ $translate.instant("COMMON.NAME"),
                width: 80,
                cellClass: 'txt-c',
                headerCellClass: 'txt-c',
                cellTooltip:true,
                headerTooltip:true,
                enableColumnMenu: false,
                headerTooltip:true
            }, {
                name: 'os_version',
                field: 'osVersion',
                displayName: $translate.instant("GROUP.OS") + " "+ $translate.instant("GROUP.VERSION"),
                width: 80,
                cellClass: 'txt-c',
                headerCellClass: 'txt-c',
                cellTooltip:true,
                headerTooltip:true,
                enableColumnMenu: false,
                headerTooltip:true
            }, {
                name: 'manufacture',
                field: 'manufacture',
                displayName: $translate.instant("GROUP.MANUFACTURER"),
                width: 143,
                cellClass: 'txt-c',
                headerCellClass: 'txt-c',
                cellTooltip:true,
                headerTooltip:true,
                enableColumnMenu: false,
                headerTooltip:true
            }];
            
    		// GRID OPTIONS
            groupMgmtCtrl.gridNodeOptions = {
            		columnDefs:columnDefs,
            		//enableRowSelection : true,
    				enableRowHeaderSelection : false,
    				multiSelect : false,
    				modifierKeysToMultiSelect : false,
    				noUnselect : true,
    				enableColumnResizing : true,
    				enableHorizontalScrollbar:uiGridConstants.scrollbars.ALWAYS,
                    excessRows:10,
                    rowHeight: 29.7,
                    appScopeProvider: {
                    	onRowDblClick: function(row) {
                            if (!row) {
                                return;
                            }
                            
                            groupMgmtCtrl.getNodeDetail(row.entity);
                        },
                        onNodeStatusClick: function(row) {
                        	console.log(row.entity);
                        	
                        	if(row.entity.ip == ''){
                        		alert("There is no information in the selected Node IP information.");	//선택하신 Node 정보에 IP 정보가 없습니다.
                        		return false;
                        	}
                        	if(row.entity.restApiPort == ''){
                        		alert("There is no Port information in the selected Node information.");		//선택하신 Node 정보에 Port 정보가 없습니다.
                        		return false;
                        	}
                        	groupMgmtCtrl.getNodeStatus(row.entity);
                        },
                        onClickCheckbox : function(row) {
    						console.log(row);
    					},
    					onClickCheckboxHeader : function(row) {
    						var rows = groupMgmtCtrl.gridNodeApi.grid.api.grid.rows;
    						for (var i = 0; i < rows.length; i++) {
    							rows[i].entity.checked = groupMgmtCtrl.gridNodeApi.grid.appScope.allChecked;
    						}
    					},	
                    },
                    onRegisterApi: function(gridApi){
                        groupMgmtCtrl.gridNodeApi = gridApi;
                        groupMgmtCtrl.gridNodeApi.core.on.sortChanged($scope, groupMgmtCtrl.sortNodeChanged);
                    },
                    rowTemplate: "<div ng-dblclick=\"grid.appScope.onRowDblClick(row)\" ng-repeat=\"(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name\" class=\"ui-grid-cell\" ng-class=\"{ 'ui-grid-row-header-cell': col.isRowHeader }\" ui-grid-cell dbl-click-row></div>",
    		};
		};
		
		// 검색 조건 설정
        function initializeTypeList() {
            $scope.typeList =  [
                {value:'hostName', label:'Host Name', input:'text', placeholder:"Please enter Host Name."},
                {value:'serialNumber', label:'	Serial Number', input:'text', placeholder:"Please enter Serial Number."},
                {value:'nodeType', label:'Type', input:'select', optionList:groupMgmtCtrl.searchServerTypeModel},
                {value:'ip', label:'IP', input:'text', placeholder:"Please enter IP."},
                {value:'osName', label:'OS Name', input:'text', placeholder:"Please enter OS Name."},
                {value:'manufacture', label:'Manufacture', input:'text', placeholder:"Please enter Manufacture."}
            ];
       
        };
		
		
		function initialize() {
			$interval.cancel($rootScope.stopInterval);
			groupMgmtCtrl.settingUiInit();
			initializeTypeList();
		};
		
		initialize();
	}]);
	
	
	
	
	
	
	//trash bin release popup
	app.controller("TrashBinReleaseCtrl",["$scope", "$http", "DataService", "$translate", "uiGridConstants", "ngDialog", "$interval", "PopupSearch", "$rootScope",
		function($scope, $http, DataService, $translate, uiGridConstants, ngDialog, $interval, PopupSearch, $rootScope) {
		"use strict";
		var trashBinReleaseCtrl = this;
		var nodeSeq  = null;
		 
		// 검색조건 객체.
		trashBinReleaseCtrl.filter = new ResourceFilter();
		trashBinReleaseCtrl.ipInfo = null;
		trashBinReleaseCtrl.nodeName = null;
		trashBinReleaseCtrl.searchAgentGroupModel= [];
		trashBinReleaseCtrl.gridOptions = {};
		trashBinReleaseCtrl.gridApi = null;

		trashBinReleaseCtrl.searchStateModel= [
			{label: "All", 				value: ""}
			,{label: "Running", 		value: "Running"}
			,{label: "Stopped", 	value: "Stopped"}
			,{label: "Ended", 	value: "Ended"}
			,{label: "Disabled", 	value: "Disabled"}
		];
		
		/* server select box 검색*/
		trashBinReleaseCtrl.searchServerTypeModel= [
			{label: "All", 			value: ""},
			{label: "VM", 			value: "VM"},
			{label: "PM", 			value: "PM"}
		];
		
		/* status select box 검색*/
		trashBinReleaseCtrl.searchStatusModel= [
			{label: "All", 			value: ""},
			{label: "Delete", 			value: "Delete"},
			{label: "Recovery", 			value: "Recovery"}
		];
		
		$scope.typeList = [];
		
		
		trashBinReleaseCtrl.closePopup = function () {
			//$scope.popup.close();
			$scope.closeThisDialog();
        };
		
		//조회
        trashBinReleaseCtrl.onSearch = function(){
			searchDetail(trashBinReleaseCtrl.filter);
		};
		
		
		trashBinReleaseCtrl.onNodeRecoveryClick = function(row, flag){
			if(!confirm("Do you want to recover?")) {
		  		return false;
		  	}
			
			if(flag == 'single'){
				DataService.httpPost("/group/setNodeRecovery.json", row, function(result) {
                    if (result.result == 1) {
                    	trashBinReleaseCtrl.filter.isDefault = "";
                    	searchDetail();
                    }else{
                    	alert(result.errorMessage);
                    }
                });
			}else{
				var NodeSeqRecoveryList = [];
				var IdxRecoveryList = [];
				var rows = trashBinReleaseCtrl.gridApi.grid.api.grid.rows;
	        	
	        	
	        	for(var i=0;i<rows.length;i++) {
	        		var entity = rows[i].entity;
	        		if(entity.checked) {
	        			IdxRecoveryList.push(entity.idx);
	        			NodeSeqRecoveryList.push(entity.nodeSeq);
	        		}
	        	}
	        	
	        	if(NodeSeqRecoveryList.length == 0){
	        		alert("No data selected.");
	        		return false;
	    		}
	        	
	        	trashBinReleaseCtrl.nodeRecoveryInfo = {
	        			"idxRecoveryList" : IdxRecoveryList,
						"nodeSeqRecoveryList" : NodeSeqRecoveryList
	    		}
	        	
	        	DataService.httpPost("/group/setNodeRecovery.json", trashBinReleaseCtrl.nodeRecoveryInfo, function(result) {
                    if (result.result == 1) {
                    	trashBinReleaseCtrl.filter.isDefault = "";
                    	searchDetail();
                    }else{
                    	alert(result.errorMessage);
                    }
                });
			}
			ap($scope);
		};
		
		
		//통합검색
		$scope.getSearchCondition = function(searchParam){
			console.log('SEARCH_PARAM:', searchParam);
			
			trashBinReleaseCtrl.filter.isDefault = "-1";
			trashBinReleaseCtrl.filter.agreementSeq = null;
			trashBinReleaseCtrl.filter.hostName = null;
			trashBinReleaseCtrl.filter.serialNumber = null;
			trashBinReleaseCtrl.filter.nodeType = null;
			trashBinReleaseCtrl.filter.ip = null;
			trashBinReleaseCtrl.filter.osName = null;
			trashBinReleaseCtrl.filter.manufacture = null;
			trashBinReleaseCtrl.filter.status = null;
			
			if(searchParam.param_agreementSeq) {
				trashBinReleaseCtrl.filter.agreementSeq = searchParam.param_agreementSeq;
			}
			
			if(searchParam.param_hostName) {
				trashBinReleaseCtrl.filter.hostName = searchParam.param_hostName;
			}
			
			if(searchParam.param_serialNumber) {
				trashBinReleaseCtrl.filter.serialNumber = searchParam.param_serialNumber;	
			}
			
			if(searchParam.param_nodeType) {
				trashBinReleaseCtrl.filter.nodeType = searchParam.param_nodeType;
			}
			
			if(searchParam.param_ip) {
				trashBinReleaseCtrl.filter.ip = searchParam.param_ip;
			}
			
			if(searchParam.param_osName) {
				trashBinReleaseCtrl.filter.osName = searchParam.param_osName;
			}
			
			if(searchParam.param_manufacture) {
				trashBinReleaseCtrl.filter.manufacture = searchParam.param_manufacture;
			}
			
			if(searchParam.param_status) {
				trashBinReleaseCtrl.filter.status = searchParam.param_status;
			}
			
			if(searchParam.param_TotalSearch != null  && searchParam.param_TotalSearch != undefined && searchParam.param_TotalSearch != ''){
				trashBinReleaseCtrl.filter.isDefault = "1";
				trashBinReleaseCtrl.filter.agreementSeq = searchParam.param_TotalSearch;
				trashBinReleaseCtrl.filter.hostName = searchParam.param_TotalSearch;
				trashBinReleaseCtrl.filter.serialNumber = searchParam.param_TotalSearch;
				trashBinReleaseCtrl.filter.nodeType = searchParam.param_TotalSearch;
				trashBinReleaseCtrl.filter.ip = searchParam.param_TotalSearch;
				trashBinReleaseCtrl.filter.osName = searchParam.param_TotalSearch;
				trashBinReleaseCtrl.filter.manufacture = searchParam.param_TotalSearch;
				trashBinReleaseCtrl.filter.status = searchParam.param_TotalSearch;
			}
			
			searchDetail();
		};
	    
	    
	    
		// 검색 조건 설정
		function initializeTypeList() {
		    $scope.typeList =  [
		    	{value:'agreementSeq', label:'Group', input:'select', optionList:trashBinReleaseCtrl.searchAgentGroupModel},
		        {value:'hostName', label:'Host Name', input:'text', placeholder:"Please enter Host Name."},
		        {value:'serialNumber', label:'	Serial Number', input:'text', placeholder:"Please enter Serial Number."},
		        {value:'nodeType', label:'Type', input:'select', optionList:trashBinReleaseCtrl.searchServerTypeModel},
		        {value:'ip', label:'IP', input:'text', placeholder:"Please enter IP."},
		        {value:'osName', label:'OS Name', input:'text', placeholder:"Please enter OS Name."},
		        {value:'manufacture', label:'Manufacture', input:'text', placeholder:"Please enter Manufacture."},
		        {value:'status', label:'Status', input:'select', optionList:trashBinReleaseCtrl.searchStatusModel}
	        ];
	    };
  		
		function searchDetail() {
	        DataService.httpPost("/group/getNodeTrashBinHistory.json", trashBinReleaseCtrl.filter, refreshGridHandler);
        };
        
        function refreshGridHandler(data) {
			var result = data.data;
        	
        	// 주어진 데이터를 통해 GRID 리프레쉬한다.
			trashBinReleaseCtrl.gridOptions.data = result;
            
            // select 0-index
            if (!trashBinReleaseCtrl.gridOptions.data) {
                return;
            }
            
            trashBinReleaseCtrl.gridOptions.data = result;
            ap($scope);
        };

        // 그리드 옵션 설정
 		function setGridOption(){
             var columnDefs = [{
 				name : ' ',
 				field : 'checked',
 				cellTemplate : '<div class="ui-grid-cell-contents" ng-if="row.entity.nodeRecoveryTime  != null"><label class="no-txt" /></div>'
					+ '<div class="ui-grid-cell-contents txt-c" ng-if="row.entity.nodeRecoveryTime == null"  style="padding: 2px 0px 0px 0px; "><input type="checkbox" ng-model="row.entity.checked" style="position:relative;" ng-click="grid.appScope.onClickCheckbox(row)"/><label class="no-txt" /></div>',
 				
 				headerCellTemplate : '<div class="ui-grid-cell-contents" style="padding: 2px 0px 0px 12px; border-top:none"><input type="checkbox" id="nodeGridAllCheck" ng-model="grid.appScope.allChecked" style="position:relative;z-index:99999;" ng-click="grid.appScope.onClickCheckboxHeader()" /><label class="no-txt" /></div>',
 				width : 40,
 				resizable : false,
 				enableColumnMenu : false,
 				enableSorting : false,
 				cellTooltip : true,
 				headerTooltip : true
 			}, {
                 name: 'status',
                 field: 'status',
                 displayName: $translate.instant("TASK.ACTION"),
                 cellTemplate: '<div class="ui-grid-cell-contents" ng-if="row.entity.nodeRecoveryTime  != null" style="padding-left:5px"><label class="no-txt" /></div>'
                	 	+'<div class="ui-grid-cell-contents" ng-if="row.entity.nodeRecoveryTime  == null" style="padding-left:5px"><button type="button" class="btn-gy" title="Start" ng-click="grid.appScope.onNodeRecoveryClick(row)">Put Back</button></div>',
                 width: 80,
                 cellClass: 'txt-c',
                 headerCellClass: 'txt-c',
                 enableSorting:false,
                 cellTooltip:true,
                 headerTooltip:true,
                 enableColumnMenu: false,
                 headerTooltip:true
             }, {
                 name: 'delete_node_time',
                 field: 'deleteNodeTime',
                 displayName: "Delete Node Time",
                 width: 150,
                 cellClass: 'txt-c',
                 headerCellClass: 'txt-c',
                 enableColumnMenu: false,
                 cellTooltip:true,
                 headerTooltip:true
             }, {
                 name: 'node_recovery_time',
                 field: 'nodeRecoveryTime',
                 displayName: "Node Recovery Time",
                 width: 150,
                 cellClass: 'txt-c',
                 headerCellClass: 'txt-c',
                 enableColumnMenu: false,
                 cellTooltip:true,
                 headerTooltip:true
             }, {
                 name: 'agreement_name',
                 field: 'agreementName',
                 displayName: $translate.instant("GROUP.GROUP"),
                 width: 110,
                 cellClass: 'txt-c',
                 headerCellClass: 'txt-c',
                 enableColumnMenu: false,
                 cellTooltip:true,
                 headerTooltip:true
             }, {
                 name: 'host_name',
                 field: 'hostName',
                 displayName: $translate.instant("GROUP.HOST_NAME"),
                 width: 220,
                 cellClass: 'txt-c',
                 headerCellClass: 'txt-c',
                 enableColumnMenu: false,
                 cellTooltip:true,
                 headerTooltip:true
             }, {
                 name: 'serialnumber',
                 field: 'serialnumber',
                 displayName: $translate.instant("GROUP.SERIAL_NUMBER"),
                 width: 130,
                 cellClass: 'txt-c',
                 headerCellClass: 'txt-c',
                 enableColumnMenu: false,
                 cellTooltip:true,
                 headerTooltip:true
             }, {
                 name: 'ip',
                 field: 'ip',
                 displayName: $translate.instant("GROUP.IP"),
                 width: 130,
                 cellClass: 'txt-c',
                 headerCellClass: 'txt-c',
                 enableColumnMenu: false,
                 cellTooltip:true,
                 headerTooltip:true
             }, {
                 name: 'cpu_cnt',
                 field: 'cpuCnt',
                 displayName: $translate.instant("GROUP.CPU_COUNT"),
                 width: 90,
                 enableColumnMenu: false,
                 cellTooltip:true,
                 headerTooltip:true,
                 headerCellClass: 'txt-c',
                 cellClass: 'txt-r'
             }, {
                 name: 'cpu_type',
                 field: 'cpuType',
                 displayName: "CPU Model",
                 width: 280,
                 cellClass: 'txt-l',
                 headerCellClass: 'txt-c',
                 cellTooltip:true,
                 headerTooltip:true,
                 enableColumnMenu: false,
                 headerTooltip:true
             }, {
                 name: 'memory',
                 field: 'memory',
                 displayName: $translate.instant("GROUP.MEMORY"),
                 width: 80,
                 cellClass: 'txt-c',
                 headerCellClass: 'txt-c',
                 enableColumnMenu: false,
                 cellTooltip:true,
                 headerTooltip:true
             }, {
                 name: 'disk',
                 field: 'disk',
                 displayName: $translate.instant("GROUP.DISK"),
                 width: 80,
                 cellClass: 'txt-c',
                 headerCellClass: 'txt-c',
                 enableColumnMenu: false,
                 cellTooltip:true,
                 headerTooltip:true
             }, {
                 name: 'node_type',
                 field: 'nodeType',
                 displayName: $translate.instant("GROUP.TYPE"),
                 width: 80,
                 cellClass: 'txt-c',
                 headerCellClass: 'txt-c',
                 cellTooltip:true,
                 headerTooltip:true,
                 enableColumnMenu: false,
                 headerTooltip:true
             }, {
                 name: 'os_name',
                 field: 'osName',
                 displayName: $translate.instant("GROUP.OS") + " "+ $translate.instant("COMMON.NAME"),
                 width: 80,
                 cellClass: 'txt-c',
                 headerCellClass: 'txt-c',
                 cellTooltip:true,
                 headerTooltip:true,
                 enableColumnMenu: false,
                 headerTooltip:true
             }, {
                 name: 'os_version',
                 field: 'osVersion',
                 displayName: $translate.instant("GROUP.OS") + " "+ $translate.instant("GROUP.VERSION"),
                 width: 80,
                 cellClass: 'txt-c',
                 headerCellClass: 'txt-c',
                 cellTooltip:true,
                 headerTooltip:true,
                 enableColumnMenu: false,
                 headerTooltip:true
             }, {
                 name: 'manufacture',
                 field: 'manufacture',
                 displayName: $translate.instant("GROUP.MANUFACTURER"),
                 width: 143,
                 cellClass: 'txt-c',
                 headerCellClass: 'txt-c',
                 cellTooltip:true,
                 headerTooltip:true,
                 enableColumnMenu: false,
                 headerTooltip:true
             }];
             
     		// GRID OPTIONS
             trashBinReleaseCtrl.gridOptions = {
             		columnDefs:columnDefs,
             		//enableRowSelection : true,
     				enableRowHeaderSelection : false,
     				multiSelect : false,
     				modifierKeysToMultiSelect : false,
     				noUnselect : true,
     				enableColumnResizing : true,
     				enableHorizontalScrollbar:uiGridConstants.scrollbars.ALWAYS,
                     excessRows:10,
                     rowHeight: 30,
                     appScopeProvider: {
                    	 onNodeRecoveryClick: function(row) {
                         	console.log(row.entity);
                         	
                         	/*if(row.entity.ip == ''){
                         		alert("There is no information in the selected Node IP information.");	//선택하신 Node 정보에 IP 정보가 없습니다.
                         		return false;
                         	}
                         	if(row.entity.restApiPort == ''){
                         		alert("There is no Port information in the selected Node information.");		//선택하신 Node 정보에 Port 정보가 없습니다.
                         		return false;
                         	}*/
                         	
                         	trashBinReleaseCtrl.onNodeRecoveryClick(row.entity, 'single');
                         },
                         onClickCheckbox : function(row) {
     						console.log(row);
     					},
     					onClickCheckboxHeader : function(row) {
     						var rows = trashBinReleaseCtrl.gridApi.grid.api.grid.rows;
     						for (var i = 0; i < rows.length; i++) {
     							if(trashBinReleaseCtrl.gridApi.grid.api.grid.rows[i].entity.nodeRecoveryTime == null){
     								rows[i].entity.checked = trashBinReleaseCtrl.gridApi.grid.appScope.allChecked;
     							}
     						}
     					},	
                     },
                     onRegisterApi: function(gridApi){
                    	 trashBinReleaseCtrl.gridApi = gridApi;
                     }
     		};
 		};
        
  		//group list 검색 
		function searchGroupList() {
    		// group 코드 리스트 조회
            DataService.httpPost('/agent/getCommonGroupList.json', {}, function(result) {
                if (result.result == 1) {
                	trashBinReleaseCtrl.searchAgentGroupModel = result.data;
                	trashBinReleaseCtrl.filter.agreementSeq = '0';
                	initializeTypeList();
                }
            });
    	};
    	
	
		
		function initialize() {
			searchGroupList();
			setGridOption();
			searchDetail();
		};
		
		initialize();
	}]);
	
	
	
});