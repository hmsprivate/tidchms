package com.skt.hms.plugin.model;

import java.util.List;

import org.apache.ibatis.type.Alias;

import lombok.Data;

@Data
@Alias("pluginMgmtSearchModel")
public class PluginMgmtSearchModel {
	
	private String groupId;
	
	//plugin
	private String plugOrder;
	private String plugExp;
	private String pluginSeq;
	private String[] pluginType;
	private String pluginName;
	private String pluginStatus;
	
	private List<String> pluginNameList;
	
}
