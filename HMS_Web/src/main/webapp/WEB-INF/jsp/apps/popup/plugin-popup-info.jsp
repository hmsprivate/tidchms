<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags"%>
<%@ page pageEncoding="UTF-8" contentType="text/html; charset=UTF-8"%>


<div class="pop-wrap w800" style="top:200px;left:50%;margin-left:-350px">				
	<div class="pop-header"><h3 class="title">Plugin List</h3></div>
	<!-- popContent -->
	<div class="pop-content">
		<!-- //grid-area  -->
		<!-- plugin-data-area -->
		<div class="fold-data-area">
			<div class="fold-data-head">
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
			</div>
			<div class="fold-data-cont">
				<!-- grid-area -->
				<div class="grid-area h300" ui-grid-selection ui-grid="gridPluginPopupOptions"></div>
				<!-- //grid-area -->
			</div>
		</div>
		<!-- //plugin-data-area -->
		<!-- //grid-area -->
	
		<!-- btns-area -->
		<div class="btns-area">
			<button type="button" class="btn-cr" ng-click="addPlugin()">Apply</button>
			<button type="button" class="btn-gy" ng-click="closePluginPopup()">Cancel</button>
		</div>
		<!-- //btns-area -->
	</div>
	<button type="button" class="btn-close" title="close" ng-click="closePluginPopup()">close</button>
	<!-- //popContent -->	
</div>