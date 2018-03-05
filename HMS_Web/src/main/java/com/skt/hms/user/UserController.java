package com.skt.hms.user;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.mobigen.framework.result.JsonResult;
import com.skt.hms.common.CommonService;
import com.skt.hms.common.model.DatacenterModel;
import com.skt.hms.user.model.PersonSearchModel;
import com.skt.hms.user.model.UserSaveModel;
import com.skt.hms.user.model.UserSearchModel;

@Controller
@RequestMapping(value={"/user"})
public class UserController {

	@Autowired
	private UserService userService;
	
	@RequestMapping(value="/getUserList.json")
	@ResponseBody
	public JsonResult getUserList(@RequestBody UserSearchModel userSearchModel) throws Exception {
		
		JsonResult js = new JsonResult();
		js.setData(userService.getUserList(userSearchModel));
		return js;
	}

	@RequestMapping(value="/saveUser.json")
	@ResponseBody
	public JsonResult saveUser(@RequestBody UserSaveModel userSaveModel)  throws Exception {
		
		JsonResult js = new JsonResult();
		js.setData(userService.saveUserProc(userSaveModel));
		return js;
	}
	
	@RequestMapping(value="/modifyUser.json")
	@ResponseBody
	public JsonResult modifyUser(@RequestBody UserSaveModel userSaveModel) throws Exception {
		
		JsonResult js = new JsonResult();
		js.setData(userService.modifyUserProc(userSaveModel));
		return js;
	}
	
	@RequestMapping(value="/deleteUser.json")
	@ResponseBody
	public JsonResult deleteUser(@RequestBody UserSaveModel userSaveModel) throws Exception {
		
		JsonResult js = new JsonResult();
		js.setData(userService.deleteUserProc(userSaveModel));
		return js;
	}
	
	@RequestMapping(value="/getPersonList.json")
	@ResponseBody
	public JsonResult getPersonList(@RequestBody PersonSearchModel personSearchModel) throws Exception {
		
		JsonResult js = new JsonResult();
		js.setData(userService.getPersonList(personSearchModel));
		return js;
	}
	
	
	@RequestMapping(value="/searchUser")
    public String getTemplateReviewHistory() throws Exception {
    	return "/apps/user/template/search-user";
    }
	
	@RequestMapping(value="/getAdRoleList.json")
	@ResponseBody
	public JsonResult getAdRoleList() throws Exception {
		
		JsonResult js = new JsonResult();
		js.setData(userService.selectAdRoleList());
		return js;
	}
	
}
