package com.skt.hms.group;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.http.entity.StringEntity;
import org.json.JSONObject;
/*import org.supercsv.io.CsvBeanWriter;
import org.supercsv.io.ICsvBeanWriter;
import org.supercsv.prefs.CsvPreference;*/
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

/*import com.google.gson.Gson;
import com.google.gson.stream.JsonReader;*/
import com.mobigen.framework.result.JsonResult;
import com.skt.hms.common.CommonController;
import com.skt.hms.common.model.RestApiModel;
import com.skt.hms.group.model.GroupMgmtSearchModel;
import com.skt.hms.group.model.GroupModel;
import com.skt.hms.group.model.PluginModel;
import com.skt.hms.group.model.TaskModel;
import com.skt.hms.group.model.TrashBinModel;
import com.skt.hms.popup.model.PopupSearchModel;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Controller
@RequestMapping("/group")
public class GroupMgmtController {

	@Autowired
	GroupMgmtService groupMgmtService;

	@Autowired
	CommonController commonController;
	
	/*@Autowired
	private ExcelService excelService;*/
	
	@Value("${spring.profiles}")
	private String profiles;
	
	@SuppressWarnings("unused")
	private String MemberName;
	
	@SuppressWarnings("unused")
	private String MemberHost;
	
	@SuppressWarnings("unused")
	private String RestApiPort;
	
	private String localIP = "211.214.168.102:18181";
	private String devIP = "localhost:18181";
	
	private long timeInterval = 500;
	private long endTimeInterval = 2000;
	
