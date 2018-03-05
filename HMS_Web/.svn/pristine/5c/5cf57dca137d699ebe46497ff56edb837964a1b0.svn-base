define(["app", "angular-bind-html-compile", "apps/common/rackdiagram/rack-model"], function(app, bindHtml, Rack) {

    /**
     * 일반 패널
     */
    app.directive("panelDirective", ["$rootScope", "$compile", function($rootScope, $compile) {
        return {
            restrict: "E",
            transclude: true,
            template:'' +
            // '<div width="100%" height="100%" class="{{panelClass && panelClass != \'\' ? panelClass : \'panel-wrap\'}}">' +
            '<div class="panel-wrap w400">' +
            '    <div class="panel-header">' +
            '        <h3 ng-class="getClass()">{{title}}</h3>' +
            '        <button type="button" class="btn-close" title="close" ng-click="clickHideListener()"></button>' +
            '    </div>' +
            '    <ng-transclude class="panel-content"></ng-transclude>' +
            '</div>',

            scope: {
                visible: "@", // 버튼과 같이 연동해서 처리하는 옵션
                panelShow: "@", // panel switch 시킬 때 쓰는 옵션(hide가 true일 때 버튼도 같이 안보임)
                onClose: "&",
                onShow: "&",
                showHeader: "@",
                showCloseBtn: "@",
                panelLocate: "@",
                showTitleline: "@",
                titleClass: "@",
                panelClass: "@"
            },
            link: function postLink($scope, element, attrs) {
                var target = $(element);
                var panelLocate = "left";
                var showTitleline = "false";

                $scope.panelShow = (attrs.panelShow == null || attrs.panelShow == "true") ? true : false;

                var btnGroupElement = $("<button class=" + attrs.buttonClass +
                    " ng-click=\"visible=!visible\" ng-show=\"panelShow\">" + attrs.buttonText + "</button>");
                $scope.buttonElement = btnGroupElement;
                $compile(btnGroupElement)($scope);

                $scope.title = attrs.panelTitle;

                var e = $("#" + attrs.groupId);
                e.append(btnGroupElement);
                btnGroupElement.hide();

                $scope.visible = (attrs.visible != null && attrs.visible == "false") ? false : true;

                function panelShowChange(value) {
                    if (value) {
                        target.show();
                        btnGroupElement.show();
                    } else {
                        target.hide();
                        btnGroupElement.hide();
                    }
                    panelShowHandler(value, element);
                }

                function visibleChange(value) {
                    panelShowHandler(value, element);
                    setButtonGroupVisible(value);
                    buttonGroupWidthHandler();

                    if ($scope.visible && $scope.onShow) {
                        $scope.onShow();
                    }

                    if (panelLocate == "right") {
                        $rootScope.$broadcast("changePanalStatus", value);
                    }
                }

                function panelShowHandler(value, element) {
                    if (value) {
                        target.css("display", "");
                    } else {
                        target.css("display", "none");
                    }
                }

                function buttonGroupWidthHandler(value) {
                    setTimeout(function() {
                        if (e.children("button:visible").length == 0 || !$scope.panelShow) {
                            e.attr("width", "5px");
                        } else {
                            e.attr("width", "30px");
                        }
                        $.validLayout();
                    }, 100)
                }

                function setButtonGroupVisible(value) {
                    var panelCnt = 1; // target까지 포함해야되므로 기본값 1
                    var panelOpendCnt = 0;
                    if (value) {
                        panelOpendCnt++;

                    } else {
                        var panels = target.siblings("panel-control");
                        var targetLocate = target.attr("panel-locate");
                        for (var i = 0; i < panels.length; i++) {
                            var panel = $(panels[i]);
                            var locate = panel.attr("panel-locate");

                            if (locate == targetLocate) {
                                panelCnt++;
                                if (panel.width() != 0) {
                                    panelOpendCnt++;
                                    break;
                                }
                            }
                        }
                    }

                    if (panelOpendCnt < panelCnt) {
                        btnGroupElement.show();
                        btnGroupElement.addClass("off");
                        btnGroupElement.removeClass("on");
                        //btnGroupElement.css("opacity", "0.5");
                    } else {
                        btnGroupElement.hide();
                    }
                }

                attrs.$observe("showHeader", function(value) {
                    var t = target.find("h3");
                    var tran = target.find("ng-transclude");
                    if (value == "false") {
                        t.css("display", "none");
                        tran.css("height", "100%");
                    } else {
                        t.css("display", "block");
                        tran.css("height", "calc(100% - 27px)");
                    }
                });

                attrs.$observe("showCloseBtn", function(value) {
                    var t = target.find(".btn-close");
                    if (value == "false") {
                        t.css("display", "none");
                    } else {
                        t.css("display", "block");
                    }
                });

                attrs.$observe('panelShow', function(val) {
                    $scope.panelShow = (val != "false");
                });

                attrs.$observe('visible', function(val) {
                    $scope.visible = (val != "false");
                });

                attrs.$observe('panelLocate', function(val) {
                    panelLocate = val;
                });

                $scope.clickHideListener = function() {
                    $scope.visible = false;
                    $scope.onClose();
                };

                attrs.$observe('showTitleline', function(val) {
                    showTitleline = val;
                });

                $scope.getClass = function() {
                    var className = $scope.titleClass;
                    if (!$scope.titleClass || $scope.titleClass == "") {
                        className = "title";
                    }

                    if (showTitleline == "true" || showTitleline == true) {
                        className += " line";
                    }

                    return className;
                };

                $scope.$watch("panelShow", panelShowChange);
                $scope.$watch('visible', visibleChange);

                // clear-memory
                function clear() {
                    target.off("remove", clear);
                }
                target.on("remove", clear);
                $.validLayout();
            }
        }
    }]);

    /**
     * 자원 Tree
     * 검색 기능 포함
     */
    app.directive("resourceTreeDirective",["ngDialog", function(ngDialog) {
        'use strict';

        return {
            restrict: "E",
            transclude: true,
            template: '' +
            '<div class="search-panel-area pd-none-type">'+
            '    <div class="top-box">'+
            '        <select-box-directive class="selectbox w140 fl" select-model="datacenterList" on-data-change="changeDatacenterListHandler(event)"></select-box-directive>'+
            '        <div class="search-group2 add-select-l">'+
            '           <button type="submit" class="btn-search-plus" title="More Search" ng-click="openTotalSearchPop()"></button>'+
            '           <div class="tooltip tail-top t-w180 w400" style="left:-1px;top:64px" ng-show="showTotalSearchPop">' +
            '               <div class="in-box">'+
            '                   <strong class="info-title">Search Keyword 입력</strong>'+
            '                   <ul class="basic-list3 round-border-type mt05">' +
            '                       <search-pop-directive ></search-pop-directive>'+
            '                   </ul>' +
            '                   <div class="btns-area">' +
            '                       <button type="button" class="btn-cr" ng-click="totalSearchApplyClick(\'pop\')">Apply</button>' +
            '                       <button type="button" class="btn-gy" ng-click="showTotalSearchPop=false">Cancel</button>' +
            '                   </div>'+
            '               </div>' +
            '             </div>'+
            '           <div class="input-srh-cr">'+
            '               <span class="icon-group">'+
            '                   <a ng-click="totalSearchApplyClick(\'none\')" class="ico-md i-close-sm" title="Close"></a>'+
            '               </span>'+
            '               <input type="text" placeholder="Search for..." ng-model="searchKeyword" ng-keyup="executeFilter()">'+
            '           </div>'+
            '           <button type="submit" class="btn-search" title="Search" ng-click="totalSearchApplyClick(\'input\')"></button>'+
            '       </div>'+
            '    </div>'+
            '    <div class="bottom-box" ng-show="useBottombox == \'true\' || $scope.useBottombox == true">'+
            '       <button type="button" class="btn-round i-trash" title="삭제"></button>'+
            '       <div class="fr">'+
            '            <select-box-directive type="button" type-class="btn-round-plus-arrow" size="110px" select-model="addHardwareList" on-data-change="selectAddHardwareList(event)"></select-box-directive>' +
            '       </div>'+
            '    </div>' +        // end of bottom-box
            '</div>' +
            '<div class="tree-area h-fluid1" style="height:calc(100% - 75px)">'+
            '   <div ui-grid="gridOptions" ui-grid-tree-view class="treegrid2 grid" style="width:100%; height:100%"></div>'+
            '</div>',
            scope: {
                openLevel: "@",     // 초기에 확장할 레벨 : floor, room, rack. 기본은 HW까지 다 보이도록 Rack을 확장
                selectLevel: "@",   // 초기에 선택할 레벨 : floor, room, rack. 기본은 Room을 선
                showApplyButton: "@",
                isAdmin: "@",
                expandAll: "@",
                itemClick: "&",
                resourceShow: "@",
                selectTreeFn : "&",         // 트리 노드 선택 콜백
                autoExpand:"=?",             // 자동 펼침옵션
                autoSelect:"=",             // 자동 선택 옵션
                userSelectnodeinfo : "=?",   // 사용자가 전달한 정보 - 트리 선택
                useBottombox:"@",       // bottom-box 사용 유무
                useCheckbox: "@",        // 체크박스 사용 유무. 체크박스 사용인 경우에는 멀티셀렉트 가능,
                headGnbList : "=?"        // 선택한 노드의 ID와 Name 리스트 ( 데이터센터 레벨까지 )
            },
            link: function postLink($scope, element, attrs, controller) {

                let openLevelArr = ['floor', 'room', 'rack'];

                if (attrs.hasOwnProperty("resourceShow") && attrs.resourceShow) {
                    attrs.$observe("resourceShow", function(value) {
                        if (value == "false" || value == false) {
                            $scope.gridShow = false;
                        } else
                            $scope.gridShow = true;

                    });
                } else {
                    $scope.gridShow = true;
                }

                $scope.$watch(function() {
                    return $(element).is(':visible')
                }, function() {
                    $scope.gridApi.grid.gridHeight = $(".treegrid2").outerHeight();
                    $scope.gridApi.grid.refresh();
                });


                /*
                 $scope.selectNodeInfo = {
                 selectId : 8326,
                 selectType : 'rack'
                 };
                 */
                $scope.$watch('userSelectnodeinfo', function(value){
                    if (value) {
                    }
                });

                // 데이터센터 트리 변경되면 설정된 depth의 노드를 확장,
                $scope.$watch('gridOptions.data', function() {
                    if ($scope.gridOptions.data.length > 0) {
                        setTimeout(function() {
                            if (!$scope.openLevel) $scope.openLevel = 'rack'; // 기본 확장 depth - rack
                            if (!$scope.selectLevel) $scope.selectLevel = 'room'; // 기본 선택 depth - room
                            let openDepth = $.inArray($scope.openLevel.toLowerCase(), openLevelArr);
                            let selectDepth = $.inArray($scope.selectLevel.toLowerCase(), openLevelArr);

                            if ($scope.autoExpand == null || $scope.autoExpand == true || $scope.autoExpand == 'true') {
                                if (openDepth >= 0) { // 1depth 열기 - floor
                                    let currRow = $scope.gridApi.grid.rows[0];
                                    $scope.gridApi.treeBase.expandRow(currRow);
                                    if (selectDepth == 0 && ($scope.autoSelect = null || $scope.autoSelect == true || $scope.autoSelect == 'true') ) $scope.resourceClick(currRow.entity);

                                    if (openDepth >= 1 && currRow.treeNode.children && currRow.treeNode.children.length > 0) { // 2depth 열기 - room
                                        currRow = currRow.treeNode.children[0].row;
                                        $scope.gridApi.treeBase.expandRow(currRow);
                                        if (selectDepth == 1 && ($scope.autoSelect = null || $scope.autoSelect == true || $scope.autoSelect == 'true')) $scope.resourceClick(currRow.entity);

                                        if (openDepth >= 2 && currRow.treeNode.children && currRow.treeNode.children.length > 0) { // 3 depth 열기 - rack
                                            currRow = currRow.treeNode.children[0].row;
                                            $scope.gridApi.treeBase.expandRow(currRow);
                                            if (selectDepth == 2 && ($scope.autoSelect = null || $scope.autoSelect == true || $scope.autoSelect == 'true')) $scope.resourceClick(currRow.entity);
                                        }
                                    }
                                }
                            } else {
                                if ($scope.userSelectnodeinfo) {
                                    let selectNode = null;
                                    for ( let k = 0 ; k < $scope.gridApi.grid.rows.length ; k++) {
                                        let currRow = $scope.gridApi.grid.rows[k];
                                        if (currRow.entity.type.toLowerCase() == $scope.userSelectnodeinfo.selectType && currRow.entity.resourceSeq == $scope.userSelectnodeinfo.selectId){
                                            $scope.gridApi.treeBase.expandRow(currRow);
                                            $scope.resourceClick(currRow.entity);
                                            selectNode = currRow;
                                        }
                                    }
                                    let size = selectNode.treeLevel;
                                    for (let i = 0 ; i < size ; i++){
                                        for ( let k = 0 ; k < $scope.gridApi.grid.rows.length ; k++) {
                                            let currRow = $scope.gridApi.grid.rows[k];
                                            if (currRow.entity.resourceSeq == selectNode.entity.resourceParentSeq) {
                                                $scope.gridApi.treeBase.expandRow(currRow);
                                                selectNode = currRow;
                                            }
                                        }
                                    }
                                }
                            }
                        }, 200);
                    }
                });

                // property
                var target = $(element);

                // function
                function remove() {
                    target.off("remove", remove);
                }
                target.on("remove", remove);
            },
            controller: ["$rootScope", "$scope", "$timeout", "DataService", "ConfigManager", function($rootScope, $scope, $timeout, DataService, ConfigManager) {
                var unbind = [];
                // property
                $scope.trueValue = true;
                var oldData = [];
                $scope.applyCtrl = false;
                $scope.allExpandToolTip = false;
                $scope.isOn = false;
                $scope.applyTooltip = false;
                $scope.showSelectedItemFilter = false;
                $scope.addHardwareList = [
                    {label:"하드웨어 추가", value:"1"},
                    {label:"하드웨어 일괄추가", value:"2"}
                ];


                $scope.selectedDatacenter = null;
                $scope.selectedNodeResource = null;


                // method
                $scope.getCheckColor = function(rowEntity) {
                    var returnStr = "";
                    if (rowEntity.isChildCheck) {
                        returnStr = "part";
                    }
                    return returnStr;
                };

                // 노드 클릭 이벤트
                $scope.resourceClick = function(node) {

                    $scope.selectedNodeResource = node;
                    if ($scope.useCheckbox == true || $scope.useCheckbox == 'true') { // 체크박스 사용시엔 멀티 체크 가능
                        if (node.checked == null)
                            node.checked = true;
                        else {
                            node.checked = !node.checked;
                        }

                        parentCheck(node); // 부모 노드 체크
                        if (node.hasOwnProperty("children") && node.children && node.children.length)
                            childrenChecked(node, node.checked);

                    } else {
                        node.checked = true;

                        // 현재 선택 노드 제외하고 모두 check false
                        for (let i = 0; i < $scope.gridOptions.data.length; i++) {
                            if (node.resourceSeq != $scope.gridOptions.data[i].resourceSeq)
                                $scope.gridOptions.data[i].checked = false;
                        }
                        parentCheck(node); // 부모 노드 체크

                        // 자식노드 추가
                        if (node.hasOwnProperty("children") && node.children && node.children.length)
                            childrenChecked(node, node.checked);

                    }

                    // 선택한 노드 타입
                    let selectedType = node.type;

                    // 선택한 노드 아이디
                    let selectedId = node.resourceSeq;

                    // 선택한 노드 집합
                    let selectedNodeList = getSelectedNode($scope.resourceList);
                    if ($scope.selectedDatacenter) {
                        delete $scope.selectedDatacenter.children;
                        // $scope.selectedDatacenter.children = selectedNodeList;
                        $scope.selectedDatacenter.selectedChildren = selectedNodeList;
                    }


                    let selectedObj = {selectedType:selectedType, selectedData : $scope.selectedDatacenter, selectedId : selectedId};

                    $scope.headGnbList = [];
                    $scope.headGnbList.push({'nodeId':$scope.selectedDatacenter.resourceSeq,'nodeName':$scope.selectedDatacenter.resourceName});
                    $scope.headGnbList = $scope.headGnbList.concat(setHeaderLocation(selectedObj));
                    selectedObj.headGnbList = $scope.headGnbList;

                    console.log('트리선택노드 :: ',selectedObj);
                    ConfigManager.setSelectedTreeData(selectedObj);
                    $rootScope.$broadcast("SELECTED_RESOURCE", selectedObj);

                    if ($scope.selectTreeFn) {
                        $scope.selectTreeFn({'node':selectedObj});
                    }
                };

                // 선택한 노드의 ID와 Name 리스트
                function setHeaderLocation(selectedObj){
                    let openLevelArr = ['datacenter','floor', 'room', 'rack', 'hardware'];
                    let selectDepth = $.inArray(selectedObj.selectedType.toLowerCase(), openLevelArr);
                    let selectedData = selectedObj.selectedData;
                    let selectedType = selectedObj.selectedType;
                    let headerArr = [];

                    let item = {};
                    item = angular.copy(selectedData);
                    // headerArr.push({'nodeId':item.resourceSeq,'nodeName':item.resourceName});
                    for (let i = 0 ; i < selectDepth ; i++){

                        if (item.selectedChildren && item.selectedChildren.length > 0) {
                            item = item.selectedChildren[0];
                            headerArr.push({'nodeId':item.resourceSeq,'nodeName':item.resourceName});
                        } else {
                            headerArr.push({'nodeId':item.resourceSeq,'nodeName':item.resourceName});
                        }

                    }
                    return headerArr;
                }

                // 부모 노드 체크
                function parentCheck(node) {

                    if (node.$$treeLevel == 0) return;

                    let siblings = getSiblings(node);
                    let isSiblingChecked = false;

                    // 같은 레벨에 있는 노드가 체크 되어 있는지 확인
                    for (let i = 0; i < siblings.length; i++) {
                        if (node.resourceSeq != siblings[i].resourceSeq && siblings[i].checked) {
                            isSiblingChecked = true;
                            break;
                        }
                    }

                    let parentNode = getParentNode(node);
                    if (node.checked) {
                        parentNode.checked = true;
                        parentNode.isChildCheck = true;
                    } else if (!node.checked && isSiblingChecked) {
                        parentNode.checked = true;
                        parentNode.isChildCheck = true;
                    } else {
                        parentNode.checked = false;
                        parentNode.isChildCheck = false;
                    }

                    parentCheck(parentNode); // 부모노드로 다시 돌림

                }

                // 현재 노드와 같은 레벨의 노드들 조회
                function getSiblings(node) {
                    let siblings = [];
                    let parentSeq = node.resourceParentSeq;
                    for (let i = 0; i < $scope.gridOptions.data.length; i++) {
                        if ($scope.gridOptions.data[i].resourceSeq == parentSeq) {
                            if ($scope.gridOptions.data[i].hasOwnProperty('children') && $scope.gridOptions.data[i].children && $scope.gridOptions.data[i].children.length > 0) {
                                siblings = $scope.gridOptions.data[i].children;
                                break;
                            }
                        }
                    }
                    return siblings;
                }

                // 현재 노드의 부모 노드 조회
                function getParentNode(node) {
                    let parentNode = null;
                    let parentSeq = node.resourceParentSeq;
                    for (let i = 0; i < $scope.gridOptions.data.length; i++) {
                        if ($scope.gridOptions.data[i].resourceSeq == parentSeq) {
                            parentNode = $scope.gridOptions.data[i];
                            break;
                        }
                    }
                    return parentNode;
                }

                // 선택된 노드들 반환
                function getSelectedNode(arr) {
                    let selectedArr = [];
                    for (let i = 0; i < arr.length; i++) {
                        if (arr[i].checked) {
                            let objNoChildren = angular.copy(arr[i]);
                            delete objNoChildren.children;
                            selectedArr.push(objNoChildren);

                            if (arr[i].hasOwnProperty('children') && arr[i].children && arr[i].children.length > 0) {
                                let selectedChildren = getSelectedNode(arr[i].children);
                                objNoChildren.selectedChildren = selectedChildren;
                            }
                        }
                    }
                    return selectedArr;
                }


                // 부모 체크가 변경되면 하위까지 모두 변경
                function childrenChecked(data, value) {
                    data.checked = value;
                    data.isChildCheck = false;
                    if (!data.hasOwnProperty("children") || data.children == null || data.children.length < 1) return;

                    var arr = data.children;
                    for (var i = 0; i < arr.length; i++) {
                        var obj = arr[i];
                        if (obj.hasOwnProperty("children") && obj.children != null) {
                            childrenChecked(obj, value);
                        } else {
                            if (obj.visible)
                                obj.checked = value;
                        }
                    }
                }




                // 통합검색 버튼 클릭한 경우 검색 키워드 입력 팝업 보여주기
                $scope.openTotalSearchPop = function(){
                    $scope.showTotalSearchPop = true;
                };

                // 검색 처리
                $scope.totalSearchApplyClick = function(type){

                    let param = {};
                    param.datacenterId = $scope.selectedDatacenter.value;
                    if (type == 'pop') {
                        for (let i = 0; i < $scope.searchConditions.length; i++) {
                            if ($scope.searchConditions[i].keyword != '') {
                                let type = 'param_' + $scope.searchConditions[i].type;
                                let keyword = $scope.searchConditions[i].keyword;
                                param[type] = keyword;
                            }
                        }
                    } else if (type == 'input'){
                        if ($scope.searchKeyword && $.trim($scope.searchKeyword) != '')
                            param['param_hwName'] = $scope.searchKeyword;
                    } else {
                        $scope.searchKeyword = '';
                        ap($scope);
                    }
                    console.log('검색조건 :: ',param);
                    $scope.showTotalSearchPop=false;

                    // 검색처리
                    getTreeDataByDatacenterId(param);
                };


                // searchPopDirective 에서 전달한 검색조건 객체를 저장
                this.getSearchCondition = function(data){
                    $scope.searchConditions = data;
                };


                $scope.executeFilter = function() {
                    $scope.gridApi.grid.refresh();
                };

                $scope.singleFilter = function(renderableRows) {
                    var matcher = new RegExp($scope.searchKeyword, "i");

                    for (var i = 0; i < renderableRows.length; i++) {
                        var row = renderableRows[i].entity;
                        if (row.resourceName && row.resourceName.match(matcher)) {
                            renderableRows[i].visible = true;
                            row.visible = true;
                        } else {
                            renderableRows[i].visible = false;
                            row.visible = false;
                        }

                        if ($scope.showSelectedItemFilter && !renderableRows[i].entity.checked) {
                            renderableRows[i].visible = false;
                            row.visible = false;
                        }
                    }
                    return renderableRows;
                };

                $scope.selectAddHardwareList = function(event) {

                    ngDialog.open({
                        template:"/add-hardware",
                        className:"ngdialog-theme-default custom-width",
                        showClose:false,
                        disableAnimation: true,
                        cache:false,
                        closeByDocument:false,
                        closeByEscape:false,
                        scope:$scope
                    });
                }


                // event-handler

                // function
                function initialize() {
                    addEventHandler();
                    initData();
                }

                function initData() {
                    gridInit();
                    getDatacenterList();
                }

                function gridInit() {
                    console.log('$scope.useCheckbox', $scope.useCheckbox);
                    $scope.gridOptions = {
                        showTreeExpandNoChildren: false,
                        enableSorting: false,
                        enableColumnMenus: false,
                        showHeader: false,
                        rowHeight: 24,
                        showTreeRowHeader: false,
                        columnDefs: [{
                            name: ' ',
                            field: 'resourceName',
                            cellTemplate: '<div class="ui-grid-cell-contents" ng-class="grid.appScope.isEnableClass()" style="padding: 0px ">' +
                            ' <div style="display:inline-block" class="w20"><button ng-click="grid.appScope.expandClick(row)" ng-class="grid.appScope.stateClass(row)" ng-if="grid.appScope.isChild(row) && row.entity.$$treeLevel == 0"></button></div>' +
                            ' <div style="display:inline-block" class="w20" ng-if="row.entity.$$treeLevel > 0 "><button ng-click="grid.appScope.expandClick(row)" ng-class="grid.appScope.stateClass(row)" ng-if="grid.appScope.isChild(row) && row.entity.$$treeLevel == 1"></button></div>' +
                            ' <div style="display:inline-block" class="w20" ng-if="row.entity.$$treeLevel > 1 "><button ng-click="grid.appScope.expandClick(row)" ng-class="grid.appScope.stateClass(row)" ng-if="grid.appScope.isChild(row) && row.entity.$$treeLevel == 2"></button></div>' +
                            ' <div style="display:inline-block" class="w20" ng-if="row.entity.$$treeLevel > 2 "><button ng-click="grid.appScope.expandClick(row)" ng-class="grid.appScope.stateClass(row)" ng-if="grid.appScope.isChild(row) && row.entity.$$treeLevel == 3"></button></div>' +
                            '<input ng-if="grid.appScope.useCheckbox == \'true\'" type="checkbox" ng-model="row.entity.checked" ng-class="grid.appScope.getCheckColor(row.entity)" />' +
                            '<label style="max-width:163px;" ng-class="grid.appScope.selectedNodeResource.resourceSeq == row.entity.resourceSeq ? \'bold\':\'\'" ng-click="grid.appScope.resourceClick(row.entity, row)" title="{{row.entity.resourceName}}" >{{row.entity.resourceName}}</label>' +
                            '</div>',
                            headerCellTemplate: '<div class="ui-grid-cell-contents" style="padding: 0px; border-top:none"><input type="checkbox" ng-model="grid.appScope.allChecked" style="position:relative;z-index:99999;" ng-click="grid.appScope.onClickCheckboxHeader()" /><label class="no-txt" /></div>',
                            cellTooltip: function(row, col) {
                                return row.entity.resourceName;
                            }
                        }],
                        onRegisterApi: function(gridApi) {
                            $scope.gridApi = gridApi;

                            $scope.gridApi.grid.registerDataChangeCallback(function() {

                                $scope.gridApi.grid.registerRowsProcessor($scope.singleFilter, 200);
                            });
                        }
                    };

                    $scope.gridOptions.data = [];
                }

                // 데이터 센터 목록 호출
                function getDatacenterList() {
                    DataService.httpPost('/common/getDatacenterList', {}, function(result) {
                        console.log('Datacenter List :: ', result);
                        if (result.result == 1) {
                            if (result.data && result.data.length > 0) {
                                for (let i = 0; i < result.data.length; i++) {
                                    result.data[i].label = result.data[i].name;
                                    result.data[i].value = result.data[i].datacenterId;
                                }

                                $scope.datacenterList = result.data;
                                $scope.selectedDatacenter = $scope.datacenterList != null ? $scope.datacenterList[0] : null;

                                getTreeDataByDatacenterId(result.data[0]); // 기본으로 첫번째 데이터센터의 정보를 트리로 보여준다
                            }


                        } else {

                        }
                    });
                }


                // 선택한 데이터센터의 정보를 트리로 구성한다
                // param.datacenterId 필수
                function getTreeDataByDatacenterId(param) {
                    // let param = {};
                    // param.datacenterId = dcid;
                    if (!param || !param.datacenterId) return;

                    DataService.httpPost('/common/getResourceTree', param, function(result) {
                        console.log('Get Resource Tree Data :: ', result);
                        if (result.result == 1 && result.data && result.data.children) {
                            // $scope.resourceList = [result.data];
                            $scope.resourceList = result.data.children;
                            var refAr = [];
                            setTreeLevel($scope.resourceList, refAr, 0);
                            $scope.gridOptions.data = refAr;

                        } else {
                            $scope.resourceList = [];
                            $scope.gridOptions.data = [];
                        }

                    });
                }


                // 트리 레벨 설정
                function setTreeLevel(ar, refAr, treeLevel) {
                    var returnAr = [];
                    for (var i = 0; ar && i < ar.length; i++) {
                        ar[i].$$treeLevel = treeLevel;
                        refAr.push(ar[i]);
                        if (ar[i].hasOwnProperty('children') && ar[i].children && ar[i].children.length > 0) {
                            setTreeLevel(ar[i].children, refAr, treeLevel + 1);
                        }
                    }
                    return returnAr;
                }


                // 데이터센터 셀렉트박스 선택
                $scope.changeDatacenterListHandler = function(dc) {
                    console.log('Select Datacenter :: ', dc);
                    $scope.selectedDatacenter = angular.copy(dc);

                    $scope.headGnbList = [];
                    $scope.headGnbList.push({'nodeId':dc.resourceSeq,'nodeName':dc.resourceName});
                    getTreeDataByDatacenterId({datacenterId : dc.value});
                };


                $scope.ngClassBlank = function(row) {
                    var isChild = $scope.isChild(row);
                    var depth = row.entity.$$treeLevel + 1;

                    return "tree-depth" + depth;
                };

                $scope.stateClass = function(row) {
                    if (row && row.hasOwnProperty("treeNode") && row.treeNode.state == "expanded") {
                        return "ui-grid-icon-minus-squared";
                    } else
                        return "ui-grid-icon-plus-squared";
                };

                $scope.expandClick = function(row) {
                    if (row.treeNode.state == "expanded") {
                        $scope.gridApi.treeBase.collapseRow(row);
                    } else {
                        $scope.gridApi.treeBase.expandRow(row);
                    }
                    $scope.gridApi.grid.refresh();
                };

                $scope.isChild = function(row) {
                    var entity = row.entity;
                    if (entity && entity.hasOwnProperty("children") && entity.children && entity.children.length > 0) {
                        return true;
                    }
                    return false;
                };

                // 트리 목록 Refresh
                $rootScope.$on('REFRESH_RESOURCE_TREE', function(event, data){
                    if (data.selectedModel.type.toLowerCase() == 'datacenter'){
                        let selectId = data.selectedId;
                        let selectType = data.selectedType.toLowerCase();
                        $scope.userSelectnodeinfo = {'selectId':selectId, 'selectType':selectType};
                        $scope.autoExpand = 'false';
                        getTreeDataByDatacenterId({datacenterId : data.selectedModel.datacenterId});
                    }

                });

                function addEventHandler() {
                    unbind = [$scope.$on('$destroy', clear)];
                }

                function clear() {
                    unbind.forEach(function(fn) {
                        fn();
                    });
                }



                // entry-point
                initialize();

            }]
        };

    }]);


    /**
     * 통합 검색 팝업
     */
    app.directive("searchPopDirective", function(){
        'use strict';

        return {
            restrict : "E",
            transclude : true,
            scope : {
                searchCallBack : "&",       // 검색 조건 콜백
                conditionTypeList : "=",     // 검색 조건
                popupType: "@"
                ,clickCallBack: "@"
            },
            template :''+
            '<div class="search-group2">'+
            '   <button type="submit" class="btn-search-plus" title="More Search" ng-click="openTotalSearchPop()"></button>'+
            '   <div ng-show="showTotalSearchPop" ng-class="popupClass()" ng-style="popupStyle()">' +
            '       <div class="in-box">'+
            '           <strong class="info-title">Search Input Keyword </strong>'+
            '           <ul class="basic-list3 round-border-type mt05">'+
            '               <li ng-repeat="con in searchConditions track by $index" style="margin-bottom: 5px;">'+
            '                   <div class="in-block">'+
            '                       <select-box-directive class="w110" select-model="con.conditionOptions" enabled="{{con.enabled}}" selected-value="{{con.type}}" on-data-change="changeConditionType(event, con)"></select-box-directive>'+
            '                           <span class="align w50p">'+
            '                               <input ng-if="con.input == \'text\'" type="text" class="w190 " ng-model="con.keyword" placeholder="{{con.placeholder}}" aria-invalid="false">'+
            '                               <select-box-directive ng-if="con.input == \'select\'"  class="w190" select-model="con.optionList" on-data-change="changeOptionType(event,con)"></select-box-directive>'+
            '                               <div ng-if="con.input == \'date\'" class="w190 in-block"><div class="calendar"><input type="text" class="date start" id="startDate-{{$index}}" style="width: 95px;"></div><div class="calendar"><input type="text" class="date end" id="endDate-{{$index}}" style="width: 95px;"></div></div>'+
            '								<ip-address-directive  ng-if="con.input == \'ip\'" ng-model="con.keyword" style="display:inline-block"></ip-address-directive>'+
            '                           </span>'+
            '                       <button type="button" class="btn-gy i-minus ico" title="Minus" ng-click="removeCondition($index)"></button>'+
            '                   </div>'+ // end of div class in-box
            '                   <button type="button" class="btn-cr i-plus ico" title="Plus" ng-click="addCondition()" ng-style="lastStyle(searchConditions, $index)"></button>'+
            '               </li>'+
            '           </ul>'+
            '           <div class="btns-area">' +
            '               <button type="button" class="btn-cr" ng-click="totalSearchApplyClick(\'pop\')">Apply</button>' +
            '               <button type="button" class="btn-gy" ng-click="closeTotalSearchPop()">Cancel</button>' +
            '           </div>'+
            '       </div>' +
            '   </div>' +
            '   <div class="input-srh-cr">'+
            '       <span class="icon-group">'+
            '           <a ng-click="totalSearchApplyClick(\'none\')" class="ico-md i-close-sm" title="Close"></a>'+
            '       </span>'+
            '       <input type="text" placeholder="Search for..." ng-model="searchKeyword" ng-keypress="goTextSearch($event)">'+
            '   </div>'+
            '   <button type="submit" class="btn-search" title="Search" ng-click="totalSearchApplyClick(\'input\')"></button>'+
            '</div>' +
            '',

            // require : '^resourceTreeDirective',
            link : function ($scope, element, attrs, controller){
                $scope.target = $(element);
                
                //해당 directive를 한 페이지에서 여러개 사용시 초기화해주는 부분.
                $scope.$watch("clickCallBack", function(value){
                	if(value != ""){
                		if ($scope.searchKeyword && $.trim($scope.searchKeyword) != ''){
                			$scope.searchKeyword = "";
                		}
                		$scope.closeTotalSearchPop();
                	}
                });
                
                /*element.bind('click', function() {
                	alert(1);
                });*/
                
                
            },
            controller : ["$scope", "$timeout", "DataService", "ConfigManager", function($scope, $timeout, DataService, ConfigManager){

                $scope.searchConditions = [];

                $scope.hardwareTypeList = [];
                $scope.hardwareStatusList = [];
                // 검색기능 사용 유무.


                $scope.popupClass = function() {
                	var c = "";
                	if ($scope.popupType == "left") {
                		c = "tooltip tail-top t-left w420";
                	} else {
                		c = "tooltip tail-top t-w180 w420";
                	}

                	return c;
                }

                $scope.popupStyle = function() {
                	var s = {};
                	if ($scope.popupType == "left") {
                		s = {
                				"left":"0px",
                				"top": "30px",
                				"z-index": 9
                		}
                	} else {
                		s = {
                				"left":"-161px",
                				"top": "29px",
                				"z-index": 9
                		}
                	}

                	return s;
                }

                // 통합검색 버튼 클릭한 경우 검색 키워드 입력 팝업 보여주기
                $scope.openTotalSearchPop = function(){
                    $scope.showTotalSearchPop = true;
                    $scope.addCondition();
                };

                // 통합검색 취소 버튼 클릭한 경우 팝업 닫기
                $scope.closeTotalSearchPop = function(){
                    $scope.showTotalSearchPop = false;
                    $scope.searchConditions = [];
                };

                let targetConditionList;
                
                // 검색 조건 추가 : + 버튼 클릭
                $scope.addCondition = function(){
                    targetConditionList = angular.copy($scope.conditionTypeList);

                    for (let i = 0 ; i < $scope.searchConditions.length ; i++) {
                        let currType = $scope.searchConditions[i].type;
                        $scope.searchConditions[i].enabled = 'false';

                        let delIdx = targetConditionList.findIndex(x => x.value==currType);
                        targetConditionList.splice(delIdx, 1);
                    }

                    if (targetConditionList && targetConditionList.length > 0) {
                        let keywordValue = '';
                        if(targetConditionList[0].input == 'date') {
                            let _d = moment().format('YYYY-MM-DD');
                            keywordValue = _d+'||'+_d;
                            $timeout(function(){
                            	$scope.target.find(".date").datepicker({
                                    showOn : "both", //이미지로 사용 button , both : 엘리먼트와 이미지 동시사용
                                    buttonText : "",
                                    maxDate: 0,
                                    dateFormat : 'yy-mm-dd', //2017-03-31 MOD ko용
                                    onSelect : function(date, target) {
                                        if(target.id.indexOf("startDate") > -1){
                                            for (let i = 0 ; i < $scope.searchConditions.length ; i++){
                                                if ($scope.searchConditions[i].input == 'date') {
                                                    let keywordArr = $scope.searchConditions[i].keyword.split('||');
                                                    keywordArr[0] = date;
                                                    $scope.searchConditions[i].keyword = keywordArr[0]+'||'+keywordArr[1];
                                                    break;
                                                }
                                            }
                                        }else if(target.id.indexOf("endDate") > -1){
                                            for (let i = 0 ; i < $scope.searchConditions.length ; i++){
                                                if ($scope.searchConditions[i].input == 'date') {
                                                    let keywordArr = $scope.searchConditions[i].keyword.split('||');
                                                    keywordArr[1] = date;
                                                    $scope.searchConditions[i].keyword = keywordArr[0]+'||'+keywordArr[1];
                                                    break;
                                                }
                                            }
                                        }
                                    },
                                    onClose: function(date, target) {
                                        if(target.id.indexOf("startDate") > -1) {
                                        	$("#endDate-" + target.id.replace("startDate-", "")).datepicker("option", "minDate", date);
                                        }else if(target.id.indexOf("endDate") > -1) {
                                        	$("#startDate-" + target.id.replace("endDate-", "")).datepicker("option", "maxDate", date);
                                        }                               	
                                    }
                                });//.datepicker("setDate", new Date());
                            },100);
                        }
                        $scope.searchConditions.push({
                            keyword: keywordValue,
                            type: targetConditionList[0].value,
                            enabled: 'true',
                            conditionOptions: targetConditionList,
                            input: targetConditionList[0].input,
                            placeholder: targetConditionList[0].placeholder,
                            optionList: targetConditionList[0].optionList
                        });

                    }
                };

                // 검색 조건 제외 : - 버튼 클릭
                $scope.removeCondition = function(idx){
                    if ($scope.searchConditions.length > 1) {
                    	var deletedType = $scope.searchConditions[idx].type;
                    	var deletedOption = null;
                    	for(var i = 0; i < $scope.searchConditions[idx].conditionOptions.length; i++) {
                    		if($scope.searchConditions[idx].conditionOptions[i].value == deletedType) {
                    			deletedOption = $scope.searchConditions[idx].conditionOptions[i];
                    			break;
                    		}
                    	}
                        $scope.searchConditions.splice(idx, 1);
                        if(deletedOption != null) {
                        	$scope.searchConditions[$scope.searchConditions.length-1].enabled = 'true';
                        	$scope.searchConditions[$scope.searchConditions.length-1].conditionOptions.push(deletedOption);
                        }
                    }
                };

                // 마지막 검색조건에서만 추가 버튼 보이게 한다
                $scope.lastStyle = function(list, index) {
                    if(list && list.length == index + 1)
                        return {display:"inline-block"};
                    return {display:"none"};
                };

                // Select Box 필터 변경
                $scope.changeConditionType = function(data, con){
                    con.input = data.input;
                    con.type = data.value;
                    con.placeholder = data.placeholder;
                    con.keyword = '';
                    if (con.input == 'select') {
                        con.optionList = data.optionList;
                        con.keyword = data.optionList[0].value;
                    } else if (con.input == 'date') {
                        let _d = moment().format('YYYY-MM-DD');
                        con.keyword = _d+'||'+_d;
                        $timeout(function(){
                            $scope.target.find(".date").datepicker({
                                showOn : "both", //이미지로 사용 button , both : 엘리먼트와 이미지 동시사용
                                buttonText : "",
                                maxDate: 0,
                                dateFormat : 'yy-mm-dd', //2017-03-31 MOD ko용
                                onSelect : function(date, target){
                                    if(target.id.indexOf("startDate") > -1) {
                                        let keywordArr = con.keyword.split('||');
                                        keywordArr[0] = date;
                                        con.keyword = keywordArr[0]+'||'+keywordArr[1];
                                    }else if(target.id.indexOf("endDate") > -1) {
                                        let keywordArr = con.keyword.split('||');
                                        keywordArr[1] = date;
                                        con.keyword = keywordArr[0]+'||'+keywordArr[1];
                                    }
                                },
                                onClose: function(date, target) {
                                    if(target.id.indexOf("startDate") > -1) {
                                    	$("#endDate-" + target.id.replace("startDate-", "")).datepicker("option", "minDate", date);
                                    }else if(target.id.indexOf("endDate") > -1) {
                                    	$("#startDate-" + target.id.replace("endDate-", "")).datepicker("option", "maxDate", date);
                                    }                               	
                                }
                            });//.datepicker("setDate", new Date());
                        },100);
                    }
                    ap($scope);
                };

                // 검색 조건에서 select 타입인 경우
                $scope.changeOptionType = function(data, con){
                    con.keyword = data.value;
                };

                $scope.goTextSearch = function(event){
                    if (event.which == 13) {
                        $scope.totalSearchApplyClick('input');
                    }
                };

                // Apply 클릭 - 검색 조건 전달
                $scope.totalSearchApplyClick = function(type){
                    let param = {};
                    
                    param.hasSearchParam = 'true';
                    
                    if (type == 'pop') {
                        for (let i = 0; i < $scope.searchConditions.length; i++) {
                        	//전체 검색은 초기화
                        	if ($scope.searchKeyword && $.trim($scope.searchKeyword) != ''){
                        		$scope.searchKeyword = "";
                        	}
                        		
                            if ($scope.searchConditions[i].keyword != '') {
                                let type = 'param_' + $scope.searchConditions[i].type;
                                let keyword = $scope.searchConditions[i].keyword;
                                param[type] = keyword;
                            }
                        }
                    } else if (type == 'input'){
                        if ($scope.searchKeyword && $.trim($scope.searchKeyword) != '')
                            param['param_TotalSearch'] = $scope.searchKeyword;
                    } else {
                        $scope.searchKeyword = '';
                        ap($scope);
                    }

                    ConfigManager.setResourceSearchParam(param);

                    //$scope.searchKeyword = null;

                    $scope.searchCallBack({searchParam:param});

                    $scope.closeTotalSearchPop();

                };



                function initialize(){
                    // $scope.addCondition();
                }

                initialize();
            }]
        }
    });

    
    
 // ip-address
    app.directive("ipAddressDirective", function() {
        'use strict';

        return {
            restrict: "E",
            transclude: true,
            template:'<div ng-style="style()">' +
	            '<input type="number" ng-readonly="readOnly" ng-change="changeValue()" ng-model="ipAddress[0]" min="1" max="255" class="w45"><span class="and">.</span>' +
	            '<input type="number" ng-readonly="readOnly" ng-change="changeValue()" ng-model="ipAddress[1]" min="0" max="255" class="w45"><span class="and">.</span>' +
	            '<input type="number" ng-readonly="readOnly" ng-change="changeValue()" ng-model="ipAddress[2]" min="0" max="255" class="w45"><span class="and">.</span>' +
	            '<input type="number" ng-readonly="readOnly" ng-change="changeValue()" ng-model="ipAddress[3]" min="0" max="255" class="w45">' +
	            '</div>',
            scope: {
            	fakeNgModel: "=?ngModel"
            },
            link: function postLink($scope, element, attrs, controller) {
                // property
            	$scope.ipAddress = ["", "", "", ""];
            	$scope.readOnly = false;

            	var target = $(element);

				// method
				attrs.$observe("ngReadonly", function(value) {
					$scope.readOnly = false;
            		if (value == true || value == "true") {
            			$scope.readOnly = true;
            		}
            	});

                $scope.$watch("fakeNgModel", function (value) {
                    if (!value || value == "") {
                        return;
                    }

                    var l = value.split(".");
                    for (var i=0; i < l.length; i++) {
                    	var c = parseInt(l[i]);
                    	if (isNaN(c)) {
                    		c = "";
                    	}
                    	$scope.ipAddress[i] = c;
                    }
                    ap($scope);
                });

                $scope.style = function() {
                	var s = {
                		border: "none",
                		width: "218px",
                		backgroundColor: "#ffffff",
                		fontSize: "11px",
                		display:"inline-block"	
                	};

                	if ($scope.readOnly) {
                		s.backgroundColor = "#eeeeee";
                	}

                	return s;
                }

                $scope.changeValue = function() {
                	$scope.fakeNgModel = $scope.ipAddress[0];
                	
                	var t = "";
                	if ($scope.ipAddress[1] && $scope.ipAddress[1] != "") {
                		$scope.fakeNgModel += "." + $scope.ipAddress[1];
                	} else {
                		t += ".";
                	}
                	
                	if ($scope.ipAddress[2] && $scope.ipAddress[2] != "") {
                		$scope.fakeNgModel += (t + "." + $scope.ipAddress[2]); 
                	} else {
                		t += ".";
                	}
                	
                	if ($scope.ipAddress[3] && $scope.ipAddress[3] != "") {
                		$scope.fakeNgModel += t + ("." + $scope.ipAddress[3]);
                	}
                };


            	// function
            	function remove() {
            		target.off("remove", remove);
            	}
            	target.on("remove", remove);
            }
        }
    });

    /**
     * ??
     */
    app.directive("panelHeaderDirective", function() {
        'use strict';

        return {
            restrict: "E",
            transclude: true,
            template: '' +
            '<div class="panel-header">' +
            '   <ol class="panel-path">'+
            '       <li ng-repeat="title in titleList"><a>{{title}}</a></li>'+
            '   </ol>'+
            '   <div class="setting-box" style="position: absolute; top: 2px; right: 7px;">'+
            '       <button type="button" ng-show="{{useAddOnBtn}}" class="ico-md i-ellipsis-h mr10" title="부가기능" ng-click="showAddOnMenu($event)"></button>'+
            '       <div ng-show="showAddOnMenuArea" class="tooltip tail-top t-right w120" style="right:26px;top:28px">'+
            '           <ul class="basic-list">'+
            '               <li><a href="#none">이력보기</a></li>'+
            '               <li><a href="#none">통합 Excel다운로드</a></li>'+
            '               <li><a href="#none">클립보드 복사</a></li>'+
            '           </ul>'+
            '       </div>'+
            '       <button type="button"ng-show="{{useConfigBtn}}" class="ico-md i-setting" title="상면도설정" ng-click="clickConfigBtn($event)"></button>'+
            '   </div>'+
            '</div>'+
            '',
            scope: {
                titleData: "=",
                useAddOnBtn : "=",  // 부가기능 버튼 사용 유무
                useConfigBtn: "=",  // 설정 버튼 사용 유무
                clickConfigBtn: "&" // 설정 버튼 클릭 액션
            },
            link: function postLink($scope, element, attrs, controller) {

                $scope.$watch('useConfigBtn', function(value) {
                    if (value)
                        $scope.useConfigBtn = value;
                });

                // 패널 헤더 처리
                $scope.$watch('titleData', function() {
                    $scope.titleList = [];

                    if ($scope.titleData && $scope.titleData.length > 0) {
                        // let _title = '';
                        // for (let i = 0; i < $scope.titleData.length; i++) {
                        //     if (i + 1 == $scope.titleData.length)
                        //         _title += $scope.titleData[i];
                        //     else
                        //         _title += $scope.titleData[i] + ' > ';
                        // }
                        // $scope.title = _title;
                        $scope.titleList = $scope.titleData;
                    }
                });

                // <button type="button" class="btn-round-setting" title="setting"></button>

            },
            controller: ["$rootScope", "$scope", "$timeout", "DataService", function($rootScope, $scope, $timeout, DataService) {

                $scope.showAddOnMenu = function(event) {
                    event.preventDefault();
                    event.stopPropagation();

                    if ($scope.showAddOnMenuArea) {
                        hideAddOnMenu();
                        return;
                    }

                    $("body").on("click", hideAddOnMenu);
                    $scope.showAddOnMenuArea = true;
                };

                function hideAddOnMenu() {
                    $("body").off("click", hideAddOnMenu);
                    $scope.showAddOnMenuArea = false;
                    ap($scope);
                }

            }]

        };
    });


    /**
     * 장비 설정 패널
     */
    app.directive("equipManagementDirective", function(){
        'use strict';

        return {
            restrict: "E",
            transclude : true,
            templateUrl : 'equip-management-template',
            scope : {
                targetType : "=",               // 현재 작업 대상 타입 : room / rack
                targetId : "=?",
                showFlag : "=",
                diagramJson : "=?",              // 현재 상면도 배치 상태 저장된 JSON 데이터 : floor-diagram-directive 에서 받아옴
                saveDiagramStatus : "&",
                // diagramInfo : "=",               // 상면도 정보 : save_info + diagram_info
                diagramPassModel:"=",               // raised에서 전달받은 데이터 raisedFloorModel : { selectedModel : {선택된트리정보}, diagramData : {[노드 그리기 정보]} }
                addedItem : "=?",                    // 상면도 위에 추가 완료된 장비
                removedItem : "=?",                   // 상면도 위에서 삭제 완료된 장비
                rackExternal : "=?"                 // Rack 다이어그램 저장 처리
            },
            link : function postLink($scope, elem, attr){

                if ($scope.targetType == null) $scope.targetType = attr.targetType;

                $scope.$watch('showFlag', function() {
                });

                $scope.$watch('targetType', function(value) {       // room / rack
                    if (value == null || value == '') return;
                    // if ($scope.targetType.toString().toLowerCase() == 'room') {
                    //
                    // } else if ($scope.targetType.toString().toLowerCase() == 'rack') {
                    //     $scope.getUnspecifiedInfoList();
                    // }
                });

                // 상면도 위에 장비 아이템 추가 완료
                $scope.$watch('addedItem', function(value) {
                    if (value == null) return;


                    if ($scope.unspecifiedListTemp && $scope.unspecifiedListTemp.length > 0){
                        console.log('장비 올리기 완료 :: ',$scope.addedItem);
                        if ($scope.targetType.toString().toLowerCase() == 'room') {
                            let addedItemId = $scope.addedItem.id;
                            for (let i = 0; i < $scope.unspecifiedListTemp.length; i++) {
                                if ($scope.unspecifiedListTemp[i].equipmentId == addedItemId)
                                    $scope.unspecifiedListTemp.splice(i, 1);
                            }
                        } else if ($scope.targetType.toString().toLowerCase() == 'rack') {
                            let addedItemId = $scope.addedItem;
                            for (let i = 0; i < $scope.unspecifiedListTemp.length; i++) {
                                if ($scope.unspecifiedListTemp[i].hardwareCommonId.toString() == addedItemId.toString())
                                    $scope.unspecifiedListTemp.splice(i, 1);
                            }
                        }

                    }



                });

                // 상면도 위에서 장비 아이템 삭제 처리
                $scope.$watch('removedItem', function(value) {
                    if (value && $scope.unspecifiedListTemp && $scope.unspecifiedListTemp.length > 0){
                        console.log('장비 삭제 완료 :: ',$scope.removedItem);
                        let removedItemId = $scope.removedItem;
                        for (let i = 0 ; i < $scope.unspecifiedList.length ; i++){
                            if ($scope.unspecifiedList[i].equipmentId == removedItemId) {
                                $scope.unspecifiedListTemp.push($scope.unspecifiedList[i]);
                            }
                        }
                    }

                });

                // raised에서 전달받은 데이터 raisedFloorModel : { selectedModel : {선택된트리정보}, diagramData : {[노드 그리기 정보]} }
                // 트리노드 선택할때마다 새로 받아온다
                $scope.$watch('diagramPassModel', function(value) {
                    if (value == null) return;

                    if ($scope.targetType.toString().toLowerCase() == 'room') {
                        if (value && value.selectedId) {
                            console.log('RAISED에서 전달받은 MODEL. 선택된 트리 모델 + 그리기 모델 :: ', value);
                            if (value.treeData == null){ // 트리노드선택
                                $scope.currentDiagramInfo = {};
                                $scope.confFoldingPanel.diagramData.title = value.title ? value.title : '';
                                $scope.currentDiagramInfo.locationId = $scope.diagramPassModel.selectedId;
                                $scope.currentDiagramInfo.type = $scope.diagramPassModel.selectedType.toString().toLowerCase();
                            }


                        }

                    } else if ($scope.targetType.toString().toLowerCase() == 'rack') {

                    }

                    $scope.getTemporaryList();          // 임시보관함 리스트 조회
                    $scope.getUnspecifiedInfoList();    // 미지정 장비 리스트 조회


                });


                // raised 에서 처리한 상면도 다이어그램 데이터를 받아온다
                $scope.$watch('diagramJson', function(value) {
                    if (!value) return;
                    console.log('상면도 상태 저장 처리 JSON :: ',$scope.diagramJson);

                    $scope.saveDiagramData();

                });


            },
            controller : ["$rootScope", "$scope", "DataService", "ConfigManager", function($rootScope, $scope, DataService, ConfigManager){
                $scope.currentDiagramInfo = {};       // 상면도 설정 정보
                // $scope.drawingModel

                $scope.temporaryList = [];      // 임시보관함 리스트

                $scope.confFoldingPanel = {};   // 설정팝업 기본설정 부분 저장 객체

				$scope.confFoldingPanel2TabMode = "All";    // confFoldingPanel2의 tab 모드


                // 임시저장 클릭 처리
                $scope.saveTemporaryEventHandler = function(){
                    if ($scope.targetType.toString().toLowerCase() == 'room') {
                        if (validation()){
                            $scope.currentDiagramInfo.title = $scope.confFoldingPanel.diagramData.title;
                            $scope.currentDiagramInfo.version = 'release-temp';   // 임시저장
                            $scope.currentDiagramInfo.type = $scope.targetType;   // 상면도
                            $scope.saveDiagramStatus();                         // 다이어그램 상태 저장을 요청한다.
                        }
                    } else if ($scope.targetType.toString().toLowerCase() == 'rack') {
                        $scope.currentDiagramInfo = {};
                        $scope.currentDiagramInfo.version = 'release-temp';   // 임시저장
                        $scope.currentDiagramInfo.type = $scope.targetType.toLowerCase();   // 실장도
                        $scope.currentDiagramInfo.locationId = $scope.targetId; // rack id

                        saveDiagramData();
                    }

                };

                // 적용 클릭 처리
                $scope.saveRealEventHandler = function(){
                    if ($scope.targetType.toString().toLowerCase() == 'room') {
                        if (validation()) {
                            $scope.currentDiagramInfo.title = $scope.confFoldingPanel.diagramData.title;
                            $scope.currentDiagramInfo.version = 'release';        // 완전저장
                            $scope.currentDiagramInfo.type = $scope.targetType;
                            $scope.saveDiagramStatus();                         // 다이어그램 상태 저장을 요청한다.
                        }
                    } else if ($scope.targetType.toString().toLowerCase() == 'rack') {
                        $scope.currentDiagramInfo = {};
                        $scope.currentDiagramInfo.version = 'release';   // 완전저장
                        $scope.currentDiagramInfo.type = $scope.targetType.toLowerCase();   // 실장도
                        $scope.currentDiagramInfo.locationId = $scope.targetId; // rack id
                        saveDiagramData();
                    }
                };

                $scope.saveDiagramData = saveDiagramData;



                // 임시 보관함 팝업 오픈 처리
                $scope.getTemporaryListEventHandler = function(){
                    $scope.showTempList = true;
                    $scope.tempDiagramListPopStyle = {top : (Number(event.clientY)-70)+'px'};
                };

                // 임시보관함에서 특정 상면도 더블클릭 - 상면도 호출
                $scope.loadDiagram = function(id){
                    if ($scope.targetType.toString().toLowerCase() == 'room') {
                        getDiagramJSONData(id);
                    } else if ($scope.targetType.toString().toLowerCase() == 'rack') {
                        getRackDiagramJSONData(id);
                    }
                };

                $scope.customDragClass = function(hwType) {
                    if (hwType == "010") {
                        return "draggable-node";
                    }

                    return "draggable-rack";
                };


                // 현재 선택된 ROOM / RACK 에 대한 임시보관함 리스트 조회
                $scope.getTemporaryList = getTemporaryList;
                function getTemporaryList(){

                    let param = {};
                    param.type = $scope.targetType.toLowerCase();     // room / rack
                    param.version = 'release-temp';
                    if ($scope.targetType.toString().toLowerCase() == 'room') {
                        param.locationId = $scope.diagramPassModel.selectedId;
                    } else if ($scope.targetType.toString().toLowerCase() == 'rack') {
                        param.locationId = $scope.targetId;
                    }

                    DataService.httpPost('/common/getSaveDiagramInfoList', param, function (result) {
                        console.log('임시보관함 리스트 :: ',result);
                        if (result.result == 1){
                            if(result.data && result.data.length > 0){
                                // if (result.data[0].diagramList){
                                //     $scope.temporaryList = result.data[0].diagramList;
                                // }
                                let arr = [];
                                for (let i = 0 ; i < result.data.length ; i++){
                                    if (result.data[i].diagramList && result.data[i].diagramList.length > 0){
                                        arr.push(result.data[i].diagramList[0])
                                    }
                                }
                                $scope.temporaryList = arr;
                            } else {
                                $scope.temporaryList = [];
                            }
                            if ($scope.confFoldingPanel2)
                                $scope.confFoldingPanel2.diagramData.tempListSize = $scope.temporaryList.length;
                        }
                    });

                }

                $scope.getUnspecifiedInfoList = getUnspecifiedInfoList;     // 미지정 장비 리스트 조회
                function getUnspecifiedInfoList(){
                    let param = {};
                    param.type = $scope.targetType;     // room / rack
                    if ($scope.targetType.toString().toLowerCase() == 'room')
                        param.locationId = $scope.diagramPassModel.selectedId;
                    else if ($scope.targetType.toString().toLowerCase() == 'rack')
                        param.locationId = $scope.targetId; //rack id
                    else return;

                    DataService.httpPost('/common/getUnspecifiedInfoList', param, function (result) {
                        console.log('미지정 장비 리스트 :: ',result);
                        if (result.result == 1){
                            $scope.unspecifiedList = result.data;
                            filterUnspecifiedInfoList();
                        }
                    });
                }



                // $scope.singleFilter = function(renderableRows) {
                //     var matcher = new RegExp($scope.searchKeyword, "i");
                //
                //     for (var i = 0; i < renderableRows.length; i++) {
                //         var row = renderableRows[i].entity;
                //         if (row.resourceName && row.resourceName.match(matcher)) {
                //             renderableRows[i].visible = true;
                //             row.visible = true;
                //         } else {
                //             renderableRows[i].visible = false;
                //             row.visible = false;
                //         }
                //
                //         if ($scope.showSelectedItemFilter && !renderableRows[i].entity.checked) {
                //             renderableRows[i].visible = false;
                //             row.visible = false;
                //         }
                //     }
                //     return renderableRows;
                // };


                // 미지정장비 리스트에서 현재 그려진 상면도에서 사용하는 장비들을 제외
                $scope.filterUnspecifiedInfoList = filterUnspecifiedInfoList;
                function filterUnspecifiedInfoList(){

                    $scope.unspecifiedListTemp = angular.copy($scope.unspecifiedList);

                    if ($scope.targetType.toString().toLowerCase() == 'room') {
                        if ($scope.diagramPassModel && $scope.diagramPassModel.diagramData && $scope.diagramPassModel.diagramData.length > 0){

                            let diagramDataList = $scope.diagramPassModel.diagramData;
                            for (let i = 0 ; i < diagramDataList.length ; i++) {
                                if (diagramDataList[i].type != 'size') {
                                    let equipmentId = diagramDataList[i].id.toString();
                                    let equipmentType = diagramDataList[i].type.toString().toUpperCase();
                                    for (let k = 0 ; k < $scope.unspecifiedListTemp.length ; k++) {
                                        let _data = ConfigManager.getRackBDType($scope.unspecifiedListTemp[k].sectionType);
                                        if ($scope.unspecifiedListTemp[k].equipmentId.toString() == equipmentId && _data.type.toUpperCase() == equipmentType) {
                                            $scope.unspecifiedListTemp.splice(k,1);
                                        }
                                    }
                                }
                            }

                        }
                    } else if ($scope.targetType.toString().toLowerCase() == 'rack') {

                        // 미지정 리스트 필터링 - 실제 장비 등록되면 주석 풀어준다
                        // if ($scope.diagramPassModel && $scope.diagramPassModel.length > 0){
                        //     for (let i = 0 ; i < $scope.diagramPassModel.length ; i++){
                        //         for (let k = 0 ; k < $scope.unspecifiedListTemp.length ; k++) {
                        //             if ($scope.unspecifiedListTemp[k].hardwareCommonId.toString() == $scope.diagramPassModel[i].hardwareCommonId.toString()) {
                        //                 $scope.unspecifiedListTemp.splice(k,1);
                        //             }
                        //         }
                        //     }
                        //
                        // }

                        setTimeout(setDraggableForRack, 1000);
                    }


                    console.log('미지정 장비 필터링 ::', $scope.unspecifiedListTemp);

                }


                function setDraggableForRack(){
                    $scope.rack = new Rack();


                    $(".add-rack").mousedown(function(){
                        for (let i = 0 ; i < $scope.unspecifiedListTemp.length ; i++) {
                            if ($(this)[0].id == $scope.unspecifiedListTemp[i].hardwareCommonId) {
                                $scope.rack.set($scope.unspecifiedListTemp[i]);
                                break;
                            }
                        }

                    });
                    $(".add-rack").draggable({
                        revert: true,
                        cursor: "pointer",
                        start: function() {
                            ap($scope);
                        }
                    }).data("rack", $scope.rack);
                }


                function validation(){
                    let returnValue = true;

                    if (!$scope.currentDiagramInfo) returnValue = false;
                    else if (!$scope.confFoldingPanel.diagramData.title || $.trim($scope.confFoldingPanel.diagramData.title) == '') {
                        alert('상면도명');
                        returnValue = false;
                    }
                    return returnValue;
                }

                function saveDiagramName(id, name) {
					DataService.httpPost('/common/updateRoomOrd', { roomInfoId: id, ord: name }, function () {
						console.log('ROOM 이름 변경 :: ');
					});
				}

                // 설정한 상면도 / 실장도 정보 DB 저장 처리
                // title, version, type
                function saveDiagramData() {
					if($scope.currentDiagramInfo.version == 'release') {
                        if ($scope.targetType.toString().toLowerCase() == 'room') {
                            saveDiagramName($scope.currentDiagramInfo.locationId, $scope.diagramConfData.title);

                            var saveData = [];
                            for (let i = 0, l = $scope.diagramJson.length; i < l; ++i) {
                                saveData.push({
                                    roomInfoId: $scope.currentDiagramInfo.locationId,
                                    positionX: $scope.diagramJson[i].x,
                                    positionY: $scope.diagramJson[i].y,
                                    type: ConfigManager.getRackDiagramType($scope.diagramJson[i].type, $scope.diagramJson[i].subtype),
                                    rackId: ($scope.diagramJson[i].id) ? $scope.diagramJson[i].id : null,
                                    userId: ConfigManager.getUser().userId,
                                    saveType: 'release'
                                });
                            }
                            DataService.httpPost('/common/setRoomSection', saveData, function () {
                                console.log('DB 저장 처리 :: ');
                                alert('상면도 저장 처리 완료');
                                $rootScope.$broadcast('REFRESH_RESOURCE_TREE', $scope.diagramPassModel);     // 저장 완료 후 트리 refresh
                            });
                        } else if ($scope.targetType.toString().toLowerCase() == 'rack') {
                            let param = {};
                            param.rackId = $scope.targetId;
                            param.children = $scope.rackExternal.getData();
                            console.log('RACK 배치 정보 :: ', $scope.rackExternal.getData());
                            DataService.httpPost('/common/setHardwareAdditory.json', param, function (result) {
                                if (result.result == 1){
                                    console.log('RACK 정보 저장 완료 :: ', result.data);
                                    alert('Rack 배치정보 저장 완료');
                                }
                            });
                        }
					} else {        // release-temp 인 경우에는 save_info 에 저장
						if ($scope.currentDiagramInfo) {
							DataService.httpPost('/common/setSaveInfo', $scope.currentDiagramInfo, function (setSaveInfoResult) {
								console.log('DB 저장 처리 :: ', setSaveInfoResult);
								if (setSaveInfoResult.result == 1) {
									let saveInfoId = setSaveInfoResult.data.saveInfoId;
									$scope.currentDiagramInfo.saveInfoId = saveInfoId;
									saveDiagramJSONData(saveInfoId);
								}
							});
						}
					}
                }


                // 다이어그램 저장 처리
                function saveDiagramJSONData(saveInfoId){
                    let diagramInfoModel = {};
                    if ($scope.targetType.toString().toLowerCase() == 'room') {
                        diagramInfoModel.data = {diagramData: $scope.diagramJson};
                        diagramInfoModel.title = $scope.currentDiagramInfo.title;
                    } else if ($scope.targetType.toString().toLowerCase() == 'rack') {
                        diagramInfoModel.data = {diagramData: $scope.rackExternal.getData()};
                        diagramInfoModel.title = 'Rack '+$scope.selectedId+' '+moment().local().format("YYYY-MM-DD hh:mm:ss")
                    }

                    diagramInfoModel.type = $scope.targetType;
                    diagramInfoModel.saveInfoId = saveInfoId;
                    diagramInfoModel.version = $scope.currentDiagramInfo.version;

                    DataService.httpPost('/common/setDiagramInfo', diagramInfoModel, function (setDiagramResult) {
                        console.log('DB Diagram 저장 처리 완료 :: ', setDiagramResult);

                        if (setDiagramResult.result == 1){
                            alert('임시저장 처리 완료');
                            if ($scope.targetType.toString().toLowerCase() == 'room') {
                                getDiagramJSONData(setDiagramResult.data.diagramInfoId);        // 특정 상면도 정보를 가져온다
                            } else if ($scope.targetType.toString().toLowerCase() == 'rack') {
                                getRackDiagramJSONData(setDiagramResult.data.diagramInfoId);        // 특정 RACK 실장도 정보를 가져온다
                            }
                        }

                    });
                }



                // 특정 상면도 정보를 가져온다
                function getDiagramJSONData(diagramInfoId){
                    console.log('상면도 정보 조회 요청 ::::: ',diagramInfoId);
                    let diagramInfoModel = {};
                    diagramInfoModel.diagramInfoId = diagramInfoId;
                    let temp = angular.copy($scope.diagramPassModel);
                    $scope.diagramPassModel = null;
                    $scope.currentDiagramInfo = null;
                    $scope.confFoldingPanel.diagramData.title = '';
                    DataService.httpPost('/common/getDiagramInfoList', diagramInfoModel, function (getDiagramResult) {
                        console.log('DB Diagram 정보 조회 :; ', getDiagramResult);      // tb_save_info + tb_diagram_info
                        if (getDiagramResult.result == 1) {

                            delete temp.diagramData;
                            temp.diagramData = [];
                            if (getDiagramResult.data && getDiagramResult.data.length > 0) {
                                temp.diagramData = getDiagramResult.data[0].data.diagramData;
                                $scope.currentDiagramInfo = getDiagramResult.data[0];
                                $scope.currentDiagramInfo.locationId = temp.selectedId;
                                $scope.currentDiagramInfo.type = temp.selectedType.toString().toLowerCase();
                                $scope.confFoldingPanel.diagramData.title = $scope.currentDiagramInfo.title;        // folding panel 에서 사용하는 객체에 데이터 설정
                            }

                        }
                        temp.treeData = false;
                        $scope.diagramPassModel = temp;
                        $scope.showTempList = false;
                        console.log('현재 참조 상면도 정보 :: ',$scope.currentDiagramInfo);

                    });
                }


                // 특정 실장도 정보를 가져온다
                function getRackDiagramJSONData(diagramInfoId){
                    // rackDrawModelData
                    console.log('RACK 실장도 정보 조회 요청 ::::: ',diagramInfoId);
                    let diagramInfoModel = {};
                    diagramInfoModel.diagramInfoId = diagramInfoId;
                    $scope.diagramPassModel = null;
                    $scope.currentDiagramInfo = null;
                    DataService.httpPost('/common/getDiagramInfoList', diagramInfoModel, function (getDiagramResult) {
                        console.log('DB Diagram 정보 조회 RACK :; ', getDiagramResult);      // tb_save_info + tb_diagram_info
                        let arr = [];
                        if (getDiagramResult.result == 1) {

                            if (getDiagramResult.data && getDiagramResult.data.length > 0) {
                                let list = getDiagramResult.data[0].data.diagramData;
                                for (let i = 0 ; i < list.length ; i++) {
                                    let rack = new Rack();
                                    rack.set(list[i]);
                                    arr.push(rack);
                                }
                            }
                        }
                        $scope.diagramPassModel = arr;
                        $scope.showTempList = false;

                    });
                }


                function initialize(){

                }
                


                initialize();

            }]
        }
    });

    /**
     * select box
     */
    app.directive("selectBoxDirective", function() {
        'use strict';

        return {
            restrict: "E",
            scope: {
                selectModel: "=", //[]  형태로 입력  {label:"", value,""}
                ngId: "=",
                type: "@",
                typeClass: "@",
                size: "@",
                selectedField: "@",
                selectedValue: "@",
                childDirection: "@",
                enabled: "@",
                fakeNgModel: "=?ngModel",
                onDataChange: "&"
            },
            link: function postLink($scope, element, attrs, controller) {
                var target = $(element);
                var selectedData;
                var selectedValue = "";
                var childDirection = "down";
                var selectedField = (attrs.selectedField == null || attrs.selectedField == "") ? "value" : attrs.selectedField;
                var labelA = null;

                if ($scope.type == "button") {
                    labelA = generateButton();
                } else {
                    labelA = generateLabel();
                }

                var popupUl = $("<ul></ul>");
                popupUl.addClass("selectbox-sm-ul");
                popupUl.css("z-index", 999999999999);
                popupUl.on("mouseleave", function() {
                    boxVisibleChange(false)
                });

                $(document).find('body').append(popupUl);

                target.addClass("selectbox");

                $scope.nodeList = [{
                    label: "",
                    value: ""
                }];

                function generateLabel() {
                    var labelA = $('<a>');
                    labelA.addClass("current");
                    labelA.attr("href", "javascript:;");
                    labelA.on("mousedown", function(e) {
                        var left = labelA.offset().left;
                        var l = labelA.outerWidth();

                        // 왜인지 모르겠지만 left 와 l 값이 이전과 다르게 나와서 일단 막음.
                        // if (l - (e.pageX - left) < 0 || l - (e.pageX - left) > 25)
                        //     return;

                        if (!$scope.enabled || $scope.enabled != "false") {
                            boxVisibleChange(true);
                        }
                    });
                    target.append(labelA);
                    target.css("minWidth", "50px");

                    return labelA;
                }
                function generateButton() {
                    var button = $('<button type="button" class="' + $scope.typeClass + '"></button>');
                    button.click(function(e) {
                        var left = button.offset().left;
                        var l = button.outerWidth();
                        if (l - (e.pageX - left) < 0 || l - (e.pageX - left) > 25)
                            return;

                        if (!$scope.enabled || $scope.enabled != "false") {
                            boxVisibleChange(true);
                        }
                    });

                    target.append(button);
                    target.css("minWidth", "0px");

                    return button;
                }

                function boxVisibleChange(visible) {
                    if (!visible) {
                        popupUl.css("display", "none");
                        return;
                    }

                    var w = target.width();
                    var h = labelA.height();
                    var offset = labelA.offset();

                    if ($scope.size) {
                        popupUl.css("width", $scope.size);
                    } else {
                        popupUl.css("width", w + "px");
                    }

                    popupUl.css("left", offset.left);

                    if (childDirection == "up") {
                        popupUl.css("top", offset.top - 2 - popupUl.height());
                    } else {
                        popupUl.css("top", offset.top + h + 2);
                    }

                    popupUl.css("display", "block");

                    labelA.on("blur", function(e) {
                        labelA.off("blur");
                        boxVisibleChange(false);
                    });
                }

                function userSelectChange(value) {
                    if (!value)
                        value = {
                            label: "",
                            value: ""
                        };

                    selectedValueChange(value[selectedField]);

                    if ($scope.onDataChange && selectedData) {
                        $scope.onDataChange({
                            event: selectedData
                        });
                    }
                }

                function selectedValueChange(value) {
                    if (!value)
                        value = "";
                    if (selectedData && selectedData == value)
                        return;

                    selectedData = getValueByNode(value);
                    selectedValue = value;

                    if (selectedData && $scope.type != "button") {
                        labelA.text(selectedData.label);
                        labelA.attr("title", selectedData.label);
                    }

                    boxVisibleChange(false);

                    $scope.fakeNgModel = value;
                    ap($scope);
                }


                function selectModelChange(value) {
                    if (!value || value.length < 1) {
                        value = [{
                            label: "",
                            value: ""
                        }];
                    }
                    $scope.nodeList = value;
                    selectedData = getValueByNode(selectedValue) ? getValueByNode(selectedValue) : value[0];
                    if (!selectedData) {
                        return;
                    }

                    boxVisibleChange(false);

                    selectedValueChange(selectedData[selectedField]);

                    popupUl.empty();

                    for (var i = 0; i < $scope.nodeList.length; i++) {
                        var node = $scope.nodeList[i];
                        var $li = $('<li>');
                        var $a = $('<a>');
                        $a.attr("href", "javascript:;");
                        $a.attr("value", node[selectedField]);
                        $a.attr("title", node.label);
                        $a.text(node.label);
                        $a.on("mousedown", function(event) {
                            var at = $(event.currentTarget);
                            var n = getValueByNode(at.attr("value"));
                            userSelectChange(n);
                        });
                        $li.append($a);
                        popupUl.append($li);
                    }

                    value.setSelection = forcedSelect;
                    value.getSelection = getSelection;

                    $scope.fakeNgModel = selectedData.value;
                    ap($scope);
                }

                function getSelection() {
                    return selectedData;
                }

                function forcedSelect(value, isDispatch) {
                    selectedValueChange(value);

                    if ($scope.onDataChange && selectedData && isDispatch) {
                        $scope.onDataChange({
                            event: selectedData
                        });
                    }
                }

                function getValueByNode(value) {
                    var s = null;
                    for (var i = 0; i < $scope.nodeList.length; i++) {
                        if (String(value).toUpperCase().trim() == String($scope.nodeList[i][selectedField]).toUpperCase().trim()) {
                            s = $scope.nodeList[i];
                            break;
                        }
                    }
                    return s
                }

                $scope.$watch("selectedValue", selectedValueChange);
                $scope.$watch("selectModel", selectModelChange);
                $scope.$watch("childDirection", function(value) {
                    childDirection = value
                });
                $scope.$watch("ngId", idChange);
                $scope.$watch("enabled", function(value) {
                    if (!labelA) {
                        return;
                    }

                    if (value && value != "true") {
                        labelA.css("color", "#bfbfbf");
                    } else {
                        labelA.css("color", "#000000");
                    }
                });
                $scope.$watch("fakeNgModel", function (value) {
                    if (!value || value == "") {
                        return;
                    }

                    if (selectedData)
                        selectedData.value = value;
                    selectedValueChange(value);
                });

                function idChange(value) {
                    if (!value)
                        return;

                    //메소드 생성
                    value.setSelection = forcedSelect;
                    value.getSelection = getSelection;
                    value.selectModelChange = selectModelChange;
                }
                // clear-memory
                function clear() {
                    popupUl.remove();
                    labelA.remove();
                    target.off("remove", clear);
                }
                function remove() {
                	clear();
                    target.off("remove", remove);
                }
                target.on("remove", remove);
            }
        }
    });

    /**
     * paging-bar
     */
    app.directive("pagingDirective", function() {
        'use strict';

        return {
            restrict: "E",
            transclude: true,
            template:'' +
            '',
            scope: {

            },
            link: function postLink($scope, element, attrs, controller) {
                // property
                var target = angular.element(element);

                // function
                function remove() {
                    target.off("remove", remove);
                }
                target.on("remove", remove);
            },
            controller: ["$scope", function($scope) {
                // property

                // method

                // event-handler

                // function
                function initialize() {

                }

            }]
        }
    });

    //test
    app.directive("historySearchDirective", function(){
        'use strict';

        return {
            restrict : "E",
            transclude : true,
            template: '' +
            '<div class="search-group">' +
            '   <button type="button" class="btn-search-plus" title="Simple query" ng-click="openTotalSearchPop()"></button>' +
            '   <div class="tooltip tail-top t-left w450" style="top:30px;left:48px;" ng-show="showTotalSearchPop">' +
            '       <div class="tab-cont fr-data" style="display:block">' +
            '           <history-search-pop-directive ></history-search-pop-directive>'+
            '       </div>' +
            '       <div class="btns-area">' +
            '           <button type="button" class="btn-cr" ng-click="totalSearchApplyClick()">Apply</button>' +
            '           <button type="button" class="btn-gy" ng-click="showTotalSearchPop=false">Cancel</button>' +
            '       </div>'+
            '   </div>' +

            ' 	<div class="input-srh-cr">' +
            ' 		<span class="icon-group">' +
            ' 			<a href="" class="ico-md i-question color1"  tooltips tooltip-size="medium" tooltip-template="{{\'MENU.TEST\' | translate}}" tooltip-side="bottom"></a>' +
            ' 		</span>' +
            ' 		<input type="text" ng-model="searchKeyword" ng-keyup="executeFilter()">' +
            ' 	</div>' +


            /*  '   <button type="button" class="btn-search w45" title="List" style="float : right;" ng-click="search()"></button>' +*/

            ' </div>',
            link : function postLink($scope, element, attrs){
                $scope.getSearchCondition($scope.searchConditions);
            },
            scope : {
                "searchHandler" : "=searchHandler",
                "conditionTypeList" : "=conditionTypeList",
                "initSearchConditions" : "=searchConditions"
            },
            controller : ["$scope", function($scope){

                //검색
                $scope.search = function() {
                    $scope.searchHandler();
                }

                // 통합검색 팝업에서 확인버튼 클릭 처리
                $scope.totalSearchApplyClick = function(){

                    let searchConditions = [];
                    for (let i = 0 ; i < $scope.searchConditions.length ; i++){
                        if ($scope.searchConditions[i].keyword != '')
                            searchConditions.push($scope.searchConditions[i]);
                    }
                    $scope.$parent.searchConditions = searchConditions;
                    console.log($scope);
                    console.log('검색조건 :: ',searchConditions);
                    $scope.showTotalSearchPop=false;
                    $scope.search();
                };

                // 검색 조건 추가 
                $scope.addCondition = function(){
                    let targetConditionList = angular.copy($scope.conditionTypeList);

                    for (let i = 0 ; i < $scope.searchConditions.length ; i++) {
                        let currType = $scope.searchConditions[i].type;
                        let delIdx = targetConditionList.findIndex(x => x.value==currType);
                        targetConditionList.splice(delIdx, 1);
                    }
                    // $scope.searchConditions.push({keyword:'', type:$scope.conditionTypeList[0].value});
                    if (targetConditionList && targetConditionList.length > 0)
                        $scope.searchConditions.push({keyword:'', type: targetConditionList[0].value});
                };
                // 검색 조건 제외
                $scope.removeCondition = function(idx){
                    if ($scope.searchConditions.length > 1)
                        $scope.searchConditions.splice(idx, 1);
                };

                // 마지막 검색조건에서만 추가 버튼 보이게 한다 
                $scope.lastStyle = function(list, index) {
                    if(list && list.length == index + 1)
                        return {display:"inline-block"};
                    return {display:"none"};
                };

                // 입력된 검색 조건 가져오기
                function getConditions(){
                    console.log('getConditions :: ',$scope.searchConditions);
                }

                $scope.getSearchCondition = function(data){
                    $scope.searchConditions = data;
                };

                // 필터 변경
                $scope.changeConditionType = function(data, con){
                    con.type = data.value;
                    con.keyword = '';
                    ap($scope);
                };

                function initialize(){

                    if($scope.initSearchConditions.length < 1) {
                        $scope.searchConditions = [
                            {
                                keyword : "",
                                type : $scope.conditionTypeList[0].value
                            }
                        ];
                        $scope.search();
                    }else {
                        $scope.searchConditions = $scope.initSearchConditions;
                        $scope.search();
                    }

                }

                // 통합검색 버튼 클릭한 경우 검색 키워드 입력 팝업 보여주기
                $scope.openTotalSearchPop = function(){
                    $scope.showTotalSearchPop = true;
                };

                initialize();
            }]
        }
    });

    //test
    app.directive("historySearchPopDirective", function(){
        'use strict';
        return {
            restrict : "E",
            transclude : true,
            template :''+
            '<div class="data-tbl">' +
            '   <span>Search Keyword</span>'+
            '   <table>'+
            '       <colgroup>'+
            '           <col style="width:100%">'+
            '       </colgroup>'+
            '       <tbody>'+
            '           <tr ng-repeat="con in searchConditions">'+
            '               <td>'+
            '               <div class="mb05 ng-scope" style="display: inline-block;">'+
            '                   <select-box-directive select-model="conditionTypeList" ng-model="con.type" selected-value="{{con.type}}" on-data-change="changeConditionType(event, con)"></select-box-directive>'+
            '                   <input type="text" class="w170 ng-pristine ng-untouched ng-valid ng-empty" name="search-text" ng-model="con.keyword" ng-trim="false">'+
            '                   <button type="button" class="btn-gy i-minus ico" title="Minus" ng-click="removeCondition($index)"></button>'+
            '               </div>'+
            '               <button type="button" class="btn-cr i-plus ico" title="Plus" ng-click="addCondition()" ng-style="lastStyle(searchConditions, $index)"></button>'+
            '               </td>'+
            '           </tr>'+
            '       </tbody></table></div>'+
            ''
        }
    });


    // folding-panel
    app.directive("foldingPanelDirective", function() {
        'use strict';

        return {
            restrict: "E",
            transclude: true,
            template:'' +
            '<div class="fold-data-area">' +
            '<div class="fold-data-head">' +
            '<h4 class="title">{{title}}</h4>' +
            '<div class="hd-right">' +
            '<button ng-show="{{showTempBtn}}" type="button" class="btn-cr btn-sm" id="btn-temp-list" ng-click="openTempPop()">{{ "MANAGEMENT.CONF_PANEL_TEMPLIST" | translate }} ({{diagramData.tempListSize}})</button>'+
            '<button type="button" class="ico-md" title="close" ng-class="{false: \'i-compress\', true: \'i-expand\'}[folding]" ng-click="toggleWindowSize()"></button>' +
            '</div>' +
            '</div>' +
            '<ng-transclude class="fold-data-cont"></ng-transclude>' +
            '</div>',
            scope: {
                id:"@",
                title: "@",
                showTempBtn:"@",         // 임시보관함 버튼 사용 유무,
                openTempPop:"&",
                diagramData:"="
            },
            link: function postLink($scope, element, attrs, controller) {
                // property
                var target = $(element);
                var oldSize = -1;


                // method
                $scope.folding = false;
                $scope.toggleWindowSize = function() {
                    var content = target.find(".fold-data-cont");

                    if (!$scope.folding) {
                        oldSize = content.height();
                        content.height(1);
                        content.hide();
                        $scope.folding = true;
                    } else {
                        content.height(oldSize);
                        oldSize = -1;
                        content.show();
                        $scope.folding = false;
                    }
                }

                // function
                function remove() {
                    target.off("remove", remove);
                }
                target.on("remove", remove);
            },
            controller : ["$scope", function($scope){
                if ($scope.id) {
                    $scope.diagramData = {};
                    var parentScope = $scope.$parent;
                    parentScope[$scope.id] = $scope;
                }
            }]
        }
    });
    // excel parcing test
    app.directive('jsXls', function () {
        return {
            restrict: 'E',
            template:
                '<input type="file" class="btn-hide" onchange="javascript: document.getElementById(\'fileName\').value = this.value">',
            replace: true,
            link: function (scope, element, attrs) {
                function handleSelect() {
                    var files = this.files

                    for (var i = 0, f = files[i]; i != files.length; ++i) {
                        var reader = new FileReader();
                        var name = f.name;
                        reader.onload = function (e) {
                            var data = null;
                            if (!e) {
                                data = reader.content;
                            } else {
                                data = e.target.result;
                            }

                            /* if binary string, read with type 'binary' */
                            try {
                                var workbook = XLSX.read(data, { type: 'binary' });
                                var first_sheet_name = workbook.SheetNames[0];
                                var worksheet = workbook.Sheets[first_sheet_name];
                                var json = XLSX.utils.make_json(worksheet, {header:1})
                                if (attrs.onread) {
                                    var handleRead = scope[attrs.onread];
//		                    		console.log(handleRead);
                                    if (typeof handleRead === "function") {
                                        handleRead(json);
                                    }
                                }
                            } catch (e) {
                                if (attrs.onerror) {
                                    var handleError = scope[attrs.onerror];
                                    if (typeof handleError === "function") {
                                        handleError(e);
                                    }
                                }
                            }

                            // Clear input file
                            element.val('');
                        };

                        //extend FileReader
                        if (!FileReader.prototype.readAsBinaryString) {
                            FileReader.prototype.readAsBinaryString = function (fileData) {
                                var binary = "";
                                var pt = this;
                                var reader = new FileReader();
                                reader.onload = function (e) {
                                    var bytes = new Uint8Array(reader.result);
                                    var length = bytes.byteLength;
                                    for (var i = 0; i < length; i++) {
                                        binary += String.fromCharCode(bytes[i]);
                                    }
                                    //pt.result  - readonly so assign binary
                                    pt.content = binary;
                                    $(pt).trigger('onload');
                                }
                                reader.readAsArrayBuffer(fileData);
                            }

                        }
                        reader.readAsBinaryString(f);
                    }
                }

                element.on('change', handleSelect);
            }
        };
    });
    
    app.directive("datePickerDirective", function() {
        'use strict';
        
        return {
            restrict: "E",
            transclude: true,
            template:'<input type="text" class="date" use-layout="false">',
            scope: {
                option:"=",
                external:"="
            },
            link: function postLink($scope, element, attrs, controller) {
                // property
            	var target = $(element);
            	var datePicker = null;
            	var datePickerOptions = {
    				showOn : "both",
    				buttonText : "",
    				dateFormat : 'yy-mm-dd'
    			};
            	$scope.externalControl = $scope.external || {};
            	$scope.externalControl.getDate = function() {
            		return datePicker.datepicker("getDate");
            	}
            	$scope.externalControl.setDate = function(date) {
            		return datePicker.datepicker("setDate", date);
            	}
            	
            	// method
            	$scope.$watch("option", function (oldValue, newValue) {
            		if (!newValue) {
            			return;
            		}
            		
            		if (angular.equals(oldValue, newValue)) {
            			return;
            		}
            		
            		datePickerOptions = newValue;
            		target.datepicker("option", datePickerOptions);
            	});
            	
            	// function
            	function initialize() {
            		target.css("display", "inline-block");
            		target.css("position", "relative");
            		datePicker = target.find(".date").datepicker(datePickerOptions);           		
            	}
            	
            	function remove() {
            		target.off("remove", remove);
            	}
            	target.on("remove", remove);
            	
            	initialize();
            },
            controller: ["$scope", function($scope) {
                // property
            	
            	// method
            	
            	// event-handler
            	
            	// function
            }] 
        }
    });
    
    /**
     * plugin type
     */
    app.directive('checkList', function() {
	  return {
		  //restrict: 'E', 
		  scope: {
			  			list: '=checkList'
			  			,onSearch : "&"
			  			,value: '@'
		  },
		  link: function(scope, elem, attrs) {
			  		var handler = function(setup) {
			  			
						//var checked = elem.prop('checked');
			  			var checked = $('#' + attrs.id).is(":checked");
					    var index = scope.list.indexOf(scope.value);
					
						if (checked && index == -1) {
							if (setup) elem.prop('checked', false);
							else scope.list.push(scope.value);
						}else if (!checked && index != -1) {
							if (setup) elem.prop('checked', true);
						    else scope.list.splice(index, 1);
						}
			  		};
			  
			  		var setupHandler = handler.bind(null, true);
			  		var changeHandler = handler.bind(null, false);
			        
			  		elem.on('change', function() {
			  			scope.$apply(changeHandler);
			  			if(scope.onSearch) {
			  				scope.onSearch();
			  			}
			  		});
			  		scope.$watch('list', setupHandler, true);
		  	}
	  	};
	});
    
    app.directive("dtSelector", function() {
        return {
            restrict: "E",
            transclude: true,
            template:''+
	            '<div class="calendar" id="calendar">'+
	            	'<span class="hidden-input"><input type="text"></span>' +
	            	'<input type="text" class="date" value=""> '+
	        	'</div> '+
	        	'<div class="timebox"> '+
	            	'<input class="time" ng-model="hour" ng-focus="focus(\'hour\')" ng-blur="blur(hour)"  />'+
	            	'<span class="colon" >:</span>'+
	            	'<input class="time" ng-model="min" ng-focus="focus(\'min\')" ng-blur="blur(min)" />'+
	            	'<span class="colon" >:</span>'+
	            	'<input class="time" ng-model="sec" ng-focus="focus(\'sec\')" ng-blur="blur(sec)"  />'+
	        		'<button class="btn-timebox-up" ng-click="upClick()" ></button> '+
	        		'<button class="btn-timebox-down" ng-click="downClick()" ></button>'+ 
	            '</div>'
            ,
            scope: {
                ngId:"=",
                creationComplete:"&",
                dateSelect:"&"
            },
            link: function postLink($scope, element, attrs, controller) {
            	//var sDateInput = $(element).find(".date");
            	
                $(element).find(".date").datepicker(
                {
                    showOn: "both", // 이미지로 사용 button , both : 엘리먼트와 이미지 동시사용
                    buttonText: "",
                    dateFormat: 'yy-mm-dd',
                    onSelect: function (dateText, inst) {
                    	if($scope.dateSelect) {
                			$scope.dateSelect({date:dateText});
                		}
                    }
               });
                
                var sDateInput = $(element).find(".date");
                var isEnable = true;
                var isTimeEnable = true;
                var date = new Date();
                sDateInput.val(date.getFullYear() +"-"+ $scope.addZero((date.getMonth() + 1)) +"-"+ $scope.addZero(date.getDate()));
                $scope.$watch("ngId", idChange)
                
                $scope.hour = "00";
                $scope.min = "00";
                $scope.sec = "00";
                //초기화 하고 사용할 번수를 설정 ID 는 기본값을 가지고 들어오지 않고 변수만 바인딩
                function idChange(value) {
                	if(!value)
                		return;
                	value.setDate = setDate;
                	value.setTime = setTime;
                	value.getDateTime = getDateTime;
                	value.getDateInit = getDateInit;
                	value.setDateTime = setDateTime;
                	value.enable = enable;
                	value.dataLocation = dataLocation;
                	value.timeEnable = timeEnable;

                	$scope.creationComplete();
                }
                
                $scope.isTimeEnableClass = function() {
                	if(!isTimeEnable || !isEnable) {
                		return "disabled-mask";
                	}
                	else {
                		return "";
                	}
                }
                
                function dataLocation(value) {
                	if(value == 'sTime'){
                		$scope.dataLocation = value;
                		sDateInput.val(addDate("d", 7, date.getFullYear() +"-"+ $scope.addZero((date.getMonth() + 1)) +"-"+ $scope.addZero(date.getDate()), "-"));
                	}
                }
                
                function addDate(pInterval, pAddVal, pYyyymmdd, pDelimiter){
					 var yyyy;
					 var mm;
					 var dd;
					 var cDate;
					 var oDate;
					 var cYear, cMonth, cDay;
					 
					 if (pDelimiter != "") {
						 pYyyymmdd = pYyyymmdd.replace(eval("/\\" + pDelimiter + "/g"), "");
					 }
					 
					 yyyy = pYyyymmdd.substr(0, 4);
					 mm  = pYyyymmdd.substr(4, 2);
					 dd  = pYyyymmdd.substr(6, 2);
					 
					 if (pInterval == "yyyy") {
					  yyyy = (yyyy * 1) + (pAddVal * 1); 
					 } else if (pInterval == "m") {
					  mm  = (mm * 1) + (pAddVal * 1);
					 } else if (pInterval == "d") {
					  dd  = (dd * 1) - (pAddVal * 1);
					 }
					 
					 cDate = new Date(yyyy, mm - 1, dd) // 12월, 31일을 초과하는 입력값에 대해 자동으로 계산된 날짜가 만들어짐.
					 cYear = cDate.getFullYear();
					 cMonth = cDate.getMonth() + 1;
					 cDay = cDate.getDate();
					 
					 cMonth = cMonth < 10 ? "0" + cMonth : cMonth;
					 cDay = cDay < 10 ? "0" + cDay : cDay;
					 
					 if (pDelimiter != "") {
					  return cYear + pDelimiter + cMonth + pDelimiter + cDay;
					 } else {
					  return cYear + cMonth + cDay;
					 }
                }
                
                
                function enable(value) {
                	if(value == undefined)
                		return isEnable;

                	isEnable = value;
                	ap($scope);
                }
                
                function timeEnable(value) {
                	if(value == undefined)
                		return isTimeEnable;

                	isTimeEnable = value;
                }
                //YYYY-MM-DD 형식으로 입력
                function setDate(value) {
                	if(!value)
                		return;
                	var ar = value.split("-");
                	if(ar.length != 3) {
                		alert("Invalidate Date Format");
                		return ;
                	}
                	sDateInput.val(value);
                }
                
                function setTime(value) {
                	if(!value)
                		return;
                	
                	var ar = value.split(":");
                	
                	$scope.hour = ar[0];
                	$scope.min = ar[1];
                	$scope.sec = ar[2];
                }
                function setDateTime(value) {
                	if(!value)
                		return;
                	var ar = value.split(" ");
                	setDate(ar[0]);
                	setTime(ar[1]);
                }
                
                function getDateTime(){
                	return sDateInput.val() + " " + $scope.hour + ":" + $scope.min + ":" + $scope.sec;
                	//return sDateInput.val();
                }
                
                
                function getDateInit(){
                	if($scope.dataLocation == 'sTime'){
                		sDateInput.val(addDate("d", 7, date.getFullYear() +"-"+ $scope.addZero((date.getMonth() + 1)) +"-"+ $scope.addZero(date.getDate()), "-"));
                	}else{
                		sDateInput.val(date.getFullYear() +"-"+ $scope.addZero((date.getMonth() + 1)) +"-"+ $scope.addZero(date.getDate() ));
                	}
                	
                	$scope.hour = "00";
                    $scope.min = "00";
                    $scope.sec = "00";
                }
                
                // clear-memory
                function clear() {
                //    target.off("remove", clear);
                }
                //target.on("remove", clear);
            },
            controller: ['$scope', function( $scope ) {
            	var curTarget = "sec";
            	
            	$scope.focus = function(target) {
            		curTarget = target;
            	};
            	
            	$scope.blur = function(target) {
            		timeValidate();
            	};
            	
            	$scope.upClick = function(){
            		if(!curTarget )
            			curTarget = "sec";
            		
            		$scope[curTarget]++;
            		
            		timeValidate();
            	};
            	
            	$scope.downClick = function() {
            		if(!curTarget )
            			curTarget = "sec";
            		
            		$scope[curTarget]--;
            		timeValidate();
            	};
            	
            	function timeValidate() {
            		$scope.hour =  $scope.hour > 23 ? 0 : $scope.hour;
            		$scope.hour =  $scope.hour < 0 ? 23 : $scope.hour;
            		
            		$scope.min=  $scope.min > 59 ? 0 : $scope.min;
            		$scope.min =  $scope.min < 0 ? 59 : $scope.min;
            		
            		$scope.sec =  $scope.sec > 59 ? 0 : $scope.sec;
            		$scope.sec =  $scope.sec < 0 ? 59 : $scope.sec;
            		
            		$scope.hour = $scope.addZero($scope.hour) ;
            		$scope.min = $scope.addZero($scope.min);
            		$scope.sec = $scope.addZero($scope.sec);
            	}
            	
            	$scope.addZero = function( value) {
            		value = parseInt(value);
            		if(value < 10 )
            			return "0" + value;
            		else 
            			return value;
            	}
            	timeValidate();
            }]
        };
    });
    
    
    
    app.directive('fileModel', ['$parse', function ($parse) {
    	return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                var model = $parse(attrs.fileModel);
                var modelSetter = model.assign;
                
                element.bind('change', function(){
                    scope.$apply(function(){
                        modelSetter(scope, element[0].files[0]);
                    });
                });
            }
        };
    }]);
    
    /**
     * Datacenter-floor-room 정보만을 출력 하는 Tree
     */
    app.directive("datacenterTreeDirective", [ "DataService", function(DataService) {
		'use strict';

		return {
			restrict : "E",
			transclude : true,
			template : '' +
			'<div class="search-panel-area">    ' +
			'   <div class="input-srh add-btn-r1">   ' +
			'       <span class="icon-group">' +
			'           <a ng-click="" class="ico-md i-close-sm" title="Close"></a>' +
			'       </span>' +
			'       <input type="text" ng-model="searchKeyword" ng-keyup="executeFilter()">' +
			'   </div>' +
			'</div>' +
			'<div class="tree-area h-fluid1" use-layout="false">' +
			'   <div ui-grid="gridOptions" ui-grid-tree-view class="treegrid2 grid" style="width:100%; height:100%"></div>' +
			'</div>',
			scope : {
				selectRow : "&"
			},
			link : function postLink($scope, element, attrs, controller) {
				// property
				var target = $(element);

				$scope.searchKeyword = "";

				// function
				function getData() {
					DataService.httpPost("/common/getDataCenterTree.json", {}, function(result) {
						for (var i = 0; i < result.data.length; i++) {
							result.data[i].$$treeLevel = result.data[i].level;
						}

						$scope.gridOptions.data = result.data;
						console.log("GetDataCenterTree:", result);
						ap($scope);
					});
				}

				function initlaizeTree() {
					$scope.gridOptions = {
							showTreeExpandNoChildren : false,
							enableSorting : false,
							enableColumnMenus : false,
							showHeader : false,
							rowHeight : 24,
							showTreeRowHeader : false,
							columnDefs : [ {
								name : ' ',
								field : 'resourceName',
								cellTemplate : '<div class="ui-grid-cell-contents" ng-class="grid.appScope.isEnableClass()" style="padding: 0px ">' +
								' <div style="display:inline-block" class="w20"><button ng-click="grid.appScope.expandClick(row)" ng-class="grid.appScope.stateClass(row)" ng-if="grid.appScope.isChild(row) && row.entity.$$treeLevel == 0"></button></div>' +
								' <div style="display:inline-block" class="w20" ng-if="row.entity.$$treeLevel > 0 "><button ng-click="grid.appScope.expandClick(row)" ng-class="grid.appScope.stateClass(row)" ng-if="grid.appScope.isChild(row) && row.entity.$$treeLevel == 1"></button></div>' +
								' <div style="display:inline-block" class="w20" ng-if="row.entity.$$treeLevel > 1 "><button ng-click="grid.appScope.expandClick(row)" ng-class="grid.appScope.stateClass(row)" ng-if="grid.appScope.isChild(row) && row.entity.$$treeLevel == 2"></button></div>' +
								' <div style="display:inline-block" class="w20" ng-if="row.entity.$$treeLevel > 2 "><button ng-click="grid.appScope.expandClick(row)" ng-class="grid.appScope.stateClass(row)" ng-if="grid.appScope.isChild(row) && row.entity.$$treeLevel == 3"></button></div>' +
								'<label style="max-width:163px;" ng-click="grid.appScope.resourceClick(row.entity, row)" title="{{row.entity.resourceName}}" >{{row.entity.resourceName}}</label>' +
								'</div>',
								cellTooltip : function(row, col) {
									return row.entity.resourceName;
								}
							} ],
							onRegisterApi : function(gridApi) {
								$scope.gridApi = gridApi;
							}
					}
				}

				function initialize() {
					initlaizeTree();
					getData();
				}

				function remove() {
					target.off("remove", remove);
				}
				target.on("remove", remove);

				initialize();
			},
			controller : [ "$scope", function($scope) {
				// property

				// method
				$scope.isChild = function(row) {
					var entity = row.entity;
					if (entity && entity.hasOwnProperty("children") && entity.children && entity.children.length > 0) {
						return true;
					}

					return false;
				}
				
				$scope.stateClass = function(row) {
					if (row && row.hasOwnProperty("treeNode") && row.treeNode.state == "expanded") {
						return "ui-grid-icon-minus-squared";
					}

					return "ui-grid-icon-plus-squared";
				}
				
				$scope.expandClick = function(row) {
					if (row.treeNode.state == "expanded") {
						$scope.gridApi.treeBase.collapseRow(row);
					} else {
						$scope.gridApi.treeBase.expandRow(row);
					}
					$scope.gridApi.grid.refresh();
				}
				
				$scope.resourceClick = function(data) {
					if (!$scope.selectRow) {
						return;
					}

					$scope.selectRow({
						"value" : data
					});
				}

				// event-handler

				// function
			} ]
		}
	}
    
    ]);
});