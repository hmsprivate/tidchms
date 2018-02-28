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

import com.skt.mobigen.hms.snapsynchronize.context.Context;
import com.skt.mobigen.hms.snapsynchronize.service.IFSnapSynchronizeService;
import com.skt.mobigen.hms.snapsynchronize.utils.HttpRequestUtil;
import com.skt.mobigen.hms.snapsynchronize.utils.JsonParserUtil;

public class SnapTaskSyncService implements IFSnapSynchronizeService {
	private Logger logger = LoggerFactory.getLogger(SnapTaskSyncService.class);
	private Context context;
	private Map<String, Object> receive_data_map;

	public SnapTaskSyncService(Context context, Map<String, Object> receive_data_map) {
		this.context = context;
		this.receive_data_map = receive_data_map;
	}

	@SuppressWarnings("unchecked")
	@Override
	public Object synchronizeService() {
		SqlSession session = null;
		try {
			session = context.getSqlSessionFactory().openSession(ExecutorType.BATCH, false);
			if (!receive_data_map.containsKey("node_name")
					&& receive_data_map.get("node_name").toString().trim().isEmpty())
				return null;

			String agreement_seq = session.selectOne("get_agreement_seq_info", receive_data_map.get("node_name").toString().trim());
			List<Map<String, Object>> insert_task_list = new ArrayList<>();
			Object last_up_time = getInsertTime();
			
			List<Map<String, Object>> connect_info_list = session.selectList("get_conncet_info_of_agreement", agreement_seq);
			Map<String, Object> connect_info_map = new HashMap<>();
			for (Map<String, Object> connect_info : connect_info_list) {
				connect_info_map.put(connect_info.get("member_name").toString().trim(), connect_info);
			}

			for (String host_name : connect_info_map.keySet()) {
				Map<String, Object> info_map = (Map<String, Object>) connect_info_map.get(host_name);

				String p_url = "http://" + String.valueOf(info_map.get("member_host")).trim().concat(":").concat(String.valueOf(info_map.get("rest_api_port")));
				String task_url = p_url.concat("/v1/tasks");

				String response_str = null;
				try {
					logger.debug("try " + task_url + " Connect");
					response_str = HttpRequestUtil.sendRequest(task_url);
					if (response_str.isEmpty() || response_str == null) throw new Exception(task_url + " response is ".concat(response_str));

				} catch (Exception e) {
					logger.error(ExceptionUtils.getMessage(e));
					continue;
				}

				Map<String, Object> response_map = JsonParserUtil.jsontoMap(response_str);
				
				if (response_map != null) {
					Map<String, Object> response_body = (Map<String, Object>) response_map.get("body");
					List<Map<String, Object>> task_list = (List<Map<String, Object>>) response_body
							.get("ScheduledTasks");

					if (!task_list.isEmpty()) {
						for (Map<String, Object> task_info : task_list) {
							task_info.put("creation_timestamp", covertTimeformat(task_info.get("creation_timestamp")));
							task_info.put("last_run_timestamp", covertTimeformat(task_info.get("last_run_timestamp")));
							task_info.put("last_up_time", last_up_time);
							task_info.put("agreement_seq", agreement_seq);
						}
						insert_task_list.addAll(task_list);
					}
				}
			}

			// logger.debug("{}", insert_task_list);

			if (!insert_task_list.isEmpty()) {
				Map<String, Object> insert_data_map = new HashMap<>();
				insert_data_map.put("task_list_info", insert_task_list);
				logger.debug("snap task sychronize insert start");
				session.insert("insert_task_info", insert_data_map);
			}
			
			Map<String, Object> delete_value_map = new HashMap<>();
			delete_value_map.put("last_up_time", last_up_time);
			delete_value_map.put("agreement_seq", agreement_seq);
			session.delete("delete_task_synchronization", delete_value_map);
			session.commit();

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
			SimpleDateFormat sdfCurrent = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
			Timestamp currentTime = new Timestamp(Long.parseLong(String.valueOf(timestamp)) * 1000);

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
