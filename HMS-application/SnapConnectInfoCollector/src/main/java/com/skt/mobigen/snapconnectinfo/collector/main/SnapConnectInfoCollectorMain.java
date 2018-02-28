package com.skt.mobigen.snapconnectinfo.collector.main;

import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

import com.skt.mobigen.snapconnectinfo.collector.jobfactory.SnapConnectInfoCollectorJobfactory;


public class SnapConnectInfoCollectorMain {

	public static void main(String[] args) {
		SnapConnectInfoCollectorMain main = new SnapConnectInfoCollectorMain();
		main.start();
	}

	private void start() {
		ApplicationContext applicationContext = new ClassPathXmlApplicationContext("classpath:application-context.xml");
		SnapConnectInfoCollectorJobfactory jobfactory = (SnapConnectInfoCollectorJobfactory) applicationContext.getBean("jobFactory");
		jobfactory.jobfactory();
	}
}
