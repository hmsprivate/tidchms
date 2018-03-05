<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags"%>
<%@ page pageEncoding="UTF-8" contentType="text/html; charset=UTF-8"%>

<div class="pop-wrap w1400" style="top:50px;left:50%;margin-left:-720px" ng-controller="TaskStatusDetailCtrl as taskStatusDetailCtrl">
	<div class="pop-header">
		<h3 class="title">Task Status Per Node</h3>
	</div>
	<!-- popContent -->
	<div class="pop-content">				
		<div class="search-group-area round-border-type">
			<!-- <table>
				<tbody>
					<tr>
						<th>Group</th>
						<td>
							<select class="selectbox w84" ng-model="taskStatusDetailCtrl.filter.agreementSeq">
								<option ng-repeat="option in taskStatusDetailCtrl.searchAgentGroupModel" value="{{option.agreementSeq}}">{{option.agreementName}}</option>
							</select>
						</td>
						<th>Host Name</th>
						<td>
							<input type="text" class="w155" ng-model="taskStatusDetailCtrl.filter.hostName" ng-keyup="$event.keyCode == 13 ? taskStatusDetailCtrl.onSearch() : null">
						</td>
						<th>Task Name</th>
						<td>
							<input type="text" class="w145" ng-model="taskStatusDetailCtrl.filter.taskName" ng-keyup="$event.keyCode == 13 ? taskStatusDetailCtrl.onSearch() : null">
						</td>
						<th>Task State</th>
						<td>
							<select class="selectbox w84" ng-model="taskStatusDetailCtrl.filter.taskState">
								<option ng-repeat="option in taskStatusDetailCtrl.searchStateModel" value="{{option.value}}">{{option.label}}</option>
							</select>
							<button type="button" class="btn-cr i-search ml05" ng-click="taskStatusDetailCtrl.onSearch()">Search</button>
							<button type="button" class="btn-cr i-refresh" ng-click="taskStatusDetailCtrl.onSearchInit()">Reset</button>
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
		
		<div class="btns-area-right">
			<button type="button" class="btn-cr btn-sm" ng-click="taskStatusDetailCtrl.reload()">Update</button>
		</div>
	
	
		<div class="fold-data-cont">
			<div class="grid-area h700" ui-grid="taskStatusDetailCtrl.gridOptions"></div>
		</div>
	
		<!-- btns-area -->
		<div class="btns-area">
			<button type="button" class="btn-gy" ng-click="taskStatusDetailCtrl.closePopup()">Close</button>
		</div>
		<!-- //btns-area -->
	</div>
	<!-- //popContent -->	
	<button type="button" class="btn-close" title="close" ng-click="taskStatusDetailCtrl.closePopup()">close</button>
</div>