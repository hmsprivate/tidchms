package com.skt.hms.plugin.model;

import org.apache.ibatis.type.Alias;

import lombok.Data;

@Data
@Alias("pluginMgmtModel")
public class PluginMgmtModel {
	private int agreementSeq;
	private String agreementName;
	
	//plugin
	private String rowNum;
	private String pluginSeq;
	private String pluginName;
	private String pluginVersion;
	private String pluginType;
	private String pluginSigned;
	private String pluginStatus;
	private String pluginLoadedTimestamp;
	private String pluginHref;
	private String lastUpTime;
	private String groupId;
	
	private String fileName;

}
