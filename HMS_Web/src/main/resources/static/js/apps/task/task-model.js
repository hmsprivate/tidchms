define([], function() {
    'use strict';
    
    var model = (function() {
    	var agreementSeq = '';
        var agreementName = '';
        
        //task
        var taskFileName = '';
        var taskFileContents = '';
        var lastUpTime = '';
        
        return {
        	agreementSeq : agreementSeq,
        	agreementName : agreementName,
        	
            //task
        	taskFileName : taskFileName,
        	taskFileContents : taskFileContents,
        	lastUpTime : lastUpTime
	    }
    });

    return model;
});