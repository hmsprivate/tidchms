package com.skt.mobigen.hms.snapsynchronize.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang3.exception.ExceptionUtils;
import org.apache.ibatis.session.ExecutorType;
import org.apache.ibatis.session.SqlSession;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.skt.mobigen.hms.snapsynchronize.context.Context;
import com.skt.mobigen.hms.snapsynchronize.service.IFSnapSynchronizeService;
import com.skt.mobigen.hms.snapsynchronize.utils.HttpRequestUtil;
import com.skt.mobigen.hms.snapsynchronize.utils.JsonParserUtil;

public class SnapAgreementListSyncService implements IFSnapSynchronizeService {
	private Logger logger = LoggerFactory.getLogger(SnapAgreementListSyncService.class);
	private Context context;
	private Map<String, Object> receive_data_map;

	public SnapAgreementListSyncService(Context context, Map<String, Object> receive_data_map) {
		this.context = context;
		this.receive_data_map = receive_data_map;
	}

	@SuppressWarnings("unchecked")
	@Override
	public Object synchronizeService() {
		logger.debug("Snap Agreement List Synchonize start");
		SqlSession session = null;
		try{
			session = context.getSqlSessionFactory().openSession(ExecutorType.BATCH,false);
			
			if (!receive_data_map.containsKey("node_name") && receive_data_map.get("node_name").toString().trim().isEmpty()) 
				return null;
			
			String node_name = receive_data_map.get("node_name").toString();
			Map<String, Object> connect_info = session.selectOne("get_conncet_info", node_name);
			
			if (connect_info == null) return null;
			
			
			/*
			 * for test
			 */
//			logger.debug("{}", connect_info);
			
			
			String p_url = "http://".concat(connect_info.get("member_host").toString().trim().concat(":")).concat(connect_info.get("rest_api_port").toString().trim());
			String agreement_url = p_url.concat("/v1/tribe/agreements");
			
			String response_str = null;
			try {
				logger.debug("try " + agreement_url + " Connect");
				response_str = HttpRequestUtil.sendRequest(agreement_url);
				if (response_str.isEmpty() || response_str == null) throw new Exception( agreement_url + " response is ".concat(response_str));
				
			} catch (Exception e) {
				logger.error(ExceptionUtils.getMessage(e));
				return ExceptionUtils.getMessage(e);
			}
			
			Map<String, Object> response_map = JsonParserUtil.jsontoMap(response_str);
			Map<String, Object> response_body = (Map<String, Object>) response_map.get("body");
			Map<String, Object> agreement_map = (Map<String, Object>) response_body.get("agreements");
			
			if (!agreement_map.isEmpty()) {
				List<String> agreement_name_list = new ArrayList<>();

				for (String agreement_name : agreement_map.keySet()) {
					agreement_name_list.add(agreement_name);
				}
				Map<String, Object> insert_data_map = new HashMap<>();
				if (agreement_name_list.size() > 0 && !agreement_name_list.isEmpty())
					insert_data_map.put("agreement_name_list", agreement_name_list);

				session.update("update_init_agreement_flag", connect_info.get("agreement_seq"));
				session.insert("insert_agreement_info", insert_data_map);
				session.delete("delete_agreement_synchronization");
				session.commit();
				
			} else {
				session.update("update_init_agreement_flag", connect_info.get("agreement_seq"));
				session.delete("delete_agreement_synchronization");
				session.commit();
			}
			
			return "completed";
		} catch (Exception e) {
			logger.error(ExceptionUtils.getStackTrace(e));
			return e.getMessage();
		} finally {
			if (session != null) session.close(); 
		}
		
	}

}
