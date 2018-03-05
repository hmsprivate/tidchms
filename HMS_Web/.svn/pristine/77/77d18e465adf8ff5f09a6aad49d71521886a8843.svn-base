package com.skt.hms.popup.model;

import java.util.List;

import org.apache.ibatis.type.Alias;
import org.springframework.web.multipart.MultipartFile;

import lombok.Data;

@Data
@Alias("popupSearchModel")
public class PopupSearchModel {
	private int pageIndex;
	private int pageCount;
	private String order;
	private String exp;
	
	//node detail
	private String nodeSeq;
	private List<String> nodeSeqList;
	private String firstLastUpTime;
	private String endLastUpTime;
	private String influxCollectTime;
	
	//plugin popup
	private String agreementSeq;
	private String[] pluginType;
	private String file;
	
	//node
	private String hostName;
	private String serialNumber;
	private String nodeType;
	private String ip;
	private String osName;
	private String manufacture;
	
	//task
	private String taskOrder;
	private String taskExp;
	private String taskFileName;
	
	private String groupId;
	private String taskName;
	private String taskState;
	
	private List<String> nodeMetricList;
	
	private List<String> dataList;
	private String mainCatInfo;
	private String isDefault;
	
}