	/**
	 * Group 정보 리스트 조회
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/getGroupList")
	@ResponseBody
	public JsonResult getGroupList() throws Exception {

		JsonResult js = new JsonResult();
		List<GroupModel> result = groupMgmtService.getGroupList();
		js.setData(result);

		return js;
	}
	
	
	/**
	 * Plugin 정보 리스트 조회
	 * @param filter
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/getPluginList.json", method=RequestMethod.POST)
    @ResponseBody
    public JsonResult getPluginList(@RequestBody GroupMgmtSearchModel filter) throws Exception{
    	log.info("### " + filter);
    	
    	JsonResult jr = new JsonResult();
    	List<PluginModel> list = groupMgmtService.getPluginList(filter);

    	jr.setData(list);
    	return jr;
	}
	
	
	/**
	 * Task 정보 리스트 조회
	 * @param filter
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/getTaskList.json", method=RequestMethod.POST)
    @ResponseBody
    public JsonResult getTaskList(@RequestBody GroupMgmtSearchModel filter) throws Exception{
    	log.info("### " + filter);
    	
    	JsonResult jr = new JsonResult();
    	List<TaskModel> list = groupMgmtService.getTaskList(filter);
    	
    	jr.setData(list);
    	return jr;
	}
	
	
	/**
	 * Node 정보 리스트 조회
	 * @param filter
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/getNodeList.json", method=RequestMethod.POST)
    @ResponseBody
    public JsonResult getNodeList(@RequestBody GroupMgmtSearchModel filter) throws Exception{
		// 페이지 인덱스 계산.
    	filter.setPageIndex((filter.getPageIndex() -1) * filter.getPageCount());
    	
    	log.info("### " + filter);
    	
    	JsonResult jr = new JsonResult();
    	List<Map<String,Object>> list = groupMgmtService.getNodeList(filter);
    	int cnt = groupMgmtService.getNodeCount(filter);
    	
    	
    	Map<String, Object> result = new HashMap<String,Object>();
    	result.put("count", cnt);
    	result.put("list", list);
    	jr.setData(result);
    	return jr;
	}
	
	
	/**
	 * Group plugin delete Rest Api call
	 * @param filter
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/deletePlugin.json", method=RequestMethod.POST)
    @ResponseBody
    public JsonResult deletePlugin(@RequestBody RestApiModel filter){
    	log.info("### " + filter);
    	
    	JsonResult jr = new JsonResult();
    	String apiType = null;
    	JSONObject json = new JSONObject();
    	String code = null;
    	
    	try{
    		if("local".equals(profiles) || "test".equals(profiles)){
    			String ip = nodeIPInfo(filter.getNode_name());
    			filter.setIp(ip);
    		}else{
    		}
    		
    		for(int i = 0 ; i < filter.getPluginTypeList().size() ; i++ ){
    			apiType = filter.getTempApiType() + filter.getPluginTypeList().get(i) + "/" + filter.getPluginNameList().get(i) + "/" + filter.getPluginVersionList().get(i);
    			filter.setApiType(apiType);
    			log.info("###Group plugin delete Rest Api " + filter);
        		jr.setData(commonController.deleteRestApiInfo(filter));
        		
        		JSONObject localRest = new JSONObject(jr.getData().toString());
        		
        		code = localRest.getJSONObject("meta").get("code").toString();
    		}
    		
    		if("200".equals(code)){
    			if("local".equals(profiles)){
        			filter.setSyncIp(localIP);
        		}else{
        			filter.setSyncIp(devIP);
        		}
    			
    			
    			json = new JSONObject();
    			json.put("node_name", filter.getNode_name());
    			json.put("type", "plugin");
    			StringEntity entity = new StringEntity(json.toString());
    			log.info("###Group plugin delete Rest Api sync= " + json);
    			Thread.sleep(timeInterval);
    			//O&M Snap Rest Api call(Sync)
        		commonController.postOnMRestApiInfo(filter, entity);
    		}
    		
    		
    	}catch (Exception e) {
    		jr.setErrorMessage(e);
    		e.printStackTrace();
		}
    	return jr;
	}
	
	
	/**
	 * Group task delete Rest Api call
	 * @param filter
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/deleteTask.json", method=RequestMethod.POST)
    @ResponseBody
    public JsonResult deleteTask(@RequestBody RestApiModel filter){
    	log.info("### " + filter);
    	
    	JsonResult jr = new JsonResult();
    	String apiType = null;
    	JSONObject json = new JSONObject();
    	String code = null;
    	
    	try{
    		if("local".equals(profiles) || "test".equals(profiles)){
    			String ip = nodeIPInfo(filter.getNode_name());
    			filter.setIp(ip);
    		}else{
    		}
    		
    		
    		for(int i = 0 ; i < filter.getTaskIdList().size() ; i++ ){
    			apiType = filter.getTempApiType() + filter.getTaskIdList().get(i);
    			filter.setApiType(apiType);
    			log.info("### Group task delete Rest Api= " + filter);
        		jr.setData(commonController.deleteRestApiInfo(filter));
        		
        		JSONObject localRest = new JSONObject(jr.getData().toString());
        		
        		code = localRest.getJSONObject("meta").get("code").toString();
    		}
    		
    		if("200".equals(code)){
    			if("local".equals(profiles)){
        			filter.setSyncIp(localIP);
        		}else{
        			filter.setSyncIp(devIP);
        		}
    			
    			json = new JSONObject();
    			json.put("node_name", filter.getNode_name());
    			json.put("type", "task");
    			StringEntity entity = new StringEntity(json.toString());
    			log.info("### Group task delete Rest Api sync= " + json);
    			Thread.sleep(timeInterval);
    			//O&M Snap Rest Api call(Sync)
        		commonController.postOnMRestApiInfo(filter, entity);
    		}
    		
    		
    	}catch (Exception e) {
    		jr.setErrorMessage(e);
    		e.printStackTrace();
		}
    	return jr;
	}
	
	
	
	/**
	 * Group node delete Rest Api call
	 * @param filter
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/deleteNode.json", method=RequestMethod.POST)
    @ResponseBody
    public JsonResult deleteNode(@RequestBody RestApiModel filter){
    	log.info("### " + filter);
    	
    	JsonResult jr = new JsonResult();
    	JSONObject json = new JSONObject();
    	String code = null;
    	
    	try{
    		if("local".equals(profiles) || "test".equals(profiles)){
    			String ip = nodeIPInfo(filter.getNode_name());
    			filter.setIp(ip);
    		}else{
    		}
    		
    		
    		for(int i = 0 ; i < filter.getNodeNameList().size() ; i++ ){
    			json.put("member_name", filter.getNodeNameList().get(i));
        		StringEntity entity = new StringEntity(json.toString());
        		log.info("### Group node delete Rest Api filter= " + filter);
        		jr.setData(commonController.deleteRestApiInfo(filter,entity));
        		
        		JSONObject localRest = new JSONObject(jr.getData().toString());
        		
        		code = localRest.getJSONObject("meta").get("code").toString();
    		}
    		
    		if("200".equals(code)){
    			if("local".equals(profiles)){
        			filter.setSyncIp(localIP);
        		}else{
        			filter.setSyncIp(devIP);
        		}
    			
    			json = new JSONObject();
    			
    			for(int i = 0 ; i < filter.getNodeNameList().size() ; i++ ){
	    			json.put("agreement_name", filter.getGroupName());
	    			json.put("node_name", filter.getNodeNameList().get(i));
	    			json.put("type", "agreement_management");
	    			StringEntity entity = new StringEntity(json.toString());
	    			log.info("###Group node delete Rest Api sync= " + json);
	    			Thread.sleep(timeInterval);
	    			//O&M Snap Rest Api call(Sync)
	        		commonController.postOnMRestApiInfo(filter, entity);
    			}
    		}
    		
    	}catch (Exception e) {
    		jr.setErrorMessage(e);
			e.printStackTrace();
		}
    	return jr;
	}

	/**
	 * task stop Rest Api call
	 * @param filter
	 * @return
	 */
	@RequestMapping(value = "/stopTask.json", method=RequestMethod.POST)
    @ResponseBody
    public JsonResult stopTask(@RequestBody RestApiModel filter){
    	log.info("### " + filter);
    	
    	JsonResult jr = new JsonResult();
    	JSONObject json = new JSONObject();
    	String code = null;
    	
    	try{
    		if("local".equals(profiles) || "test".equals(profiles)){
    			String ip = nodeIPInfo(filter.getNode_name());
    			filter.setIp(ip);
    		}else{
    			
    		}
    		
    		StringEntity entity = new StringEntity("");
    		log.info("### task stop Rest Api filter= " + filter);
    		jr.setData(commonController.putRestApiInfo(filter,entity));
    		
    		JSONObject localRest = new JSONObject(jr.getData().toString());
    		code = localRest.getJSONObject("meta").get("code").toString();
    		
    		if("200".equals(code)){
    			if("local".equals(profiles)){
        			filter.setSyncIp(localIP);
        		}else{
        			filter.setSyncIp(devIP);
        		}
    			
    			json = new JSONObject();
    			json.put("node_name", filter.getNode_name());
    			json.put("type", "task");
    			StringEntity entity_2 = new StringEntity(json.toString());
    			log.info("###task stop Rest Api sync= " + json);
    			Thread.sleep(timeInterval);
    			//O&M Snap Rest Api call(Sync)
        		commonController.postOnMRestApiInfo(filter, entity_2);
    		}
    		
    		
    	}catch (Exception e) {
    		jr.setErrorMessage(e);
    		e.printStackTrace();
		}
    	return jr;
	}
	
