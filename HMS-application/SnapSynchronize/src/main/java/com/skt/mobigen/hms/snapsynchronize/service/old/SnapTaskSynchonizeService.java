package com.skt.mobigen.hms.snapsynchronize.service.old;

import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.TimeZone;

import org.apache.commons.lang3.exception.ExceptionUtils;
import org.apache.ibatis.session.SqlSession;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.skt.mobigen.hms.snapsynchronize.context.Context;
import com.skt.mobigen.hms.snapsynchronize.service.IFSnapSynchronizeService;
import com.skt.mobigen.hms.snapsynchronize.utils.HttpRequestUtil;
import com.skt.mobigen.hms.snapsynchronize.utils.JsonParserUtil;

public class SnapTaskSynchonizeService implements IFSnapSynchronizeService {
	private Logger logger = LoggerFactory.getLogger(SnapTaskSynchonizeService.class);
	private Map<String, Object> receive_data_map;
	private Context context;

	public SnapTaskSynchonizeService(Context context, Map<String, Object> receive_data_map) {
		this.receive_data_map = receive_data_map;
		this.context = context;
	}

	@SuppressWarnings("unchecked")
	@Override
	public Object synchronizeService() {
		SqlSession session = null;
		try {
			session = context.getSqlSessionFactory().openSession(false);
			
			String connect_ip = receive_data_map.get("member_host").toString().trim();
			String connect_port = receive_data_map.get("rest_api_port").toString().trim();

			String p_url = "http://".concat(connect_ip.concat(":")).concat(connect_port);
			String tasks_url = p_url.concat("/v1/tasks");
			
			Map<String, Object> result_map = JsonParserUtil.jsontoMap(HttpRequestUtil.sendRequest(tasks_url));
			Map<String, Object> result_body = (Map<String, Object>) result_map.get("body");
			List<Map<String, Object>> task_list = (List<Map<String, Object>>) result_body.get("ScheduledTasks");

			if (task_list.size() > 0) {
				for (Map<String, Object> task_info : task_list) {

					task_info.put("creationTimestamp", covertTimeformat(task_info.get("creation_timestamp")));
					task_info.put("lastRunTimestamp", covertTimeformat(task_info.get("last_run_timestamp")));
					task_info.put("hitCount", task_info.get("hit_count"));
					task_info.put("taskState", task_info.get("task_state"));
					task_info.put("lastUpTime", getInsertTime());
					
					task_info.remove("creation_timestamp");
					task_info.remove("last_run_timestamp");
					task_info.remove("hit_count");
					task_info.remove("task_state");
				}
			}

			Map<String, Object> insert_data_map = new HashMap<>();
			insert_data_map.put("task_list_info", task_list);
			session.insert("insert_task_info", insert_data_map);

			session.commit();
			session.close();
			return "completed";
		} catch (Exception e) {
			if (session != null) session.close();
			logger.error(ExceptionUtils.getStackTrace(e));
			return e.getMessage();
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
