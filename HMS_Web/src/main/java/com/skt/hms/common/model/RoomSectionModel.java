package com.skt.hms.common.model;

import lombok.Data;
import org.apache.ibatis.type.Alias;

import java.util.List;

@Data
@Alias("RoomSectionModel")
public class RoomSectionModel {
	private String roomInfoId;
	private String positionX;
	private String positionY;
	private String type;
	private String rackId;
	private String userId;
	private String saveType;
}
