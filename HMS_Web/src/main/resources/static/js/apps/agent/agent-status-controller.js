define(["app", "apps/agent/agent-model", "apps/agent/agent-filter-model"], function(app, TargetModel, ResourceFilter){
	app.controller("AgentStatusCtrl",["$scope", "DataService", "$translate", "uiGridConstants", "ngDialog", "$interval", "PopupSearch", "$rootScope", "$route",
		function($scope, DataService, $translate, uiGridConstants, ngDialog, $interval, PopupSearch, $rootScope, $route) {
		"use strict";
		
		var agentStatusCtrl = this;
		var nodeSeq  = null;
		 
		// 검색조건 객체.
		agentStatusCtrl.filter = new ResourceFilter();
		
		agentStatusCtrl.groupList = [];
		agentStatusCtrl.dashBoardStatus = {};
		
		agentStatusCtrl.gridAgentOptions = {};
		agentStatusCtrl.gridApi = null;
		
		$scope.selectedSeq = "0";
		$scope.typeList = [];
		
		agentStatusCtrl.sTime = {};
		agentStatusCtrl.eTime = {};
	
		var date = new Date();
		agentStatusCtrl.setEndDataInit = moment(agentStatusCtrl.setStartDataInit).format("YYYY-MM-DD") + " " + "00:00:00";
		agentStatusCtrl.setStartDataInit = moment(agentStatusCtrl.setEndDataInit).subtract(7, 'day').format("YYYY-MM-DD") + " " + "00:00:00";
		
		// pagination.js
		// pagination-directive
		agentStatusCtrl.totalPage = 100;
		agentStatusCtrl.itemsPerPage = 24;
		agentStatusCtrl.maxSize = 10;
		agentStatusCtrl.currentPage = 1;
		
		/* server select box 검색*/
		//agent grouplist select box
		agentStatusCtrl.searchAgentGroupModel= [];
		
		//agent status select box
		agentStatusCtrl.searchAgentStatusModel= [
			{label: "All", 				value: ""},
			{label: "Normal", 		value: "Normal"},
			{label: "Abnormal", 	value: "Abnormal"}
		];
		
		agentStatusCtrl.dtSelectInit = function(target, location) {
			target.dataLocation(location);
        	target.enable(false);
        };
		
		agentStatusCtrl.dtSelectDataInit = function(target) {
			target.getDateInit();
		};
		
		agentStatusCtrl.searchDateTypeChange = function(event) {
        	if(!event.value) {
        		agentStatusCtrl.sTime.enable(false);
        		agentStatusCtrl.eTime.enable(false);
        	}
        	else{
        		agentStatusCtrl.sTime.enable(true);
        		agentStatusCtrl.eTime.enable(true);
        	} 
    	};
		
		// 컬럼별 정렬하기.
		agentStatusCtrl.sortChanged = function ( grid, sortColumns ) {
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
		        
		        agentStatusCtrl.filter.order = field;
		        agentStatusCtrl.filter.exp = exp;
		        agentStatusCtrl.filter.pageIndex = 1;
		        getAgentList(agentStatusCtrl.filter);
			}
	    };
		
		
		//조회
		agentStatusCtrl.onSearch = function(){
			agentStatusCtrl.filter.pageIndex = 1;
			agentStatusCtrl.filter.order = '';
			agentStatusCtrl.filter.exp = '';
			
			if(agentStatusCtrl.filter.firstLastUpTime == null || agentStatusCtrl.filter.firstLastUpTime == ""){
				agentStatusCtrl.filter.firstLastUpTime = agentStatusCtrl.setStartDataInit;
			}else{
				agentStatusCtrl.filter.firstLastUpTime = agentStatusCtrl.sTime.getDateTime();
			}
			
			if(agentStatusCtrl.filter.endLastUpTime == null || agentStatusCtrl.filter.endLastUpTime == ""){
				agentStatusCtrl.filter.endLastUpTime = agentStatusCtrl.setEndDataInit;
			}else{
				agentStatusCtrl.filter.endLastUpTime = agentStatusCtrl.eTime.getDateTime();
			}
	        getAgentList(agentStatusCtrl.filter);
		};
		
		// 페이징 버튼 클릭 처리
		agentStatusCtrl.selectPage = function() {
			agentStatusCtrl.filter.pageIndex = agentStatusCtrl.currentPage;
			getAgentList(agentStatusCtrl.filter);
		};

		
		// group list에서 클릭시 검색조건 초기화
		agentStatusCtrl.onAgentSearchInit = function() {
			agentStatusCtrl.filter.agreementSeq = "0";
			agentStatusCtrl.filter.hostName = "";
			agentStatusCtrl.filter.ip = "";
			agentStatusCtrl.filter.status = "";
			
			agentStatusCtrl.filter.firstLastUpTime = agentStatusCtrl.setStartDataInit;
			agentStatusCtrl.filter.endLastUpTime = agentStatusCtrl.setEndDataInit;
			
			agentStatusCtrl.dtSelectDataInit(agentStatusCtrl.sTime);
			agentStatusCtrl.dtSelectDataInit(agentStatusCtrl.eTime);
			
	    };
	    
	    //새로고침
		agentStatusCtrl.reload = function(url) {
			if(window.location.pathname + window.location.hash  == url) {
				$route.reload();
			} else {
				window.location = url;
			}
		};
		
		agentStatusCtrl.update = function() {
			agentStatusCtrl.filter.pageIndex = 1;
	        DataService.httpPost("/agent/getAgentStatusList.json", agentStatusCtrl.filter, refreshGridHandler);
		};
		
		
		// event-handler
		// 윈도우 리사이즈.
		angular.element(window).on('resize', function () {
			setTimeout(function() {
				agentStatusCtrl.gridApi.core.handleWindowResize();
            }, 300);
        });
		
		
		
		
		// function
		//group list 검색 
		function searchGroupList() {
    		// group 코드 리스트 조회
            DataService.httpPost('/agent/getCommonGroupList.json', {}, function(result) {
                if (result.result == 1) {
                	agentStatusCtrl.searchAgentGroupModel = result.data;
                	agentStatusCtrl.filter.agreementSeq = '0';
                	initializeTypeList();
                }
            });
    	};
		
		//node list (필터기능)
		function getAgentList() {
			agentStatusCtrl.filter.pageCount = agentStatusCtrl.itemsPerPage;
	        DataService.httpPost("/agent/getAgentStatusList.json", agentStatusCtrl.filter, refreshGridHandler);
        };
		
		function refreshGridHandler(data) {
			var result = data.data;
        	console.log(result);
        	
        	// 주어진 데이터를 통해 GRID 리프레쉬한다.
        	agentStatusCtrl.gridAgentOptions.data = result.list;
        	agentStatusCtrl.totalPage = result.count;
            
            // select 0-index
            if (!agentStatusCtrl.gridAgentOptions.data || agentStatusCtrl.totalPage == 0) {
                return;
            }            
            ap($scope);
        };
        
        
        // 검색 조건 설정
 		function initializeTypeList() {
 		    $scope.typeList =  [
 		    	{value:'agreementSeq', label:'Group', input:'select', optionList:agentStatusCtrl.searchAgentGroupModel},
 		        {value:'hostName', label:'Host Name', input:'text', placeholder:"Please enter Host Name."},
 		        {value:'ip', label:'IP', input:'text', placeholder:"Please enter IP."},
 		        {value:'status', label:'Agent Status', input:'select', optionList:agentStatusCtrl.searchAgentStatusModel},
 		        {value:'lastTime', label:'Last time', input:'date'}
 	        ];
 	    };
 	    
 	    
 	    //통합검색
 		$scope.getSearchCondition = function(searchParam){
 			console.log('SEARCH_PARAM:', searchParam);
 			
 			agentStatusCtrl.filter.isDefault = "-1";
 			agentStatusCtrl.filter.agreementSeq = null;
 			agentStatusCtrl.filter.hostName = null;
 			agentStatusCtrl.filter.ip = null;
 			agentStatusCtrl.filter.status = null;
 			agentStatusCtrl.filter.firstLastUpTime = null;
 			agentStatusCtrl.filter.endLastUpTime = null;
 			
 			if(searchParam.param_agreementSeq) {
 				agentStatusCtrl.filter.agreementSeq = searchParam.param_agreementSeq;
  			}
 			
 			if(searchParam.param_hostName) {
 				agentStatusCtrl.filter.hostName = searchParam.param_hostName;
 			}
 			
 			if(searchParam.param_ip) {
 				agentStatusCtrl.filter.ip = searchParam.param_ip;
 			}
 			
 			if(searchParam.param_status) {
 				agentStatusCtrl.filter.status = searchParam.param_status;
 			}
 			
 			if(searchParam.param_lastTime) {
 				agentStatusCtrl.filter.firstLastUpTime = searchParam.param_lastTime.split("||")[0] + " " + "00:00:00";
 				agentStatusCtrl.filter.endLastUpTime = searchParam.param_lastTime.split("||")[1] + " " + "23:59:59";
			}
 			
 			
 			
 			if(searchParam.param_TotalSearch != null  && searchParam.param_TotalSearch != undefined && searchParam.param_TotalSearch != ''){
 				agentStatusCtrl.filter.isDefault = "1";
 				agentStatusCtrl.filter.agreementSeq = searchParam.param_TotalSearch;
 				agentStatusCtrl.filter.hostName = searchParam.param_TotalSearch;
 				agentStatusCtrl.filter.ip = searchParam.param_TotalSearch;
 				agentStatusCtrl.filter.status = searchParam.param_TotalSearch;
 				agentStatusCtrl.filter.firstLastUpTime = searchParam.param_TotalSearch + " " + "00:00:00";
 			}
 			
 			getAgentList();
 		};
		
		
		// node GRID 초기화.
		function gridAgentList(){
            var columnDefs = [{
            	visible:false,		//숨김
                name: 'row_num',
                field: 'rowNum',
                displayName: $translate.instant("COMMON.NO"),
                width: 80,
                enableColumnMenu: false,
                cellTooltip:true,
                headerTooltip:true
            }, {
                name: 'agreement_name',
                field: 'agreementName',
                displayName: $translate.instant("GROUP.GROUP"),
                //width: 110,
                //cellClass: 'txt-c',
                cellClass: function(grid, row) {
                	var flag = row.entity.status;
                	
                	if (flag == 'Abnormal') {
                    	return 'bg-cell-c';
                	}else{
                		return 'txt-c';
                	}
                },
                headerCellClass: 'txt-c',
                enableColumnMenu: false,
                cellTooltip:true,
                headerTooltip:true
            }, {
                name: 'host_name',
                field: 'hostName',
                displayName: $translate.instant("GROUP.HOST_NAME"),
                //width: 120,
                //cellClass: 'txt-c',
                cellClass: function(grid, row) {
                	var flag = row.entity.status;
                	
                	if (flag == 'Abnormal') {
                    	return 'bg-cell-c';
                	}else{
                		return 'txt-c';
                	}
                },
                headerCellClass: 'txt-c',
                enableColumnMenu: false,
                cellTooltip:true,
                headerTooltip:true
            }, {
                name: 'ip',
                field: 'ip',
                displayName: $translate.instant("GROUP.IP"),
                width: 150,
                //cellClass: 'txt-c',
                cellClass: function(grid, row) {
                	var flag = row.entity.status;
                	
                	if (flag == 'Abnormal') {
                    	return 'bg-cell-c';
                	}else{
                		return 'txt-c';
                	}
                },
                headerCellClass: 'txt-c',
                enableColumnMenu: false,
                cellTooltip:true,
                headerTooltip:true
            }, {
                name: 'status',
                field: 'status',
                displayName: $translate.instant("PLUGIN.STATUS"),
                //width: 120,
                //cellClass: 'txt-c',
                cellClass: function(grid, row) {
                	var flag = row.entity.status;
                	
                	if (flag == 'Abnormal') {
                    	return 'bg-cell-c';
                	}else{
                		return 'txt-c';
                	}
                },
                headerCellClass: 'txt-c',
                enableColumnMenu: false,
                cellTooltip:true,
                headerTooltip:true
            }, {
                name: 'last_up_time',
                field: 'lastUpTime',
                displayName: 'Last time',
                //width: 150,
                //cellClass: 'txt-c',
                cellClass: function(grid, row) {
                	var flag = row.entity.status;
                	
                	if (flag == 'Abnormal') {
                    	return 'bg-cell-c';
                	}else{
                		return 'txt-c';
                	}
                },
                headerCellClass: 'txt-c',
                enableColumnMenu: false,
                cellTooltip:true,
                headerTooltip:true
            }];
            
    		// GRID OPTIONS
            agentStatusCtrl.gridAgentOptions = {
                    columnDefs:columnDefs,
                    //enableRowSelection: true, 
                    //enableFullRowSelection:true,
                    enableRowHeaderSelection: false,
                    enableColumnResizing: true,
                    useExternalSorting: true,
                    multiSelect:false,
                    enableHorizontalScrollbar:uiGridConstants.scrollbars.ALWAYS,
                    excessRows:10,
                    rowHeight: 29.9,
                    enableSorting: false,
                    appScopeProvider: {
                    },
                    onRegisterApi: function(gridApi){
                        agentStatusCtrl.gridApi = gridApi;
                        //agentStatusCtrl.gridApi.core.on.sortChanged($scope, agentStatusCtrl.sortChanged);
                    },
                    rowTemplate: "<div ng-repeat=\"(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name\" class=\"ui-grid-cell\" ng-class=\"{ 'ui-grid-row-header-cell': col.isRowHeader }\" ui-grid-cell></div>",
    		};
		};
		
		function initialize() {
			$interval.cancel($rootScope.stopInterval);
			searchGroupList();
			
			gridAgentList();
			//agentStatusCtrl.onSearch();
			getAgentList();
		};
		
		initialize();
		
	}]);
	
});