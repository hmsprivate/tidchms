package com.skt.hms.common.model;

import lombok.Data;
import org.apache.ibatis.type.Alias;

import java.util.List;

@Data
@Alias("DatacenterModel")
public class DatacenterModel {
	private String datacenterId;
	private String type;
	private String assetNumber;
	private String nickId;
	private String name;
	private String resourceName;
	private String resourceSeq;
	private String resourceParentSeq;
	private String gps_coordinate;
	private String address;
	private String rackUnit;

	private String param_roomInfoId;	// H/W 명
	private String param_hwName;		// H/W 명
	private String param_hwStatus;	// H/W 상태
	private String param_hwType;		// H/W 타입
	private String param_personName;		// 담당자명

	private List<FloorModel> children;
}
