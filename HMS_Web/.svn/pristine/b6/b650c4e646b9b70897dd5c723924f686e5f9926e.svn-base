<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags"%>
<%@ page pageEncoding="UTF-8" contentType="text/html; charset=UTF-8"%>

<link rel="stylesheet" href="<c:url value='/css/rack-diagram.css'/>">

<div layout="horizontal" width="100%" height="100%" horizontal-align="center" vertical-align="middle" vertical-scrollbar-policy="auto" horizontal-scrollbar-policy="hidden" ng-controller="TestCtrl as testCtrl">
	
	<div width="100%" height="100%" layout="vertical" horizontal-align="center" vertical-align="middle">
		<rack-diagram-directive 
			class="rack-diagram" 
			height="100%" 
			width="400px" 
			data="testCtrl.data"
			add-rack-complete="testCtrl.addRackComplete(rack)"
			add-node-complete="testCtrl.addNodeComplete(node)"
			update-rack-complete="testCtrl.updateRackComplete(rack)"
			update-node-complete="testCtrl.updateNodeComplete(rack)"
			select-rack="testCtrl.selectRack(rack)"
			select-node="testCtrl.selectNode(node)"
			external="testCtrl.rackDiagramControl">
		</rack-diagram-directive>
	</div>
	
	<div width="100%" height="100%" layout="vertical" padding-top="15px" gap="10px">
		<div width="100%" height="300px" layout="vertical" padding-left="5px" padding-top="5px" style="border: solid 1px">
			<h2> Add Rack</h2>
			<div width="100%" height="30px" layout="horizontal">
				<label width="100px">category</label>
				<select width="150px" name="category" ng-model="rack.rackColumnName">
					<option value="node">node</option>
					<option value="disable">disable</option>
					<option value="reserved">reserved</option>
				</select>			
			</div>
			<div width="100%" height="30px" layout="horizontal">
				<label width="100px">type</label>
				<select width="150px" name="type" ng-model="rack.hwType">
					<option value="009">blade-enclosure</option>
					<option value="010">blade-server</option>
					<option value="001">bm-server</option>
					<option value="003">switch</option>
					<option value="004">storage</option>
				</select>			
			</div>
			<div width="100%" height="30px" layout="horizontal">
				<label width="100px">horizontal (0.5 ~)</label>
				<input type="number" width="150px" ng-model="rack.horizontal">			
			</div>
			<div width="100%" height="30px" layout="horizontal">
				<label width="100px">vertical (0.5 ~)</label>
				<input type="number" width="150px" ng-model="rack.vertical">			
			</div>
			<div width="100%" height="30px" layout="horizontal">
				<label width="100px">height (1 ~ 99)</label>
				<input type="number" width="150px" min="1" max="99" ng-model="rack.unitSize">			
			</div>
			<div width="100%" height="30px" layout="horizontal">
				<label width="100px">width (0.5 / 1)</label>
				<input type="number" width="150px" min="0.5" max="1" ng-model="rack.width">			
			</div>
			<div width="100%" height="30px" layout="horizontal">
				<label width="100px">align</label>
				<select width="150px" name="align" ng-model="rack.align">
					<option value="left">left</option>
					<option value="right">right</option>
				</select>		
			</div>
			<div width="100%" height="30px" layout="horizontal">
				<label width="100px">title</label>
				<input type="text" width="150px" ng-model="rack.hwName">			
			</div>
			<div width="100%" height="30px" layout="horizontal" gap="5px">
				<div id="add-rack" ng-class="customDragClass()" width="150px"
					height="20px" style="background-color: #EEEEEE">::Drag Add</div>
				<input type="button" value="getData" width="150px" ng-click="testCtrl.getData()">
			</div>
		</div>
		
		<div width="100%" height="100%" layout="vertical" padding-left="5px" padding-top="5px" style="border: solid 1px" gap="5px">
			<h2>Log</h2>
			<ul width="100%" height="100%" style="overflow: auto">
				<li ng-repeat="m in testCtrl.logs track by $index"><p><b>{{$index}}</b>: {{m}}</p><br></li>
			</ul>
		</div>
	</div>
</div>