package com.skt.mobigen.hms.snapinfocollector.service;

import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.Callable;

import org.apache.commons.lang3.exception.ExceptionUtils;
import org.apache.ibatis.session.SqlSession;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.google.gson.Gson;
import com.skt.mobigen.hms.snapinfocollector.context.Context;
import com.skt.mobigen.hms.snapinfocollector.util.HttpRequestUtil;
import com.skt.mobigen.hms.snapinfocollector.util.JsonParserUtil;

public class SnapMetricInfoCollectorService implements Callable<String>{
	private Logger logger = LoggerFactory.getLogger(SnapMetricInfoCollectorService.class);
	private Context context;
	
	public SnapMetricInfoCollectorService(Context context) {
		this.context = context;
	}

	@SuppressWarnings("unchecked")
	@Override
	public String call() {
		logger.debug("snap metric info collector start");
		SqlSession session = null;
		try {
			session = context.getSqlSessionFactory().openSession(false);
			String p_url = context.getRest_proto().concat("://").concat(context.getSnap_connect_ip().concat(":"))
					.concat(String.valueOf(context.getSnap_connect_port()));
			String metric_url = p_url.concat("/v1/metrics");
			
			Map<String, Object> result_map = JsonParserUtil.jsontoMap(HttpRequestUtil.sendRequest(metric_url));
			List<Map<String, Object>> metric_list = (List<Map<String, Object>>) result_map.get("body");
			
			if (metric_list.size() > 0) {
				for (Map<String, Object> metric_info : metric_list) {
					metric_info.put("lastAdvertisedTimestamp", covertTimeformat(metric_info.get("last_advertised_timestamp")));
					metric_info.remove("last_advertised_timestamp");
				}
			}
			Map<String, Object> insert_data_map = new HashMap<>();
			insert_data_map.put("metric_info_list", metric_list);
			session.insert("insert_metric_info", insert_data_map);
			
			session.commit();
			session.close();
			return "completed";
		} catch (Exception e) {
			if (session != null) session.close();
			return "Metric Info Collector ".concat(ExceptionUtils.getMessage(e));
			
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

}
