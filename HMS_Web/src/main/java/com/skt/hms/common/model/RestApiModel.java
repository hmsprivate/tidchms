package com.skt.hms.common.model;

import lombok.Data;
import org.apache.ibatis.type.Alias;

import java.util.List;

@Data
@Alias("RestApiModel")
public class RestApiModel {
	private String ip;
	private String syncIp;
	private String apiType;
	private String tempApiType;

	private String groupName;
	private String groupSeq;
	private String groupId;
	
	private List<String> nodeNameList;
	
	private String filePath;
	private List<String> fileNameList;
	private List<String> pluginTypeList;
	private List<String> pluginNameList;
	private List<String> pluginVersionList;
	private String pluginFileName;
	private List<String> taskIdList;
	private List<String> taskDetailList;

	//O&M Snap Rest Api
	private String agreement_name;
	private String node_name;
	private String type;
	
	//private List<FloorModel> children;
}
