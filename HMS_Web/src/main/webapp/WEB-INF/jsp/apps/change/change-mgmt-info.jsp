<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags"%>
<%@ page pageEncoding="UTF-8" contentType="text/html; charset=UTF-8"%>

<div id="content" ng-controller="ChangeMgmtCtrl as changeMgmtCtrl">
	<!-- panel-wrap -->
	<div class="panel-wrap">
		<div class="panel-header">
			<h3 class="title">Change Management List</h3>
			<div class="hd-right">
				<button type="button" class="btn-cr btn-sm" ng-click="changeMgmtCtrl.update()">Update</button>
			</div>
		</div>
		<div class="panel-content">
			<!-- data-tbl -->
			<div class="search-group-area round-border-type">
				<!-- <table>
					<tbody>
					<tr>
						<th>Group</th>
						<td>
							<select class="selectbox w84" ng-model="changeMgmtCtrl.filter.agreementSeq">
								<option ng-repeat="option in changeMgmtCtrl.searchGroupModel" value="{{option.agreementSeq}}">{{option.agreementName}}</option>
							</select>
						</td>
						<th>{{"GROUP.HOST_NAME" | translate}}</th>
						<td>
							<input type="text" class="w155" ng-model="changeMgmtCtrl.filter.hostName" ng-keyup="$event.keyCode == 13 ? changeMgmtCtrl.onSearch() : null">
						</td>
						<th>{{"GROUP.SERIAL_NUMBER" | translate}}</th>
						<td>
							<input type="text" class="w155" ng-model="changeMgmtCtrl.filter.serialNumber" ng-keyup="$event.keyCode == 13 ? changeMgmtCtrl.onSearch() : null">
						</td>
						<th>{{ "GROUP.TYPE" | translate }}</th>
						<td>
							<select class="selectbox w84" ng-model="changeMgmtCtrl.filter.nodeType">
								<option ng-repeat="option in changeMgmtCtrl.searchServerTypeModel" value="{{option.value}}">{{option.label}}</option>
							</select>
						</td>
						<th>{{"GROUP.IP" | translate}}</th>
						<td>
							<input type="text" class="w145" ng-model="changeMgmtCtrl.filter.ip" ng-keyup="$event.keyCode == 13 ? changeMgmtCtrl.onSearch() : null">
						</td>
						<th>{{"GROUP.OS" | translate}} {{"COMMON.NAME" | translate}}</th>
						<td>
							<input type="text" class="w145" ng-model="changeMgmtCtrl.filter.osName" ng-keyup="$event.keyCode == 13 ? changeMgmtCtrl.onSearch() : null">
						</td>
						<th>{{"GROUP.MANUFACTURER" | translate}}</th>
						<td>
							<input type="text" class="w145" ng-model="changeMgmtCtrl.filter.manufacture" ng-keyup="$event.keyCode == 13 ? changeMgmtCtrl.onSearch() : null">
							<button type="button" class="btn-cr i-search ml05" ng-click="changeMgmtCtrl.onSearch()">{{ "COMMON.SEARCH" | translate }}</button>
							<button type="button" class="btn-cr i-refresh" ng-click="changeMgmtCtrl.onSearchInit()">{{ "COMMON.RESET" | translate }}</button>
						</td>
					</tr>
					</tbody>
				</table> -->
				<search-pop-directive
					condition-type-list="typeList"
					popup-type="left"
					search-call-back="getSearchCondition(searchParam)" 
					>
				</search-pop-directive>
			</div>
			<!-- //data-tbl -->
			
			<div class="grid-area mt10 hcalc03" ui-grid="changeMgmtCtrl.gridOptions" ></div>
			
			<!-- pagination-area-total -->
			<div class="pagination-area-total" style="padding: 10px;">
				<pagination-directive 
					total-items="changeMgmtCtrl.totalPage" 
					items-per-page="changeMgmtCtrl.itemsPerPage"
					max-size="changeMgmtCtrl.maxSize"
					ng-model="changeMgmtCtrl.currentPage"
					rotate="false" 
					class="pagination" 
					boundary-links="true" 
					ng-change="changeMgmtCtrl.selectPage()">
				</pagination-directive>
			</div>
		</div>
	</div>
	<!-- //panel-wrap -->
</div>