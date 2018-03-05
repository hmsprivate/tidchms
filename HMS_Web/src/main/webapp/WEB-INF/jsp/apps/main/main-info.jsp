<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags"%>
<%@ page pageEncoding="UTF-8" contentType="text/html; charset=UTF-8"%>

<div id="content" class="main" ng-controller="MainCtrl as mainCtrl">
	<!-- content -->		
	<!-- 현황판 -->
	<div class="status-board">
		<div class="panel-wrap">
			<div class="panel-header">
				<h3 class="title"><i class="ico-md i-tasks"></i>Node Count</h3>
			</div>
			<div class="panel-content">
				<ul class="status-list fl-col3">
					<li>
						<span>{{"GROUP.TOTAL" | translate}} (HMS / CMDB)</span>
						<strong class="txt-point">{{mainCtrl.dashBoardStatus.agentHms}} / {{mainCtrl.dashBoardStatus.agentCmdb}}</strong>
					</li>
					<li>
						<span>{{"GROUP.PM" | translate}}</span>
						<strong>{{mainCtrl.dashBoardStatus.serverPm}}</strong>
					</li>
					<li>
						<span>{{"GROUP.VM" | translate}}</span>
						<strong>{{mainCtrl.dashBoardStatus.serverVm}}</strong>
					</li>
				</ul>
			</div>
		</div>
		<div class="panel-wrap">
			<div class="panel-header">
				<h3 class="title"><i class="ico-md i-desktop"></i>Agent Status</h3>
			</div>
			<div class="panel-content">							
				<ul class="status-list fl-col2">
					<li>
						<span>Normal</span>
						<a href="hms#/agent-status-info"><strong class="txt-point">{{mainCtrl.dashBoardStatus.agentNormal}}</strong></a>
					</li>
					<li>
						<span>Abnormal</span>
						<a href="hms#/agent-status-info"><strong class="txt-point">{{mainCtrl.dashBoardStatus.agentAbnormal}}</strong></a>
					</li>
				</ul>
			</div>
		</div>
		<div class="panel-wrap">
			<div class="panel-header">
				<h3 class="title"><i class="ico-md i-upload"></i>{{"GROUP.LAST_UPDATE" | translate}}</h3>
			</div>
			<div class="panel-content">
				<div class="status-list time">
					<strong>{{mainCtrl.dashBoardStatus.lastUpDay}}</strong>
					<strong>{{mainCtrl.dashBoardStatus.lastUpTime}}</strong>
				</div>
			</div>
		</div>
		<div class="panel-wrap">
			<div class="panel-header">
				<h3 class="title"><i class="ico-md i-random"></i>Change Status</h3>
			</div>
			<div class="panel-content">
				<ul class="status-list fl-col2">
					<li>
						<span>{{"GROUP.TOTAL" | translate}}</span>
						<a href="hms#/change-mgmt-info"><strong class="txt-point">{{mainCtrl.dashBoardStatus.changeTotal}}</strong></a>
					</li>
					<li>
						<span>Changes</span>
						<a href="hms#/change-mgmt-info"><strong style="color: #999">{{mainCtrl.dashBoardStatus.changeChange}}</strong></a>
					</li>
				</ul>
			</div>
		</div>
	</div>
	<!-- //현황판 -->

	<!-- 검색 + Grid -->
	<div class="cont-wrap">
		<!-- data-tbl -->
		<div class="search-group-area">
			<!-- <table>
				<tbody>
				<tr>
					<th>{{"GROUP.HOST_NAME" | translate}}</th>
					<td>
						<input type="text" class="w155" ng-model="mainCtrl.filter.hostName" ng-keyup="$event.keyCode == 13 ? mainCtrl.onSearch() : null">
					</td>
					<th>{{"GROUP.SERIAL_NUMBER" | translate}}</th>
					<td>
						<input type="text" class="w155" ng-model="mainCtrl.filter.serialNumber" ng-keyup="$event.keyCode == 13 ? mainCtrl.onSearch() : null">
					</td>
					<th>{{ "GROUP.TYPE" | translate }}</th>
					<td>
						<select class="selectbox w84" ng-model="mainCtrl.filter.nodeType">
							<option ng-repeat="option in mainCtrl.searchServerTypeModel" value="{{option.value}}">{{option.label}}</option>
						</select>
					</td>
					<th>{{"GROUP.IP" | translate}}</th>
					<td>
						<input type="text" class="w145" ng-model="mainCtrl.filter.ip" ng-keyup="$event.keyCode == 13 ? mainCtrl.onSearch() : null">
					</td>
					<th>{{"GROUP.OS" | translate}} {{"COMMON.NAME" | translate}}</th>
					<td>
						<input type="text" class="w145" ng-model="mainCtrl.filter.osName" ng-keyup="$event.keyCode == 13 ? mainCtrl.onSearch() : null">
					</td>
					<th>{{"GROUP.MANUFACTURER" | translate}}</th>
					<td>
						<input type="text" class="w145" ng-model="mainCtrl.filter.manufacture" ng-keyup="$event.keyCode == 13 ? mainCtrl.onSearch() : null">
						<button type="button" class="btn-cr i-search ml05" ng-click="mainCtrl.onSearch()">{{ "COMMON.SEARCH" | translate }}</button>
						<button type="button" class="btn-cr i-refresh" ng-click="mainCtrl.onNodeSearchInit()">{{ "COMMON.RESET" | translate }}</button>
					</td>
				</tr>
				</tbody>
			</table> -->
			<search-pop-directive
				condition-type-list="typeList"
				popup-type="left"
				search-call-back="getSearchCondition(searchParam)" >
			</search-pop-directive> 
		</div>
		<!-- //data-tbl -->
	
	
		<!-- tab-cont-group -->
		<div class="tab-cont-group">
			<ul class="tab-menu">
				<!-- select-group은 선택한 group코드값으로 노드 정보 조회 -->
				<li ng-repeat="group in mainCtrl.groupList" ng-click="mainCtrl.getNodeList(group.agreementSeq)" 
					ng-class="{'tab-selected-class-name' : group.agreementSeq == selectedSeq}" style="border-top-width: 0px;">
					<span title={{group.agreementName}}><a href="">{{group.agreementName}}</a></span>
				</li>
			</ul>
		
			<div class="tab-cont">
				<div class="grid-area hcalc06" ui-grid="mainCtrl.gridOptions"></div>
				<!-- pagination-area-total -->
				<div class="pagination-area-total" style="padding: 3px;">
					<div class="node-total">
						{{"GROUP.TOTAL" | translate}} :<strong>{{mainCtrl.totalPage}}</strong>
					</div>
					<pagination-directive 
						total-items="mainCtrl.totalPage" 
						items-per-page="mainCtrl.itemsPerPage"
						max-size="mainCtrl.maxSize"
						ng-model="mainCtrl.currentPage"
						rotate="false" 
						class="pagination" 
						boundary-links="true" 
						ng-change="mainCtrl.selectPage()">
					</pagination-directive>
				</div>
				<!-- //pagination-area-total -->
			</div>
		</div>
		<!-- //tab-cont-group -->
	
	</div>
</div>