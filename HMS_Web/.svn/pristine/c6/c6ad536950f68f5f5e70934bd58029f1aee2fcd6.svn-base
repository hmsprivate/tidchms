<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags"%>
<%@ page pageEncoding="UTF-8" contentType="text/html; charset=UTF-8"%>

<div id="content" ng-controller="TaskMgmtCtrl as taskMgmtCtrl">
	<!-- panel-wrap -->
	<div class="row ph100 gap10">
		<div class="col-3">
			<!-- panel-wrap -->
			<div class="panel-wrap">
				<div class="panel-header">
					<h3 class="title">Task List</h3>
					<div class="hd-right">
						<button type="button" class="btn-cr btn-sm i-plus" ng-click="taskMgmtCtrl.addTask()">Add</button>
						<button type="button" class="btn-cr btn-sm i-minus" ng-click="taskMgmtCtrl.delTask()">Remove</button>
					</div>
				</div>
				<div class="panel-content">
					<div class="grid-area ph90" ui-grid-selection ui-grid="taskMgmtCtrl.gridTaskOptions" style="height: calc(100% - 45px) !important;"></div>
				</div>
				<div class="btns-area-control" style="margin: -45px 10px;">
					<button type="button" class="btn-gy btn-block i-search" ng-click="taskMgmtCtrl.getTaskStatusDetail()">Task Status Per Node</button>
				</div>
			</div>
			<!-- //panel-wrap -->
		</div>
		<div class="col-9">				
			<!-- panel-wrap -->
			<div class="panel-wrap">
				<div class="panel-header">
					<h3 class="title">Task definition</h3>
				</div>
				<div class="panel-content">
					<form name="taskForm" id="taskForm" ng-submit="submitTaskForm(taskForm)" novalidate="" style="height: 100%;">
					<!-- data-tbl -->
						<div class="data-tbl round-border-type task-type">
							<table>									
								<colgroup>
									<col style="width:100px">
									<col style="width:auto">
								</colgroup>
	
								<tbody>
								<tr>
									<th><strong class="req"></strong>File Name</th>
									<td>
										<input type="text" class="p100" id="taskFileName" name="taskFileName" ng-model="taskMgmtCtrl.taskInfo.taskFileName" required>
									</td>
								</tr>
								<tr>
									<th><strong class="req"></strong>Detail</th>
									<td>
										<textarea rows="10" cols="50" class="text-box" id="taskFileContents" style="font-size: 19px;" name="taskFileContents" ng-model="taskMgmtCtrl.taskInfo.taskFileContents" required></textarea>
									</td>
								</tr>
								</tbody>
							</table>
						</div>
						<div class="btns-area">
							<button class="btn-cr">Apply</button>
							<button type="button" class="btn-gy" ng-click="taskMgmtCtrl.addTask()">Cancel</button>
						</div>
					</form>					
				</div>
			</div>
			<!-- //panel-wrap -->
		</div>
	</div>
	<!-- //panel-wrap -->
</div>