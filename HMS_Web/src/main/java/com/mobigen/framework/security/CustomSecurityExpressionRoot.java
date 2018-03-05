package com.mobigen.framework.security;

import java.util.Collection;
import java.util.HashSet;
import java.util.Set;

import org.springframework.security.access.expression.SecurityExpressionRoot;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.AuthorityUtils;

public class CustomSecurityExpressionRoot extends SecurityExpressionRoot { 
    private Set<String> userRoles;

    public CustomSecurityExpressionRoot(Authentication authentication) {
        super(authentication);
    }
    
    public boolean hasRegExpRole(String regex) {
        boolean found = false;

        Set<String> authorities = getCustomAuthoritySet();
        for (String authority : authorities) {
            if (authority.matches(regex)) {
                found = true;
                break;
            }
        }
        return found;
    }

    private Set<String> getCustomAuthoritySet() {
        if (userRoles == null) {
            userRoles = new HashSet<String>();
            Collection<? extends GrantedAuthority> userAuthorities = authentication.getAuthorities();
            userRoles = AuthorityUtils.authorityListToSet(userAuthorities);
        }

        return userRoles;
    }
}
