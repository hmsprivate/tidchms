<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags"%>
<%@ page pageEncoding="UTF-8" contentType="text/html; charset=UTF-8"%>

<div id="content" ng-controller="PluginMgmtCtrl as pluginMgmtCtrl">
	<!-- panel-wrap -->
	<div class="panel-wrap">
		<div class="panel-header">
			<h3 class="title">Plugin List</h3>
			<div class="hd-right">
				<button type="button" class="btn-cr btn-sm" ng-click="pluginMgmtCtrl.onPluginSync()">Update</button>
				<button type="button" class="btn-cr btn-sm i-plus" ng-click="pluginMgmtCtrl.fileUploadPopup()">Add</button>
				<button type="button" class="btn-cr btn-sm i-minus" ng-click="pluginMgmtCtrl.onPluginDelete()">Remove</button>
			</div>
		</div>
		<div class="panel-content">
			<!-- data-tbl -->
			<div class="data-tbl wide round-border-type">
				<table>
					<tbody>
					<tr>
						<th><i class="ico-md i-filter"></i>Selected type</th>
						<td>
							<span ng-repeat="pluginType in pluginTypes">
								<input type="checkbox" id="{{pluginType}}" value="{{pluginType}}"
								check-list='checked_pluginType' on-search="pluginMgmtCtrl.onPluginSearch()"><label for="{{pluginType}}">{{pluginType}}</label>
							</span>
						</td>
						<th>Name</th>
						<td>
							<input type="text" class="w155" ng-model="pluginMgmtCtrl.filter.pluginName" ng-keyup="$event.keyCode == 13 ? pluginMgmtCtrl.onPluginSearch() : null">
							
							<button type="button" class="btn-cr i-search ml05" ng-click="pluginMgmtCtrl.onPluginSearch()">{{ "COMMON.SEARCH" | translate }}</button>
							<button type="button" class="btn-cr i-refresh" ng-click="pluginMgmtCtrl.onSearchInit()">{{ "COMMON.RESET" | translate }}</button>
						</td>
						<!-- <th>Signed</th>
						<td>
							<select class="selectbox w100" ng-model="pluginMgmtCtrl.filter.pluginSigned">
								<option value="0">TEST0</option>
								<option value="1">TEST1</option>
								<option value="2">TEST2</option>
							</select>
						</td> -->
						<!-- <th>Status</th>
						<td>
							<select class="selectbox w100" ng-model="pluginMgmtCtrl.filter.pluginStatus">
								<option ng-repeat="option in pluginMgmtCtrl.searchStatusTypeModel" value="{{option.value}}">{{option.label}}</option>
							</select>
						</td> -->
					</tr>
					</tbody>
				</table>
			</div>
			<div class="btns-area-right">
			</div>
			
			
			<!-- //data-tbl -->
			<div class="grid-area"  ui-grid="pluginMgmtCtrl.gridPluginOptions" style="height:calc(100% - 90px)"></div>
		</div>
	</div>
	<!-- //panel-wrap -->
</div>