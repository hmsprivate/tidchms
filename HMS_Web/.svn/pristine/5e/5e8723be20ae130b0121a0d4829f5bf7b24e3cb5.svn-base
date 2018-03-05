define(["app"], function(app) {
    app.directive("floorDiagramDirective", function() {
        'use strict';

        /*
        트리에서 선택한 데이터 모델 : selectedTreeModelData
        상면도 다이어그램 그리기 위한 모델 : $scope.raisedFloorModel
         */

        return {
            restrict: "E",
            transclude: true,
            templateUrl : '/floor-diagram',

            scope: {
                useChangeModeBtn : '=',     // 뷰 / 그리드 변환 버튼 사용 유무
                editableDiagram : '=',      // 상면도 편집 가능 유무
                useConfigBtn : '=',
                useAddOnBtn : '=',
                versionType : '=',           // release / review
                injection : '=',
                injectionDcId : '=',        // 데이터센터 아이디
                injectionType : '=',        // 처리 타입
                injectionId : '='
            },
            link: function postLink($scope, element, attrs, controller) {
                $scope.versionType = $scope.versionType == null ? attrs.versionType : $scope.versionType;

            },
            controller: ["$rootScope", "$scope", "$timeout", "DataService", "ConfigManager", "ngDialog", function($rootScope, $scope, $timeout, DataService, ConfigManager, ngDialog) {
                // const TYPE_TILE = 'TILE';
                // const TYPE_RACK = 'RACK';
                // const TYPE_FACILITY = 'FACILITY';
                //
                // const SUBTYPE_RACK_11 = '11';
                // const SUBTYPE_RACK_12 = '12';
                // const SUBTYPE_RACK_21 = '21';
                //
                //
                // const SUBTYPE_FACILITY_CE = 'CONDITIONING_EQUIPMENT';      // 공조기
                // const SUBTYPE_FACILITY_TH = 'THERMO_HYGROSTAT';           //
                // const SUBTYPE_FACILITY_UP = 'UPS';           //
                //
                // const SUBTYPE_TILE_A = 'ABLE';      // 가용
                // const SUBTYPE_TILE_D = 'DISABLE';   // 사용불가
                // const SUBTYPE_TILE_R = 'RACK';      // 사용중중 랙
                // const SUBTYPE_TILE_C = 'AIR';        // 공조기
                // const SUBTYPE_TILE_G = 'DOOR';      // 출입구

                $scope.editableDiagramArea = $scope.editableDiagram == null ? true : $scope.editableDiagram;
                $scope.showChangeModeBtn = $scope.useChangeModeBtn == null ? true : $scope.useChangeModeBtn;
                $scope.showConfigBtn = $scope.useConfigBtn == null ? true : $scope.useConfigBtn;
                $scope.showAddOnBtn = $scope.useAddOnBtn == null ? true : $scope.useAddOnBtn;

                $scope.viewMode = 'status';         // 상면도 보기
                $scope.gridViewType = 'FLOOR';
                $scope.gridTabList = [];            // 그리드 탭
                $scope.showRackTooltip = false;     // 랙 툴팁
                $scope.showConfigManagementFlag = false;
                $scope.selectedRoomId = null;

                $scope.unspecifiedListArea = '';

                let selectedTreeModelData = null;

                let resourceTypeList = ['DATACENTER','FLOOR','ROOM','RACK','HARDWARE'];


                // 상면도 / 그리드 화면 전환
                $scope.changeViewMode = function(code){
                    $scope.viewMode = code;

                    if (code == 'status') {

                        $scope.refreshFn();

                    } else if (code == 'grid') {

                    }
                };


				// 현재 상면도 다이어그램 refresh
				$scope.setRefreshFn = function(refreshFn) {
					$scope.refreshFn = refreshFn;
				};

                // 현재 상면도 다이어그램 상태를 JSON으로 저장 요청
                $scope.setSaveDataFn = function(saveDataFn) {
                    $scope.saveDataFn = saveDataFn;
                };

                // 상면도 다이어그램 저장 처리 완료 JSON
                $scope.getSaveData = function (data) {
                    console.log("getSaveData :", data);
                    $scope.jsonDiagramData = data;
                };


                // 상면도 위 장비 선택 - 툴팁 보여준다
                $scope.selectEquipEventHandler = function(data){
                    console.log('CLICK COMPLETE :: ',data);

                    let param = {};
                    param.rackId = data.id;
                    $scope.rackTooltip = {};
                    DataService.httpPost('/common/getRackInfoById', param, function(result) {
                        console.log('Rack Info :: ', result);
                        if (result.result == 1 && result.data) {
                            console.log(result.data);
                            $scope.rackTooltip.rackId = result.data.rackId;
                            $scope.rackTooltip.totalUnitCnt = result.data.children ? result.data.children.length : 0;

                            $scope.showRackTooltip = true;
                            let posX = data.event.pageX - $(data.event.target).offset().left - ($('#rackTooltip').width()/2) + 8;
                            let posY = data.event.pageY - $(data.event.target).offset().top-13;

                            $scope.positionRackTooltip = {top:posY+'px', left:posX+'px'};
                            ap($scope);
                        } else {

                        }
                    });
                };

                // 그리드 탭 변경
                $scope.changeGridView = function(tab){
                    $scope.gridViewType = tab;
                };


                // 장비 설정 제어 창 보기
                $scope.clickConfigBtn = function(event){
                    $scope.showConfigManagementFlag = true;
                };


                $scope.addCompleteEventHandler = function(data){
                    $scope.addedEquip = data;
                    ap($scope);
                };

                $scope.removeEquipEventHandler = function(id){
                    $scope.removedEquip = id;
                    ap($scope);
                };

                // 상면도 위 렉 더블클릭 - 랙 설정 팝업
                $scope.passToRackEventHandler = function (data) {
                    console.log('RACK 더블 클릭 :: ', data);
                    $scope.selectedTreeNode = ConfigManager.getSelectedTreeData();


                    // ngDialog.open({
                    //     template : ''+
                    //
                    //     '<div class="pop-wrap w850" style="top:100px;left:50%;margin-left:-300px">'+
                    //     '<div class="pop-header"><h3 class="title">{{ "MANAGEMENT.DIALOG_TITLE_RACK" | translate }}</h3></div>'+
                    //     '<div class="pop-content">'+
                    //         '<rack-info-directive tree-node="selectedTreeNode" id="rackDiagramArea"></rack-info-directive>'+
                    //     '</div>'+
                    //     '</div>'+
                    //     '</div>'+
                    //         '',
                    //     plain: true,
                    //     showClose: true,
                    //     scope : $scope,
                    //     disableAnimation: true
                    // });
                    // $.validLayout();
                    ap($scope);
                }



                function initData(modelData){

                    if (modelData!= null && modelData.selectedType.toLowerCase() == 'rack') return;

                    console.log('트리 선택 모델 데이터 :: ', modelData);
                    $scope.raisedFloorModel = {};

                    let selectedType = modelData.selectedType;          // 선택된 트리노드의 타입 : FLOOR, ROOM, RACK ...
                    let selectedData = modelData.selectedData;          // 모델 데이터

                    let param = {};
                    let roomId = null;

                    if (selectedType.toLowerCase() == 'floor') {
                        $scope.showRoomList = true;
                        $scope.roomList = [];

                        if (selectedData.selectedChildren && selectedData.selectedChildren.length > 0) {
                            let children = selectedData.selectedChildren[0];
                            if (children.type.toLowerCase() == 'floor') {
                                if (children.selectedChildren && children.selectedChildren.length > 0) {
                                    $scope.roomList = children.selectedChildren;        // room List

                                    children = children.selectedChildren[0];
                                    if (children.type.toLowerCase() == 'room') {
                                        roomId = children.resourceSeq;
                                    }
                                }
                            }
                        }

                    } else if (selectedType.toLowerCase() == 'room') {
                        $scope.showRoomList = false;
                        roomId = modelData.selectedId;
                    } else return;

                    if (roomId == null) return;

                    drawDiagramByRoomId(roomId, modelData);


                    /*
                    let param = {};
                    if (selectedType.toString().toUpperCase() == 'ROOM') param.type = 'room';
                    else if (selectedType.toString().toUpperCase() == 'RACK') return;
                    param.locationId = modelData.selectedId;


                    // 선택한 ROOM / RACK 에 해당되는 상면도 정보를 가져온다
                    // tb_save_info + tb_diagram_info

                    DataService.httpPost('/common/getSaveDiagramInfoList', param, function(result) {
                        console.log('getSaveDiagramInfoList :: ', result);

                        let saveDiagramInfo = {};       // equip-management 로 전달됨
                        saveDiagramInfo.type = selectedType.toString().toLowerCase();
                        saveDiagramInfo.locationId = modelData.selectedId;

                        if (result.result == 1){
                            let diagramPassData = {};
                            diagramPassData.selectedModel = selectedData;
                            diagramPassData.diagramData = [];
                            diagramPassData.selectedType = modelData.selectedType;
                            diagramPassData.selectedId = modelData.selectedId;

                            if (result.data) {
                                let modelList = result.data;
                                for (let i = 0 ; i < modelList.length ; i++) {  // 완전저장상면도가 있는 경우 기본으로 보여준다
                                    if (modelList[i].version == $scope.versionType) {
                                        saveDiagramInfo = modelList[i];
                                    }
                                }
                            }

                            if (saveDiagramInfo && saveDiagramInfo.diagramList && saveDiagramInfo.diagramList.length > 0) {     // 현재 room 에 대한 상면도 정보가 있는 경우
                                diagramPassData.title = saveDiagramInfo.diagramList[0].title;
                                if (saveDiagramInfo.diagramList[0] && saveDiagramInfo.diagramList[0].data && saveDiagramInfo.diagramList[0].data.diagramData)
                                    diagramPassData.diagramData = saveDiagramInfo.diagramList[0].data.diagramData;      // 첫번째 상면도를 보여준다
                            }

                            // 상면도 raised diagram 에 데이터 전달 > 다이어그램 그리기 위한
                            // selectedModel : 트리에서 선택한 모델 데이터
                            // diagramData : 상면도 다이어그램 json 데이터
                            diagramPassData.diagramData = [{"type":"RACK","subtype":"11","id":"2186","x":6,"y":1,"info":"11"},{"type":"RACK","subtype":"11","id":"2187","x":7,"y":1,"info":"11"},{"type":"TILE","subtype":"DOOR","id":"5802","x":8,"y":3,"info":"11"},{"type":"RACK","subtype":"11","id":"8039","x":2,"y":8,"info":"11"},{"type":"FACILITY","subtype":"CONDITIONING_EQUIPMENT","id":"8048","x":5,"y":4,"info":"11"},{"type":"RACK","subtype":"11","id":"8327","x":3,"y":5,"info":"11"},{"type":"RACK","subtype":"11","id":"8328","x":1,"y":9,"info":"11"},{"type":"RACK","subtype":"11","id":"8361","x":23,"y":11,"info":"11"},{"type":"TILE","subtype":"DISABLE","id":"2916","x":22,"y":22,"info":"11"},{"type":"RACK","subtype":"11","id":"5329","x":8,"y":11,"info":"11"},{"type":"RACK","subtype":"11","id":"3146","x":16,"y":5,"info":"11"}];
                            $scope.raisedFloorModel = diagramPassData;

                            console.log('상면도 다이어그램에 전달하는 모델 :: ',$scope.raisedFloorModel);
                        }

                        // $scope.saveDiagramInfo = saveDiagramInfo;              // equip-management 로 전달됨
                    });
                    */


                    // $scope.headerData = setHeaderLocation(selectedData);		// 헤더 설정

                    // setGridData(selectedData.selectedChildren, selectedType);      // 그리드 설정


                    // drag and drop 영역 - raised-floor-diagram에 넘겨주는 값
					$scope.unspecifiedListArea = 'unspecifiedListArea';
                }
                
                $scope.drawDiagramByRoomId = function(roomId){

                    drawDiagramByRoomId(roomId, selectedTreeModelData);

                };
                function drawDiagramByRoomId(roomId, modelData){
                    $scope.selectedRoomId = roomId;

                    let selectedData = modelData.selectedData;
                    let param = {};
                    param.roomInfoId = roomId;
                    DataService.httpPost('/common/getRoomSectionList', param, function(result) {
                        console.log('getRoomSectionList :: ', result);
                        if (result.result == 1){
                            let diagramData = [];
                            let sectionList = result.data;
                            for (let i = 0 ; i < sectionList.length ; i++) {
                                let _data = ConfigManager.getRackBDType(sectionList[i].type);
                                _data.id = sectionList[i].rackId ? sectionList[i].rackId : '0';
                                _data.x = sectionList[i].positionX;
                                _data.y = sectionList[i].positionY;
                                _data.info = '11';
                                diagramData.push(_data);
                            }
                            let diagramPassData = {};
                            diagramPassData.selectedModel = selectedData;
                            diagramPassData.diagramData = diagramData;
                            diagramPassData.selectedId = modelData.selectedId;
                            diagramPassData.selectedType = modelData.selectedType;

                            $scope.raisedFloorModel = diagramPassData;

                            console.log('상면도 다이어그램에 전달하는 모델 :: ',$scope.raisedFloorModel);
                        }
                    });

                    setGridData(modelData.selectedData.selectedChildren, modelData.selectedType);      // 그리드 설정
                }

                $scope.datacenterModelByRoomId = datacenterModelByRoomId;
                function datacenterModelByRoomId(datacenterId, roomId){
                    let param = {};
                    param.datacenterId = datacenterId;
                    param.param_roomInfoId = roomId;
                    DataService.httpPost('/common/getResourceTree', param, function(result) {
                        console.log('Get Resource Tree Data @ floor-diagram-directive :: ', result);
                        if (result.result == 1 && result.data && result.data.children) {

                            changeChildren(result.data);

                            let paramModelData = {};
                            paramModelData.selectedData = result.data;
                            paramModelData.selectedType = 'room';
                            paramModelData.selectedId = roomId;

                            selectedTreeModelData = paramModelData;

                            initData(paramModelData);

                        } else {
                        }
                    });
                }

                // children -> selectedChildren
                function changeChildren(obj){
                    if (obj.children){
                        obj['selectedChildren'] = obj.children;
                        delete obj.children;
                        for (let i = 0 ; i < obj.selectedChildren.length ; i++) {
                            changeChildren(obj.selectedChildren[i]);
                        }
                    }
                }

                function setHeaderLocation(selectedData){
                    let headerArr = [];
                    headerArr.push(selectedData.resourceName);
                    if (selectedData.selectedChildren && selectedData.selectedChildren.length > 0) {
                        let children_floor = selectedData.selectedChildren[0];
                        if(children_floor.type.toString().toUpperCase() == 'FLOOR') {
                            headerArr.push(children_floor.resourceName);
                            if (children_floor.selectedChildren && children_floor.selectedChildren.length > 0) {
                                let children_room = children_floor.selectedChildren[0];
                                if (children_room.type.toString().toUpperCase() == 'ROOM') {
                                    headerArr.push(children_room.resourceName);
                                }
                            }
                        }
                    }
                    return headerArr;
                }


                // 그리드 데이터 설정
                function setGridData(children, selectedType){

                    // 보여줄 탭 리스트 설정
                    $scope.gridTabList = [];
                    let selectedTypeIdx = $.inArray(selectedType, resourceTypeList);
                    for (let i = selectedTypeIdx ; i < resourceTypeList.length ; i++) {
                        // managementCtrl.gridTabList.push(resourceTypeList[i+1]);
                        if (resourceTypeList[i+1])
                            $scope.gridTabList.push(resourceTypeList[i+1]);
                    }
                    if (selectedTypeIdx+1 == resourceTypeList.length) $scope.gridTabList.push(resourceTypeList[selectedTypeIdx]);

                    $scope.gridViewType = $scope.gridTabList[0];	// 기본으로 첫번째 탭 선택

                    let floorDataList = angular.copy(children);
                    let roomDataList = getChildList(floorDataList);
                    let rackDataList = getChildList(roomDataList);
                    let hwDataList = getChildList(rackDataList);

                    $scope.gridOptions_floor.data = floorDataList;
                    $scope.gridOptions_room.data = roomDataList;
                    $scope.gridOptions_rack.data = rackDataList;
                    $scope.gridOptions_hardware.data = hwDataList;
                }


                function getChildList(roopDataList){
                    let returnList = [];
                    for (let i = 0 ; i < roopDataList.length ; i++){
                        if (roopDataList[i] && roopDataList[i].selectedChildren && roopDataList[i].selectedChildren.length > 0) {
                            returnList = returnList.concat(roopDataList[i].selectedChildren);
                        }
                    }
                    return returnList;
                }


                // 그리드 옵션 설정
                function setGridOption(){
                    $scope.gridOptions_floor = {
                        showTreeExpandNoChildren: true,
                        enableSorting:false,
                        enableColumnMenus:false,
                        columnDefs: [
                            { name: 'Floor ID',field:'floorPlanId', width:200},
                            { name: 'Name', field:'name', width:200},
                            { name: 'Floor No', field:'floorNo', width:150}

                        ],
                        appScopeProvider: {
                            selectedData: function(row) {
                                $scope.selectedData = row.data;
                                $scope.showDataPop = true;
                            }
                        }
                    };


                    $scope.gridOptions_room = {
                        showTreeExpandNoChildren: true,
                        enableSorting:false,
                        enableColumnMenus:false,
                        columnDefs: [
                            { name: 'Floor ID',field:'floorPlanId', width:200},
                            { name: 'Room ID',field:'roomInfoId', width:200},
                            { name: 'Ord', field:'ord', width:200}

                        ],
                        appScopeProvider: {
                            selectedData: function(row) {
                                $scope.selectedData = row.data;
                                $scope.showDataPop = true;
                            }
                        }
                    };


                    $scope.gridOptions_rack = {
                        showTreeExpandNoChildren: true,
                        enableSorting:false,
                        enableColumnMenus:false,
                        columnDefs: [
                            { name: 'Room ID',field:'roomInfoId', width:200},
                            { name: 'Rack ID',field:'rackId', width:200},
                            { name: 'Unit Cnt', field:'unitCnt', width:200},
                            { name: 'Max Server Cnt', field:'maxServerCount', width:200}

                        ],
                        appScopeProvider: {
                            selectedData: function(row) {
                                $scope.selectedData = row.data;
                                $scope.showDataPop = true;
                            }
                        }
                    };


                    $scope.gridOptions_hardware = {
                        showTreeExpandNoChildren: true,
                        enableSorting:false,
                        enableColumnMenus:false,
                        columnDefs: [
                            { name: 'Rack ID',field:'rackId', width:200},
                            { name: 'H/W Type',field:'hwType', width:200},
                            { name: 'H/W Name', field:'hwName', width:200},
                            { name: 'Vendor', field:'vendor', width:200}

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

                    if ($scope.injection && $scope.injectionDcId && $scope.injectionId) {
                        datacenterModelByRoomId($scope.injectionDcId, $scope.injectionId);
                    } else {
                        selectedTreeModelData = ConfigManager.getSelectedTreeData();
                        if (selectedTreeModelData) {
                            initData(selectedTreeModelData);
                        } else {
                            $rootScope.$on('SELECTED_RESOURCE', function(event, data){
                                selectedTreeModelData = data;
                                initData(selectedTreeModelData);
                            });

                        }
                    }



                }


                // entry-point
                initialize();

            }]
        };

    });








});