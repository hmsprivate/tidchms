package com.mobigen.framework.validator;

import java.util.regex.Pattern;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

public class UserAccountValidator implements ConstraintValidator<UserAccount, String> {

	public void initialize(UserAccount constraintAnnotation) {
		// TODO Auto-generated method stub
	}

	public boolean isValid(String value, ConstraintValidatorContext context) {
		if(value == null || value.length() > 20)
			return false;
		
		if(value.length() == 0)
			return true;
		
		String regExp = "^[0-9a-zA-Z]*$";
		if (!Pattern.matches(regExp, value))
			return false;
        
		return true;
	}

}
