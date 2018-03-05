<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags"%>
<%@ page pageEncoding="UTF-8" contentType="text/html; charset=UTF-8"%>

 <!DOCTYPE html>
<html lang="ko">

<head>
    <title>HMS</title>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="<c:url value='/css/ui-grid.min.css'/>">
    <link rel="stylesheet" href="<c:url value='/css/app.min.css'/>">
</head>

<body style="display:none">
    <div id="wrap">
        <header ng-controller="HeaderCtrl as headerCtrl">
        	<div class="header-wrap">
	            <h1 id="main" class="logo">
	                <a ng-click="headerCtrl.reload('/hms#/main-info')" style="cursor: pointer;">HMS</a>
	            </h1>
	            <!-- "gnb -->
	            <nav id="gnb">
	                <h2 class="blind">주요 메뉴</h2>
	                <ul>
	                    <li><a ng-click="headerCtrl.reload('/hms#/group-mgmt-info')" style="cursor: pointer;">Group Management</a></li>
	                    <li><a ng-click="headerCtrl.reload('/hms#/plugin-mgmt-info')" style="cursor: pointer;">Plugin Management</a></li> 
						<li><a ng-click="headerCtrl.reload('/hms#/task-mgmt-info')" style="cursor: pointer;">Task Management</a></li>
						<li><a ng-click="headerCtrl.reload('/hms#/agent-status-info')" style="cursor: pointer;">Agent Status</a></li>
						<li><a ng-click="headerCtrl.reload('/hms#/change-mgmt-info')" style="cursor: pointer;">Change Management</a></li>
						<!-- <li><a ng-click="headerCtrl.reload('/hms#/test-info')" style="cursor: pointer;">Test</a></li> -->
	                </ul>
	            </nav>
	            <!-- //gnb -->
            </div>
        </header>
        
        
        
        <div id="container">
            <ng-view></ng-view>
        </div>
        
        <form id="excelForm" style="display:none">
		</form>
    </div>

     <div id="indicator"></div>
     
    <script type="text/javascript" src="<c:url value='/js/lib/vendor.min.js'/>"></script>
    <script type="text/javascript" src="<c:url value='/js/lib/jquery/spin.min.js'/>"></script>
    <script type="text/javascript" src="<c:url value='/js/lib/jquery/jquery.blockUI.js'/>"></script>
    <script type="text/javascript" src="<c:url value='/js/framework/common/log.js'/>"></script>
   	
   	<script type="text/javascript" src="<c:url value='/js/lib/jquery/jquery-1.11.2.min.js'/>"></script>
    <script type="text/javascript" src="<c:url value='/js/lib/jquery/jquery-ui-1.10.1.custom.min.js'/>"></script>
    <script type="text/javascript" src="<c:url value='/js/lib/jquery/jquery.mousewheel.js'/>"></script>
    <script type="text/javascript" src="<c:url value='/js/lib/jquery/globalize.js'/>"></script>
    <script type="text/javascript" src="<c:url value='/js/lib/jquery/jquery.layout.js'/>"></script>
    <script type="text/javascript" src="<c:url value='/js/lib/jquery/jquery.form.min.js'/>"></script>
    <%-- <script type="text/javascript" src="<c:url value='/js/lib/jquery/jquery.easy-confirm-dialog.js'/>"></script> --%>
    
	<script type="text/javascript" src="<c:url value='/js/framework/common/common.js'/>"></script>
	
    <script>
        var require = {
            urlArgs: "ver=201801171207"
        };
    </script>
    <script type="text/javascript" data-main="/js/apps/main" src="/js/lib/require.js"></script>
	<%-- <script type="text/javascript" src="<c:url value='/js/lib/yaml/yaml.debug.js'/>"></script> --%>
    <script type="text/javascript" src="<c:url value='/js/lib/highcharts/highcharts.js'/>"></script>
    <script type="text/javascript" src="<c:url value='/js/lib/highcharts/highcharts-more.js'/>"></script>
    <script type="text/javascript" src="<c:url value='/js/lib/highcharts/solid-gauge.js'/>"></script>
    
</body>

</html>