package com.skt.mobigen.hms.snapinfocollector.test;

import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.concurrent.Callable;

import org.apache.ibatis.session.SqlSession;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.skt.mobigen.hms.snapinfocollector.context.Context;
import com.skt.mobigen.hms.snapinfocollector.util.HttpRequestUtil;
import com.skt.mobigen.hms.snapinfocollector.util.JsonParserUtil;

public class AgreementInfoTest implements Callable<String> {
	private Logger logger = LoggerFactory.getLogger(AgreementInfoTest.class);
	private Context context;

	public AgreementInfoTest(Context context) {
		this.context = context;
	}

	@SuppressWarnings("unchecked")
	@Override
	public String call() throws Exception {
		SqlSession session = null;
		try {
			logger.debug("agreement test start");
			session = context.getSqlSessionFactory().openSession();
			List<Map<String, Object>> connect_info_list = session.selectList("get_connection_info_test");
			
			// list to map
			Map<String, Object> connect_info_map = new HashMap<>();
			for (Map<String, Object> connect_info : connect_info_list) {
				String name = connect_info.get("member_name").toString();
				connect_info.remove("member_name");
				connect_info_map.put(name, connect_info);
			}
			
			logger.debug("agreement connect_info map : {}", connect_info_map);
			
			
			Map<String, Object> process_connect_info_map = new HashMap<>();
			
			Iterator<String> it = null;
			do{
				if (!connect_info_map.isEmpty()) {
					it = connect_info_map.keySet().iterator();
				} else {
					break;
				}
				String hostname = it.next();
				
				logger.debug("hostname: {}", hostname);
				
				Map<String, Object> info_map = (Map<String, Object>) connect_info_map.get(hostname);
				
				// TEST IP
				String test_ip = "211.214.168.102";
				String p_url = "http://"+test_ip.trim().concat(":").concat(String.valueOf(info_map.get("rest_api_port")));
				String seed_member_url = p_url.concat("/v1/tribe/members");
				
				logger.debug("url : {}", seed_member_url);
				Map<String, Object> response_map = JsonParserUtil.jsontoMap(HttpRequestUtil.sendRequest(seed_member_url));
				Map<String, Object> response_body = (Map<String, Object>) response_map.get("body");
				List<String> seed_member_list = (List<String>) response_body.get("members");
				
				logger.debug("{}", seed_member_list);
				
				for (String seed_member : seed_member_list) {
					connect_info_map.remove(seed_member);
				}
//				if (connect_info_map.size() > 0)
//					it = connect_info_map.keySet().iterator();
				
				process_connect_info_map.put(hostname, info_map);
				
			}while(it.hasNext());
			
			logger.debug("seed_connection_info : {}",  process_connect_info_map);
			
//			for (String hostname : connect_info_map_clone.keySet()) {
//				
//				logger.debug("{}", hostname);
//				
//				Map<String, Object> info_map = (Map<String, Object>) connect_info_map.get(hostname);
//				
//				// TEST IP
//				String test_ip = "http://211.214.168.102";
//				String p_url = "http".concat("://").concat(test_ip.trim().concat(":")).concat(String.valueOf(info_map.get("rest_api_port")));
//				String seed_member_url = p_url.concat("/v1/tribe/members");
//				
//				logger.debug("url : {}", seed_member_url);
//				
//				// seed 대표 ip get.
//				process_connect_info_map.put("hostname", connect_info_map.get(hostname));
//				
//				
//				//TODO
//				// get 한 seed 정보로 list delete.
//				
//				connect_info_map.remove("secure01");
//				
//				connect_info_map.remove(hostname);
//				
//			}
			
			
			session.close();
			return "1";
		} catch (Exception e) {
			if (session != null) session.close();
			return "0";
		}
	}

}
