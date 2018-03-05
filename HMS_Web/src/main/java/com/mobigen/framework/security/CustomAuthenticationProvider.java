package com.mobigen.framework.security;

import java.util.ArrayList;
import java.util.List;

import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
public class CustomAuthenticationProvider implements AuthenticationProvider {
	private UserDetails user;

	public void setUser(UserDetails user) {
		this.user = user;
	}

	private String userRole = "Administrator";

	public void setUserRole(String role) {
		if (role != null || !"".equals(role))
			this.userRole = role;
	}

	public Authentication authenticate(Authentication authentication) throws AuthenticationException {
		String principal = authentication.getPrincipal().toString();
		String credential = authentication.getCredentials().toString();

		try {
			if (user != null) {

				List<GrantedAuthority> grantedAuths = new ArrayList<GrantedAuthority>();
				grantedAuths.add(new SimpleGrantedAuthority(userRole));

				UsernamePasswordAuthenticationToken result = new UsernamePasswordAuthenticationToken(user, credential,
						grantedAuths);
				result.setDetails(user);

				log.info("Login: [" + principal + "]");
				return result;
			}

		} catch (Exception e) {
			log.error("Error: User Auth", e);
		}

		return null;
	}

	public boolean supports(Class<?> authentication) {
		return authentication.equals(UsernamePasswordAuthenticationToken.class);
	}
}
