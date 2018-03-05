define(["app", "apps/main/main-model", "apps/main/main-filter-model"], function(app, TargetModel, ResourceFilter){
	app.controller("MainCtrl",["$scope", "DataService", "$translate", "uiGridConstants", "ngDialog", "$interval", "PopupSearch", "$rootScope",
		function($scope, DataService, $translate, uiGridConstants, ngDialog, $interval, PopupSearch, $rootScope) {
		"use strict";
		
		var mainCtrl = this;
		var nodeSeq  = null;
		 
		// 검색조건 객체.
		mainCtrl.filter = new ResourceFilter();
		
		mainCtrl.groupList = [];
		mainCtrl.dashBoardStatus = {};
		
		mainCtrl.gridOptions = {};
		mainCtrl.gridApi = null;
		
		$scope.selectedSeq = "0";
		$scope.typeList = [];
		
		// pagination.js
		// pagination-directive
		mainCtrl.totalPage = '';
		mainCtrl.itemsPerPage = 21;
		mainCtrl.maxSize = 10;
		mainCtrl.currentPage = 1;
		
		/* server select box 검색*/
		mainCtrl.searchServerTypeModel= [
			{label: "All", 			value: ""},
			{label: "VM", 			value: "VM"},
			{label: "PM", 			value: "PM"}
		];
		
		
		// 컬럼별 정렬하기.
		mainCtrl.sortChanged = function ( grid, sortColumns ) {
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
		        
		        mainCtrl.filter.order = field;
		        mainCtrl.filter.exp = exp;
		        mainCtrl.filter.pageIndex = 1;
		        getNodeList(mainCtrl.filter);
			}
	    };
		
		// node list 조회
		mainCtrl.onSearch = function(){
			mainCtrl.filter.pageIndex = 1;
			mainCtrl.filter.order = '';
			mainCtrl.filter.exp = '';
	        getNodeList(mainCtrl.filter);
		};
		
		//통합검색
		$scope.getSearchCondition = function(searchParam){
			console.log('SEARCH_PARAM:', searchParam);
			
			mainCtrl.filter.isDefault = "-1";
			mainCtrl.filter.hostName = null;
			mainCtrl.filter.serialNumber = null;
			mainCtrl.filter.nodeType = null;
			mainCtrl.filter.ip = null;
			mainCtrl.filter.osName = null;
			mainCtrl.filter.manufacture = null;
			
			if(searchParam.param_hostName) {
				mainCtrl.filter.hostName = searchParam.param_hostName;
			}
			
			if(searchParam.param_serialNumber) {
				mainCtrl.filter.serialNumber = searchParam.param_serialNumber;	
			}
			
			if(searchParam.param_nodeType) {
				mainCtrl.filter.nodeType = searchParam.param_nodeType;
			}
			
			if(searchParam.param_ip) {
				mainCtrl.filter.ip = searchParam.param_ip;
			}
			
			if(searchParam.param_osName) {
				mainCtrl.filter.osName = searchParam.param_osName;
			}
			
			if(searchParam.param_manufacture) {
				mainCtrl.filter.manufacture = searchParam.param_manufacture;
			}
			
			if(searchParam.param_TotalSearch != null  && searchParam.param_TotalSearch != undefined && searchParam.param_TotalSearch != ''){
				mainCtrl.filter.isDefault = "1";
				mainCtrl.filter.hostName = searchParam.param_TotalSearch;
				mainCtrl.filter.serialNumber = searchParam.param_TotalSearch;
				mainCtrl.filter.nodeType = searchParam.param_TotalSearch;
				mainCtrl.filter.ip = searchParam.param_TotalSearch;
				mainCtrl.filter.osName = searchParam.param_TotalSearch;
				mainCtrl.filter.manufacture = searchParam.param_TotalSearch;
			}
			
			mainCtrl.onSearch();
		};
		
		
		
		
		// 페이징 버튼 클릭 처리
		mainCtrl.selectPage = function() {
			mainCtrl.filter.pageIndex = mainCtrl.currentPage;
			getNodeList(mainCtrl.filter);
		};

		// Node 상세.
		mainCtrl.getNodeDetail = function(param){
            var request = {};
            request.nodeSeq = param.nodeSeq;
            PopupSearch.openNodeDetailPop(request);
        };
		
		// group list에서 클릭시 사용 node list
		mainCtrl.getNodeList = function(param) {
			$scope.selectedSeq = param;
			onNodeSearchInit();			
			
			mainCtrl.filter.pageCount = mainCtrl.itemsPerPage;
			mainCtrl.filter.groupId = $scope.selectedSeq;
	        DataService.httpPost("/main/getNodeList.json", mainCtrl.filter, refreshGridHandler);
	    };
		
		// group list에서 클릭시 검색조건 초기화
		mainCtrl.onNodeSearchInit = function() {
			mainCtrl.filter.pageCount = "";
			mainCtrl.filter.hostName = "";
			mainCtrl.filter.serialNumber = "";
			mainCtrl.filter.nodeType = "";
			mainCtrl.filter.ip = "";
			mainCtrl.filter.osName = "";
			mainCtrl.filter.manufacture = "";
	    };
		
		// event-handler
		// 윈도우 리사이즈.
		angular.element(window).on('resize', function () {
			setTimeout(function() {
				mainCtrl.gridApi.core.handleWindowResize();
            }, 300);
        });
		
		// function
		function getDashBoardStatus(){
			// dashBoard 정보 조회
            DataService.httpPost('/main/getDashBoardStatus', {}, function(result) {
                if (result.result == 1) {
                	mainCtrl.dashBoardStatus = result.data;
                }
            });
            ap($scope);
		};
		
		//group list 검색 
		function searchGroupList() {
    		// group 코드 리스트 조회
            DataService.httpPost('/main/getGroupList.json', {}, function(result) {
                if (result.result == 1) {
                	mainCtrl.groupList = result.data;
                }
            });
            ap($scope);
    	};
		
    	//node list 검색 
		function nodeDetailList() {
			onNodeSearchInit();
			getNodeList();
    	};
		
		//node list (필터기능)
		function getNodeList() {
			mainCtrl.filter.pageCount = mainCtrl.itemsPerPage;
	        DataService.httpPost("/main/getNodeList.json", mainCtrl.filter, refreshGridHandler);
        };
		
		
		// 초기화 버튼으로 검색조건 초기화
		function onNodeSearchInit(){
			mainCtrl.filter.pageCount = "";
			mainCtrl.filter.hostName = "";
			mainCtrl.filter.serialNumber = "";
			mainCtrl.filter.nodeType = "";
			mainCtrl.filter.ip = "";
			mainCtrl.filter.osName = "";
			mainCtrl.filter.manufacture = "";
	    };
		
		function refreshGridHandler(data) {
			var result = data.data;
        	
        	// 주어진 데이터를 통해 GRID 리프레쉬한다.
        	mainCtrl.gridOptions.data = result.list;
        	mainCtrl.totalPage = result.count;
            
            // select 0-index
            if (!mainCtrl.gridOptions.data || mainCtrl.totalPage == 0) {
                return;
            }            
            ap($scope);
        };
        
        
        // 검색 조건 설정
        function initializeTypeList() {
            $scope.typeList =  [
                {value:'hostName', label:'Host Name', input:'text', placeholder:"Please enter Host Name."},
                {value:'serialNumber', label:'	Serial Number', input:'text', placeholder:"Please enter Serial Number."},
                {value:'nodeType', label:'Type', input:'select', optionList:mainCtrl.searchServerTypeModel},
                {value:'ip', label:'IP', input:'text', placeholder:"Please enter IP."},
                {value:'osName', label:'OS Name', input:'text', placeholder:"Please enter OS Name."},
                {value:'manufacture', label:'Manufacture', input:'text', placeholder:"Please enter Manufacture."}
            ];
        };
        
		
		
		// node GRID 초기화.
		function gridNodeList(){
            var columnDefs = [{
                name: 'agreement_name',
                field: 'agreementName',
                displayName: $translate.instant("GROUP.GROUP"),
                width: 130,
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
                name: 'ip',
                field: 'ip',
                displayName: $translate.instant("GROUP.IP"),
                width: 130,
                cellClass: 'txt-c',
                headerCellClass: 'txt-c',
                enableColumnMenu: false,
                cellTooltip:true,
                headerTooltip:true
            },{
                name: 'model',
                field: 'model',
                displayName: "Model",
                width: 200,
                cellClass: 'txt-l',
                headerCellClass: 'txt-c',
                cellTooltip:true,
                headerTooltip:true,
                enableColumnMenu: false,
                headerTooltip:true
            },{
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
            },{
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
                name: 'manufacture',
                field: 'manufacture',
                displayName: $translate.instant("GROUP.MANUFACTURER"),
                width: 150,
                cellClass: 'txt-c',
                headerCellClass: 'txt-c',
                cellTooltip:true,
                headerTooltip:true,
                enableColumnMenu: false,
                headerTooltip:true
            }];
            
    		// GRID OPTIONS
            mainCtrl.gridOptions = {
                    columnDefs:columnDefs,
                    enableSorting: false,
                    //enableRowSelection: true, 
                    enableFullRowSelection:true,
                    enableRowHeaderSelection: false,
                    enableColumnResizing: true,
                    useExternalSorting: true,
                    multiSelect:false,
                    enableHorizontalScrollbar:uiGridConstants.scrollbars.ALWAYS,
                    excessRows:10,
                    rowHeight: 29.7,
                    appScopeProvider: {
                    	onRowDblClick: function(row) {
                            if (!row) {
                                return;
                            }
                            mainCtrl.getNodeDetail(row.entity);
                        }
                    },
                    onRegisterApi: function(gridApi){
                        mainCtrl.gridApi = gridApi;
                        mainCtrl.gridApi.core.on.sortChanged($scope, mainCtrl.sortChanged);
                    },
                    rowTemplate: "<div ng-dblclick=\"grid.appScope.onRowDblClick(row)\" ng-repeat=\"(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name\" class=\"ui-grid-cell\" ng-class=\"{ 'ui-grid-row-header-cell': col.isRowHeader }\" ui-grid-cell dbl-click-row></div>",
    		};
		};
		
		function initialize() {
			getDashBoardStatus();
			searchGroupList()
			gridNodeList();
			nodeDetailList("All");
			initializeTypeList();
		}
		
		initialize();

		$rootScope.stopInterval = $interval(function(){
			getDashBoardStatus()
		}, 60000);
		
	}]);
});