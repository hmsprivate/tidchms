package com.skt.mobigen.hms.snapsynchronize.service.old;

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

import com.skt.mobigen.hms.snapsynchronize.context.Context;
import com.skt.mobigen.hms.snapsynchronize.service.IFSnapSynchronizeService;
import com.skt.mobigen.hms.snapsynchronize.utils.HttpRequestUtil;
import com.skt.mobigen.hms.snapsynchronize.utils.JsonParserUtil;

public class SnapTaskSyncService2 implements IFSnapSynchronizeService {
	private Logger logger = LoggerFactory.getLogger(SnapTaskSyncService2.class);
	private Context context;
	private Map<String, Object> receive_data_map;

	public SnapTaskSyncService2(Context context, Map<String, Object> receive_data_map) {
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
			
			if (connect_info == null) 
				return null;
			
//			//TEST
//			connect_info.put("member_host", "211.214.168.102");
			
			String p_url = "http://".concat(connect_info.get("member_host").toString().trim().concat(":")).concat(connect_info.get("rest_api_port").toString().trim());
			String tasks_url = p_url.concat("/v1/tasks");
			
			Map<String, Object> response_map = JsonParserUtil.jsontoMap(HttpRequestUtil.sendRequest(tasks_url));
			Map<String, Object> response_body = (Map<String, Object>) response_map.get("body");
			List<Map<String, Object>> task_list = (List<Map<String, Object>>) response_body.get("ScheduledTasks");
			
			if (!task_list.isEmpty()) {
				Object last_up_time = getInsertTime();

				if (task_list.size() > 0) {
					for (Map<String, Object> task_info : task_list) {
						task_info.put("creation_timestamp", covertTimeformat(task_info.get("creation_timestamp")));

						if (!task_info.containsKey("hit_count"))
							task_info.put("hit_count", 0);

						if (Integer.parseInt(task_info.get("last_run_timestamp").toString()) > 0) {
							task_info.put("last_run_timestamp", covertTimeformat(task_info.get("last_run_timestamp")));
						}
						task_info.put("last_up_time", last_up_time);
					}
				}
				Map<String, Object> insert_data_map = new HashMap<>();
				insert_data_map.put("task_list_info", task_list);

				session.insert("insert_task_info", insert_data_map);
//				session.delete("delete_task_synchronization", last_up_time);
				session.commit();

				response_map.clear();
				response_body.clear();
				String agreement_url = p_url.concat("/v1/tribe/agreements");
				response_map = JsonParserUtil.jsontoMap(HttpRequestUtil.sendRequest(agreement_url));
				response_body = (Map<String, Object>) response_map.get("body");
				Map<String, Object> agreement_map = (Map<String, Object>) response_body.get("agreements");

				for (String agreement_name : agreement_map.keySet()) {
					Map<String, Object> agreement_info_map = (Map<String, Object>) agreement_map.get(agreement_name);
					Map<String, Object> task_agreement_map = (Map<String, Object>) agreement_info_map.get("task_agreement");

					if (!task_agreement_map.isEmpty()) {
						List<Map<String, Object>> task_info_list = (List<Map<String, Object>>) task_agreement_map.get("tasks");
						session.update("update_init_task_agreement", agreement_name);

						for (Map<String, Object> task_info : task_info_list) {

							task_info.put("agreement_name", agreement_name);
							session.update("update_agreement_task_info", task_info);
						}
						session.commit();
					}
				}
			} 
//			else {
//				Object last_up_time = getInsertTime();
//				session.delete("delete_task_synchronization", last_up_time);
//				session.commit();
//			}

			return "completed";
		} catch (Exception e) {
			return ExceptionUtils.getMessage(e);
		} finally {
			if (session != null)
				session.close();
		}
	}
	
	private Object covertTimeformat(Object timestamp) {
		if (timestamp != null) {
			SimpleDateFormat sdfCurrent = new SimpleDateFormat("yyyy-MM-dd'T'hh:mm:ss'Z'");
			Timestamp currentTime = new Timestamp(Long.parseLong(String.valueOf(timestamp)) * 1000);

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
