package com.skt.hms.plugin;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.skt.hms.plugin.model.PluginMgmtSearchModel;
import com.skt.hms.user.model.UserSaveModel;
import com.skt.hms.plugin.model.PluginMgmtModel;


@Service
public class PluginMgmtService {

	@Autowired
	private PluginMgmtMapper pluginMgmtMapper;

	/**
	 * Plugin 정보 리스트 조회
	 * @param param
	 * @return
	 * @throws Exception
	 */
	public List<PluginMgmtModel> getPluginList(PluginMgmtSearchModel param) throws Exception{
		List<PluginMgmtModel> resultModel = pluginMgmtMapper.getPluginList(param);
		return resultModel;
	}
	
	/**
	 * Plugin load성공시 response 값으로 데이터 업데이트
	 * @param data
	 * @return
	 * @throws Exception
	 */
	@Transactional
	public Map<String, Object> modifyPluginInfo(PluginMgmtModel data) throws Exception {
		Map<String, Object> resultMap = new HashMap<String, Object>();
		resultMap.put("result", pluginMgmtMapper.updatePluginInfo(data) > 0 ? "success" : "fail");
		return resultMap;
	}

}
