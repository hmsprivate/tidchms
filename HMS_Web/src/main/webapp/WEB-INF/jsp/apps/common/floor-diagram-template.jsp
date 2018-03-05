<%@ page contentType="text/html;charset=UTF-8" language="java" %>

<div class="panel-wrap3" style="left:420px;width:calc(100% - 430px);">
    <panel-header-directive
            title-data="headerData"
            use-config-btn="showConfigBtn"
            use-add-on-btn="showAddOnBtn"
            click-config-btn="clickConfigBtn($event)">
    </panel-header-directive>
    <div class="panel-content">
        <!-- 상면도 탭 영역 -->
        <div class="top-tab-area">
            <div class="btn-tool-group" ng-show="showChangeModeBtn">
                <button type="button" ng-click="changeViewMode('status');" class="btn-tool-view" ng-class="viewMode =='status' ? 'on':''" title="상면도로 보기"></button>
                <button type="button" ng-click="changeViewMode('grid');" class="btn-tool-list" ng-class="viewMode =='grid' ? 'on':''" title="리스트로 보기"></button>
            </div>
            <ul class="tab-menu3 in-block" ng-show="showRoomList == true">
                <li ng-repeat="room in roomList track by $index" ng-class="room.resourceSeq == selectedRoomId ? 'on':''" ng-click="drawDiagramByRoomId(room.resourceSeq)"><a href="javascript:;">{{room.resourceName}}</a></li>
            </ul>
        </div>
        <!-- //상면도 탭 영역 -->
        <!-- top-view-area 상면도 영역 -->
        <div class="top-view-area h-fluid1" ng-show="viewMode =='status'">
            <raised-floor-diagram-directive
                    data="raisedFloorModel"
                    unspecified-list-area="unspecifiedListArea"
                    add-complete="addCompleteEventHandler(data)"
                    move-complete="moveCompleteEventHandler(data)"
                    click-node="selectEquipEventHandler(data)"
                    dblclick-node="passToRackEventHandler(data)"
                    save-data-fn="setSaveDataFn(saveDataFn)"
                    get-save-data="getSaveData(data)"
                    editable="editableDiagramArea"
                    drop-from-diagram="removeEquipEventHandler(id)"
                    refresh-fn="setRefreshFn(refreshFn)">
            </raised-floor-diagram-directive>
            <div id="canvas" style="width: 100%; height: 100%; margin: auto;"></div>
            <div class="top-view-mover"id="overview" style="border : 1px solid #38383d;"></div>
        </div>
        <!-- //top-view-area 상면도 영역 -->


        <!-- 그리드 영역 -->
        <div class="top-view-area h-fluid1" ng-show="viewMode =='grid'">
            <ul class="tab-menu">
                <li ng-repeat="tab in gridTabList track by $index" ng-click="changeGridView(tab)" ng-class="gridViewType == tab ? 'on' : ''"><a>{{tab}}</a></li>
            </ul>
            <div class="grid-area" style="height:calc(100% - 47px)">
                <div ui-grid="gridOptions_floor" ng-show="gridViewType == 'FLOOR'" class="grid" style="width:100%; height:calc(100% - 0px)"></div>
                <div ui-grid="gridOptions_room" ng-show="gridViewType == 'ROOM'" class="grid" style="width:100%; height:calc(100% - 0px)"></div>
                <div ui-grid="gridOptions_rack" ng-show="gridViewType == 'RACK'" class="grid" style="width:100%; height:calc(100% - 0px)"></div>
                <div ui-grid="gridOptions_hardware" ng-show="gridViewType == 'HARDWARE'" class="grid" style="width:100%; height:calc(100% - 0px)"></div>

            </div>
        </div>

        <!-- tooltip Rack -->
        <div id="rackTooltip" class="tooltip opacity tail-bottom w390" ng-style="positionRackTooltip" ng-show="showRackTooltip == true"><!-- style은 예시위치입니다. -->
            <div class="in-box2">
                <strong class="info-title">{{rackTooltip.rackId}}</strong>
                <button type="button" class="btn-close" title="close" ng-click="showRackTooltip = false"></button>
                <!-- grid-tbl -->
                <div class="grid-tbl td-center mt05">
                    <table>
                        <colgroup>
                            <col style="width:auto">
                            <col style="width:60px" span="5">
                        </colgroup>
                        <thead>
                        <tr>
                            <th scope="col">전체 Unit</th>
                            <th scope="col">가용</th>
                            <th scope="col">사용중</th>
                            <th scope="col">예약</th>
                            <th scope="col">사용불가</th>
                            <th scope="col">전력</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>{{rackTooltip.totalUnitCnt}}Unit</td>
                            <td> Unit</td>
                            <td> Unit</td>
                            <td> Unit</td>
                            <td> Unit</td>
                            <td> Kw</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                <!-- //grid-tbl -->
            </div>
        </div>
        <!-- //tooltip Rack -->



    </div>

    <!-- 장비 설정 -->
    <equip-management-directive
            target-type = "room"
            show-flag="showConfigManagementFlag"
            save-diagram-status="saveDataFn()"
            diagram-json="jsonDiagramData"
            diagram-pass-model="raisedFloorModel"
            <%--diagram-info="saveDiagramInfo"--%>
            added-item="addedEquip"
            removed-item="removedEquip"
    ></equip-management-directive>
</div>
