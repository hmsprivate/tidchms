package com.skt.hms.common.model;


import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;
import org.apache.ibatis.type.Alias;

import java.util.Map;

@Data
@Alias("DiagramInfoModel")
@JsonIgnoreProperties(ignoreUnknown = true)
public class DiagramInfoModel {
	private String diagramInfoId;
	private String title;
	private String saveInfoId;
	private String createDate;
	private String updateDate;
	private String version;
	private Map<String, Object> data;


}
