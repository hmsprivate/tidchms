<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags"%>

<div id="content" class="pop-wrap w550" style="top:200px;left:50%;margin-left:-275px">				
	<div class="pop-header"><h3 class="title">File upload</h3></div>
	<!-- popContent -->
	<div class="pop-content">
		<!-- center-box : file-attach -->
		<div class="center-box round-border-type h180">
			<div class="center-inner">
				<div class="file-attach">
					<input type="text" id="fileName" readonly="readonly">
					<div class="file-btn">
						<button type="button" class="btn-cr">Find file</button>
						<input type="file" file-model="myFile" ng-model="file" class="btn-hide" onchange="javascript: document.getElementById('fileName').value = this.value">
					</div>
				</div>
			</div>
		</div>					
		<!-- center-box : file-attach  -->
		<!-- btns-area -->
		<div class="btns-area">
			<button type="button" ng-click="uploadFile()" class="btn-cr">Apply</button>
			<button type="button" class="btn-gy" ng-click="closeFileUploadPopup()">Cancel</button>
		</div>
		<!-- //btns-area -->
	</div>
	<!-- //popContent -->	
	<button type="button" class="btn-close" title="close" ng-click="closeFileUploadPopup()">close</button>
</div>


