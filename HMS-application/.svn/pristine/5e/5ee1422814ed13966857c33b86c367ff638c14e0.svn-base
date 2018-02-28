package com.skt.mobigen.hms.snapinfocollector.main;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

import com.skt.mobigen.hms.snapinfocollector.jobfactory.SnapInfoCollectorJonFactory;

public class SnapInfoCollectorMain {
	private Logger logger = LoggerFactory.getLogger(SnapInfoCollectorMain.class);

	public static void main(String[] args) {
		SnapInfoCollectorMain main = new SnapInfoCollectorMain();
		main.start();
	}

	private void start() {
		@SuppressWarnings("resource")
		ApplicationContext applicationContext = new ClassPathXmlApplicationContext("classpath:application-context.xml");
		SnapInfoCollectorJonFactory jonFactory =  (SnapInfoCollectorJonFactory) applicationContext.getBean("jobFactory");
		jonFactory.jobFactory();
	}
}