	/**
	 * task start Rest Api call
	 * @param filter
	 * @return
	 */
	@RequestMapping(value = "/startTask.json", method=RequestMethod.POST)
    @ResponseBody
    public JsonResult startTask(@RequestBody RestApiModel filter){
    	log.info("### " + filter);
    	
    	JsonResult jr = new JsonResult();
    	JSONObject json = new JSONObject();
    	String code = null;
    	
    	try{
    		if("local".equals(profiles) || "test".equals(profiles)){
    			String ip = nodeIPInfo(filter.getNode_name());
    			filter.setIp(ip);
    		}else{
    			
    		}
    		
    		StringEntity entity = new StringEntity("");
    		log.info("### task start Rest Api filter= " + filter);
    		jr.setData(commonController.putRestApiInfo(filter,entity));
    		
    		JSONObject localRest = new JSONObject(jr.getData().toString());
    		code = localRest.getJSONObject("meta").get("code").toString();
    		
    		if("200".equals(code)){
    			if("local".equals(profiles)){
        			filter.setSyncIp(localIP);
        		}else{
        			filter.setSyncIp(devIP);
        		}
    			
    			json = new JSONObject();
    			json.put("node_name", filter.getNode_name());
    			json.put("type", "task");
    			StringEntity entity_2 = new StringEntity(json.toString());
    			log.info("###task start Rest Api= " + json);
    			Thread.sleep(timeInterval);
    			//O&M Snap Rest Api call(Sync)
        		commonController.postOnMRestApiInfo(filter, entity_2);
    		}
    		
    		
    	}catch (Exception e) {
    		jr.setErrorMessage(e);
    		e.printStackTrace();
		}
    	return jr;
	}
	
	
	
	
	
	
	
	
	
	
	
	
	
