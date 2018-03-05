package com.skt.hms.plugin;

import java.io.File;
import java.util.List;

import org.apache.http.entity.StringEntity;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.mobigen.framework.result.JsonResult;
import com.skt.hms.plugin.model.PluginMgmtSearchModel;
import com.skt.hms.common.CommonController;
import com.skt.hms.common.model.RestApiModel;
import com.skt.hms.plugin.model.PluginMgmtModel;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Controller
@RequestMapping("/plugin")
public class PluginMgmtController {

	@Autowired
	PluginMgmtService pluginMgmtService;
	
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
	
	private String localIP = "211.214.168.102:18181";
	private String devIP = "localhost:18181";
	
	private long timeInterval = 1000;

	/**
	 * Plugin 정보 리스트 조회
	 * @param filter
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/getPluginList.json", method=RequestMethod.POST)
    @ResponseBody
    public JsonResult getPluginList(@RequestBody PluginMgmtSearchModel filter) throws Exception{
    	log.info("### " + filter);
    	
    	JsonResult jr = new JsonResult();
    	List<PluginMgmtModel> list = pluginMgmtService.getPluginList(filter);

    	jr.setData(list);
    	return jr;
	}
	
	
	@RequestMapping(value = "/deletePlugin.json", method=RequestMethod.POST)
    @ResponseBody
    public JsonResult deletePlugin(@RequestBody PluginMgmtSearchModel filter){
    	log.info("### " + filter);
    	
    	JsonResult jr = new JsonResult();
    	String fileFolderName = null;
    	String fileUrlName = null;
    	
    	RestApiModel restFilter = new RestApiModel();
    	
    	try {
    		if("local".equals(profiles)){
    			restFilter.setIp(localIP);
    			fileFolderName = "D:/etc/plugin/";
    		}else{
    			restFilter.setIp(devIP);
    			fileFolderName = "/home/hms/Applications/snap/plugins/";
    		}
    		
    		for(int i = 0; i < filter.getPluginNameList().size(); i++){
	    		fileUrlName = fileFolderName + filter.getPluginNameList().get(i);
	    		File f1 = new File(fileUrlName);
	
	    		if( f1.exists()){
	    			f1.delete();
	            }
    		}
    		restFilter.setType("manager_plugin");
    		sync(restFilter);
    		
    		jr.setResult(1);
    		
		} catch (Exception e) {
			jr.setResult(0);
			jr.setErrorMessage(e.getMessage(), e);
		}
    	
    	return jr;
	}

	
	/**
	 * plugin load
	 * load 한 뒤 response값으로 테이블에 update 하고 해당 plugin unload 실행
	 * @param filter
	 * @return
	 */
	@RequestMapping(value = "/loadPlugin.json", method=RequestMethod.POST)
    @ResponseBody
    public JsonResult loadPlugin(@RequestBody RestApiModel filter){
    	log.info("### " + filter);
    	JsonResult jr = new JsonResult();
    	
    	
    	RestApiModel restFilter = new RestApiModel();
    	
    	
    	try{
    		if("local".equals(profiles)){
    			filter.setIp("211.214.168.102:8181");
    			filter.setFilePath("D:/etc/plugin/");
    		}else{
    			filter.setIp("localhost:8181");
    			filter.setFilePath("/home/hms/Applications/snap/plugins/");
    		}
    		
    		
    		
    		File inFile = new File(filter.getFilePath()+filter.getPluginFileName());
    		
    		JSONObject responseData = new JSONObject(commonController.postRestApiInfo(filter, inFile).toString());
    		JSONArray responseList = (JSONArray)responseData.getJSONObject("body").get("loaded_plugins");

    		if(responseList.length() > 0){
    			PluginMgmtModel data = new PluginMgmtModel();
    			data.setPluginName(responseList.getJSONObject(0).get("name").toString());
    			data.setPluginVersion(responseList.getJSONObject(0).get("version").toString());
    			data.setPluginType(responseList.getJSONObject(0).get("type").toString());
    			data.setPluginLoadedTimestamp(responseList.getJSONObject(0).get("loaded_timestamp").toString());
    			data.setFileName(filter.getPluginFileName());
    			//cm_manager_plugin_info 테이블에 정보 업데이트 처리
    			pluginMgmtService.modifyPluginInfo(data);
    			
    			//테이블에 정보 업데이트되면 다시 plungin unLoad rest api Call
    			String apiType = filter.getApiType() + "/" +  data.getPluginType() + "/" + data.getPluginName() + "/" +data.getPluginVersion();
    			filter.setApiType(apiType);
    			jr.setData(commonController.deleteRestApiInfo(filter));
    			
    			//동기화작업
    			restFilter.setType("manager_plugin");
        		sync(restFilter);
    			
    		}else{
    			throw new java.lang.Exception();
    		}
    		
    	}catch (Exception e) {
    		jr.setErrorMessage(e.getMessage());
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
	
	
	
	
	
}
