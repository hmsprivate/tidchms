<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags"%>
<%@ page pageEncoding="UTF-8" contentType="text/html; charset=UTF-8"%>

<!DOCTYPE html>
<html lang="en">
<head>
<title>HMS</title>
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="stylesheet" href="<c:url value='/css/app.min.css'/>">
</head>

<body>
<div id="login-wrap" ng-app="app">
	<div id="login-container">
		<h1>SK Telecom</h1>
		<div class="login-area" ng-controller="IndexCtrl as indexCtrl">
			<form>
				<fieldset>
					<legend>HMS Login</legend>
					<h2>HMS (Hardware Management System)</h2>
					<div class="login-input">
						<i class="id"></i>
						<input type="text" placeholder="admin" title="username" value="admin" autofocus>
					</div>
					<div class="login-input">
						<i class="pw"></i>
						<input type="password" placeholder="admin" title="password" value="admin">
					</div>
					<div class="login-btns"><button class="login" ng-click="indexCtrl.login()">LOGIN</button></div>
				</fieldset>
			</form>
			<p class="login-info">본 솔루션은 <em>Chrome Browser</em>에서 사용하실 수 있습니다.<br>해상도 <em>1920*1024</em>에 최적화 되어 있습니다.</p>
		</div>
	</div>
	<div id="login-footer">
		<address><span class="blind">SK telecom</span>Copyright © SK Telecom. All rights reserved.</address>
	</div>
</div>



<!-- <div id="container" ng-app="app">
	<div id="container" width="100%" height="100%" layout="vertical" vertical-align="middle" horizontal-align="center" ng-app="app">
		<div width="400px" height="300px" layout="vertical" vertical-align="middle" horizontal-align="center" ng-controller="IndexCtrl as indexCtrl">
			<div width="380px" height="40px" layout="horizontal">
				<label for="account" width="100px">아이디</label> 
				<input type="text" id="username" width="100%" ng-model="indexCtrl.user.username">
				<input type="text" id="username" width="100%">
			</div>
			<div width="380px" height="40px" layout="horizontal">
				<label for="password" width="100px">패스워드</label> 
				<input type="password" id="password" width="100%" ng-model="indexCtrl.user.password">
				<input type="password" id="password" width="100%">
			</div>
			<div width="380px" height="40px" layout="horizontal" horizontal-align="right">
				<input type="button" value="로그인" ng-click="indexCtrl.login()">
			</div>
		</div>
	</div>
</div> -->

<script type="text/javascript" src="<c:url value='/js/lib/vendor.min.js'/>"></script>
<script type="text/javascript" src="<c:url value='/js/lib/jquery/jquery.blockUI.js'/>"></script>
<script type="text/javascript" src="<c:url value='/js/lib/jquery/spin.min.js'/>"></script>
<script type="text/javascript" src="<c:url value='/js/lib/jquery/jquery.layout.js'/>"></script>
<script type="text/javascript" src="<c:url value='/js/framework/common/common.js'/>"></script>
<script type="text/javascript" src="<c:url value='/js/apps/index/index-controller.js'/>"></script>

</body>

</html>