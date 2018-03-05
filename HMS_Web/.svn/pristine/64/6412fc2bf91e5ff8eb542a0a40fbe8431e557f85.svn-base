define([], function() {
	'use strict';

	var model = (function() {
		// property
		this.hardwareCommonId = (new Date()).getTime()  + (Math.floor(Math.random() * 10000) + 1) + (Math.floor(Math.random() * 10000) + 1) + (Math.floor(Math.random() * 10000) + 1);
		this.rackColumnName = "node"; // node, etc, disable, reserved
		this.hwType = ""; // blade-enclosure, blade-server, bm-server, switch, storage, etc 
		this.horizontal = 1; // 0.5, 1 ~ 
		this.vertical = 1; // 0.5, 1 ~
		this.align = ""; //left, right
		this.width = 1;
		this.unitSize = 1; // 1 ~ 42
		this.holeNo = -1; // 1 ~ 42
		this.hwName = "";
		this.rackId = ""; // rack-cabinet
		this.children = null; // blade-enclosure 일때만 사용
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