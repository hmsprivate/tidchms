package com.skt.hms.common.model;

import lombok.Data;
import org.apache.ibatis.type.Alias;

import java.util.List;

@Data
@Alias("RackModel")
public class RackModel {
	private String rackId;
	private String roomInfoId;
	private String type;
	private String unitCnt;
	private String maxServerCount;
	private String positionX;
	private String positionY;
	private String deadCoordinate;
	private String resourceName;
	private String resourceSeq;
	private String resourceParentSeq;

	private List<HardwareModel> children;
}
