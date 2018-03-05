define([], function() {
	return function() {
		"use strict";

		// property
		var constants = {};
		var selectedTreeData = {};
		var user = null;

		const TYPE_TILE = 'TILE';
		const TYPE_RACK = 'RACK';
		const TYPE_FACILITY = 'FACILITY';

		const SUBTYPE_RACK_11 = '11';
		const SUBTYPE_RACK_12 = '12';
		const SUBTYPE_RACK_21 = '21';


		const SUBTYPE_FACILITY_CE = 'CONDITIONING_EQUIPMENT';      // 공조기
		const SUBTYPE_FACILITY_TH = 'THERMO_HYGROSTAT';           //
		const SUBTYPE_FACILITY_UP = 'UPS';           //

		const SUBTYPE_TILE_A = 'ABLE';      // 가용
		const SUBTYPE_TILE_D = 'DISABLE';   // 사용불가
		const SUBTYPE_TILE_R = 'RACK';      // 사용중중 랙
		const SUBTYPE_TILE_C = 'AIR';        // 공조기
		const SUBTYPE_TILE_G = 'DOOR';      // 출입구

		// method		
		this.initialize = function(c, u) {
			constants = c;
			user = u;
		}

        this.get = function(key) {
	       var keys = key.split(".");
	       var value = null;
	       for (var i=0, l=keys.length; i < l; i++) {
	    	   if (!value) {
	    		   value = constants[keys[i]];
	    	   } else {
	    		   value = value[keys[i]];
	    	   }
	    	   
	       }
	       
           return value;
        }

        this.setSelectedTreeData = function(data){
			this.selectedTreeData = data;
		};

		this.getSelectedTreeData = function(){
			return angular.copy(this.selectedTreeData);
		};
		
		this.getUser = function() {
			return user;
		}
		
		this.setResourceSearchParam = function(data){
			this.resourceSearchParam = data;
		};

		this.getResourceSearchParam = function(){
			return angular.copy(this.resourceSearchParam);
		};

		// TB_DC_ROOM_SECTION_INFO 기준
		this.getRackBDType = function(_type){
			let _data = {};
			if(_type == 'A') {           // 가용
				_data.type = TYPE_TILE;
				_data.subtype = SUBTYPE_TILE_A;
			}
			else if(_type == 'R') {      // 사용중랙
				_data.type = TYPE_RACK;
				// _data.subtype = SUBTYPE_TILE_R;
				_data.subtype = SUBTYPE_RACK_11;
			}
			else if(_type == 'D') {      // 사용불가
				_data.type = TYPE_TILE;
				_data.subtype = SUBTYPE_TILE_D;
			}
			else if(_type == 'C') {      // 공조기
				_data.type = TYPE_FACILITY;
				_data.subtype = SUBTYPE_FACILITY_CE;
			}
			else if(_type == 'G') {      // 출입구
				_data.type = TYPE_TILE;
				_data.subtype = SUBTYPE_TILE_G;
			}
			return _data;
		};

		this.getRackDiagramType = function(_type, _subtype){
			if(_type == TYPE_TILE) {
				if(_subtype == SUBTYPE_TILE_A)
					return "A";
				else if(_subtype == SUBTYPE_TILE_D)
					return "D";
				else if(_subtype == SUBTYPE_TILE_G)
					return "G";
			} else if(_type == TYPE_RACK) {
				return "R";
			} else if(_type == TYPE_FACILITY) {
				if(_subtype == SUBTYPE_FACILITY_CE)
					return "C";
			}
		};
        
		this.$get = function() {
			return {
				get:this.get,
				getSelectedTreeData : this.getSelectedTreeData,
				setSelectedTreeData : this.setSelectedTreeData,
				getUser:this.getUser,
				getRackBDType:this.getRackBDType,
				getRackDiagramType:this.getRackDiagramType,
				setResourceSearchParam : this.setResourceSearchParam,
				getResourceSearchParam : this.getResourceSearchParam
			}
		}
	}
});