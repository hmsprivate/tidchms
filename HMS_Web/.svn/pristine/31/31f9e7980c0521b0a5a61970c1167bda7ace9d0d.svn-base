package com.skt.hms.user.model;

import java.util.Collection;

import org.apache.ibatis.type.Alias;
import org.hibernate.validator.constraints.Length;
import org.springframework.security.core.GrantedAuthority;

import com.mobigen.framework.security.IUserModel;

import lombok.Data;

@Data
@Alias("UserModel")
@SuppressWarnings("serial")
public class UserModel implements IUserModel {
	
	@Length(min=4, max=64)
	private String name;
	
	@Length(min=4, max=64)
	private String password;
	
	private int userId;
	private String empno;
	private String realName;
	private String department;
	private String phone;
	private String email;
	private int defaultDatacenter;
	private int approved;
	private String approvedName;
	private String createDate;
	private String updateDate;
	private String roleId;
	private int roleGrade;
	private String affairs;
	private String roleGradeName;
	
    public void setUsername(String value) {
    	name = value;    	
    }

	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		return null;
	}

	@Override
	public String getUsername() {
		return name;
	}

	@Override
	public boolean isAccountNonExpired() {
		return false;
	}

	@Override
	public boolean isAccountNonLocked() {
		return false;
	}

	@Override
	public boolean isCredentialsNonExpired() {
		return false;
	}

	@Override
	public boolean isEnabled() {
		return false;
	}

	public String getUserRole() {
		return roleId;
	}
	public void setUserRole(String value) {
		roleId = value;
	}
	
}
