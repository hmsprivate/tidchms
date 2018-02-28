package com.skt.mobigen.hms.snapinfocollector.service.temp;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Properties;
import java.util.TimeZone;

import org.apache.commons.lang3.exception.ExceptionUtils;
import org.apache.ibatis.session.ExecutorType;
import org.apache.ibatis.session.SqlSession;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.google.gson.Gson;
import com.jcraft.jsch.Channel;
import com.jcraft.jsch.ChannelExec;
import com.jcraft.jsch.ChannelSftp;
import com.jcraft.jsch.JSch;
import com.jcraft.jsch.Session;
import com.skt.mobigen.hms.snapinfocollector.context.Context;

public class SnapManagerTaskInfoCollectorRemote implements Runnable {
	private Logger logger = LoggerFactory.getLogger(SnapManagerTaskInfoCollectorRemote.class);
	private Context context;
	
	public SnapManagerTaskInfoCollectorRemote(Context context) {
		this.context = context;
	}
	
	
	@Override
	public void run() {
		logger.debug("snap manager task info collector start");
		SqlSession session = null;
		Session jsch_session = null;
		Channel channel = null;
		InputStream in = null;
		InputStreamReader isr = null;
		BufferedReader reader = null;
		
		try {
			session = context.getSqlSessionFactory().openSession(ExecutorType.BATCH, false);
			
			JSch jsch = new JSch();
			
//			jsch_session = jsch.getSession(context.getManager_ssh_user(), context.getSnap_manager_connect_ip(), Integer.parseInt(context.getManager_ssh_port()));
//			jsch_session.setPassword(context.getManager_ssh_password());
			
			Properties config = new Properties();
			// host info check no
			config.put("StrictHostKeyChecking", "no");
			jsch_session.setConfig(config);
			jsch_session.connect();
			
//			String command = "ls ".concat(context.getSnap_manager_task_dir());
			String command = null;
			List<String> file_list = new ArrayList<>();
			
			channel = jsch_session.openChannel("exec");
			((ChannelExec)channel).setCommand(command);
			channel.setInputStream(null);
			((ChannelExec)channel).setErrStream(System.err);
			
			in = channel.getInputStream();
			isr = new InputStreamReader(in, "UTF-8");
			reader = new BufferedReader(isr);
			channel.connect();
			
			String line = null;
			while((line = reader.readLine()) != null) {
				file_list.add(line);
			}
			
			Map<String, Object> insert_map = new HashMap<>();
			List<Map<String, Object>> insert_list = new ArrayList<>();
			
			for (String file_name : file_list) {
				
				Map<String, Object> insert_value = new HashMap<>();
				
				insert_value.put("file_name", file_name);
				
				channel = jsch_session.openChannel("sftp");
				channel.connect();
				
				ChannelSftp sftp_channel = (ChannelSftp) channel;
//				sftp_channel.cd(context.getSnap_manager_task_dir());
				in = sftp_channel.get(file_name);
				isr = new InputStreamReader(in, "UTF-8");
				StringBuilder strb = new StringBuilder();
				reader = new BufferedReader(isr);
				
				String file_line = null;
				while ((file_line = reader.readLine()) != null) {
					strb.append(file_line);
				}
				
				insert_value.put("file_contents", strb.toString());
				
				insert_list.add(insert_value);
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
			if (channel != null) channel.disconnect();
			if (jsch_session != null) jsch_session.disconnect();
			try{
				if (in != null) in.close();
				if (isr != null) isr.close();
				if (reader != null) reader.close();
			} catch (Exception e) {}
		}
		
	}
	
	private Object getInsertTime() {
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd'T'hh:mm:ss'Z'");
		sdf.setTimeZone(TimeZone.getTimeZone("UTC"));
		
		return sdf.format(new Date().getTime());
	}
	

}
