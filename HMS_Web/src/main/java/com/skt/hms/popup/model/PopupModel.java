package com.skt.hms.popup.model;

import org.apache.ibatis.type.Alias;

import lombok.Data;

@Data
@Alias("popupModel")
public class PopupModel {
	//node detail
	private int nodeSeq;
	private String metricName;
	private String metricValue;
	private String beforeValue;
	private String changeFlag;
	
	private String memberName;
	private String memberHost;
	private String rowCnt;
	private String rowCnt2;
	private String metricDir;
	private String metricDir2;
	private String value;
	private String label;
	private boolean checked = false;
	

	
	//plugin popup
	private int agreementSeq;
	private String agreementName;
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
	private String fileName;
	
	
	//task
	private String taskId;
	private String taskName;
	private String taskDeadline;
	private String taskCreationTimestamp;
	private String taskLastRunTimestamp;
	private String taskHitCount;
	private String taskState;
	private String taskHref;
	private String missCount;
	private String scheduleType;
	private String scheduleInterval;
	
	private String taskFileName;
	private String taskFileContents;
	
	//node
	private String hostName;
	private String serialNumber;
	private String ip;
	private String restApiPort;
	private String cpuCnt;
	private String cpuType;
	private String memory;
	private String disk;
	private String nodeType;
	private String osName;
	private String osVersion;
	private String osArchitecture;
	private String manufacture;
	private String influxCollectTime;
	
	private String collectTime;
	private String taskLastFailureMessage;

}
