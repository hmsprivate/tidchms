<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags"%>
<%@ page pageEncoding="UTF-8" contentType="text/html; charset=UTF-8"%>

<div id="content" ng-controller="ChangeHoldCtrl as changeHoldCtrl">
	<!-- panel-wrap -->
	<div class="panel-wrap">
		<div class="panel-header">
			<h3 class="title">Change hold list</h3>
			<div class="hd-right">
				<ul class="status-list-sm">
					<li>								
						<span>Total</span><strong>1000</strong>
					</li>
					<li>
						<span>Change</span><strong>0000</strong>
					</li>
					<li>
						<span>Hold</span><strong>0000</strong>
					</li>
					<li>
						<span>Cancel</span><strong>0000</strong>
					</li>
				</ul>
			</div>
		</div>
		<div class="panel-content">
			<!-- data-tbl -->
			<div class="data-tbl wide round-border-type th-right">
				<table>
					<tbody>
					<tr>
						<th>{{"GROUP.HOST_NAME" | translate}}</th>
						<td>
							<input type="text" class="w140" ng-model="changeHoldCtrl.filter.hostName" ng-keyup="$event.keyCode == 13 ? changeHoldCtrl.onNodeSearch() : null">
						</td>
						<th>{{"GROUP.SERIAL_NUMBER" | translate}}</th>
						<td>
							<input type="text" class="w140" ng-model="changeHoldCtrl.filter.serialNumber" ng-keyup="$event.keyCode == 13 ? changeHoldCtrl.onNodeSearch() : null">
						</td>
						<th>{{ "GROUP.TYPE" | translate }}</th>
						<td>
							<select class="selectbox w84" ng-model="changeHoldCtrl.filter.nodeType">
								<option ng-repeat="option in changeHoldCtrl.searchServerTypeModel" value="{{option.value}}">{{option.label}}</option>
							</select>
						</td>
						<th>{{"GROUP.IP" | translate}}</th>
						<td>
							<input type="text" class="w145" ng-model="changeHoldCtrl.filter.ip" ng-keyup="$event.keyCode == 13 ? changeHoldCtrl.onNodeSearch() : null">
						</td>
						<th>{{"GROUP.OS" | translate}} {{"COMMON.NAME" | translate}}</th>
						<td>
							<input type="text" class="w145" ng-model="changeHoldCtrl.filter.osName" ng-keyup="$event.keyCode == 13 ? changeHoldCtrl.onNodeSearch() : null">
						</td>
						<th>{{"GROUP.MANUFACTURER" | translate}}</th>
						<td>
							<input type="text" class="w145" ng-model="changeHoldCtrl.filter.manufacture" ng-keyup="$event.keyCode == 13 ? changeHoldCtrl.onNodeSearch() : null">
							<button type="button" class="btn-cr i-search ml05" ng-click="changeHoldCtrl.onNodeSearch()">{{ "COMMON.SEARCH" | translate }}</button>
							<button type="button" class="btn-cr i-refresh" ng-click="changeHoldCtrl.onNodeSearchInit()">{{ "COMMON.RESET" | translate }}</button>
						</td>
					</tr>
					</tbody>
				</table>
			</div>
			<!-- //data-tbl -->
			
			<div class="grid-area mt10 hcalc03" ui-grid="changeHoldCtrl.gridOptions" ></div>
			
			<!-- pagination-area-total -->
			<div class="pagination-area-total" style="padding: 10px;">
				<div class="btns-area-control left">
					<button type="button" class="btn-cr">Change all</button>
					<button type="button" class="btn-gy">Cancel all</button>
				</div>
				<div class="btns-area-control right">
					<button type="button" class="btn-cr" ng-click="changeHoldCtrl.onCompareInfo()">Compare all</button>
				</div>
			
				<pagination-directive 
					total-items="changeHoldCtrl.totalPage" 
					items-per-page="changeHoldCtrl.itemsPerPage"
					max-size="changeHoldCtrl.maxSize"
					ng-model="changeHoldCtrl.currentPage"
					rotate="false" 
					class="pagination" 
					boundary-links="true" 
					ng-change="changeHoldCtrl.selectPage()">
				</pagination-directive>
			</div>
		</div>
	</div>
	<!-- //panel-wrap -->
</div>