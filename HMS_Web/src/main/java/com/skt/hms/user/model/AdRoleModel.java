package com.skt.hms.user.model;

import lombok.Data;

@Data
public class AdRoleModel {
	
	private int roleId;
	private String name;
	
	public String getLabel(){
		return name;
	}
	
	public int getValue(){
		return roleId;
	}
}
