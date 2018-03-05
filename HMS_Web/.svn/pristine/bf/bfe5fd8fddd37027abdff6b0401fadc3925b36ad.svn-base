define([], function() {
    return function(ngDialog, $translate, $rootScope) {
        'use strict';
        
        return {

        	//Node Detail Popup
            openNodeDetailPop: function(nodeSeq) {
            	

                var popup = ngDialog.open({
                    template: '/node-detail-info',
                    className:"ngdialog-theme-default custom-width",
                    disableAnimation: true,
                    cache:false,
                    showClose: false,
                    closeByDocument:false,
                    closeByEscape:false, 
                    controller: ['$scope', "$http", "uiGridConstants", "DataService", function($scope, $http, uiGridConstants, DataService) {

                        $scope.searchConditions = {
                				"nodeSeq" : null
                				,"nodeMetricList" : null
                				,"mainCatInfo" : null
                		}
                        $scope.selectCategoryOptions = [];
                        $scope.selectCategoryOptions2 = [];
                        
                        $scope.searchCategoryList = function() {
                            $http({
                                method: "POST",
                                url: "/popup/getCategoryList.json",
                                data: $scope.searchConditions.nodeSeq,
                                headers: {
                                    "Content-Type": "application/json"
                                }
                            }).then(function(data) {
                                var result = data.data;
                                var list;
                                
                            	for(var i = 0; i < result.data.length; i++){
                            		$scope.selectCategoryOptions.push(result.data[i]);
                            	}
                            });
                        }
                        
                        $scope.searchCategoryList2 = function() {
                            $http({
                                method: "POST",
                                url: "/popup/getCategoryList2.json",
                                data: $scope.searchConditions.nodeSeq,
                                headers: {
                                    "Content-Type": "application/json"
                                }
                            }).then(function(data) {
                                var result = data.data;
                                
                            	for(var i = 0; i < result.data.length; i++){
                            		$scope.selectCategoryOptions2.push(result.data[i]);
                            	}
                            });
                        };
                        
                        
                        
                        $scope.searchCategoryList3 = function() {
                        	$scope.searchConditions.nodeSeq = nodeSeq.nodeSeq;
                            $http({
                                method: "POST",
                                url: "/popup/getCategoryList2.json",
                                data: $scope.searchConditions,
                                headers: {
                                    "Content-Type": "application/json"
                                }
                            }).then(function(data) {
                                var result = data.data;
                                $scope.selectCategoryOptions2 =[]; 
                            	for(var i = 0; i < result.data.length; i++){
                            		$scope.selectCategoryOptions2.push(result.data[i]);
                            	}
                            });
                        };
                        
                        
                        
                        $scope.search = function() {
                            $http({
                                method: "POST",
                                url: "/popup/getNodeDetailList.json",
                                data: $scope.searchConditions.nodeSeq,
                                headers: {
                                    "Content-Type": "application/json"
                                }
                            }).then(function(data) {
                                var result = data.data;
								$scope.gridOptions.data = result.data;
                            });
                        };
                        
                        $scope.closePopup = function () {
                        	popup.close();
                        };
                        
                        $scope.onNodeChange = function () {
                        	var nodeMetricList = [];
                        	var rows = $scope.gridApi.grid.api.grid.rows;
                        	
                        	
                        	for(var i=0;i<rows.length;i++) {
                        		var entity = rows[i].entity;
                        		if(entity.checked) {
                        			nodeMetricList.push(entity.metricName);
                        		}
                        	}
                        	
                        	if(nodeMetricList.length == 0){
                        		alert("No data selected.");
                        		return false;
                    		}
                        	
                        	$scope.searchConditions.nodeMetricList = nodeMetricList;
                        	$scope.searchConditions.nodeSeq = nodeSeq.nodeSeq;
                        	
                        	DataService.httpPost("/popup/updateChangeNode.json", $scope.searchConditions, function(result) {
                                if (result.result == 1) {
                                	//alert("적용 되었습니다.");
                                	$scope.closePopup();
                                }else{
                                	alert(result.errorMessage);
                                }
                            });
                            ap($scope);
                        };

                        // 그리드 옵션 설정
                        function setGridOption() {
                            $scope.gridOptions = {
                            	enableColumnMenus : false,	
                        		enableRowSelection : true,
                				enableRowHeaderSelection : false,
                				enableFiltering: true,
                				enableColumnResizing : true,
                                excessRows:10,
                                rowHeight: 30,
                                enableSorting: false,	
                                //useExternalFiltering : true,
                                columnDefs: [{
	                                    name: 'metric_dir',
	                                    field: 'metricDir',
	                                    displayName: 'Main Category',
	                                    enableColumnMenu: false,
	                                    filter: {
	                                        term: '',
	                                        disableCancelFilterButton: true,
	                                        type: uiGridConstants.filter.SELECT,
	                                        selectOptions: $scope.selectCategoryOptions
	                                    },
	                                    cellTooltip: true,
	                                    cellTemplate : '<div class="ui-grid-cell-contents ng-binding ng-scope" ng-style="grid.appScope.getCat1Style(row)">{{grid.appScope.getCat1Content(row)}}</div>',
	                                    cellClass: 'txt-l',
	                                    headerCellClass: 'txt-c',
	                                    headerTooltip: true,
	                                    enableSorting : false,
	                                    width: 150
	                                },{
	                                    name: 'metric_dir2',
	                                    field: 'metricDir2',
	                                    displayName: 'Sub Category',
	                                    enableColumnMenu: false,
	                                    filter: {
	                                        term: '',
	                                        disableCancelFilterButton: true,
	                                        type: uiGridConstants.filter.SELECT,
	                                        selectOptions: $scope.selectCategoryOptions2
	                                    },
	                                    cellTooltip: true,
	                                    cellTemplate : '<div class="ui-grid-cell-contents ng-binding ng-scope" ng-style="grid.appScope.getCat2Style(row)">{{grid.appScope.getCat2Content(row)}}</div>',
	                                    cellClass: 'txt-l',
	                                    headerCellClass: 'txt-c',
	                                    headerTooltip: true,
	                                    enableSorting : false,
	                                    width: 150
	                                },{
                        				name : 'comparison_item',
                        				field : 'checked',
                        				displayName: "",
                        				cellTemplate : '<div class="ui-grid-cell-contents" ng-if="row.entity.metricDir == \'facter\'"><label class="no-txt" /></div>'
                    											+ '<div class="ui-grid-cell-contents txt-c" ng-if="row.entity.metricDir != \'facter\'"  style="padding: 2px 0px 0px 0px; "><input type="checkbox" ng-model="row.entity.checked" style="position:relative;" ng-click="grid.appScope.onClickCheckbox(row)"/><label class="no-txt" /></div>',
                        				//headerCellTemplate : '<div class="txt-c" style="padding: 2px 0px 0px 0px;"><label style="height: 28px;">Comparison Item</label><br><input type="checkbox" ng-model="grid.appScope.allChecked" style="position:relative;z-index:99999;" ng-click="grid.appScope.onClickCheckboxHeader()" /><label class="no-txt" /></div>',
                        				width : 25,
                        				enableColumnMenu: false,
                                        filter: '', 
                                        enableFiltering: false,
                                        cellTooltip: true,
                                        cellClass: 'txt-l',
 	                                    headerCellClass: 'txt-c',
 	                                    enableSorting : false,
                                        headerTooltip: true
                        			},{
                                        name: 'metric_name',
                                        field: 'metricName',
                                        displayName: $translate.instant('COMMON.NAME'),
                                        enableColumnMenu: false,
                                        filter: '', 
                                        enableFiltering: false,
                                        cellTooltip: true,
                                        cellClass: 'txt-l',
	                                    headerCellClass: 'txt-c',
	                                    enableSorting : false,
                                        headerTooltip: true,
                                        width: 550
                                    },
                                    {
                                        name: 'metric_value',
                                        field: 'metricValue',
                                        displayName: $translate.instant('COMMON.VALUE'),
                                        enableColumnMenu: false,
                                        filter: '', 
                                        enableFiltering: false,
                                        cellClass: 'txt-l',
	                                    headerCellClass: 'txt-c',
                                        cellTooltip: true,
                                        headerTooltip: true,
                                        enableSorting : false,
                                        width: 300
                                    }
                                ],
                                appScopeProvider: {
                                	getCat1Content : function(row) {
                                        if(row.entity.rowNum == 0) {
                                           return row.entity.metricDir
                                        } else {
                                           if(row.entity.metricDir == $scope.gridOptions.data[row.entity.rowNum - 1].metricDir
                                              && row.grid.rows[row.entity.rowNum - 1].visible == true
                                              ) {
                                              row.entity.mergeCat1 = true;
                                              return "";
                                           } else {
                                              row.entity.mergeCat1 = false;
                                              return row.entity.metricDir;
                                           }
                                        } 
                                     }
                                     ,getCat1Style : function (row) {
                                        if(row.entity.mergeCat1) {
                                           return {"border-top" : "0px"}
                                        } else {
                                           return "";
                                        }
                                     }
                                     ,getCat2Content : function(row) {
                                        if(row.entity.rowNum == 0) {
                                           return row.entity.metricDir2
                                        } else {
                                           if(row.entity.metricDir == $scope.gridOptions.data[row.entity.rowNum - 1].metricDir
                                              && row.entity.metricDir2 == $scope.gridOptions.data[row.entity.rowNum - 1].metricDir2
                                              && row.grid.rows[row.entity.rowNum - 1].visible == true
                                              ) {
                                              row.entity.mergeCat2 = true;
                                              return "";
                                           } else {
                                              row.entity.mergeCat2 = false;
                                              return row.entity.metricDir2;
                                           }
                                        } 
                                     }
                                     ,getCat2Style : function (row) {
                                        if(row.entity.mergeCat2) {
                                           return {"border-top" : "0px"}
                                        } else {
                                           return "";
                                        }
                                     }
                                     ,onClickCheckbox : function(row) {
 	            						console.log(row.entity.metricName);
 	            					},
 	            					onClickCheckboxHeader : function(row) {
 	            						var rows = $scope.gridApi.grid.api.grid.rows;
 	            						for (var i = 0; i < rows.length; i++) {
 	            							if(rows[i].visible == true) {
 	            								rows[i].entity.checked = $scope.gridApi.grid.appScope.allChecked;
 	            							}
 	            						}
 	            					}
                                     
                                },
	                            onRegisterApi: function(gridApi){
	                            	$scope.gridApi = gridApi;
	                            	$scope.gridApi.core.handleWindowResize();
	                            	
	                            	$scope.gridApi.core.on.filterChanged($scope,function(){
	                            		var grid = this.grid;
	                            		
	                            		//main category 변경시 sub category도 변경
	                            		if($scope.searchConditions.mainCatInfo != grid.columns[0].filters[0].term){
	                            			$scope.searchConditions.mainCatInfo = grid.columns[0].filters[0].term;
	                            			grid.columns[1].filters[0].term = "";
		                            		grid.columns[1].filters[0].disableCancelFilterButton = true;
		                            		grid.columns[1].filters[0].type = "select";
		                            		
		                            		
		                            		$scope.searchConditions.nodeSeq = nodeSeq.nodeSeq;
		                                    $http({
		                                        method: "POST",
		                                        url: "/popup/getCategoryList2.json",
		                                        data: $scope.searchConditions,
		                                        headers: {
		                                            "Content-Type": "application/json"
		                                        }
		                                    }).then(function(data) {
		                                        var result = data.data;
		                                        
		                                        grid.columns[1].filters[0].selectOptions = result.data;
		                                    });
	                            		}
	                            		
	                            	});
	                            	
	                            }
                            };
                        };
                        
                        
                        function initialize(){
                        	if(typeof nodeSeq != "undefined"){
                        		$scope.searchConditions.nodeSeq = nodeSeq;
                        	}
                        	$scope.searchCategoryList();
                        	$scope.searchCategoryList2();
                        	setGridOption();
                        	$scope.search();
                        };
                        
                        initialize();
                    }]
                });
            },
            
            
            
            //Node Status Popup
            openNodeStatusPop: function(param) {
        		var pluginIp ="";
	            var popup = ngDialog.open({
	                template: '/node-status-info',
	                className:"ngdialog-theme-default custom-width",
	                disableAnimation: true,
	                cache:false,
	                showClose: false,
	                closeByDocument:false,
	                closeByEscape:false, 
	                controller: ['$scope', "$http", "DataService", "$rootScope", function($scope, $http, DataService, $rootScope) {
	                	
	                	$scope.popupTitleName = "";
	                	
	                	$scope.pluginTypesPopup = ['Collector', 'Processor', 'Publisher'];
                		$scope.checked_pluginTypePopup = ['Collector', 'Processor', 'Publisher'];
	
	                    $scope.searchRestConditions = {
	                    		"agreementSeq" : null
	            				,"ip" : null
	            				,"apiType" : null
	            				,"node_name" : null
	            				,"nodeSeq" : null
	                    };
	                    
	                    $rootScope.searchPluginList = function() {
	                    	$scope.searchRestConditions.apiType = "/v1/plugins";
	                    	
	                    	DataService.httpPost("/popup/getPluginRestCall.json", $scope.searchRestConditions, function(pluginData) {
	                    		if (pluginData.result == 1) {
	              		          	var result = JSON.parse(pluginData.data);
	              		          	
	              		          	if (result.meta.code == 200) {
	              		          		
		              		          	if(result.body.loaded_plugins != undefined){
		              		          		for(var i = 0; i < result.body.loaded_plugins.length; i++){
		                                  		var timestamp = result.body.loaded_plugins[i].loaded_timestamp;
		                                  		
		                                  		//unixtime 변환
		                                  		if(timestamp != ''){
		                                  			var convertDate = convertUnixTime(timestamp);
		                                  			result.body.loaded_plugins[i].loaded_timestamp = convertDate;
		                                  		}
		                                  	}
			              		          	$scope.gridPluginOptions.data = result.body.loaded_plugins;
	              		          		}else{
	              		          			$scope.gridPluginOptions.data = [];
	              		          			$("input:checkbox[id='pluginGridAllCheck']").attr("checked", false);
	              		          		}
	              					} else {
	              						alert(result.errorMessage);
	              					}
	                    		}else {
              						alert(result.errorMessage);
              					}
	                    	});
	                    	ap($scope);
	                    };
	                    
	                    $scope.onPluginDelete = function(){
	                    	var pluginTypeList = [];
	            			var pluginNameList = [];
	            			var pluginVersionList = [];
	            			
	            	      	var rows = $scope.gridPluginApi.grid.api.grid.rows;
	            	      	
	            	      	for(var i=0;i<rows.length;i++) {
	            	      		var entity = rows[i].entity;
	            	      		if(entity.checked) {
	            	      			pluginTypeList.push(entity.type);
	            	      			pluginNameList.push(entity.name);
	            	      			pluginVersionList.push(entity.version);
	            	      		}
	            	      	}
	            	      	
	            	      	if(pluginTypeList.length == 0){
	            	      		alert("No data selected.");
	            	      		return false;
	            	  		}
	            	      	
	            	      	if(!confirm("Are you sure you want to delete the selected Plugin?")) {
	            		  		return false;
	            		  	}
	            	      	
            	      		var ipInfo = param.ip + ":"+ param.restApiPort;
            	      		var nodeName = param.hostName;
	                    	
	                    	if(ipInfo != null){
	                    		$scope.deletePluginInfo = {
	                					"ip" : ipInfo
	                					,"node_name" : nodeName
	                					,"tempApiType" : "/v1/plugins/"
	                					,"pluginTypeList" : pluginTypeList
	                					,"pluginNameList" : pluginNameList
	                					,"pluginVersionList" : pluginVersionList
	                			}
	                    		
	                    		// group plugin 삭제
	                			DataService.httpPost('/popup/deletePlugin.json', $scope.deletePluginInfo, function(result) {
	                				if (result.result == 1) {
	                					var result = JSON.parse(result.data);
	                  	
	                					if (result.meta.code == 200) {
	                						alert("It has been deleted.");
	                						$rootScope.searchPluginList();
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
	                    };
	                    
	                    
	                    $rootScope.searchTaskList = function() {
	                    	$scope.searchRestConditions.apiType = "/v1/tasks";
	                    	
	                    	DataService.httpPost("/popup/getTaskRestCall.json", $scope.searchRestConditions, function(taskData) {
	                    		if (taskData.result == 1) {
	              		          	var result = JSON.parse(taskData.data);
	              		          	
	              		          	if (result.meta.code == 200) {
	                                  	
	                                  	for(var i = 0; i < result.body.ScheduledTasks.length; i++){
	                                  		var creationTimestamp = result.body.ScheduledTasks[i].creation_timestamp;
		                            		var lastRunTimestamp = result.body.ScheduledTasks[i].last_run_timestamp;
		                            		
		                            		//unixtime 변환
		                            		if(creationTimestamp != ''){
		                            			var convertCreationDate = convertUnixTime(creationTimestamp);
		                            			result.body.ScheduledTasks[i].creation_timestamp = convertCreationDate;
		                            		}
		                            		if(creationTimestamp != ''){
		                            			var convertLastRunDate = convertUnixTime(lastRunTimestamp);
		                            			result.body.ScheduledTasks[i].last_run_timestamp = convertLastRunDate;
		                            		}
	                                  	}
	                                  	
	              						$scope.gridTaskOptions.data = result.body.ScheduledTasks;
	              						$("input:checkbox[id='taskGridAllCheck']").attr("checked", false);
	              					} else {
	              						alert(result.errorMessage);
	              					}
	                    		}else {
              						alert(result.errorMessage);
              					}
	                    	});
	                    	ap($scope);
	                    	
	                    };
	                    
	                    $scope.onTaskDelete = function(){
	                    	var taskIdList = [];
	            	      	var rows = $scope.gridTaskApi.grid.api.grid.rows;
	            	      	
	            	      	for(var i=0;i<rows.length;i++) {
	            	      		var entity = rows[i].entity;
	            	      		if(entity.checked) {
	            	      			if(entity.task_state == 'Running'){
	            	      				alert("A running task can not be deleted.");
	            	      				taskIdList = [];
	            	      				return false;
	            	      			}
	            	      			taskIdList.push(entity.id);
	            	      		}
	            	      	}
	            	      	
	            	      	if(taskIdList.length == 0){
	            	      		alert("No data selected.");
	            	      		return false;
	            	  		}
	            	      	
	            	      	if(!confirm("Are you sure you want to delete the selected Task?")) {
	            		  		return false;
	            		  	}
	            	      	
            	      		var ipInfo = param.ip + ":"+ param.restApiPort;
            	      		var nodeName = param.hostName;
	                    	
	                    	if(ipInfo != null){
	                    		$scope.deleteTaskInfo = {
	                					"ip" : ipInfo
	                    				,"tempApiType" : "/v1/tasks/"
	                    				,"taskIdList" : taskIdList
	                    				,"node_name" : nodeName
	                    		}
	                    		
	                    		// group task delete
	                            DataService.httpPost('/popup/deleteTask.json', $scope.deleteTaskInfo, function(result) {
	                                if (result.result == 1) {
	                                	var result = JSON.parse(result.data);
	                                	
	                                	if (result.meta.code == 200) {
	                                		alert("It has been deleted.");
	                                		$rootScope.searchTaskList();
	                                		$rootScope.getTaskList();
	                					}else {
	                						alert("Failed : HTTP error code : "+ result.meta.code + " : " + result.meta.message);
	                					}
	                                }else{
	                                	alert(result.errorMessage);
	                                }
	                            });
	                            ap($scope);
	                    	}
	                    };
	                    
	                    $scope.closeStatusPopup = function () {
	                    	$scope.closeThisDialog();
	                    };
	                    
	                    
	                    $scope.onNodeTrashBinMove = function(){
	            			if(!confirm("Are you sure you want to move to the trash Bin?")) {
	            				return false;
	            			}
	                		
	                        DataService.httpPost("/group/setNodeTrashBin.json", $scope.searchRestConditions, function(result) {
	                            if (result.result == 1) {
	                				$scope.closeThisDialog();
	                            }else{
	                            	alert(result.errorMessage);
	                            }
	                        });
	                        ap($scope);
	            		};
	                    
	                    
	                    $scope.openPlugin = function () {
            	            var popup = ngDialog.open({
            	                template: '/plugin-popup-info',
            	                className:"ngdialog-theme-default custom-width",
            	                disableAnimation: true,
            	                cache:false,
            	                showClose: false,
            	                closeByDocument:false,
            	                closeByEscape:false, 
            	                controller: ['$scope', "$http", function($scope, $http) {
            	                	
            	                	$scope.pluginTypesPopup2 = ['Collector', 'Processor', 'Publisher'];
                            		$scope.checked_pluginTypePopup2 = ['Collector', 'Processor', 'Publisher'];
                            		
                            		$scope.searchpluginConditions = {
                        				"pluginType" : $scope.checked_pluginTypePopup2
                            		}
                            		
            	                    $scope.popupPluginList = function() {
            	                    	$http({
                                            method: "POST",
                                            url: "/popup/getPluginPopupList.json",
                                            data: $scope.searchpluginConditions,
                                            headers: {
                                                "Content-Type": "application/json"
                                            }
                                        }).then(function(data) {
                                        	var result = data.data;
            								$scope.gridPluginPopupOptions.data = result.data;
                                        });
            	                    };
            	                    
            	                    $scope.closePluginPopup = function () {
            	                    	popup.close();
            	                    };
            	                    
            	                    $scope.addPlugin = function(){
            	                    	var fileNameList = [];
            	                    	var rows = $scope.gridPluginPopupApi.grid.api.grid.rows;
            	                    	
            	                    	
            	                    	for(var i=0;i<rows.length;i++) {
            	                    		var entity = rows[i].entity;
            	                    		if(entity.checked) {
            	                    			fileNameList.push(entity.fileName);
            	                    		}
            	                    	}
            	                    	
            	                    	if(fileNameList.length == 0){
            	                    		alert("No data selected.");
            	                    		return false;
            	                		}
            	                    	
            	                    	var ipInfo = param.ip + ":"+ param.restApiPort;
            	                    	var nodeName = param.nodeName;
            	                    	
            	                    	if(ipInfo != null){
            	                    		$scope.addPluginInfo = {
            	                					"ip" : ipInfo
            	                    				,"apiType" : "/v1/plugins"
            	                    				,"node_name" : nodeName
            	                    				,"fileNameList" : fileNameList
            	                    		}
            	                    		
            	                    		// group plugin add
            	                            DataService.httpPost('/popup/addPlugin.json', $scope.addPluginInfo, function(result) {
            	                                if (result.result == 1) {
            	                                	var result = JSON.parse(result.data);
            	                                	
            	                                	if (result.meta.code == 201) {
            	                                		alert("Selected data is registered.");
            	                                		$rootScope.searchPluginList();
            	                                		$rootScope.getPluginList();
            	                                		popup.close();
            	                					}else {
            	                						alert("Failed : HTTP error code : "+ result.meta.code + " : " + result.meta.message);
            	                					}
            	                                }else{
            	                                	alert(result.errorMessage);
            	                                }
            	                            });
            	                            ap($scope);
            	                    	}
            	                    };
            	                    
            	                    
            	                    // Plugin 그리드 옵션 설정
            	                    function setGridPopupPluginOption() {
            	                        $scope.gridPluginPopupOptions = {
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
	                                			}, {
            	                                    name: 'plugin_name',
            	                                    field: 'pluginName',
            	                                    displayName: $translate.instant("COMMON.NAME"),
            	                                    width: 110,
            	                                    cellClass: 'txt-c',
            	                                    headerCellClass: 'txt-c',
            	                                    enableColumnMenu: false,
            	                                    cellTooltip:true,
            	                                    headerTooltip:true
            	                                }, {
            	                                    name: 'plugin_version',
            	                                    field: 'pluginVersion',
            	                                    displayName: $translate.instant("GROUP.VERSION"),
            	                                    width: 80,
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
            	                                    name: 'last_up_time',
            	                                    field: 'lastUpTime',
            	                                    displayName: $translate.instant("PLUGIN.UPDATE_DATE"),
            	                                    cellTooltip:true,
            	                                    width: 200,
            	                                    cellClass: 'txt-c',
            	                                    headerCellClass: 'txt-c',
            	                                    enableColumnMenu: false,
            	                                    headerTooltip:true
            	                                }
            	                            ],
            	                            appScopeProvider: {
            	                                selectedData: function(row) {
            	                                    $scope.selectedData = row.data;
            	                                    $scope.showDataPop = true;
            	                                },
            	                                onClickCheckbox : function(row) {
            	            						console.log(row);
            	            					},
            	            					onClickCheckboxHeader : function(row) {
            	            						var rows = $scope.gridPluginPopupApi.grid.api.grid.rows;
            	            						for (var i = 0; i < rows.length; i++) {
            	            							rows[i].entity.checked = $scope.gridPluginPopupApi.grid.appScope.allChecked;
            	            						}
            	            					},
            	                            },
            	                            onRegisterApi: function(gridApi){
            	                            	$scope.gridPluginPopupApi = gridApi;
            	                            	$scope.gridPluginPopupApi.core.handleWindowResize();
            	                                //groupMgmtCtrl.gridNodeApi.core.on.sortChanged($scope, groupMgmtCtrl.sortNodeChanged);
            	                            }
            	                        };
            	                    };
            	                    
            	                    function initialize(){
            	                    	setGridPopupPluginOption();
            	                    	$scope.popupPluginList();
            	                    };
            	                    
            	                    initialize();
            	                }]
            	            });
	                    };
	                    
	                    
	                    $scope.openTask = function () {
	                    	var popup = ngDialog.open({
	        	                template: '/task-popup-info',
	        	                className:"ngdialog-theme-default custom-width",
	        	                disableAnimation: true,
	        	                cache:false,
	        	                showClose: false,
	        	                closeByDocument:false,
	        	                closeByEscape:false, 
	        	                controller: ['$scope', "$http", function($scope, $http) {
	        	                	
	        	                	$scope.searchtaskConditions = {
                        				"agreementSeq" : null
                            		};
	        	                	
	        	                    $scope.popupTaskList = function() {

	        	                    	$http({
	                                        method: "POST",
	                                        url: "/popup/getTaskPopupList.json",
	                                        data: $scope.searchtaskConditions,
	                                        headers: {
	                                            "Content-Type": "application/json"
	                                        }
	                                    }).then(function(data) {
	                                    	var result = data.data;
            								$scope.gridTaskPopupOptions.data = result.data;
	                                    });
	        	                    };
	        	                    
	        	                    $scope.closeTaskPopup = function () {
	        	                    	popup.close();
	        	                    };
	        	                    
	        	                    $scope.addTask = function(){
	        	                    	var taskDetailList = [];
	        	                    	var rows = $scope.gridTaskPopupApi.grid.api.grid.rows;
	        	                    	
	        	                    	for(var i=0;i<rows.length;i++) {
	        	                    		var entity = rows[i].entity;
	        	                    		if(entity.checked) {
	        	                    			taskDetailList.push(entity.taskFileContents);
	        	                    		}
	        	                    	}
	        	                    	
	        	                    	if(taskDetailList.length == 0){
	        	                    		alert("No data selected.");
	        	                    		return false;
	        	                		}
	        	                    	
	        	                    	var ipInfo = param.ip + ":"+ param.restApiPort;
	        	                    	var nodeName = param.hostName;
	        	                    	
	        	                    	if(ipInfo != null){
	        	                    		$scope.addTaskInfo = {
        	                					"ip" : ipInfo
        	                    				,"apiType" : "/v1/tasks"
        	                    				,"taskDetailList" : taskDetailList
        	                    				,"node_name" : nodeName
	        	                    		}
	        	                    		
	        	                    		// group task add
	        	                            DataService.httpPost('/popup/addTask.json', $scope.addTaskInfo, function(result) {
	        	                                if (result.result == 1) {
	        	                                	var result = JSON.parse(result.data);
	        	                                	
	        	                                	if (result.meta.code == 201) {
	        	                                		alert("Selected data is registered.");
	        	                                		$rootScope.searchTaskList();
	        	                                		$rootScope.getTaskList();
	        	                                		popup.close();
	        	                					}else {
	        	                						alert("Failed : HTTP error code : "+ result.meta.code + " : " + result.meta.message);
	        	                					}
	        	                                }else{
	        	                                	alert(result.errorMessage);
	        	                                }
	        	                            });
	        	                            ap($scope);
	        	                    	}
	        	                    };
	        	                    
	        	                    $scope["taskInfo"] = {};
	        	                    
	        	                    function bindTaskInfo(entity) {
	        	          				  $scope["taskInfo"]["taskFileName"] = entity["taskFileName"];
	        	          				  $scope["taskInfo"]["taskFileContents"] = entity["taskFileContents"];
	        	                    };
  
	        	                    function resetTaskInfo() {
	        	                    	$scope["taskInfo"] = {};
	        	                    };
	        	                    
	        		                //Task 그리드 옵션 설정
	        	                    function setGridPopupTaskOption() {
	        	                        $scope.gridTaskPopupOptions = {
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
	        	                                    name: 'task_file_name',
	        	                                    field: 'taskFileName',
	        	                                    displayName: $translate.instant("COMMON.NAME"),
	        	                                    //width: 290,
	        	                                    cellClass: 'txt-l',
	        	                                    headerCellClass: 'txt-c',
	        	                                    enableColumnMenu: false,
	        	                                    cellTooltip:true,
	        	                                    headerTooltip:true
	        	                                }, {
	        	                                    name: 'last_up_time',
	        	                                    field: 'lastUpTime',
	        	                                    displayName: $translate.instant("PLUGIN.UPDATE_DATE"),
	        	                                    cellTooltip:true,
	        	                                    //width: 200,
	        	                                    cellClass: 'txt-c',
	        	                                    headerCellClass: 'txt-c',
	        	                                    enableColumnMenu: false,
	        	                                    headerTooltip:true
	        	                                }
	        	                            ],
	        	                            appScopeProvider: {
            	                                selectedData: function(row) {
            	                                    $scope.selectedData = row.data;
            	                                    $scope.showDataPop = true;
            	                                },
            	                                onClickCheckbox : function(row) {
            	            						console.log(row);
            	            					},
            	            					onClickCheckboxHeader : function(row) {
            	            						var rows = $scope.gridTaskPopupApi.grid.api.grid.rows;
            	            						for (var i = 0; i < rows.length; i++) {
            	            							rows[i].entity.checked = $scope.gridTaskPopupApi.grid.appScope.allChecked;
            	            						}
            	            					},
            	                            },
            	                            onRegisterApi: function(gridApi){
            	                            	$scope.gridTaskPopupApi = gridApi;
            	                            	$scope.gridTaskPopupApi.core.handleWindowResize();
            	                            	
            	                            	gridApi.selection.on.rowSelectionChanged($scope, function(row) {
            	                                	if (gridApi.selection.getSelectedCount() > 0) {
            	            							bindTaskInfo(gridApi.grid.selection.lastSelectedRow.entity);
            	            						} else {
            	            							resetTaskInfo();
            	            						}
            	            					});
            	                            }
	        	                        };
	        	                    };
	        	                    
	        	                    
	        	                    function initialize(){
	        	                    	setGridPopupTaskOption();
	        	                    	$scope.popupTaskList();
	        	                    };
	        	                    
	        	                    initialize();
	        	                }]
	        	            });
	                    };

	
	                    // Plugin 그리드 옵션 설정
	                    function setGridPluginOption() {
	                        $scope.gridPluginOptions = {
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
	                                    name: 'name',
	                                    field: 'name',
	                                    displayName: $translate.instant('COMMON.NAME'),
	                                    enableColumnMenu: false,
	                                    cellTooltip: true,
	                                    headerTooltip: true,
	                                    cellClass: 'txt-c',
	                                    headerCellClass: 'txt-c',
	                                    width: 120
	                                },
	                                {
	                                    name: 'version',
	                                    field: 'version',
	                                    displayName: $translate.instant('GROUP.VERSION'),
	                                    enableColumnMenu: false,
	                                    cellTooltip: true,
	                                    headerTooltip: true,
	                                    cellClass: 'txt-c',
	                                    headerCellClass: 'txt-c',
	                                    width: 120
	                                },
	                                {
	                                    name: 'type',
	                                    field: 'type',
	                                    displayName: $translate.instant('GROUP.TYPE'),
	                                    enableColumnMenu: false,
	                                    cellTooltip: true,
	                                    headerTooltip: true,
	                                    cellClass: 'txt-c',
	                                    headerCellClass: 'txt-c',
	                                    width: 150
	                                },
	                                {
	                                    name: 'signed',
	                                    field: 'signed',
	                                    displayName: $translate.instant('PLUGIN.SIGNED'),
	                                    enableColumnMenu: false,
	                                    cellTooltip: true,
	                                    headerTooltip: true,
	                                    cellClass: 'txt-c',
	                                    headerCellClass: 'txt-c',
	                                    width: 120
	                                },
	                                {
	                                    name: 'status',
	                                    field: 'status',
	                                    displayName: $translate.instant('PLUGIN.STATUS'),
	                                    enableColumnMenu: false,
	                                    cellTooltip: true,
	                                    headerTooltip: true,
	                                    cellClass: 'txt-c',
	                                    headerCellClass: 'txt-c',
	                                    width: 120
	                                },
	                                {
	                                    name: 'loaded_timestamp',
	                                    field: 'loaded_timestamp',
	                                    displayName: $translate.instant("PLUGIN.LOADED") + " "+ $translate.instant("COMMON.TIMESTAMP") ,
	                                    enableColumnMenu: false,
	                                    cellTooltip: true,
	                                    headerTooltip: true,
	                                    cellClass: 'txt-c',
	                                    headerCellClass: 'txt-c',
	                                    width: 180
	                                },
	                                {
	                                    name: 'href',
	                                    field: 'href',
	                                    displayName: $translate.instant("COMMON.HREF"),
	                                    enableColumnMenu: false,
	                                    cellTooltip: true,
	                                    headerTooltip: true,
	                                    headerCellClass: 'txt-c',
	                                    cellClass: 'txt-l'
	                                    //width: 630
	                                }
	                            ],
	                            appScopeProvider: {
	                                selectedData: function(row) {
	                                    $scope.selectedData = row.data;
	                                    $scope.showDataPop = true;
	                                },
	                                onClickCheckbox : function(row) {
	            					},
	            					onClickCheckboxHeader : function(row) {
	            						var rows = $scope.gridPluginApi.grid.api.grid.rows;
	            						for (var i = 0; i < rows.length; i++) {
	            							rows[i].entity.checked = $scope.gridPluginApi.grid.appScope.allChecked;
	            						}
	            					},
	                            },
	                            onRegisterApi: function(gridApi){
	                            	$scope.gridPluginApi = gridApi;
	                            	$scope.gridPluginApi.core.handleWindowResize();
	                            }
	                        };
	                    };
	                    
	                    
	                    
		                //Task 그리드 옵션 설정
	                    function setGridTaskOption() {
	                        $scope.gridTaskOptions = {
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
	                    			}, {
	                                    name: 'action',
	                                    field: 'action',
	                                    displayName: $translate.instant("TASK.ACTION"),
	                                    cellTemplate: '<div class="ui-grid-cell-contents" style="padding-left:5px" ng-if="row.entity.task_state == \'Running\'"><button type="button" class="btn-gy" title="Start" ng-click="grid.appScope.onStopClick(row)" ng-if="row.entity.task_state == \'Running\'">Stop</button></div>'
	                                    					+'<div class="ui-grid-cell-contents" style="padding-left:5px" ng-if="row.entity.task_state == \'Stopped\'"><button type="button" class="btn-cr2" title="Start" ng-click="grid.appScope.onStartClick(row)" ng-if="row.entity.task_state == \'Stopped\'">Start</button></div>'
	                                    					+'<div class="ui-grid-cell-contents" style="padding-left:5px" ng-if="row.entity.task_state == \'Disabled\'"><button type="button" class="btn-cr2" title="Start" ng-click="grid.appScope.onEnableClick(row)" ng-if="row.entity.task_state == \'Disabled\'">Enable</button></div>'
	                                    					+'<div class="ui-grid-cell-contents" style="padding-left:5px" ng-if="row.entity.task_state == \'Ended\'"></div>'
	                                    ,
	                                    enableSorting:false,
	                                    enableColumnMenu: false,
	                                    cellTooltip: true,
	                                    headerTooltip: true,
	                                    cellClass: 'txt-c',
	                                    headerCellClass: 'txt-c',
	                                    width: 120
	                                }, {
	                                    name: 'id',
	                                    field: 'id',
	                                    displayName: $translate.instant('TASK.ID'),
	                                    enableColumnMenu: false,
	                                    cellTooltip: true,
	                                    headerTooltip: true,
	                                    cellClass: 'txt-c',
	                                    headerCellClass: 'txt-c',
	                                    width: 300
	                                },
	                                {
	                                    name: 'name',
	                                    field: 'name',
	                                    displayName: $translate.instant('COMMON.NAME'),
	                                    enableColumnMenu: false,
	                                    cellTooltip: true,
	                                    headerTooltip: true,
	                                    cellClass: 'txt-c',
	                                    headerCellClass: 'txt-c',
	                                    width: 300
	                                },
	                                {
	                                    name: 'deadline',
	                                    field: 'deadline',
	                                    displayName: $translate.instant('TASK.DEADLINE'),
	                                    enableColumnMenu: false,
	                                    cellTooltip: true,
	                                    headerTooltip: true,
	                                    cellClass: 'txt-c',
	                                    headerCellClass: 'txt-c',
	                                    width: 70
	                                },
	                                {
	                                    name: 'creation_timestamp',
	                                    field: 'creation_timestamp',
	                                    displayName: $translate.instant("TASK.CREATION") + " "+ $translate.instant("COMMON.TIMESTAMP"),
	                                    enableColumnMenu: false,
	                                    cellTooltip: true,
	                                    headerTooltip: true,
	                                    cellClass: 'txt-c',
	                                    headerCellClass: 'txt-c',
	                                    width: 150
	                                },
	                                {
	                                    name: 'last_run_timestamp',
	                                    field: 'last_run_timestamp',
	                                    displayName: $translate.instant("TASK.LAST_RUN") + " "+ $translate.instant("COMMON.TIMESTAMP"),
	                                    enableColumnMenu: false,
	                                    cellTooltip: true,
	                                    headerTooltip: true,
	                                    cellClass: 'txt-c',
	                                    headerCellClass: 'txt-c',
	                                    width: 150
	                                },
	                                {
	                                    name: 'hit_count',
	                                    field: 'hit_count',
	                                    displayName: $translate.instant("TASK.HIT_COUNT"),
	                                    enableColumnMenu: false,
	                                    cellTooltip: true,
	                                    headerTooltip: true,
	                                    cellFilter: 'number: 0',
	                                    cellClass: 'txt-r',
	                                    headerCellClass: 'txt-c',
	                                    width: 80
	                                },
	                                {
	                                    name: 'task_state',
	                                    field: 'task_state',
	                                    displayName: $translate.instant("TASK.TASK_STATE"),
	                                    enableColumnMenu: false,
	                                    cellTooltip: true,
	                                    headerTooltip: true,
	                                    cellClass: 'txt-c',
	                                    headerCellClass: 'txt-c',
	                                    width: 100
	                                },
	                                {
	                                    name: 'href',
	                                    field: 'href',
	                                    displayName: $translate.instant('COMMON.HREF'),
	                                    enableColumnMenu: false,
	                                    cellTooltip: true,
	                                    headerTooltip: true,
	                                    headerCellClass: 'txt-c',
	                                    cellClass: 'txt-l',
	                                    width: 530
	                                }
	                            ],
	                            appScopeProvider: {
	                                selectedData: function(row) {
	                                    $scope.selectedData = row.data;
	                                    $scope.showDataPop = true;
	                                },
	                                onClickCheckbox : function(row) {
	            					},
	            					onClickCheckboxHeader : function(row) {
	            						var rows = $scope.gridTaskApi.grid.api.grid.rows;
	            						for (var i = 0; i < rows.length; i++) {
	            							rows[i].entity.checked = $scope.gridTaskApi.grid.appScope.allChecked;
	            						}
	            					},
	            					onStartClick : function(row){
	            						var ipInfo = param.ip + ":"+ param.restApiPort;
	            						var taskId = row.entity.id;
	            						var nodeName = $scope.popupTitleName;
	            						
	            						$scope.startTaskInfo = {
	            								"ip" : ipInfo
	            			    				,"apiType" : "/v1/tasks/" + taskId + "/start"
	            			    				,"node_name" : nodeName
	            			    		}
	            						
	            			    		// task start rest api call
	            			            DataService.httpPost('/group/startTask.json', $scope.startTaskInfo, function(result) {
	            			                if (result.result == 1) {
	            			                	var result = JSON.parse(result.data);
	            			                	
	            			                	if (result.meta.code == 200) {
	            			                		//sync api 호출 후 화면 리로드 작업
	            			                		$rootScope.searchTaskList();
	            			                		$rootScope.getPluginList();
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
	            						var ipInfo = param.ip + ":"+ param.restApiPort;
	        							var taskId = row.entity.id;
	        							var nodeName = $scope.popupTitleName;
	        							
	        							$scope.stopTaskInfo = {
	        									"ip" : ipInfo
	            			    				,"apiType" : "/v1/tasks/" + taskId + "/stop"
	            			    				,"node_name" : nodeName
	            			    		}
	            						
	            			    		// task stop rest api call
	            			            DataService.httpPost('/group/stopTask.json', $scope.stopTaskInfo, function(result) {
	            			                if (result.result == 1) {
	            			                	var result = JSON.parse(result.data);
	            			                	
	            			                	if (result.meta.code == 200) {
	            			                		//sync api 호출 후 화면 리로드 작업
	            			                		$rootScope.searchTaskList();
	            			                		$rootScope.getPluginList()
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
	            						var ipInfo = param.ip + ":"+ param.restApiPort;
	        							var taskId = row.entity.id;
	        							var nodeName = $scope.popupTitleName;
	        							
	        							$scope.stopTaskInfo = {
        									"ip" : ipInfo
            			    				,"apiType" : "/v1/tasks/" + taskId + "/enable"
            			    				,"node_name" : nodeName
	            			    		}
	            						
	            			    		// task stop rest api call
	            			            DataService.httpPost('/group/stopTask.json', $scope.stopTaskInfo, function(result) {
	            			                if (result.result == 1) {
	            			                	var result = JSON.parse(result.data);
	            			                	
	            			                	if (result.meta.code == 200) {
	            			                		//sync api 호출 후 화면 리로드 작업
	            			                		$rootScope.searchTaskList();
	            			                		$rootScope.getPluginList()
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
	                            	$scope.gridTaskApi = gridApi;
	                            	$scope.gridTaskApi.core.handleWindowResize();
	                            }
	                        };
	                    };
	                    
	                    function initialize(){
	                    	if(typeof param != "undefined"){
	                    		$scope.searchRestConditions.agreementSeq = param.agreementSeq;
	                    		$scope.popupTitleName = param.hostName;
	                    		$scope.searchRestConditions.ip = param.ip + ":"+ param.restApiPort;
	                    		$scope.searchRestConditions.node_name = param.nodeName;
	                    		
	                    		$scope.searchRestConditions.nodeSeq = param.nodeSeq;
	                    	}
	                    	setGridPluginOption();
	                    	setGridTaskOption();
	                    	$rootScope.searchPluginList();
	                    	$rootScope.searchTaskList();
	                    };
	                    
	                    initialize();
	                }]
	            }).closePromise.then(function(data) {
	            	$rootScope.getNodeList();
                });
	        },
            
            
            
            //Plugin Popup
            openPluginPop: function(params) {
        		var pluginIp ="";
	            var popup = ngDialog.open({
	                template: '/plugin-popup-info',
	                className:"ngdialog-theme-default custom-width",
	                disableAnimation: true,
	                cache:false,
	                showClose: false,
	                closeByDocument:false,
	                closeByEscape:false, 
	                controller: ['$scope', "$http", "DataService", "$rootScope", function($scope, $http, DataService, $rootScope) {
	                	
	                	$scope.pluginTypesPopup2 = ['Collector', 'Processor', 'Publisher'];
                		$scope.checked_pluginTypePopup2 = ['Collector', 'Processor', 'Publisher'];
	
                		params.pluginType= $scope.checked_pluginTypePopup2;
                		
	                    $scope.popupPluginList = function() {

	                    	$http({
                                method: "POST",
                                url: "/popup/getPluginPopupList.json",
                                data: params,
                                headers: {
                                    "Content-Type": "application/json"
                                }
                            }).then(function(data) {
                            	var result = data.data;
								$scope.gridPluginPopupOptions.data = result.data;
                            });
	                    };
	                    
	                    $scope.closePluginPopup = function () {
	                    	popup.close();
	                    };
	                   
	                    $scope.addPlugin = function(){
	                    	var fileNameList = [];
	                    	var rows = $scope.gridPluginPopApi.grid.api.grid.rows;
	                    	
	                    	for(var i=0;i<rows.length;i++) {
	                    		var entity = rows[i].entity;
	                    		if(entity.checked) {
	                    			fileNameList.push(entity.fileName);
	                    		}
	                    	}
	                    	
	                    	if(fileNameList.length == 0){
	                    		alert("No data selected.");
	                    		return false;
	                		}
	                    	
	                    	var ipInfo = params.ipInfo;
	                    	var nodeName = params.nodeName;
	            	      	
	                    	if(ipInfo != null){
	                    		$scope.addPluginInfo = {
	                					"ip" : ipInfo
	                					,"node_name" : nodeName
	                    				,"apiType" : "/v1/plugins"
	                    				,"fileNameList" : fileNameList
	                    		}
	                    		
	                    		// group plugin add
	                            DataService.httpPost('/popup/addPlugin.json', $scope.addPluginInfo, function(result) {
	                                if (result.result == 1) {
	                                	var result = JSON.parse(result.data);
	                                	
	                                	if (result.meta.code == 201) {
	                                		alert("The Plugin is loaded.");
	                                		$rootScope.getPluginList();
	                                		popup.close();
	                					}else {
	                						alert("Failed : HTTP error code : "+ result.meta.code + " : " + result.meta.message);
	                					}
	                                }else{
	                                	alert(result.errorMessage);
	                                }
	                            });
	                            ap($scope);
	                    	}
	                    };
	                    
	                    
	                    // Plugin 그리드 옵션 설정
	                    function setGridPopupPluginOption() {
	                        $scope.gridPluginPopupOptions = {
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
	                                    name: 'plugin_name',
	                                    field: 'pluginName',
	                                    displayName: $translate.instant("COMMON.NAME"),
	                                    width: 110,
	                                    cellClass: 'txt-c',
	                                    headerCellClass: 'txt-c',
	                                    enableColumnMenu: false,
	                                    cellTooltip:true,
	                                    headerTooltip:true
	                                }, {
	                                    name: 'plugin_version',
	                                    field: 'pluginVersion',
	                                    displayName: $translate.instant("GROUP.VERSION"),
	                                    width: 80,
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
	                                    name: 'last_up_time',
	                                    field: 'lastUpTime',
	                                    displayName: $translate.instant("PLUGIN.UPDATE_DATE"),
	                                    cellTooltip:true,
	                                    width: 200,
	                                    cellClass: 'txt-c',
	                                    headerCellClass: 'txt-c',
	                                    enableColumnMenu: false,
	                                    headerTooltip:true
	                                }
	                            ],
	                            appScopeProvider: {
	                                selectedData: function(row) {
	                                    $scope.selectedData = row.data;
	                                    $scope.showDataPop = true;
	                                },
	                                onClickCheckbox : function(row) {
	            					},
	            					onClickCheckboxHeader : function(row) {
	            						var rows = $scope.gridPluginPopApi.grid.api.grid.rows;
	            						for (var i = 0; i < rows.length; i++) {
	            							rows[i].entity.checked = $scope.gridPluginPopApi.grid.appScope.allChecked;
	            						}
	            					},
	                            },
	                            onRegisterApi: function(gridApi){
	                            	$scope.gridPluginPopApi = gridApi;
	                            	$scope.gridPluginPopApi.core.handleWindowResize();
	                            }
	                        };
	                    };
	                    
	                    function initialize(){
	                    	setGridPopupPluginOption();
	                    	$scope.popupPluginList();
	                    };
	                    
	                    initialize();
	                }]
	            });
	        },
            
	        
	        
	        //Task Popup
            openTaskPop: function(params) {
	            var popup = ngDialog.open({
	                template: '/task-popup-info',
	                className:"ngdialog-theme-default custom-width",
	                disableAnimation: true,
	                cache:false,
	                showClose: false,
	                closeByDocument:false,
	                closeByEscape:false, 
	                controller: ['$scope', "$http", "DataService", "$rootScope", function($scope, $http, DataService, $rootScope) {
	                	
	                    $scope.popupTaskList = function() {

	                    	$http({
                                method: "POST",
                                url: "/popup/getTaskPopupList.json",
                                data: params,
                                headers: {
                                    "Content-Type": "application/json"
                                }
                            }).then(function(data) {
                            	var result = data.data;
								$scope.gridTaskPopupOptions.data = result.data;
                            });
	                    }
	                    
	                    $scope.closeTaskPopup = function () {
	                    	popup.close();
	                    }
	                    
	                    $scope.addTask = function(){
	                    	var taskDetailList = [];
	                    	var rows = $scope.gridTaskPopApi.grid.api.grid.rows;
	                    	
	                    	for(var i=0;i<rows.length;i++) {
	                    		var entity = rows[i].entity;
	                    		if(entity.checked) {
	                    			taskDetailList.push(entity.taskFileContents);
	                    		}
	                    	}
	                    	
	                    	if(taskDetailList.length == 0){
	                    		alert("No data selected.");
	                    		return false;
	                		}
	                    	
	                    	var ipInfo = params.ipInfo;
	                    	var nodeName = params.nodeName;
	                    	
	                    	if(ipInfo != null){
	                    		$scope.addTaskInfo = {
	                					"ip" : ipInfo
	                					,"node_name" : nodeName
	                    				,"apiType" : "/v1/tasks"
	                    				,"taskDetailList" : taskDetailList
	                    		}
	                    		
	                    		// group task add
	                            DataService.httpPost('/popup/addTask.json', $scope.addTaskInfo, function(result) {
	                                if (result.result == 1) {
	                                	var result = JSON.parse(result.data);
	                                	
	                                	if (result.meta.code == 201) {
	                                		alert("The Task is created.");
	                                		$rootScope.getTaskList();
	                                		popup.close();
	                					}else {
	                						alert("Failed : HTTP error code : "+ result.meta.code + " : " + result.meta.message);
	                					}
	                                }else{
	                                	alert(result.errorMessage);
	                                }
	                            });
	                            ap($scope);
	                    	}
	                    };
	                    
	                    
	                    $scope["taskInfo"] = {};
	                    
	                    function bindTaskInfo(entity) {
	                    	$scope["taskInfo"]["taskFileName"] = entity["taskFileName"];
	                    	$scope["taskInfo"]["taskFileContents"] = entity["taskFileContents"];
	          		  	};
	          		  
	          		  	function resetTaskInfo() {
	          		  		$scope["taskInfo"] = {};
	          		  	};
	
		                //Task 그리드 옵션 설정
	                    function setGridPopupTaskOption() {
	                        $scope.gridTaskPopupOptions = {
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
	                                    name: 'task_file_name',
	                                    field: 'taskFileName',
	                                    displayName: $translate.instant("COMMON.NAME"),
	                                    //width: 290,
	                                    cellClass: 'txt-l',
	                                    headerCellClass: 'txt-c',
	                                    enableColumnMenu: false,
	                                    cellTooltip:true,
	                                    headerTooltip:true
	                                }, {
	                                    name: 'last_up_time',
	                                    field: 'lastUpTime',
	                                    displayName: $translate.instant("PLUGIN.UPDATE_DATE"),
	                                    cellTooltip:true,
	                                    //width: 200,
	                                    cellClass: 'txt-c',
	                                    headerCellClass: 'txt-c',
	                                    enableColumnMenu: false,
	                                    headerTooltip:true
	                                }
	                            ],
	                            appScopeProvider: {
	                                selectedData: function(row) {
	                                    $scope.selectedData = row.data;
	                                    $scope.showDataPop = true;
	                                },
	                                onClickCheckbox : function(row) {
	            						console.log(row);
	            					},
	            					onClickCheckboxHeader : function(row) {
	            						var rows = $scope.gridTaskPopApi.grid.api.grid.rows;
	            						for (var i = 0; i < rows.length; i++) {
	            							rows[i].entity.checked = $scope.gridTaskPopApi.grid.appScope.allChecked;
	            						}
	            					},
	                            },
	                            onRegisterApi: function(gridApi){
	                            	$scope.gridTaskPopApi = gridApi;
	                            	$scope.gridTaskPopApi.core.handleWindowResize();
	                            	
	                            	gridApi.selection.on.rowSelectionChanged($scope, function(row) {
	                                	if (gridApi.selection.getSelectedCount() > 0) {
	            							bindTaskInfo(gridApi.grid.selection.lastSelectedRow.entity);
	            						} else {
	            							resetTaskInfo();
	            						}
	            					});
	                            }
	                        };
	                    };
	                    
	                    
	                    function initialize(){
	                    	setGridPopupTaskOption();
	                    	$scope.popupTaskList();
	                    };
	                    
	                    initialize();
	                }]
	            });
	        },
	        
	        
	        //Node Popup
            openNodePop: function(params) {
	            var popup = ngDialog.open({
	                template: '/node-popup-info',
	                className:"ngdialog-theme-default custom-width",
	                disableAnimation: true,
                    cache:false,
                    showClose: false,
                    closeByDocument:false,
                    closeByEscape:false, 
	                controller: ['$scope', "$http", "DataService", "$rootScope", function($scope, $http, DataService, $rootScope) {
	                	
	                	/* server select box 검색*/
	                	$scope.searchServerTypeModel= [
	            			{label: "All", 			value: ""},
	            			{label: "VM", 			value: "VM"},
	            			{label: "PM", 			value: "PM"}
	            		];
	                	
	                	// pagination.js
                        // pagination-directive
                        $scope.totalPage = 100;
                        $scope.itemsPerPage = 20;
                        $scope.maxSize = 10;
                        $scope.currentPage = 1;
                        
                        $scope.typeList = [];
                        
                        $scope.selectPage = function(value) {
                            $scope.currentPage = value;
                            $scope.searchNodePopupConditions.pageIndex = $scope.currentPage;
                            $scope.searchNodePopupConditions.pageCount = $scope.itemsPerPage;
                            $scope.popupNodeList();
                        }

                        $scope.searchNodePopupConditions = {
	        				"pageIndex" : $scope.currentPage
	        				,"pageCount" : $scope.itemsPerPage
	        				,"hostName" : null
	        				,"serialNumber" : null
	        				,"nodeType" : null
	        				,"ip" : null
	        				,"osName" : null
	        				,"manufacture" : null
	        				,"agreementSeq" : params.agreementSeq
	        				,"agreementName" : params.agreementName
                		}
	                	
	                    $scope.popupNodeList = function() {

	                    	$http({
                                method: "POST",
                                url: "/popup/getNodePopupList.json",
                                data: $scope.searchNodePopupConditions,
                                headers: {
                                    "Content-Type": "application/json"
                                }
                            }).then(function(data) {
                            	var result = data.data;
								$scope.gridNodePopupOptions.data = result.data.list;
								$scope.totalPage = result.data.count;
                            });
	                    };
                        
                        $scope.popupNodeSearchInit = function () {
                            $scope.itemsPerPage = 20;
                            $scope.currentPage = 1;
                            $scope.searchNodePopupConditions.pageIndex = $scope.currentPage;
                            $scope.searchNodePopupConditions.pageCount = $scope.itemsPerPage;
	                    	$scope.searchNodePopupConditions.hostName = "";
	                    	$scope.searchNodePopupConditions.serialNumber = "";
	                    	$scope.searchNodePopupConditions.nodeType = "";
	                    	$scope.searchNodePopupConditions.ip = "";
	                    	$scope.searchNodePopupConditions.osName = "";
	                    	$scope.searchNodePopupConditions.manufacture = "";
	                    };
	                    
	                    $scope.closeNodePopup = function () {
	                    	popup.close();
	                    };
	                    
	                    $scope.onNodeAdd = function(){
	            			var hostNameList = [];
	            			var ipInfoList = [];
	                    	var rows = $scope.gridNodeApi.grid.api.grid.rows;
	                    	
	                    	for(var i=0;i<rows.length;i++) {
	                    		var entity = rows[i].entity;
	                    		if(entity.checked) {
	                    			hostNameList.push(entity.hostName);
	                    			ipInfoList.push(entity.ip + ":"+ entity.restApiPort);
	                    		}
	                    	}
	                    	
	                    	
	                    	if(hostNameList.length == 0){
	                    		alert("No data selected.");
	                    		return false;
	                		}
	                    	
	                    	var groupName = params.agreementName;
	                    	addNode(groupName, ipInfoList, hostNameList);
	            		};
	            		
	            		//통합검색
	            		$scope.getSearchCondition = function(searchParam){
	            			console.log('SEARCH_PARAM:', searchParam);
	            			
	            			$scope.searchNodePopupConditions.isDefault = "-1";
	            			
	            			$scope.searchNodePopupConditions.hostName = null;
	                    	$scope.searchNodePopupConditions.serialNumber = null;
	                    	$scope.searchNodePopupConditions.nodeType = null;
	                    	$scope.searchNodePopupConditions.ip = null;
	                    	$scope.searchNodePopupConditions.osName = null;
	                    	$scope.searchNodePopupConditions.manufacture = null;
	            		
	            			
	            			if(searchParam.param_hostName) {
	            				$scope.searchNodePopupConditions.hostName = searchParam.param_hostName;
	            			}
	            			
	            			if(searchParam.param_serialNumber) {
	            				$scope.searchNodePopupConditions.serialNumber = searchParam.param_serialNumber;	
	            			}
	            			
	            			if(searchParam.param_nodeType) {
	            				$scope.searchNodePopupConditions.nodeType = searchParam.param_nodeType;
	            			}
	            			
	            			if(searchParam.param_ip) {
	            				$scope.searchNodePopupConditions.ip = searchParam.param_ip;
	            			}
	            			
	            			if(searchParam.param_osName) {
	            				$scope.searchNodePopupConditions.osName = searchParam.param_osName;
	            			}
	            			
	            			if(searchParam.param_manufacture) {
	            				$scope.searchNodePopupConditions.manufacture = searchParam.param_manufacture;
	            			}
	            			
	            			if(searchParam.param_TotalSearch != null  && searchParam.param_TotalSearch != undefined && searchParam.param_TotalSearch != ''){
	            				$scope.searchNodePopupConditions.isDefault = "1";
	            				$scope.searchNodePopupConditions.hostName = searchParam.param_TotalSearch;
	            				$scope.searchNodePopupConditions.serialNumber = searchParam.param_TotalSearch;
	            				$scope.searchNodePopupConditions.nodeType = searchParam.param_TotalSearch;
	            				$scope.searchNodePopupConditions.ip = searchParam.param_TotalSearch;
	            				$scope.searchNodePopupConditions.osName = searchParam.param_TotalSearch;
	            				$scope.searchNodePopupConditions.manufacture = searchParam.param_TotalSearch;
	            			}
	            			
	            			$scope.popupNodeList();
	            		};
	            		
	                    
	                    $scope.inputGroupInfo = {
                    		"apiType" : null
                    		,"ip" : null
            				,"nodeNameList" : null
            				,"groupName" : null
			    		};
	                    
	                    // 검색 조건 설정
	                    function initializeTypeList() {
	                        $scope.typeList =  [
	                            {value:'hostName', label:'Host Name', input:'text', placeholder:"Please enter Host Name."},
	                            {value:'serialNumber', label:'	Serial Number', input:'text', placeholder:"Please enter Serial Number."},
	                            {value:'nodeType', label:'Type', input:'select', optionList:$scope.searchServerTypeModel},
	                            {value:'ip', label:'IP', input:'text', placeholder:"Please enter IP."},
	                            {value:'osName', label:'OS Name', input:'text', placeholder:"Please enter OS Name."},
	                            {value:'manufacture', label:'Manufacture', input:'text', placeholder:"Please enter Manufacture."}
	                        ];
	                    };
			            
			            function addNode(groupName, ipInfo, hostNameList) {
			            	$scope.inputGroupInfo.apiType = "/v1/tribe/agreements/" + groupName + "/join";
			            	$scope.inputGroupInfo.nodeNameList = hostNameList;
			            	$scope.inputGroupInfo.groupName = groupName;
			            	$scope.inputGroupInfo.ip = ipInfo[0];
			            	
			            	DataService.httpPost("/popup/addNode.json", $scope.inputGroupInfo, function(groupData) {
	                    		
			            		if (groupData.result == 1) {
	              		          	var result = JSON.parse(groupData.data);
	              		          	
	              		          	if (result.meta.code == 200) {
	                                  	alert("The Node is joined.");
	                                  	$rootScope.getNodeList();
	                                  	popup.close();
	              					} else if(result.meta.code == 400){
	              						alert("Failed : HTTP error code : "+ result.meta.code + " : " + result.meta.message);
	              					}else {
	              						alert(result.errorMessage);
	              					}
	                    		}else {
              						alert(result.errorMessage);
              					}
	                    	});
	                    	ap($scope);
			            };
	                    
	                    // node popup 그리드 옵션 설정
	                    function setGridPopupNodeOption() {
	                        $scope.gridNodePopupOptions = {
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
                                    width: 100,
                                    cellClass: 'txt-c',
                                    headerCellClass: 'txt-c',
                                    enableColumnMenu: false,
                                    cellTooltip:true,
                                    headerTooltip:true
                                }, {
                                    name: 'disk',
                                    field: 'disk',
                                    displayName: $translate.instant("GROUP.DISK"),
                                    width: 100,
                                    cellClass: 'txt-c',
                                    headerCellClass: 'txt-c',
                                    enableColumnMenu: false,
                                    cellTooltip:true,
                                    headerTooltip:true
                                }, {
                                    name: 'node_type',
                                    field: 'nodeType',
                                    displayName: $translate.instant("GROUP.TYPE"),
                                    width: 100,
                                    cellClass: 'txt-c',
                                    headerCellClass: 'txt-c',
                                    cellTooltip:true,
                                    enableColumnMenu: false,
                                    headerTooltip:true
                                }, {
                                    name: 'os_name',
                                    field: 'osName',
                                    displayName: $translate.instant("GROUP.OS") + " "+ $translate.instant("COMMON.NAME"),
                                    width: 100,
                                    cellClass: 'txt-c',
                                    headerCellClass: 'txt-c',
                                    cellTooltip:true,
                                    enableColumnMenu: false,
                                    headerTooltip:true
                                }, {
                                    name: 'os_version',
                                    field: 'osVersion',
                                    displayName: $translate.instant("GROUP.OS") + " "+ $translate.instant("GROUP.VERSION"),
                                    width: 100,
                                    cellClass: 'txt-c',
                                    headerCellClass: 'txt-c',
                                    cellTooltip:true,
                                    enableColumnMenu: false,
                                    headerTooltip:true
                                }, {
                                    name: 'manufacture',
                                    field: 'manufacture',
                                    displayName: $translate.instant("GROUP.MANUFACTURER"),
                                    width: 180,
                                    cellClass: 'txt-c',
                                    headerCellClass: 'txt-c',
                                    cellTooltip:true,
                                    enableColumnMenu: false,
                                    headerTooltip:true
                                }],
	                            appScopeProvider: {
	                                selectedData: function(row) {
	                                    $scope.selectedData = row.data;
	                                    $scope.showDataPop = true;
	                                },
	                                onClickCheckbox : function(row) {
	            					},
	            					onClickCheckboxHeader : function(row) {
	            						var rows = $scope.gridNodeApi.grid.api.grid.rows;
	            						for (var i = 0; i < rows.length; i++) {
	            							rows[i].entity.checked = $scope.gridNodeApi.grid.appScope.allChecked;
	            						}
	            					},
	                            },
	                            onRegisterApi: function(gridApi){
	                            	$scope.gridNodeApi = gridApi;
	                            	$scope.gridNodeApi.core.handleWindowResize();
	                            }
	                        };
	                    };
	                    
	                    function initialize(){
	                    	initializeTypeList();
	                    	setGridPopupNodeOption();
	                    	$scope.popupNodeList();
	                    };
	                    
	                    initialize();
	                }]
	            });
	        },
	        
	        //group add Popup
	        openGroupAddPop: function() {
		
			    var popup = ngDialog.open({
			        template: '/group-add-popup',
			        className:"ngdialog-theme-default custom-width",
			        disableAnimation: true,
			        cache:false,
			        showClose: false,
			        closeByDocument:false,
			        closeByEscape:false, 
			        controller: ['$scope', '$rootScope', "$http", "DataService", function($scope, $rootScope, $http, DataService ) {
			
			            $scope.inputGroupInfo = {
		    				"groupName" : null
		    				,"apiType" : null
		    				,"ip" : null
			    		};
			            
			            $scope.onGroupAdd = function() {
			            	$scope.inputGroupInfo.groupName = $scope.groupName;
			            	$scope.inputGroupInfo.apiType = "/v1/tribe/agreements";
			            	
			            	DataService.httpPost("/popup/createGroup.json", $scope.inputGroupInfo, function(groupData) {
	                    		
			            		if (groupData.result == 1) {
	              		          	var result = JSON.parse(groupData.data);
	              		          	
	              		          	if (result.meta.code == 200) {
	                                  	alert("is ["+ $scope.inputGroupInfo.groupName + "] Group Created");
	                                  	
	                                  	$rootScope.groupListInfo();
	                                  	popup.close();
	              					} else if(result.meta.code == 400){
	              						alert("Failed : HTTP error code : "+ result.meta.code + " : " + result.meta.message);
	              					}else {
	              						alert(result.errorMessage);
	              					}
	                    		}else {
              						alert(result.errorMessage);
              					}
	                    	});
	                    	ap($scope);
			            };
			            
			            $scope.submitForm = function(form) {
			    			if (form.$valid) {
			    				$scope.onGroupAdd();
			    			}else {
			    				var required = form.$error.required;
			    				
			    				if(required.length > 0) {
			    					alert("Please enter a required value");
			    					return false;
			    				}
			    			}
			    		};
			            
			            $scope.closeGroupAddPopup = function () {
			            	popup.close();
			            };
			
			            function initialize(){
			            };
			            
			            initialize();
			        }]
			    });
			},
			
			
			//group delete Popup
			openGroupDelPop: function() {
		
			    var popup = ngDialog.open({
			        template: '/group-del-popup',
			        className:"ngdialog-theme-default custom-width",
			        disableAnimation: true,
			        cache:false,
			        showClose: false,
			        closeByDocument:false,
			        closeByEscape:false, 
			        controller: ['$scope', '$rootScope', "$http", "DataService", function($scope, $rootScope, $http, DataService) {
			
			        	$scope.delGroupInfo = {
		    				"apiType" : null
			    		};
			            
			            $scope.onGroupSearch = function() {
			                $http({
			                    method: "POST",
			                    url: "/popup/getGroupList.json",
			                    headers: {
			                        "Content-Type": "application/json"
			                    }
			                }).then(function(data) {
			                	var result = data.data;
								$scope.gridGroupOptions.data = result.data;
			                });
			            };
			            
			            $scope.closeGroupDelPopup = function () {
			            	popup.close();
			            };
			            
			            // 그리드 옵션 설정
                        function setGridGroupOption() {
                            $scope.gridGroupOptions = {
                                enableSorting: false,
                                enableRowSelection: true,
                                //enableFullRowSelection: true,
                                columnDefs: [{
                                        name: 'agreement_name',
                                        field: 'agreementName',
                                        displayName: $translate.instant('COMMON.NAME'),
                                        enableColumnMenu: false,
                                        cellClass: 'txt-c',
                                        headerCellClass: 'txt-c',
                                        cellTooltip: true,
                                        headerTooltip: true
                                        //,width: 120
                                    }, {
                                        name: 'action',
                                        field: 'action',
                                        displayName: $translate.instant("TASK.ACTION"),
                                        cellTemplate: '<div class="ui-grid-cell-contents"><button type="button" class="ico-md i-trash" title="Delete" ng-click="grid.appScope.onGroupDel(row)"></button></div>',
                                        width: 80,
                                        cellClass: 'txt-c',
                                        headerCellClass: 'txt-c',
                                        enableSorting:false,
                                        cellTooltip:true,
                                        enableColumnMenu: false,
                                        headerTooltip:true
                                    }
                                ],
                                appScopeProvider: {
                                    selectedData: function(row) {
                                        $scope.selectedData = row.data;
                                        $scope.showDataPop = true;
                                    },
                                    onGroupDel : function(row) {
                                    	if(row.entity.nodeCnt > 0){
                                    		alert("There is a node included in the group.\nYou can not delete a group included a node.");
                                    		return false;
                                    	}

                                    	if(!confirm("Are you sure you want to delete it?")) {
                			        		return false;
                			        	}

            			            	$scope.delGroupInfo.apiType = "/v1/tribe/agreements/" + row.entity.agreementName;
            			            	
            			            	DataService.httpPost("/popup/delGroup.json", $scope.delGroupInfo, function(groupData) {
            			            		if (groupData.result == 1) {
            	              		          	var result = JSON.parse(groupData.data);
            	              		          	
            	              		          	if (result.meta.code == 200) {
            	                                  	alert("Is Group Deleted.");
            	                                  	$scope.onGroupSearch();
            	                                  	$rootScope.groupListInfo();
            	              					} else {
            	              						alert(result.errorMessage);
            	              					}
            	                    		}else {
                          						alert(result.errorMessage);
                          					}
            	                    	});
            	                    	ap($scope);
            			            }
                            
                                },onRegisterApi: function(gridApi){
                                	$scope.gridGroupDelApi = gridApi;
                                	$scope.gridGroupDelApi.core.handleWindowResize();
                                }
                            };
                        };
			
			            function initialize(){
			            	setGridGroupOption();
			            	$scope.onGroupSearch();
			            };
			            
			            initialize();
			        }]
			    });
			},
			
			
			
			
			//change compare Popup
			openComparePop: function(params) {
	            var popup = ngDialog.open({
	                template: '/compare-popup-info',
	                className:"ngdialog-theme-default custom-width",
	                disableAnimation: true,
	                cache:false,
	                showClose: false,
	                closeByDocument:false,
	                closeByEscape:false, 
	                controller: ['$scope', "$http", function($scope, $http) {

	                    $scope.popupCompareList = function() {

	                    	$http({
                                method: "POST",
                                url: "/popup/getComparePopupList.json",
                                data: params,
                                headers: {
                                    "Content-Type": "application/json"
                                }
                            }).then(function(data) {
                            	var result = data.data;
								$scope.gridHmsPopupOptions.data = result.data.hmsList;
								$scope.gridCmdbPopupOptions.data = result.data.cmdbList;
                            });
	                    };
	                    
	                    $scope.closeComparePopup = function () {
	                    	popup.close();
	                    };
	                    
	                    // Plugin 그리드 옵션 설정
	                    function setGridPopupCompareOption() {
	                        $scope.gridHmsPopupOptions = {
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
	                                    enableColumnMenu: false,
	                                    headerTooltip:true
	                                }
	                            ],
	                            appScopeProvider: {
	                                selectedData: function(row) {
	                                    $scope.selectedData = row.data;
	                                    $scope.showDataPop = true;
	                                },
	                                onClickCheckbox : function(row) {
	            					},
	            					onClickCheckboxHeader : function(row) {
	            						var rows = $scope.gridHmsApi.grid.api.grid.rows;
	            						for (var i = 0; i < rows.length; i++) {
	            							rows[i].entity.checked = $scope.gridHmsApi.grid.appScope.allChecked;
	            						}
	            					},
	                            },
	                            onRegisterApi: function(gridApi){
	                            	$scope.gridHmsApi = gridApi;
	                            	$scope.gridHmsApi.core.handleWindowResize();
	                            }
	                        },
	                        $scope.gridCmdbPopupOptions = {
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
	                                    enableColumnMenu: false,
	                                    headerTooltip:true
	                                }
	                            ],
	                            appScopeProvider: {
	                                selectedData: function(row) {
	                                    $scope.selectedData = row.data;
	                                    $scope.showDataPop = true;
	                                },
	                                
	                            },
	                            onRegisterApi: function(gridApi){
	                            	$scope.gridCmdbApi = gridApi;
	                            	$scope.gridCmdbApi.core.handleWindowResize();
	                            }
	                        };
	                    };
	                    
	                    function initialize(){
	                    	setGridPopupCompareOption();
	                    	$scope.popupCompareList();
	                    };
	                    
	                    initialize();
	                }]
	            });
	        },
	        
	        
	        //fileupload Popup
	        openFileUploadPop: function(params) {

	            var popup = ngDialog.open({
	                template: '/fileUpload-popup',
	                className:"ngdialog-theme-default custom-width",
	                disableAnimation: true,
	                cache:false,
	                showClose: false,
	                closeByDocument:false,
	                closeByEscape:false, 
	                controller: ['$scope', "$http", function($scope, $http) {
	
	                    $scope.closeFileUploadPopup = function () {
	                    	popup.close();
	                    };
	                    
	                    $scope.fileInfo = {
            				"files" : null
            				,"type" : null
                		};
	                    
	                    $scope.uploadFile = function(){
	                        var file = $scope.myFile;
	                        if(file == undefined){
	                        	//파일을 선택하세요.
	                        	alert("Please select a file.");
	                        	return false;
	                        }
	                        
	                        var uploadUrl = "/popup/fileUpload.json";
	                        uploadFileToUrl(file, uploadUrl);
	                    };
                		
                		function uploadFileToUrl(file, uploadUrl){
                	        var fd = new FormData();
                	        fd.append('file', file);
                	        $http.post(uploadUrl, fd, {
                	            transformRequest: angular.identity,
                	            headers: {'Content-Type': undefined}
                	        })
                	        .success(function(){
                	        	alert("File Upload Success");
                	        	$rootScope.getPluginList();
                	        	popup.close();
                	        })
                	        .error(function(){
                	        	alert("File Upload Error");
                	        	popup.close();
                	        });
                	    };
	                    
	                    function initialize(){
	                    	
	                    };
	                    
	                    initialize();
	                }]
	            });
	        },
	        
	        
        }
    }
});