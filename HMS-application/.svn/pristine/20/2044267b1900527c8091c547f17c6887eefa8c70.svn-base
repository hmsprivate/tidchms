package com.skt.mobigen.hms.snapsynchronize.service;

import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.TimeZone;

import org.apache.commons.lang3.exception.ExceptionUtils;
import org.apache.ibatis.session.ExecutorType;
import org.apache.ibatis.session.SqlSession;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.google.gson.Gson;
import com.skt.mobigen.hms.snapsynchronize.context.Context;
import com.skt.mobigen.hms.snapsynchronize.service.IFSnapSynchronizeService;
import com.skt.mobigen.hms.snapsynchronize.utils.HttpRequestUtil;
import com.skt.mobigen.hms.snapsynchronize.utils.JsonParserUtil;

public class SnapPluginSyncService implements IFSnapSynchronizeService {
	private Logger logger = LoggerFactory.getLogger(SnapPluginSyncService.class);
	private Context context;
	private Map<String, Object> receive_data_map;

	public SnapPluginSyncService(Context context, Map<String, Object> receive_data_map) {
		this.context = context;
		this.receive_data_map = receive_data_map;
	}

	@SuppressWarnings("unchecked")
	@Override
	public Object synchronizeService() {
		SqlSession session = null;
		try {
			session = context.getSqlSessionFactory().openSession(ExecutorType.BATCH, false);
			
			if (!receive_data_map.containsKey("node_name") && receive_data_map.get("node_name").toString().trim().isEmpty()) 
				return null;
			
			String node_name = receive_data_map.get("node_name").toString();
			Map<String, Object> connect_info = session.selectOne("get_conncet_info", node_name);
			
			Map<String, Object> insert_data_map = new HashMap<>();
			List<Map<String, Object>> insert_data_list = new ArrayList<>();
			
			String p_url = "http://".concat(connect_info.get("member_host").toString().trim().concat(":")).concat(connect_info.get("rest_api_port").toString().trim());
			String member_detail_info_url = p_url.concat("/v1/tribe/member/").concat(node_name); 
			String plugin_url = p_url.concat("/v1/plugins");
			
			String member_response_str = null, plugin_response_str = null;
			
			try {
				logger.debug("try " + member_detail_info_url + " Connect");
				member_response_str = HttpRequestUtil.sendRequest(member_detail_info_url);
				if (member_response_str.isEmpty() || member_response_str == null) throw new Exception( member_detail_info_url + " response is ".concat(member_response_str));
				
			} catch (Exception e) {
				logger.error(ExceptionUtils.getMessage(e));
				return ExceptionUtils.getMessage(e);
				
			}
			
			try {
				logger.debug("try " + plugin_url + " Connect");
				plugin_response_str = HttpRequestUtil.sendRequest(plugin_url);
				if (plugin_response_str.isEmpty() || plugin_response_str == null) throw new Exception( plugin_url + " response is ".concat(plugin_response_str));
				
			} catch (Exception e) {
				logger.error(ExceptionUtils.getMessage(e));
				return ExceptionUtils.getMessage(e);
				
			}
			
			Map<String, Object> member_detail_reponse_map = JsonParserUtil.jsontoMap(member_response_str);
			Map<String, Object> member_detail_reponse_body = (Map<String, Object>) member_detail_reponse_map.get("body");
			Map<String, Object> plugin_response_map = JsonParserUtil.jsontoMap(plugin_response_str);
			Map<String, Object> plugin_response_body = (Map<String, Object>) plugin_response_map.get("body");
			if (!member_detail_reponse_body.isEmpty()) {
				if (!member_detail_reponse_body.get("plugin_agreement").toString().isEmpty()) {
					String agreement_seq = session.selectOne("get_agreement_seq", member_detail_reponse_body.get("plugin_agreement").toString());
					Object last_up_time = getInsertTime();
					if (!plugin_response_body.isEmpty()) {
						List<Map<String, Object>> plugin_list = (List<Map<String, Object>>) plugin_response_body.get("loaded_plugins");

						if (plugin_list.size() > 0) {
							for (Map<String, Object> plugin_info : plugin_list) {
								plugin_info.put("loaded_timestamp", covertTimeformat(plugin_info.get("loaded_timestamp")));
								plugin_info.put("last_up_time", last_up_time);
								plugin_info.put("agreement_seq", agreement_seq);
								
								insert_data_list.add(plugin_info);
							}
						}
					}
					
					session.update("update_init_plugin_agreement", member_detail_reponse_body.get("plugin_agreement").toString());
					session.commit();
					if (!insert_data_list.isEmpty()) {
						insert_data_map.put("plugin_list_info", insert_data_list);
						logger.debug("snap plugin sychronize insert start");
						session.insert("insert_plugin_info", insert_data_map);
					}
					session.delete("delete_plugin_synchronization");
					session.commit();
				}
			}
			
			return "completed";
		} catch (Exception e) {
			
			logger.debug(ExceptionUtils.getStackTrace(e));
			
			return ExceptionUtils.getMessage(e);
		} finally {
			if (session != null)
				session.close();
		}
	}
	
	private Object covertTimeformat(Object loadedTimestamp) {
		if (loadedTimestamp != null) {
			SimpleDateFormat sdfCurrent = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
			Timestamp currentTime = new Timestamp(Long.parseLong(String.valueOf(loadedTimestamp)) * 1000);
			return sdfCurrent.format(currentTime);
			
		}
		
		return null;
	}

	private Object getInsertTime() {
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		sdf.setTimeZone(TimeZone.getTimeZone("UTC"));
		return sdf.format(new Date().getTime());
		
	}
}
