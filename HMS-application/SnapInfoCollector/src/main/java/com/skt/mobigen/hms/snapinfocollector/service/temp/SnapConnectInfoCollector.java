package com.skt.mobigen.hms.snapinfocollector.service.temp;

import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.concurrent.Callable;

import org.apache.commons.lang3.exception.ExceptionUtils;
import org.influxdb.InfluxDB;
import org.influxdb.InfluxDBFactory;
import org.influxdb.InfluxDB.LogLevel;
import org.influxdb.dto.Pong;
import org.influxdb.dto.Query;
import org.influxdb.dto.QueryResult;
import org.influxdb.dto.QueryResult.Series;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.google.gson.Gson;
import com.skt.mobigen.hms.snapinfocollector.context.Context;
import com.skt.mobigen.hms.snapinfocollector.util.HttpRequestUtil;
import com.skt.mobigen.hms.snapinfocollector.util.JsonParserUtil;

public class SnapConnectInfoCollector implements Callable<String> {
	private Logger logger = LoggerFactory.getLogger(SnapConnectInfoCollector.class);
	private Context context;
	private InfluxDB influxDB;
	private Map<String, Object> connect_info_map;

	public SnapConnectInfoCollector(Context context, Map<String, Object> connect_info_map) {
		this.context = context;
		this.connect_info_map = connect_info_map;
	}

	@SuppressWarnings("unchecked")
	@Override
	public String call() {
		try {
			logger.debug("snap connect info collector start");
			long snap_connect_info_collector_starttime = System.nanoTime();
			
			getInfluxDBSession();
			QueryResult queryresult = this.influxDB.query(new Query("select * from \"intel/facter/networking/ip\" group by source order by time desc limit 1", "hms"));
			
			List<Series> influx_member_result = queryresult.getResults().get(0).getSeries();
			
			Map<String, Object> total_connect_info_map = new HashMap<>();
			for (Series series_value : influx_member_result) {
				Map<String, Object> insert_data_map = new HashMap<>();
				insert_data_map.put("member_host", series_value.getValues().get(0).get(1));
				insert_data_map.put("rest_api_port", 8181);
				
				total_connect_info_map.put(series_value.getTags().get("source"), insert_data_map);
			}
			
//			logger.debug("total connect info : {} ", total_connect_info_map);
			
			Iterator<String> it = null;
			do {
				if (!total_connect_info_map.isEmpty()) {
					it = total_connect_info_map.keySet().iterator();
				} else {
					break;
				}
				String hostname = it.next();
				
//				logger.debug("host name: {}", hostname);
				
				Map<String, Object> info_map = (Map<String, Object>) total_connect_info_map.get(hostname);
				
				// TEST IP
//				String test_ip = "211.214.168.102";
//				String p_url = "http://"+test_ip.trim().concat(":").concat(String.valueOf(info_map.get("rest_api_port")));
				
				String p_url = "http://"+String.valueOf(info_map.get("member_host")).trim().concat(":").concat(String.valueOf(info_map.get("rest_api_port")));
				String seed_member_url = p_url.concat("/v1/tribe/members");
				
				logger.debug("url : {}", seed_member_url);
				Map<String, Object> response_map = JsonParserUtil.jsontoMap(HttpRequestUtil.sendRequest(seed_member_url));
				Map<String, Object> response_body = (Map<String, Object>) response_map.get("body");
				List<String> seed_member_list = (List<String>) response_body.get("members");
				
//				logger.debug("{}", seed_member_list);
				
				for (String seed_member : seed_member_list) {
					total_connect_info_map.remove(seed_member);
				}
				connect_info_map.put(hostname, info_map);
				
			} while(it.hasNext());
			
			influxDB.close();
			
			long snap_connect_info_collector_endtime = System.nanoTime();
			
			logger.debug("snap connect info collector time  : {}" , (snap_connect_info_collector_endtime - snap_connect_info_collector_starttime) / 1000000);
			
			return "completed";
		} catch (Exception e) {
			if (influxDB != null) influxDB.close();
			return "connect info Collector ".concat(ExceptionUtils.getMessage(e));
		}
	}

	private void getInfluxDBSession() throws Exception {

		String influx_url = "http://".concat(context.getInflux_connect_ip()).concat(":") + context.getInflux_connect_port();
		
		logger.debug("influx connection url : {}", influx_url);
		
		this.influxDB = InfluxDBFactory.connect(influx_url, "hms", "afnas123");
		Pong response;
		response = this.influxDB.ping();

		if (response.getVersion().equalsIgnoreCase("unknown")) throw new Exception("fail influxDB connect");
		this.influxDB.setLogLevel(LogLevel.NONE);

		logger.debug("##################################################################################");
		logger.debug("#  Connected to InfluxDB Version: " + this.influxDB.version() + " #");
		logger.debug("##################################################################################");

	}
}
