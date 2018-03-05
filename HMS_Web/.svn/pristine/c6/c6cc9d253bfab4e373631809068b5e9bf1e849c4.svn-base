<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags"%>
<%@ page pageEncoding="UTF-8" contentType="text/html; charset=UTF-8"%>


<div class="pop-wrap w500" style="top:300px;left:50%;margin-left:-250px">				
	<div class="pop-header"><h3 class="title">Group create</h3></div>
	<!-- popContent -->
	<div class="pop-content">
		<form name="groupAddForm" ng-submit="submitForm(groupAddForm)" novalidate="">
		<div class="center-box round-border-type h120">
			<div class="center-inner">
				<div class="form-group">
					<label class="label" for="Groupname"><strong class="req"></strong>Group name</label>
					<input type="text" class="w300" id="Groupname" maxlength="50" ng-model="groupName" required>
				</div>
			</div>
		</div>
	
		<!-- btns-area -->
		<div class="btns-area">
			<button class="btn-cr">Apply</button>
			<button type="button" class="btn-gy" ng-click="closeGroupAddPopup()">Cancel</button>
		</div>
		<!-- //btns-area -->
		</form>
	</div>
	<button type="button" class="btn-close" title="close" ng-click="closeGroupAddPopup()">close</button>
	<!-- //popContent -->	
</div>