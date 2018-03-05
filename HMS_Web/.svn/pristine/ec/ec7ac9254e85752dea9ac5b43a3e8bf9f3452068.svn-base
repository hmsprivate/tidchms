package com.skt.hms.main;

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
import com.skt.hms.main.model.MainModel;
import com.skt.hms.main.model.MainSearchModel;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Controller
@RequestMapping("/main")
public class MainController {

	@Autowired
	MainService mainService;

	/**
	 * dashBoard 조회
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/getDashBoardStatus")
	@ResponseBody
	public JsonResult getDashBoardStatus() throws Exception {

		JsonResult js = new JsonResult();
		MainModel result = mainService.getDashBoardStatus();
		js.setData(result);

		return js;
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
		List<MainModel> result = mainService.getGroupList();
		js.setData(result);

		return js;
	}
	
	/**
	 * Node 정보 리스트 조회
	 * @param filter
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/getNodeList.json", method=RequestMethod.POST)
    @ResponseBody
    public JsonResult getNodeList(@RequestBody MainSearchModel filter) throws Exception{
		// 페이지 인덱스 계산.
    	filter.setPageIndex((filter.getPageIndex() -1) * filter.getPageCount());
    	
    	log.info("### " + filter);
    	
    	JsonResult jr = new JsonResult();
    	List<Map<String,Object>> list = mainService.getNodeList(filter);
    	int cnt = mainService.getNodeCount(filter);
    	
    	
    	Map<String, Object> result = new HashMap<String,Object>();
    	result.put("count", cnt);
    	result.put("list", list);
    	jr.setData(result);
    	return jr;
	}

}
