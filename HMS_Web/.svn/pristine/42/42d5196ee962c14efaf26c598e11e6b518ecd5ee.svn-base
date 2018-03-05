define(["app", "apps/common/rackdiagram/rack-model", "apps/common/rackdiagram/node-model"], function(app, Rack, Node) {
    app.directive("rackDiagramDirective", function() {

        return {
            restrict: "E",
            transclude: true,
            scope: {
                data: "=",
                rackHeight: "@",
                addRackComplete: "&",
                addNodeComplete: "&",
                updateRackComplete: "&",
                updateNodeComplete: "&",
                selectRack: "&",
                selectNode: "&",
                external:"="
            },
            link: function postLink($scope, element, attrs, controller) {
                'use strict';

                // constant
                var CATEGORY_NODE = "node"; 
                var CATEGORY_ETC = "etc";
                var CATEGORY_DISABLE = "disable";
                var CATEGORY_RESERVED = "reserved";
                
                var TYPE_BM_SERVER = "001";
                var TYPE_SWITCH = "003";
                var TYPE_STORAGE = "004";
                var TYPE_ETC = "etc";
                var TYPE_BLADE_ENCLOSURE = "009";
                var TYPE_BLADE_SERVER = "010";
                
                var STYLE_MAP = {
                    "001": "node-bm-server",
                    "003": "node-switch",
                    "004": "node-storage",
                    "009": "rack-blade-enclosure",
                    "010": "node-blade-server",
                    "node": "rack-node",
                    "disable": "rack-disable",
                    "reserved": "rack-reserved"
                };
                
                
                // property
                var target = $(element);
                var racks = null;
                var rackUsedMap = [];
                var rackHeight = 42;
                var temporaryRackUserMap = null;
                var selectedItem = null;

                // style-option
                $scope.rackContainerChildMargin = {};
                $scope.rackContainerChildMargin.top = 1;
                $scope.rackContainerChildMargin.bottom = 0;
                $scope.rackContainerChildMargin.left = 1;
                $scope.rackContainerChildMargin.right = 0;

                // method
                $scope.$watch("data", function(value) {
                    racks = angular.copy(value);
                    draw();
                });
                
                $scope.$watch("rackHeight", function(oldValue, newValue) {
                	if (oldValue == newValue) {
                		return;
                	}
                	
                	rackHeight = parseInt(newValue);
                	draw();
                });
                
                $scope.externalControl = $scope.external || {};
                $scope.externalControl.getData = function() {
                	return racks;
                }
                $scope.externalControl.remove = function() {
                	if (!selectedItem) {
                		alert("삭제할 장비를 선택해 주세요.")
                		return;
                	}
                	
                	if (!confirm("정말 삭제하시겠습니까?")) {
                		return;
                	}
                	
                	if (!removeNode(racks, selectedItem)) {
                		return;
                	}
                	
                	draw();
				}

				// function 
				function removeNode(list, target) {
					for (var i=0; i < list.length; i++) {
                        var r = list[i];
                        if (!r) {
                        	continue;
                        }
                        
                        if (r.hardwareCommonId == target.hardwareCommonId) {
                        	list.splice(i, 1);
                        	return true;
                        }
                        
                        if (!r.children) {
                        	continue;
                        }
                        
                    	if (remove(r.children, target)) {
                    		if (r.hwType != TYPE_BLADE_ENCLOSURE) {
                            	list.splice(i, 1);
                    		}
                           	return true;
                    	}
                	}               	
                	
                	return false;
                }
                
                function getPaddingSize(e) {
                    var size = {};
                    size.top = parseInt(e.css("paddingTop"));
                    if (isNaN(size.top)) {
                        size.top = 0;
                    }
                    size.left = parseInt(e.css("paddingLeft"));
                    if (isNaN(size.left)) {
                        size.left = 0;
                    }
                    size.right = parseInt(e.css("paddingRight"));
                    if (isNaN(size.right)) {
                        size.right = 0;
                    }
                    size.bottom = parseInt(e.css("paddingBottom"));
                    if (isNaN(size.bottom)) {
                        size.bottom = 0;
                    }

                    return size;
                }

                function getMarginSize(e) {
                    var size = {};
                    size.top = parseInt(e.css("marginTop"));
                    if (isNaN(size.top)) {
                        size.top = 0;
                    }
                    size.left = parseInt(e.css("marginLeft"));
                    if (isNaN(size.left)) {
                        size.left = 0;
                    }
                    size.right = parseInt(e.css("marginRight"));
                    if (isNaN(size.right)) {
                        size.right = 0;
                    }
                    size.bottom = parseInt(e.css("marginBottom"));
                    if (isNaN(size.bottom)) {
                        size.bottom = 0;
                    }

                    return size;
                }

                function clickableRackGroup(element, data) {
                    element.click(function(e) {
                        var e = $(e.target);
                        if (e.attr("class").indexOf("rack-") == -1) {
                            return;
                        }

                        if ($scope.selectRack) {
                            $scope.selectRack({
                                "rack": data
                            });
                        }
                        
                        target.find(".rack-group").removeClass("rack-group-select");
                        target.find(".node").removeClass("node-select");
                        element.addClass("rack-group-select");
                        
                        selectedItem = data;
                    });
                }

                function draggableRackGroup(element, data) {
                    element.draggable({
                        containment: ".rack-container",
                        cursor: "pointer",
                        revert: true,
                        start: function(event, ui) {
                            temporaryRackUserMap = angular.copy(rackUsedMap);
                            for (var i = 0; i < data.unitSize; i++) {
                                rackUsedMap[data.holeNo + i] = 0;
                            }

                            element.addClass("draggable-rack");
                            element.css("opacity", 0.5);
                            element.css("z-index", 100);
                        },
                        stop: function(event, ui) {
                            element.removeClass("draggable-rack");
                            element.css("opacity", 1);
                            element.css("z-index", 0);
                        }
                    }).data("rack", data);
                }

                function removeGroupOverStyle() {
                    $(".rack-group").removeClass("rack-group-over");
                }

                function isValidswapGroup(source, target) {
                    var t = source.unitSize - target.unitSize;
                    if (target.holeNo + source.unitSize > rackHeight + 1) {
                        return false;
                    }

                    for (var i = 0; i < t; i++) {
                        if (rackUsedMap[target.unitSize + target.holeNo + i] != 0) {
                            return false;
                        }
                    }

                    return true;
                }

                function addGroupOverStyle(element, sourceRack, targetRack) {
                    removeGroupOverStyle();

                    if ((isValidswapGroup(sourceRack, targetRack) && isValidswapGroup(targetRack, sourceRack))) {
                        element.addClass("rack-group-over");
                        return true;
                    }

                    return false;
                }

                function swapGroup(source, target, sourceRack, targetRack) {
                    if ((isValidswapGroup(sourceRack, targetRack) && isValidswapGroup(targetRack, sourceRack))) {
                        var t = targetRack.holeNo;
                        targetRack.holeNo = sourceRack.holeNo;
                        sourceRack.holeNo = t;

                        source.remove();
                        target.remove();

                        drawRack(sourceRack);
                        drawRack(targetRack)

                        if ($scope.updateRackComplete) {
                            $scope.updateRackComplete({
                                "rack": [sourceRack, targetRack]
                            });
                        }

                        return true;
                    }

                    return false;
                }

                function droppableRackGroup(element, data) {
                    element.droppable({
                        accept: ".rack-group",
                        tolerance: "pointer",
                        greedy: true,
                        over: function(event, ui) {
                            var rack = $(ui.draggable).data("rack");
                            addGroupOverStyle(element, rack, data);
                        },
                        out: function(event, ui) {
                            removeGroupOverStyle();
                        },
                        drop: function(event, ui) {
                            removeGroupOverStyle();

                            var rack = $(ui.draggable).data("rack");
                            swapGroup(element, $(ui.draggable), data, rack);
                        }
                    });
                }

                function isValidSwapNode(source, target) {
                    if (source.hwType == target.hwType) {
                        return true;
                    }

                    return false;
                }

                function addNodeOverStyle(element, sourceNode, targetNode) {
                    removeNodeOverStyle();

                    if (isValidSwapNode(sourceNode, targetNode)) {
                        element.addClass("node-over");
                        return true;
                    }

                    return false;
                }

                function removeNodeOverStyle() {
                    $(".node").removeClass("node-over");
                }

                function removeRackByNode(sourceNode) {
                    for (var i = 0; i < racks.length; i++) {
                        var r = racks[i];
                        if (!r || !r.children) {
                            continue;
                        }

                        for (var j = 0; j < r.children.length; j++) {
                            var e = r.children[j];
                            if (e.hardwareCommonId == sourceNode.hardwareCommonId) {
                                r.children.splice(j, 1);
                                return r;
                            }
                        }
                    }

                    return null;
                }

                function swapNode(source, target, sourceNode, targetNode) {
                    if (!isValidSwapNode(sourceNode, targetNode)) {
                        return false;
                    }

                    var sourceRack = removeRackByNode(sourceNode);
                    var targetRack = removeRackByNode(targetNode);

                    var t = targetNode.holeNo;
                    targetNode.holeNo = sourceNode.holeNo;
                    sourceNode.holeNo = t;

                    sourceRack.children.push(targetNode);
                    targetRack.children.push(sourceNode);

                    var sp = source.parent();
                    var tp = target.parent();

                    source.remove();
                    target.remove();

                    drawNode(sourceRack, tp, sourceNode);
                    drawNode(targetRack, sp, targetNode);

                    if ($scope.updateNodeComplete) {
                        $scope.updateNodeComplete({
                            "node": [sp, tp]
                        });
                    }

                    return true;
                }

                function droppableNode(element, data) {
                    element.droppable({
                        accept: ".node",
                        tolerance: "pointer",
                        greedy: true,
                        over: function(event, ui) {
                            var node = $(ui.draggable).data("rack");
                            addNodeOverStyle(element, node, data);
                        },
                        out: function(event, ui) {
                            removeNodeOverStyle();
                        },
                        drop: function(event, ui) {
                            removeNodeOverStyle();

                            var node = $(ui.draggable).data("rack");
                            swapNode(element, $(ui.draggable), data, node);
                        }
                    });
                }

                function draggableNode(element, data) {
                    element.draggable({
                        containment: ".rack-container",
                        cursor: "pointer",
                        revert: true,
                        start: function(event, ui) {
                            element.addClass("draggable-node");
                            element.css("opacity", 0.5);
                            element.css("z-index", 100);
                        },
                        stop: function(event, ui) {
                            element.removeClass("draggable-node");
                            element.css("opacity", 1);
                            element.css("z-index", 0);
                        }
                    }).data("rack", data);
                }

                function clickableNode(element, data) {
                    element.click(function(e) {
                        if ($scope.selectNode) {
                            $scope.selectNode({
                                "node": data
                            });
                        }
                        
                        target.find(".rack-group").removeClass("rack-group-select");
                        target.find(".node").removeClass("node-select");
                        element.addClass("node-select");
                        
                        selectedItem = data;
                    });
                }

                function getNodeSize(rack, rackElement, padding) {
                    var rw = rackElement.outerWidth();
                    var rh = rackElement.outerHeight();

                    rw -= (padding.left + padding.right + padding.left);
                    rh -= (padding.top + padding.bottom + padding.top);
                    
                    var size = {};
                    size.width = rw / rack.horizontal;
                    size.height = rh / rack.vertical;

                    return size;
                }

                function isValidMoveNode(element, node) {
                    var p = element.parent();
                    var index = getNodeLayoutIndex(element);

                    if (p.find("#node-" + index).length > 0) {
                        return false;
                    }

                    var dataId = p.attr("data-id");
                    for (var i = 0; i < racks.length; i++) {
                        var d = racks[i];
                        if (!d) {
                            continue;
                        }

                        if (d.hardwareCommonId != dataId) {
                            continue;
                        }

                        if (d.hwType == TYPE_BLADE_ENCLOSURE && node.hwType == TYPE_BLADE_SERVER) {
                        	return true;
                        }
                        
                        if (d.hwType != node.hwType) {
                            return false;
                        }
                    }

                    return true;
                }

                function getNodeLayoutIndex(element) {
                    return parseInt(element.attr("id").replace("node-layout-", ""));
                }

                function removeNodeLayoutOverStyle(element) {
                    $(".node-layout").removeClass("node-layout-over");
                }

                function addNodeLayoutOverStyle(element, data) {
                    removeNodeLayoutOverStyle(element);

                    if (!isValidMoveNode(element, data)) {
                        return;
                    }

                    element.addClass("node-layout-over");
                }

                function getRackDataById(id) {
                    var d = null
                    for (var i = 0; i < racks.length; i++) {
                        d = racks[i];
                        if (!d) {
                            continue;
                        }

                        if (d.hardwareCommonId == id) {
                            return d;
                        }
                    }

                    return null;
                }

                function moveNode(node, nodeElement, element) {
                    if (!isValidMoveNode(element, node)) {
                        return;
                    }

                    var p = element.parent();
                    var dataId = p.attr("data-id");
                    var target = getRackDataById(dataId);
                    if (!target) {
                        return false;
                    }

                    if (!target || target.hwType != node.hwType) {
                        return false;
                    }

                    var f = 0;
                    for (var i = 0; i < racks.length; i++) {
                        var rack = racks[i];
                        if (!rack || !rack.children) {
                            continue;
                        }

                        for (var j = 0; j < rack.children.length; j++) {
                            if (rack.children[j].hardwareCommonId == node.hardwareCommonId) {
                                rack.children.splice(j, 1);
                                f = 1;
                                break;
                            }
                        }

                        if (f == 1) {
                            break;
                        }
                    }

                    node.holeNo = getNodeLayoutIndex(element);
                    target.children.push(node);

                    nodeElement.remove();
                    drawNode(target, p, node);

                    if ($scope.updateNodeComplete) {
                        $scope.updateNodeComplete({
                            "node": [node]
                        });
                    }

                    return true;
                }

                function addNode(node, element) {
                    var p = element.parent();
                    var dataId = p.attr("data-id");
                    var d = getRackDataById(dataId);

                    if (!d) {
                        return false;
                    }

                    var newNode = angular.copy(node);
                    newNode.holeNo = getNodeLayoutIndex(element);

                    drawNode(d, p, newNode);
                    if (!d.children) {
                    	d.children = [];
                    }
                    d.children.push(newNode);

                    if ($scope.addNodeComplete) {
                        $scope.addNodeComplete({
                            "node": [newNode]
                        });
                    }

                    return true;
                }

                function droppableNodeLayout(element) {
                    element.droppable({
                        accept: ".draggable-node",
                        tolerance: "pointer",
                        greedy: true,
                        over: function(event, ui) {
                            var node = $(ui.draggable).data("rack");
                            addNodeLayoutOverStyle(element, node);
                        },
                        out: function(event, ui) {
                            removeNodeLayoutOverStyle(element);
                        },
                        drop: function(event, ui) {
                            removeNodeLayoutOverStyle(element);

                            var node = $(ui.draggable).data("rack");
                            if ($(ui.draggable).attr("class").indexOf("node-") == -1) {
                                addNode(node, element);
                            } else {
                                moveNode(node, ui.draggable, element);
                            }
                        }
                    });
                }

                function getRackLayoutIndex(element) {
                    return parseInt(element.attr("id").replace("rack-space-", ""));
                }

                function removeRackLayoutOverStyle() {
                    $(".rack-container").find(".rack-space").removeClass("rack-space-over");
                }

                function isValidRackLayout(rack) {
                    if (rack.unitSize + rack.holeNo > rackHeight + 1) {
                        return false;
                    }

                    for (var i = 0; i < rack.unitSize; i++) {
                        if ((rackUsedMap[rack.holeNo + i] == 1) ||
                            (rackUsedMap[rack.holeNo + i] == 0.5 && rack.width == 1) ||
                            (rackUsedMap[rack.holeNo + i] == 1 && rack.width == 0.5)) {
                            return false;
                        }
                    }

                    for (var i = 0; i < racks.length; i++) {
                        var r = racks[i];
                        if (!r || r.hardwareCommonId == rack.hardwareCommonId) {
                            continue;
                        }

                        if ((r.holeNo <= rack.holeNo && rack.holeNo <= r.unitSize + r.holeNo) || (rack.holeNo <= r.holeNo && r.holeNo <= rack.unitSize + rack.holeNo)) {
                            if (r.align == rack.align && rack.align != "") {
                                return false;
                            }
                        }
                    }

                    return true;
                }

                function addRackLayoutOverStyle(element, rack) {
                    removeRackLayoutOverStyle();

                    var index = getRackLayoutIndex(element);
                    if (rack.unitSize + index > rackHeight + 1) {
                        return;
                    }

                    for (var i = 0; i < rack.unitSize; i++) {
                        if ((rackUsedMap[index + i] == 1) ||
                            (rackUsedMap[index + i] == 0.5 && rack.width == 1) ||
                            (rackUsedMap[index + i] == 1 && rack.width == 0.5)) {
                            removeRackLayoutOverStyle();
                            return;
                        }

                        $("#rack-space-" + (index + i)).addClass("rack-space-over");
                    }

                    for (var i = 0; i < racks.length; i++) {
                        var r = racks[i];
                        if (!r || r.hardwareCommonId == rack.hardwareCommonId) {
                            continue;
                        }

                        if ((r.holeNo <= index && index <= r.unitSize + r.holeNo) || (index <= r.holeNo && r.holeNo <= rack.unitSize + index)) {
                            if (r.align == rack.align && rack.align != "") {
                                removeRackLayoutOverStyle();
                                return;
                            }
                        }
                    }
                }

                function addRack(rack, index) {
                    if (!racks) {
                        racks = [];
                    }

                    var newRack = angular.copy(rack);
                    newRack.holeNo = index;

                    if (!isValidRackLayout(newRack)) {
                        console.error("Invalid add rack:", newRack);
                        return false;
                    }

                    racks.push(newRack);
                    drawRack(newRack);

                    if ($scope.addRackComplete) {
                        $scope.addRackComplete({
                            "rack": [newRack]
                        });
                    }

                    return true;
                }

                function moveRack(rack, rackElement, index) {
                    var oldIndex = rack.holeNo;
                    rack.holeNo = index;

                    if (!isValidRackLayout(rack)) {
                        console.error("Invalid move rack:", rack);
                        rack.holeNo = oldIndex;
                        rackUsedMap = angular.copy(temporaryRackUserMap);
                        return false;
                    }

                    $(rackElement).remove();
                    drawRack(rack);

                    if ($scope.updateRackComplete) {
                        $scope.updateRackComplete({
                            "rack": [rack]
                        });
                    }

                    return true;
                }

                function ignoredroppableRackSpace(e) {
                    if (e.attr("class").indexOf("rack-group") > -1) {
                        return true;
                    }

                    return false;
                }

                function droppableRackSpace(element) {
                    element.droppable({
                        accept: ".draggable-rack",
                        tolerance: "intersect",
                        greedy: true,
                        over: function(event, ui) {
                            if (ignoredroppableRackSpace($(event.target))) {
                                return;
                            }

                            var rack = $(ui.draggable).data("rack");
                            addRackLayoutOverStyle(element, rack);
                        },
                        out: function(event, ui) {
                            removeRackLayoutOverStyle();
                        },
                        drop: function(event, ui) {
                            removeRackLayoutOverStyle();

                            if (ignoredroppableRackSpace($(event.target))) {
                                return;
                            }

                            var rack = $(ui.draggable).data("rack");

                            if ($(ui.draggable).attr("class").indexOf("rack-") == -1) {
                                addRack(rack, getRackLayoutIndex(element));
                            } else {
                                moveRack(rack, ui.draggable, getRackLayoutIndex(element));
                            }
                        }
                    });
                }
                
                function drawNode(rack, rackElement, node) {
                    var index = 1;
                    for (var i = 0; i < rack.vertical; i++) {
                        for (var j = 0; j < rack.horizontal; j++) {
                            if (node.holeNo == index) {
                                var nl = rackElement.find("#node-layout-" + index);
                                var n = $('<div class="node ' + STYLE_MAP[node.hwType] + '" id="node-' + node.holeNo + '" data-id="' + node.hardwareCommonId + '" style="position:absolute;">' + node.hwName + '<button type="button" class="ico-md i-" title="삭제"></button></div>');
                                rackElement.append(n);

                                n.outerHeight(nl.outerHeight());
                                n.outerWidth(nl.outerWidth());
                                n.offset(nl.offset());

                                clickableNode(n, node);
                                
                                if (node.hwType == TYPE_BLADE_SERVER) {
	                                draggableNode(n, node);
	                                droppableNode(n, node);
                                }
                                
                                return;
                            }
                            index++;
                        }
                    }
                }
                
                function drawNodeLayout(rack, rackElement) {
                	if (rack.rackColumnName == CATEGORY_DISABLE || rack.rackColumnName == CATEGORY_RESERVED) {
                		return false;
                	}
                    
                    var padding = getPaddingSize(rackElement);
                    var nodeSize = getNodeSize(rack, rackElement, padding);
                    
                    var x = 0;
                    var y = 0;
                    var index = 1;
                    for (var i = 0; i < rack.vertical; i++) {
                        for (var v = 0; v < rack.horizontal; v++) {
                            var n = $('<div class="node-layout" id="node-layout-' + index + '" style="position:absolute;"></div>');
                            n.outerHeight(nodeSize.height - $scope.rackContainerChildMargin.top + $scope.rackContainerChildMargin.bottom);
                            n.outerWidth(nodeSize.width - $scope.rackContainerChildMargin.left + $scope.rackContainerChildMargin.right);
                            rackElement.append(n);
                            
                            n.css("left", (x * nodeSize.width + padding.left) + "px");
                            n.css("top", (y * nodeSize.height + padding.top) + "px");
                            
                            droppableNodeLayout(n);

                            x++;
                            index++;
                        }
                        x = 0;
                        y += 1;
                    }
                    
                    return true;
                }
                
                function drawGroup(rack) {
                    var t = $("#rack-space-" + (rack.holeNo + rack.unitSize - 1));
                    var h = (t.outerHeight() * rack.unitSize) + ($scope.rackContainerChildMargin.top * (rack.unitSize - 1));
                    var w = t.outerWidth() * rack.width;
                    var top = t.offset().top;
                    var left = t.offset().left;

                    var className = STYLE_MAP[rack.rackColumnName];
                    if (rack.rackColumnName != CATEGORY_DISABLE && rack.rackColumnName != CATEGORY_RESERVED && rack.hwType == TYPE_BLADE_ENCLOSURE) {
                    	className = STYLE_MAP[TYPE_BLADE_ENCLOSURE];
                    }

                    var r = $('<div class="rack-group ' + className + '" id="rack-' + rack.holeNo + '" data-id="' + rack.hardwareCommonId + '" style="position:absolute;"></div>');
                    target.append(r);

                    r.outerHeight(h);
                    r.outerWidth(w);

                    if (rack.align == "right") {
                        left = (left + t[0].offsetWidth) - w;
                        r.css("border-left", r.css("border-right"));
                    }
                    r.offset({
                        'top': top,
                        'left': left
                    });

                	//if (rack.hwType == TYPE_BLADE_ENCLOSURE) {
                		clickableRackGroup(r, rack);
                	//}
                	draggableRackGroup(r, rack);
                	droppableRackGroup(r, rack);

                    return r;
                }
                
                function drawRack(rack) {
                    var rackElement = drawGroup(rack);
                    for (var i = 0; i < rack.unitSize; i++) {
                        rackUsedMap[rack.holeNo + i] = 1;
                        if (rack.width == 0.5) {
                            rackUsedMap[rack.holeNo + i] = 0.5;
                        }
                    }

                    if (!drawNodeLayout(rack, rackElement)) {
                    	return;
                    }
                    
                    if (!rack.children) {
                    	if (rack.hwType != TYPE_BLADE_ENCLOSURE) {
                        	var newRack = angular.copy(rack);
                        	newRack.holeNo = 1;
                        	
                        	drawNode(rack, rackElement, newRack);	
                    	}
                    } else {
                        for (var z = 0; z < rack.children.length; z++) {
                        	drawNode(rack, rackElement, rack.children[z]);
                        }                    	
                    }
                }
                
                function drawContainer() {
                    var parentHeight = target.height();
                    var parentWidth = target.width();

                    var rc = $('<div id="rack-diagram" class="rack-container" style="position: absolute"></div>');
                    rc.height(parentHeight);
                    rc.width(parentWidth);
                    target.append(rc);

                    var parentPaddingSize = getPaddingSize(rc);
                    var numberingWidth = 36;
                    var rackWidth = rc.width() - numberingWidth;
                    var containerHeight = (rc.height()) / rackHeight;

                    for (var i = 0; i < rackHeight; i++) {
                        var nt = containerHeight * i + parentPaddingSize.top;
                        var nl = parentPaddingSize.left;
                        var n = $('<div class="rack-container-child rack-numbering" style="position: absolute">' + (rackHeight - i) + '</div>');
                        n.width(numberingWidth - $scope.rackContainerChildMargin.left + $scope.rackContainerChildMargin.right);
                        n.height(containerHeight - $scope.rackContainerChildMargin.top + $scope.rackContainerChildMargin.bottom);
                        n.css("top", nt + "px");
                        n.css("left", nl + "px");
                        rc.append(n);

                        var rt = containerHeight * i + parentPaddingSize.top;
                        var rl = numberingWidth + parentPaddingSize.left
                        var c = $('<div class="rack-container-child rack-space" id="rack-space-' + (rackHeight - i) + '" style="position: absolute"></div>');
                        c.width(rackWidth - $scope.rackContainerChildMargin.left + $scope.rackContainerChildMargin.right);
                        c.height(containerHeight - $scope.rackContainerChildMargin.top + $scope.rackContainerChildMargin.bottom);
                        c.css("top", rt + "px");
                        c.css("left", rl + "px");
                        rc.append(c);

                        rackUsedMap[i + 1] = 0;
                        droppableRackSpace(c);
                    }
                    
                    rc.click(function(e) {
                        target.find(".rack-group").removeClass("rack-group-select");
                        target.find(".node").removeClass("node-select");
                        selectedItem = null;
                    });
                }

                function draw() {
                    release();

                    drawContainer();

                    if (racks) {        
	                    for (var i = 0; i < rackHeight; i++) {
	                        var rack = null;
	                        for (var j = 0; j < racks.length; j++) {
	                            if (racks[j].holeNo == i + 1) {
	                                rack = racks[j];
	                                break;
	                            }
	                        }
	
	                        if (rack) {
	                            drawRack(rack);
	                        }
	                    }
                    }
                    
                }

                function release() {
                    var children = target.children();
                    for (var i = 0; i < children.length; i++) {
                        $(children[i]).remove();
                    }

                    rackUsedMap = [];
                }

                function remove() {
                    target.off("remove", remove);
                    release();
                    
                    $(window).off("resize-layout-complete");
                }
                target.on("remove", remove);

                $(window).on("resize-layout-complete", function() {
                    console.log("REDRAW RACK-CONTAINER");
                    draw();
                });
                
                draw();
            }
        }
    });
});