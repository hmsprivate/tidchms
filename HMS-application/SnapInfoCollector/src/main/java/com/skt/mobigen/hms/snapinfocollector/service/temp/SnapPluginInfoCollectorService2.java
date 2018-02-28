package com.skt.mobigen.hms.snapinfocollector.service.temp;

import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.TimeZone;
import java.util.concurrent.Callable;

import org.apache.commons.lang3.exception.ExceptionUtils;
import org.apache.ibatis.session.ExecutorType;
import org.apache.ibatis.session.SqlSession;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.google.gson.Gson;
import com.skt.mobigen.hms.snapinfocollector.context.Context;
import com.skt.mobigen.hms.snapinfocollector.util.HttpRequestUtil;
import com.skt.mobigen.hms.snapinfocollector.util.JsonParserUtil;

public class SnapPluginInfoCollectorService2 implements Callable<String> {
	private Logger logger = LoggerFactory.getLogger(SnapPluginInfoCollectorService2.class);
	private Context context;

	public SnapPluginInfoCollectorService2(Context context) {
		this.context = context;
	}

	@SuppressWarnings("unchecked")
	@Override
	public String call() {
		logger.debug("snap plugin info collector start");
		SqlSession session = null;
		try {
			session = context.getSqlSessionFactory().openSession(ExecutorType.BATCH, false);
			
			List<Map<String, Object>> connect_info_list = session.selectList("get_conncet_info");
			Map<String, Object> connect_info_map = new HashMap<>();
			for (Map<String, Object> connect_info : connect_info_list) {
				connect_info_map.put(connect_info.get("member_name").toString().trim(), connect_info);
			}

			Iterator<String> it = null;
			do {
				if (!connect_info_map.isEmpty()) {
					it = connect_info_map.keySet().iterator();
				} else {
					break;
				}
				String host_name = it.next();
				Map<String, Object> info_map = (Map<String, Object>) connect_info_map.get(host_name);

				// Test
//				 info_map.put("member_host", "211.214.168.102");
//				 info_map.put("rest_api_port", "3813");
				 

				String p_url = "http://" + String.valueOf(info_map.get("member_host")).trim().concat(":")
						.concat(String.valueOf(info_map.get("rest_api_port")));
				String seed_member_url = p_url.concat("/v1/tribe/members");

				String response_str = null;
				try {
					response_str = HttpRequestUtil.sendRequest(seed_member_url);
				} catch (Exception e) {
					connect_info_map.remove(info_map.get("member_name").toString().trim());
					continue;
				}
				Map<String, Object> response_map = JsonParserUtil.jsontoMap(response_str);
				Map<String, Object> response_body = (Map<String, Object>) response_map.get("body");
				List<String> seed_member_list = (List<String>) response_body.get("members");
				for (String seed_member : seed_member_list) {
					connect_info_map.remove(seed_member);
				}

				context.setSnap_connect_ip(info_map.get("member_host").toString().trim());
				context.setSnap_connect_port(info_map.get("rest_api_port").toString().trim());
			} while (it.hasNext());
			
//			String p_url = context.getRest_proto().concat("://").concat(context.getSnap_connect_ip().concat(":")).concat(String.valueOf(context.getSnap_connect_port()));
			
			Map<String, Object> insert_data_map = new HashMap<>();
			List<Map<String, Object>> insert_data_list = new ArrayList<>();
			
			//TEST
//			String p_url = context.getRest_proto().concat("://").concat("211.214.168.102".concat(":")).concat("8181");
			
			String p_url = context.getRest_proto().concat("://").concat("127.0.0.1".concat(":")).concat("8181");
			String plugin_url = p_url.concat("/v1/plugins");
			
			Map<String, Object> response_map = JsonParserUtil.jsontoMap(HttpRequestUtil.sendRequest(plugin_url));
			Map<String, Object> response_body = (Map<String, Object>) response_map.get("body");
			Object last_up_time = getInsertTime();
			if (!response_body.isEmpty()) {
				
				List<Map<String, Object>> plugin_list = (List<Map<String, Object>>) response_body.get("loaded_plugins");
				if (plugin_list.size() > 0) {
					for (Map<String, Object> plugin_info : plugin_list) {
						plugin_info.put("loaded_timestamp", covertTimeformat(plugin_info.get("loaded_timestamp")));
						plugin_info.put("last_up_time", last_up_time);
					}
				}
				
//				Map<String, Object> insert_data_map = new HashMap<>();
//				insert_data_map.put("plugin_list_info", plugin_list);
//				session.insert("insert_plugin_info", insert_data_map);
//				session.delete("delete_plugin_synchronization", last_up_time);
//				session.commit();
				
				Map<String, Object> total_data_map = new HashMap<>();
				for (Map<String, Object> plugin_info: plugin_list) {
					total_data_map.put(plugin_info.get("name").toString().trim().concat(plugin_info.get("version").toString().trim()).concat(plugin_info.get("type").toString().trim()), plugin_info);
				}

				response_map.clear();
				response_body.clear();
				p_url = context.getRest_proto().concat("://").concat(context.getSnap_connect_ip().concat(":")).concat(String.valueOf(context.getSnap_connect_port()));
				String agreement_url = p_url.concat("/v1/tribe/agreements");
				response_map = JsonParserUtil.jsontoMap(HttpRequestUtil.sendRequest(agreement_url));
				response_body = (Map<String, Object>) response_map.get("body");
				Map<String, Object> agreement_map = (Map<String, Object>) response_body.get("agreements");

				if (!agreement_map.isEmpty()) {
					for (String agreement_name : agreement_map.keySet()) {
						Map<String, Object> agreement_info_map = (Map<String, Object>) agreement_map.get(agreement_name);
						Map<String, Object> plugin_agreement_map = (Map<String, Object>) agreement_info_map.get("plugin_agreement");
						String agreement_seq = session.selectOne("get_agreement_seq", agreement_name);
						
						if (!plugin_agreement_map.isEmpty()) {
							List<Map<String, Object>> plugin_info_list = (List<Map<String, Object>>) plugin_agreement_map.get("plugins");

//							session.update("update_init_plugin_agreement", agreement_name);
//							session.commit();
							
							for (Map<String, Object> plugin_info : plugin_info_list) {

								plugin_info.put("agreement_seq", agreement_seq);

								int plugin_type = Integer.parseInt(plugin_info.get("type").toString().trim());
								if (plugin_type == 0) {
									plugin_info.put("type", "collector".trim());

								} else if (plugin_type == 1) {
									plugin_info.put("type", "processor".trim());

								} else if (plugin_type == 2) {
									plugin_info.put("type", "publisher".trim());
								}
//								session.update("update_agreement_plugin_info", plugin_info);
//								session.commit();
								
								Map<String, Object> insert_data = new HashMap<>();
								String key = plugin_info.get("name").toString().trim().concat(plugin_info.get("version").toString().trim()).concat(plugin_info.get("type").toString().trim());
								insert_data = new HashMap<>((Map<String, Object>) total_data_map.get(key));
								
								insert_data.put("agreement_seq", agreement_seq);
								insert_data_list.add(insert_data);
								
								insert_data.put("agreement_seq", agreement_seq);
								insert_data_list.add(insert_data);
							}
						}
					}
					
					for (Map<String, Object> temp_map :  insert_data_list) {
						String key = temp_map.get("name").toString().trim().concat(temp_map.get("version").toString().trim()).concat(temp_map.get("type").toString().trim());
						
						if (total_data_map.containsKey(key)) {
							total_data_map.remove(key);
						}
					}
					
					if (!total_data_map.isEmpty()) {
						for (String key : total_data_map.keySet()) {
							Map<String, Object> data_info = (Map<String, Object>) total_data_map.get(key);
							data_info.put("agreement_seq", "1");
							
							insert_data_list.add(data_info);
						}
					}
					
					insert_data_map.put("plugin_list_info", insert_data_list);
					
					
//					logger.debug("final insert data : {}", new Gson().toJson(insert_data_map));
					
					
					session.insert("insert_plugin_info", insert_data_map);
					session.delete("delete_plugin_synchronization", last_up_time);
					session.commit();
					
					
				} else {
					for (String key : total_data_map.keySet()) {
						Map<String, Object> plugin_data = (Map<String, Object>) total_data_map.get(key);
						plugin_data.put("agreement_seq", "1");
						insert_data_list.add(plugin_data);
					}
					insert_data_map.put("plugin_list_info", insert_data_list);
					
//					logger.debug("final insert data : {}", new Gson().toJson(insert_data_map));
					
					session.insert("insert_plugin_info", insert_data_map);
					session.delete("delete_plugin_synchronization", last_up_time);
					session.commit();
				}
			} else {
				session.delete("delete_plugin_synchronization", last_up_time);
				session.commit();
			}
			
			return "completed";
		} catch (Exception e) {
			
			logger.error(ExceptionUtils.getStackTrace(e));
			
			return "Plugin Collector ".concat(ExceptionUtils.getMessage(e));
		} finally {
			if (session != null) session.close();
		}

	}
	
	private Object covertTimeformat(Object loadedTimestamp) {
		if (loadedTimestamp != null) {
			SimpleDateFormat sdfCurrent = new SimpleDateFormat("yyyy-MM-dd'T'hh:mm:ss'Z'");
			Timestamp currentTime = new Timestamp(Long.parseLong(String.valueOf(loadedTimestamp)) * 1000);

			return sdfCurrent.format(currentTime);
		}
		return null;
	}
	
	private Object getInsertTime() {
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss'Z'");
		sdf.setTimeZone(TimeZone.getTimeZone("UTC"));
		
		return sdf.format(new Date().getTime());
	}

}
