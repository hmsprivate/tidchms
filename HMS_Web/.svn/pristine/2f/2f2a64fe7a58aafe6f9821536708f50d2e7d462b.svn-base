<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags"%>
<%@ page pageEncoding="UTF-8" contentType="text/html; charset=UTF-8"%>
<style>
  #GridCustomId select.ui-grid-filter-select option:first-child[value=""] {
    display: none;
  }
</style>


<div class="pop-wrap w1200" style="top:80px;left:40%;margin-left:-400px">				
	<div class="pop-header"><h3 class="title">Node info detail</h3></div>
	<!-- popContent -->
	<div class="pop-content">
		<!-- //grid-area  -->
		<div id="GridCustomId" class="grid-area h700" ui-grid="gridOptions"></div>
		<!-- //grid-area -->
	
		<!-- btns-area -->
		<div class="btns-area">
			<button type="button" class="btn-cr" ng-click="onNodeChange()">Apply</button>
			<button type="button" class="btn-cr" ng-click="closePopup()">Close</button>
		</div>
		<!-- //btns-area -->
	</div>
	<button type="button" class="btn-close" title="close" ng-click="closePopup()">close</button>
	<!-- //popContent -->	
</div>