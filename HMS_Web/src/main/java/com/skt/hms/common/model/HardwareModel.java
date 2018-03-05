package com.skt.hms.common.model;

import lombok.Data;
import org.apache.ibatis.type.Alias;

import java.util.List;

@Data
@Alias("HardwareModel")
public class HardwareModel {
	private String hardwareCommonId;
	private String rackId;
	private String type;
	private String rackColumnName;
	private String holeNo;
	private String assetNumber;
	private String assetCode;
	private String hwType;
	private String status;
	private String hwName;
	private String manufacturer;
	private String vendor;
	private String modelNo;
	private String serialNumber;
	private String datacenterId;
	private String provider;
	private String maintenanceCompanyName;
	private String maintenanceStartAt;
	private String maintenanceEndAt;
	private String owner;
	private String stockEquipmentComeAt;
	private String lastModifiedAt;
	private String disposeAt;
	private String remark;
	private String powerType;
	private String lockYn;
	private String deleteYn;
	private String resourceName;
	private String resourceSeq;
	private String resourceParentSeq;

	private List<HardwareStaffModel> hardwareStaffModel;
}
