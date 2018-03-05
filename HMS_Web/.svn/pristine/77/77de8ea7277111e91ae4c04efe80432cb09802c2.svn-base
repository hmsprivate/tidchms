define([], function() {
	'use strict';

	var model = (function() {
		// property
		var resourceSeq = "";
		var resourceName = "";
		var horizonSize = 10;
		var verticalSize = 10;
		var isStringType = false;

		// method
		return {
			resourceSeq: resourceSeq,
			resourceName: resourceName,
			horizonSize: horizonSize,
			verticalSize: verticalSize,
			isStringType: isStringType,
			set : function(data) {
				for ( var key in data) {
					if (this.hasOwnProperty(key)) {
						this[key] = data[key];
					}
				}
			}
		}
	});

	return model;
});