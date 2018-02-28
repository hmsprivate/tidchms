package com.skt.mobigen.hms.snapsynchronize.server.test;

import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.fasterxml.jackson.databind.ObjectMapper;

public class JobFactoryTest {
	private Logger logger = LoggerFactory.getLogger(JobFactoryTest.class);
	
	
	public void factory(String data) {
		try {
		logger.debug("{}", jsontoMap(data));
		} catch (Exception e) {
			logger.debug(e.toString());
		}
	}
	
	
	private Map<String, Object> jsontoMap(String json) throws Exception {
		return new ObjectMapper().readValue(json, Map.class);
	}

}