	/**
	 * plugin excel download
	 * @param request
	 * @param response
	 * @throws Exception
	 */
	/*@SuppressWarnings("unchecked")
	@RequestMapping(value = "/excelDownloadPlugin.json")
	public void excelDownloadHSSF(HttpServletRequest request, HttpServletResponse response) throws Exception {
		
		String param = "";
		if(request.getParameter("param") != null){
			param = request.getParameter("param");
		}
		
		String fileType = "";
		if(request.getParameter("fileType") != null){
			fileType = request.getParameter("fileType");
		}
		
		//param 에서 model 추출
		JsonReader reader = new JsonReader(new StringReader(param));
		reader.setLenient(true);
		
		Gson gson = new Gson();
		GroupMgmtSearchModel groupMgmtSearchModel = gson.fromJson(reader, GroupMgmtSearchModel.class);
		if(fileType.equals("csv")){
			groupMgmtSearchModel.setLimit(65000);  // csv 한계
		}else{
			groupMgmtSearchModel.setLimit(65000);  // excel 한계
		}
		
		// excel data
		Object excelData = (Object)groupMgmtService.getPluginList(groupMgmtSearchModel);
		
		
		Object objJson1 = new Gson().toJson(excelData);
		PluginModel eventAnalysis = new Gson().fromJson(objJson1.toString(), PluginModel.class);
		
		List<? extends Object> excelDataList = eventAnalysis.getPluginList();
		List<Object> excelDataObjList = (List<Object>) excelDataList;
		
		
		ExcelRequest excelRequest = new ExcelRequest();
		excelRequest.setFileName("Plugin List");
			
		// Excel Header 
		String[] headerName = {"Group", "Name", "Version", "Type", "Signed", "Status", "Loaded timestamp", "Href"};
		String[] fieldName = {"agreementName", "pluginName", "pluginVersion", "pluginType", "pluginSigned", "pluginStatus", "pluginLoadedTimestamp", "pluginHref"};
		String[] dataType = {"string", "string", "string", "string", "string", "string", "string", "string"};
		
		List<Map<String, String>> headers = new ArrayList<Map<String, String>>();
		headers = commonController.makeExcelHeader(headers, headerName, fieldName, dataType);
		excelRequest.setHeaders(headers);
		
		// Header CSV
		String[] headerCSV = {"agreementName", "pluginName", "pluginVersion", "pluginType", "pluginSigned", "pluginStatus", "pluginLoadedTimestamp", "pluginHref"};
		commonController.makeHSSFExcelCSV(request, response, excelRequest, excelDataObjList, fileType, headerName, headerCSV);
	}*/
	
	
	/*@RequestMapping(value = "/excelDownload.json")
	public void excelDownload(HttpServletRequest request, HttpServletResponse response) throws Exception {
		//임의의 VO가 되주는 MAP 객체
		Map<String,Object>map=null;
		//가상 DB조회후 목록을 담을 LIST객체
		ArrayList<Map<String,Object>> list=new ArrayList<Map<String,Object>>();
		ArrayList<String> columnList=new ArrayList<String>();
		
		String param = "";
		if(request.getParameter("param") != null){
			param = request.getParameter("param");
		}
		
		
		list = groupMgmtService.getExcelPluginList(param);
		
		
		//DB조회후 데이터를 담았다는 가상의 데이터
		for(int i=0;i<10;i++){
		    map=new HashMap<String,Object>();
		    map.put("seq", i+1);
		    map.put("title", "제목이다"+i);
		    map.put("content", "내용입니다"+i);
		    list.add(map);
		}
		//MAP의 KEY값을 담기위함
		if(list !=null &&list.size() >0){
		    //LIST의 첫번째 데이터의 KEY값만 알면 되므로
		    Map<String,Object>m=list.get(0);
		    //MAP의 KEY값을 columnList객체에 ADD
		    for(String k : m.keySet()){
		        columnList.add(k);
		    }
		}
		//1차로 workbook을 생성
		XSSFWorkbook workbook=new XSSFWorkbook();
		//2차는 sheet생성
		XSSFSheet sheet=workbook.createSheet("시트명");
		//엑셀의 행
		XSSFRow row=null;
		//엑셀의 셀
		XSSFCell cell=null;
		//임의의 DB데이터 조회
		if(list !=null &&list.size() >0){
		    int i=0;
		    for(Map<String,Object>mapobject : list){
		        // 시트에 하나의 행을 생성한다(i 값이 0이면 첫번째 줄에 해당)
		        row=sheet.createRow((short)i);
		        i++;
		        if(columnList !=null &&columnList.size() >0){
		            for(int j=0;j<columnList.size();j++){
		                //생성된 row에 컬럼을 생성한다
		                cell=row.createCell(j);
		                //map에 담긴 데이터를 가져와 cell에 add한다
		                cell.setCellValue(String.valueOf(mapobject.get(columnList.get(j))));
		            }
		        }
		    }
		}
		
		//XSSFWorkbook hswk = null;
		ServletOutputStream out = null;
		
		//hswk = excelService.makeExcelDataHSSF(excelRequest, excelDataObjList);
		
		response.setContentType("application/vnd.ms-excel:UTF-8");
		response.setHeader("Content-Disposition", "attachment; filename=" + "test.xls"+";");
		
		out = response.getOutputStream();
		workbook.write(out);
		
		if (workbook != null){
			workbook.close();
		}
		
		if (out != null){
			out.close();
		}
	}*/

	
	/**
	 * node 전체 삭제시 해당 그룹에 있는 task, plugin도 전부 삭제처리
	 * @param filter
	 * @return
	 */
	@SuppressWarnings("unchecked")
	@RequestMapping(value = "/deleteAllNode.json", method=RequestMethod.POST)
    @ResponseBody
    public JsonResult deleteAllNode(@RequestBody RestApiModel filter){
    	log.info("### " + filter);
    	
    	JsonResult jrTask = new JsonResult();
    	JsonResult jrPlugin = new JsonResult();
    	JsonResult jrNode = new JsonResult();
    	
    	JSONObject json = new JSONObject();
    	JSONObject taskJson = new JSONObject();
    	JSONObject pluginJson = new JSONObject();
    	JSONObject nodeJson = new JSONObject();
    	
    	String taskCode = null;
    	String pluginCode = null;
    	String nodeCode = null;
    	
    	try{
    		//---------------------- task delete Start----------------------------------------------------
    		if("local".equals(profiles) || "test".equals(profiles)){
    			String ip = nodeIPInfo(filter.getNode_name());
    			filter.setIp(ip);
    		}else{
    		}
    		
    		GroupMgmtSearchModel taskModel = new GroupMgmtSearchModel();
    		taskModel.setGroupId(filter.getGroupId());
    		
    		List<TaskModel> taskList = groupMgmtService.getTaskList(taskModel);
    		
    		for(int i = 0; i < taskList.size(); i++){
    			//task 동작중이면 중지시켜서 삭제해야함.
    			if("Running".equals(taskList.get(i).getTaskState())){
    				//task 중지
    				filter.setApiType("/v1/tasks/" + taskList.get(i).getTaskId() + "/stop");
    				log.info("### task stop Rest Api filter= " + filter);
    				stopTask(filter);
    				
    				//task 삭제
    				filter.setApiType("");
    				filter.setTempApiType("");
    				filter.setTempApiType("/v1/tasks/");
    				filter.setApiType(filter.getTempApiType() + taskList.get(i).getTaskId());
    				log.info("### task delete Rest Api filter= " + filter);
    				jrTask.setData(commonController.deleteRestApiInfo(filter));
            		JSONObject localRest = new JSONObject(jrTask.getData().toString());
            		taskCode = localRest.getJSONObject("meta").get("code").toString();
    				
    			}else{
    				//task 삭제
    				filter.setApiType("");
    				filter.setTempApiType("");
    				filter.setTempApiType("/v1/tasks/");
    				filter.setApiType(filter.getTempApiType() + taskList.get(i).getTaskId());
    				log.info("### task delete Rest Api filter= " + filter);
    				jrTask.setData(commonController.deleteRestApiInfo(filter));
            		JSONObject localRest = new JSONObject(jrTask.getData().toString());
            		taskCode = localRest.getJSONObject("meta").get("code").toString();
    			}
    			
    			if("200".equals(taskCode)){
    				if("local".equals(profiles)){
            			filter.setSyncIp(localIP);
            		}else{
            			filter.setSyncIp(devIP);
            		}
        			
    				taskJson = new JSONObject();
    				taskJson.put("node_name", filter.getNode_name());
    				taskJson.put("type", "task");
        			StringEntity entity = new StringEntity(taskJson.toString());
        			log.info("###sync= " + json);
        			Thread.sleep(timeInterval);
        			//O&M Snap Rest Api call(Sync)
        			log.info("### task delete Rest Api sync= " + taskJson);
            		commonController.postOnMRestApiInfo(filter, entity);
    			}else{
    				throw new Exception("Failed to delete Task");
    			}
    		}
    		//---------------------- task delete End----------------------------------------------------
    		
    		
    		
    		//TODO: skt 매니저님으로 부터 plugin 삭제는 제외함.(2017.08.29)
    		//---------------------- plugin delete Start----------------------------------------------------
    		/*GroupMgmtSearchModel pluginModel = new GroupMgmtSearchModel();
    		pluginModel.setGroupId(filter.getGroupId());
    		
    		List<PluginModel> pluginList = groupMgmtService.getPluginDelList(pluginModel);
    		
    		for(int i = 0; i < pluginList.size(); i++){
    			if("local".equals(profiles)){
        			String ip = nodeIPInfo(filter.getNode_name());
        			filter.setIp(ip);
        		}else{
        		}
    			
    			//plugin 삭제
				filter.setTempApiType("/v1/plugins/");
				filter.setApiType(filter.getTempApiType() + pluginList.get(i).getPluginType() + "/"+ pluginList.get(i).getPluginName() + "/" + pluginList.get(i).getPluginVersion());
				log.info("### plugin delete Rest Api= " + filter);
				jrPlugin.setData(commonController.deleteRestApiInfo(filter));
        		JSONObject localRest = new JSONObject(jrPlugin.getData().toString());
        		pluginCode = localRest.getJSONObject("meta").get("code").toString();
        		
        		if("200".equals(pluginCode)){
    				if("local".equals(profiles)){
            			filter.setSyncIp(localIP);
            		}else{
            			filter.setSyncIp(devIP);
            		}
        			
    				pluginJson = new JSONObject();
    				pluginJson.put("node_name", filter.getNode_name());
    				pluginJson.put("type", "plugin");
        			StringEntity entity = new StringEntity(pluginJson.toString());
        			log.info("###plugin delete Rest sync= " + json);
        			Thread.sleep(timeInterval);
        			//O&M Snap Rest Api call(Sync)
            		commonController.postOnMRestApiInfo(filter, entity);
    			}else{
    				throw new Exception("Failed to delete Plugin");
    			}
    		}*/
    		//---------------------- plugin delete End----------------------------------------------------
    		
    		
    		
    		
    		//---------------------- node delete Start----------------------------------------------------
    		if("local".equals(profiles) || "test".equals(profiles)){
    			String ip = nodeIPInfo(filter.getNode_name());
    			filter.setIp(ip);
    		}else{
    		}
    		
    		for(int i = 0 ; i < filter.getNodeNameList().size() ; i++ ){
				filter.setApiType("/v1/tribe/agreements/" + filter.getGroupName() + "/leave");
    			json.put("member_name", filter.getNodeNameList().get(i));
        		StringEntity entity = new StringEntity(json.toString());
        		log.info("###node delete Rest api= " + filter);
        		jrNode.setData(commonController.deleteRestApiInfo(filter,entity));
        		
        		JSONObject localRest = new JSONObject(jrNode.getData().toString());
        		
        		nodeCode = localRest.getJSONObject("meta").get("code").toString();
        		
        		if("200".equals(nodeCode)){
        			if("local".equals(profiles)){
            			filter.setSyncIp(localIP);
            		}else{
            			filter.setSyncIp(devIP);
            		}
        			
        			nodeJson = new JSONObject();
        			
    				nodeJson.put("agreement_name", filter.getGroupName());
    				nodeJson.put("node_name", filter.getNodeNameList().get(i));
    				nodeJson.put("type", "agreement_management");
	    			StringEntity entity_2 = new StringEntity(nodeJson.toString());
	    			log.info("###node delete Rest sync= " + nodeJson);
	    			Thread.sleep(timeInterval);
	    			//O&M Snap Rest Api call(Sync)
	        		commonController.postOnMRestApiInfo(filter, entity_2);
        		}else{
    				throw new Exception("Failed to delete Node");
    			}
    		}
    		//---------------------- node delete End----------------------------------------------------

    		Thread.sleep(endTimeInterval);
    		
    		
    		
    	}catch (Exception e) {
    		jrNode.setErrorMessage(e);
			e.printStackTrace();
		}
    	return jrNode;
	}
	
	
	
	
	private String nodeIPInfo(String nodeName){
		String nodeIp = null;
		
		if("secure02".equals(nodeName)){
			nodeIp = "211.214.168.102:3811";
		}else if("secure03".equals(nodeName)){
			nodeIp = "211.214.168.102:3812";
		}else if("secure04".equals(nodeName)){
			nodeIp = "211.214.168.102:3813";
		}else if("secure05".equals(nodeName)){
			nodeIp = "211.214.168.102:3814";
		}else{
			//nodeIp = "211.214.168.102:3811";
		}
		
		return nodeIp;
	}
	
	
	
