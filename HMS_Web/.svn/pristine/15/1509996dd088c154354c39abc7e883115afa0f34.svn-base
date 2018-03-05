define(["app", "apps/change/change-model", "apps/change/change-filter-model"], function(app, TargetModel, ResourceFilter){
	app.controller("ChangeMgmtCtrl",["$scope", "DataService", "$translate", "uiGridConstants", "ngDialog", "$interval", "PopupSearch", "$rootScope", "$route",
		function($scope, DataService, $translate, uiGridConstants, ngDialog, $interval, PopupSearch, $rootScope, $route) {
		"use strict";
		
		var changeMgmtCtrl = this;
		var nodeSeq  = null;
		 
		// 검색조건 객체.
		changeMgmtCtrl.filter = new ResourceFilter();
		
		changeMgmtCtrl.gridOptions = {};
		
		changeMgmtCtrl.gridApi = null;
		
		// pagination.js
		// pagination-directive
		changeMgmtCtrl.totalPage = 100;
		changeMgmtCtrl.itemsPerPage = 24;
		changeMgmtCtrl.maxSize = 10;
		changeMgmtCtrl.currentPage = 1;
		
		/* server select box 검색*/
		//agent grouplist select box
		changeMgmtCtrl.searchGroupModel= [];
		
		$scope.typeList = [];
		
		/* server select box 검색*/
		changeMgmtCtrl.searchServerTypeModel= [
			{label: "All", 			value: ""},
			{label: "VM", 			value: "VM"},
			{label: "PM", 			value: "PM"}
		];
		
		/*------------------------------------- 컬럼 정렬 처리-------------------------------------------------------*/
		// 컬럼별 정렬하기.
		changeMgmtCtrl.sortChanged = function ( grid, sortColumns ) {
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
		        
		        changeMgmtCtrl.filter.order = field;
		        changeMgmtCtrl.filter.exp = exp;
		        changeMgmtCtrl.filter.pageIndex = 1;
		        getList(changeMgmtCtrl.filter);
			}
	    };
		
		/*------------------------------------- 데이터 조회 처리-------------------------------------------------------*/
		
		// node 조회
		changeMgmtCtrl.onSearch = function(){
			changeMgmtCtrl.filter.pageIndex = 1;
			changeMgmtCtrl.filter.order = '';
			changeMgmtCtrl.filter.exp = '';
	        
	        getList(changeMgmtCtrl.filter);
		};
		
		
		// 페이징 버튼 클릭 처리
		changeMgmtCtrl.selectPage = function() {
			changeMgmtCtrl.filter.pageIndex = changeMgmtCtrl.currentPage;
			getList(changeMgmtCtrl.filter);
		};
		
		// Node history 상세 팝업.
		changeMgmtCtrl.getNodeHistoryDetail = function(param){
			$scope.popup = ngDialog.open({
				template: '/node-history-detail-info',
                className:"ngdialog-theme-default",
                showClose:false,
                disableAnimation: true,
                cache:false,
                closeByDocument:false,
                closeByEscape:false, 
                scope:$scope,
                data:param
            });  
        };
		
		// reset버튼 클릭시 검색조건 초기화
		changeMgmtCtrl.onSearchInit = function() {
			changeMgmtCtrl.filter.pageCount = "";
			changeMgmtCtrl.filter.agreementSeq = "0";
			changeMgmtCtrl.filter.hostName = "";
			changeMgmtCtrl.filter.serialNumber = "";
			changeMgmtCtrl.filter.nodeType = "";
			changeMgmtCtrl.filter.ip = "";
			changeMgmtCtrl.filter.osName = "";
			changeMgmtCtrl.filter.manufacture = "";
	    };
		
		//새로고침
		changeMgmtCtrl.reload = function(url) {
			if(window.location.pathname + window.location.hash  == url) {
				$route.reload();
			} else {
				window.location = url;
			}
		};
		
		changeMgmtCtrl.update = function() {
			changeMgmtCtrl.filter.pageIndex = 1;
	        DataService.httpPost("/change/getChangeList.json", changeMgmtCtrl.filter, refreshGridHandler);
		};
		
		// event-handler
		
		
		// function
    	
    	/*------------------------------------- grid data 조회-------------------------------------------------------*/
		//group list 검색 
		function searchGroupList() {
    		// group 코드 리스트 조회
            DataService.httpPost('/agent/getCommonGroupList.json', {}, function(result) {
                if (result.result == 1) {
                	changeMgmtCtrl.searchGroupModel = result.data;
                	changeMgmtCtrl.filter.agreementSeq = '0';
                	initializeTypeList();
                }
            });
    	};
		
		//node list (필터기능)
		function getList() {
			changeMgmtCtrl.filter.pageCount = changeMgmtCtrl.itemsPerPage;
	        DataService.httpPost("/change/getChangeList.json", changeMgmtCtrl.filter, refreshGridHandler);
        };
		
		function refreshGridHandler(data) {
			var result = data.data;
        	
        	// 주어진 데이터를 통해 GRID 리프레쉬한다.
        	changeMgmtCtrl.gridOptions.data = result.list;
    		changeMgmtCtrl.gridOptions.data = result.list;
        	changeMgmtCtrl.totalPage = result.count;
            
            // select 0-index

    		if (!changeMgmtCtrl.gridOptions.data || changeMgmtCtrl.totalPage == 0) {
                return;
            }
            ap($scope);
        };
        
        
        //통합검색
  		$scope.getSearchCondition = function(searchParam){
  			
  			changeMgmtCtrl.filter.isDefault = "-1";
  			changeMgmtCtrl.filter.agreementSeq = null;
  			changeMgmtCtrl.filter.hostName = null;
  			changeMgmtCtrl.filter.serialNumber = null;
  			changeMgmtCtrl.filter.nodeType = null;
  			changeMgmtCtrl.filter.ip = null;
  			changeMgmtCtrl.filter.osName = null;
  			changeMgmtCtrl.filter.manufacture = null;
  			
  			if(searchParam.param_agreementSeq) {
  				changeMgmtCtrl.filter.agreementSeq = searchParam.param_agreementSeq;
  			}
  			
  			if(searchParam.param_hostName) {
  				changeMgmtCtrl.filter.hostName = searchParam.param_hostName;
  			}
  			
  			if(searchParam.param_serialNumber) {
  				changeMgmtCtrl.filter.serialNumber = searchParam.param_serialNumber;	
  			}
  			
  			if(searchParam.param_nodeType) {
  				changeMgmtCtrl.filter.nodeType = searchParam.param_nodeType;
  			}
  			
  			if(searchParam.param_ip) {
  				changeMgmtCtrl.filter.ip = searchParam.param_ip;
  			}
  			
  			if(searchParam.param_osName) {
  				changeMgmtCtrl.filter.osName = searchParam.param_osName;
  			}
  			
  			if(searchParam.param_manufacture) {
  				changeMgmtCtrl.filter.manufacture = searchParam.param_manufacture;
  			}
  			
  			if(searchParam.param_TotalSearch != null  && searchParam.param_TotalSearch != undefined && searchParam.param_TotalSearch != ''){
  				changeMgmtCtrl.filter.isDefault = "1";
  				changeMgmtCtrl.filter.agreementSeq = searchParam.param_TotalSearch;
  				changeMgmtCtrl.filter.hostName = searchParam.param_TotalSearch;
  				changeMgmtCtrl.filter.serialNumber = searchParam.param_TotalSearch;
  				changeMgmtCtrl.filter.nodeType = searchParam.param_TotalSearch;
  				changeMgmtCtrl.filter.ip = searchParam.param_TotalSearch;
  				changeMgmtCtrl.filter.osName = searchParam.param_TotalSearch;
  				changeMgmtCtrl.filter.manufacture = searchParam.param_TotalSearch;
  			}
  			
  			getList();
  		};
        
        // 검색 조건 설정
		function initializeTypeList() {
		    $scope.typeList =  [
		    	{value:'agreementSeq', label:'Group', input:'select', optionList:changeMgmtCtrl.searchGroupModel},
		        {value:'hostName', label:'Host Name', input:'text', placeholder:"Please enter Host Name."},
		        {value:'serialNumber', label:'	Serial Number', input:'text', placeholder:"Please enter Serial Number."},
		        {value:'nodeType', label:'Type', input:'select', optionList:changeMgmtCtrl.searchServerTypeModel},
		        {value:'ip', label:'IP', input:'text', placeholder:"Please enter IP."},
		        {value:'osName', label:'OS Name', input:'text', placeholder:"Please enter OS Name."},
		        {value:'manufacture', label:'Manufacture', input:'text', placeholder:"Please enter Manufacture."}
		    ];
		};
		
		
		/*------------------------------------- grid 초기화 처리-------------------------------------------------------*/
		// node GRID 초기화.
		function gridList(){
            var columnDefs = [{
                name: 'last_change_time',
                field: 'lastChangeTime',
                displayName: $translate.instant("GROUP.TIME"),
                width: 150,
                cellClass: 'txt-c',
                headerCellClass: 'txt-c',
                enableColumnMenu: false,
                cellTooltip:true,
                headerTooltip:true
            },{
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
                width: 150,
                cellClass: 'txt-c',
                headerCellClass: 'txt-c',
                cellTooltip:true,
                headerTooltip:true,
                enableColumnMenu: false,
                headerTooltip:true
            }];
            
    		// GRID OPTIONS
            changeMgmtCtrl.gridOptions = {

                    columnDefs:columnDefs,
                    enableFullRowSelection:true,
                    enableRowHeaderSelection: false,
                    enableColumnResizing: true,
                    useExternalSorting: true,
                    multiSelect:false,
                    //enableHorizontalScrollbar:uiGridConstants.scrollbars.ALWAYS,
                    excessRows:10,
                    rowHeight: 29.6,
                    appScopeProvider: {
                    	onRowDblClick: function(row) {
                            if (!row) {
                                return;
                            }
                            //console.log(row.entity);
                            
                            //이력 정보 조회 팝업
                            changeMgmtCtrl.getNodeHistoryDetail(row.entity);
                        }
                    },
                    onRegisterApi: function(gridApi){
                    	changeMgmtCtrl.gridApi = gridApi;
                        changeMgmtCtrl.gridApi.core.on.sortChanged($scope, changeMgmtCtrl.sortChanged);
                    },
                    rowTemplate: "<div ng-dblclick=\"grid.appScope.onRowDblClick(row)\" ng-repeat=\"(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name\" class=\"ui-grid-cell\" ng-class=\"{ 'ui-grid-row-header-cell': col.isRowHeader }\" ui-grid-cell dbl-click-row></div>",
    		};
		};
		
		function initialize() {
			$interval.cancel($rootScope.stopInterval);
			searchGroupList();
			gridList();
			getList();
		};
		
		initialize();
	}]);
	
	
	
	
	app.controller("NodeHistoryDetailCtrl",["$scope", "$http", "DataService", "$translate", "uiGridConstants", "ngDialog", "$interval", "PopupSearch", "$rootScope",
		function($scope, $http, DataService, $translate, uiGridConstants, ngDialog, $interval, PopupSearch, $rootScope) {
		"use strict";
		
		var nodeHistoryDetailCtrl = this;
		var nodeSeq  = null;
		 
		// 검색조건 객체.
		nodeHistoryDetailCtrl.filter = new ResourceFilter();
		nodeHistoryDetailCtrl.sTime = {};
		nodeHistoryDetailCtrl.eTime = {};
		
		nodeHistoryDetailCtrl.gridHistoryOptions = {};
		nodeHistoryDetailCtrl.gridHistoryInfoOptions = {};
		
		nodeHistoryDetailCtrl.gridHistoryTimeApi = null;
		nodeHistoryDetailCtrl.gridHistoryTimeInfoApi = null;
		
		nodeHistoryDetailCtrl.dtSelectInit = function(target, location) {
			target.dataLocation(location);
			target.enable(false);
        };
		
		nodeHistoryDetailCtrl.dtSelectDataInit = function(target) {
			target.getDateInit();
		};
    	
		var date = new Date();
		nodeHistoryDetailCtrl.setEndDataInit = moment(nodeHistoryDetailCtrl.setStartDataInit).format("YYYY-MM-DD") + " " + "00:00:00";
		nodeHistoryDetailCtrl.setStartDataInit = moment(nodeHistoryDetailCtrl.setEndDataInit).subtract(7, 'day').format("YYYY-MM-DD") + " " + "00:00:00";
        
		nodeHistoryDetailCtrl.onSearchInit = function() {
			nodeHistoryDetailCtrl.filter.firstLastUpTime = nodeHistoryDetailCtrl.setStartDataInit;
			nodeHistoryDetailCtrl.filter.endLastUpTime = nodeHistoryDetailCtrl.setEndDataInit;
			
			nodeHistoryDetailCtrl.dtSelectDataInit(nodeHistoryDetailCtrl.sTime);
			nodeHistoryDetailCtrl.dtSelectDataInit(nodeHistoryDetailCtrl.eTime);
	    };
        
		nodeHistoryDetailCtrl.searchHistoryInfo = function(influxCollectTime) {
			nodeHistoryDetailCtrl.filter.influxCollectTime = influxCollectTime
            $http({
                method: "POST",
                url: "/popup/searchHistoryInfo.json",
                data: nodeHistoryDetailCtrl.filter,
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(function(data) {
                var result = data.data;
                if (result.result == 1) {
					console.log(result);
					nodeHistoryDetailCtrl.gridHistoryInfoOptions = {"data" : result.data}
				} else {
					alert(result.errorMessage);
				}
            });
        };
        
		nodeHistoryDetailCtrl.closePopup = function () {
			$scope.popup.close();
        };
		
		
		//조회
		nodeHistoryDetailCtrl.onSearch = function(){
			
			if(nodeHistoryDetailCtrl.filter.firstLastUpTime == null || nodeHistoryDetailCtrl.filter.firstLastUpTime == ""){
				nodeHistoryDetailCtrl.filter.firstLastUpTime = nodeHistoryDetailCtrl.setStartDataInit;
			}else{
				nodeHistoryDetailCtrl.filter.firstLastUpTime = nodeHistoryDetailCtrl.sTime.getDateTime();
			}
			
			if(nodeHistoryDetailCtrl.filter.endLastUpTime == null || nodeHistoryDetailCtrl.filter.endLastUpTime == ""){
				nodeHistoryDetailCtrl.filter.endLastUpTime = nodeHistoryDetailCtrl.setEndDataInit;
			}else{
				nodeHistoryDetailCtrl.filter.endLastUpTime = nodeHistoryDetailCtrl.eTime.getDateTime();
			}
			
			searchHistory(nodeHistoryDetailCtrl.filter);
		};
		
		function searchHistory() {
	        DataService.httpPost("/popup/getNodeHistoryDataTime.json", nodeHistoryDetailCtrl.filter, refreshGridHandler);
        };
        
        
        function refreshGridHandler(data) {
			var result = data.data;
        	console.log(result);
        	
        	// 주어진 데이터를 통해 GRID 리프레쉬한다.
        	nodeHistoryDetailCtrl.gridHistoryOptions.data = result;
            
            // select 0-index
            if (!nodeHistoryDetailCtrl.gridHistoryOptions.data) {
                return;
            }
            
            //첫번째 정보로 이력 조회
			if(result.length > 0){
				nodeHistoryDetailCtrl.searchHistoryInfo(result[0].influxCollectTime);
			}else{
				nodeHistoryDetailCtrl.gridHistoryInfoOptions.data = result;
			}
            ap($scope);
        }

        // 그리드 옵션 설정
        function setGridHistoryOption() {
        	nodeHistoryDetailCtrl.gridHistoryOptions = {
        		enableRowSelection : true,
				enableRowHeaderSelection : false,
				multiSelect : false,
				modifierKeysToMultiSelect : false,
				noUnselect : true,
				enableColumnResizing : true,
				enableHorizontalScrollbar:uiGridConstants.scrollbars.NEVER,
                excessRows:10,
                rowHeight: 30,
                enableSorting: false,
                rowTemplate: "<div ng-click=\"grid.appScope.historyInfo(row)\" ng-repeat=\"(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name\" class=\"ui-grid-cell\" ng-class=\"{ 'ui-grid-row-header-cell': col.isRowHeader }\" ui-grid-cell></div>",
                columnDefs: [{
                        name: 'influx_collect_time',
                        field: 'influxCollectTime',
                        displayName: "Data Time",
                        enableColumnMenu: false,
                        cellTooltip: true,
                        /*cellClass: function(grid, row) {
                        	var flag = row.entity.changeFlag;
                        	
                        	if (flag == 1) {
                            	return 'bg-cell-c';
                        	}else{
                        		return 'txt-c';
                        	}
                        },*/
                        cellClass: 'txt-c',
                        headerCellClass: 'txt-c',
                        headerTooltip: true
                        //width: 120
                    }
                ],
                appScopeProvider: {
                	selectedData: function(row) {
                		nodeHistoryDetailCtrl.selectedData = row.data;
                		nodeHistoryDetailCtrl.showDataPop = true;
                    },
                    historyInfo : function(row){
                    	//alert(row.entity.influxCollectTime);
                    	nodeHistoryDetailCtrl.searchHistoryInfo(row.entity.influxCollectTime);
                    }
                    
                },
                onRegisterApi: function(gridApi){
                	nodeHistoryDetailCtrl.gridHistoryTimeApi = gridApi;
                }
            };
            
            
            
        	nodeHistoryDetailCtrl.gridHistoryInfoOptions = {
            		enableRowSelection : true,
    				enableRowHeaderSelection : false,
    				multiSelect : false,
    				modifierKeysToMultiSelect : false,
    				noUnselect : true,
    				enableColumnResizing : true,
                    excessRows:10,
                    rowHeight: 30,
                    enableHorizontalScrollbar:uiGridConstants.scrollbars.NEVER,
                    enableSorting: false,
                    columnDefs: [{
                            name: 'metric_name',
                            field: 'metricName',
                            displayName: "Name",
                            enableColumnMenu: false,
                            cellTooltip: true,
                            /*cellClass: function(grid, row) {
                            	var flag = row.entity.changeFlag;
                            	
                            	if (flag == 1) {
                                	return 'bg-cell-l';
                            	}else{
                            		return 'txt-l';
                            	}
                            },*/
                            cellClass: 'txt-l',
                            headerCellClass: 'txt-c',
                            headerTooltip: true
                            //width: 120
                        },{
                            name: 'metric_value',
                            field: 'metricValue',
                            displayName: "Value",
                            enableColumnMenu: false,
                            cellTooltip: true,
                            /*cellClass: function(grid, row) {
                            	var flag = row.entity.changeFlag;
                            	
                            	if (flag == 1) {
                                	return 'bg-cell-c';
                            	}else{
                            		return 'txt-c';
                            	}
                            },*/
                            cellClass: 'txt-c',
                            headerCellClass: 'txt-c',
                            headerTooltip: true
                            //width: 120
                        },{
                            name: 'before_value',
                            field: 'beforeValue',
                            displayName: "Old Value",
                            enableColumnMenu: false,
                            cellTooltip: true,
                            /*cellClass: function(grid, row) {
                            	var flag = row.entity.changeFlag;
                            	
                            	if (flag == 1) {
                                	return 'bg-cell-c';
                            	}else{
                            		return 'txt-c';
                            	}
                            },*/
                            cellClass: 'txt-c',
                            headerCellClass: 'txt-c',
                            headerTooltip: true
                            //width: 120
                        }
                        
                    ],
                    appScopeProvider: {
                    	selectedData: function(row) {
                    		nodeHistoryDetailCtrl.selectedData = row.data;
                    		nodeHistoryDetailCtrl.showDataPop = true;
                        },
                        
                    },
                    onRegisterApi: function(gridApi){
                    	nodeHistoryDetailCtrl.gridHistoryTimeInfoApi = gridApi;
                    }
                };
        };
		
		function initialize() {
			setGridHistoryOption();
			nodeHistoryDetailCtrl.filter.nodeSeq = $scope.$parent.ngDialogData.nodeSeq;
			searchHistory();
			//nodeHistoryDetailCtrl.onSearch();
		}
		initialize();
	}]);
});