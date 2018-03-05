define(["app", "apps/group/group-model", "apps/group/group-filter-model"], function(app, TargetModel, ResourceFilter){
	app.controller("TaskMgmtCtrl",["$scope", "DataService", "$translate", "uiGridConstants", "ngDialog", "$interval", "PopupSearch", "$rootScope", 
		function($scope, DataService, $translate, uiGridConstants, ngDialog, $interval, PopupSearch, $rootScope) {
		
		"use strict";
		
		var taskMgmtCtrl = this;
		 
		
		// 검색조건 객체.
		taskMgmtCtrl.filter = new ResourceFilter();
		
		taskMgmtCtrl["taskInfo"] = {};
		taskMgmtCtrl.gridTaskOptions = {};
		
		taskMgmtCtrl.gridTaskApi = null;
		
		// pagination.js
		/* server select box 검색*/
		taskMgmtCtrl.searchTaskTypeModel= [
			{label: "All", 				value: ""},
			{label: "Running", 	value: "Running"},
			{label: "Stop", 			value: "Stop"}
		];
		
		
		/*------------------------------------- 컬럼 정렬 처리-------------------------------------------------------*/
		// Task 컬럼별 정렬하기.
		/*taskMgmtCtrl.sortTaskChanged = function ( grid, sortColumns ) {
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
		        
		        taskMgmtCtrl.filter.taskOrder = field;
		        taskMgmtCtrl.filter.taskExp = exp;
		        getTaskList(taskMgmtCtrl.filter);
			}
	    }*/
		
		
		/*------------------------------------- 데이터 조회 처리-------------------------------------------------------*/
		// task 조회
		taskMgmtCtrl.onTaskSearch = function(){
			taskMgmtCtrl.filter.taskOrder = '';
			taskMgmtCtrl.filter.taskExp = '';
	        
	        getTaskList(taskMgmtCtrl.filter);
		};
		
		
		// reset버튼 클릭시 검색조건 초기화
		taskMgmtCtrl.onSearchInit = function() {
			taskMgmtCtrl.filter.taskFileName = "";
			taskMgmtCtrl.filter.taskDeadline = "";
			taskMgmtCtrl.filter.taskState = "";
	    };
		
		//task 생성을 위해 빈값 세팅
		taskMgmtCtrl.addTask = function() {
			resetTaskInfo();
			$("#taskFileName").prop("disabled", false);
			$("#taskFileName").focus();
			taskMgmtCtrl.gridTaskApi.selection.clearSelectedRows();
		};
		
		//task 삭제
		taskMgmtCtrl.delTask = function() {
			var taskNameList = [];
	      	var rows = taskMgmtCtrl.gridTaskApi.grid.api.grid.rows;
	      	
	      	for(var i=0;i<rows.length;i++) {
	      		var entity = rows[i].entity;
	      		if(entity.checked) {
	      			taskNameList.push(entity.taskFileName);
	      		}
	      	}
	      	
	      	if(taskNameList.length == 0){
	      		alert("No data selected.");
	      		return false;
	  		}
	      	
	      	deleteTask(taskNameList);
		};
		
		
		//task 생성
		taskMgmtCtrl.saveTask = function(){
			DataService.httpPost("/task/getDuplicationsTaskName.json", taskMgmtCtrl["taskInfo"], function(nameYn) {
				if (nameYn.data == 0) {
					DataService.httpPost("/task/addTask.json", taskMgmtCtrl["taskInfo"], function(result) {
						if (result.result == 1) {
							alert("It has been registered.");
							getTaskList();
							taskMgmtCtrl.addTask();
						}else{
							alert(result.errorMessage);
						}
					});
				}else{
					alert("There is the same task file name. Please change the file name.");		//동일한 task 파일명이 있습니다. 파일명을 변경하십시오.
				}
			});
	      ap($scope);
		};
		
		
		//task 수정
		taskMgmtCtrl.modifyTask = function(){
			DataService.httpPost("/task/addTask.json", taskMgmtCtrl["taskInfo"], function(result) {
				if (result.result == 1) {
					alert("It has been fixed.");
					getTaskList();
				}else{
					alert(result.errorMessage);
				}
			});
		  ap($scope);
		};
		
		//Task Status Per Node 팝업
		taskMgmtCtrl.getTaskStatusDetail = function(){
			$scope.popup = ngDialog.open({
				template: '/task-status-node-info',
                className:"ngdialog-theme-default",
                showClose:false,
                disableAnimation: true,
                cache:false,
                closeByDocument:false,
                closeByEscape:false, 
                scope:$scope
            }); 
		};
		
		
		//task file delete
		function deleteTask(taskNameList) {
			if(!confirm("Are you sure you want to delete the selected Task?")) {
		  		return false;
		  	}
			
			taskMgmtCtrl.deleteTaskInfo = {
				"taskNameList" : taskNameList
			}
			
			// group task 삭제
			DataService.httpPost('/task/deleteTask.json', taskMgmtCtrl.deleteTaskInfo, function(result) {
				if (result.result == 1) {
					alert("It has been deleted.");
					getTaskList();
					taskMgmtCtrl.addTask();
				}else{
					alert(result.errorMessage);
				}
			});
			ap($scope);
		};
		
		
		$scope.submitTaskForm = function(form) {
			var response = false;

			if (form.$valid) {
				if(taskMgmtCtrl.gridTaskApi.selection.getSelectedCount() > 0) {
					try {
						//json 형식 체크
						response = JSON.parse(taskMgmtCtrl["taskInfo"]["taskFileContents"]);
					} catch (error) {
						response = false;
					} 
					
					//수정
					if(response && typeof response =='object') {
						taskMgmtCtrl.modifyTask();
					} else {
						alert("is not JSON type String");
					}
				}else {
					try {
						//json 형식 체크
						response = JSON.parse(taskMgmtCtrl["taskInfo"]["taskFileContents"]);
					} catch (error) {
						response = false;
					} 
					
					//추가
					if(response && typeof response =='object') {
						
						var fileName = taskMgmtCtrl["taskInfo"]["taskFileName"];
						if((fileName.indexOf(".json") == -1)){
							taskMgmtCtrl["taskInfo"]["taskFileName"] = taskMgmtCtrl["taskInfo"]["taskFileName"] + ".json"; 
						}
						
						taskMgmtCtrl.saveTask();
					} else {
						alert("is not JSON type String");
					}
				}
			}else {
				var required = form.$error.required;

				if(required.length > 0) {
					if($("#taskFileName").val() == ""){
						$("#taskFileName").focus();
						alert("Please enter a Name value.");
						return false;
					}
					if($("#taskFileContents").val() == ""){
						$("#taskFileContents").focus();
						alert("Please enter a Detail value.");
						return false;
					}
				}
			}
		};
		
		
		// function
    	/*------------------------------------- grid data 조회-------------------------------------------------------*/
        //task list 검색 
		function taskDetailList() {
			getTaskList();
		};
		
		//plugin list (필터기능)
		function getTaskList() {
		    DataService.httpPost("/task/getTaskList.json", taskMgmtCtrl.filter, function(result) {
		      if (result.result == 1) {
		          	taskMgmtCtrl.gridTaskOptions.data = result.data;
		          }
		      });
		      ap($scope);
		  };
		  
		  function bindTaskInfo(entity) {
			  $("#taskFileName").prop("disabled", true);
			  taskMgmtCtrl["taskInfo"]["taskFileName"] = entity["taskFileName"];
			  taskMgmtCtrl["taskInfo"]["taskFileContents"] = entity["taskFileContents"];
		  };
		  
		  function resetTaskInfo() {
			  taskMgmtCtrl["taskInfo"] = {};
		  };
		  
		
		
		/*------------------------------------- grid 초기화 처리-------------------------------------------------------*/
		// task GRID 초기화.
		function gridTaskList(){
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
                headerTooltip:true,
                //width: 200,
                cellClass: 'txt-c',
                headerCellClass: 'txt-c',
                enableColumnMenu: false,
                headerTooltip:true
            }];
            
    		// task GRID OPTIONS
            taskMgmtCtrl.gridTaskOptions = {
            		columnDefs:columnDefs,
            		enableRowSelection : true,
    				enableRowHeaderSelection : false,
    				enableFullRowSelection:true,
    				multiSelect : false,
    				modifierKeysToMultiSelect : false,
    				noUnselect : true,
    				enableColumnResizing : true,
    				enableHorizontalScrollbar:uiGridConstants.scrollbars.ALWAYS,
                    excessRows:10,
                    rowHeight: 30,
                    appScopeProvider: {
                        onRowDblClick: function(row) {
                            if (!row) {
                                return;
                            }
                            //alert(row.entity.taskState);
                            //taskMgmtCtrl.filter.reqId = row.entity.reqId;
                            //taskMgmtCtrl.filter.phase = null;
            	 			//taskMgmtCtrl.filter.serviceName = null;
                            
                            //taskMgmtCtrl.getNodeDetail(row.entity);
                        },
                        onClickCheckbox : function(row) {
    					},
    					onClickCheckboxHeader : function(row) {
    						var rows = taskMgmtCtrl.gridTaskApi.grid.api.grid.rows;
    						for (var i = 0; i < rows.length; i++) {
    							rows[i].entity.checked = taskMgmtCtrl.gridTaskApi.grid.appScope.allChecked;
    						}
    					},
                    },
                    onRegisterApi: function(gridApi){
                        taskMgmtCtrl.gridTaskApi = gridApi;

                        gridApi.selection.on.rowSelectionChanged($scope, function(row) {
                        	if (gridApi.selection.getSelectedCount() > 0) {
    							bindTaskInfo(gridApi.grid.selection.lastSelectedRow.entity);
    						} else {
    							resetTaskInfo();
    						}
    					});
                    },
                    rowTemplate: "<div ng-dblclick=\"grid.appScope.onRowDblClick(row)\" ng-repeat=\"(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name\" class=\"ui-grid-cell\" ng-class=\"{ 'ui-grid-row-header-cell': col.isRowHeader }\" ui-grid-cell dbl-click-row></div>",
    		};
		};
		
		
		function initialize() {
			$interval.cancel($rootScope.stopInterval);
			gridTaskList();	//task grid setting
			taskDetailList();	//task 데이터 조회
		};
		
		initialize();
		
	}]);
	
	
	
	app.controller("TaskStatusDetailCtrl",["$scope", "$http", "DataService", "$translate", "uiGridConstants", "ngDialog", "$interval", "PopupSearch", "$rootScope",
		function($scope, $http, DataService, $translate, uiGridConstants, ngDialog, $interval, PopupSearch, $rootScope) {
		"use strict";
		var taskStatusDetailCtrl = this;
		var nodeSeq  = null;
		 
		// 검색조건 객체.
		taskStatusDetailCtrl.filter = new ResourceFilter();
		taskStatusDetailCtrl.ipInfo = null;
		taskStatusDetailCtrl.nodeName = null;
		taskStatusDetailCtrl.searchAgentGroupModel= [];
		taskStatusDetailCtrl.gridOptions = {};
		taskStatusDetailCtrl.gridApi = null;

		$scope.typeList = [];
		
		taskStatusDetailCtrl.searchStateModel= [
			{label: "All", 				value: ""}
			,{label: "Running", 		value: "Running"}
			,{label: "Stopped", 	value: "Stopped"}
			,{label: "Ended", 	value: "Ended"}
			,{label: "Disabled", 	value: "Disabled"}
		];
		
		
		taskStatusDetailCtrl.closePopup = function () {
			$scope.popup.close();
        };
		
		//조회
		taskStatusDetailCtrl.onSearch = function(){
			searchDetail(taskStatusDetailCtrl.filter);
		};
		
		// reset버튼 클릭시 검색조건 초기화
		taskStatusDetailCtrl.onSearchInit = function() {
			taskStatusDetailCtrl.filter.agreementSeq = "0";
			taskStatusDetailCtrl.filter.hostName = "";
			taskStatusDetailCtrl.filter.taskName = "";
			taskStatusDetailCtrl.filter.taskState = "";
	    };
	    
	    
	    //새로고침
	    taskStatusDetailCtrl.reload = function(url) {
	    	taskStatusDetailCtrl.filter.agreementSeq = "0";
			taskStatusDetailCtrl.filter.hostName = "";
			taskStatusDetailCtrl.filter.taskName = "";
			taskStatusDetailCtrl.filter.taskState = "";
	    	searchDetail();
  		};
	    
		
		function searchDetail() {
	        DataService.httpPost("/popup/getTaskStatusNodeInfo.json", taskStatusDetailCtrl.filter, refreshGridHandler);
        };
        
        
        function refreshGridHandler(data) {
			var result = data.data;
        	
        	// 주어진 데이터를 통해 GRID 리프레쉬한다.
        	taskStatusDetailCtrl.gridOptions.data = result;
            
            // select 0-index
            if (!taskStatusDetailCtrl.gridOptions.data) {
                return;
            }
            
			taskStatusDetailCtrl.gridOptions.data = result;
            ap($scope);
        };
        
        
        //통합검색
  		$scope.getSearchCondition = function(searchParam){
  			console.log('SEARCH_PARAM:', searchParam);
  			
  			taskStatusDetailCtrl.filter.isDefault = "-1";
  			taskStatusDetailCtrl.filter.agreementSeq = null;
  			taskStatusDetailCtrl.filter.hostName = null;
  			taskStatusDetailCtrl.filter.taskName = null;
  			taskStatusDetailCtrl.filter.taskState = null;
  			
  			if(searchParam.param_agreementSeq) {
  				taskStatusDetailCtrl.filter.agreementSeq = searchParam.param_agreementSeq;
			}
  			
  			if(searchParam.param_hostName) {
  				taskStatusDetailCtrl.filter.hostName = searchParam.param_hostName;
  			}
  			
  			if(searchParam.param_taskName) {
  				taskStatusDetailCtrl.filter.taskName = searchParam.param_taskNamer;	
  			}
  			
  			if(searchParam.param_taskState) {
  				taskStatusDetailCtrl.filter.taskState = searchParam.param_taskState;
  			}
  			
  			
  			if(searchParam.param_TotalSearch != null  && searchParam.param_TotalSearch != undefined && searchParam.param_TotalSearch != ''){
  				taskStatusDetailCtrl.filter.isDefault = "1";
  				taskStatusDetailCtrl.filter.agreementSeq = searchParam.param_TotalSearch;
  				taskStatusDetailCtrl.filter.hostName = searchParam.param_TotalSearch;
  				taskStatusDetailCtrl.filter.taskName = searchParam.param_TotalSearch;
  				taskStatusDetailCtrl.filter.taskState = searchParam.param_TotalSearch;
			}
  			
  			searchDetail();
  		};
        
        
        // 검색 조건 설정
 		function initializeTypeList() {
 		    $scope.typeList =  [
 		    	{value:'agreementSeq', label:'Group', input:'select', optionList:taskStatusDetailCtrl.searchAgentGroupModel},
 		        {value:'hostName', label:'Host Name', input:'text', placeholder:"Please enter Host Name."},
 		        {value:'taskName', label:'Task Name', input:'text', placeholder:"Please enter Task Name."},
 		        {value:'taskState', label:'Task State', input:'select', optionList:taskStatusDetailCtrl.searchStateModel}
 	        ];
 	    };
        
        

        // 그리드 옵션 설정
        function setGridOption() {
        	taskStatusDetailCtrl.gridOptions = {
        		//enableRowSelection : true,
				enableRowHeaderSelection : false,
				multiSelect : false,
				modifierKeysToMultiSelect : false,
				noUnselect : true,
				enableColumnResizing : true,
				//enableHorizontalScrollbar:uiGridConstants.scrollbars.ALWAYS,
                excessRows:10,
                rowHeight: 30,
                enableSorting: false,
                columnDefs: [{
	                    name: 'action',
	                    field: 'action',
	                    displayName: $translate.instant("TASK.ACTION"),
	                    cellTemplate: '<div class="ui-grid-cell-contents" style="padding-left:5px" ng-if="row.entity.taskState == \'Running\'"><button type="button" class="btn-gy" title="Start" ng-click="grid.appScope.onStopClick(row)" ng-if="row.entity.taskState == \'Running\'">Stop</button></div>'
	                    					+'<div class="ui-grid-cell-contents" style="padding-left:5px" ng-if="row.entity.taskState == \'Stopped\'"><button type="button" class="btn-cr2" title="Start" ng-click="grid.appScope.onStartClick(row)" ng-if="row.entity.taskState == \'Stopped\'">Start</button></div>'
	                    					+'<div class="ui-grid-cell-contents" style="padding-left:5px" ng-if="row.entity.taskState == \'Disabled\'"><button type="button" class="btn-cr2" title="Start" ng-click="grid.appScope.onEnableClick(row)" ng-if="row.entity.taskState == \'Disabled\'">Enable</button></div>'
	                    					+'<div class="ui-grid-cell-contents" style="padding-left:5px" ng-if="row.entity.taskState == \'Ended\'"></div>'
	                    ,
	                    enableSorting:false,
	                    enableColumnMenu: false,
	                    cellTooltip: true,
	                    headerTooltip: true,
	                    cellClass: 'txt-c',
	                    headerCellClass: 'txt-c',
	                    width: 70
	                }, {
	                    name: 'agreement_name',
	                    field: 'agreementName',
	                    displayName: "Group",
	                    enableColumnMenu: false,
	                    cellTooltip: true,
	                    headerTooltip: true,
	                    cellClass: 'txt-c',
	                    headerCellClass: 'txt-c',
	                    width: 110
	                },
	                {
	                    name: 'host_name',
	                    field: 'hostName',
	                    displayName: "Host Name",
	                    enableColumnMenu: false,
	                    cellTooltip: true,
	                    headerTooltip: true,
	                    cellClass: 'txt-c',
	                    headerCellClass: 'txt-c',
	                    width: 220
	                },
	                {
	                    name: 'ip',
	                    field: 'ip',
	                    displayName: "IP",
	                    enableColumnMenu: false,
	                    cellTooltip: true,
	                    headerTooltip: true,
	                    cellClass: 'txt-c',
	                    headerCellClass: 'txt-c',
	                    width: 130
	                },
	                {
	                    name: 'task_id',
	                    field: 'taskId',
	                    displayName: "Task ID",
	                    enableColumnMenu: false,
	                    cellTooltip: true,
	                    headerTooltip: true,
	                    cellClass: 'txt-c',
	                    headerCellClass: 'txt-c',
	                    width: 300
	                },
	                {
	                    name: 'task_name',
	                    field: 'taskName',
	                    displayName: "Task Name",
	                    enableColumnMenu: false,
	                    cellTooltip: true,
	                    headerTooltip: true,
	                    cellClass: 'txt-c',
	                    headerCellClass: 'txt-c',
	                    width: 300
	                },
	                {
	                    name: 'task_state',
	                    field: 'taskState',
	                    displayName: "Task State",
	                    enableColumnMenu: false,
	                    cellTooltip: true,
	                    headerTooltip: true,
	                    //cellFilter: 'number: 0',
	                    cellClass: 'txt-c',
	                    headerCellClass: 'txt-c',
	                    width: 100
	                },
	                {
	                    name: 'task_last_failure_message',
	                    field: 'taskLastFailureMessage',
	                    displayName: "Task Failure Message",
	                    enableColumnMenu: false,
	                    cellTooltip: true,
	                    headerTooltip: true,
	                    cellClass: 'txt-l',
	                    headerCellClass: 'txt-c',
	                    width: 300
	                },
	                {
	                    name: 'collect_time',
	                    field: 'collectTime',
	                    displayName: "Collect Time",
	                    enableColumnMenu: false,
	                    cellTooltip: true,
	                    headerTooltip: true,
	                    cellClass: 'txt-c',
	                    headerCellClass: 'txt-c',
	                    width: 150
	                }
                ],
                appScopeProvider: {
                	onStartClick : function(row){
						var taskId = row.entity.taskId;
						
						taskStatusDetailCtrl.startTaskInfo = {
								"ip" : row.entity.ip
								,"node_name" : row.entity.hostName
			    				,"apiType" : "/v1/tasks/" + taskId + "/start"
			    		}
						
						excuteTask();
			            
					},
					onStopClick : function(row){
						var taskId = row.entity.taskId;
						
						taskStatusDetailCtrl.startTaskInfo = {
								"ip" : row.entity.ip
								,"node_name" : row.entity.hostName
			    				,"apiType" : "/v1/tasks/" + taskId + "/stop"
			    		}
						
						excuteTask();
						
					},
					onEnableClick : function(row){
						var taskId = row.entity.taskId;
						
						taskStatusDetailCtrl.startTaskInfo = {
								"ip" : row.entity.ip
								,"node_name" : row.entity.hostName
			    				,"apiType" : "/v1/tasks/" + taskId + "/enable"
			    		}
						
						excuteTask();
						
					}
                    
                },
                onRegisterApi: function(gridApi){
                	taskStatusDetailCtrl.gridApi = gridApi;
                }
            };
        };
        
        //Task list (필터기능)
  		function getTaskList() {
  		    DataService.httpPost("/popup/getTaskStatusNodeInfo.json", taskStatusDetailCtrl.filter, function(result) {
  		      if (result.result == 1) {
  		    	taskStatusDetailCtrl.gridOptions.data = result.data;
  	          }
  	      });
  	      ap($scope);
  		};
  		
  		//group list 검색 
		function searchGroupList() {
    		// group 코드 리스트 조회
            DataService.httpPost('/agent/getCommonGroupList.json', {}, function(result) {
                if (result.result == 1) {
                	taskStatusDetailCtrl.searchAgentGroupModel = result.data;
                	taskStatusDetailCtrl.filter.agreementSeq = '0';
                	initializeTypeList();
                }
            });
    	};
    	
    	
    	function excuteTask(){
    		DataService.httpPost('/task/excuteTask.json', taskStatusDetailCtrl.startTaskInfo, function(result) {
                if (result.result == 1) {
                	var result = JSON.parse(result.data);
                	
                	if (result.meta.code == 200) {
                		//sync api 호출 후 화면 리로드 작업
                		getTaskList(taskStatusDetailCtrl.filter);
					}else {
						alert("Failed : HTTP error code : "+ result.meta.code + " : " + result.meta.message);
					}
                }else{
                	alert(result.errorMessage);
                }
            });
            ap($scope);
    		
    	};
	
		
		function initialize() {
			searchGroupList();
			setGridOption();
			searchDetail();
		};
		
		initialize();
	}]);
});