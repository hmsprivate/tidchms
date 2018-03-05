<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags"%>
<%@ page pageEncoding="UTF-8" contentType="text/html; charset=UTF-8"%>

<div class="pop-wrap w1400" style="top:150px;left:50%;margin-left:-700px"><!-- style은 위치예제임 -->				
	<div class="pop-header"><h3 class="title">Comparer HMS width CMDB</h3></div>
	<!-- popContent -->
	<div class="pop-content">
		<div class="data-cont-gy i-arrow-center">
			<div class="row gap76">
				<div class="col-6">
					<div class="header-box">
						<h4 class="title">HMS</h4> 		
					</div>
					<!-- grid-area -->
					<div class="grid-area h300" ui-grid-selection ui-grid="gridHmsPopupOptions"></div>	
					<!-- //grid-area -->						
				</div>
				<div class="col-6">
					<div class="header-box">
						<h4 class="title">CMDB</h4> 		
					</div>
					<!-- grid-area -->
					<div class="grid-area h300" ui-grid-selection ui-grid="gridCmdbPopupOptions"></div>	
					<!-- //grid-area -->
				</div>
			</div>
			<!-- btns-area -->
			<div class="btns-area">
				<button type="button" class="btn-bk">Change</button>
				<button type="button" class="btn-bk">Hold</button>
				<button type="button" class="btn-bk" ng-click="closeComparePopup()">Cancel</button>
			</div>
			<!-- //btns-area -->
		</div>
		<!-- btns-area -->
		<div class="btns-area">
			<button type="button" class="btn-gy" ng-click="closeComparePopup()">Close</button>
		</div>
		<!-- //btns-area -->
	</div>
	<!-- //popContent -->	
	<button type="button" class="btn-close" title="close" ng-click="closeComparePopup()">close</button>
</div>
