package com.skt.mobigen.hms.snapmanagerinfocollector.service;

import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.TimeZone;
import java.util.concurrent.Callable;

import org.apache.commons.lang3.exception.ExceptionUtils;
import org.apache.ibatis.session.ExecutorType;
import org.apache.ibatis.session.SqlSession;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.skt.mobigen.hms.snapmanagerinfocollector.context.Context;
import com.skt.mobigen.hms.snapmanagerinfocollector.util.HttpRequestUtil;
import com.skt.mobigen.hms.snapmanagerinfocollector.util.JsonParserUtil;

public class SnapManagerPluginInfoCollectorSnapAPI implements Callable<String>{
	private Logger logger = LoggerFactory.getLogger(SnapManagerPluginInfoCollectorSnapAPI.class);
	private Context context;
	private final String REST_PROTO = "http";
	private final String SNAP_MANAGER_CONNECT_IP = "127.0.0.1";
	
	public SnapManagerPluginInfoCollectorSnapAPI(Context context) {
		this.context = context;
	}
	

	@SuppressWarnings("unchecked")
	@Override
	public String call() {
		logger.debug("snap manager plugin info collector start");
		SqlSession session = null;
		try{
			session = context.getSqlSessionFactory().openSession(ExecutorType.BATCH, false);
			String p_url = REST_PROTO.concat("://").concat(SNAP_MANAGER_CONNECT_IP.concat(":"))
					.concat(context.getSnap_manager_port().trim());
			String plugin_url = p_url.concat("/v1/plugins");
			
			Map<String, Object> result_map = JsonParserUtil.jsontoMap(HttpRequestUtil.sendRequest(plugin_url));
			Map<String, Object> result_body = (Map<String, Object>) result_map.get("body");
			
			List<Map<String, Object>> plugin_list = (List<Map<String, Object>>) result_body.get("loaded_plugins");
			
			Object last_up_time = getInsertTime();
			
			if (plugin_list.size() > 0) {
				for (Map<String, Object> plugin_info : plugin_list) {
					plugin_info.put("loadedTimestamp", covertTimeformat(plugin_info.get("loaded_timestamp")));
					plugin_info.put("lastUpTime", last_up_time);
					plugin_info.remove("loaded_timestamp");
				}
			}
			
			Map<String, Object> insert_data_map = new HashMap<>();
			insert_data_map.put("plugin_list_info", plugin_list);
			
			session.insert("insert_manager_plugin_info", insert_data_map);
			session.delete("delete_manager_plugin_info", last_up_time);
			session.commit();
			session.close();
			return "completed";
		} catch (Exception e) {
			if (session != null) session.close();
			return ExceptionUtils.getMessage(e);
		}
	}
	
	private Object covertTimeformat(Object loadedTimestamp) {
		if (loadedTimestamp != null) {
			SimpleDateFormat sdfCurrent = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss");
			Timestamp currentTime = new Timestamp(Long.parseLong(String.valueOf(loadedTimestamp)) * 1000);

			return sdfCurrent.format(currentTime);
		}
		return null;
	}
	
	private Object getInsertTime() {
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss");
//		sdf.setTimeZone(TimeZone.getTimeZone("UTC"));
		
		return sdf.format(new Date().getTime());
	}

}
