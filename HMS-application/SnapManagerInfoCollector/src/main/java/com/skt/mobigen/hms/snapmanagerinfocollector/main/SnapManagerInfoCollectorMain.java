package com.skt.mobigen.hms.snapmanagerinfocollector.main;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

import com.skt.mobigen.hms.snapmanagerinfocollector.jobfactory.SnapManagerInfoCollectorJobFactory;

public class SnapManagerInfoCollectorMain {
	private Logger logger = LoggerFactory.getLogger(SnapManagerInfoCollectorMain.class);

	public static void main(String[] args) {
		SnapManagerInfoCollectorMain main = new SnapManagerInfoCollectorMain();
		main.start();
	}

	private void start() {
		ApplicationContext applicationContext = new ClassPathXmlApplicationContext("classpath:application-context.xml");
		SnapManagerInfoCollectorJobFactory jobfactory = (SnapManagerInfoCollectorJobFactory) applicationContext.getBean("jobFactory");
		jobfactory.jobfactory();
	}

}
