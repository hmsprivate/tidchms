package com.mobigen.framework.exception;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Component;
import org.springframework.validation.BindException;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;

import com.mobigen.framework.component.Messages;
import com.mobigen.framework.result.JsonResult;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
@ControllerAdvice
public class GlobalExceptionHandler {
    @Autowired
    private Messages message;

    
    // Model Validation
    @ExceptionHandler(BindException.class)
    @ResponseBody
    public JsonResult bindExceptionHandler(BindException e) {
        log.error("Model Validation Exception", e);
        return getExceptionJsonResult(e.getFieldError());
    }

    // JSON Validation
    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseBody
    public JsonResult methodArgumentNotValidExceptionHandler(MethodArgumentNotValidException e) {
        log.error("JSON Validation Exception", e);

        BindingResult bindingResult = e.getBindingResult();
        return getExceptionJsonResult(bindingResult.getFieldError());
    }

    // Controller
    @ExceptionHandler(JsonResultException.class)
    @ResponseBody
    public JsonResult jsonResultExceptionHandler(JsonResultException e) {
        log.error("Controller Exception", e);
        return getExceptionJsonResult(e);
    }

    // Authentication
    @ExceptionHandler(AccessDeniedException.class)
    @ResponseBody
    public JsonResult accessDeniedExceptionHandler(AccessDeniedException e) {
        log.error("Authentication Exception", e);
        return getExceptionJsonResult(e);
    }

    // Unknown
    @ExceptionHandler(Exception.class)
    @ResponseBody
    public JsonResult unknownExceptionHandler(Exception e) {
        log.error("Unknown Exception", e);
        return getExceptionJsonResult(e);
    }

    private String getMessageKey(FieldError e) {
        String errorCode = e.getCodes()[0];
        return errorCode;
    }

    private String getDefaultMessage(Object e) {
        String msg = "";
        if (e instanceof FieldError) {
        	msg = ((FieldError) e).getDefaultMessage();
        } else if (e instanceof JsonResultException) {
        	msg = ((JsonResultException) e).getExceptionMessage();
        } else if (e instanceof AccessDeniedException) {
        	msg = ((AccessDeniedException) e).getLocalizedMessage();
        } else if (e instanceof Exception) {
        	msg = ((Exception) e).getMessage();
        }

        if (msg == null || "".equals("")) {
        	msg = message.get("com.mobigen.framework.exception.GlobalExceptionHandler");
        }
        
        return msg;
    }

    private String getMessage(Object e) throws Exception {
        String msg = "";
        if (e instanceof FieldError) {
            msg = message.get(getMessageKey((FieldError) e), ((FieldError) e).getArguments());
        } else if (e instanceof JsonResultException) {
            msg = message.get(((JsonResultException) e).getMessageKey(), ((JsonResultException) e).getArgs());
        } else if (e instanceof AccessDeniedException) {
            msg = message.get(((AccessDeniedException) e).getClass().getName());
        }

        return msg;
    }

    private JsonResult getExceptionJsonResult(Object error) {
        String msg = "";
        try {
        	msg = getMessage(error);
            if (msg == null || "".equals(msg)) {
            	msg = getDefaultMessage(error);
            }
        } catch (Exception e) {
        	msg = message.get("com.mobigen.framework.exception.GlobalExceptionHandler");
        }

        JsonResult js = new JsonResult();
        js.setErrorMessage(msg);

        return js;
    }

}
