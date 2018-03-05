define([], function() {
    'use strict';
    
    var model = (function() {
    	var agreementSeq = '';
        var agreementName = '';
        
        //plugin
        var pluginSeq = '';
        var pluginName = '';
        var pluginVersion = '';
        var pluginType = '';
        var pluginSigned = '';
        var pluginStatus = '';
        var pluginLoadedTimestamp = '';
        var pluginHref = '';
        
        //task
        var taskId = '';
        var taskName = '';
        var taskDeadline = '';
        var taskCreationTimestamp = '';
        var taskLastRunTimestamp = '';
        var taskHitCount = '';
        var taskState = '';
        var taskHref = '';
        var missCount = '';
        var scheduleType = '';
        var scheduleInterval = '';
        
        
        //node
        var nodeSeq = '';
        var hostName = '';
        var serialNumber = '';
        var ip = '';
        var restApiPort = '';
        var cpuCnt = '';
        var cpuType = '';
        var memory = '';
        var disk = '';
        var nodeType = '';
        var osName = '';
        var osVersion = '';
        var osArchitecture = '';
        var manufacture = '';
        
        return {
        	agreementSeq : agreementSeq,
        	agreementName : agreementName,
        	
        	//plugin
            pluginSeq : pluginSeq,
            pluginName : pluginName,
            pluginVersion : pluginVersion,
            pluginType : pluginType,
            pluginSigned : pluginSigned,
            pluginStatus : pluginStatus,
            pluginLoadedTimestamp : pluginLoadedTimestamp,
            pluginHref : pluginHref,
            
            //task
            taskId : taskId,
            taskName : taskName,
            taskDeadline : taskDeadline,
            taskCreationTimestamp : taskCreationTimestamp,
            taskLastRunTimestamp : taskLastRunTimestamp,
            taskHitCount : taskHitCount,
            taskState : taskState,
            taskHref : taskHref,
            missCount : missCount,
            scheduleType : scheduleType,
            scheduleInterval : scheduleInterval,
        	
        	//node
        	nodeSeq : nodeSeq,
            hostName : hostName,
            serialNumber : serialNumber,
            ip : ip,
            restApiPort : restApiPort,
            cpuCnt : cpuCnt,
            cpuType : cpuType,
            memory : memory,
            disk : disk,
            nodeType : nodeType,
            osName : osName,
            osVersion : osVersion,
            osArchitecture : osArchitecture,
            manufacture : manufacture
	    }
    });

    return model;
});