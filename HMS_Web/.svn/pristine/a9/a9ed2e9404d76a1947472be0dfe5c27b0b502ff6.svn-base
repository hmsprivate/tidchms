define(["app", "apps/change/change-model", "apps/change/change-filter-model"], function(app, TargetModel, ResourceFilter){
	app.controller("NodeHistoryDetailCtrl",["$scope", "DataService", "$translate", "uiGridConstants", "ngDialog", "$interval", "PopupSearch", "$rootScope",
		function($scope, DataService, $translate, uiGridConstants, ngDialog, $interval, PopupSearch, $rootScope) {
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
		nodeHistoryDetailCtrl.setDataInit = date.getFullYear() +"-"+ (parseInt(date.getMonth() + 1) < 10 ? "0" + parseInt(date.getMonth() + 1) : parseInt(date.getMonth())) +"-"+ date.getDate() + " " + "00:00:00";
        
		nodeHistoryDetailCtrl.searchHistoryConditions = {
				"nodeSeq" : null
				,"firstLastUpTime" : null
				,"endLastUpTime" : null
				,"influxCollectTime" : null
		};
        
		nodeHistoryDetailCtrl.onSearchInit = function() {
			nodeHistoryDetailCtrl.searchHistoryConditions.firstLastUpTime = nodeHistoryDetailCtrl.setDataInit;
			nodeHistoryDetailCtrl.searchHistoryConditions.endLastUpTime = nodeHistoryDetailCtrl.setDataInit;
			
			nodeHistoryDetailCtrl.dtSelectDataInit(nodeHistoryDetailCtrl.sTime);
			nodeHistoryDetailCtrl.dtSelectDataInit(nodeHistoryDetailCtrl.eTime);
	    };
        
		nodeHistoryDetailCtrl.searchHistory = function() {
			nodeHistoryDetailCtrl.searchHistoryConditions.firstLastUpTime = nodeHistoryDetailCtrl.sTime.getDateTime();
			nodeHistoryDetailCtrl.searchHistoryConditions.endLastUpTime = nodeHistoryDetailCtrl.eTime.getDateTime();
        	
            $http({
                method: "POST",
                url: "/popup/getNodeHistoryDataTime.json",
                data: nodeHistoryDetailCtrl.searchHistoryConditions,
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(function(data) {
                var result = data.data;
            	nodeHistoryDetailCtrl.gridHistoryOptions.data = result.data;
				
				//첫번째 정보로 이력 조회
				if(result.data.length > 0){
					nodeHistoryDetailCtrl.searchHistoryInfo(result.data[0].influxCollectTime);
				}
            });
        };
        
		nodeHistoryDetailCtrl.searchHistoryInfo = function(influxCollectTime) {
			nodeHistoryDetailCtrl.searchHistoryConditions.influxCollectTime = influxCollectTime
            $http({
                method: "POST",
                url: "/popup/searchHistoryInfo.json",
                data: nodeHistoryDetailCtrl.searchHistoryConditions,
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(function(data) {
                var result = data.data;
				nodeHistoryDetailCtrl.gridHistoryInfoOptions.data = result.data;
            });
        };
        
		nodeHistoryDetailCtrl.closePopup = function () {
        	popup.close();
        };

        // 그리드 옵션 설정
        function setGridHistoryOption() {
        	nodeHistoryDetailCtrl.gridHistoryOptions = {
        		enableRowSelection : true,
				enableRowHeaderSelection : false,
				multiSelect : false,
				modifierKeysToMultiSelect : false,
				noUnselect : true,
				enableColumnResizing : true,
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
                    enableSorting: false,
                    columnDefs: [{
                            name: 'metric_name',
                            field: 'metricName',
                            displayName: "Name",
                            enableColumnMenu: false,
                            cellTooltip: true,
                            cellClass: function(grid, row) {
                            	var flag = row.entity.changeFlag;
                            	
                            	if (flag == 1) {
                                	return 'bg-cell-c';
                            	}else{
                            		return 'txt-c';
                            	}
                            },
                            //cellClass: 'txt-c',
                            headerCellClass: 'txt-c',
                            headerTooltip: true
                            //width: 120
                        },{
                            name: 'metric_value',
                            field: 'metricValue',
                            displayName: "Value",
                            enableColumnMenu: false,
                            cellTooltip: true,
                            cellClass: function(grid, row) {
                            	var flag = row.entity.changeFlag;
                            	
                            	if (flag == 1) {
                                	return 'bg-cell-c';
                            	}else{
                            		return 'txt-c';
                            	}
                            },
                            //cellClass: 'txt-c',
                            headerCellClass: 'txt-c',
                            headerTooltip: true
                            //width: 120
                        },{
                            name: 'before_value',
                            field: 'beforeValue',
                            displayName: "Before Value",
                            enableColumnMenu: false,
                            cellTooltip: true,
                            cellClass: function(grid, row) {
                            	var flag = row.entity.changeFlag;
                            	
                            	if (flag == 1) {
                                	return 'bg-cell-c';
                            	}else{
                            		return 'txt-c';
                            	}
                            },
                            //cellClass: 'txt-c',
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
			if(typeof nodeSeq != "undefined"){
				nodeHistoryDetailCtrl.searchHistoryConditions.nodeSeq = nodeSeq;
        	}
        	$scope.searchHistory();
		}
		
		initialize();
	}]);
});