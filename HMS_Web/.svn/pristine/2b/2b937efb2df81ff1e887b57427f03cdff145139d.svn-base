package com.mobigen.framework.security;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.stereotype.Component;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
public class SessionManager {
	@Autowired
	CustomAuthenticationProvider customAuthenticationProvider;

	@Autowired
	private SecurityContextRepository repository;

	/**
	 * 사용자 인증을 진행. 사용자 인증이 성공하면 Spring-Security에 정보를 생성 함
	 * 
	 * @param request
	 * @param response
	 * @param userDetail
	 * @param userDao
	 * @return
	 * @throws Exception
	 */
	public IUserModel auth(HttpServletRequest request, HttpServletResponse response, IUserModel userModel, IUserDao userDao) throws Exception {
		IUserModel user = null;
		
		// 사용자 인증 시작
		user = userDao.getUser(userModel);
		if (user == null) {
			throw new Exception("User Auth Fail");
		}
		
		// 사용자 인증이 성공 하면 Spring-Security에 현재 session-id를 등록
		String sessionKey = request.getSession().getId();
		
		// 사용자 Token 생성
		UsernamePasswordAuthenticationToken token = new UsernamePasswordAuthenticationToken(user.getUsername(), sessionKey);
		customAuthenticationProvider.setUser(user);
		customAuthenticationProvider.setUserRole(user.getUserRole());
		
		Authentication auth = customAuthenticationProvider.authenticate(token);
		if (auth == null) {
			throw new Exception("Make Authentication Fail");
		}
		
		SecurityContextHolder.getContext().setAuthentication(auth);
		repository.saveContext(SecurityContextHolder.getContext(), request, response);


		return user;
	}
	
	/**
	 * 테스트 코드를 위한 인증 함수
	 * @param request
	 * @param response
	 * @param userModel
	 * @param userDao
	 * @return
	 */
	public IUserModel testAuth(HttpServletRequest request, HttpServletResponse response, IUserModel userModel, IUserDao userDao) {
	    IUserModel user = userModel;
	    
	    try {
	        String sessionKey = request.getSession().getId();
	        
	        // 사용자 Token 생성
	        UsernamePasswordAuthenticationToken token = new UsernamePasswordAuthenticationToken(user.getUsername(),sessionKey);
	        customAuthenticationProvider.setUser(user);
	        customAuthenticationProvider.setUserRole(user.getUserRole());
	        
	        Authentication auth = customAuthenticationProvider.authenticate(token);
	        if (auth == null) {
	            throw new Exception("Make Authentication Fail");
	        }
	        
	        SecurityContextHolder.getContext().setAuthentication(auth);
	        repository.saveContext(SecurityContextHolder.getContext(), request, response);	        
        } catch (Exception e) {
            log.error("Error: userAuthProcess", e);
            user = null;
        }

        return user;
	}

	/**
	 * 현재 세션에 대한 사용자 계정을 반환
	 * 
	 * @return
	 */
	public String getUsername() {
		String name = "";

		try {
			UserDetails user = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getDetails();
			name = user.getUsername();
		} catch (Exception e) {
			log.error("Error: GetCustomerName", e);
		}

		return name;
	}

	/**
	 * 현재 세션에 대한 사용자 세부 정보를 반환
	 * 
	 * @return
	 */
	public IUserModel getUser() {
		IUserModel user = null;

		try {
			user = (IUserModel)SecurityContextHolder.getContext().getAuthentication().getDetails();
		} catch (Exception e) {
			log.error("Error: GetCustomer", e);
		}

		return user;
	}
}
