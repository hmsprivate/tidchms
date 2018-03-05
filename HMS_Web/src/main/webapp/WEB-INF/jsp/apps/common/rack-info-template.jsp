<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags"%>
<%@ page pageEncoding="UTF-8" contentType="text/html; charset=UTF-8"%>

<link rel="stylesheet" href="<c:url value='/css/rack-diagram.css'/>">

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
            <div class="btn-tool-group">
                <button type="button" class="btn-tool-view" title="상면도로 보기" ng-click="changeViewMode('status');" ng-class="viewMode =='status' ? 'on':''"></button>
                <button type="button" class="btn-tool-list" title="리스트로 보기" ng-click="changeViewMode('grid');" ng-class="viewMode =='grid' ? 'on':''"></button>
            </div>
        </div>
        <!-- //상면도 탭 영역 -->
        <!-- rack-total-area -->
        <div class="rack-total-area h-fluid12" ng-show="viewMode =='grid'">
            <div class="grid-area" style="height:calc(100% - 47px)">
                <div ui-grid="gridOptions_hardware" class="grid" style="width:100%; height:calc(100% - 0px)"></div>
            </div>
        </div>
        <div class="rack-total-area h-fluid12" ng-show="viewMode =='status'"><!-- @@@ 높이  top-tab-area 이 없을 경우 h-fluid12 삭제 -->
            <!-- left : rack-case-area -->
            <div class="rack-case-area">
                <div class="rack-case">
                    <rack-diagram-directive
                            class="rack-diagram"
                            height="100%"
                            width="100%"
                            data="rackDrawModelData"
                            add-rack-complete="addRackComplete(rack)"
                            add-node-complete="addNodeComplete(node)"
                            update-rack-complete="updateRackComplete(rack)"
                            update-node-complete="updateNodeComplete(rack)"
                            select-rack="selectRack(rack)"
                            select-node="selectNode(node)"
                            external="rackDiagramControl">
                    </rack-diagram-directive>
                </div>
                <div class="rack-case-bottom"></div>
            </div>
            <!-- //left : rack-case-area -->

            <!-- 그리드 영역 -->
            <%--<div class="top-view-area h-fluid1" ng-show="viewMode =='grid'" style="float:left; width: 570px; height: 100%">--%>
                <%--<div class="grid-area" style="height:calc(100% - 47px)">--%>
                    <%--<div ui-grid="gridOptions_hardware" class="grid" style="width:570px; height:calc(100% - 0px)"></div>--%>
                <%--</div>--%>
            <%--</div>--%>

            <!-- right : rack-info-area -->
            <div class="rack-info-area scroll-y">
                <div class="header-box">
                    <h4 class="title2">Rack 정보</h4>
                    <div class="hd-right">
                        <button type="button" class="btn-cr">Hardware 관리</button>
                    </div>
                </div>
                <div class="row gap10">
                    <div class="col-3">
                        <div class="chart-area2">
                            <div class="chart-box">
                                <img src="../images/common/@test-chart-rack4.png" alt="테스트이미지">
                            </div>
                        </div>
                    </div>
                    <div class="col-9">
                        <!-- data-tbl -->
                        <div class="data-tbl border-type">
                            <table>
                                <colgroup>
                                    <col style="width:18%">
                                    <col style="width:auto">
                                    <col style="width:18%">
                                    <col style="width:auto">
                                </colgroup>
                                <tbody>
                                <tr>
                                    <th>Rack크기</th>
                                    <td class="inner">0 * 0</td>
                                    <th>전체Unit</th>
                                    <td class="inner"> unit</td>
                                </tr>
                                <tr>
                                    <th>연결된 분전 반</th>
                                    <td class="inner">연결된 분전 반</td>
                                    <th>전력 양</th>
                                    <td class="inner">0W</td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                        <!-- //data-tbl -->
                        <!-- data-tbl -->
                        <div class="data-tbl border-type mt12">
                            <table>
                                <colgroup>
                                    <col style="width:18%">
                                    <col style="width:auto">
                                    <col style="width:18%">
                                    <col style="width:auto">
                                </colgroup>
                                <tbody>
                                <tr>
                                    <th>가용</th>
                                    <td class="inner"> Unit</td>
                                    <th>사용불가</th>
                                    <td class="inner"> Unit</td>
                                </tr>
                                <tr>
                                    <th>사용중</th>
                                    <td class="inner"> Unit</td>
                                    <th>예약</th>
                                    <td class="inner"> Unit</td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                        <!-- //data-tbl -->
                    </div>
                </div>

                <!-- Rack 정보 영역 -->
                <div ng-show="selectedType == 'RACK'">
                    <div class="header-box mt12"><h4 class="title2">기본 정보</h4></div>

                    <div class="data-tbl border-type mt12">
                        <table>
                            <colgroup>
                                <col style="width:18%">
                                <col style="width:auto">
                                <col style="width:18%">
                                <col style="width:auto">
                            </colgroup>
                            <tbody>
                            <tr>
                                <th>UUID</th>
                                <td class="inner">{{rackInfoData.assetNumber}}</td>
                                <th>H/W Type</th>
                                <td class="inner">RACK</td>
                            </tr>
                            <tr>
                                <th>제조사</th>
                                <td class="inner">{{rackInfoData.vendor}}</td>
                                <th>모델명</th>
                                <td class="inner">{{rackInfoData.modelNo}}</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>

                    <div class="header-box mt12"><h4 class="title2">유지보수 정보</h4></div>

                    <div class="data-tbl border-type mt12">
                        <table>
                            <colgroup>
                                <col style="width:18%">
                                <col style="width:auto">
                                <col style="width:18%">
                                <col style="width:auto">
                            </colgroup>
                            <tbody>
                            <tr>
                                <th>업체명</th>
                                <td class="inner">{{rackInfoData.maintenanceCompanyName}}</td>
                                <th>입고일</th>
                                <td class="inner">{{rackInfoData.stockEquipmentComeAt}}</td>
                            </tr>
                            <tr>
                                <th>유지보수 시작일</th>
                                <td class="inner">{{rackInfoData.maintenanceStartAt}}</td>
                                <th>유지보수 종료일</th>
                                <td class="inner">{{rackInfoData.maintenanceEndAt}}</td>
                            </tr>
                            <tr>
                                <th>폐기 예정일</th>
                                <td class="inner">{{rackInfoData.disposeAt}}</td>
                                <th>메모</th>
                                <td class="inner"></td>
                            </tr>
                            </tbody>
                        </table>
                    </div>

                    <div class="header-box mt12"><h4 class="title2">담당자 정보</h4></div>

                    <div class="data-tbl border-type mt12">
                        <table>
                            <colgroup>
                                <col style="width:18%">
                                <col style="width:auto">
                                <col style="width:18%">
                                <col style="width:auto">
                            </colgroup>
                            <tbody ng-repeat="staff in rackInfoData.hardwareStaffModel track by $index">
                            <tr>
                                <th>ID</th>
                                <td class="inner">{{staff.signId}}</td>
                                <th>이름</th>
                                <td class="inner">{{staff.realName}}</td>
                            </tr>
                            <tr>
                                <th>부서</th>
                                <td class="inner">{{staff.department}}</td>
                                <th>역할</th>
                                <td class="inner">{{staff.roleId}}</td>
                            </tr>
                            <tr>
                                <th>연락처</th>
                                <td class="inner">{{staff.phone}}</td>
                                <th>E-Mail</th>
                                <td class="inner">{{staff.email}}</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>

                    <!-- grid-scroll-area -->
                    <%--<div class="grid-scroll-area">--%>
                        <%--<!-- grid-tbl-top -->--%>
                        <%--<div class="grid-tbl-top">--%>
                            <%--<table>--%>
                                <%--<colgroup>--%>
                                    <%--<col style="width:12%">--%>
                                    <%--<col style="width:14%">--%>
                                    <%--<col style="width:20%">--%>
                                    <%--<col style="width:20%">--%>
                                    <%--<col style="width:auto">--%>
                                <%--</colgroup>--%>
                                <%--<thead>--%>
                                <%--<tr>--%>
                                    <%--<th scope="col">항목 확인요청</th>--%>
                                    <%--<th scope="col">항목 확인요청</th>--%>
                                    <%--<th scope="col">항목 확인요청</th>--%>
                                    <%--<th scope="col">항목 확인요청</th>--%>
                                    <%--<th scope="col">항목 확인요청</th>--%>
                                <%--</tr>--%>
                                <%--</thead>--%>
                            <%--</table>--%>
                        <%--</div>--%>
                        <%--<!-- //grid-tbl-top -->--%>
                        <%--<!-- grid-tbl-body -->--%>
                        <%--<div class="grid-tbl-body max-h100">--%>
                            <%--<table>--%>
                                <%--<colgroup>--%>
                                    <%--<col style="width:12%">--%>
                                    <%--<col style="width:14%">--%>
                                    <%--<col style="width:20%">--%>
                                    <%--<col style="width:20%">--%>
                                    <%--<col style="width:auto">--%>
                                <%--</colgroup>--%>
                                <%--<tbody>--%>
                                <%--<tr>--%>
                                    <%--<td>검토중</td>--%>
                                    <%--<td>T상면매니저</td>--%>
                                    <%--<td>2017-05-19 00:00:00</td>--%>
                                    <%--<td>2017-05-19 17:00:00</td>--%>
                                    <%--<td class="txt-l">수정후 재요청</td>--%>
                                <%--</tr>--%>
                                <%--<tr>--%>
                                    <%--<td>완료(반려)</td>--%>
                                    <%--<td>T상면매니저</td>--%>
                                    <%--<td>2017-05-19 00:00:00</td>--%>
                                    <%--<td>2017-05-19 17:00:00</td>--%>
                                    <%--<td class="txt-l">수정후 재요청</td>--%>
                                <%--</tr>--%>
                                <%--<tr>--%>
                                    <%--<td>완료(승인)</td>--%>
                                    <%--<td>T상면매니저</td>--%>
                                    <%--<td>2017-05-19 00:00:00</td>--%>
                                    <%--<td>2017-05-19 17:00:00</td>--%>
                                    <%--<td class="txt-l">수정후 재요청</td>--%>
                                <%--</tr>--%>
                                <%--<tr>--%>
                                    <%--<td>검토중</td>--%>
                                    <%--<td>T상면매니저</td>--%>
                                    <%--<td>2017-05-19 00:00:00</td>--%>
                                    <%--<td>2017-05-19 17:00:00</td>--%>
                                    <%--<td class="txt-l"></td>--%>
                                <%--</tr>--%>
                                <%--<tr>--%>
                                    <%--<td>검토중</td>--%>
                                    <%--<td>T상면매니저</td>--%>
                                    <%--<td>2017-05-19 00:00:00</td>--%>
                                    <%--<td>2017-05-19 17:00:00</td>--%>
                                    <%--<td class="txt-l"></td>--%>
                                <%--</tr>--%>
                                <%--<tr>--%>
                                    <%--<td>검토중</td>--%>
                                    <%--<td>T상면매니저</td>--%>
                                    <%--<td>2017-05-19 00:00:00</td>--%>
                                    <%--<td>2017-05-19 17:00:00</td>--%>
                                    <%--<td class="txt-l"></td>--%>
                                <%--</tr>--%>
                                <%--<tr>--%>
                                    <%--<td>END</td>--%>
                                    <%--<td>T상면매니저</td>--%>
                                    <%--<td>2017-05-19 00:00:00</td>--%>
                                    <%--<td>2017-05-19 17:00:00</td>--%>
                                    <%--<td class="txt-l"></td>--%>
                                <%--</tr>--%>
                                <%--</tbody>--%>
                            <%--</table>--%>
                        <%--</div>--%>
                        <%--<!-- //grid-tbl-body -->--%>
                    <%--</div>--%>
                </div>
                <!-- Rack 정보 영역 끝 -->

                <!-- HW 정보 영역 -->
                <div ng-show="selectedType == 'HW' && hwInfoData.hwType=='001'">          <!-- node-bm-server -->
                    <div class="header-box mt12"><h4 class="title2">사용 정보</h4></div>

                    <div class="data-tbl border-type mt12">
                        <table>
                            <colgroup>
                                <col style="width:18%">
                                <col style="width:auto">
                                <col style="width:18%">
                                <col style="width:auto">
                            </colgroup>
                            <tbody>
                            <tr>
                                <th>Server 높이</th>
                                <td class="inner">{{hwInfoData.vertical}}</td>
                                <th>DC 명</th>
                                <td class="inner">{{rackInfoData.datacenterName}}</td>
                            </tr>
                            <tr>
                                <th>위치정보</th>
                                <td class="inner">{{rackInfoData.floorName}} {{rackInfoData.roomName}}</td>
                                <th>Rack 명</th>
                                <td class="inner">{{rackInfoData.rackName}}</td>
                            </tr>
                            <tr>
                                <th>홀번호</th>
                                <td class="inner">{{hwInfoData.holeNo}}</td>
                                <th>BM Server 명</th>
                                <td class="inner"></td>
                            </tr>
                            <tr>
                                <th>전원타입</th>
                                <td class="inner"></td>
                                <th>상태</th>
                                <td class="inner"></td>
                            </tr>
                            </tbody>
                        </table>
                    </div>

                    <div class="header-box mt12"><h4 class="title2">기본 정보</h4></div>

                    <div class="data-tbl border-type mt12">
                        <table>
                            <colgroup>
                                <col style="width:18%">
                                <col style="width:auto">
                                <col style="width:18%">
                                <col style="width:auto">
                            </colgroup>
                            <tbody>
                            <tr>
                                <th>UUID</th>
                                <td class="inner"></td>
                                <th>H/W Type</th>
                                <td class="inner"></td>
                            </tr>
                            <tr>
                                <th>ERP 번호</th>
                                <td class="inner"></td>
                                <th>제조사</th>
                                <td class="inner"></td>
                            </tr>
                            <tr>
                                <th>모델명</th>
                                <td class="inner"></td>
                                <th>Serial 번호</th>
                                <td class="inner"></td>
                            </tr>
                            <tr>
                                <th>서비스군</th>
                                <td class="inner"></td>
                                <th>서비스명</th>
                                <td class="inner"></td>
                            </tr>
                            </tbody>
                        </table>
                    </div>



                    <div class="header-box mt12"><h4 class="title2">구성 정보</h4></div>

                    <div class="data-tbl border-type mt12">
                        <table>
                            <colgroup>
                                <col style="width:18%">
                                <col style="width:auto">
                                <col style="width:18%">
                                <col style="width:auto">
                            </colgroup>
                            <tbody>
                            <tr>
                                <th>Host Name</th>
                                <td class="inner"></td>
                                <th>Server BIOS명</th>
                                <td class="inner"></td>
                            </tr>
                            <tr>
                                <th>Server Firmware 버전</th>
                                <td class="inner"></td>
                                <th>Hypervisor 여부</th>
                                <td class="inner"></td>
                            </tr>
                            <tr>
                                <th>Hypervisor 명</th>
                                <td class="inner"></td>
                                <th>Hypervisor 버전</th>
                                <td class="inner"></td>
                            </tr>
                            <tr>
                                <th>서비스군</th>
                                <td class="inner"></td>
                                <th>서비스명</th>
                                <td class="inner"></td>
                            </tr>
                            </tbody>
                        </table>
                    </div>

                    <div class="grid-scroll-area">
                        <!-- grid-tbl-top -->
                        <div class="grid-tbl-top">
                            <table>
                                <colgroup>
                                    <col style="width:12%">
                                    <col style="width:14%">
                                    <col style="width:20%">
                                    <col style="width:20%">
                                    <col style="width:auto">
                                </colgroup>
                                <thead>
                                <tr>
                                    <th scope="col">CPU 제조사</th>
                                    <th scope="col">CPU 모델명</th>
                                    <th scope="col">CPU 프로세서 수</th>
                                    <th scope="col">프로세서 당 코어 수</th>
                                    <th scope="col">클럭</th>
                                </tr>
                                </thead>
                            </table>
                        </div>
                    </div>


                </div>
                <!-- HW 정보 영역 끝-->
                <!-- //grid-scroll-area -->
            </div>
            <!-- //right : rack-info-area -->
        </div>
        <!-- rack-total-area -->

    </div>

    <equip-management-directive
            target-type = "selectedType"
            target-id = "selectedRackId"
            show-flag="showConfigManagementFlag"
            diagram-pass-model="rackDrawModelData"
            rack-external="rackDiagramControl"
            added-item="addedHW"
            removed-item="removedHW"
    ></equip-management-directive>
</div>
