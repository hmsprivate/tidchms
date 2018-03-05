package com.skt.hms.user;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.mobigen.framework.security.IUserModel;
import com.mobigen.framework.security.SessionManager;
import com.skt.hms.user.model.UserModel;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class AuthService {

    @Autowired
    private AuthMapper userMapper;
    
    @Autowired
    private SessionManager sessionManager;
    
    public int login(UserModel userModel, HttpServletRequest request, HttpServletResponse response) throws Exception {
    	//userModel.setPassword(CryptUtil. userModel.getPassword());
        IUserModel user = sessionManager.auth(request, response, userModel, userMapper);
        if (user == null) {
            log.error("Login Fail", userModel);
            return 0;
        }
        
        return 1;
    }

	public IUserModel getUser() {
		return sessionManager.getUser();
	}
}
