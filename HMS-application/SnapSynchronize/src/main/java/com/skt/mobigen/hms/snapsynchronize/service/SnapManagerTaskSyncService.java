package com.skt.mobigen.hms.snapsynchronize.service;

import java.io.File;
import java.io.IOException;
import java.io.RandomAccessFile;
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

public class SnapManagerTaskSyncService implements IFSnapSynchronizeService {
	private Logger logger = LoggerFactory.getLogger(SnapManagerTaskSyncService.class);
	private Context context;

	public SnapManagerTaskSyncService(Context context) {
		this.context = context;
	}

	@Override
	public Object synchronizeService() {
		logger.debug("Snap Manager task Synchonize start");
		SqlSession session = null;
		RandomAccessFile raf = null;
		try {
			session = context.getSqlSessionFactory().openSession(ExecutorType.BATCH, false);

			File directory = new File(context.getSnap_manager_task_dir());
			File[] file_array = directory.listFiles();

			Map<String, Object> insert_map = new HashMap<>();
			List<Map<String, Object>> insert_list = new ArrayList<>();

			if (file_array != null) {
				for (File file : file_array) {
					Map<String, Object> task_file_map = new HashMap<>();
					task_file_map.put("file_name", file.getName().trim());

					raf = new RandomAccessFile(file, "r");
					StringBuilder sb = new StringBuilder();
					String line = null;
					while ((line = raf.readLine()) != null) {
						sb.append(line);
						sb.append(System.getProperty("line.separator"));
					}
					task_file_map.put("file_contents", sb.toString());
					insert_list.add(task_file_map);
				}
				
				Object last_up_time = getInsertTime();
				insert_map.put("insert_value_list", insert_list);
				insert_map.put("last_up_time", last_up_time);

				session.insert("insert_manager_task_info", insert_map);
				session.delete("delete_manager_task_info", last_up_time);
				session.commit();
				raf.close();
			} else {
				Object last_up_time = getInsertTime();
				session.delete("delete_manager_task_info", last_up_time);
				session.commit();
			}

			return "completed";
		} catch (Exception e) {
			logger.error(ExceptionUtils.getStackTrace(e));
			return ExceptionUtils.getMessage(e);
		} finally {
			if (session != null)
				session.close();
			if (raf != null)
				try {
					raf.close();
				} catch (IOException ie) {
					logger.error(ExceptionUtils.getMessage(ie));
				}

		}
	}

	private Object getInsertTime() {
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		sdf.setTimeZone(TimeZone.getTimeZone("UTC"));
		return sdf.format(new Date().getTime());
	}
}
