define([], function() {
    'use strict';
    
    var model = (function() {
        var pageIndex = 1;
        var pageCount = 20;
        
        //plugin order
        var plugOrder = '';
        var plugExp = '';
        
        //task order
        var taskOrder = '';
        var taskExp = '';
        
        //node order
        var order = '';
        var exp = '';
        
        var groupId = '';
        
        //plugin search
        var pluginType = [];
        
        //node search
        var hostName = '';
        var serialNumber = '';
        var nodeType = '';
        var ip = '';
        var osName = '';
        var manufacture = '';
        var isDefault = '';
        var status = '';
        
        return {
	    	pageIndex: pageIndex,
	    	pageCount: pageCount,
	    	
	    	plugOrder: plugOrder,
	    	plugExp: plugExp,
	    	
	    	taskOrder: taskOrder,
	    	taskExp: taskExp,
	    	
	    	order: order,
	    	exp: exp,
	    	
	    	groupId: groupId,
	    	
	    	pluginType: pluginType,
	    	
	    	hostName: hostName,
	    	serialNumber: serialNumber,
	    	nodeType: nodeType,
	    	ip: ip,
	    	osName: osName,
	    	manufacture: manufacture,
	    	isDefault : isDefault,
	    	status : status
	    }
    });

    return model;
});