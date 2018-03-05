package com.skt.hms.popup;

import java.io.File;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.TimeZone;

import org.apache.http.entity.StringEntity;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.mobigen.framework.result.JsonResult;
import com.mobigen.framework.service.file.model.FileUploadRequest;
import com.skt.hms.agent.model.AgentStatusModel;
import com.skt.hms.common.CommonController;
import com.skt.hms.common.model.RestApiModel;
import com.skt.hms.popup.model.PopupModel;
import com.skt.hms.popup.model.PopupSearchModel;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Controller
@Component
@RequestMapping("/popup")
public class PopupController {

	@Autowired
	PopupService popupService;
	
	@Autowired
	CommonController commonController;
	
	@Value("${spring.profiles}")
	private String profiles;
	
	@SuppressWarnings("unused")
	private String MemberName;
	
	@SuppressWarnings("unused")
	private String MemberHost;
	
	@SuppressWarnings("unused")
	private String RestApiPort;
	
	@SuppressWarnings("unused")
	private String localIP = "211.214.168.102:18181";
	
	@SuppressWarnings("unused")
	private String devIP = "localhost:18181";
	
	private long timeInterval = 1000;
	
	
	/**
	 * Node 상세 정보 대분류 category 리스트 조회
	 * @param filter
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/getCategoryList")
	@ResponseBody
	public JsonResult getCategoryList(@RequestBody PopupSearchModel filter) throws Exception{

		JsonResult js = new JsonResult();
		List<Map<String,Object>> result = popupService.getCategoryList(filter);
		js.setData(result);

		return js;
	}
	
	/**
	 * Node 상세 정보 중분류 category 리스트 조회
	 * @param filter
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/getCategoryList2", method=RequestMethod.POST)
	@ResponseBody
	public JsonResult getCategoryList2(@RequestBody PopupSearchModel filter) throws Exception{

		JsonResult js = new JsonResult();
		List<Map<String,Object>> result = popupService.getCategoryList2(filter);
		js.setData(result);

		return js;
	}

	/**
	 * Node 상세 정보 리스트 조회
	 * @param filter
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/getNodeDetailList.json", method=RequestMethod.POST)
    @ResponseBody
    public JsonResult getNodeDetailList(@RequestBody PopupSearchModel filter) throws Exception{
    	log.info("### " + filter);
    	
    	JsonResult jr = new JsonResult();
    	
    	List<PopupModel> list = popupService.getNodeDetailList(filter);
    	
    	jr.setData(list);
    	return jr;
	}
	
	
	/**
	 * plugin Popup 리스트 조회
	 * @param filter
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/getPluginPopupList.json")
    @ResponseBody
    public JsonResult getPluginPopupList(@RequestBody PopupSearchModel filter) throws Exception{
    	log.info("### " + filter);
    	
    	JsonResult jr = new JsonResult();
    	List<PopupModel> list = popupService.getPluginPopupList(filter);
    	
    	jr.setData(list);
    	return jr;
	}
	
	/**
	 * task Popup 리스트 조회
	 * @param filter
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/getTaskPopupList.json")
    @ResponseBody
    public JsonResult getTaskPopupList(@RequestBody PopupSearchModel filter) throws Exception{
    	log.info("### " + filter);
    	
    	JsonResult jr = new JsonResult();
    	List<PopupModel> list = popupService.getTaskPopupList(filter);
    	
    	jr.setData(list);
    	return jr;
	}

	
	/**
	 * node Popup 리스트 조회
	 * @param filter
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/getNodePopupList.json")
    @ResponseBody
    public JsonResult getNodePopupList(@RequestBody PopupSearchModel filter) throws Exception{
		// 페이지 인덱스 계산.
    	filter.setPageIndex((filter.getPageIndex() -1) * filter.getPageCount());
    	
    	log.info("### " + filter);
    	
    	JsonResult jr = new JsonResult();
    	List<Map<String,Object>> list = popupService.getNodePopupList(filter);
    	int cnt = popupService.getNodePopupCount(filter);
    	
    	
    	Map<String, Object> result = new HashMap<String,Object>();
    	result.put("count", cnt);
    	result.put("list", list);
    	jr.setData(result);
    	return jr;
	}
	
	
	/**
	 * Plugin Rest Api call
	 * @param filter
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/getPluginRestCall.json", method=RequestMethod.POST)
    @ResponseBody
    public JsonResult getPluginRestCall(@RequestBody RestApiModel filter){
    	log.info("### " + filter);
    	
    	JsonResult jr = new JsonResult();
    	
    	try{
    		if("local".equals(profiles) || "test".equals(profiles)){
    			String ip = nodeIPInfo(filter.getNode_name());
    			filter.setIp(ip);
    		}else{
    			
    		}
    		log.info("### Plugin Rest Api call= " + filter);
    		
    		jr.setData(commonController.getRestApiInfo(filter));
    	}catch (Exception e) {
    		jr.setErrorMessage(e.getMessage());
		}
    	
    	return jr;
	}
	
	/**
	 * Task Rest Api call
	 * @param filter
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/getTaskRestCall.json", method=RequestMethod.POST)
    @ResponseBody
    public JsonResult getTaskRestCall(@RequestBody RestApiModel filter){
    	log.info("### " + filter);
    	
    	JsonResult jr = new JsonResult();
    	
    	try{
    		if("local".equals(profiles) || "test".equals(profiles)){
    			String ip = nodeIPInfo(filter.getNode_name());
    			filter.setIp(ip);
    		}else{
    			
    		}
    		log.info("### Task Rest Api call= " + filter);
    		jr.setData(commonController.getRestApiInfo(filter));
    	}catch (Exception e) {
    		jr.setErrorMessage(e.getMessage());
		}
    	
    	return jr;
	}
	
	
	/**
	 * Group 정보 리스트 조회
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/getGroupList")
	@ResponseBody
	public JsonResult getGroupList() throws Exception {

		JsonResult js = new JsonResult();
		List<PopupModel> result = popupService.getGroupList();
		js.setData(result);

		return js;
	}
	
	
	/**
	 * Compare Popup 조회
	 * @param filter
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/getComparePopupList.json" , method=RequestMethod.POST)
    @ResponseBody
    public JsonResult getComparePopupList(@RequestBody PopupSearchModel filter) throws Exception{
    	log.info("### " + filter);
    	
    	JsonResult jr = new JsonResult();
    	List<Map<String,Object>> hmsList = popupService.getHmsCompareList(filter);
    	List<Map<String,Object>> cmdbList = popupService.getCmdbCompareList(filter);
    	
    	
    	Map<String, Object> result = new HashMap<String,Object>();
    	result.put("hmsList", hmsList);
    	result.put("cmdbList", cmdbList);
    	jr.setData(result);
    	return jr;
	}
	
	
	/**
	 * Group Add Rest Api call
	 * @param filter
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/createGroup.json", method=RequestMethod.POST)
    @ResponseBody
    
    public JsonResult createGroup(@RequestBody RestApiModel filter){
    	log.info("### " + filter);
    	
    	JsonResult jr = new JsonResult();
    	JSONObject json = new JSONObject();

    	try{
    		//노드 정보 조회
    		PopupModel result = popupService.getNodeInfo();
    		
			MemberHost = result.getMemberHost();
			RestApiPort = result.getRestApiPort();
			MemberName = result.getMemberName();
			
    		if("local".equals(profiles) || "test".equals(profiles)){
    			String ip = nodeIPInfo(MemberName);
    			filter.setIp(ip);
    		}else{
    			filter.setIp(MemberHost + ":" + RestApiPort);
    		}
    		
    		
    		json.put("name", filter.getGroupName());  
    		StringEntity entity = new StringEntity(json.toString());
    		log.info("### Group Add Rest Api call= " + filter);
    		log.info("### Group Add Rest Api call param= " + json);
    		jr.setData(commonController.postRestApiInfo(filter, entity));
    		
    		
    		JSONObject localRest = new JSONObject(jr.getData().toString());
    		
    		String code = localRest.getJSONObject("meta").get("code").toString();
    		
    		if("200".equals(code)){
    			if("local".equals(profiles)){
        			filter.setSyncIp(localIP);
        		}else{
        			filter.setSyncIp(devIP);
        		}
    			
    			
    			json = new JSONObject();
    			json.put("node_name", MemberName);
    			json.put("type", "agreement_list");
        		entity = new StringEntity(json.toString());
        		log.info("###Group Add Rest Api sync= " + json);
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
	 * Group delete Rest Api call
	 * @param filter
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/delGroup.json", method=RequestMethod.POST)
    @ResponseBody
    public JsonResult delGroup(@RequestBody RestApiModel filter){
    	log.info("### " + filter);
    	
    	JsonResult jr = new JsonResult();
    	JSONObject json = new JSONObject();
    	
    	try{
    		//노드 정보 조회
    		PopupModel result = popupService.getNodeInfo();
    		
			MemberHost = result.getMemberHost();
			RestApiPort = result.getRestApiPort();
			MemberName = result.getMemberName();
    		
    		if("local".equals(profiles) || "test".equals(profiles)){
    			String ip = nodeIPInfo(MemberName);
    			filter.setIp(ip);
    		}else{
    			filter.setIp(MemberHost + ":" + RestApiPort);
    		}
    		
    		log.info("### Group delete Rest api call filter= " + filter);
    		
    		jr.setData(commonController.deleteRestApiInfo(filter));
    		
    		JSONObject localRest = new JSONObject(jr.getData().toString());
    		
    		String code = localRest.getJSONObject("meta").get("code").toString();
    		
    		if("200".equals(code)){
    			if("local".equals(profiles)){
        			filter.setSyncIp(localIP);
        		}else{
        			filter.setSyncIp(devIP);
        		}
    			
    			json = new JSONObject();
    			json.put("node_name", MemberName);
    			json.put("type", "agreement_list");
    			StringEntity entity = new StringEntity(json.toString());
    			
    			log.info("###Group delete Rest sync= " + json);
    			
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
	 * Group node add Rest Api call
	 * @param filter
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/addNode.json", method=RequestMethod.POST)
    @ResponseBody
    public JsonResult addNode(@RequestBody RestApiModel filter){
    	log.info("### " + filter);
    	
    	JsonResult jr = new JsonResult();
    	JSONObject json = new JSONObject();
    	JSONObject json_2 = new JSONObject();
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
        		
        		log.info("### Group node add Rest Api filter= " + filter);
        		log.info("### Group node add Rest Api param= " + json);
        		
        		jr.setData(commonController.putRestApiInfo(filter,entity));
        		
        		JSONObject localRest = new JSONObject(jr.getData().toString());
        		
        		code = localRest.getJSONObject("meta").get("code").toString();
    		}
    		
    		if("200".equals(code)){
    			if("local".equals(profiles)){
        			filter.setSyncIp(localIP);
        		}else{
        			filter.setSyncIp(devIP);
        		}
    			
    			json_2 = new JSONObject();
    			for(int i = 0 ; i < filter.getNodeNameList().size() ; i++ ){
	    			json_2.put("agreement_name", filter.getGroupName());
	    			json_2.put("node_name", filter.getNodeNameList().get(i));
	    			json_2.put("type", "agreement_management");
	    			StringEntity entity_2 = new StringEntity(json_2.toString());
	    			log.info("###Group node add Rest Api sync= " + json_2);
	    			Thread.sleep(timeInterval);
	    			//O&M Snap Rest Api call(Sync)
	        		commonController.postOnMRestApiInfo(filter, entity_2);
    			}
    		}
    		
    	}catch (Exception e) {
    		jr.setErrorMessage(e);
			e.printStackTrace();
		}
    	
    	return jr;
	}
	
	
	
	/**
	 * Group Plugin add Rest Api call
	 * @param filter
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/addPlugin.json", method=RequestMethod.POST)
    @ResponseBody
    public JsonResult addPlugin(@RequestBody RestApiModel filter){
    	log.info("### " + filter);
    	
    	JsonResult jr = new JsonResult();
    	JSONObject json = new JSONObject();
    	String code = null;
    	
    	try{
    		if("local".equals(profiles) || "test".equals(profiles)){
    			String ip = nodeIPInfo(filter.getNode_name());
    			filter.setIp(ip);
    			if("local".equals(profiles)){
    				filter.setFilePath("D:/etc/plugin/");
    			}else{
    				filter.setFilePath("/home/hms/Applications/snap/plugins/");
    			}
    		}else{
    			filter.setFilePath("/home/hms/Applications/snap/plugins/");
    		}
    		
    		
    		for(int i = 0 ; i < filter.getFileNameList().size() ; i++ ){
    			File inFile = new File(filter.getFilePath()+filter.getFileNameList().get(i));
    			log.info("### Group Plugin add Rest Api filter= " + filter);
        		jr.setData(commonController.postRestApiInfo(filter,inFile));
        		
        		JSONObject localRest = new JSONObject(jr.getData().toString());
        		
        		code = localRest.getJSONObject("meta").get("code").toString();
    		}
    		
    		if("201".equals(code)){
    			if("local".equals(profiles)){
        			filter.setSyncIp(localIP);
        		}else{
        			filter.setSyncIp(devIP);
        		}
    			
    			json = new JSONObject();
    			json.put("node_name", filter.getNode_name());
    			json.put("type", "plugin");
    			StringEntity entity = new StringEntity(json.toString());
    			log.info("###Group Plugin add Rest Api sync= " + json);
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
	 * Group Task add Rest Api call
	 * @param filter
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/addTask.json", method=RequestMethod.POST)
    @ResponseBody
    public JsonResult addTask(@RequestBody RestApiModel filter){
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
    		
    		
    		for(int i = 0 ; i < filter.getTaskDetailList().size() ; i++ ){
        		StringEntity entity = new StringEntity(filter.getTaskDetailList().get(i));
        		log.info("### Group Task add Rest Api filter= " + filter);
        		jr.setData(commonController.postRestApiInfo(filter, entity));
        		
        		JSONObject localRest = new JSONObject(jr.getData().toString());
        		code = localRest.getJSONObject("meta").get("code").toString();
    		}
    		
    		if("201".equals(code)){
    			if("local".equals(profiles)){
        			filter.setSyncIp(localIP);
        		}else{
        			filter.setSyncIp(devIP);
        		}
    			
    			
    			json = new JSONObject();
    			json.put("node_name", filter.getNode_name());
    			json.put("type", "task");
    			StringEntity entity = new StringEntity(json.toString());
    			log.info("### Group Task add Rest Api sync= " + json);
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
    	
    	try{
    		if("local".equals(profiles) || "test".equals(profiles)){
    			String ip = nodeIPInfo(filter.getNode_name());
    			filter.setIp(ip);
    		}else{
    		}
    		
    		
    		for(int i = 0 ; i < filter.getTaskIdList().size() ; i++ ){
    			apiType = filter.getTempApiType() + filter.getTaskIdList().get(i);
    			filter.setApiType(apiType);
    			log.info("### Group task delete Rest filter= " + filter);
        		jr.setData(commonController.deleteRestApiInfo(filter));
    		}
    		
    	}catch (Exception e) {
			e.printStackTrace();
		}
    	
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
    	
    	try{
    		if("local".equals(profiles) || "test".equals(profiles)){
    			String ip = nodeIPInfo(filter.getNode_name());
    			filter.setIp(ip);
    		}else{
    			
    		}
    		
    		for(int i = 0 ; i < filter.getPluginTypeList().size() ; i++ ){
    			apiType = filter.getTempApiType() + filter.getPluginTypeList().get(i) + "/" + filter.getPluginNameList().get(i) + "/" + filter.getPluginVersionList().get(i);
    			filter.setApiType(apiType);
    			log.info("### Group plugin delete Rest Api filter= " + filter);
        		jr.setData(commonController.deleteRestApiInfo(filter));
    		}
    		
    	}catch (Exception e) {
			e.printStackTrace();
		}
    	
    	return jr;
	}
	
	
	
	@RequestMapping(value = "/fileUpload.json", method=RequestMethod.POST)
    @ResponseBody
    public JsonResult fileUpload(@ModelAttribute("uploadForm") FileUploadRequest uploadForm) {

		JsonResult js = new JsonResult();
		RestApiModel restFilter = new RestApiModel();
		
		try {
			restFilter.setType("manager_plugin");
			if("local".equals(profiles)){
    			restFilter.setIp(localIP);
    			uploadForm.setUploadUrl("D:/etc/plugin/");
    		}else{
    			restFilter.setIp(devIP);
    			uploadForm.setUploadUrl("/home/hms/Applications/snap/plugins/");
    		}
			
			js.setData(commonController.fileUpload(uploadForm));
			
			sync(restFilter);
			
			js.setResult(1);
			
		} catch (Exception e) {
			js.setResult(0);
			js.setErrorMessage(e.getMessage(), e);
			log.error("Error", e);
		}

		return js;
	}
	
	
	
	
	//rest api sync
	@RequestMapping(value = "/sync.json", method=RequestMethod.POST)
    @ResponseBody
    public JsonResult sync(@RequestBody RestApiModel filter){
    	log.info("### " + filter);
    	
    	JsonResult jr = new JsonResult();
    	JSONObject json = new JSONObject();
    	
    	try{
    		if("local".equals(profiles) || "test".equals(profiles)){
    			String ip = nodeIPInfo(filter.getNode_name());
    			filter.setSyncIp(ip);
    		}else{
    			filter.setSyncIp(devIP);
    		}
    		
			json = new JSONObject();
			json.put("type", filter.getType());
			StringEntity entity = new StringEntity(json.toString());
			log.info("###sync= " + json);
			Thread.sleep(timeInterval);
			//O&M Snap Rest Api call(Sync)
			jr.setData(commonController.postOnMRestApiInfo(filter, entity));
    		
    		
    	}catch (Exception e) {
    		jr.setErrorMessage(e);
    		e.printStackTrace();
		}
    	return jr;
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
			nodeIp = "211.214.168.102:3811";
		}
		
		return nodeIp;
	}
	
	
	/**
	 * Node history 상세 data time 정보 리스트 조회
	 * @param filter
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/getNodeHistoryDataTime.json", method=RequestMethod.POST)
    @ResponseBody
    public JsonResult getNodeHistoryDataTime(@RequestBody PopupSearchModel filter) throws Exception{
    	log.info("### " + filter);
    	
    	JsonResult jr = new JsonResult();
    	
    	SimpleDateFormat  sdf = new SimpleDateFormat("yyyy-MM-dd "+ "00:00:00");
        String currentTime = sdf.format(new java.util.Date());
        Calendar c = Calendar.getInstance(TimeZone.getTimeZone("Asia/Seoul"));
        String fromDate = null;
        String toDate = null;
		
    	if(filter.getFirstLastUpTime() == null){
    		fromDate = sdf.format(c.getTime()); 
    		filter.setFirstLastUpTime(fromDate);
    	}
    	if(filter.getEndLastUpTime() == null){
    		c.add(Calendar.DATE, 1);
    		toDate = sdf.format(c.getTime());
    		filter.setEndLastUpTime(toDate);
    	}
    	
    	
    	List<PopupModel> list = popupService.getNodeHistoryDataTime(filter);
    	jr.setData(list);
    	return jr;
	}
	
	
	/**
	 * Node history data time 정보의 비교 데이터 조회
	 * @param filter
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/searchHistoryInfo.json", method=RequestMethod.POST)
    @ResponseBody
    public JsonResult searchHistoryInfo(@RequestBody PopupSearchModel filter) throws Exception{
    	log.info("### " + filter);
    	JsonResult jr = new JsonResult();
    	List<PopupModel> list = null;
    	
    	if(filter.getInfluxCollectTime() != null){
    		list = popupService.searchHistoryInfo(filter);
    	}
    	jr.setData(list);
    	return jr;
	}
	
	
	/**
	 * Task Status Per Node 상세 정보 조회
	 * @param filter
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/getTaskStatusNodeInfo.json", method=RequestMethod.POST)
    @ResponseBody
    public JsonResult getTaskStatusNodeInfo(@RequestBody PopupSearchModel filter) throws Exception{
    	log.info("###getTaskStatusNodeInfo: " + filter);
    	
    	JsonResult jr = new JsonResult();
    	
    	List<PopupModel> list = popupService.getTaskStatusNodeInfo(filter);
    	jr.setData(list);
    	return jr;
	}
	
	
	/**
	 * node metric정보 변경 관리
	 * @param filter
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/updateChangeNode")
	@ResponseBody
	public JsonResult updateChangeNode(@RequestBody PopupSearchModel filter) throws Exception{

		JsonResult js = new JsonResult();
		int result = popupService.updateChangeNode(filter);
		js.setData(result);
		return js;
	}
	
}
