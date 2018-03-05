<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags"%>
<%@ page pageEncoding="UTF-8" contentType="text/html; charset=UTF-8"%>

<div id="content" ng-controller="CommonDirectiveCtrl as commonDirectiveCtrl">
	<%--<div id="leftButtonGroup" width="5px" height="100%" layout="vertical"></div>--%>
	
	
	<panel-directive 
	    class="panel-wrap3"
		panel-title="Resources" 
		group-id="leftButtonGroup" 
		button-class="toogle-btn-left" 
		button-text="Resources" 
		height="100%"
		padding-right="10px">
			<resource-tree-directive
				auto-select="false"
				head-gnb-list="commonDirectiveCtrl.headGnb">
			</resource-tree-directive>
	</panel-directive>

		<div class="panel-wrap3" style="left:420px;width:calc(100% - 430px);">
			<div width="100%" height="100%" layout="vertical" gap="10px">
				<select-box-directive
						class="selectbox w150"
						select-model="commonDirectiveCtrl.selectBoxDirectiveSelectModel">
				</select-box-directive>

				<div class="pagination-area-total">
					<pagination-directive
							total-items="commonDirectiveCtrl.totalPage"
							items-per-page="commonDirectiveCtrl.itemsPerPage"
							max-size="commonDirectiveCtrl.maxSize"
							ng-model="commonDirectiveCtrl.currentPage"
							rotate="false"
							class="pagination"
							boundary-links="true"
							ng-change="commonDirectiveCtrl.selectPage()">
					</pagination-directive>
				</div>

				<input type="button" value="ng-dialog 테스트" ng-click="commonDirectiveCtrl.ngDialog()">

				<div width="100%" height="30px" layout="horizontal">
					<div class="calendar">
						<!-- <input type="text" class="date" value=""> -->
						<date-picker-directive></date-picker-directive>
					</div>
					<span class="and">~</span>
					<div class="calendar">
						<date-picker-directive></date-picker-directive>
					</div>
				</div>

				<folding-panel-directive width="150px" title="TEST">
					<b>Hello World!!</b>
					<b>Hello World!!</b>
					<b>Hello World!!</b>
					<b>Hello World!!</b>
					<b>Hello World!!</b>
					<b>Hello World!!</b>
					<b>Hello World!!</b>
					<b>Hello World!!</b>
					<b>Hello World!!</b>
					<b>Hello World!!</b>
				</folding-panel-directive>

				<div>
					<div>선택된 트리노드</div>
					<div>{{commonDirectiveCtrl.headGnb}}</div>
				</div>
				<div>
					트리보기 팝업<button type="button" class="btn-round i-marker" ng-click="commonDirectiveCtrl.showTreePop()"></button>
					<p><textarea cols="100" rows="5">{{commonDirectiveCtrl.selectedTreeData}}</textarea></p>
				</div>

				<div>
					<div>상면도 팝업 보기</div>
					<div>데이터센터 id=168 ( 판교 ) / room id = 239 <button type="button" class="btn-round i-marker" ng-click="commonDirectiveCtrl.showDiagramPop('168', '239')"></button> </div>
					<div>데이터센터 id=168 ( 판교 ) / room id = 683 <button type="button" class="btn-round i-marker" ng-click="commonDirectiveCtrl.showDiagramPop('168', '683')"></button> </div>
				</div>

				<div>
					<div>Rakc 보기 </div><button type="button" class="btn-round i-marker" ng-click="commonDirectiveCtrl.showRackDiagramPop()"></button>
				</div>


				<%--<floor-diagram-directive version-type="release" editable-diagram="false" use-config-btn="true" use-add-on-btn="false" injection-dc-id="168" injection-type="room" injection="true" injection-id="239" width="100%" height="100%"></floor-diagram-directive>--%>


				<div>
					장비 이력 팝업<button type="button" class="btn-round i-marker" ng-click="commonDirectiveCtrl.openHistoryPop()"></button>
				</div>
			</div>

	</div>

</div>