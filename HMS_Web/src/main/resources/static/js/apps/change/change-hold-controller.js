define(["app", "apps/change/change-model", "apps/change/change-filter-model"], function(app, TargetModel, ResourceFilter){
	app.controller("ChangeHoldCtrl",["$scope", "DataService", "$translate", "uiGridConstants", "ngDialog", "$interval", "PopupSearch", "$rootScope",
		function($scope, DataService, $translate, uiGridConstants, ngDialog, $interval, PopupSearch, $rootScope) {
		
		"use strict";
		
		var changeHoldCtrl = this;
		var nodeSeq  = null;
		 
		// 검색조건 객체.
		changeHoldCtrl.filter = new ResourceFilter();
		
		changeHoldCtrl.gridOptions = {};
		
		changeHoldCtrl.gridApi = null;
		
		// pagination.js
		// pagination-directive
		changeHoldCtrl.totalPage = 100;
		changeHoldCtrl.itemsPerPage = 20;
		changeHoldCtrl.maxSize = 10;
		changeHoldCtrl.currentPage = 1;
		
		/* server select box 검색*/
		changeHoldCtrl.searchServerTypeModel= [
			{label: "All", 			value: ""},
			{label: "VM", 			value: "VM"},
			{label: "PM", 			value: "PM"}
		];
		
		/*------------------------------------- 컬럼 정렬 처리-------------------------------------------------------*/
		// 컬럼별 정렬하기.
		changeHoldCtrl.sortChanged = function ( grid, sortColumns ) {
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
		        
		        changeHoldCtrl.filter.order = field;
		        changeHoldCtrl.filter.exp = exp;
		        changeHoldCtrl.filter.pageIndex = 1;
		        getHoldList(changeHoldCtrl.filter);
			}
	    };
		
		/*------------------------------------- 데이터 조회 처리-------------------------------------------------------*/
		
		// node 조회
		changeHoldCtrl.onNodeSearch = function(){
			changeHoldCtrl.filter.pageIndex = 1;
			changeHoldCtrl.filter.order = '';
			changeHoldCtrl.filter.exp = '';
	        
	        getHoldList(changeHoldCtrl.filter);
		};
		
		
		// 페이징 버튼 클릭 처리
		changeHoldCtrl.selectPage = function() {
			changeHoldCtrl.filter.pageIndex = changeHoldCtrl.currentPage;
			getHoldList(changeHoldCtrl.filter);
		};
		
		// Node 상세 팝업.
		changeHoldCtrl.getNodeDetail = function(param){
            var request = {};
            request.nodeSeq = param.nodeSeq;
            PopupSearch.openNodeDetailPop(request);
        };
		
		//Compare 팝업(row별)
		changeHoldCtrl.getRowCompare = function(param){
            var request = {};
            request.nodeSeq = param.nodeSeq;
            
            PopupSearch.openComparePop(request);
        };
		
		//선택한 Node Compare
		changeHoldCtrl.onCompareInfo = function(){
			var nodeSeqList = [];
        	var rows = changeHoldCtrl.gridApi.grid.api.grid.rows;
        	for(var i=0;i<rows.length;i++) {
        		var entity = rows[i].entity;
        		if(entity.checked) {
        			nodeSeqList.push(entity.nodeSeq);
        		}
        	}
        	
        	if(nodeSeqList.length == 0){
        		return false;
    		}
        	
        	var request = {};
            request.nodeSeqList = nodeSeqList;
            PopupSearch.openComparePop(request);
		};
		
		
		// reset버튼 클릭시 검색조건 초기화
		changeHoldCtrl.onNodeSearchInit = function() {
			changeHoldCtrl.filter.pageCount = "";
			changeHoldCtrl.filter.hostName = "";
			changeHoldCtrl.filter.serialNumber = "";
			changeHoldCtrl.filter.nodeType = "";
			changeHoldCtrl.filter.ip = "";
			changeHoldCtrl.filter.osName = "";
			changeHoldCtrl.filter.manufacture = "";
	    };
		
		// event-handler
		// 윈도우 리사이즈.
		/*angular.element(window).on('resize', function () {
			setTimeout(function() {
				changeHoldCtrl.gridPluginApi.core.handleWindowResize();
				changeHoldCtrl.gridTaskApi.core.handleWindowResize();
				changeHoldCtrl.gridApi.core.handleWindowResize();
            }, 300);
        });*/
		
		
		
		
		// function
    	
    	/*------------------------------------- grid data 조회-------------------------------------------------------*/
    	
    	//node list 검색 
		function nodeDetailList() {
			changeHoldCtrl.onNodeSearchInit();
			getHoldList();
    	};
		
		//node list (필터기능)
		function getHoldList() {
			changeHoldCtrl.filter.pageCount = changeHoldCtrl.itemsPerPage;
			changeHoldCtrl.filter.status = "Hold";
	        DataService.httpPost("/change/getChangeList.json", changeHoldCtrl.filter, refreshGridHandler);
        };
		
		
		// 초기화 버튼으로 검색조건 초기화
		function onSearchInit(){
			changeHoldCtrl.filter.pageCount = "";
			changeHoldCtrl.filter.hostName = "";
			changeHoldCtrl.filter.serialNumber = "";
			changeHoldCtrl.filter.nodeType = "";
			changeHoldCtrl.filter.ip = "";
			changeHoldCtrl.filter.osName = "";
			changeHoldCtrl.filter.manufacture = "";
	    };
		
		function refreshGridHandler(data) {
			var result = data.data;
        	
        	// 주어진 데이터를 통해 GRID 리프레쉬한다.
        	changeHoldCtrl.gridOptions.data = result.list;
    		changeHoldCtrl.gridOptions.data = result.list;
        	changeHoldCtrl.totalPage = result.count;
            
            // select 0-index

        		if (!changeHoldCtrl.gridOptions.data || changeHoldCtrl.totalPage == 0) {
                    return;
                }
            ap($scope);
        };
		
		
		/*------------------------------------- grid 초기화 처리-------------------------------------------------------*/
		// node GRID 초기화.
		function gridNodeHoldList(){
            var columnDefs = [{
				name : ' ',
				field : 'checked',
				cellTemplate : '<div class="ui-grid-cell-contents" style="padding: 2px 0px 0px 12px; "><input type="checkbox" ng-init="row.entity.checked=false" ng-model="row.entity.checked" style="position:relative;" ng-click="grid.appScope.onClickCheckbox(row)"/><label class="no-txt" /></div>',
				headerCellTemplate : '<div class="ui-grid-cell-contents" style="padding: 2px 0px 0px 12px; border-top:none"><input type="checkbox" ng-model="grid.appScope.allChecked" style="position:relative;z-index:99999;" ng-click="grid.appScope.onClickCheckboxHeader()" /><label class="no-txt" /></div>',
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
                name: 'host_name',
                field: 'hostName',
                displayName: $translate.instant("GROUP.HOST_NAME"),
                width: 110,
                cellClass: 'txt-c',
                headerCellClass: 'txt-c',
                enableColumnMenu: false,
                cellTooltip:true,
                headerTooltip:true
            }, {
                name: 'serialnumber',
                field: 'serialNumber',
                displayName: $translate.instant("GROUP.SERIAL_NUMBER"),
                width: 300,
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
                width: 80,
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
                name: 'os_architecture',
                field: 'osArchitecture',
                displayName: $translate.instant("GROUP.OS") + " "+ $translate.instant("GROUP.ARCHITECTURE"),
                width: 120,
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
            }, {
                name: 'status',
                field: 'status',
                displayName: "Status",
                width: 80,
                cellClass: 'txt-c',
                headerCellClass: 'txt-c',
                enableSorting:false,
                cellTooltip:true,
                headerTooltip:true,
                enableColumnMenu: false,
                headerTooltip:true
            }, {
                name: 'compare',
                field: 'compare',
                displayName: $translate.instant("CHANGE.COMPARE"),
                cellTemplate: '<div class="ui-grid-cell-contents"><button type="button" class="ico-md i-external-link" title="Compare" ng-click="grid.appScope.onCompareClick(row)"></button></div>',
                width: 100,
                cellClass: 'txt-c',
                headerCellClass: 'txt-c',
                enableSorting:false,
                cellTooltip:true,
                headerTooltip:true,
                enableColumnMenu: false,
                headerTooltip:true
            }];
            
    		// GRID OPTIONS
            changeHoldCtrl.gridOptions = {
            		columnDefs:columnDefs,
            		enableRowSelection : true,
    				enableRowHeaderSelection : false,
    				multiSelect : false,
    				modifierKeysToMultiSelect : false,
    				noUnselect : true,
    				enableColumnResizing : true,
    				enableHorizontalScrollbar:uiGridConstants.scrollbars.ALWAYS,
                    excessRows:10,
                    rowHeight: 30,
                    appScopeProvider: {
                        onCompareClick: function(row) {
                        	console.log(row.entity);

                        	changeHoldCtrl.getRowCompare(row.entity);
                        },
                        onClickCheckbox : function(row) {
    						console.log("row="+row.entity.nodeSeq);
    					},
    					onClickCheckboxHeader : function(row) {
    						var rows = changeHoldCtrl.gridApi.grid.api.grid.rows;
    						for (var i = 0; i < rows.length; i++) {
    							rows[i].entity.checked = changeHoldCtrl.gridApi.grid.appScope.allChecked;
    						}
    					},	
                    },
                    onRegisterApi: function(gridApi){
                        changeHoldCtrl.gridApi = gridApi;
                        changeHoldCtrl.gridApi.core.on.sortChanged($scope, changeHoldCtrl.sortChanged);
                    },
                    rowTemplate: "<div ng-dblclick=\"grid.appScope.onRowDblClick(row)\" ng-repeat=\"(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name\" class=\"ui-grid-cell\" ng-class=\"{ 'ui-grid-row-header-cell': col.isRowHeader }\" ui-grid-cell dbl-click-row></div>",
    		};
            
		};
		
		
		function initialize() {
			$interval.cancel($rootScope.stopInterval);
			gridNodeHoldList();
			getHoldList();
		};
		
		initialize();
        	
		
	}]);
});