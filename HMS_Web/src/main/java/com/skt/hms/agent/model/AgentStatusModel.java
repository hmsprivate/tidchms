package com.skt.hms.agent.model;

import java.util.Date;

import org.apache.ibatis.type.Alias;

import lombok.Data;

@Data
@Alias("agentStatusModel")
public class AgentStatusModel {
	private String rowNum;
	private String agreementSeq;
	private String agreementName;
	private Date insertTime;
	private String hostName;
	private String ip;
	private String status;
	private String lastUpTime;
	
	private String value;
	private String label;
}
