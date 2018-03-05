package com.skt.hms.user.model;

import lombok.Data;

@Data
public class UserSearchModel {
	
	private int currentPageNo;
	private int pageSize;
	private String empno;
	private String deptNm;
	private String realName;
	private String placeNm;

	public int getStartPageNo() {
		return (currentPageNo - 1) * pageSize;
	}
	
}