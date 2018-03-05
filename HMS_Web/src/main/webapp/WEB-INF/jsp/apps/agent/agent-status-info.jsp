<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags"%>
<%@ page pageEncoding="UTF-8" contentType="text/html; charset=UTF-8"%>

<div id="content" ng-controller="AgentStatusCtrl as agentStatusCtrl">
	<!-- panel-wrap -->
	<div class="panel-wrap">
		<div class="panel-header">
			<h3 class="title">Agent status List</h3>
			<div class="hd-right">
				<button type="button" class="btn-cr btn-sm" ng-click="agentStatusCtrl.update()">Update</button>
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
							<select class="selectbox w84" ng-model="agentStatusCtrl.filter.agreementSeq">
								<option ng-repeat="option in agentStatusCtrl.searchAgentGroupModel" value="{{option.agreementSeq}}">{{option.agreementName}}</option>
							</select>
						</td>
						<th>Host Name</th>
						<td>
							<input type="text" class="w155" ng-model="agentStatusCtrl.filter.hostName" ng-keyup="$event.keyCode == 13 ? agentStatusCtrl.onSearch() : null">
						</td>
						<th>IP</th>
						<td>
							<input type="text" class="w145" ng-model="agentStatusCtrl.filter.ip" ng-keyup="$event.keyCode == 13 ? agentStatusCtrl.onSearch() : null">
						</td>
						<th>Agent status</th>
						<td>
							<select class="selectbox w84" ng-model="agentStatusCtrl.filter.status">
								<option ng-repeat="option in agentStatusCtrl.searchAgentStatusModel" value="{{option.value}}">{{option.label}}</option>
							</select>
						</td>
						<th>Last time</th>
						<td>
							<dt-selector ng-id="agentStatusCtrl.sTime" creation-complete="agentStatusCtrl.dtSelectInit(agentStatusCtrl.sTime, 'sTime')"></dt-selector>
							<span class="and">~</span> 
							<dt-selector ng-id="agentStatusCtrl.eTime" creation-complete="agentStatusCtrl.dtSelectInit(agentStatusCtrl.eTime, 'eTime')"></dt-selector>
							
							
							<button type="button" class="btn-cr i-search ml05" ng-click="agentStatusCtrl.onSearch()">{{ "COMMON.SEARCH" | translate }}</button>
							<button type="button" class="btn-cr i-refresh" ng-click="agentStatusCtrl.onAgentSearchInit()">{{ "COMMON.RESET" | translate }}</button>
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
			
			<div class="grid-area mt10 hcalc03" ui-grid="agentStatusCtrl.gridAgentOptions" ></div>
			
			<!-- pagination-area-total -->
			<div class="pagination-area-total" style="padding: 10px;">
				<div class="node-total">
					{{"GROUP.TOTAL" | translate}} :<strong>{{agentStatusCtrl.totalPage}}</strong>
				</div>
				<pagination-directive 
					total-items="agentStatusCtrl.totalPage" 
					items-per-page="agentStatusCtrl.itemsPerPage"
					max-size="agentStatusCtrl.maxSize"
					ng-model="agentStatusCtrl.currentPage"
					rotate="false" 
					class="pagination" 
					boundary-links="true" 
					ng-change="agentStatusCtrl.selectPage()">
				</pagination-directive>
			</div>
		</div>
	</div>
	<!-- //panel-wrap -->
</div>