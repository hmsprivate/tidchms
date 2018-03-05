package com.skt.hms.agent;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.mobigen.framework.result.JsonResult;
import com.skt.hms.agent.model.AgentStatusModel;
import com.skt.hms.agent.model.AgentStatusSearchModel;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Controller
@RequestMapping("/agent")
public class AgentStatusController {

	@Autowired
	AgentStatusService agentStatusService;

	/**
	 * Group 정보 리스트 조회
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/getGroupList")
	@ResponseBody
	public JsonResult getGroupList() throws Exception {

		JsonResult js = new JsonResult();
		List<AgentStatusModel> result = agentStatusService.getGroupList();
		js.setData(result);

		return js;
	}
	
	/**
	 * agent status 정보 리스트 조회
	 * @param filter
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/getAgentStatusList.json", method=RequestMethod.POST)
    @ResponseBody
    public JsonResult getAgentStatusList(@RequestBody AgentStatusSearchModel filter) throws Exception{
		// 페이지 인덱스 계산.
    	filter.setPageIndex((filter.getPageIndex() -1) * filter.getPageCount());
    	
    	log.info("### " + filter);
    	
    	JsonResult jr = new JsonResult();
    	List<Map<String,Object>> list = agentStatusService.getAgentStatusList(filter);
    	int cnt = agentStatusService.getAgentStatusCount(filter);
    	
    	Map<String, Object> result = new HashMap<String,Object>();
    	result.put("count", cnt);
    	result.put("list", list);
    	jr.setData(result);
    	return jr;
	}
	
	
	/**
	 * 통합 검색에서 사용할 Group 정보 리스트 조회
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/getCommonGroupList")
	@ResponseBody
	public JsonResult getCommonGroupList() throws Exception {

		JsonResult js = new JsonResult();
		List<AgentStatusModel> result = agentStatusService.getCommonGroupList();
		js.setData(result);

		return js;
	}

}
