define(["app", "apps/group/group-model", "apps/group/group-filter-model"], function(app, TargetModel, ResourceFilter){
	app.controller("PluginMgmtCtrl",["$scope", "DataService", "$translate", "uiGridConstants", "ngDialog", "$interval", "PopupSearch", "$rootScope",
		function($scope, DataService, $translate, uiGridConstants, ngDialog, $interval, PopupSearch, $rootScope) {
		
		"use strict";
		
		var pluginMgmtCtrl = this;
		var nodeSeq  = null;
		 
		// 검색조건 객체.
		pluginMgmtCtrl.filter = new ResourceFilter();
		
		pluginMgmtCtrl.groupList = [];
		
		pluginMgmtCtrl.gridPluginOptions = {};
		
		pluginMgmtCtrl.gridPluginApi = null;
		
		
		$scope.pluginTypes = ['Collector', 'Processor', 'Publisher'];
		$scope.checked_pluginType = [];
		$scope.selectedSeq = "";
		
		/* server select box 검색*/
		pluginMgmtCtrl.searchStatusTypeModel= [
			{label: "All", 				value: ""},
			{label: "loaded", 		value: "loaded"},
			{label: "unloaded", 	value: "unloaded"}
		];
		
		/*------------------------------------- 컬럼 정렬 처리-------------------------------------------------------*/
		// plugin 컬럼별 정렬하기.
		/*pluginMgmtCtrl.sortPluginChanged = function ( grid, sortColumns ) {
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
		        
		        pluginMgmtCtrl.filter.plugOrder = field;
		        pluginMgmtCtrl.filter.plugExp = exp;
		        getPluginList(pluginMgmtCtrl.filter);
			}
	    }*/
	
		/*------------------------------------- 데이터 조회 처리-------------------------------------------------------*/
		// plugin 조회
		pluginMgmtCtrl.onPluginSearch = function(){
			pluginMgmtCtrl.filter.plugOrder = '';
			pluginMgmtCtrl.filter.plugExp = '';
	        pluginMgmtCtrl.filter.pluginType = $scope.checked_pluginType;
	        getPluginFilterList(pluginMgmtCtrl.filter);
		};
		
		// reset버튼 클릭시 검색조건 초기화
		pluginMgmtCtrl.onSearchInit = function() {
			pluginMgmtCtrl.filter.pluginName = "";
			pluginMgmtCtrl.filter.pluginStatus = "";
			$scope.checked_pluginType = [];
	    };
		
		// fileUpload 팝업(plugin파일 업로드)
		pluginMgmtCtrl.fileUploadPopup = function(){
            var request = {};
            PopupSearch.openFileUploadPop(request);
        };
		
		//plugin 파일삭제
		pluginMgmtCtrl.onPluginDelete = function(){
			var pluginNameList = [];
        	var rows = pluginMgmtCtrl.gridPluginApi.grid.api.grid.rows;
        	
        	for(var i=0;i<rows.length;i++) {
        		var entity = rows[i].entity;
        		if(entity.checked) {
        			pluginNameList.push(entity.fileName);
        		}
        	}
        	
        	if(pluginNameList.length == 0){
        		alert("No data selected.");
        		return false;
    		}
        	deletePlugin(pluginNameList);
		};
		
		
		//플러그인 동기화 버튼 클릭시
		pluginMgmtCtrl.onPluginSync = function(){
			pluginMgmtCtrl.restInfo = {
    				"type" : "manager_plugin"
    		}
			
			DataService.httpPost('/plugin/sync.json', pluginMgmtCtrl.restInfo, function(result) {
                if (result.data == 'completed') {
                	$rootScope.getPluginList();
                }else{
                	alert(result.errorMessage);
                }
            });
		};
		
		// event-handler
		// 윈도우 리사이즈.
		/*angular.element(window).on('resize', function () {
			setTimeout(function() {
				pluginMgmtCtrl.gridPluginApi.core.handleWindowResize();
				pluginMgmtCtrl.gridTaskApi.core.handleWindowResize();
				pluginMgmtCtrl.gridNodeApi.core.handleWindowResize();
            }, 300);
        });*/
		
		// function
    	/*------------------------------------- grid data 조회-------------------------------------------------------*/
    	
    	//plugin list 검색 
		function pluginDetailList() {
			$rootScope.getPluginList();
    	};
		
		//plugin list (처음 조회시 pluginType은 조회안하게 처리함)
    	$rootScope.getPluginList = function() {
			pluginMgmtCtrl.filter.pluginType = null;
	        DataService.httpPost("/plugin/getPluginList.json", pluginMgmtCtrl.filter, function(result) {
                if (result.result == 1) {
                	pluginMgmtCtrl.gridPluginOptions.data = result.data;
                }
            });
            ap($scope);
        };
        
        //plugin list
  		function getPluginFilterList() {
  	        DataService.httpPost("/plugin/getPluginList.json", pluginMgmtCtrl.filter, function(result) {
                  if (result.result == 1) {
                  	pluginMgmtCtrl.gridPluginOptions.data = result.data;
                  }
              });
              ap($scope);
          };
		
		// 초기화 버튼으로 검색조건 초기화
		function onSearchInit(){
			pluginMgmtCtrl.filter.pluginName = "";
			pluginMgmtCtrl.filter.pluginStatus = "";
			$scope.checked_pluginType = ['Collector', 'Processor', 'Publisher'];
	    };
		
	    //plugin file delete
		function deletePlugin(pluginNameList) {
			if(!confirm("Are you sure you want to delete the selected plugin?")) {
        		return false;
        	}
			
			pluginMgmtCtrl.deletePluginInfo = {
    				"pluginNameList" : pluginNameList
    		}
			
    		// plugin 삭제
            DataService.httpPost('/plugin/deletePlugin.json', pluginMgmtCtrl.deletePluginInfo, function(result) {
                if (result.result == 1) {
                	alert("It has been deleted.");
                	$rootScope.getPluginList();
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
				headerCellTemplate : '<div class="ui-grid-cell-contents" style="padding: 2px 0px 0px 12px; border-top:none"><input type="checkbox" ng-model="grid.appScope.allChecked" style="position:relative;z-index:99999;" ng-click="grid.appScope.onClickCheckboxHeader()" /><label class="no-txt" /></div>',
				width : 40,
				resizable : false,
				enableColumnMenu : false,
				enableSorting : false,
				cellTooltip : true,
				headerTooltip : true
			},{
                name: 'load',
                field: 'load',
                displayName: $translate.instant("COMMON.LOAD"),
                cellTemplate: '<div class="ui-grid-cell-contents" style="padding-left:5px"><button type="button" class="btn-gy" title="Load" ng-click="grid.appScope.onLoadPlugin(row)" >Load</button></div>',
                width: 80,
                cellClass: 'txt-c',
                headerCellClass: 'txt-c',
                enableSorting:false,
                cellTooltip:true,
                headerTooltip:true,
                enableColumnMenu: false,
                headerTooltip:true
            }, {
                name: 'plugin_name',
                field: 'pluginName',
                displayName: $translate.instant("COMMON.NAME"),
                //width: 110,
                cellClass: 'txt-c',
                headerCellClass: 'txt-c',
                enableColumnMenu: false,
                cellTooltip:true,
                headerTooltip:true
            }, {
                name: 'plugin_version',
                field: 'pluginVersion',
                displayName: $translate.instant("GROUP.VERSION"),
                //width: 80,
                cellClass: 'txt-c',
                headerCellClass: 'txt-c',
                enableColumnMenu: false,
                cellTooltip:true,
                headerTooltip:true
            }, {
                name: 'plugin_type',
                field: 'pluginType',
                displayName: $translate.instant("GROUP.TYPE"),
                //width: 130,
                cellClass: 'txt-c',
                headerCellClass: 'txt-c',
                enableColumnMenu: false,
                cellTooltip:true,
                headerTooltip:true
            }, {
                name: 'file_name',
                field: 'fileName',
                displayName: $translate.instant("PLUGIN.FILE_NAME"),
                //width: 130,
                cellClass: 'txt-l',
                headerCellClass: 'txt-c',
                enableColumnMenu: false,
                cellTooltip:true,
                headerTooltip:true
            }, {
                name: 'plugin_loaded_timestamp',
                field: 'pluginLoadedTimestamp',
                displayName: $translate.instant("PLUGIN.LOADED") + " "+ $translate.instant("COMMON.TIMESTAMP") ,
                //width: 200,
                cellClass: 'txt-c',
                headerCellClass: 'txt-c',
                enableColumnMenu: false,
                cellTooltip:true,
                headerTooltip:true
            }, {
                name: 'last_up_time',
                field: 'lastUpTime',
                displayName: $translate.instant("PLUGIN.UPDATE_DATE"),
                cellTooltip:true,
                headerTooltip:true,
                //width: 200,
                cellClass: 'txt-c',
                headerCellClass: 'txt-c',
                enableColumnMenu: false,
                headerTooltip:true
            }];
            
    		// plugin GRID OPTIONS
            pluginMgmtCtrl.gridPluginOptions = {
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
                    enableSorting: false,
                    appScopeProvider: {
                        onRowClick: function(row) {
                            if (!row) {
                                return;
                            }
                            //pluginMgmtCtrl.filter.reqId = row.entity.reqId;
                            //pluginMgmtCtrl.filter.phase = null;
            	 			//pluginMgmtCtrl.filter.serviceName = null;
                            
                            //pluginMgmtCtrl.getNodeDetail(row.entity);
                        },
                        onClickCheckbox : function(row) {
    						console.log(row);
    					},
    					onClickCheckboxHeader : function(row) {
    						var rows = pluginMgmtCtrl.gridPluginApi.grid.api.grid.rows;
    						for (var i = 0; i < rows.length; i++) {
    							rows[i].entity.checked = pluginMgmtCtrl.gridPluginApi.grid.appScope.allChecked;
    						}
    					},
    					onLoadPlugin: function(row){
    						var fileName = row.entity.fileName;
    						
    						if(!confirm("Do you want to load the [" + fileName + "] file?")) {
    			        		return false;
    			        	}
    						
    						pluginMgmtCtrl.loadPluginInfo = {
    			    				"apiType" : "/v1/plugins"
    			    				,"pluginFileName" : fileName
    			    		}
    						
    			    		// plugin load 및 테이블 데이터 업데이트
    			            DataService.httpPost('/plugin/loadPlugin.json', pluginMgmtCtrl.loadPluginInfo, function(result) {
    			                if (result.result == 1) {
    			                	var result = JSON.parse(result.data);
    			                	
    			                	if (result.meta.code == 200) {
    			                		//sync api 호출 후 화면 리로드 작업
    			                		$rootScope.getPluginList();
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
                        pluginMgmtCtrl.gridPluginApi = gridApi;
                        //pluginMgmtCtrl.gridPluginApi.core.on.sortChanged($scope, pluginMgmtCtrl.sortPluginChanged);
                    },
                    rowTemplate: "<div ng-dblclick=\"grid.appScope.onRowClick(row)\" ng-repeat=\"(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name\" class=\"ui-grid-cell\" ng-class=\"{ 'ui-grid-row-header-cell': col.isRowHeader }\" ui-grid-cell dbl-click-row></div>",
    		};
		};
		
		function initialize() {
			$interval.cancel($rootScope.stopInterval);
			gridPluginList();	//plugin grid setting
			pluginDetailList();	//plugin 데이터 조회
		};
		
		initialize();
	}]);
});