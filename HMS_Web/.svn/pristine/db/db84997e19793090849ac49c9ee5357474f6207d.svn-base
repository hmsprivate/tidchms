<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags"%>
<%@ page pageEncoding="UTF-8" contentType="text/html; charset=UTF-8"%>

<div class="pop-wrap w1500" style="top:100px;left:50%;margin-left:-720px" ng-controller="TrashBinReleaseCtrl as trashBinReleaseCtrl">
	<div class="pop-header">
		<h3 class="title">Trash Bin</h3>
	</div>
	<!-- popContent -->
	<div class="pop-content">				
		<div class="search-group-area round-border-type">
			<!-- <table>
				<tbody>
					<tr>
						<th>Group</th>
						<td>
							<select class="selectbox w84" ng-model="trashBinReleaseCtrl.filter.agreementSeq">
								<option ng-repeat="option in trashBinReleaseCtrl.searchAgentGroupModel" value="{{option.agreementSeq}}">{{option.agreementName}}</option>
							</select>
						</td>
						<th>Host Name</th>
						<td>
							<input type="text" class="w155" ng-model="trashBinReleaseCtrl.filter.hostName" ng-keyup="$event.keyCode == 13 ? trashBinReleaseCtrl.onSearch() : null">
						</td>
						<th>Task Name</th>
						<td>
							<input type="text" class="w145" ng-model="trashBinReleaseCtrl.filter.taskName" ng-keyup="$event.keyCode == 13 ? trashBinReleaseCtrl.onSearch() : null">
						</td>
						<th>Task State</th>
						<td>
							<select class="selectbox w84" ng-model="trashBinReleaseCtrl.filter.taskState">
								<option ng-repeat="option in trashBinReleaseCtrl.searchStateModel" value="{{option.value}}">{{option.label}}</option>
							</select>
							<button type="button" class="btn-cr i-search ml05" ng-click="trashBinReleaseCtrl.onSearch()">Search</button>
							<button type="button" class="btn-cr i-refresh" ng-click="trashBinReleaseCtrl.onSearchInit()">Reset</button>
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
		
		<div class="fold-data-cont">
			<div class="grid-area mt10 h600" ui-grid="trashBinReleaseCtrl.gridOptions"></div>
		</div>
	
		<!-- btns-area -->
		<div class="btns-area">
			<div class="fr"><button type="button" class="btn-cr i-undo" ng-click="trashBinReleaseCtrl.onNodeRecoveryClick('','multi')">Put back</button></div>
			<button type="button" class="btn-gy" ng-click="trashBinReleaseCtrl.closePopup()">Close</button>
		</div>
		<!-- //btns-area -->
	</div>
	<!-- //popContent -->	
	<button type="button" class="btn-close" title="close" ng-click="trashBinReleaseCtrl.closePopup()">close</button>
</div>