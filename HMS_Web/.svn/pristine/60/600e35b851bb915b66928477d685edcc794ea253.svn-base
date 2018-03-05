define(["app","apps/common/rackdiagram/rack-model"], function(app, Rack) {
    app.directive("rackInfoDirective", function() {
        'use strict';


        return {
            restrict: "E",
            transclude: true,
            templateUrl : '/rack-info',

            scope: {
                treeNode : "="

            },
            link: function postLink($scope, element, attrs, controller) {
                $scope.$watch('treeNode', function(value){
                    if (!value) return;
                    if (value.selectedType.toString().toLowerCase() == 'rack') {
                        console.log('treeNode watch ',value);
                        $scope.selectedRackId = value.selectedId;
                        $scope.selectedType = value.selectedType.toString().toUpperCase();

                        $scope.getRackDrawModelList();      // rack 정보 , rack 구성 모델 리스트
						$scope.getHardwareList();

                    }
                });

            },
            controller: ["$rootScope", "$scope", "$timeout", "DataService", "ConfigManager", function($rootScope, $scope, $timeout, DataService, ConfigManager) {
                $scope.showConfigBtn = $scope.useConfigBtn == null ? true : $scope.useConfigBtn;
                $scope.showConfigManagementFlag = false;
                $scope.rackDiagramControl = {};

                $scope.selectedRackId = '';
                $scope.selectedNodeId = '';
                $scope.selectedType = '';       // RACK / HW

				$scope.viewMode = 'status';

				var STYLE_MAP = {
                    "001": "node-bm-server",
                    "003": "node-switch",
                    "004": "node-storage",
                    "009": "rack-blade-enclosure",
                    "010": "node-blade-server",
                    "node": "rack-node",
                    "disable": "rack-disable",
                    "reserved": "rack-reserved"
                };


                // 장비 설정 제어 창 보기
                $scope.clickConfigBtn = function(event){
                    $scope.showConfigManagementFlag = true;
                };
                
                $scope.changeViewMode = function (mode) {
                  switch (mode) {
                      case 'status':
                      case 'grid':
						  $scope.viewMode = mode;
                          break;
                  }
				};

                $scope.getRackDrawModelList = getRackDrawModelList;
                function getRackDrawModelList(){
                    if ($scope.selectedRackId == null) return;
                    let param = {};
                    param.rackId = $scope.selectedRackId;

                    // RACK 모델 생성
                    DataService.httpPost('/common/getRackDrawModelList', param, function(result) {
                        console.log('Rack Draw Model Info :: ', result);
                        if (result.result == 1 && result.data) {
                            let list = result.data;
                            let arr = [];
                            for (let i = 0 ; i < list.length ; i++) {
                                let rack = new Rack();
                                rack.set(list[i]);
                                arr.push(rack);
                            }
                            $scope.rackDrawModelData = arr;
                            $.validLayout();
                        } else {

                        }
                    });


                    // RACK 정보 조회
                    DataService.httpPost('/common/getHardwareInfoByHardwareCommonId.json', {hardwareCommonId : $scope.selectedRackId}, function(result) {
                        console.log('RACK 정보 조회 :: ',result);
                        $scope.rackInfoData = {};
                        if (result.result == 1){
                            if(result.data) {
                                let info = result.data;
                                for ( let key in info) {
                                    $scope.rackInfoData[key] = info[key];
                                }

                                let headGnbList = $scope.treeNode.headGnbList;

                                for (let i = 0 ; i < headGnbList.length ; i++){
                                    if (i == 0)
                                        $scope.rackInfoData.datacenterName = headGnbList[i].nodeName;
                                    else if (i == 1)
                                        $scope.rackInfoData.floorName = headGnbList[i].nodeName;
                                    else if (i == 2)
                                        $scope.rackInfoData.roomName = headGnbList[i].nodeName;
                                    else if (i == 3)
                                        $scope.rackInfoData.rackName = headGnbList[i].nodeName;
                                }
                            }
                        }
                    });

                    $scope.addRackComplete = function(value) {
                        $scope.addedHW = value[0].hardwareCommonId;
                        console.log("ADD-RACK-COMPLETE", JSON.stringify(value));
                        ap($scope);
                    }
                    $scope.addNodeComplete = function(value) {
                        $scope.addedHW = value[0].hardwareCommonId;
                        console.log("ADD-NODE-COMPLETE", JSON.stringify(value));
                        ap($scope);
                    }
                    $scope.updateRackComplete = function(value) {
                        console.log("UPDATE-RACK-COMPLETE", JSON.stringify(value));
                        ap($scope);
                    }
                    $scope.updateNodeComplete = function(value) {
                        console.log("UPDATE-RACK-COMPLETE", JSON.stringify(value));
                        ap($scope);
                    }
                    $scope.selectRack = function(value) {
                        console.log("SELECT-RACK", JSON.stringify(value));
                        $scope.selectedType = 'RACK';
                        ap($scope);
                    }
                    $scope.selectNode = function(value) {
                        console.log("SELECT-NODE", JSON.stringify(value));
                        $scope.selectedNodeId = value.hardwareCommonId;
                        $scope.selectedType = 'HW';
                        $scope.selectedHwType = STYLE_MAP[value.hwType];
                        getHWInfo($scope.selectedNodeId);
                        ap($scope);
                    }
                    $scope.getData = function() {
                        console.log($scope.rackDiagramControl.getData());
                    }
                }

				$scope.getHardwareList = getHardwareList;
				function getHardwareList() {
					if ($scope.selectedRackId == null) return;

					DataService.httpPost('/common/getHardwareList', {rackId : $scope.selectedRackId}, function(result) {
						$scope.gridOptions_hardware.data = result.data;
					});
				}

                function getHWInfo(hwId){
                    $scope.hwInfoData = {};

                    if ($scope.rackDrawModelData) {
                        let selectedHw = null;
                        for (let i = 0 ; i < $scope.rackDrawModelData.length ; i++) {
                            if (hwId == $scope.rackDrawModelData[i].hardwareCommonId) {
                                selectedHw = $scope.rackDrawModelData[i];
                                break;
                            }
                        }
                        if (selectedHw) {
                            $scope.hwInfoData =selectedHw;

                            DataService.httpPost('/common/getHardwareInfoByHardwareCommonId.json', {hardwareCommonId : $scope.hwInfoData.hardwareCommonId}, function(result) {
                                if (result.result == 1){
                                    let info = result.data;
                                    for ( let key in info) {
                                        if ($scope.hwInfoData[key] == null || $.trim($scope.hwInfoData[key]) == '') {
                                            $scope.hwInfoData[key] = info[key];
                                        }
                                    }
                                    console.log('선택한 하드웨어 장비 :: ',$scope.hwInfoData);
                                }

                            });
                        }
                    }

                }

				// 그리드 옵션 설정
				function setGridOption(){
					$scope.gridOptions_hardware = {
						showTreeExpandNoChildren: true,
						enableSorting:false,
						enableColumnMenus:false,
						columnDefs: [
							{ name: 'H/W Name',field:'hwName', width:150},
							{ name: 'UUID',field:'assetNumber', width:200},
							{ name: 'H/W Type',field:'hwType', width : 80},
							{ name: 'Vendor', field:'vendor', width : 100},
							{ name: 'Model No.', field:'modelNo', width : 200},
							{ name: 'Serial No.', field:'serialNo', width : 200},
							{ name: 'Owner.', field:'owner', width:100},
							{ name: 'Remark', field:'remark', width:150}
						],
						appScopeProvider: {
							selectedData: function(row) {
								$scope.selectedData = row.data;
								$scope.showDataPop = true;
							}
						}
					};
				}

                function initialize(){
					setGridOption();
                }
                
                // entry-point
                initialize();

            }]
        };

    });








});