	//rest api sync
	@RequestMapping(value = "/sync.json", method=RequestMethod.POST)
    @ResponseBody
    public JsonResult sync(@RequestBody RestApiModel filter){
    	log.info("### " + filter);
    	
    	JsonResult jr = new JsonResult();
    	JSONObject json = new JSONObject();
    	
    	try{
    		if("local".equals(profiles)){
    			filter.setSyncIp(localIP);
    		}else{
    			filter.setSyncIp(devIP);
    		}
    		
			json = new JSONObject();
			if(filter.getAgreement_name() != null){
				json.put("agreement_name", filter.getAgreement_name());
			}
			if(filter.getNode_name() != null){
				json.put("node_name", filter.getNode_name());
			}
			if(filter.getType() != null){
				json.put("type", filter.getType());
			}
			StringEntity entity = new StringEntity(json.toString());
			
			//Thread.sleep(timeInterval);
			//O&M Snap Rest Api call(Sync)
			jr.setData(commonController.postOnMRestApiInfo(filter, entity));
    		
    		
    	}catch (Exception e) {
    		jr.setErrorMessage(e);
    		e.printStackTrace();
		}
    	return jr;
	}
	
	
	/**
	 * node trash bin move
	 * @param filter
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/setNodeTrashBin")
	@ResponseBody
	public JsonResult setNodeTrashBin(@RequestBody GroupMgmtSearchModel filter) throws Exception{

		JsonResult js = new JsonResult();
		int result = groupMgmtService.setNodeTrashBin(filter);
		js.setData(result);
		return js;
	}
	
	
	/**
	 * Node Trash Bin List 이력 정보 조회
	 * @param filter
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/getNodeTrashBinHistory.json", method=RequestMethod.POST)
    @ResponseBody
    public JsonResult getNodeTrashBinHistory(@RequestBody GroupMgmtSearchModel filter) throws Exception{
    	JsonResult jr = new JsonResult();
    	
    	List<TrashBinModel> list = groupMgmtService.getNodeTrashBinHistory(filter);
    	jr.setData(list);
    	return jr;
	}
	
	
	/**
	 * node Recovery 작업
	 * @param filter
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/setNodeRecovery")
	@ResponseBody
	public JsonResult setNodeRecovery(@RequestBody GroupMgmtSearchModel filter) throws Exception{

		JsonResult js = new JsonResult();
		int result = groupMgmtService.setNodeRecovery(filter);
		js.setData(result);
		return js;
	}
	
	
}
