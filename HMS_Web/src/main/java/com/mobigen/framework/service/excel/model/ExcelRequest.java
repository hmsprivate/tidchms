package com.mobigen.framework.service.excel.model;

import java.util.List;
import java.util.Map;

import lombok.Data;

@Data
public class ExcelRequest {
	private String fileName;
	private String queryId;
	private Map<String, String> parameter;
	private List<Map<String, String>> headers;
}
