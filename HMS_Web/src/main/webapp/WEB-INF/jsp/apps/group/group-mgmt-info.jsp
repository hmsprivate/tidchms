<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags"%>
<%@ page pageEncoding="UTF-8" contentType="text/html; charset=UTF-8"%>

<div id="content" ng-controller="GroupMgmtCtrl as groupMgmtCtrl">
	<!-- 검색 + Grid -->
	<div class="cont-wrap">
		<!-- tab-cont-group -->
		<div class="tab-cont-group ">
			<ul class="tab-menu group-type">
				<li ng-repeat="group in groupMgmtCtrl.groupList" ng-click="groupMgmtCtrl.getNodeList(group.agreementSeq, group.agreementName)" 
					ng-class="{'tab-selected-class-name' : group.agreementSeq == selectedSeq}" style="border-top-width: 0px;">
					<span title={{group.agreementName}}><a href="">{{group.agreementName}}</a></span>
				</li>
			</ul>
			<div class="btns-area-control group">
				<button type="button" class="btn-gy btn-block i-plus" ng-click="groupMgmtCtrl.getGroupAddPopup()">Group Create</button>
				<button type="button" class="btn-gy btn-block i-minus" ng-click="groupMgmtCtrl.getGroupDelPopup()">Group Delete</button>
				<div class="line-top"><button type="button" class="btn-gy btn-block i-trash" ng-click="groupMgmtCtrl.getNodeTrashBinPopup()">Trash Bin</button></div>
			</div>
			
			
			
			<div class="tab-cont"><!-- tab-cont scroll -->
				
				<!-- task-data-area -->
				<div class="fold-data-area" ng-show="groupMgmtCtrl.gridTaskShow">
					<div class="fold-data-head">
						<h4 class="title">Task</h4> 
						<div class="hd-right">
							<button type="button" id="taskSync" class="btn-cr btn-sm" ng-click="groupMgmtCtrl.onTaskSync()">Update</button>
							<button type="button" id="taskLoad" class="btn-cr btn-sm i-plus" ng-click="groupMgmtCtrl.getTaskPopup()">Create</button>
							<button type="button" id="taskUnLoad" class="btn-cr btn-sm i-minus" ng-click="groupMgmtCtrl.onTaskDelete()">Remove</button>
							<!-- <button type="button" class="ico-md i-download" title="다운로드"></button> -->
							<button type="button" class="ico-md" title="Close" ng-class="groupMgmtCtrl.showTargetTaskPanel ? 'i-compress' : 'i-expand'" ng-click="groupMgmtCtrl.showTargetTaskPanelToggle()"></button>
						</div>
					</div>
					<div class="fold-data-cont" ng-show="groupMgmtCtrl.showTargetTaskPanel">
						<!-- grid-area -->
						<div class="grid-area max-h200" ui-grid="groupMgmtCtrl.gridTaskOptions" ></div>
						<!-- //grid-area -->
					</div>
				</div>
				<!-- //task-data-area -->
				
				<!-- plugin-data-area -->
				<div class="fold-data-area" ng-show="groupMgmtCtrl.gridPluginShow">
					<div class="fold-data-head">
						<h4 class="title">Plugin</h4> 
						<div class="hd-right">
							<div class="form-group mr15">	
								<span class="label mr15"><i class="ico-md i-filter"></i>Selected type</span>
								
								<span ng-repeat="pluginType in pluginTypes">
									<input type="checkbox" id="{{pluginType}}1" value="{{pluginType}}"
									check-list='checked_pluginType' on-search="groupMgmtCtrl.onPluginSearch()"><label for="{{pluginType}}1">{{pluginType}}</label>
								</span>
							</div>
							<button type="button" id="pluginSync" class="btn-cr btn-sm" ng-click="groupMgmtCtrl.onPluginSync()">Update</button>
							<button type="button" id="pluginLoad" class="btn-cr btn-sm i-plus" ng-click="groupMgmtCtrl.getPluginPopup()">Load</button>
							<button type="button" id="pluginUnLoad" class="btn-cr btn-sm i-minus" ng-click="groupMgmtCtrl.onPluginDelete()">Unload</button>
							<!-- <button type="button" class="ico-md i-download" title="csv download" ng-click="groupMgmtCtrl.exportCsv('csv')"></button> -->
							<button type="button" class="ico-md" title="Open/Close" ng-class="groupMgmtCtrl.showTargetPluginPanel ? 'i-compress' : 'i-expand'" ng-click="groupMgmtCtrl.showTargetPluginPanelToggle()"></button>
						</div>
					</div>
					<div class="fold-data-cont" ng-show="groupMgmtCtrl.showTargetPluginPanel">
						<!-- grid-area -->
						<div class="grid-area max-h200" ui-grid="groupMgmtCtrl.gridPluginOptions" ></div>
						<!-- //grid-area -->
					</div>
				</div>
				<!-- //plugin-data-area -->
				
				
				
				<!-- node-data-area -->
				<div class="fold-data-area" ng-show="groupMgmtCtrl.gridNodeShow">
					<div class="fold-data-head">
						<h4 class="title">Node</h4> 
						<div class="hd-right">
							<!-- <button type="button" class="btn-cr btn-sm i-trash" ng-click="">Move To Trash</button> -->
							<button type="button" class="btn-cr btn-sm" ng-click="groupMgmtCtrl.onNodeSync()">Update</button>
							<button type="button" class="btn-cr btn-sm i-plus" ng-click="groupMgmtCtrl.getNodePopup()">Include</button>
							<button type="button" class="btn-cr btn-sm i-minus" ng-click="groupMgmtCtrl.onNodeDelete()">Exclude</button>
							<!-- <button type="button" class="ico-md i-download" title="csv download"></button> -->
							<button type="button" class="ico-md" title="Close" ng-class="groupMgmtCtrl.showTargetNodePanel ? 'i-compress' : 'i-expand'" ng-click="groupMgmtCtrl.showTargetNodePanelToggle()"></button>
						</div>
					</div>
					<div class="fold-data-cont" ng-show="groupMgmtCtrl.showTargetNodePanel">
						<!-- data-tbl -->
						<div class="search-group-area round-border-type">
						<!-- <div class="data-tbl wide round-border-type th-right"> -->
							<!-- <table>
								<tbody>
								<tr>
									<th>{{"GROUP.HOST_NAME" | translate}}</th>
									<td>
										<input type="text" class="w140" ng-model="groupMgmtCtrl.filter.hostName" ng-keyup="$event.keyCode == 13 ? groupMgmtCtrl.onNodeSearch() : null">
									</td>
									<th>{{"GROUP.SERIAL_NUMBER" | translate}}</th>
									<td>
										<input type="text" class="w140" ng-model="groupMgmtCtrl.filter.serialNumber" ng-keyup="$event.keyCode == 13 ? groupMgmtCtrl.onNodeSearch() : null">
									</td>
									<th>{{ "GROUP.TYPE" | translate }}</th>
									<td>
										<select class="selectbox w84" ng-model="groupMgmtCtrl.filter.nodeType">
											<option ng-repeat="option in groupMgmtCtrl.searchServerTypeModel" value="{{option.value}}">{{option.label}}</option>
										</select>
									</td>
									<th>{{"GROUP.IP" | translate}}</th>
									<td>
										<input type="text" class="w145" ng-model="groupMgmtCtrl.filter.ip" ng-keyup="$event.keyCode == 13 ? groupMgmtCtrl.onNodeSearch() : null">
									</td>
									<th>{{"GROUP.OS" | translate}} {{"COMMON.NAME" | translate}}</th>
									<td>
										<input type="text" class="w145" ng-model="groupMgmtCtrl.filter.osName" ng-keyup="$event.keyCode == 13 ? groupMgmtCtrl.onNodeSearch() : null">
									</td>
									<th>{{"GROUP.MANUFACTURER" | translate}}</th>
									<td>
										<input type="text" class="w145" ng-model="groupMgmtCtrl.filter.manufacture" ng-keyup="$event.keyCode == 13 ? groupMgmtCtrl.onNodeSearch() : null">
										<button type="button" class="btn-cr i-search ml05" ng-click="groupMgmtCtrl.onNodeSearch()">{{ "COMMON.SEARCH" | translate }}</button>
										<button type="button" class="btn-cr i-refresh" ng-click="groupMgmtCtrl.onNodeSearchInit()">{{ "COMMON.RESET" | translate }}</button>
									</td>
								</tr>
								</tbody>
							</table> -->
							<search-pop-directive
								condition-type-list="typeList"
								popup-type="left"
								search-call-back="getSearchCondition(searchParam)" 
								click-call-back="{{groupMgmtCtrl.searchPopType}}"
								>
							</search-pop-directive>
						</div>
						<!-- //data-tbl -->
						
						<!-- grid-area -->
						<div class="grid-area mt10 max-h200" ui-grid="groupMgmtCtrl.gridNodeOptions"></div>
						<!-- //grid-area -->
						
						<!-- pagination-area-total -->
						<div class="pagination-area-total" style="padding: 10px;">
							<div class="node-total">
								{{"GROUP.TOTAL" | translate}} :<strong>{{groupMgmtCtrl.totalPage}}</strong>
							</div>
							<div class="btns-area-control right">
								<button type="button" class="btn-cr i-trash">Move To Trash</button>
							</div>
							<pagination-directive 
								total-items="groupMgmtCtrl.totalPage" 
								items-per-page="groupMgmtCtrl.itemsPerPage"
								max-size="groupMgmtCtrl.maxSize"
								ng-model="groupMgmtCtrl.currentPage"
								rotate="false" 
								class="pagination" 
								boundary-links="true" 
								ng-change="groupMgmtCtrl.selectPage()">
							</pagination-directive>
							
						</div>
						<!-- //pagination-area-total -->
					</div>
				</div>
				<!-- //node-data-area -->
				
				
				
				
				
				
				
				<!-- UnKown node-data-area -->
				<div class="fold-data-area" ng-show="groupMgmtCtrl.gridUnNodeShow" style="height: 100%;">
					<div class="fold-data-head">
						<h4 class="title">No Group Node</h4> 
						<!-- <div class="hd-right">
							<button type="button" class="btn-cr btn-sm i-trash" ng-click="">Move To Trash</button>
							<button type="button" class="ico-md i-download" title="다운로드"></button>
						</div> -->
					</div>
					<div class="fold-data-cont">
						<!-- data-tbl -->
						<div class="search-group-area round-border-type">
							<!-- <table>
								<tbody>
								<tr>
									<th>{{"GROUP.HOST_NAME" | translate}}</th>
									<td>
										<input type="text" class="w140" ng-model="groupMgmtCtrl.filter.hostName" ng-keyup="$event.keyCode == 13 ? groupMgmtCtrl.onNodeSearch() : null">
									</td>
									<th>{{"GROUP.SERIAL_NUMBER" | translate}}</th>
									<td>
										<input type="text" class="w140" ng-model="groupMgmtCtrl.filter.serialNumber" ng-keyup="$event.keyCode == 13 ? groupMgmtCtrl.onNodeSearch() : null">
									</td>
									<th>{{ "GROUP.TYPE" | translate }}</th>
									<td>
										<select class="selectbox w84" ng-model="groupMgmtCtrl.filter.nodeType">
											<option ng-repeat="option in groupMgmtCtrl.searchServerTypeModel" value="{{option.value}}">{{option.label}}</option>
										</select>
									</td>
									<th>{{"GROUP.IP" | translate}}</th>
									<td>
										<input type="text" class="w145" ng-model="groupMgmtCtrl.filter.ip" ng-keyup="$event.keyCode == 13 ? groupMgmtCtrl.onNodeSearch() : null">
									</td>
									<th>{{"GROUP.OS" | translate}} {{"COMMON.NAME" | translate}}</th>
									<td>
										<input type="text" class="w145" ng-model="groupMgmtCtrl.filter.osName" ng-keyup="$event.keyCode == 13 ? groupMgmtCtrl.onNodeSearch() : null">
									</td>
									<th>{{"GROUP.MANUFACTURER" | translate}}</th>
									<td>
										<input type="text" class="w145" ng-model="groupMgmtCtrl.filter.manufacture" ng-keyup="$event.keyCode == 13 ? groupMgmtCtrl.onNodeSearch() : null">
										<button type="button" class="btn-cr i-search ml05" ng-click="groupMgmtCtrl.onNodeSearch()">{{ "COMMON.SEARCH" | translate }}</button>
										<button type="button" class="btn-cr i-refresh" ng-click="groupMgmtCtrl.onNodeSearchInit()">{{ "COMMON.RESET" | translate }}</button>
									</td>
								</tr>
								</tbody>
							</table> -->
							<search-pop-directive
								condition-type-list="typeList"
								popup-type="left"
								search-call-back="getSearchCondition(searchParam)" 
								click-call-back="{{groupMgmtCtrl.searchPopType}}"
								>
							</search-pop-directive>
						</div>
						<!-- //data-tbl -->
						
						<!-- grid-area -->
						<div class="grid-area mt10" ui-grid="groupMgmtCtrl.gridNodeOptions" style="height: 85%;"></div>
						<!-- //grid-area -->
						
						<!-- pagination-area-total -->
						<div class="pagination-area-total" style="padding: 10px;">
							<div class="node-total">
								{{"GROUP.TOTAL" | translate}} :<strong>{{groupMgmtCtrl.totalPage}}</strong>
							</div>
							<div class="btns-area-control right">
								<button type="button" class="btn-cr i-trash" ng-click="groupMgmtCtrl.onNodeTrashBinMove()">Move To Trash</button>
							</div>
							<pagination-directive 
								total-items="groupMgmtCtrl.totalPage" 
								items-per-page="groupMgmtCtrl.itemsPerPage"
								max-size="groupMgmtCtrl.maxSize"
								ng-model="groupMgmtCtrl.currentPage"
								rotate="false" 
								class="pagination" 
								boundary-links="true" 
								ng-change="groupMgmtCtrl.selectPage()">
							</pagination-directive>
						</div>
						<!-- //pagination-area-total -->
					</div>
				</div>
				<!-- //UnKown node-data-area -->
				
				
				
				
				
			</div>
		</div>
		<!-- //tab-cont-group -->

	</div>
	<!-- //검색 + Grid -->
	
</div>
