package com.skt.mobigen.hms.snapinfocollector.test;

import java.io.File;
import java.io.FileNotFoundException;
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
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

import com.skt.mobigen.hms.snapinfocollector.context.Context;

public class ChangeInputTest {
	private static Logger logger = LoggerFactory.getLogger(ChangeInputTest.class);
	
	public static void main(String[] args)  {
		SqlSession session = null;
		RandomAccessFile raf = null;
		try{
		String file_path = "/Users/hoya/Downloads/HMS/change_namespace.txt";
//		String file_path = "/Users/hoya/Downloads/HMS/change_namespace_skt.txt";
		ApplicationContext applicationContext = new ClassPathXmlApplicationContext("classpath:application-context.xml");
		Context context = (Context) applicationContext.getBean("context");
		
		
		session = context.getSqlSessionFactory().openSession(ExecutorType.BATCH, false);
		
		File file = new File(file_path);
		
		raf = new RandomAccessFile(file, "r");
		Object last_up_time = getInsertTime();
		List<Map<String, Object>> namespace_map_list = new ArrayList<>();
		String line = null;
		while ((line = raf.readLine()) != null) {
			Map<String, Object> namespace_map = new HashMap<>();
			if (!line.isEmpty()) {
				namespace_map.put("namespace", line.trim());
				namespace_map.put("last_up_time", last_up_time);
			}
			
			if (!namespace_map.isEmpty()) namespace_map_list.add(namespace_map);
		}
		
		logger.debug("{}",namespace_map_list);
		
		Map<String, Object> insert_data_map = new HashMap<>();
		insert_data_map.put("insert_data_list", namespace_map_list);
		
		
//		List<Map<String, Object>> connect_info_list = session.selectList("get_conncet_info");
		
		
		session.insert("insert_change_menagement_namespace", insert_data_map);
		
		
		session.commit();
		
		session.close();
		raf.close();
		
		
		} catch (Exception e) {
			logger.error(ExceptionUtils.getStackTrace(e));
			if (session != null) session.close();
			if (raf != null)
				try {
					raf.close();
				} catch (IOException e1) {
					logger.error(ExceptionUtils.getStackTrace(e));
				}
		}
		
	}
	
	private static Object getInsertTime() {
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		sdf.setTimeZone(TimeZone.getTimeZone("UTC"));
		
		return sdf.format(new Date().getTime());
	}
	


}
