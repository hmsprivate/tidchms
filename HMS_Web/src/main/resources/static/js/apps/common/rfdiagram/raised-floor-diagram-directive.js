define(["app", "apps/common/rfdiagram/raised-floor-model"], function(app, RfModel) {
    app.directive("raisedFloorDiagramDirective", ['$document', function($document) {
        'use strict';
        
        return {
            restrict: "E",
            transclude: true,
            // template:'<div id="canvas" style="width: 800px; height: 800px; margin: auto; border: solid 1px #2898E0;"></div><div id="overview" style="width: 150px;height: 120px;box-shadow: 0px 0px 15px 0px rgba(0, 0, 0, 0.2);position: absolute;right: 5px;top: 5px;background-color: #FFF;"></div>',
			template: '',
            scope: {
				data: "=",
				editable: "=",
				unspecifiedListArea: "=",
				mode: "=",
				addComplete: "&",
				moveComplete: "&",
				clickNode: "&",
				dblclickNode: "&",
				saveDataFn: "&",
				getSaveData: "&",
				changeTileDataFn: "&",
				dropFromDiagram: "&",
				refreshFn: "&"
            },
            link: function postLink($scope, element, attrs, controller) {
                // property
            	var target = angular.element(element);

				// method
				$scope.$watch("unspecifiedListArea", function(value, oldValue) {
					if (!value || value === oldValue)
						return;

					if(oldValue)
						removeDragEvent(oldValue);

					addDragEvent(value);
					addDropEvent('canvas');
				});

				$scope.$watch("data", function(value, oldValue) {
					if(!value || value === oldValue)
						return;

					clearGraph();
					loadData(value);
				}, true);

				$scope.$watch("editable", function (value, oldValue) {
					if(!value || value === oldValue)
						return;

					// setEditable();

					clearGraph();
					createGraph(getGraphWidth(), getGraphHeight());
					addDiagramData($scope.data.diagramData);
				});

				$scope.$watch("mode", function (value, oldValue) {
					if (!value || value === oldValue)
						return;


				});

				// save
				$scope.saveData = function() {
					var data = saveData();
					if($scope.getSaveData)
						$scope.getSaveData({data: data});
				};
				$scope.saveDataFn({saveDataFn: $scope.saveData});

				// change tile size
				$scope.changeTileData = function (direction, count) {
					var result = changeTileData(direction, count);
					if(result != true) {
						// TODO. tile size change fail
						console.log("tile size change fail")
					}
				};
				$scope.changeTileDataFn({changeTileDataFn: $scope.changeTileData});

				// refresh
				$scope.refresh = function () {
					clearGraph();
					createGraph(getGraphWidth(), getGraphHeight());
					addDiagramData($scope.data.diagramData);
				};
				$scope.refreshFn({refreshFn: $scope.refresh});


				// prototype
				function Matrix2D(m) {
					this.m = m || [1, 0, 0, 1, 0, 0];
				}

				Matrix2D.multiply = function (out, a, b) {
					var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3];
					var b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3];
					out[0] = a0 * b0 + a2 * b1;
					out[1] = a1 * b0 + a3 * b1;
					out[2] = a0 * b2 + a2 * b3;
					out[3] = a1 * b2 + a3 * b3;
					return out;
				};
				Matrix2D.prototype = {
					m: null,
					rotate: function (rad, out) {
						var s = Math.sin(rad),
							c = Math.cos(rad);
						var rotateM = [c, s, -s, c];
						return Matrix2D.multiply(out || this.m, rotateM, this.m);
					},
					scale: function (sx, sy, out) {
						var scaleM = [sx, 0, 0, sy];
						return Matrix2D.multiply(out || this.m, scaleM, this.m);
					},
					translate: function (tx, ty, out) {
						out = out || this.m;
						out[4] += tx;
						out[5] += ty;
						return out;
					},
					translatePoint: function (x, y) {
						var a = this.m;
						var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3];
						return {x: a0 * x + a2 * y + a[4], y: a1 * x + a3 * y + a[5]};
					}
				};

				function HeatMap(canvas, points) {
					this.points = points || [];
					this.cache = {};
					this.canvas = canvas || document.createElement('canvas');
					this.defaultRadius = 80;
					this.defaultIntensity = 0.2;
					this.setGradientStops({
						0.00: 0xffffff00,
						0.10: 0x99e9fdff,
						0.20: 0x00c9fcff,
						// 0.30: 0x00e9fdff,
						0.30: 0x00a5fcff,
						0.40: 0x0078f2ff,
						0.50: 0x0e53e9ff,
						0.60: 0x4a2cd9ff,
						0.70: 0x890bbfff,
						0.80: 0x99019aff,
						0.90: 0x990664ff,
						0.99: 0x660000ff,
						1.00: 0x000000ff
					});
				}

				HeatMap.prototype = {
					setGradientStops: function (stops) {
						var ctx = document.createElement('canvas').getContext('2d');
						var grd = ctx.createLinearGradient(0, 0, 256, 0);

						for (let i in stops) {
							grd.addColorStop(i, 'rgba(' +
								((stops[i] >> 24) & 0xFF) + ',' +
								((stops[i] >> 16) & 0xFF) + ',' +
								((stops[i] >> 8) & 0xFF) + ',' +
								((stops[i] >> 0) & 0xFF) + ')');
						}

						ctx.fillStyle = grd;
						ctx.fillRect(0, 0, 256, 1);
						this.gradient = ctx.getImageData(0, 0, 256, 1).data;
					},
					drawHeatPoints: function (alpha, ctx) {
						var offsetX = 0, offsetY = 0;
						this.cache = {};

						ctx = ctx || this.canvas.getContext('2d');
						ctx.strokeStyle = "#888";
						ctx.lineWidth = 4;
						ctx.strokeRect(0, 0, this.canvas.width, this.canvas.height);

						ctx.save(); // Workaround for a bug in Google Chrome
						ctx.fillStyle = 'transparent';
						ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
						ctx.restore();

						/*for (let i in this.points) {

							 var src = this.points[i];
							 var rad = src.radius || this.defaultRadius;
							 var int = src.intensity || this.defaultIntensity;
							 var pos = src;
							 var x = pos.x - rad + offsetX;
							 var y = pos.y - rad + offsetY;

							 if (!this.cache[int]) {
							 	this.cache[int] = {};
							 }

							 if (!this.cache[int][rad]) {
								 var grd = ctx.createRadialGradient(rad, rad, 0, rad, rad, rad);
								 grd.addColorStop(0.0, 'rgba(0, 0, 0, ' + int + ')');
								 grd.addColorStop(1.0, 'transparent');
								 this.cache[int][rad] = grd;
							 }

							 ctx.fillStyle = this.cache[int][rad];
							 ctx.translate(x, y);
							 ctx.fillRect(0, 0, 2 * rad, 2 * rad);
							 ctx.translate(-x, -y);
						 }*/

						/*var dat = ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
						 var dim = this.canvas.width * this.canvas.height * 4;
						 var pix = dat.data;

						 for (var p = 0; p < dim; /!* *!/) {
							 var a = pix[ p + 3 ] * 4;
							 pix[ p++ ] = this.gradient[ a++ ];
							 pix[ p++ ] = this.gradient[ a++ ];
							 pix[ p++ ] = this.gradient[ a++ ];
							 pix[ p++ ] = parseInt(this.gradient[ a++ ] * (alpha || 1));
						 }

						 ctx.putImageData(dat, 0, 0);
						 */
					}
				};


				// property
				var graph = null;
				var overview = null;
				var nodes = [];
				// var tiles = [];

				const GAP = 30;
				const SNAP = 2;

				const OFFSET_SCALE = 15;
				const OFFSET_X_RACK_1 = OFFSET_SCALE, 			OFFSET_Y_RACK_1 = 0;
				const OFFSET_X_RACK_2 = OFFSET_SCALE*2,			OFFSET_Y_RACK_2 = -OFFSET_SCALE;
				const OFFSET_X_RACK_3 = OFFSET_SCALE, 			OFFSET_Y_RACK_3 = 0;
				const OFFSET_X_RACK_4 = OFFSET_SCALE*2, 		OFFSET_Y_RACK_4 = 3;
				const OFFSET_X_FACILITY_CE = OFFSET_SCALE, 		OFFSET_Y_FACILITY_CE = -3;
				const OFFSET_X_FACILITY_TH = OFFSET_SCALE,		OFFSET_Y_FACILITY_TH = 0;
				const OFFSET_X_FACILITY_UPS = OFFSET_SCALE, 	OFFSET_Y_FACILITY_UPS = -4;

				const SIZE_SCALE = 0.5;
				const WIDTH_RACK_1 = 45*SIZE_SCALE,			HEIGHT_RACK_1 = 85*SIZE_SCALE;
				const WIDTH_RACK_2 = 105*SIZE_SCALE, 		HEIGHT_RACK_2 = 120*SIZE_SCALE;
				const WIDTH_RACK_3 = 105*SIZE_SCALE, 		HEIGHT_RACK_3 = 120*SIZE_SCALE;
				const WIDTH_FACILITY_CE = 63*SIZE_SCALE,	HEIGHT_FACILITY_CE = 76*SIZE_SCALE;
				const WIDTH_FACILITY_TH = 53*SIZE_SCALE, 	HEIGHT_FACILITY_TH = 95*SIZE_SCALE;
				const WIDTH_FACILITY_UPS = 64*SIZE_SCALE, 	HEIGHT_FACILITY_UPS = 91*SIZE_SCALE;

				const INDEX_LIST = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];

				var horizonSize = 10;
				var verticalSize = 10;
				var graphWidth = horizonSize * GAP;
				var graphHeight = verticalSize * GAP;

				var rfModel = new RfModel();

				var nodeMoveStart;

				// 장비 type
				const TYPE_ADD_RACK = "RACK";
				const TYPE_ADD_FACILITY = "FACILITY";
				const TYPE_ADD_TILE = "TILE";
				const TYPE_FACILITY_CE = "CONDITIONING_EQUIPMENT";
				const TYPE_FACILITY_TH = "THERMO_HYGROSTAT";
				const TYPE_FACILITY_UPS = "UPS";
				const TYPE_TILE_ABLE = "ABLE";
				const TYPE_TILE_DISABLE = "DISABLE";
				const TYPE_TILE_DOOR = "DOOR";

				// group type
				const TYPE_GORUP_LABEL = "Labels";
				const TYPE_GORUP_TILE = "Tiles";


				// function
				function getGraphWidth() {
					return graphWidth = horizonSize * GAP
				}

				function getGraphHeight() {
					return graphHeight = verticalSize * GAP
				}

				function to2_5D(x, y) {
					var sin = Math.sin(Math.PI / 6);
					var cos = Math.cos(Math.PI / 6);
					var x2 = x * cos + y * cos;
					var y2 = x * sin - y * sin;
					return {x: x2, y: y2};
				}

				function from2_5D(x, y) {
					var sin = Math.sin(Math.PI / 6);
					var cos = Math.cos(Math.PI / 6);
					var x2 = (x/cos + y/sin)/2;
					var y2 = (x/cos - y/sin)/2;
					return {x: x2, y: y2};
				}

				function toGrid(x, y) {
					var sin = Math.sin(Math.PI / 6);
					var cos = Math.cos(Math.PI / 6);

					var x2 = (x * sin + y * cos) / 2 / sin / cos;
					var y2 = (x * sin - y * cos) / 2 / sin / cos;
					return {x: x2, y: y2};
				}


				function drawHeatMap(tempG, width, height, bounds) {
					console.log("rfdd : drawHeatMap :", tempG, width, height, bounds);

					var heatCanvas = document.createElement("canvas");
					heatCanvas.width = width;
					heatCanvas.height = height;

					var alpha = 0.9;
					var points = [];
					let i = 0;
					while (i++ < 100) {
						var intensity = 0.028 + parseInt(Math.random() * 50) * 0.01;
						var radius = 70;//intensity * 200;
						points.push({
							intensity: intensity,
							radius: radius,
							x: Math.random() * width,
							y: Math.random() * height
						});
					}
					var heatMap = new HeatMap(heatCanvas, points);
					heatMap.drawHeatPoints(alpha);
					tempG.save();
					tempG.scale(1, -1);

					var matrix = new Matrix2D();
					var sin = Math.sin(Math.PI / 4);
					var cos = Math.cos(Math.PI / 4);
					var w = sin * height + cos * width;
					var scale = bounds.width / w;
					matrix.rotate(Math.PI / 4);
					matrix.scale(1 * scale, Math.tan(Math.PI / 6) * scale);
					matrix.translate(height * scale * Math.sin(Math.PI / 4), 0);
					var m = matrix.m;
					tempG.setTransform(m[0], m[1], m[2], m[3], m[4], m[5]);
					tempG.drawImage(heatCanvas, 0, 0);
					tempG.restore();
				}

				/*function createRoomTexture(width, height) {
					 console.log("rfdd : createRoomTexture :", width, height);
					 var gap = GAP;

					 var bounds = new Q.Rect();
					 bounds.addPoint(to2_5D(0, 0));
					 bounds.addPoint(to2_5D(0, height));
					 bounds.addPoint(to2_5D(width, height));
					 bounds.addPoint(to2_5D(width, 0));

					 var tempCanvas = document.createElement("canvas");
					 tempCanvas.width = bounds.width;
					 tempCanvas.height = bounds.height;
					 var tempG = tempCanvas.getContext('2d');

					 tempG.fillStyle = "#FFF";
					 tempG.fillRect(0, 0, bounds.width, bounds.height);

					 tempG.translate(-bounds.x, -bounds.y);
					 var x = 0;
					 while (x < width) {
						 var p = to2_5D(x, 0);
						 tempG.moveTo(p.x, p.y);
						 p = to2_5D(x, height);
						 tempG.lineTo(p.x, p.y);
						 x += gap;
					 }
					 var y = 0;
					 while (y < height) {
						 var p = to2_5D(0, y);
						 tempG.moveTo(p.x, p.y);
						 p = to2_5D(width, y);
						 tempG.lineTo(p.x, p.y);
						 y += gap;
					 }
					 tempG.strokeStyle = "#888";
					 tempG.lineWidth = 1;
					 tempG.stroke();

					 tempG.translate(bounds.x, bounds.y);
					 drawHeatMap(tempG, width, height, bounds);

					 return tempG.createPattern(tempCanvas, 'repeat');
				 }*/

				function createRoomTexture2(width, height) {
					console.log("rfdd : createRoomTexture2 :", width, height);
					var gap = GAP;

					var bounds = new Q.Rect();
					bounds.addPoint(to2_5D(0, 0));
					bounds.addPoint(to2_5D(0, height));
					bounds.addPoint(to2_5D(width, height));
					bounds.addPoint(to2_5D(width, 0));

					var tempCanvas = document.createElement("canvas");
					tempCanvas.width = bounds.width;
					tempCanvas.height = bounds.height;
					var tempG = tempCanvas.getContext('2d');

					tempG.fillStyle = "#FFF";
					tempG.fillRect(0, 0, bounds.width, bounds.height);

					tempG.translate(-bounds.x, -bounds.y);
					var x = 0;
					while (x < width) {
						var p = to2_5D(x, 0);
						tempG.moveTo(p.x, p.y);
						p = to2_5D(x, height);
						tempG.lineTo(p.x, p.y);
						x += gap;
					}
					var y = 0;
					while (y < height) {
						var p = to2_5D(0, y);
						tempG.moveTo(p.x, p.y);
						p = to2_5D(width, y);
						tempG.lineTo(p.x, p.y);
						y += gap;
					}
					tempG.strokeStyle = "#888";
					tempG.lineWidth = 1;
					tempG.stroke();

					tempG.translate(bounds.x, bounds.y);
					// drawHeatMap(tempG, width, height, bounds);

					return tempG.createPattern(tempCanvas, 'repeat');
				}

				/*function createRoom(width, height) {
					 console.log("rfdd : createRoom :", width, height);
					 var bounds = new Q.Rect();
					 bounds.addPoint(to2_5D(0, 0));
					 bounds.addPoint(to2_5D(0, height));
					 bounds.addPoint(to2_5D(width, height));
					 bounds.addPoint(to2_5D(width, 0));
					 var dy = -bounds.y;

					 var room = graph.createShapeNode("Room - 001", 0, -dy);

					 var p = to2_5D(0, 0);
					 room.moveTo(p.x, p.y + dy);
					 p = to2_5D(width, 0);
					 room.lineTo(p.x, p.y + dy);
					 p = to2_5D(width, height);
					 room.lineTo(p.x, p.y + dy);
					 p = to2_5D(0, height);
					 room.lineTo(p.x, p.y + dy);
					 room.closePath();

					 room.setStyle(Q.Styles.SHAPE_FILL_COLOR, createRoomTexture(width, height));
					 room.setStyle(Q.Styles.LABEL_POSITION, Q.Position.LEFT_BOTTOM);
					 room.setStyle(Q.Styles.LABEL_FONT_SIZE, 18);
					 room.setStyle(Q.Styles.SELECTION_BORDER, 5);
					 // room.setStyle(Q.Styles.LAYOUT_BY_PATH, false);
					 room.zIndex = -1;
					 room.movable = false;
					 // room.selectable = false;
					 return room;
				 }*/

				function createRoom2(width, height) {
					console.log("rfdd : createRoom2 :", width, height);
					var bounds = new Q.Rect();
					bounds.addPoint(to2_5D(0, 0));
					bounds.addPoint(to2_5D(0, height));
					bounds.addPoint(to2_5D(width, height));
					bounds.addPoint(to2_5D(width, 0));
					var dy = -bounds.y;

					var room = graph.createShapeNode("Room-"+rfModel.resourceSeq, 0, -dy);

					var p = to2_5D(0, 0);
					room.moveTo(p.x, p.y + dy);
					p = to2_5D(width, 0);
					room.lineTo(p.x, p.y + dy);
					p = to2_5D(width, height);
					room.lineTo(p.x, p.y + dy);
					p = to2_5D(0, height);
					room.lineTo(p.x, p.y + dy);
					room.closePath();

					room.setStyle(Q.Styles.SHAPE_FILL_COLOR, createRoomTexture2(width, height));
					// room.setStyle(Q.Styles.SHAPE_FILL_COLOR, null);
					room.setStyle(Q.Styles.LABEL_POSITION, Q.Position.LEFT_BOTTOM);
					room.setStyle(Q.Styles.LABEL_FONT_SIZE, 18);
					room.setStyle(Q.Styles.SELECTION_BORDER, 5);
					// room.setStyle(Q.Styles.LAYOUT_BY_PATH, false);
					room.setStyle(Q.Styles.LABEL_VISIBLE, false);
					room.zIndex = -3;
					room.movable = false;
					room.selectable = false;

					var groupL = graph.createGroup(TYPE_GORUP_LABEL);
					groupL.zIndex = -2;
					groupL.movable = false;
					groupL.setStyle(Q.Styles.GROUP_BACKGROUND_COLOR, null);
					groupL.setStyle(Q.Styles.GROUP_STROKE, 0);
					groupL.setStyle(Q.Styles.LABEL_COLOR, "rgba(0,0,0,1)");
					groupL.setStyle(Q.Styles.LABEL_VISIBLE, false);

					var groupT = graph.createGroup(TYPE_GORUP_TILE);
					groupT.zIndex = -1;
					groupT.movable = false;
					groupT.setStyle(Q.Styles.GROUP_BACKGROUND_COLOR, null);
					groupT.setStyle(Q.Styles.GROUP_STROKE, 0);
					groupT.setStyle(Q.Styles.LABEL_COLOR, "rgba(0,0,0,1)");
					groupT.setStyle(Q.Styles.LABEL_VISIBLE, false);

					var x = 0;
					while (x < width) {
						var y = 0;
						while (y < height) {
							// label
							if(x == 0) {
								let name = rfModel.isStringType ?  getTileString(y / GAP) : /*(x / GAP + 1).toString() + "-" + */(y / GAP + 1).toString();
								let label = createLabel(name, x, y+GAP, GAP, GAP, Q.Position.RIGHT_TOP);
								groupL.addChild(label);
							}
							if(y == 0) {
								let name = rfModel.isStringType ?  getTileString(x / GAP) : (x / GAP + 1).toString()/* + "-" + (y / GAP + 1).toString()*/;
								let label = createLabel(name, x+GAP, y, GAP, GAP, Q.Position.LEFT_BOTTOM);
								groupL.addChild(label);
							}

							// node
							// var property = Q.randomBool();
							// var property = true;
							var property = { type: TYPE_TILE_ABLE };
							var nodeA = createShape((x / GAP).toString() + "-" + (y / GAP).toString(), x, y, GAP, GAP, property);
							groupT.addChild(nodeA);

							y += GAP;
						}
						x += GAP;
					}

					return room;
				}

				function createTile(type, x, y, name) {
					name = name ? name : type;
					// var property = false;
					var property = { type: type };
					var node = createShape(name, x, y, GAP, GAP, property);
					var groupT = graph.getElementByName(TYPE_GORUP_TILE);
					groupT.addChild(node);
					snapToTile(node);

					return node;
				}

				function createNode(name, x, y, width, height, image, img_width, img_height, offset_x, offset_y) {
					// console.log("rfdd : createNode :", name, x, y, width, height, to2_5D(x || 0, y || 0), image);
					// var node_width = width? width*NODE_WIDTH : NODE_WIDTH;
					// var node_height = height? height*NODE_HEIGHT : NODE_HEIGHT;
					var p = to2_5D(x || 0, y || 0);
					var node = graph.createNode(name, p.x, p.y);
					// node.anchorPosition = Q.Position.CENTER_MIDDLE;
					node.anchorPosition = Q.Position.LEFT_BOTTOM;
					node.size = { width: img_width, height: img_height };
					node.image = image || "images/icon/img_rack_01.png";
					// node.tooltip = "";
					node.clickable = true;
					node.dblclickable = true;
					node.properties = { w:width, h:height, ox: offset_x, oy: offset_y };
					node.movable = ($scope.editable == false || $scope.editable  == "false")? false : true;
					node.setStyle(Q.Styles.LABEL_VISIBLE, false);

					// add alarm
					/*if (Q.randomInt(10) > 7) {
						 var color = Q.randomBool() ? "#FF0" : "#F00";
						 node.setStyle(Q.Styles.RENDER_COLOR, color);
						 var alarmImage;
						 if (color == "#F00") {
						 	alarmImage = "others/icons/error.png";
						 } else if (color == "#FF0") {
						 	alarmImage = "others/icons/warning.png";
						 } else {
						 	alarmImage = "others/icons/info.png";
						 }
						 var alarmIcon = this.alarmIcon = new Q.ImageUI(alarmImage);
						 alarmIcon.size = {width: 12};
						 alarmIcon.padding = 2;
						 alarmIcon.offsetX = -10;
						 alarmIcon.offsetY = 5;
						 alarmIcon.anchorPosition = Q.Position.CENTER_BOTTOM;
						 alarmIcon.position = Q.Position.RIGHT_TOP;
						 node.addUI(alarmIcon);
					 }*/

					nodes.push(node);
					return node;
				}

				function createShape(name, x, y, width, height, properties) {
					// console.log("rfdd : createShape :", name, x, y, to2_5D(x || 0, y || 0), width, height);

					// var color = "#" + Math.round(Math.random() * 0xFFFFFF).toString(16);
					// var color = properties.type == TYPE_TILE_ABLE ? "#FFF" : "#F00";
					var color = "#FFF";
					switch (properties.type.toUpperCase()) {
						case TYPE_TILE_DISABLE:
							color = "#F00";
							break;
						case TYPE_TILE_DOOR:
							color = "#888";
							break;
					}

					var bounds = new Q.Rect();
					bounds.addPoint(to2_5D(0, 0));
					bounds.addPoint(to2_5D(0, height));
					bounds.addPoint(to2_5D(width, height));
					bounds.addPoint(to2_5D(width, 0));
					var dy = -bounds.y;
					dy = 0;

					var p = to2_5D(x || 0, y || 0);

					var shape = graph.createShapeNode(name, p.x, p.y);
					var p = to2_5D(0, 0);
					shape.moveTo(p.x, p.y + dy);
					p = to2_5D(width, 0);
					shape.lineTo(p.x, p.y + dy);
					p = to2_5D(width, height);
					shape.lineTo(p.x, p.y + dy);
					p = to2_5D(0, height);
					shape.lineTo(p.x, p.y + dy);
					shape.closePath();

					// shape.anchorPosition = Q.Position.CENTER_BOTTOM;
					shape.anchorPosition = Q.Position.LEFT_BOTTOM;
					shape.selectable = properties.type.toUpperCase() == TYPE_TILE_ABLE ? false: true;
					shape.movable = ($scope.editable == false || $scope.editable  == "false")? false : true;

					shape.setStyle(Q.Styles.SHAPE_STROKE, 1);
					shape.setStyle(Q.Styles.SHAPE_STROKE_STYLE, "#888");
					shape.setStyle(Q.Styles.LAYOUT_BY_PATH, true);
					shape.setStyle(Q.Styles.SHAPE_FILL_COLOR, color);
					shape.setStyle(Q.Styles.LINE_CAP, Q.Consts.LINE_CAP_TYPE_BUTT);
					shape.setStyle(Q.Styles.LINE_JOIN, Q.Consts.LINE_JOIN_TYPE_MITER);
					shape.setStyle(Q.Styles.LABEL_POSITION, Q.Position.CENTER_BOTTOM);
					shape.setStyle(Q.Styles.LABEL_VISIBLE, false);

					// user property
					shape.properties = properties;

					return shape;
				}

				function createLabel(name, x, y, width, height, position) {
					var bounds = new Q.Rect();
					bounds.addPoint(to2_5D(0, 0));
					bounds.addPoint(to2_5D(0, height));
					bounds.addPoint(to2_5D(width, height));
					bounds.addPoint(to2_5D(width, 0));
					var dy = -bounds.y;
					dy = 0;

					var p = to2_5D(x || 0, y || 0);

					var shape = graph.createShapeNode(name, p.x, p.y);
					var p = to2_5D(0, 0);
					shape.moveTo(p.x, p.y + dy);
					p = to2_5D(width, 0);
					shape.lineTo(p.x, p.y + dy);
					p = to2_5D(width, height);
					shape.lineTo(p.x, p.y + dy);
					p = to2_5D(0, height);
					shape.lineTo(p.x, p.y + dy);
					shape.closePath();

					shape.anchorPosition = Q.Position.CENTER_BOTTOM;
					shape.selectable = false;

					shape.setStyle(Q.Styles.SHAPE_STROKE, 0);
					shape.setStyle(Q.Styles.SHAPE_STROKE_STYLE, "#888");
					shape.setStyle(Q.Styles.LAYOUT_BY_PATH, true);
					shape.setStyle(Q.Styles.SHAPE_FILL_COLOR, null);
					shape.setStyle(Q.Styles.LINE_CAP, Q.Consts.LINE_CAP_TYPE_BUTT);
					shape.setStyle(Q.Styles.LINE_JOIN, Q.Consts.LINE_JOIN_TYPE_MITER);
					// shape.setStyle(Q.Styles.LABEL_POSITION, Q.Position.LEFT_TOP);
					// shape.setStyle(Q.Styles.LABEL_POSITION, Q.Position.CENTER_BOTTOM);
					// shape.setStyle(Q.Styles.LABEL_POSITION, Q.Position.RIGHT_TOP);
					shape.setStyle(Q.Styles.LABEL_POSITION, position);
					shape.setStyle(Q.Styles.LABEL_VISIBLE, true);

					return shape;
				}

				function createEdge(from, to, type, lineWidth, color){
					var edge = graph.createEdge(from.name + " --> " + to.name, from, to);
					edge.setStyle(Q.Styles.EDGE_COLOR, color || "#000");
					edge.setStyle(Q.Styles.EDGE_WIDTH, lineWidth || 2);
					edge.edgeType = type || Q.Consts.EDGE_TYPE_DEFAULT;
					return edge;
				}

				function addTile(event) {
					console.log("rfdd : addTile");

					// var data = event.dataTransfer.getData("Text");
					var id = event.dataTransfer.getData("dataId");
					var subtype = event.dataTransfer.getData("dataSubtype");
					var type;
					switch (subtype.toUpperCase()) {
						case "DISABLE":
							type = TYPE_TILE_DISABLE;
							break;
						case "DOOR":
							type = TYPE_TILE_DOOR;
							break;
					}

					var lp = graph.globalToLocal(event);
					// lp.x -= 10;
					// lp.y -= 10;
					console.log("rfdd :", lp.x, lp.y);
					console.log("rfdd :", (lp.x - graph.tx) / graph.scale, (lp.y - graph.ty) / graph.scale);

					var p = from2_5D((lp.x - graph.tx) / graph.scale, (lp.y - graph.ty) / graph.scale);
					console.log("rfdd :", p.x, p.y);

					var tile = createTile(type, p.x, p.y/*, id*/);
					// updateZIndex(tile);

					var np = from2_5D(tile.x, tile.y);
					callAddComplete(TYPE_ADD_TILE, id, np.x, np.y);
				}

				function addNode(event) {
					console.log("rfdd : addNode");
					console.log("rfdd : event :", event.dataTransfer.getData("Text"), event.offsetX, event.offsetY, event.pageX, event.pageY);
					console.log("rfdd : graph :", graph.width, graph.height, graph.tx, graph.ty, graph.scale, graph.bounds);

					// var data = event.dataTransfer.getData("Text");
					var id = event.dataTransfer.getData("dataId");
					var type = event.dataTransfer.getData("dataType");
					var subtype = event.dataTransfer.getData("dataSubtype");
					var info = getNodeInfo(type, subtype);

					var lp = graph.globalToLocal(event);
					// lp.x -= 10;
					// lp.y -= 10;
					console.log("rfdd :", lp.x, lp.y);
					console.log("rfdd :", (lp.x - graph.tx) / graph.scale, (lp.y - graph.ty) / graph.scale);

					var p = from2_5D((lp.x - graph.tx) / graph.scale, (lp.y - graph.ty) / graph.scale);
					console.log("rfdd :", p.x, p.y);

					// p = to2_5D(p.x, p.y);
					// p = getSnapPoint(p.x, p.y);

					var gap = GAP/SNAP;
					p.x /= gap;
					p.y /= gap;
					p.x = parseInt(p.x) * gap;
					p.y = parseInt(p.y) * gap;

					var ct = checkTile(p, info.w, info.h);
					console.log("rfdd : check tile :", checkTileProperty(ct), ct);

					var cn = checkNode(p, info.w, info.h);
					console.log("rfdd : check node :", nodes.length, cn);

					if((/*ct && */checkTileProperty(ct)/* && ct.length >= info.w*info.h*/) && (!cn)) {
						// p.x += (p.x < 0 ? -(GAP - X_OFFSET) : X_OFFSET)*info.w;
						// p.y += (p.y < 0 ? -(GAP - Y_OFFSET) : Y_OFFSET)*info.h;
						// p.x += X_OFFSET*info.w;
						// p.y += Y_OFFSET*info.h;
						p.x += info.ox;
						p.y += info.oy;

						// var node = createNode("", p.x, p.y, info.w, info.h);				// cursor 좌표

						// var gap = GAP/SNAP;
						// p.x /= gap;
						// p.y /= gap;
						// console.log("rfdd :", parseInt(p.x) * gap + X_OFFSET, parseInt(p.y) * gap + Y_OFFSET);
						// var node = createNode("", parseInt(p.x) * gap + X_OFFSET, parseInt(p.y) * gap + Y_OFFSET, info.w, info.h);		// snap 좌표

						var node = createNode(id, p.x, p.y, info.w, info.h, info.img, info.iw, info.ih, info.ox, info.oy);

						updateZIndex(node);
						// snapToGrid(node);

						callAddComplete(type, id, p.x-info.ox, p.y-info.oy);
					}
				}

				function checkTileProperty(tiles) {
					var check = tiles && tiles.length > 0 ? true: false;
					for(let i=0, l=tiles.length; i<l; ++i) {
						check = check && (tiles[i].properties.type.toUpperCase() == TYPE_TILE_ABLE ? true : false);
					}
					return check;
				}

				function checkTile(p, w, h) {
					console.log("rfdd : checkTile :", p, w, h);

					var groupT = graph.getElementByName(TYPE_GORUP_TILE);
					// console.log("rfdd :", graph.getElementByMouseEvent(event));

					w = w || 1;
					h = h || 1;

					var gap = GAP / SNAP;

					var count = 0;
					var tiles = [];
					for(let i=0; i<w; ++i) {
						for(let j=0; j<h; ++j) {
							for(let k=0; k<SNAP; ++k) {
								for(let l=0; l<SNAP; ++l) {
									let p2 = {x: (p.x + i * GAP + gap * k), y: (p.y + j * GAP + gap * l)};
									console.log("rfdd :", i, j, k, l, p2);
									groupT.forEachChild(function (child) {
										// console.log("rfdd :", child.id, child.name, child.x, child.y, from2_5D(child.x, child.y), containTile(from2_5D(child.x, child.y), p2));
										if (containTile(from2_5D(child.x, child.y), p2)) {
											console.log("rfdd : containTile :", child.id, child.name, child.x, child.y, from2_5D(child.x, child.y), containTile(from2_5D(child.x, child.y), p2));
											// tiles = child;
											// tiles.push(child);
											if($.inArray(child, tiles) === -1) tiles.push(child);
											++ count;
										}
									});
								}
							}
						}
					}

					console.log("rfdd : ----------------------");
					console.log("rfdd :", w*h*SNAP*SNAP, count);
					for (let idx in tiles) {
						console.log("rfdd :", tiles[idx].id, tiles[idx].name, tiles[idx].x, tiles[idx].y, from2_5D(tiles[idx].x, tiles[idx].y));
					}
					console.log("rfdd : ----------------------");
					return (w*h*SNAP*SNAP <= count) ? tiles: [];
				}

				function checkNode(p, w, h, id) {
					console.log("rfdd : checkNode :", p, w, h, id);

					var gap = GAP / SNAP;

					for(let i=0; i<w; ++i) {
						for(let j=0; j<h; ++j) {
							// var p2 = { x: (p.x + i*GAP), y: (p.y + j*GAP) };
							// console.log("rfdd :", i, j, p2);

							for(let k=0; k<SNAP; ++k) {
								for (let l = 0; l < SNAP; ++l) {
									let p2 = { x: (p.x + i*GAP + gap*k), y: (p.y + j*GAP + gap*l) };
									console.log("rfdd :", i, j, k, l, p2);

									for (let m = 0, ml = nodes.length; m < ml; ++m) {
										let node = nodes[m];
										// console.log("rfdd :", node);

										// var nw = parseInt(node.size.width / NODE_WIDTH);
										let nw = parseInt(node.properties.w);
										// var nh = parseInt(node.size.height / NODE_HEIGHT);
										let nh = parseInt(node.properties.h);

										/*for(var ni=0; ni<nw; ++ni) {
											 for(var nj=0; nj<nh; ++nj) {
												 var np = from2_5D(node.x, node.y);
												 np.x = np.x + (ni*GAP);
												 np.y = np.y + (nj*GAP);
												 console.log("rfdd :", node.id, node.size, node.x, node.y, np.x, np.y, (np.x - X_OFFSET), (np.y - Y_OFFSET), Math.round(np.x - X_OFFSET), Math.round(np.y - Y_OFFSET), containNode(parseInt(np.x) - X_OFFSET, parseInt(np.y) - Y_OFFSET, p2));
												 if (containNode(parseInt(np.x) - X_OFFSET, parseInt(np.y) - Y_OFFSET, p2) && (!id || id != node.id)) {
												 	return node;
												 }
											 }
										 }*/

										if ((!id || id != node.id) && containNode(node, p2)) {
											return node;
										}

									}

								}
							}

						}
					}
				}

				function loadData(data) {
					console.log("rfdd : loadData :", data);

					var room_data = getRoomData(data.selectedModel);
					if(!room_data)
						return;

					rfModel = new RfModel();
					rfModel.set(room_data);
					rfModel.isStringType = data.diagramData && data.diagramData.length ? isNaN(parseFloat(data.diagramData[0].x)) : false;

					horizonSize = rfModel.horizonSize;
					verticalSize = rfModel.verticalSize;
					createGraph(getGraphWidth(), getGraphHeight());

					/*if(!data.diagramData) {
						if (room_data.selectedChildren && room_data.selectedChildren.length) {
							for (let i = 0, l = room_data.selectedChildren.length; i < l; ++i) {
								let node = room_data.selectedChildren[i];
								if (node.positionX != null && node.positionY != null) {
									if (node.type.toUpperCase() == TYPE_ADD_RACK || node.type.toUpperCase() == TYPE_ADD_FACILITY) {

										// TODO. type별 node 설정
										// let info = getNodeInfo(node.type, node.subtype);
										let info = getNodeInfo(TYPE_ADD_RACK, "11");

										let x = parseInt(node.positionX) * GAP + parseInt(info.ox);
										let y = parseInt(node.positionY) * GAP + parseInt(info.oy);

										let rack = createNode(node.resourceSeq, x, y, info.w, info.h, info.img, info.iw, info.ih, info.ox, info.oy);
										updateZIndex(rack);
									} else if (node.type.toUpperCase() == TYPE_ADD_TILE) {
										let x = parseInt(node.positionX) * GAP;
										let y = parseInt(node.positionY) * GAP;

										let tile = createTile(node.type, x, y);
									}
								}
							}
						}
					} else {
						addDiagramData(data.diagramData);
					}*/
					addDiagramData(data.diagramData);
				}
				
				function addDiagramData(data) {
					if(!data)
						return;

					// create
					/*for(let i=0, l=data.length; i<l; ++i) {
						 if(data[i].type == "size") {
							 horizonSize = parseInt(data[i].w);
							 verticalSize = parseInt(data[i].h);
							 createGraph(getGraphWidth(), getGraphHeight());
						 }
					 }*/

					// add
					for(let i=0, l=data.length; i<l; ++i) {
						if(data[i].x != null && data[i].y != null) {
							if (data[i].type.toUpperCase() == TYPE_ADD_RACK || data[i].type.toUpperCase() == TYPE_ADD_FACILITY) {
								let info = getNodeInfo(data[i].type, data[i].subtype);
								let x = 0, y = 0;
								if (isNaN(parseFloat(data[i].x)) || isNaN(parseFloat(data[i].y))) {
									x = getTileIndex(data[i].x) * GAP + parseInt(info.ox);
									y = getTileIndex(data[i].y) * GAP + parseInt(info.oy);
								} else {
									x = parseFloat(data[i].x) * GAP + parseInt(info.ox);
									y = parseFloat(data[i].y) * GAP + parseInt(info.oy);
								}
								let rack = createNode(data[i].id, x, y, info.w, info.h, info.img, info.iw, info.ih, info.ox, info.oy);
								updateZIndex(rack);
							} else if (data[i].type.toUpperCase() == TYPE_ADD_TILE) {
								let x = 0, y = 0;
								if (isNaN(parseFloat(data[i].x)) || isNaN(parseFloat(data[i].y))) {
									x = getTileIndex(data[i].x) * GAP;
									y = getTileIndex(data[i].y) * GAP;
								} else {
									x = parseFloat(data[i].x) * GAP;
									y = parseFloat(data[i].y) * GAP;
								}

								let tile = createTile(data[i].subtype, x, y/*, data[i].id*/);
							}
						}
					}
				}

				function saveData() {
					let data = [];

					// size
					// data.push({ type: "size", w:horizonSize, h:verticalSize });

					// node
					for(let i=0, l=nodes.length; i<l; ++i) {
						let node = nodes[i];
						let np = from2_5D(node.x, node.y);
						let x = parseInt(parseInt(np.x) - parseInt(node.properties.ox)) / GAP;
						let y = parseInt(parseInt(np.y) - parseInt(node.properties.oy)) / GAP;
						data.push({ type: getNodeType(node.image), subtype: getNodeSubtype(node.image, node.properties.w, node.properties.h), id: node.name, x: x.toFixed(1), y: y.toFixed(1) });
					}

					// tile
					let groupT = graph.getElementByName(TYPE_GORUP_TILE);
					groupT.forEachChild(function (child) {
						if(child.properties.type.toUpperCase() != TYPE_TILE_ABLE) {
							let np = from2_5D(child.x, child.y);
							let x = parseInt(np.x) / GAP;
							let y = parseInt(np.y) / GAP;
							// data.push({ type: TYPE_ADD_TILE, subtype:child.properties.type, id: child.name, x: x.toFixed(1), y: y.toFixed(1) });
							data.push({ type: TYPE_ADD_TILE, subtype:child.properties.type, id: null, x: x.toFixed(1), y: y.toFixed(1) });
						}
					});

					// console.log("rfdd : saveData :", data);
					return data;
				}

				function changeTileData(direction, count) {
					if(count < 0) {				// 축소
						if (direction == "lt") {
							if (checkRemoveTile("x", "min", count) == false) {
								console.log("rfdd : checkRemoveTile :", false);
								return false;
							}
						} else if(direction == "rb") {
							if (checkRemoveTile("x", "max", count) == false) {
								console.log("rfdd : checkRemoveTile :", false);
								return false;
							}
						} else if(direction == "lb") {
							if (checkRemoveTile("y", "min", count) == false) {
								console.log("rfdd : checkRemoveTile :", false);
								return false;
							}
						} else if(direction == "rt") {
							if (checkRemoveTile("x", "max", count) == false) {
								console.log("rfdd : checkRemoveTile :", false);
								return false;
							}
						}
					} else {					// 확대

					}

					let groupL = graph.getElementByName(TYPE_GORUP_LABEL);
					groupL.clearChildren();

					let groupT = graph.getElementByName(TYPE_GORUP_TILE);
					groupT.clearChildren();

					// invalidate
					graph.invalidateElement(groupL);
					graph.invalidateUI(groupL);
					graph.invalidate();

					// clear
					// graph.clear();
					// nodes = [];
					// tiles = [];

					switch (direction) {
						case "lt":				// x축 시작
							horizonSize = parseInt(horizonSize) + parseInt(count);
							// verticalSize += ;
							createRoom2(getGraphWidth(), getGraphHeight());
							moveGraph("x", count*GAP);
							break;
						case "rb":				// x축 끝
							horizonSize = parseInt(horizonSize) + parseInt(count);
							createRoom2(getGraphWidth(), getGraphHeight());
							break;
						case "lb":				// y축 시작
							verticalSize = parseInt(verticalSize) + parseInt(count);
							createRoom2(getGraphWidth(), getGraphHeight());
							moveGraph("y", count*GAP);
							break;
						case "rt":				// y축 끝
							verticalSize = parseInt(verticalSize) + parseInt(count);
							createRoom2(getGraphWidth(), getGraphHeight());
							break;

					}

					return true;
				}

				function checkRemoveTile(axis, flag, count) {
					if(flag.toLowerCase() == "min") {
						for (let i = 0, l = nodes.length; i < l; ++i) {
							let node = nodes[i];
							let p = from2_5D(node.x, node.y);
							if (parseInt(p[axis]) + parseInt(count) * GAP < 0) {
								return false;
							}
						}
					} else {
						for (let i = 0, l = nodes.length; i < l; ++i) {
							let node = nodes[i];
							let p = from2_5D(node.x, node.y);
							if (parseInt(p[axis]) > (getGraphWidth() + parseInt(count) * GAP)) {
								return false;
							}
						}
					}
					return true;
				}

				function moveGraph(axis, size) {
					// move
					for(let i=0, l=nodes.length; i<l; ++i) {
						let node = nodes[i];
						let p = from2_5D(node.x, node.y);
						p[axis] += size;
						let np = to2_5D(p.x, p.y);
						node.setLocation(np.x, np.y);
					}

					/*var groupT = graph.getElementByName(TYPE_GORUP_TILE);
					groupT.forEachChild(function (child) {
						let p = from2_5D(child.x, child.y);
						p[axis] += size;
						let np = to2_5D(p.x, p.y);
						child.setLocation(np.x, np.y);
					});*/

					// add
					/*var data = $scope.data.diagramData;
					for(let i=0, l=data.length; i<l; ++i) {
						if(data[i].type == TYPE_ADD_RACK) {
							let info = getNodeInfo(data[i].info);

							let p = { x: data[i].x + info.ox, y: data[i].y + info.oy };
							p[axis] += size;

							let node = createNode(data[i].id, p.x, p.y, info.w, info.h, info.img, info.iw, info.ih, info.ox, info.oy);
							updateZIndex(node);
						} else if(data[i].type == TYPE_ADD_TILE) {
							let tile = createTile(data[i].info, p.x, p.y);
						} else {

						}
					}*/
				}

				function removeElementByName(name) {
					graph.removeElement(graph.getElementByName(name));
				}

				function setSelectionByName(name) {
					graph.setSelection(graph.getElementByName(name));
				}
				
				function setEditable() {
					if(!graph)
						return;

					// graph.editable = ($scope.editable == false || $scope.editable  == "false")? false : true;
					// graph.movable = false;
					// graph.selectable = false;
				}

				function getRoomData(value) {
					if(!value)
						return null;
					else if(angular.isArray(value)) {
						for(let i=0, l=value.length; i<l; ++i) {
							if(value[i].type == "ROOM")
								return value[i];

							return getRoomData(value[i].selectedChildren);
						}
					}
					else if(angular.isObject(value)) {
						if (value.type == "ROOM")
							return value;

						return getRoomData(value.selectedChildren);
					}
				}

				function getNodeInfo(type, subtype) {
					var info = {};
					if(type.toUpperCase() == TYPE_ADD_FACILITY) {
						switch (subtype.toUpperCase()) {
							case TYPE_FACILITY_CE:
								info.w = 1;
								info.h = 1;
								info.img = "images/icon/conditioning_equipment.png";
								info.iw = WIDTH_FACILITY_CE;
								info.ih = HEIGHT_FACILITY_CE;
								info.ox = OFFSET_X_FACILITY_CE;
								info.oy = OFFSET_Y_FACILITY_CE;
								break;
							case TYPE_FACILITY_TH:
								info.w = 1;
								info.h = 1;
								info.img = "images/icon/thermo_hygrostat.png";
								info.iw = WIDTH_FACILITY_TH;
								info.ih = HEIGHT_FACILITY_TH;
								info.ox = OFFSET_X_FACILITY_TH;
								info.oy = OFFSET_Y_FACILITY_TH;
								break;
							case TYPE_FACILITY_UPS:
								info.w = 1;
								info.h = 1;
								info.img = "images/icon/ups.png";
								info.iw = WIDTH_FACILITY_UPS;
								info.ih = HEIGHT_FACILITY_UPS;
								info.ox = OFFSET_X_FACILITY_UPS;
								info.oy = OFFSET_Y_FACILITY_UPS;
								break;
							default:
								info.w = 1;
								info.h = 1;
								info.img = "images/icon/conditioning_equipment.png";
								info.iw = WIDTH_FACILITY_CE;
								info.ih = HEIGHT_FACILITY_CE;
								info.ox = OFFSET_X_FACILITY_CE;
								info.oy = OFFSET_Y_FACILITY_CE;
								break;
						}
					} else if(type.toUpperCase() == TYPE_ADD_RACK) {
						switch (subtype) {
							case "11":
								info.w = 1;
								info.h = 1;
								info.img = "images/icon/img_rack_01.png";
								info.iw = WIDTH_RACK_1;
								info.ih = HEIGHT_RACK_1;
								info.ox = OFFSET_X_RACK_1;
								info.oy = OFFSET_Y_RACK_1;
								break;
							case "21":
								info.w = 2;
								info.h = 1;
								info.img = "images/icon/img_rack_02.png";
								info.iw = WIDTH_RACK_2;
								info.ih = HEIGHT_RACK_2;
								info.ox = OFFSET_X_RACK_2;
								info.oy = OFFSET_Y_RACK_2;
								break;
							case "12":
								info.w = 1;
								info.h = 2;
								info.img = "images/icon/img_rack_03.png";
								info.iw = WIDTH_RACK_3;
								info.ih = HEIGHT_RACK_3;
								info.ox = OFFSET_X_RACK_3;
								info.oy = OFFSET_Y_RACK_3;
								break;
							case "22":
								info.w = 2;
								info.h = 2;
								info.img = "images/icon/img_rack_01.png";
								info.iw = WIDTH_RACK_1 * 2;
								info.ih = HEIGHT_RACK_1 * 2;
								info.ox = OFFSET_X_RACK_4;
								info.oy = OFFSET_Y_RACK_4;
								break;
							default:
								info.w = 1;
								info.h = 1;
								info.img = "images/icon/img_rack_01.png";
								info.iw = WIDTH_RACK_1;
								info.ih = HEIGHT_RACK_1;
								info.ox = OFFSET_X_RACK_1;
								info.oy = OFFSET_Y_RACK_1;
								break;
						}
					}
					return info;
				}

				function getNodeType(img) {
					var type;
					switch (img) {
						case "images/icon/img_rack_01.png":
						case "images/icon/img_rack_02.png":
						case "images/icon/img_rack_03.png":
							type = TYPE_ADD_RACK;
							break;
						case "images/icon/conditioning_equipment.png":
						case "images/icon/thermo_hygrostat.png":
						case "images/icon/ups.png":
							type = TYPE_ADD_FACILITY;
							break;
					}

					return type;
				}

				function getNodeSubtype(img, w, h) {
					var type;
					switch (img) {
						case "images/icon/img_rack_01.png":
							if(w==2 || h==2) {
								type = "22";
							} else {
								type = "11";
							}
							break;
						case "images/icon/img_rack_02.png":
							type = "21";
							break;
						case "images/icon/img_rack_03.png":
							type = "12";
							break;
						case "images/icon/conditioning_equipment.png":
							type = TYPE_FACILITY_CE;
							break;
						case "images/icon/thermo_hygrostat.png":
							type = TYPE_FACILITY_TH;
							break;
						case "images/icon/ups.png":
							type = TYPE_FACILITY_UPS;
							break;
					}
					return type;
				}

				function updateZIndex(node, invalidate) {
					// console.log("rfdd : updateZIndex :", node, invalidate);
					node.zIndex = node.y + 2000;
					if (invalidate) {
						node.invalidate();
					}
				}

				function getSnapPoint(x, y, w, h, ox, oy) {
					var gap = GAP/SNAP;
					var p = toGrid(x, y);
					console.log("rfdd :", x, y);
					console.log("rfdd :", p);

					// var x_offset = (p.x < 0 ? -(GAP - X_OFFSET) : X_OFFSET)*w;
					// var y_offset = (p.y < 0 ? -(GAP - Y_OFFSET) : Y_OFFSET)*h;
					// var x_offset = X_OFFSET*w;
					// var y_offset = Y_OFFSET*h;
					var x_offset = parseInt(ox);
					var y_offset = parseInt(oy);
					p.x -= x_offset;
					p.y -= y_offset;

					p.x /= gap;
					p.y /= gap;
					console.log("rfdd :", p);
					console.log("rfdd :", parseInt(p.x) * gap + x_offset, parseInt(p.y) * gap + y_offset);
					p = to2_5D(parseInt(p.x) * gap + x_offset, parseInt(p.y) * gap + y_offset);
					// console.log("rfdd :", Math.round(p.x) * gap + x_offset, Math.round(p.y) * gap + y_offset);
					// p = to2_5D(Math.round(p.x) * gap + x_offset, Math.round(p.y) * gap + y_offset);
					console.log("rfdd :", p);
					return p;
				}

				function snapToGrid(node) {
					// var p = getSnapPoint(node.x, node.y, parseInt(node.size.width/NODE_WIDTH), parseInt(node.size.height/NODE_HEIGHT));
					var p = getSnapPoint(node.x, node.y, node.properties.w, node.properties.h, node.properties.ox, node.properties.oy);
					node.setLocation(p.x, p.y);
					console.log("rfdd : snapToGrid :", node, p.x, p.y);
				}

				function snapToTile(node) {
					var gap = GAP;
					var p = toGrid(node.x, node.y);
					p.x /= gap;
					p.y /= gap;
					p = to2_5D(Math.round(p.x) * gap + 0, Math.round(p.y) * gap + 0);
					node.setLocation(p.x, p.y);
					console.log("rfdd : snapToTile :", node, p.x, p.y);
				}

				function moveToOrigin(node) {
					node.setLocation(nodeMoveStart.x, nodeMoveStart.y);
					console.log("rfdd : moveToOrigin :", node, nodeMoveStart.x, nodeMoveStart.y);
				}

				function containTile(tp, p) {
					var bounds = new Q.Rect(parseInt(tp.x), parseInt(tp.y), GAP, GAP);
					// return bounds.contains(p.x, p.y);
					if(bounds.left <= p.x && bounds.right > p.x && bounds.top <= p.y && bounds.bottom > p.y)
						return true;
					else
						return false;
				}

				/*function containNode(x, y, p) {
				 var bounds = new Q.Rect(x, y, GAP, GAP);
				 return bounds.contains(p.x, p.y);
				 }*/
				function containNode(node, p) {
					var np = from2_5D(node.x, node.y);
					// var bounds = new Q.Rect(np.x, np.y, node.size.width/NODE_WIDTH*GAP, node.size.height/NODE_HEIGHT*GAP);
					var bounds = new Q.Rect(np.x, np.y, node.properties.w*GAP, node.properties.h*GAP);
					// var nbounds = bounds.offset(-X_OFFSET*node.size.width/NODE_WIDTH, -Y_OFFSET*node.size.height/NODE_HEIGHT);
					var nbounds = bounds.offset(-node.properties.ox, -node.properties.oy);
					console.log("rfdd :", node.id, node.size, node.x, node.y, np.x, np.y, "(", bounds.x, bounds.y, bounds.width, bounds.height, ") (", nbounds.x, nbounds.y, nbounds.width, nbounds.height, ")", nbounds.contains(p.x, p.y));
					// return bounds.contains(p.x, p.y);
					if(nbounds.left <= p.x && nbounds.right > p.x && nbounds.top <= p.y && nbounds.bottom > p.y)
						return true;
					else
						return false;
				}

				function callAddComplete(type, id, x, y) {
					console.log("rfdd : callAddComplete :", type, id, x, y);
					if ($scope.addComplete) {
						var data = { type: type, id: id, x: parseInt(x), y: parseInt(y) };
						$scope.addComplete({ "data": data });
					}
				}

				function callMoveComplete(type, id, x, y) {
					console.log("rfdd : callMoveComplete :", type, id, x, y);
					if ($scope.moveComplete) {
						var data = { type: type, id: id, x: parseInt(x), y: parseInt(y) };
						$scope.moveComplete({ "data": data });
					}
				}

				function callClickNode(type, id, x, y, event) {
					console.log("rfdd : callClickNode :", type, id, x, y, event);
					if ($scope.clickNode) {
						var data = { type: type, id: id, x: parseInt(x), y: parseInt(y), event: event };
						$scope.clickNode({ "data": data });
					}
				}

				function callDblclickNode(type, id, x, y) {
					console.log("rfdd : callDblclickNode :", type, id, x, y);
					if ($scope.dblclickNode) {
						var data = { type: type, id: id, x: parseInt(x), y: parseInt(y) };
						$scope.dblclickNode({ "data": data });
					}
				}

				function removeDragEvent(id) {
					document.getElementById(id).ondragstart = function(event) {
						return false;
					};
				}

				function addDragEvent(id) {
					document.getElementById(id).ondragstart = function(event) {
						console.log("rfdd : ondragstart", event.target);

						if(event.target.dataset.dragItem == "true") {
							event.dataTransfer.setData("dragItem", event.target.dataset.dragItem);
							event.dataTransfer.setData("dataId", event.target.dataset.id);
							event.dataTransfer.setData("dataType", event.target.dataset.type);
							event.dataTransfer.setData("dataSubtype", event.target.dataset.subtype);
						}
					};
				}
				
				function addDropEvent(id) {
					document.getElementById(id).ondragover = function(event) {
						event.preventDefault();
					};

					document.getElementById(id).ondrop = function(event) {
						console.log("rfdd : ondrop", event);
						event.preventDefault();

						let dragItem = event.dataTransfer.getData("dragItem");
						if(dragItem != "true")
							return;
						if($scope.editable == false || $scope.editable  == "false")
							return;

						// var data = event.dataTransfer.getData("Text");
						let type = event.dataTransfer.getData("dataType");

						if(type.toUpperCase() == TYPE_ADD_RACK || type.toUpperCase() == TYPE_ADD_FACILITY)
							addNode(event);
						else if(type.toUpperCase() == TYPE_ADD_TILE)
							addTile(event);
					};
				}
				
				function getParentElement(target, id) {
					if(target == null)
						return null;
					if(target.id == id)
						return target;

					return getParentElement(target.parentElement, id);
				}
				
				function getTileIndex(str) {
					return INDEX_LIST.indexOf(str.toUpperCase());
				}

				function getTileString(num) {
					return INDEX_LIST[num];
				}

				/*// export
				$('#btnJSONShow').click(function () {
					showJSONPanel();
				});
				$('#btnJSONSubmit').click(function () {
					try {
						graph.clear();
						graph.parseJSON(json_code_panel.value);
						showJSONPanel(false);
					} catch (error) {
						Q.alert(getI18NString('Import Error'), error);
					}
				});
				$('#btnJSONClose').click(function () {
					showJSONPanel(false);
				});

				function showJSONPanel(show) {
					var isShowing = $("#Q-JSON-Panel")[0].clientHeight > 10;
					if (show === undefined) {
						return showJSONPanel(!isShowing);
					}
					if (isShowing === show) {
						return;
					}
					$("#Q-JSON-Panel").animate({height: isShowing ? "0" : "100%"});
					if (!isShowing) {
						json_code_panel.value = graph.exportJSON(true);
					}
				}*/

				/*// overview
				$('#btnOverview').click(function(){
					var visible = !overview.visible;
					overview.setVisible(visible);
					// overview.setGraph(visible ? window.graph : null);
					overview.setGraph(visible ? graph : null);
				});*/


				// clear
				function clearGraph() {
					if(graph) {
						overview.setGraph(null);
						overview = null;
						$('#overview').empty();

						graph.clear();
						graph.destroy();
						graph = null;
						$('#canvas').empty();
					}

					nodes = [];
					// tiles = [];
				}
				
				// init
				function createGraph(width, height) {
					graph = new Q.Graph('canvas');
					graph.minScale = 0.5;
					// graph.editable = false;
					// setEditable();

					var styles = graph.styles = {};
					styles[Q.Styles.SELECTION_COLOR] = "#000";
					styles[Q.Styles.SELECTION_TYPE] = Q.Consts.SELECTION_TYPE_BORDER;

					graph.zoomToOverview();

					if($scope.editable == false || $scope.editable  == "false") {

					} else {
						graph.interactionDispatcher.addListener(function (evt) {
							console.log("rfdd : interactionDispatcher.addListener :", evt.kind, evt);
							if (evt.kind == Q.InteractionEvent.SELECT) {
								if($scope.mode) {
									// TODO. 모드별 동작 추가
								}
							} else if (evt.kind == Q.InteractionEvent.ELEMENT_MOVE_START) {
								nodeMoveStart = {x: evt.datas[0].x, y: evt.datas[0].y};
								// TODO. 이동하기전 타일 check
							} else if (evt.kind == Q.InteractionEvent.ELEMENT_MOVING) {
								let datas = evt.datas;
								datas.forEach(function (node) {
									if (node.groupType)
										return;
									if (node.parent)
										return;

									updateZIndex(node, true);
								});
							} else if (evt.kind == Q.InteractionEvent.ELEMENT_MOVE_END) {
								let datas = evt.datas;
								if (evt.event.target.className == "Q-Graph-ScrollPane") {
									datas.forEach(function (node) {
										if (node.groupType)
											return;
										if (node.parent) {
											if (node.parent.name == TYPE_GORUP_TILE) {
												// datas.forEach(snapToTile);
												snapToTile(node);

												var np = from2_5D(node.x, node.y);
												callMoveComplete(TYPE_ADD_TILE, node.name, np.x, np.y);
											}
										} else {
											// var dw = node.size.width/NODE_WIDTH;
											var dw = parseInt(node.properties.w);
											// var dh = node.size.height/NODE_HEIGHT;
											var dh = parseInt(node.properties.h);

											var p = from2_5D(node.x, node.y);

											// var x_offset = (p.x < 0 ? -(GAP - X_OFFSET) : X_OFFSET)*dw;
											// var y_offset = (p.y < 0 ? -(GAP - Y_OFFSET) : Y_OFFSET)*dh;
											// var x_offset = X_OFFSET*dw;
											// var y_offset = Y_OFFSET*dh;
											var x_offset = parseInt(node.properties.ox);
											var y_offset = parseInt(node.properties.oy);
											p.x -= x_offset;
											p.y -= y_offset;

											var gap = GAP / SNAP;
											p.x /= gap;
											p.y /= gap;
											p.x = parseInt(p.x) * gap;
											p.y = parseInt(p.y) * gap;

											var ct = checkTile(p, dw, dh);
											console.log("rfdd : check tile :", checkTileProperty(ct), ct);

											var cn = checkNode(p, dw, dh, node.id);
											console.log("rfdd : check node :", nodes.length, cn);

											if ((/*ct && */checkTileProperty(ct)/* && ct.length >= dw*dh*/) && (!cn)) {
												// datas.forEach(snapToGrid);
												snapToGrid(node);

												var np = from2_5D(node.x, node.y);
												callMoveComplete(getNodeType(node.image), node.name, np.x - x_offset, np.y - y_offset);
											} else {
												// datas.forEach(moveToOrigin);
												moveToOrigin(node);
											}
										}
									});
								} else {
									if ($scope.dropFromDiagram && $scope.unspecifiedListArea) {
										var ula = getParentElement(evt.event.target, $scope.unspecifiedListArea);
										if (ula) {
											datas.forEach(function (node) {
												graph.removeElement(node);
												$scope.dropFromDiagram({id: node.name});
											});
										}
									}
								}
							}
						});
					}

					graph.addCustomInteraction({
						onclick: function(evt, graph){
							console.log("rfdd : click");
							if($scope.mode) {

							} else {
								var ui = graph.getUIByMouseEvent(evt);
								if (ui && ui.data.clickable) {
									console.log("rfdd : click OK");

									var np = from2_5D(ui.data.x, ui.data.y);
									callClickNode(getNodeType(ui.data.image), ui.data.name, np.x - parseInt(ui.data.properties.ox), np.y - parseInt(ui.data.properties.oy), evt);
								}
							}
						},
						ondblclick: function(evt, graph){
							console.log("rfdd : dblclick");
							var ui = graph.getUIByMouseEvent(evt);
							if(ui && ui.data.dblclickable){
								console.log("rfdd : dblclick OK");

								var np = from2_5D(ui.data.x, ui.data.y);
								callDblclickNode(getNodeType(ui.data.image), ui.data.name, np.x-parseInt(ui.data.properties.ox), np.y-parseInt(ui.data.properties.oy));
							}
						}
					});

					// var room = createRoom(width, height);
					var room2 = createRoom2(width, height);

					overview = new Q.Overview($('#overview')[0]);
					overview.setGraph(overview.visible ? graph : null);

					// createEdge(nodes[0], nodes[1], Q.Consts.EDGE_TYPE_ORTHOGONAL_HORIZONTAL);
					// createEdge(nodes[0], nodes[5], Q.Consts.EDGE_TYPE_EXTEND_RIGHT);
				}

				// createGraph(graphWidth, graphHeight);

				// remove
            	function remove() {
            		target.off("remove", remove);
            	}
            	target.on("remove", remove);
            },
            controller: ["$scope", function($scope) {
                // property
            	
            	// method
            	
            	// event-handler
            	
            	// function
            	function initialize() {

            	}

            }] 
        }
    }]);
});