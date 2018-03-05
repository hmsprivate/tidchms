define([], function() {
    'use strict';
    
    var model = (function() {
        var pageIndex = 1;
        var pageCount = 20;
        
        var order = '';
        var exp = '';
        
        var agreementSeq = '';
        var hostName = '';
        var ip = '';
        var status = '';
        var firstLastUpTime = '';
        var endLastUpTime = '';
        
        return {
	    	pageIndex: pageIndex,
	    	pageCount: pageCount,
	    	
	    	order: order,
	    	exp: exp,
	    	
	    	agreementSeq: agreementSeq,
	    	hostName: hostName,
	    	ip: ip,
	    	status: status,
	    	firstLastUpTime: firstLastUpTime,
	    	endLastUpTime: endLastUpTime
	    }
    });

    return model;
});