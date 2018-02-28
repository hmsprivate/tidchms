package com.skt.mobigen.hms.snapsynchronize.main;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

import com.skt.mobigen.hms.snapsynchronize.server.SnapSynchronizeHttpServer;

public class SnapSynchronizeMain {
	private Logger logger = LoggerFactory.getLogger(SnapSynchronizeMain.class);

	public static void main(String[] args) {
		SnapSynchronizeMain main = new SnapSynchronizeMain();
		main.start();
	}

	private void start() {
		ApplicationContext applicationContext = new ClassPathXmlApplicationContext("classpath:application-context.xml");
		SnapSynchronizeHttpServer server = (SnapSynchronizeHttpServer) applicationContext.getBean("snapSynchronizeHttpServer");
		server.start();
	}

}
