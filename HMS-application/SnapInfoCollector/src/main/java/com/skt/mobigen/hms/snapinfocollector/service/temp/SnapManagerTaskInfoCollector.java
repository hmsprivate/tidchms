package com.skt.mobigen.hms.snapinfocollector.service.temp;

import java.io.File;
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

import com.google.gson.Gson;
import com.skt.mobigen.hms.snapinfocollector.context.Context;

public class SnapManagerTaskInfoCollector implements Runnable {
	private Logger logger = LoggerFactory.getLogger(SnapManagerTaskInfoCollector.class);
	private Context context;
	
	public SnapManagerTaskInfoCollector(Context context) {
		this.context = context;
	}
	
	@Override
	public void run() {
		logger.debug("snap manager task info collector start");
		SqlSession session = null;
		RandomAccessFile raf = null;
		
		try {
			session = context.getSqlSessionFactory().openSession(ExecutorType.BATCH, false);
			
			File directory = new File("");
//					new File(context.getSnap_manager_task_dir());
			
			File[] file_array = directory.listFiles();
			
			Map<String, Object> insert_map = new HashMap<>();
			List<Map<String, Object>> insert_list = new ArrayList<>();
			for (File file : file_array) {
				Map<String, Object> task_file_map = new HashMap<>();
//				logger.debug("{}", file.getName());
				task_file_map.put("file_name", file.getName().trim());
				
				raf = new RandomAccessFile(file, "r");
				StringBuilder sb = new StringBuilder();
				String line = null;
				while ((line=raf.readLine()) != null) {
					sb.append(line);
					sb.append(System.getProperty("line.separator"));
				}
				task_file_map.put("file_contents", sb.toString());
				
				insert_list.add(task_file_map);
			}
			
			insert_map.put("insert_value_list", insert_list);
			insert_map.put("last_up_time", getInsertTime());
			
			logger.debug("{}", new Gson().toJson(insert_map));
			
			session.insert("insert_manager_task_info", insert_map);
			session.commit();
			
		} catch (Exception e) {
			logger.error(ExceptionUtils.getStackTrace(e));
//			logger.error(ExceptionUtils.getMessage(e));
			
		} finally {
			if (session != null) session.close();
			try{
				if (raf != null) raf.close();
			} catch (Exception e) {}
		}
		
	}
	
	private Object getInsertTime() {
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd'T'hh:mm:ss'Z'");
		sdf.setTimeZone(TimeZone.getTimeZone("UTC"));
		
		return sdf.format(new Date().getTime());
	}
	

}
