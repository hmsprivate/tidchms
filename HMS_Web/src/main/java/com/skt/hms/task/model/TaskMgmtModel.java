package com.skt.hms.task.model;

import org.apache.ibatis.type.Alias;

import lombok.Data;

@Data
@Alias("taskMgmtModel")
public class TaskMgmtModel {
	private int agreementSeq;
	private String agreementName;
	
	//task
	private String taskFileName;
	private String taskFileContents;
	private String lastUpTime;

}
