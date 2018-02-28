package com.skt.mobigen.hms.snapinfocollector.test;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang3.exception.ExceptionUtils;
import org.influxdb.InfluxDB;
import org.influxdb.InfluxDBFactory;
import org.influxdb.InfluxDB.LogLevel;
import org.influxdb.dto.Pong;
import org.influxdb.dto.Query;
import org.influxdb.dto.QueryResult;
import org.influxdb.dto.QueryResult.Result;
import org.influxdb.dto.QueryResult.Series;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;import com.google.gson.Gson;

public class InfluxQueryTest {
	private Logger logger = LoggerFactory.getLogger(InfluxQueryTest.class);
	private InfluxDB influxDB = null;
	
	private final String BASE_DATABASE = "hms";
	
	public static void main(String[] args) {
		InfluxQueryTest main = new InfluxQueryTest();
		main.test();
	}

	private void test() {
		try {
			
			getInfluxDBSession();
//			QueryResult queryresult = this.influxDB.query(new Query("show measurements", BASE_DATABASE));
			QueryResult queryresult = this.influxDB.query(new Query("show measurements", BASE_DATABASE));
//			QueryResult queryresult = this.influxDB.query(new Query("select * from \"intel/facter/networking/ip\" group by source order by time desc limit 1", BASE_DATABASE));
//			if (queryresult.getResults().size() > 0) {
//				List<Series> influx_member_result = queryresult.getResults().get(0).getSeries();
//				
//				List<Map<String, Object>> insert_data_map = new ArrayList<>();
//				for (Series series : influx_member_result) {
//					Map<String, Object> node_info_map = new HashMap<>();
//					
//					if (!series.getTags().isEmpty()) {
//						node_info_map.put("source", series.getTags().get("source"));
//					}
//					
//					for (int i = 0; i < series.getColumns().size(); i++) {
//						node_info_map.put("node_port", 8181);
//						node_info_map.put( series.getColumns().get(i), series.getValues().get(0).get(i));
//					}
//					insert_data_map.add(node_info_map);
//				}
//				
//				logger.debug("{}", new Gson().toJson(insert_data_map));
//				
//			}
			
			
			logger.debug("{}", queryresult);
			
		} catch (Exception e) {
			logger.error(ExceptionUtils.getStackTrace(e));
		} finally {
			if (influxDB != null) influxDB.close(); 
		}
		
	}
	
	private List<Series> getSeriesOfResponse(List<Result> results) {
		Result result = results.get(0);
		return result.getSeries();
	}
	
	private void getInfluxDBSession() throws Exception {
		
		String ip = "211.214.168.102";
		String port = "8086";

		String influx_url = "http://".concat(ip).concat(":") + port;
		
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
