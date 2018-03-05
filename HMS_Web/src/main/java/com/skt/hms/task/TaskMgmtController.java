package com.skt.hms.task;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.util.List;

import org.apache.http.entity.StringEntity;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.mobigen.framework.result.JsonResult;
import com.skt.hms.common.CommonController;
import com.skt.hms.common.model.RestApiModel;
import com.skt.hms.task.model.TaskMgmtModel;
import com.skt.hms.task.model.TaskMgmtSearchModel;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Controller
@RequestMapping("/task")
public class TaskMgmtController {

	@Autowired
	TaskMgmtService taskMgmtService;
	
	@Autowired
	CommonController commonController;
	
	@Value("${spring.profiles}")
	private String profiles;
	
	//task sync ip
	@Value("${config.taskSync-ip}")
	private String taskSyncIp;
	
	private String localIP = "211.214.168.102:18181";
	private String devIP = "localhost:18181";

	private long timeInterval = 1000;
	
	/**
	 * Task 정보 리스트 조회
	 * @param filter
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/getTaskList.json", method=RequestMethod.POST)
    @ResponseBody
    public JsonResult getTaskList(@RequestBody TaskMgmtSearchModel filter) throws Exception{
    	log.info("### " + filter);
    	
    	JsonResult jr = new JsonResult();
    	List<TaskMgmtModel> list = taskMgmtService.getTaskList(filter);
    	
    	jr.setData(list);
    	return jr;
	}
	
	/**
	 * task 파일명 동일 여부 체크
	 * @param filter
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/getDuplicationsTaskName.json", method=RequestMethod.POST)
    @ResponseBody
    public JsonResult getDuplicationsTaskName(@RequestBody TaskMgmtSearchModel filter) throws Exception{
		JsonResult jr = new JsonResult();
		
		int duplicationsYn = taskMgmtService.getDuplicationsTaskName(filter);
		
		jr.setData(duplicationsYn);
    	return jr;
	}
	
	/**
	 * task 파일 생성 및 파일에 내용 작성 / 파일 내용 수정시에도 동일 메서드 사용
	 * @param filter
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/addTask.json", method=RequestMethod.POST)
    @ResponseBody
    public JsonResult addTask(@RequestBody TaskMgmtSearchModel filter){
    	log.info("### " + filter);
    	
    	JsonResult jr = new JsonResult();
    	
    	RestApiModel restFilter = new RestApiModel();
    	
    	String filePath = null;
    	
    	
    	if("local".equals(profiles)){
			filePath = "D:/etc/task/";
		}else{
			filePath = "/home/hms/Applications/snap/tasks/";
		}
    	
    	
    	String fileUrlName = filePath + filter.getTaskFileName();
    	
    	try {
    		File f1 = new File(fileUrlName);
        	f1.createNewFile();
        	
        	FileWriter fw = new FileWriter(fileUrlName);
        	BufferedWriter bw = new BufferedWriter(fw);
        	
        	String fileContents = filter.getTaskFileContents();

    		bw.write(fileContents);
    		bw.newLine();
    		
    		bw.close();
    		
    		restFilter.setType("manager_task");
    		sync(restFilter);
    		
    		
    		jr.setResult(1);
    		
		} catch (Exception e) {
			jr.setResult(0);
			jr.setErrorMessage(e.getMessage(), e);
		}
    	
    	return jr;
	}
	
	/**
	 * task 파일 삭제
	 * @param filter
	 * @return
	 */
	@RequestMapping(value = "/deleteTask.json", method=RequestMethod.POST)
    @ResponseBody
    public JsonResult deleteTask(@RequestBody TaskMgmtSearchModel filter){
    	log.info("### " + filter);
    	
    	JsonResult jr = new JsonResult();
    	String fileUrlName = null;
    	RestApiModel restFilter = new RestApiModel();
    	
    	String filePath = null;
    	
    	
    	if("local".equals(profiles)){
			filePath = "D:/etc/task/";
		}else{
			filePath = "/home/hms/Applications/snap/tasks/";
		}
    	
    	try {
    		
    		for(int i = 0; i < filter.getTaskNameList().size(); i++){
    		
	    		fileUrlName = filePath + filter.getTaskNameList().get(i);
	    		
	    		File f1 = new File(fileUrlName);
	
	    		if( f1.exists()){
	    			f1.delete();
	            }
    		}
    		
    		restFilter.setType("manager_task");
    		sync(restFilter);
    		
    		jr.setResult(1);
    		
		} catch (Exception e) {
			jr.setResult(0);
			jr.setErrorMessage(e.getMessage(), e);
		}
    	
    	return jr;
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
			json.put("type", filter.getType());
			StringEntity entity = new StringEntity(json.toString());
			
			Thread.sleep(timeInterval);
			//O&M Snap Rest Api call(Sync)
			jr.setData(commonController.postOnMRestApiInfo(filter, entity));
    		
    		
    	}catch (Exception e) {
    		jr.setErrorMessage(e);
    		e.printStackTrace();
		}
    	return jr;
	}
	
	/**
	 * excuteTask Rest Api call
	 * @param filter
	 * @return
	 */
	@RequestMapping(value = "/excuteTask.json", method=RequestMethod.POST)
    @ResponseBody
    public JsonResult startTask(@RequestBody RestApiModel filter){
    	log.info("### " + filter);
    	
    	JsonResult jr = new JsonResult();
    	String code = null;
    	String syncIp = filter.getIp();
    	
    	
    	try{
    		if("local".equals(profiles) || "test".equals(profiles)){
    			String ip = nodeIPInfo(filter.getNode_name());
    			filter.setIp(ip);
    		}else{
    			
    		}
    		
    		StringEntity entity = new StringEntity("");
    		log.info("### excuteTask Rest Api filter= " + filter);
    		jr.setData(commonController.putRestApiInfo(filter,entity));
    		
    		JSONObject localRest = new JSONObject(jr.getData().toString());
    		code = localRest.getJSONObject("meta").get("code").toString();
    		
    		if("200".equals(code)){
    			if("local".equals(profiles) || "test".equals(profiles)){
        			filter.setSyncIp(taskSyncIp);
        		}else{
        			filter.setSyncIp(taskSyncIp);
        		}
    			filter.setApiType("/snapTasks/refresh/" + syncIp);
    			
    			log.info("###task start get Rest Api= " + filter);
    			Thread.sleep(timeInterval);
    			//O&M Snap Rest get Api call(Sync)
        		commonController.getOnMRestApiInfo(filter);
    		}
    		
    		
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
			//nodeIp = "211.214.168.102:3811";
		}
		
		return nodeIp;
	}
}
