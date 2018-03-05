package com.skt.hms.user;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.skt.hms.user.model.AdRoleModel;
import com.skt.hms.user.model.PersonSearchModel;
import com.skt.hms.user.model.UserModel;
import com.skt.hms.user.model.UserSaveModel;
import com.skt.hms.user.model.UserSearchModel;

@Repository
public interface UserMapper {
	
	public List<UserModel> selectUserList(UserSearchModel userSearchModel) throws Exception;
	
	public int selectUserCnt(UserSearchModel userSearchModel) throws Exception;
	
	public List<PersonModel> selectPersonInfoList(PersonSearchModel personSearchModel) throws Exception;
	
	public int selectPersonInfoCnt(PersonSearchModel personSearchModel) throws Exception;
	
	public int insertUser(UserSaveModel userSaveModel) throws Exception;
	
	public int updateUser(UserSaveModel userSaveModel) throws Exception;
	
	public int deleteUser(UserSaveModel userSaveModel) throws Exception;
	
	public List<AdRoleModel> selectAdRoleList() throws Exception;
}
