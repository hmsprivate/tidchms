package com.skt.mobigen.hms.snapsynchronize.utils;

import java.util.List;
import java.util.Map;

import com.fasterxml.jackson.databind.ObjectMapper;

@SuppressWarnings("unchecked")
public class JsonParserUtil {

	public static List<Map<String, Object>> jsontoListMap(String json) throws Exception {
		return new ObjectMapper().readValue(json, List.class);
	}

	public static Map<String, Object> jsontoMap(String json) throws Exception {
		return new ObjectMapper().readValue(json, Map.class);
	}

}
