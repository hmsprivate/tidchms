package com.skt.hms.group.model;

import java.util.List;

import org.apache.ibatis.type.Alias;

import lombok.Data;

@Data
@Alias("groupMgmtSearchModel")
public class GroupMgmtSearchModel {
	private int pageIndex;
	private int pageCount;
	
	private int limit = 0;
	
	private String groupId;
	
	//plugin
	private String plugOrder;
	private String plugExp;
	private String pluginSeq;
	private String[] pluginType;
	
	//task
	private String taskOrder;
	private String taskExp;
	private String taskId;
	
	
	//node
	private String order;
	private String exp;
	
	private String hostName;
	private String serialNumber;
	private String nodeType;
	private String ip;
	private String osName;
	private String manufacture;
	private String isDefault;
	
	private List<String> nodeNameList;
	
	private List<String> nodeSeqTrashBinList;
	private String nodeSeq;
	private String useFlag;
	private String agreementSeq;
	private String status;
	private String idx;
	private List<String> idxRecoveryList;
	private List<String> nodeSeqRecoveryList;
}
