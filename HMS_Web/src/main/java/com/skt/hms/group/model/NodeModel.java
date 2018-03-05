package com.skt.hms.group.model;

import java.util.List;

import org.apache.ibatis.type.Alias;

import lombok.Data;

@Data
@Alias("nodeModel")
public class NodeModel {
	private int agreementSeq;
	private String agreementName;
	
	//node
	private String groupId;
	private int nodeSeq;
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
	
}
