package com.skt.hms.group.model;

import org.apache.ibatis.type.Alias;

import lombok.Data;

@Data
@Alias("trashBinModel")
public class TrashBinModel {
	private String idx;
	private String nodeSeq;
	private String hostName;
	private String serialnumber;
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
	private String model;
	private String agreementSeq;
	private String agreementName;
	private String influxCollectTime;
	private String lastChangeTime;
	private String deleteNodeTime;
	private String nodeRecoveryTime;
	private boolean checked = false;
}
