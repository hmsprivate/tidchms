package com.skt.mobigen.hms.snapsynchronize.service.old;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang3.exception.ExceptionUtils;
import org.apache.ibatis.session.SqlSession;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.skt.mobigen.hms.snapsynchronize.context.Context;
import com.skt.mobigen.hms.snapsynchronize.service.IFSnapSynchronizeService;
import com.skt.mobigen.hms.snapsynchronize.utils.HttpRequestUtil;
import com.skt.mobigen.hms.snapsynchronize.utils.JsonParserUtil;

public class SnapAgreementSynchonizeService implements IFSnapSynchronizeService{
	private Logger logger = LoggerFactory.getLogger(SnapAgreementSynchonizeService.class);
	private Map<String, Object> receive_data_map;
	private Context context;

	public SnapAgreementSynchonizeService(Context context, Map<String, Object> receive_data_map) {
		this.receive_data_map = receive_data_map;
		this.context = context;
	}

	@SuppressWarnings("unchecked")
	@Override
	public Object synchronizeService() {
		logger.debug("Snap Agreement Synchonize start");
		SqlSession session = null;
		try {
			session = context.getSqlSessionFactory().openSession(false);
			
			String connect_ip = receive_data_map.get("member_host").toString().trim();
			String connect_port = receive_data_map.get("rest_api_port").toString().trim();
			
			String p_url = "http://".concat(connect_ip.concat(":")).concat(connect_port);
			String agreement_url = p_url.concat("/v1/tribe/agreements");
			
			logger.debug("{}", agreement_url);
			
			Map<String, Object> response_map = JsonParserUtil.jsontoMap(HttpRequestUtil.sendRequest(agreement_url));
			Map<String, Object> response_body = (Map<String, Object>) response_map.get("body");
			Map<String, Object> agreement_map = (Map<String, Object>) response_body.get("agreements");
			
			List<Map<String, Object>> agreement_list = new ArrayList<>();
			for (String name : agreement_map.keySet()) {
				agreement_list.add((Map<String, Object>)agreement_map.get(name));
			}
			
			logger.debug("{}", agreement_list);
			session.update("update_init_agreement_flag");
			
			for(Map<String, Object> agreement_data : agreement_list) {
				
				String agreement_name = null;
				if (agreement_data.containsKey("name")) agreement_name = agreement_data.get("name").toString().trim();
				
				if (agreement_name != null) session.insert("insert_agreement_info", agreement_name);
				
				
			}
			session.delete("delete_agreement_synchronization");
			session.commit();
			session.close();
			return "completed";
		} catch (Exception e) {
			if (session != null) session.close(); 
			logger.error(ExceptionUtils.getStackTrace(e));
			return e.getMessage();
		} 
		
	}

}
