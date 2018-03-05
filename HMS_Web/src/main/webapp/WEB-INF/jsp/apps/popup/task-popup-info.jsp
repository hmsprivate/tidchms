<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags"%>
<%@ page pageEncoding="UTF-8" contentType="text/html; charset=UTF-8"%>

<div class="pop-wrap w600" style="top:100px;left:50%;margin-left:-300px">
	<div class="pop-header"><h3 class="title">Task list</h3></div>
	<!-- popContent -->
	<div class="pop-content">				
		<!-- grid-area -->
		<div class="grid-area h300" ui-grid-selection ui-grid="gridTaskPopupOptions"></div>
		<!-- //grid-area -->
		<!-- data-tbl -->
		<div class="data-tbl round-border-type mt10">
			<table>									
				<colgroup>
					<col style="width:100px">
					<col style="width:auto">
				</colgroup>

				<tbody>
				<tr>
					<th>Task Detail</th>
					<td>
						<textarea rows="10" cols="50" class="text-box h120" name="taskFileContents" ng-model="taskInfo.taskFileContents" readonly="readonly"></textarea>
					</td>
				</tr>
				</tbody>
			</table>
		</div>
		<!-- //data-tbl -->
		<!-- btns-area -->
		<div class="btns-area">
			<button type="button" class="btn-cr" ng-click="addTask()">Apply</button>
			<button type="button" class="btn-gy" ng-click="closeTaskPopup()">Cancel</button>
		</div>
		<!-- //btns-area -->
	</div>
	<!-- //popContent -->	
	<button type="button" class="btn-close" title="close" ng-click="closeTaskPopup()">close</button>
</div>