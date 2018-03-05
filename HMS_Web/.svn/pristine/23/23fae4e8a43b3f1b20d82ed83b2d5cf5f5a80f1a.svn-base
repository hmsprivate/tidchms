package com.skt.hms.user.model;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

@Data
public class PersonSearchModel {

	private int currentPageNo;
	private int pageSize;
	private String empNo;
	private String deptNm;
	@JsonProperty("hName")
	private String hName;
	private String placeNm;

	public int getStartPageNo() {
		return (currentPageNo - 1) * pageSize;
	}
}