package com.skt.hms.user;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.skt.hms.user.model.AdRoleModel;
import com.skt.hms.user.model.PersonSearchModel;
import com.skt.hms.user.model.UserSaveModel;
import com.skt.hms.user.model.UserSearchModel;

@Service
public class UserService {

	@Autowired
	private UserMapper userMapper;
	
	public Map<String, Object> getUserList(UserSearchModel userSearchModel) throws Exception {
		Map<String, Object> resultMap = new HashMap<String, Object>();
		resultMap.put("list", userMapper.selectUserList(userSearchModel));
		resultMap.put("totalCnt", userMapper.selectUserCnt(userSearchModel));
		return resultMap;
	}
	
	@Transactional
	public Map<String, Object> saveUserProc(UserSaveModel userSaveModel) throws Exception {
		Map<String, Object> resultMap = new HashMap<String, Object>();
		resultMap.put("result", userMapper.insertUser(userSaveModel) > 0 ? "success" : "fail");
		return resultMap;
	}
	
	@Transactional
	public Map<String, Object> modifyUserProc(UserSaveModel userSaveModel) throws Exception {
		Map<String, Object> resultMap = new HashMap<String, Object>();
		resultMap.put("result", userMapper.updateUser(userSaveModel) > 0 ? "success" : "fail");
		return resultMap;
		
	}
	
	@Transactional
	public Map<String, Object> deleteUserProc(UserSaveModel userSaveModel) throws Exception {
		Map<String, Object> resultMap = new HashMap<String, Object>();
		resultMap.put("result", userMapper.deleteUser(userSaveModel) > 0 ? "success" : "fail");
		return resultMap;
		
	}
	
	public Map<String, Object> getPersonList(PersonSearchModel personSearchModel) throws Exception {
		Map<String, Object> resultMap = new HashMap<String, Object>();
		resultMap.put("list", userMapper.selectPersonInfoList(personSearchModel));
		resultMap.put("totalCnt", userMapper.selectPersonInfoCnt(personSearchModel));
		return resultMap;
	}
	
	public List<AdRoleModel> selectAdRoleList() throws Exception {
		return userMapper.selectAdRoleList();
	}
}
