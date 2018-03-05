define([], function() {
	return function(ConfigManager) {
    'use strict';
    
    	// property
		var _worker = null;
	
    	// method
		this.conenct = function(url) {
			worker.postMessage({
	            operation: "connect",
	            url:url
	        });			
		}
		
    	this.send = function(data) {
    		_worker.postMessage({
    			operation: "send",
    			data:data
    		});
    	}
    	
    	this.close = function() {
    		_worker.postMessage({
    			operation: "close"
    		});   		
    	}
	
    	// event-listener

    	// function
    	function initialize() {
    		_worker = new Worker("");
        	_worker.onmessage = function(e) {
        		var data = e.data;
        	}
    	}
    	
    	initialize();
	}
});