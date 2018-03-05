define([], function() {
	'use strict';

	var model = (function() {
		// property
		this.hardwareCommonId = (new Date()).getTime()  + (Math.floor(Math.random() * 10000) + 1) + (Math.floor(Math.random() * 10000) + 1) + (Math.floor(Math.random() * 10000) + 1);
		this.hwType = ""; // blade-server, bm-server, switch, storage, etc
		this.holeNo = -1;
		this.rackId = "";
		this.hwName = "";
		this.set = function(data) {
			for ( var key in data) {
				if (this.hasOwnProperty(key)) {
					this[key] = data[key];
				}
			}
		}

		// method
		return this;
	});

	return model;
});