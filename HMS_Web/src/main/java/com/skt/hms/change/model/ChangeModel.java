package com.skt.hms.change.model;

import org.apache.ibatis.type.Alias;

import lombok.Data;

@Data
@Alias("changeModel")
public class ChangeModel {
	private String lastChangeTime;
	private int agreementSeq;
	private String agreementName;
	private int nodeSeq;
	private String hostName;
	private String serialNumber;
	private String ip;
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
