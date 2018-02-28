package com.skt.mobigen.hms.snapinfocollector.test;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;
import java.util.Properties;

import org.apache.commons.lang3.exception.ExceptionUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.jcraft.jsch.Channel;
import com.jcraft.jsch.ChannelExec;
import com.jcraft.jsch.ChannelSftp;
import com.jcraft.jsch.JSch;
import com.jcraft.jsch.Session;

public class Jsch_ReadFileTest {
	private Logger logger = LoggerFactory.getLogger(Jsch_ReadFileTest.class);
	
	private Session session = null;
    private Channel currentChannel = null;
	
	public static void main (String[] args) {
		Jsch_ReadFileTest main = new Jsch_ReadFileTest();
		main.test();
	}


	private void test() {
		logger.debug("jsch test start");
		try {
			
			String host="211.214.168.102";
			String user="hms";
			String pass="afnas123";
			
			remoteFileAccess(host, user, pass);
			
		} catch (Exception e) {
			logger.error(ExceptionUtils.getStackTrace(e));
		} finally {
			if (session != null) session.disconnect();
			if (currentChannel != null) currentChannel.disconnect();
		}
		
		
	}
	
	
	@SuppressWarnings("resource")
	private void remoteFileAccess(String host, String user, String pass) throws Exception {
		
		JSch jSch = new JSch();
		
		int port = 12122;
		
		session = jSch.getSession(user, host, port);
		session.setPassword(pass);
		
		Properties config = new Properties();
		config.put("StrictHostKeyChecking", "no");
		session.setConfig(config);
		session.connect();
		
		String dir = "/home/hms/Applications/snap/tasks";
		String command = "ls " + dir;
		
		List<String> files = new ArrayList<>();
		
		currentChannel = session.openChannel("exec");
		((ChannelExec)currentChannel).setCommand(command);
		currentChannel.setInputStream(null);
		((ChannelExec)currentChannel).setErrStream(System.err);
		InputStream in = currentChannel.getInputStream();
		InputStreamReader isr = new InputStreamReader(in, "UTF-8");
	    BufferedReader reader = new BufferedReader(isr);
	    currentChannel.connect();
	    String line = null;
	    while ((line = reader.readLine()) != null) {
	    	 files.add(line.trim());
	     }
	     
	     for (String filename : files) {
	    	 logger.debug("{}", filename);
	    	 
	    	 currentChannel = session.openChannel("sftp");
	    	 currentChannel.connect();
	    	 
	    	 ChannelSftp sftp_channel = (ChannelSftp) currentChannel;
	    	 sftp_channel.cd(dir);
	    	 in = sftp_channel.get(filename);
	    	 isr = new InputStreamReader(in, "UTF-8");
	    	 StringBuilder strb = new StringBuilder();
	    	 reader = new BufferedReader(isr);
	    	 
//	    	 BufferedReader br = new BufferedReader(file_isr);
	    	 String file_line = null;
	    	 while((file_line = reader.readLine()) != null) {
	    		 strb.append(file_line);
	    	 }
	    	 
	    	 logger.debug("->{}", strb.toString());
	    	 
	     }
	     
	     
		
		
		
		
		
		
	}

	
	
	
	
	
	
	
	
	
	
	
}
