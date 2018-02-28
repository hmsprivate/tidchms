package com.skt.mobigen.hms.snapinfocollector.service.temp;

import java.sql.Timestamp;
import java.text.SimpleDateFormat;
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

import com.skt.mobigen.hms.snapinfocollector.context.Context;
import com.skt.mobigen.hms.snapinfocollector.util.HttpRequestUtil;
import com.skt.mobigen.hms.snapinfocollector.util.JsonParserUtil;

public class SnapManagerPluginsInfoCollector implements Runnable{
	private Logger logger = LoggerFactory.getLogger(SnapManagerPluginsInfoCollector.class);
	private Context context;
	
	public SnapManagerPluginsInfoCollector(Context context) {
		this.context = context;
	}

	@SuppressWarnings("unchecked")
	@Override
	public void run() {
		logger.debug("snap manager plugin info collector start");
		SqlSession session = null;
		try{
			session = context.getSqlSessionFactory().openSession(ExecutorType.BATCH, false);
			String p_url = context.getRest_proto().concat("://");
//					.concat(context.getSnap_manager_connect_ip().concat(":"))
//					.concat(context.getSnap_manager_connect_port());
			String plugin_url = p_url.concat("/v1/plugins");
			
			Map<String, Object> result_map = JsonParserUtil.jsontoMap(HttpRequestUtil.sendRequest(plugin_url));
			Map<String, Object> result_body = (Map<String, Object>) result_map.get("body");
			
			List<Map<String, Object>> plugin_list = (List<Map<String, Object>>) result_body.get("loaded_plugins");
			
			if (plugin_list.size() > 0) {
				for (Map<String, Object> plugin_info : plugin_list) {
					plugin_info.put("loadedTimestamp", covertTimeformat(plugin_info.get("loaded_timestamp")));
					plugin_info.put("lastUpTime", getInsertTime());
					plugin_info.remove("loaded_timestamp");
				}
			}
			
			Map<String, Object> insert_data_map = new HashMap<>();
			insert_data_map.put("plugin_list_info", plugin_list);

//			logger.debug("plugin insert data: {}", new Gson().toJson(insert_data_map));
			
			session.insert("insert_manager_plugin_info", insert_data_map);
			
			session.commit();
			session.close();
			
		} catch (Exception e) {
			if (session != null) session.close();
			logger.error(ExceptionUtils.getStackTrace(e));
//			logger.error(ExceptionUtils.getMessage(e));
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
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd'T'hh:mm:ss'Z'");
		sdf.setTimeZone(TimeZone.getTimeZone("UTC"));
		
		return sdf.format(new Date().getTime());
	}
	
	

}
