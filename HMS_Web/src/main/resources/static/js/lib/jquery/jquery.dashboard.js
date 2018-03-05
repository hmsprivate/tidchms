/**
  Copyright (c) <2015> <SeJong, Park (rhcpn@mobigen.com)>, <Mobigen.com>

  jquery.dashboard.js
  
 require
      jquery 2.x
  
  history
    2015/10/28  최초생성
    2015/11/19  tile을 사용 할 경우, 열의 높이 출력 방식 결정 옵션 추가
    2015/12/01  free / column 레이아웃 기능 추가
    2016/10/27 일부 javascript 컴포넌트들 중에 layout attribute를 사용하는 경우가 있어서, 옵션으로 바꿀수 있도록 처리
    
  version
    2015/10/28  0.8
    2015/11/19  1.0
    2015/12/01  1.1
    2016/10/27  1.2
    
  option
    layout: 대시보드 출력 방식 (vertical/horizontal/title)
    verticalAlign: 세로 정렬 방식 (top/bottom/middle)
    horizontalAlign: 가로 정렬 방식 (left/right/center)
    gap: panel간의 간격
    resizeGrid: 패널 resize 시, snap 단위 
    minWidth: 대시보드 최소 너비
    minHeight: 대시보드 최소 높이
    maxWidth: 대시보드 최대 너비
    maxHeight: 대시보드 최대 높이
    panelWidth: 패널 기본 너비
    panelHeight: 패널 기본 높이
    rowHeight: 대시보드가 tile 방식으로 출력 시, 열의 높이 (none/size(실제크기))
    animate: 대시보드 창 이동시, animation 효과 여부
    
  method
    addPanelByHtml(id, html, width, height, dragHandle, resizeHandle): 대시보드에 창을 추가함
        id: 패널 아이디
        html: 패널 내에 위치할 html
        width: 너비
        height: 높이
        dragHandle: drag-class
        resizeHandle: resize-class
        
    removePanel(id): 창을 삭제
        id: 패널 아이디
        
    changeModeToView(): 보기 모드로 전환
    
    changeModeToEdit(): 수정 모드로 전환
    
    changeScale(scale): 화면 비율을 변경
    
    getData(): 현재 대시보드 내용을 Object 형태로 반환
    
    toString(): 현재 대시보드 내용을 json 형태로 반환
**/
;
(function($) {
    $.fn.extend({
        dashboard: function(options) {
            "use strict";
            
            var PROPERTY_LAYOUT = "layout";
            
            var LAYOUT_FREE = "";
            var LAYOUT_TILE = "tile";
            var LAYOUT_COLUMN = "column";
            var ALIGN_VERTICAL_TOP = "top";
            var ALIGN_HORIZONTAL_LEFT = "left";

            var ZINDEX_DEFAULT = 100;
            var DEFAULT_ORDER = 100;

            var DEFAULT_MAX_WIDTH = 1280;
            var DEFAULT_MAX_HEIGHT = 1024;
            var DEFAULT_WIDTH = 400;
            var DEFAULT_HEIGHT = 200;

            var CLASS_PANEL = "dashboard-panel";
            var CLASS_DEFAULT_PANEL = "dashboard-default-panel";
            var CLASS_PANEL_SELECT = "dashboard-panel-select";
            var CLASS_DRAG_PANEL_BACKGROUND = "dashboard-drag-panel-background";

            var EVENT_RESIZE = "dashboard-resize";
            var EVENT_REPOSITION = "dashboard-REPOSITION";

            var baseContainer = null;
            var currentContainer = null;
            var currentContainerId = "";
            var dragBackgroundContainer = null;

            var selectedPanel = null;

            var panelOrderList = [];

            var isEditable = true;
            var currentScale = 1;

            var currentLayout = LAYOUT_TILE;

            this.defaultOptions = {
                layout: LAYOUT_TILE,
                verticalAlign: ALIGN_VERTICAL_TOP,
                horizontalAlign: ALIGN_HORIZONTAL_LEFT,
                gap: 5,
                resizeGrid: 5,
                maxWidth: DEFAULT_MAX_WIDTH,
                maxHeight: DEFAULT_MAX_HEIGHT,
                panelWidth: DEFAULT_WIDTH,
                panelHeight: DEFAULT_HEIGHT,
                animate: true
            };

            var settings = $.extend({}, this.defaultOptions, options);

            function getDefaultPanelOrder() {
                var order = 1;
                for (var key in panelOrderList) {
                    if (order < panelOrderList[key]) {
                        order = panelOrderList[key];
                    }
                }

                return order + DEFAULT_ORDER;
            }

            function setPanelSize(panel, width, height) {
                if (!panel) {
                    return;
                }

                if (!width || width == 0) {
                    width = settings.panelWidth;
                }

                if (!height || height == 0) {
                    height = settings.panelHeight;
                }

                panel.attr("width", width + "px");
                panel.attr("height", height + "px");

                if (currentLayout == LAYOUT_TILE) {
                    var rowNumber = panel.attr("row-number");
                    var rows = $("[row-number='" + rowNumber + "']");
                    var maxHeight = parseFloat(panel.attr("height"));
                    for (var i = 0; i < rows.length; i++) {
                        if (parseFloat($(rows[i]).attr("height")) > maxHeight) {
                            maxHeight = parseFloat($(rows[i]).attr("height"))
                        }
                    }

                    panel.attr("height", maxHeight + "px");
                }
            }

            function setFocus(panel) {
                var children = currentContainer.children();
                if (!children) {
                    return;
                }

                var sum = 0;
                for (var i = 0, l = children.length; i < l; i++) {
                    var child = $(children[i]);
                    var order = child.attr("order");
                    if (!order) {
                        order = DEFAULT_ORDER;
                    }

                    child.css("z-index", parseInt(order) + parseInt(ZINDEX_DEFAULT));
                    sum += parseInt(order);
                }

                panel.css("z-index", sum);
            }

            function makeDragBackgroundPanel(panel) {
                if (!dragBackgroundContainer) {
                    var t = ["<div id='dashboard-drag-background-container' ",
                        "class='",
                        CLASS_DRAG_PANEL_BACKGROUND,
                        "'></div>"
                    ];

                    dragBackgroundContainer = $(t.join(""));
                    currentContainer.append(dragBackgroundContainer);
                }

                dragBackgroundContainer.outerWidth(panel.outerWidth());
                dragBackgroundContainer.outerHeight(panel.outerHeight());
                
                var css = {
                      "position": "absolute", 
                      "left": panel.css("left"), 
                      "top":panel.css("top")
                };
                
                dragBackgroundContainer.css(css);
                dragBackgroundContainer.show();
            }

            function removeDragBackgroundPanel() {
                if (dragBackgroundContainer) {
                    dragBackgroundContainer.remove();
                    dragBackgroundContainer = null;
                }
            }

            function draggablePanel(panel, handle) {
                panel.draggable({
                    containment: currentContainer,
                    scroll: true,
                    cursor: "move",
                    revert: "invalid",
                    start: function(event, ui) {
                        setFocus(panel);

                        if (currentLayout != LAYOUT_FREE) {
                            makeDragBackgroundPanel(panel);
                        }
                    },
                    stop: function(event, ui) {
                        removeDragBackgroundPanel(panel);
                    }
                });
            }

            function reorder() {
                panelOrderList = [];
                var children = currentContainer.children();
                for (var i = 1; i < children.length; i++) {
                    var t = $(children[i]);
                    panelOrderList[t.attr("id")] = parseInt(t.attr("order"));
                }
            }

            function droppablePanel(panel) {
                panel.droppable({
                    accept: "." + CLASS_PANEL + ", ." + CLASS_PANEL_SELECT,
                    tolerance: "intersect",
                    greedy: true,
                    over: function(event, ui) {
                        panel.css("opacity", 0.5);
                    },
                    out: function(event, ui) {
                        panel.css("opacity", 1);
                    },
                    drop: function(event, ui) {
                        panel.css("opacity", 1);

                        var o = panel.attr("order");
                        panel.attr("order", ui.draggable.attr("order"));
                        ui.draggable.attr("order", o);
                        reorder();

                        panel.trigger(EVENT_REPOSITION);
                        $.invalidLayout(currentContainerId);
                    }
                });
            }

            function resizablePanel(panel, handle) {
                if (!handle) {
                    handle = "se";
                }

                panel.resizable({
                    minWidth: settings.panelWidth,
                    minHeight: settings.panelHeight,
                    delay: 150,
                    grid: settings.resizeGrid,
                    containment: currentContainer,
                    handles: handle,
                    helper: "ui-resizable-helper",
                    start: function(event, ui) {
                        setFocus(panel);
                        var css = {
                            "z-index": 999999999999,
                            "transform": "scale(" + currentScale + ")",
                            "transform-origin": "left top"        
                        };
                        
                        ui.helper.css(css)
                    },
                    stop: function(event, ui) {
                        var width = ui.helper.outerWidth();
                        var height = ui.helper.outerHeight();
                        var left = ui.helper.offset().left;
                        var top = ui.helper.offset().top;

                        if (width + left > currentContainer.innerWidth() + currentContainer.offset().left) {
                            width = currentContainer.innerWidth() - settings.gap * 2;
                        }
                        if (height + top > currentContainer.innerHeight() + currentContainer.offset().top) {
                            height = currentContainer.innerHeight() - settings.gap * 2;
                        }

                        panel.attr("width", width + "px");
                        panel.attr("height", height + "px");
                        
                        var css = {
                            "left": left - currentContainer.offset().left,
                            "top": top - currentContainer.offset().top
                        };
                        panel.css(css);

                        if (currentLayout == LAYOUT_TILE) {
                            $.validLayout(currentContainerId);

                            var rowNumber = panel.attr("row-number");
                            var rows = $("[row-number='" + rowNumber + "']");
                            for (var i = 0; i < rows.length; i++) {
                                $(rows[i]).attr("height", height + "px");
                            }
                        }

                        $.invalidLayout(currentContainerId);

                        baseContainer.trigger(EVENT_RESIZE, {
                            "id": ui.element.attr("id"),
                            "width": width,
                            "height": height
                        });
                    }
                });
            }

            function clickablePanel(panel) {
                panel.click(function() {
                    if (isEditable) {
                        selPanel(panel);
                        setFocus(panel);
                    }
                })
            }

            function selPanel(panel) {
                $("." + CLASS_PANEL).css("z-index", ZINDEX_DEFAULT);

                if (!isEditable) {
                    return;
                }

                var children = currentContainer.children();
                var id = "";
                if (panel) {
                    id = panel.attr("id");
                }

                for (var i = 0; i < children.length; i++) {
                    var child = $(children[i]);
                    if (id == child.attr("id")) {
                        child.addClass(CLASS_PANEL_SELECT);
                        selectedPanel = child;
                    } else {
                        child.removeClass(CLASS_PANEL_SELECT);
                    }
                }
            }

            function getPanel(id, html, x, y, width, height, order) {
                if (!order || order == 0) {
                    order = (currentContainer.children().length + 1) * DEFAULT_ORDER;
                }

                var panel = $("<div>" + html + "</div>");
                panel.attr("id", id);
                panel.attr("class", CLASS_PANEL + " " + "ui-widget-content");
                panel.attr("order", order);
                
                var css = {
                    "position": "absolute"  
                }
                
                if (currentLayout == LAYOUT_FREE) {
                    if (!y || y == "" || y < 0)
                        y = 0;
                    if (!x || x == "" || x < 0)
                        x = 0;

                    css.top = y + "px";
                    css.left = x + "px";
                }

                panel.css(css);
                
                panelOrderList.push(id);
                currentContainer.append(panel);
                setPanelSize(panel, width, height);
                
                return panel;
            }

            function getDefaultPanel(id, html, width, height) {
                var panel = $("<div>" + html + "</div>");
                panel.attr("id", id);
                panel.attr("class", CLASS_DEFAULT_PANEL);
                panel.attr("order", 999999999);

                panelOrderList.push(id);

                currentContainer.append(panel);

                setPanelSize(panel, width, height);
                return panel;
            }

            function getDashboardData() {
                var data = {
                    layout: currentContainer.attr("layout")
                }

                return data;
            }

            function getPanelData() {
                var list = currentContainer.children();
                if (!list || list.length == 0) {
                    return null;
                }

                var data = [];
                for (var i = 0; i < list.length; i++) {
                    var p = $(list[i]);
                    var panel = {
                        id: p.attr("id"),
                        width: parseInt(p.css("width")),
                        height: parseInt(p.css("height")),
                        layoutWidth: parseInt(p.attr("width")),
                        layoutHeight: parseInt(p.attr("height")),
                        top: parseInt(p.css("top")),
                        left: parseInt(p.css("left")),
                        order: p.attr("order")
                    }

                    data.push(panel);
                }

                return data;
            }

            function initialize(container) {
                baseContainer = container;
                currentContainerId = "dashboard-current-container";

                currentContainer = $("<div></div>");
                currentContainer.attr(PROPERTY_LAYOUT, "tile");
                currentContainer.attr("width", "100%");
                currentContainer.attr("height", "100%");
//                currentContainer.attr("width", settings.maxWidth + "px");
//                currentContainer.attr("height", settings.maxHeight + "px");
                currentContainer.attr("scrollbar-policy", "off");
                currentContainer.attr("vertical-align", settings.verticalAlign);
                currentContainer.attr("horizontal-align", settings.horizontalAlign);
                currentContainer.attr("id", currentContainerId);
                currentContainer.attr("gap", settings.gap + "px");
                currentContainer.attr("animate", settings.animate);

                currentContainer.click(function(event) {
                    if ($(event.target).attr("id") == currentContainer.attr("id")) {
                        selPanel();
                    }
                });

                baseContainer.append(currentContainer);

                currentLayout = settings.layout;
                if (currentLayout == LAYOUT_FREE) {
                    changeLayoutToFree();
                } else if (currentLayout == LAYOUT_COLUMN) {
                    changeLayoutToColumn();
                } else if (currentLayout == LAYOUT_TILE) {
                    changeLayoutToTile();
                }
            }


            // public-method
            function addPanelByHtml(id, html, x, y, width, height, order, dragHandle, resizeHandle) {
                var panel = getPanel(id, html, x, y, width, height, order);

                draggablePanel(panel, dragHandle);
                droppablePanel(panel);
                resizablePanel(panel, resizeHandle);
                clickablePanel(panel);

                if (currentLayout == LAYOUT_COLUMN) {
                    panel.resizable("disable");
                    $(".ui-resizable-handle").css("display", "none");
                }

                if (currentLayout == LAYOUT_FREE) {
                    panel.draggable("option", "revert", false);
                }

                $.invalidLayout(currentContainerId);

                return panel;
            }

            function selectPanel(id) {
                var panel = $("#" + id);
                selPanel(panel);
            }

            function removePanel(id) {
                var panel = $("#" + id);
                if (!panel) {
                    return;
                }

                panel.remove();
                $.invalidLayout(currentContainerId);
            }

            function removeAll() {
                panelOrderList = [];
                var children = currentContainer.children();
                for (var i = 0; i < children.length; i++) {
                    $(children[i]).remove();
                }
            }

            function setDashboardSize(width, height, unit) {
                currentContainer.attr("width", width + unit);
                currentContainer.attr("height", height + unit);
            }

            function getData() {
                var panels = getPanelData();
                var dashboard = getDashboardData();
                dashboard.panels = panels;

                return dashboard;
            }

            function toString() {
                return JSON.stringify(getData());
            }

            function changeModeToView() {
                $("." + CLASS_PANEL_SELECT).removeClass(CLASS_PANEL_SELECT, "");

                $("." + CLASS_PANEL).draggable("disable");
                $("." + CLASS_PANEL).resizable("disable");
                $(".ui-resizable-handle").css("display", "none");

                isEditable = false;
            }

            function changeModeToEdit() {
                $("." + CLASS_PANEL).draggable("enable");
                $("." + CLASS_PANEL_SELECT).draggable("enable");

                if (currentLayout != LAYOUT_COLUMN) {
                    $("." + CLASS_PANEL).resizable("enable");
                    $("." + CLASS_PANEL_SELECT).resizable("enable");
                    $(".ui-resizable-handle").css("display", "inline-block");
                }

                isEditable = true;
            }

            function changeLayoutToFree() {
                $("." + CLASS_PANEL).draggable("option", "revert", false);
                $("." + CLASS_PANEL).droppable("disable");
                $("." + CLASS_PANEL).resizable("enable");
                $("." + CLASS_PANEL_SELECT).draggable("option", "revert", false);
                $("." + CLASS_PANEL_SELECT).droppable("disable");
                $("." + CLASS_PANEL_SELECT).resizable("enable");

                if (isEditable) {
                    $(".ui-resizable-handle").css("display", "inline-block");
                }

                currentContainer.removeAttr(PROPERTY_LAYOUT);
                currentLayout = LAYOUT_FREE;

                var children = currentContainer.children();
                if (!children) {
                    return;
                }

                for (var i = 0, l = children.length; i < l; i++) {
                    var child = $(children[i]);
                    child.attr("width", child.outerWidth() + "px");
                    child.attr("height", child.outerHeight() + "px");
                }

                $.invalidLayout(currentContainerId);
            }

            function changeLayoutToTile() {
                $("." + CLASS_PANEL).draggable("option", "revert", "invalid");
                $("." + CLASS_PANEL).droppable("enable");
                $("." + CLASS_PANEL).resizable("enable");
                $("." + CLASS_PANEL_SELECT).draggable("option", "revert", "invalid");
                $("." + CLASS_PANEL_SELECT).droppable("enable");
                $("." + CLASS_PANEL_SELECT).resizable("enable");

                if (isEditable) {
                    $(".ui-resizable-handle").css("display", "inline-block");
                }

                $("." + CLASS_PANEL).attr("width", settings.panelWidth + "px");
                $("." + CLASS_PANEL).attr("height", settings.panelHeight + "px");
                $("." + CLASS_PANEL_SELECT).attr("width", settings.panelWidth + "px");
                $("." + CLASS_PANEL_SELECT).attr("height", settings.panelHeight + "px");

                currentContainer.attr(PROPERTY_LAYOUT, LAYOUT_TILE);
                currentLayout = LAYOUT_TILE;

                $.invalidLayout(currentContainerId);
            }

            function changeLayoutToColumn(cols) {
                $("." + CLASS_PANEL).draggable("option", "revert", "invalid");
                $("." + CLASS_PANEL).resizable("disable");
                $("." + CLASS_PANEL_SELECT).draggable("option", "revert", "invalid");
                $("." + CLASS_PANEL_SELECT).resizable("disable");
                $(".ui-resizable-handle").css("display", "none");

                currentContainer.attr(PROPERTY_LAYOUT, LAYOUT_COLUMN);
                if(cols) {
                	currentContainer.attr("column-number", cols);
                }

                currentLayout = LAYOUT_COLUMN;

                $.invalidLayout(currentContainerId);
            }

            function changeScale(scale) {
                if (!currentContainer) {
                    return;
                }

                currentScale = scale;
                currentContainer.css("transform", "scale(" + scale + ")");
                currentContainer.css("transform-origin", "left top");
            }

            function getScale() {
                return currentScale;
            }

            // entry-point
            if (!$.dashboard) {
                $.dashboard = this;
                $.dashboard.fn = {
            		initialize:initialize,
                    addPanelByHtml: addPanelByHtml,
                    selectPanel: selectPanel,
                    removePanel: removePanel,
                    removeAll: removeAll,
                    changeModeToView: changeModeToView,
                    changeModeToEdit: changeModeToEdit,
                    changeLayoutToFree: changeLayoutToFree,
                    changeLayoutToTile: changeLayoutToTile,
                    changeLayoutToColumn: changeLayoutToColumn,
                    changeScale: changeScale,
                    getScale: getScale,
                    setDashboardSize: setDashboardSize,
                    getData: getData,
                    toString: toString
                };
                // 외부에서 호출하는것으로 변경
              //  initialize($(this[0]));
            }

            $(window).on("resize-layout-complete", function() {
                if (!currentContainer) {
                    return;
                }

                var children = currentContainer.children();
                var bm = 0;
                for (var i = 0, l = children.length; i < l; i++) {
                    var b = $(children[i]).outerHeight() + $(children[i]).offset().top - currentContainer.offset().top;
                    if (b > bm)
                        bm = b;
                }

                var parentHeight = baseContainer.outerHeight();
                if (bm > parentHeight) {
                    currentContainer.attr("height", bm + "px");
                } else {
                    currentContainer.attr("height", "100%");
                }
            });
            
            // namespae
            if (settings.namespace) {
            	var namespace = settings.namespace;
            	if(namespace.layout) {
            		PROPERTY_LAYOUT = namespace.layout;
            	}
            }
            
            // public-method
            return $.dashboard.fn;
        }
    });
})(jQuery);