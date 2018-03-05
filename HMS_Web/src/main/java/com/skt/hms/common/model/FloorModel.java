package com.skt.hms.common.model;

import lombok.Data;
import org.apache.ibatis.type.Alias;

import java.util.List;

@Data
@Alias("FloorModel")
public class FloorModel {
	private String datacenterId;
	private String type;
	private String floorPlanId;
	private String name;
	private String floorNo;
	private String horizonType;
	private String verticalType;
	private String resourceName;
	private String resourceSeq;
	private String resourceParentSeq;

	private List<RoomModel> children;
}
