package com.skt.hms.user;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.mobigen.framework.result.JsonResult;
import com.skt.hms.user.model.UserModel;

@Controller
@RequestMapping(value = "/")
public class AuthController {

    @Autowired
    private AuthService userService;

    @RequestMapping(value = "login", method = RequestMethod.POST)
    @ResponseBody
    public JsonResult login(@RequestBody @Valid UserModel model, HttpServletRequest request,
            HttpServletResponse response) throws Exception {

        JsonResult js = new JsonResult();
        js.setResult(userService.login(model, request, response));
        return js;
    }
    
    @RequestMapping(value = "session-info", method = RequestMethod.GET)
    @ResponseBody
    public JsonResult getUser(HttpServletRequest request, HttpServletResponse response) throws Exception {
    	JsonResult js = new JsonResult();
    	js.setData(userService.getUser());
    	return js;
    }
}
