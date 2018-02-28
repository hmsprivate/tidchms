package com.skt.mobigen.hms.snapinfocollector.test;

import java.io.File;
import java.io.RandomAccessFile;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.google.gson.Gson;

public class FileTest {
	private Logger logger = LoggerFactory.getLogger(FileTest.class);

	public static void main(String[] args) {
		
		FileTest main = new FileTest();
		try {
			main.test();
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

	private void test() throws Exception{
		String dir="/Users/hoya/Downloads/HMS/tasks";
		
		File directory = new File(dir);
		
		File[] file_array = directory.listFiles();
		
		
		List<Map<String, Object>> insert_list = new ArrayList<>();
		for (File file : file_array) {
			Map<String, Object> task_file_map = new HashMap<>();
//			logger.debug("{}", file.getName());
			task_file_map.put("file_name", file.getName().trim());
			
			RandomAccessFile raf = new RandomAccessFile(file, "r");
			StringBuilder sb = new StringBuilder();
			String line = null;
			while ((line=raf.readLine()) != null) {
				sb.append(line);
			}
			task_file_map.put("file_contents", sb.toString());
			
			insert_list.add(task_file_map);
		}
		
		logger.debug("{}", new Gson().toJson(insert_list));
		
		
	}

}
