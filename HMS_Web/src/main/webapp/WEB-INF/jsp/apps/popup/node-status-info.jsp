<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags"%>
<%@ page pageEncoding="UTF-8" contentType="text/html; charset=UTF-8"%>


<div class="pop-wrap w1500" style="top:100px;left:50%;margin-left:-750px">				
	<div class="pop-header">
		<h3 class="title">{{popupTitleName}}</h3>
	</div>
	<!-- popContent -->
	<div class="pop-content">
		<!-- <div class="btns-area-right">
			<button type="button" class="btn-cr btn-sm i-trash" ng-click="">Move To Trash</button>
		</div> -->
		
		<!-- task-data-area -->
		<div class="fold-data-area">
			<div class="fold-data-head">
				<h4 class="title">Task</h4> 
				<div class="hd-right">
					<button type="button" class="btn-cr btn-sm i-plus" ng-click="openTask()">Create</button>
					<button type="button" class="btn-cr btn-sm i-minus" ng-click="onTaskDelete()">Remove</button>
				</div>
			</div>
			<div class="fold-data-cont">
				<!-- grid-area -->
				<div class="grid-area h300" ui-grid="gridTaskOptions" ></div>
				<!-- //grid-area -->
			</div>
		</div>
		<!-- //task-data-area -->
		
		
		<!-- plugin-data-area -->
		<div class="fold-data-area">
			<div class="fold-data-head">
				<h4 class="title">Plugin</h4> 
				<div class="hd-right">
					<div class="form-group mr15">	
					</div>
					<button type="button" class="btn-cr btn-sm i-plus" ng-click="openPlugin()">Load</button>
					<button type="button" class="btn-cr btn-sm i-minus" ng-click="onPluginDelete()">Unload</button>
				</div>
			</div>
			<div class="fold-data-cont">
				<!-- grid-area -->
				<div class="grid-area h300" ui-grid="gridPluginOptions"></div>
				<!-- //grid-area -->
			</div>
		</div>
		<!-- //plugin-data-area -->
		
		
		
		
		
		<!-- //grid-area -->
	
		<!-- btns-area -->
		<div class="btns-area">
			<div class="fr">
				<button type="button" class="btn-cr i-trash" ng-click="onNodeTrashBinMove()">Move To Trash</button>
			</div>
			<button type="button" class="btn-gy" ng-click="closeStatusPopup()">Close</button>
		</div>
		<!-- //btns-area -->
	</div>
	<button type="button" class="btn-close" title="close" ng-click="closeStatusPopup()">close</button>
	<!-- //popContent -->	
</div>