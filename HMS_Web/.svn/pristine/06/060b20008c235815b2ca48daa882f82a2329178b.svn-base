<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags"%>
<%@ page pageEncoding="UTF-8" contentType="text/html; charset=UTF-8"%>


<div class="pop-wrap w1500" style="top:200px;left:50%;margin-left:-750px">				
	<div class="pop-header"><h3 class="title">No Group Node List</h3></div>
	<button type="button" class="btn-close" title="close" ng-click="closeNodePopup()">close</button>
	<!-- popContent -->
	<div class="pop-content">
		<!-- //grid-area  -->
		<!-- plugin-data-area -->
		<div class="fold-data-area">
			<!-- <div class="fold-data-head">
				<h4 class="title"></h4> 
				<div class="hd-right">
					<div class="form-group mr15">	
						<span class="label mr15"><i class="ico-md i-filter"></i>Selected type</span>
						<span ng-repeat="pluginType in pluginTypesPopup2">
							<input type="checkbox" id="{{pluginType}}3" value="{{pluginType}}"
							check-list='checked_pluginTypePopup2' on-search="popupPluginList()"><label for="{{pluginType}}3">{{pluginType}}</label>
						</span>
					</div>
				</div>
			</div> -->
			<div class="fold-data-cont">
				<div class="search-group-area round-border-type">
					<!-- <table>
						<tbody>
						<tr>
							<th>{{"GROUP.HOST_NAME" | translate}}</th>
							<td>
								<input type="text" class="w140" ng-model="searchNodePopupConditions.hostName" ng-keyup="$event.keyCode == 13 ? popupNodeList() : null">
							</td>
							<th>{{"GROUP.SERIAL_NUMBER" | translate}}</th>
							<td>
								<input type="text" class="w140" ng-model="searchNodePopupConditions.serialNumber" ng-keyup="$event.keyCode == 13 ? popupNodeList() : null">
							</td>
							<th>{{ "GROUP.TYPE" | translate }}</th>
							<td>
								<select class="selectbox w84" ng-model="searchNodePopupConditions.nodeType">
									<option ng-repeat="option in searchServerTypeModel" value="{{option.value}}">{{option.label}}</option>
								</select>
							</td>
							<th>{{"GROUP.IP" | translate}}</th>
							<td>
								<input type="text" class="w145" ng-model="searchNodePopupConditions.ip" ng-keyup="$event.keyCode == 13 ? popupNodeList() : null">
							</td>
							<th>{{"GROUP.OS" | translate}} {{"COMMON.NAME" | translate}}</th>
							<td>
								<input type="text" class="w145" ng-model="searchNodePopupConditions.osName" ng-keyup="$event.keyCode == 13 ? popupNodeList() : null">
							</td>
							<th>{{"GROUP.MANUFACTURER" | translate}}</th>
							<td>
								<input type="text" class="w145" ng-model="searchNodePopupConditions.manufacture" ng-keyup="$event.keyCode == 13 ? popupNodeList() : null">
								<button type="button" class="btn-cr i-search ml05" ng-click="popupNodeList()">{{ "COMMON.SEARCH" | translate }}</button>
								<button type="button" class="btn-cr i-refresh" ng-click="popupNodeSearchInit()">{{ "COMMON.RESET" | translate }}</button>
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
			
			
				<!-- grid-area -->
				<div class="grid-area mt10 h300" ui-grid-selection ui-grid="gridNodePopupOptions"></div>
				<!-- //grid-area -->
				
				<!-- pagination-area-total -->
				<div class="pagination-area-total" style="padding: 10px;">
					<pagination-directive 
				    	total-items="totalPage" 
				    	items-per-page="itemsPerPage" 
				    	max-size="maxSize" 
				    	ng-model="currentPage" 
				    	rotate="false" 
				    	class="pagination" 
				    	boundary-links="true" 
				    	ng-change="selectPage(currentPage)">
				    </pagination-directive>
				</div>
				<!-- //pagination-area-total -->
			</div>
					
					
			</div>
		</div>
		<!-- //plugin-data-area -->
		<!-- //grid-area -->
	
		<!-- btns-area -->
		<div class="btns-area">
			<button type="button" class="btn-cr" ng-click="onNodeAdd()">Apply</button>
			<button type="button" class="btn-gy" ng-click="closeNodePopup()">Cancel</button>
		</div>
		<!-- //btns-area -->
	</div>
	
	<!-- //popContent -->	
</div>