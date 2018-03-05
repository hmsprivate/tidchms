(function() {
	var hostname =  location.hostname;
	if (hostname == "localhost") {
		return;
	}
	
	try {
		window.console.log = function () {
			return false;
		}
		window.console.info = function () {
			return false;
		}
		window.console.debug = function () {
			return false;
		}
		window.console.warning = function () {
			return false;
		}
	    window.console.error = function () {
	        return true;
	     }
	} catch (e) {
	}
})();