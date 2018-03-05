package com.skt.hms.change;

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
import com.skt.hms.change.model.ChangeMgmtSearchModel;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Controller
@RequestMapping("/change")
public class ChangeMgmtController {

	@Autowired
	ChangeMgmtService changeMgmtService;

	/**
	 * Node 정보 리스트 조회
	 * @param filter
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/getChangeList.json", method=RequestMethod.POST)
    @ResponseBody
    public JsonResult getNodeList(@RequestBody ChangeMgmtSearchModel filter) throws Exception{
		// 페이지 인덱스 계산.
    	filter.setPageIndex((filter.getPageIndex() -1) * filter.getPageCount());
    	
    	log.info("### " + filter);
    	
    	JsonResult jr = new JsonResult();
    	List<Map<String,Object>> list = changeMgmtService.getChangeList(filter);
    	int cnt = changeMgmtService.getChangeCount(filter);
    	
    	
    	Map<String, Object> result = new HashMap<String,Object>();
    	result.put("count", cnt);
    	result.put("list", list);
    	jr.setData(result);
    	return jr;
	}

}
