<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags"%>
<%@ page pageEncoding="UTF-8" contentType="text/html; charset=UTF-8"%>

<div class="pop-wrap w1200" style="top:150px;left:50%;margin-left:-600px" ng-controller="NodeHistoryDetailCtrl as nodeHistoryDetailCtrl">
	<div class="pop-header"><h3 class="title">Change history</h3></div>
	<!-- popContent -->
	<div class="pop-content">				
		<!-- data-tbl -->
		<div class="data-tbl wide round-border-type">
			<table>
				<tbody>
				<tr>
					<th>Change time</th>
					<td>
						<dt-selector ng-id="nodeHistoryDetailCtrl.sTime" creation-complete="nodeHistoryDetailCtrl.dtSelectInit(nodeHistoryDetailCtrl.sTime, 'sTime')"></dt-selector>
						<span class="and">~</span> 
						<dt-selector ng-id="nodeHistoryDetailCtrl.eTime" creation-complete="nodeHistoryDetailCtrl.dtSelectInit(nodeHistoryDetailCtrl.eTime, 'eTime')"></dt-selector>
						<!-- //timebox -->
						<button type="button" class="btn-cr i-search ml05" ng-click="nodeHistoryDetailCtrl.onSearch()">Search</button>
						<button type="button" class="btn-cr i-refresh" ng-click="nodeHistoryDetailCtrl.onSearchInit()">Reset</button>
					</td>
				</tbody>
			</table>
		</div>
		<!-- //data-tbl -->
		<div class="row gap6">
			<div class="col-2">
				<!-- grid-area -->
				<div class="grid-area mt10 h500" ui-grid="nodeHistoryDetailCtrl.gridHistoryOptions"></div>	
				<!-- //grid-area -->
			</div>
			<div class="col-10">
			
				<!-- grid-area -->
				<div class="grid-area mt10 h500" ui-grid="nodeHistoryDetailCtrl.gridHistoryInfoOptions"></div>	
				<!-- //grid-area -->
			
			</div>
		
		</div>
		<!-- btns-area -->
		<div class="btns-area">
			<button type="button" class="btn-gy" ng-click="nodeHistoryDetailCtrl.closePopup()">Close</button>
		</div>
		<!-- //btns-area -->
	</div>
	<!-- //popContent -->	
	<button type="button" class="btn-close" title="close" ng-click="nodeHistoryDetailCtrl.closePopup()">close</button>
</div>


