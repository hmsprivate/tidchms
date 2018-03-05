define([], function() {
    'use strict';
    
    var model = (function() {
    	var agreementSeq = '';
        var agreementName = '';
        var insertTime = '';
        var hostName = '';
        var ip = '';
        
        var status = '';
        var lastUpTime = '';
       
        return {
        	agreementSeq : agreementSeq,
        	agreementName : agreementName,
        	insertTime : insertTime,
        	hostName : hostName,
        	ip : ip,
        	
        	status : status,
        	lastUpTime : lastUpTime
	    }
    });

    return model;
});