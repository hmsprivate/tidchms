/**
  Copyright (c) <2015> <SeJong, Park (rhcpn@mobigen.com)>, <Mobigen.com>

  jquery.layout.js
  
  require
      jquery 2.x
      
  history
    2015/02/15  최초생성
    2015/02/17  resize 시 자동으로 크기 및 레이아웃 정렬 기능 추가
    2015/02/23  크기 변경 버그 수정
    2015/02/26  각각의 레이아웃 마다 개별적으로 gap을 설정 할 수 있는 기능 추가
    2015/02/27  resize가 끝나면 resizeLayout 이벤트를 발생 시키는 기능 추가
    2015/03/02  기준 컨테이너에 고정 사이즈를 (px) 줄 수 있는 기능 추가
    2015/03/03  horizontal-align, vertical-align 기능 추가
                   horizontal-scrollbar-policy, vertical-scrollbar-policy 기능 추가
    2015/03/10  base 크기를 window 크기로 지정 하도록 수정
    2015/04/02  resizeInterval 옵션 추가 (단위는 ms)
    2015/04/17  min-width, min-height 추가
    2015/04/22  스크롤바 정책 적용 시, 브라우저의 auto를 따르지 않고 부모창 아래 자식들의 크기가 클때만
                   스크롤바 정책이 적용되도록 수정
    2015/05/14  window 에서 resize 이벤트 수신 시, target container가 따로 지정되어 있는 경우, 해당
                   컨테이너의 레이아웃만 변경 되도록 수정
                   invalidLayout / validLayout 함수에서 ID를 지정하였을 경우, 해당 창만을 갱신하는 기능 추가
    2015/05/19  use-layout 옵션을 추가함
    2015/06/22  layout의 tile 기능을 추가 (col 설정만 가능)
    2015/08/04  footer가 존재할 경우, footer 위치를 가장 아래 위치 시키고, base-container에 해당 크기 반영
                   scrollbar-policy 속성 추가
    2015/08/06  layout의 base-container 초기화 시, excludes 목록의 객체는 크기 및 위치 계산에서 제외함
    2015/08/07  성능개선
    2015/08/26  padding-left/right/top/bottom 속성을 추가
    2015/10/26  tile 레이아웃 인 경우에, row의 높이에 따라 요소의 top 위치를 껴맞추도록 수정
                   order 속성 추가
                   animate 속성 추가
    2016/04/19  코드 정리
                   일부 JQuery 코드를 Javascript Native 로 바꿈
                   성능개선
    2016/05/16 사이즈, 포지션에 관련된 코드를 전부 css 변경 하는 방식으로 변경
    2016/07/04 일부 scale이 먹힌 container의 position 위치가 실제 크기를 반영 못하는 문제가 있어서, 
                  강제로 vertical-position-scale / horizontal-position-scale 속성을 주어
                  위치 정보 계산을 scale에 따라 바꿀 수 있도록 처리
    2016/10/27 일부 javascript 컴포넌트들 중에 layout attribute를 사용하는 경우가 있어서, 옵션으로 바꿀수 있도록 처리
    2017/03/21 column layout 일때, column merge 기능을 추가
                
  version
    2015/02/15  0.5
    2015/03/03  1.0
    2015/04/02  1.1
    2015/04/17  1.2
    2015/04/22  1.2.1
    2015/05/14  1.3
    2015/05/14  1.4
    2015/05/19  1.4.1
    2015/06/22  1.5
    2015/08/04  1.5.1
    2015/08/06  1.5.2
    2015/08/07  1.5.3
    2015/08/26  1.6
    2015/10/26  1.7
    2016/04/19  1.7.1
    2016/05/16  1.7.2
    2016/07/04  1.8
    2016/10/27  1.8.1
    2017/03/21  1.8.5

  option
    gap: 컨테이너들을 배치 할때 기본간격 (단위: 픽셀)
    autoResize: 리사이즈 시 화면 크기 조절 기능 사용 여부 (기본값:true)
    debug: 추가적인 정보를 console에 출력 여부 (true/false)
    excludes: layout에서 제외 하고자 하는 객체 목록. class 명 or id를 입력한다.

  properties
    layout: 컨테이너의 하위 객체들의 정렬 방식을 결정
        - horizontal: 하위 객체들을 가로로 정렬
        - vertical: 하위 객체들을 세로로 정렬
        - tile: 하위 객체들을 타일로 정렬

    width: 너비. 단위는 px이나 %
    min-width: 최소 너비. 단위는 px

    height: 높이. 단위는 px이나 %
    min-height: 최소 높이. 단위는 px

    gap: gap을 따로 지정 했을 경우, 하위 객체에 대한 간격을 옵션값을 따르지 않고 지정한 값을 따름

    order: order를 따로 지정 했을 경우, 숫자가 가장 작은 요소 부터 출력 되도록 정렬

    animate: element의 자리 배치 시, animation 효과를 줄지 여부

    padding-left: 왼쪽에 padding 값을 줌
    padding-right: 오른쪽에 padding 값을 줌
    padding-top: 윗쪽에 padding 값을 줌
    padding-bottom: 아랫쪽에 padding 값을 줌

    vertical-align: 컨테이너 하위 객체들의 세로 위치 정렬
    - top: 상단 정렬
    - bottom: 하단 정렬
    - middle: 중앙 정렬

    horizontal-align: 컨테이너 하위 객체들의 가로 위치 정렬
    - left: 왼쪽 정렬
    - right: 오른쪽 정렬
    - center: 가운데 정렬

    scrollbar-policy: 가로 세로 스크롤바 생성 여부 지정
    vertical-scrollbar-policy: 세로 스크롤바 생성 여부 지정
    horizontal-scrollbar-policy: 가로 스크롤바 생성 여부 지정
    - auto: 자동
    - on: 무조건
    - off: 안생김
    
    vertical-position-scale: vertical 간의 position 비율
    horizontal-position-scale: horizontal 간의 position 비율

  method
    invalidLayout(id): 화면 갱신을 예약함
        id: 갱신 하고자 하는 특정 화면의 ID

    validLayout(id): 화면을 바로 갱신함
        id: 갱신 하고자 하는 특정 화면의 ID

  event
    resize-layout-complete: 컴포넌트가 모든 resize를 끝내면 발생됨
 */
;
(function ($) {
    $.fn.extend({
        layout: function (options) {
            "use strict";

            var PROPERTY_LAYOUT = "layout";
            var PROPERTY_GAP = "gap";
            var PROPERTY_PADDING_LEFT = "padding-left";
            var PROPERTY_PADDING_RIGHT = "padding-right";
            var PROPERTY_PADDING_TOP = "padding-top";
            var PROPERTY_PADDING_BOTTOM = "padding-bottom";
            var PROPERTY_VERTICAL_ALIGN = "vertical-align";
            var PROPERTY_HORIZONTAL_ALIGN = "horizontal-align";
            var PROPERTY_VERTICAL_SCROLLBAR_POLICY = "vertical-scrollbar-policy";
            var PROPERTY_HORIZONTAL_SCROLLBAR_POLICY = "horizontal-scrollbar-policy";
            var PROPERTY_SCROLLBAR_POLICY = "scrollbar-policy";
            var PROPERTY_WIDTH = "width";
            var PROPERTY_HEIGHT = "height";
            var PROPERTY_MIN_WIDTH = "min-width";
            var PROPERTY_MIN_HEIGHT = "min-height";
            var PROPERTY_USE_LAYOUT = "use-layout";
            var PROPERTY_ORDER = "order";
            var PROPERTY_ROW_NUMBER = "row-number";
            var PROPERTY_COL_NUMBER = "column-number";
            var PROPERTY_COL_WIDTH = "column-width";
            var PROPERTY_ROW_HEIGHT = "row-height";
            var PROPERTY_MERGE_COL = "merge-column";
            var PROPERTY_VERTICAL_POSITON_SCALE = "vertical-position-scale";
            var PROPERTY_HORIZONTAL_POSITON_SCALE = "horizontal-position-scale";
            
            var VALUE_HORIZONTAL = "horizontal";
            var VALUE_VERTICAL = "vertical";
            var VALUE_TILE = "tile";
            var VALUE_COLUMN = "column";
            var VALUE_ALIGN_TOP = "top";
            var VALUE_ALIGN_BOTTOM = "bottom";
            var VALUE_ALIGN_MIDDLE = "middle";
            var VALUE_ALIGN_LEFT = "left";
            var VALUE_ALIGN_RIGHT = "right";
            var VALUE_ALIGN_CENTER = "center";
            var VALUE_SCROLLBAR_POLICY_AUTO = "auto";
            var VALUE_SCROLLBAR_POLICY_ON = "on";
            var VALUE_SCROLLBAR_POLICY_OFF = "hidden";

            var EVENT_RESIZE = "resize-layout-complete";
            var EXCEPTION_LIST = {
                "script": "",
                "style": "",
                "section": "",
                "nav": "",
                "th": "",
                "tr": "",
                "td": "",
                "thead": "",
                "tbody": "",
                "br": "",
                "colgroup": "",
                "col": "",
                "a": "",
                "svg": "",
                "desc": "",
                "defs": "",
                "clippath": "",
                "rect": "",
                "path": "",
                "tspan": "",
                "treecontrol": "",
                "tooltip": ""
            };

            this.defaultOptions = {
                gap: 10,
                autoResize: true,
                resizeInterval: 5,
                defaultCols: 3,
                excludes: [],
                namespace:{
                	layout: "layout"
                },
                debug: false
            };

            var settings = $.extend({}, this.defaultOptions, options);

            var currentContainer = null;
            var reservedContainer = null;
            var invalidDisplay = false;

            function DEBUG(msg) {
                if (!settings.debug)
                    return;

                try {
                    console.debug(msg);
                } catch (e) {}
            }

            function isValidTag(container) {
                var tagName = getTagName(container);
                if (tagName == "" || EXCEPTION_LIST[tagName] == "") {
                    return false;
                }

                return true;
            }

            function isEqualContainer(source, target) {
                var ret = false;
                try {
                    var l = source.length;
                    for (var i = 0; i < l; i++) {
                        var ll = target.length;
                        for (var j = 0; j < ll; j++) {
                            if (source[i] == target[j]) {
                                return true;
                            }
                        }
                    }
                } catch (e) {}

                return ret;
            }

            function isExcludeContainer(container) {
                var l = settings.excludes.length;
                var c = null;
                for (var i = 0; i < l; i++) {
                    c = $("#" + settings.excludes[i]);
                    if (c && isEqualContainer(container, c)) {
                        return true;
                    }
                    c = $("." + settings.excludes[i]);
                    if (c && isEqualContainer(container, c)) {
                        return true;
                    }
                }

                return false;
            }

            function isDisableLayout(container) {
                if (container.css("display") == "none") {
                    return true;
                }

                var useLayout = container[0].getAttribute(PROPERTY_USE_LAYOUT);
                if (!useLayout) {
                    return false;
                }

                if (useLayout == "false") {
                    return true;
                }

                return false;
            }

            function setScrollbarPolicy(container, right, bottom) {
                var verticalScrollbarPolicy = null;
                var horizontalScrollbarPolicy = null;

                var scrollbarPolicy = container[0].getAttribute(PROPERTY_SCROLLBAR_POLICY);
                if (scrollbarPolicy) {
                    horizontalScrollbarPolicy = getOverflowPolicy(scrollbarPolicy);
                    verticalScrollbarPolicy = horizontalScrollbarPolicy;
                } else {
                    verticalScrollbarPolicy = container[0].getAttribute(PROPERTY_VERTICAL_SCROLLBAR_POLICY);
                    if (verticalScrollbarPolicy) {
                        verticalScrollbarPolicy = getOverflowPolicy(verticalScrollbarPolicy);
                    }

                    horizontalScrollbarPolicy = container[0].getAttribute(PROPERTY_HORIZONTAL_SCROLLBAR_POLICY);
                    if (horizontalScrollbarPolicy) {
                        horizontalScrollbarPolicy = getOverflowPolicy(horizontalScrollbarPolicy);
                    }
                }

                var css = {};
                if (verticalScrollbarPolicy) {
                    if (verticalScrollbarPolicy == VALUE_SCROLLBAR_POLICY_AUTO) {
                        var height = getHeight(container);
                        if (height >= bottom) {
                            verticalScrollbarPolicy = VALUE_SCROLLBAR_POLICY_OFF;
                        }
                    }
                    css["overflow-y"] = verticalScrollbarPolicy;
                }

                if (horizontalScrollbarPolicy) {
                    if (horizontalScrollbarPolicy == VALUE_SCROLLBAR_POLICY_AUTO) {
                        var width = getWidth(container);
                        if (width >= right) {
                            horizontalScrollbarPolicy = VALUE_SCROLLBAR_POLICY_OFF;
                        }
                    }
                    css["overflow-x"] = horizontalScrollbarPolicy;
                }
               
                container.css(css);
            }

            function setSize(container, width, height, css) {
                if (container[0].getAttribute("width") && container[0].getAttribute("height") && container.css("display") == "inline") {
                    css.display = "block";
                }

                if (container[0].getAttribute("width")) {
                    css.width = width + "px";
                }

                if (container[0].getAttribute("height")) {
                    css.height = height + "px";
                }
            }

            function setPosition(container, top, left, animate, css) {
                if (isNaN(top) || isNaN(left)) {
                    return;
                }

                if (left < 0) {
                    left = 0;
                }

                if (top < 0) {
                    top = 0;
                }

                css.position = "absolute";

                if (animate && animate == 'true') {
                    container.css("opacity", 0.1);
                    container.animate({
                        opacity: 1,
                        left: left,
                        top: top
                    }, {
                        duration: 'slow'
                    });
                } else {
                    css.left = left + "px";
                    css.top = top + "px";
                }
            }

            function getTagName(container) {
                var con = container[0];
                var tagName = con.tagName;
                if (!tagName) {
                    return "";
                }

                tagName = tagName.toLowerCase();
                return tagName;
            }

            function getGapSize(container) {
                var gap = container[0].getAttribute(PROPERTY_GAP);
                if (!gap) {
                    gap = settings.gap;
                }

                return parseInt(gap);
            }

            function getBorderWidthSize(container) {
                var borderLeft = parseInt(container.css("border-left-width"));
                if (isNaN(borderLeft))
                    borderLeft = 0;

                var borderRight = parseInt(container.css("border-right-width"));
                if (isNaN(borderRight))
                    borderRight = 0;

                return borderLeft + borderRight;
            }

            function getBorderHeightSize(container) {
                var borderTop = parseInt(container.css("border-top-width"));
                if (isNaN(borderTop))
                    borderTop = 0;

                var borderBottom = parseInt(container.css("border-bottom-width"));
                if (isNaN(borderBottom))
                    borderBottom = 0;

                return borderTop + borderBottom;
            }

            function getColNumber(container) {
                var colNumber = container[0].getAttribute(PROPERTY_COL_NUMBER);
                return colNumber;
            }

            function getRowHeight(container) {
                var rowHeight = container[0].getAttribute(PROPERTY_ROW_HEIGHT);
                rowHeight = parseInt(rowHeight);
                return rowHeight;
            }

            function getColumnWidth(container) {
                var colWidth = container[0].getAttribute(PROPERTY_COL_WIDTH);
                colWidth = parseInt(colWidth);
                return colWidth;
            }

            function getOverflowPolicy(value) {
                if (value == VALUE_SCROLLBAR_POLICY_AUTO) {
                    return "auto";
                }

                if (value == VALUE_SCROLLBAR_POLICY_ON) {
                    return "scroll";
                }

                return "hidden";
            }

            function getChildren(parent) {
                var list = [];
                var orderList = [];

                if (!parent || parent.length == 0)
                    return list;

                var childNodes = parent[0].childNodes;
                if (!childNodes) {
                    return list;
                }

                var l = childNodes.length;
                var order = 0;
                var node = null;

                for (var i = 0; i < l; i++) {
                    node = $(childNodes[i]);

                    if (!isValidTag(node)) {
                        continue;
                    }

                    if (isDisableLayout(node)) {
                        continue;
                    }

                    order = node[0].getAttribute(PROPERTY_ORDER);
                    if (order && order > 0) {
                        orderList.push({
                            "order": order,
                            "element": node
                        });
                    } else {
                        list.push(node);
                    }
                }

                orderList.sort(function (a, b) {
                    return a.order - b.order
                });
                orderList.reverse();

                l = orderList.length;
                for (var i = 0; i < l; i++) {
                    list.unshift(orderList[i].element);
                }

                return list;
            }

            function getMiddleTop(totalHeight, height) {
                var middleTop = (height / 2) - (totalHeight / 2);
                if (middleTop < 0) {
                    middleTop = 0;
                }

                return middleTop;
            }

            function getMiddleLeft(totalWidth, width) {
                var middleLeft = (width / 2) - (totalWidth / 2);
                if (middleLeft < 0) {
                    middleLeft = 0;
                }

                return middleLeft;
            }

            function getBottomTop(totalHeight, count, height, gap) {
                var bottomTop = height - totalHeight - (gap * (count - 1));
                if (bottomTop < 0) {
                    bottomTop = 0;
                }

                return bottomTop;
            }

            function getRightLeft(totalWidth, count, width, gap) {
                var rightLeft = width - totalWidth - (gap * (count - 1));
                if (rightLeft < 0) {
                    rightLeft = 0;
                }

                return rightLeft;
            }

            function getLayoutAlign(container, property, defaultValue) {
                var align = container[0].getAttribute(property);
                if (!align) {
                    align = defaultValue;
                }

                return align;
            }

            function getPadding(container) {
                var paddingLeft = parseInt(container[0].getAttribute(PROPERTY_PADDING_LEFT));
                if (isNaN(paddingLeft)) {
                    paddingLeft = 0;
                }

                var paddingTop = parseInt(container[0].getAttribute(PROPERTY_PADDING_TOP));
                if (isNaN(paddingTop)) {
                    paddingTop = 0;
                }

                var paddingRight = parseInt(container[0].getAttribute(PROPERTY_PADDING_RIGHT));
                if (isNaN(paddingRight)) {
                    paddingRight = 0;
                }

                var paddingBottom = parseInt(container[0].getAttribute(PROPERTY_PADDING_BOTTOM));
                if (isNaN(paddingBottom)) {
                    paddingBottom = 0;
                }

                return {
                    "paddingLeft": paddingLeft,
                    "paddingTop": paddingTop,
                    "paddingRight": paddingRight,
                    "paddingBottom": paddingBottom
                };
            }

            function getColumn(container, list, width, height) {
                var cols = getColNumber(container);

                if (!cols) {
                    cols = settings.defaultCols;
                }

                var length = list.length;
                var rows = 0;
                var c = 0;
                for (var i=0; i < length; i++) {
                	c++;
                	
                	if (list[i].attr(PROPERTY_MERGE_COL) == "true") {
                		rows++;
                		
                		if (c > 1) {
                			rows++;
                		}
                		c = 0;
                	
                	} else {
                    	if (c == cols) {
                    		rows++;
                    		c = 0;
                    	}
                	}
                	
                	if (i == length - 1 && c > 0) {
                		rows++;
                	}
                }  
                
                var rowHeight = getRowHeight(container);
                if (isNaN(rowHeight)) {
                    rowHeight = height / rows;
                }

                var colWidth = getColumnWidth(container);
                if (isNaN(colWidth)) {
                    colWidth = width / cols;
                }

                return {
                    cols: cols,
                    rows: rows,
                    rowHeight: rowHeight,
                    colWidth: colWidth
                };
            }

            function getVerticalPostion(parent, list, size, parentWidth, parentHeight, gap, padding) {
                if (!list) {
                    return null;
                }

                var topMap = {};
                var leftMap = {};

                var pWidth = parentWidth;
                var pHeight = parentHeight;

                var verticalAlign = getLayoutAlign(parent, PROPERTY_VERTICAL_ALIGN, VALUE_ALIGN_TOP);
                var horizontalAlign = getLayoutAlign(parent, PROPERTY_HORIZONTAL_ALIGN, VALUE_ALIGN_LEFT);

                var cumLeft = 0;
                var cumTop = 0;
                if (verticalAlign == VALUE_ALIGN_TOP) {
                    cumTop += padding.paddingTop;
                }

                var middleTop = getMiddleTop(size.totalHeight + ((size.count - 1) * gap), pHeight);
                var bottomTop = getBottomTop(size.totalHeight, size.count, pHeight, gap);

                var value = null;
                var h = 0;
                var w = 0;
                var ps = null;

                var l = list.length;
                for (var index = 0; index < l; index++) {
                    value = list[index];
                    
                    ps = value.attr(PROPERTY_VERTICAL_POSITON_SCALE);
                    if (!ps) {
                        ps = 1;
                    }
                    
                    h = size.height[index];
                    if (!h) {
                        h = getHeight(value);
                    }

                    w = size.width[index];
                    if (!w) {
                        w = getWidth(value);
                    }

                    if (verticalAlign == VALUE_ALIGN_TOP) {
                        topMap[index] = cumTop + gap;
                    } else if (verticalAlign == VALUE_ALIGN_BOTTOM) {
                        topMap[index] = cumTop + bottomTop - gap;
                    } else if (verticalAlign == VALUE_ALIGN_MIDDLE) {
                        topMap[index] = cumTop + middleTop;
                    }

                    if (horizontalAlign == VALUE_ALIGN_LEFT) {
                        leftMap[index] = gap + padding.paddingLeft;
                    } else if (horizontalAlign == VALUE_ALIGN_RIGHT) {
                        leftMap[index] = pWidth - w - gap;
                    } else if (horizontalAlign == VALUE_ALIGN_CENTER) {
                        leftMap[index] = (pWidth / 2) - (w / 2);
                    }

                    if (topMap[index] < 1) {
                        topMap[index] = gap;
                    }

                    if (leftMap[index] < 1) {
                        leftMap[index] = gap;
                    }

                    cumLeft += (w + gap);
                    cumTop += ((h + gap) * ps);
                }

                var result = {
                    "top": topMap,
                    "left": leftMap
                };

                return result;
            }

            function getHorizontalPostion(parent, list, size, parentWidth, parentHeight, gap, padding) {
                if (!list)
                    return null;

                var topMap = {};
                var leftMap = {};

                var pWidth = parentWidth;
                var pHeight = parentHeight;

                var verticalAlign = getLayoutAlign(parent, PROPERTY_VERTICAL_ALIGN, VALUE_ALIGN_TOP);
                var horizontalAlign = getLayoutAlign(parent, PROPERTY_HORIZONTAL_ALIGN, VALUE_ALIGN_LEFT);

                var cumTop = 0;
                var cumLeft = 0;
                if (horizontalAlign != VALUE_ALIGN_CENTER) {
                    cumLeft += padding.paddingLeft;
                }

                var middleLeft = getMiddleLeft(size.totalWidth + ((size.count - 1) * gap), pWidth);
                var rightLeft = getRightLeft(size.totalWidth, size.count, pWidth, gap);

                var value = null;
                var h = 0;
                var w = 0;
                var ps = null;
                
                var l = list.length;
                for (var index = 0; index < l; index++) {
                    value = list[index];

                    ps = value.attr(PROPERTY_HORIZONTAL_POSITON_SCALE);
                    if (!ps) {
                        ps = 1;
                    }
                    
                    h = size.height[index];
                    if (!h) {
                        h = getHeight(value);
                    }

                    w = size.width[index];
                    if (!w) {
                        w = getWidth(value);
                    }

                    if (verticalAlign == VALUE_ALIGN_TOP) {
                        topMap[index] = gap + padding.paddingTop;
                    } else if (verticalAlign == VALUE_ALIGN_BOTTOM) {
                        topMap[index] = pHeight - h - gap;
                    } else if (verticalAlign == VALUE_ALIGN_MIDDLE) {
                        topMap[index] = (pHeight / 2) - (h / 2);
                    }

                    if (horizontalAlign == VALUE_ALIGN_LEFT) {
                        leftMap[index] = cumLeft + gap;
                    } else if (horizontalAlign == VALUE_ALIGN_RIGHT) {
                        leftMap[index] = cumLeft + rightLeft - gap;
                    } else if (horizontalAlign == VALUE_ALIGN_CENTER) {
                        leftMap[index] = cumLeft + middleLeft;
                    }

                    if (topMap[index] < 1) {
                        topMap[index] = gap;
                    }

                    if (leftMap[index] < 1) {
                        leftMap[index] = gap;
                    }

                    cumLeft += ((w + gap) * ps);
                    cumTop += (h + gap);
                }

                var result = {
                    "top": topMap,
                    "left": leftMap
                };

                return result;
            }

            function getTileRows(parent, list, size, pWidth) {
                var rows = [];
                var cols = [];

                var rowWidth = 0;
                var rowHeight = 0;
                var totalHeight = 0;

                var value = null;
                var h = 0;
                var w = 0;

                var l = list.length;
                var rowNumber = 0;
                for (var q = 0; q < l; q++) {
                    value = list[q];

                    h = size.height[q];
                    if (!h) {
                        h = getHeight(value);
                    }

                    w = size.width[q];
                    if (!w) {
                        w = getWidth(value);
                    }

                    if (rowWidth + w > pWidth) {
                        rows.push({
                            height: rowHeight,
                            width: rowWidth,
                            cols: cols
                        });
                        totalHeight += rowHeight;
                        rowWidth = w;
                        rowHeight = h;
                        cols = [{
                            h: h,
                            w: w
                        }];
                        rowNumber++;
                    } else {
                        rowWidth += w;
                        cols.push({
                            h: h,
                            w: w
                        });
                        if (h > rowHeight) {
                            rowHeight = h;
                        }
                    }

                    value[0].setAttribute(PROPERTY_ROW_NUMBER, rowNumber);
                }

                if (cols.length > 0) {
                    rows.push({
                        height: rowHeight,
                        width: rowWidth,
                        cols: cols
                    });
                    totalHeight += rowHeight;
                }

                var ret = {
                    rows: rows,
                    totalHeight: totalHeight
                }

                return ret;
            }

            function getTilePostion(parent, list, size, parentWidth, parentHeight, gap, padding) {
                if (!list) {
                    return null;
                }

                var topMap = {};
                var leftMap = {};

                var pWidth = parentWidth;
                var pHeight = parentHeight;

                var cumTop = 0;
                var cumLeft = 0;

                var verticalAlign = getLayoutAlign(parent, PROPERTY_VERTICAL_ALIGN, VALUE_ALIGN_TOP);
                var horizontalAlign = getLayoutAlign(parent, PROPERTY_HORIZONTAL_ALIGN, VALUE_ALIGN_LEFT);

                var tileRows = getTileRows(parent, list, size, pWidth);
                var rows = tileRows.rows;

                var middleTop = getMiddleTop(tileRows.totalHeight, pHeight);
                var bottomTop = getBottomTop(tileRows.totalHeight, rows.length, pHeight, gap);

                var index = 0;
                var length = rows.length;
                for (var i = 0; i < length; i++) {
                    var width = rows[i].width;
                    var height = rows[i].height;
                    var col = rows[i].cols;
                    var rowPosition = [];
                    rows[i].position = rowPosition;

                    var middleLeft = getMiddleLeft(width, pWidth);
                    var rightLeft = getRightLeft(width, col.length, pWidth, gap);

                    for (var j = 0, coll = col.length; j < coll; j++) {
                        if (verticalAlign == VALUE_ALIGN_TOP) {
                            topMap[index] = cumTop + gap;
                        } else if (verticalAlign == VALUE_ALIGN_BOTTOM) {
                            topMap[index] = cumTop + bottomTop - gap;
                        } else if (verticalAlign == VALUE_ALIGN_MIDDLE) {
                            topMap[index] = cumTop + middleTop + gap;
                        }

                        if (horizontalAlign == VALUE_ALIGN_LEFT) {
                            leftMap[index] = cumLeft + gap;
                        } else if (horizontalAlign == VALUE_ALIGN_RIGHT) {
                            leftMap[index] = cumLeft + rightLeft - gap;
                        } else if (horizontalAlign == VALUE_ALIGN_CENTER) {
                            leftMap[index] = cumLeft + middleLeft - gap;
                        }

                        if (i > 0) {
                            var oldRow = rows[i - 1];
                            var top = topMap[index];
                            for (var q = 0, orl = oldRow.position.length; q < orl; q++) {
                                var ot = oldRow.position[q].top;
                                var ol = oldRow.position[q].left;
                                var oh = oldRow.cols[q].h;
                                var ow = oldRow.cols[q].w;

                                if (ot + oh < cumTop - gap && leftMap[index] >= ol) {
                                    top = ot + oh + gap;
                                } else if (ot + oh > top && ((leftMap[index] <= ol && ol <= leftMap[index] + col[j].w) || (ol <= leftMap[index] && leftMap[index] <= ol + ow))) {
                                    top = topMap[index];
                                }
                            }
                            topMap[index] = top;
                        }

                        if (topMap[index] < 1) {
                            topMap[index] = gap;
                        }

                        if (leftMap[index] < 1) {
                            leftMap[index] = gap;
                        }

                        rowPosition.push({
                            top: topMap[index],
                            left: leftMap[index]
                        });

                        cumLeft += col[j].w + gap;
                        index++;
                    }

                    cumTop += height + gap;
                    cumLeft = 0;
                }

                var result = {
                    "top": topMap,
                    "left": leftMap
                };

                return result;
            }

            function getColumnPosition(parent, list, size, parentWidth, parentHeight, gap, padding) {
                if (!list) {
                    return null;
                }

                var columns = getColumn(parent, list, parentWidth, parentHeight);

                var topMap = {};
                var leftMap = {};

                var pWidth = parentWidth;
                var pHeight = parentHeight;

                var cumTop = 0;
                var cumLeft = 0;

                var verticalAlign = getLayoutAlign(parent, PROPERTY_VERTICAL_ALIGN, VALUE_ALIGN_TOP);
                var horizontalAlign = getLayoutAlign(parent, PROPERTY_HORIZONTAL_ALIGN, VALUE_ALIGN_LEFT);

                var middleTop = getMiddleTop(columns.rowHeight * columns.rows, pHeight);
                var bottomTop = getBottomTop(columns.rowHeight * columns.rows, columns.rows, pHeight, gap);
                var middleLeft = getMiddleLeft(columns.colWidth * columns.cols, pWidth);
                var rightLeft = getRightLeft(columns.colWidth * columns.cols, columns.cols, pWidth, gap);

                var index = 0;
                var length = list.length;
                for (var i = 0; i < columns.rows; i++) {
                    for (var j = 0, coll = columns.cols; j < coll; j++) {
                    	var c = list[index];
                    	if (!c) {
                    		break;
                    	}
                    	
                    	var mc = false;
                        if (c && c.attr(PROPERTY_MERGE_COL) == "true") {  
                        	mc = true;
                        }
                        
                        if (mc && j != 0) {
                            cumTop += columns.rowHeight - gap;
                            cumLeft = 0;
                        }
                        
                        if (verticalAlign == VALUE_ALIGN_TOP) {
                            topMap[index] = cumTop + gap;
                        } else if (verticalAlign == VALUE_ALIGN_BOTTOM) {
                            topMap[index] = cumTop + bottomTop - gap;
                        } else if (verticalAlign == VALUE_ALIGN_MIDDLE) {
                            topMap[index] = cumTop + middleTop + gap;
                        }

                        if (horizontalAlign == VALUE_ALIGN_LEFT) {
                            leftMap[index] = cumLeft + gap;
                        } else if (horizontalAlign == VALUE_ALIGN_RIGHT) {
                            leftMap[index] = cumLeft + rightLeft - gap;
                        } else if (horizontalAlign == VALUE_ALIGN_CENTER) {
                            leftMap[index] = cumLeft + middleLeft - gap;
                        }

                        if (topMap[index] < 1) {
                            topMap[index] = gap;
                        }

                        if (leftMap[index] < 1) {
                            leftMap[index] = gap;
                        }
                                    
                        cumLeft += size.width[index] + gap;
                        index++;
                        if (mc) {      
                        	break;
                        }
                    }

                    cumTop += columns.rowHeight - gap;
                    cumLeft = 0;
                }

                var result = {
                    "top": topMap,
                    "left": leftMap
                };

                return result;
            }

            function getPosition(parent, children, layout, size, parentWidth, parentHeight, gap, padding) {
                var position = null;
                if (layout == VALUE_VERTICAL) {
                    position = getVerticalPostion(parent, children, size, parentWidth, parentHeight, gap, padding);
                } else if (layout == VALUE_HORIZONTAL) {
                    position = getHorizontalPostion(parent, children, size, parentWidth, parentHeight, gap, padding);
                } else if (layout == VALUE_TILE) {
                    position = getTilePostion(parent, children, size, parentWidth, parentHeight, gap, padding);
                } else if (layout == VALUE_COLUMN) {
                    position = getColumnPosition(parent, children, size, parentWidth, parentHeight, gap, padding);
                }

                return position;
            }

            function makeSize(value, minValue, parentSize, totalPercent, layout, layoutFlag) {
                if (typeof value != "number") {
                    value = parseInt(value);
                    return value;
                }

                if (layout == layoutFlag && totalPercent > 100) {
                    value = value / totalPercent * 100;
                }

                value = value * parentSize / 100;

                if (!isNaN(minValue) && value < minValue) {
                    value = minValue;
                }

                return value;
            }

            function getDefaultSize(list, layout, parentWidth, parentHeight, gap, padding) {
                if (!list) {
                    return null;
                }

                var totalWidthPercent = 0;
                var totalHeightPercent = 0;

                var widthSizeMap = {};
                var widthMinSizeMap = {};
                var heightSizeMap = {};
                var heightMinSizeMap = {};

                var pWidth = parentWidth;
                var pHeight = parentHeight;

                if (layout) {
                    pWidth -= (padding.paddingLeft + padding.paddingRight);
                    pHeight -= (padding.paddingTop + padding.paddingBottom);
                }

                var value = null;
                var h = 0;
                var w = 0;

                var count = list.length;
                for (var index = 0; index < count; index++) {
                    value = list[index];

                    w = value[0].getAttribute(PROPERTY_WIDTH);
                    if (!w) {
                        w = value.css("width");
                    }

                    h = value[0].getAttribute(PROPERTY_HEIGHT);
                    if (!h) {
                        h = value.css("height");
                    }

                    widthSizeMap[index] = null;
                    if (w) {
                        if (w.indexOf("%") > -1) {
                            widthSizeMap[index] = parseInt(w);
                            totalWidthPercent += widthSizeMap[index];
                        } else if (w.indexOf("px") > -1) {
                            if (layout == VALUE_HORIZONTAL) {
                                pWidth -= parseInt(w);
                            }
                            widthSizeMap[index] = w;
                        }
                    }

                    heightSizeMap[index] = null;
                    if (h) {
                        if (h.indexOf("%") > -1) {
                            heightSizeMap[index] = parseInt(h);
                            totalHeightPercent += heightSizeMap[index];
                        } else if (h.indexOf("px") > -1) {
                            if (layout == VALUE_VERTICAL) {
                                pHeight -= parseInt(h);
                            }
                            heightSizeMap[index] = h;
                        }
                    }

                    widthMinSizeMap[index] = parseInt(value[0].getAttribute(PROPERTY_MIN_WIDTH));
                    heightMinSizeMap[index] = parseInt(value[0].getAttribute(PROPERTY_MIN_HEIGHT));
                }

                if (layout == VALUE_VERTICAL) {
                    pWidth -= gap * 2;
                    pHeight -= gap * (count + 1);
                } else if (layout == VALUE_HORIZONTAL) {
                    pWidth -= gap * (count + 1);
                    pHeight -= gap * 2;
                } else {
                    pWidth -= gap * 2;
                    pHeight -= gap * 2;
                }


                var wTotal = 0;
                var hTotal = 0;
                var w = 0;
                var h = 0;

                for (var i = 0; i < count; i++) {
                    w = makeSize(widthSizeMap[i], widthMinSizeMap[i], pWidth, totalWidthPercent, layout, VALUE_HORIZONTAL);
                    wTotal += w;
                    widthSizeMap[i] = w;

                    h = makeSize(heightSizeMap[i], heightMinSizeMap[i], pHeight, totalHeightPercent, layout, VALUE_VERTICAL);
                    hTotal += h;
                    heightSizeMap[i] = h;
                }

                var result = {
                    "width": widthSizeMap,
                    "height": heightSizeMap,
                    "totalWidth": wTotal,
                    "totalHeight": hTotal,
                    "count": count
                };

                return result;
            }

            function getColumnSize(parent, list, parentWidth, parentHeight, gap, padding) {
                if (!list) {
                    return null;
                }

                var column = getColumn(parent, list, parentWidth, parentHeight);

                var index = 0;
                var size = [];
                for (var i = 0, roll = column.rows; i < roll; i++) {
                    var children = [];
                    for (var q = 0, coll = column.cols; q < coll; q++) {
                        var value = list[index++];
                        if (!value) {
                        	break;
                        }
                        
                        value[0].setAttribute("width", "100%");
                        value[0].setAttribute("height", "100%");

                        if (value.attr(PROPERTY_MERGE_COL) == "true") {                        	
                        	if (children.length > 0) {
                        		size.push(getDefaultSize(children, VALUE_HORIZONTAL, column.colWidth * column.cols, column.rowHeight, gap, padding));
                        		children = [];
                        	}
                        	size.push(getDefaultSize([value], VALUE_HORIZONTAL, column.colWidth * column.cols, column.rowHeight, gap, padding));
                        	break;
                        }
                        
                        children.push(value);
                    }

                    if (children.length > 0) {
                        var rowSize = getDefaultSize(children, VALUE_HORIZONTAL, column.colWidth * column.cols, column.rowHeight, gap, padding);
                        size.push(rowSize);
                    }
                }

                if (size.length > 0) {
                    var s = size[0];
                    var h = [];
                    var w = [];
                    for (var j = 0, jl = size.length; j < jl; j++) {
                        for (var v = 0, vl = size[j].count; v < vl; v++) {
                            w.push(size[j].width[v]);
                            h.push(size[j].height[v]);
                        }
                    }

                    s.width = w;
                    s.height = h;
                    size = s;
                }
                
                return size;
            }

            function getSize(parent, list, layout, parentWidth, parentHeight, gap, padding) {
                var size = null;
                if (layout == VALUE_COLUMN) {
                    size = getColumnSize(parent, list, parentWidth, parentHeight, gap, padding);
                } else {
                    size = getDefaultSize(list, layout, parentWidth, parentHeight, gap, padding);
                }

                return size;
            }

            function setLayout(parent, children, level) {
                if (!parent || parent.length == 0)
                    return;

                var parentWidth = getWidth(parent) - getBorderWidthSize(parent);
                var parentHeight = getHeight(parent) - getBorderHeightSize(parent);
                var gap = getGapSize(parent);
                var padding = getPadding(parent);
                var layout = parent[0].getAttribute(PROPERTY_LAYOUT);

                var size = getSize(parent, children, layout, parentWidth, parentHeight, gap, padding);
                var position = getPosition(parent, children, layout, size, parentWidth, parentHeight, gap, padding);

                var rm = 0;
                var bm = 0;
                var b = 0;
                var r = 0;

                var value = null;
                var l = children.length;
                for (var index = 0; index < l; index++) {
                    value = children[index];
                    var css = {};
                    if (size) {
                        setSize(value, size.width[index], size.height[index], css);
                    }
                    if (position && layout) {
                        setPosition(value, position.top[index], position.left[index], parent[0].getAttribute("animate"), css);
                    }
                    value.css(css);

                    if (size && position) {
                        b = size.height[index] + position.top[index];
                        r = size.width[index] + position.left[index];
                    } else if (size) {
                        b = size.height[index];
                        r = size.width[index];
                    }

                    if (bm < b) {
                        bm = b;
                    }
                    if (rm < r) {
                        rm = r;
                    }

                    // DEBUG CODE ---------------------------------------
                    if (settings.debug) {
                        var dTab = "";
                        for (var i = 0; i < level; i++) {
                            dTab += "--";
                        }
                        DEBUG("    " + dTab + " " + "[" + level + "] " + value[0].tagName + "/" + value[0].id + "/" + value[0].className + "/ Layout:[" + value[0].getAttribute(PROPERTY_LAYOUT) + "] - Left[" + value.css("left") + "] / Top[" + value.css("top") + "]    Width: " + value.css("width") + " / Height: " + value.css("height") + "  - Gap[" + getGapSize(value) + "]");
                    }
                    // --------------------------------------- DEBUG CODE

                    setLayout(value, getChildren(value), level + 1);
                }

                level += 1;
                setScrollbarPolicy(parent, rm, bm);
            }

            function getWindowWidth(container) {
                var w = 0;
                if (!container) {
                    w = window.innerWidth;
                    if (isNaN(w)) {
                        w = window.clientWidth;
                    }
                } else {
                    w = getWidth(container);
                }

                return w;
            }

            function getWindowHeight(container) {
                var h = 0;
                if (!container) {
                    h = window.innerHeight;
                    if (isNaN(h)) {
                        h = window.clientHeight;
                    }
                } else {
                    h = getHeight(container);
                }

                return h;
            }

            function getWidth(container) {
                var w = container[0].offsetWidth;
                if (!w) {
                    w = container.css("width");
                    if (w) {
                        w = parseInt(w);
                    }
                }

                return w;
            }

            function getHeight(container) {
                var h = container[0].offsetHeight;
                if (!h) {
                    h = container.css("height");
                    if (h) {
                        h = parseInt(h);
                    }
                }

                return h;
            }

            function getBaseWidthMargin(container) {
                if (!container) {
                    container = $('body');
                }

                var ml = parseInt(container.css("margin-left"));
                if (isNaN(ml)) {
                    ml = 0;
                }

                var mr = parseInt(container.css("margin-right"));
                if (isNaN(mr)) {
                    mr = 0;
                }

                return ml + mr;
            }

            function getBaseHeightMargin(container) {
                if (!container) {
                    container = $('body');
                }

                var mt = parseInt(container.css("margin-top"));
                if (isNaN(mt)) {
                    mt = 0;
                }

                var mb = parseInt(container.css("margin-bottom"));
                if (isNaN(mb)) {
                    mb = 0;
                }

                return mt + mb;
            }

            function initializeBaseContainer(container) {
                var cumWidth = 0;
                var cumHeight = 0;
                var cumLeft = 0;
                var cumTop = 0;

                var footer = null;
                var flag = 0;

                var t = null;
                var w = 0;
                var h = 0;

                var parent = container.parent();
                var children = getChildren(parent);
                for (var i = 0, l = children.length; i < l; i++) {
                    t = $(children[i]);
                    if (isDisableLayout(t)) {
                        continue;
                    }

                    if (isExcludeContainer(t)) {
                        continue;
                    }

                    if (isEqualContainer(container, t)) {
                        flag = 1;
                        continue;
                    }

                    w = getWidth(t) + getBorderWidthSize(t);
                    h = getHeight(t) + getBorderHeightSize(t);

                    cumWidth += w;
                    cumHeight += h;

                    if (flag == 0) {
                        cumLeft += w;
                        cumTop += h;
                    }

                    if (getTagName(t) == "footer") {
                        footer = t;
                    }
                }

                if (!parent || parent[0] == $('body')[0]) {
                    parent = null;
                }

                var ww = getWindowWidth(parent);
                var wh = getWindowHeight(parent);

                if (cumWidth == ww || cumWidth > ww) {
                    cumWidth = 0;
                    cumLeft = 0;
                }
                if (cumHeight == wh || cumHeight > wh) {
                    cumHeight = 0;
                    cumTop = 0;
                }

                var width = ww - cumWidth - getBaseWidthMargin(null);
                var height = wh - cumHeight - getBaseHeightMargin(null);

                var attrWidth = container[0].getAttribute(PROPERTY_WIDTH);
                if (attrWidth) {
                    if (attrWidth.indexOf("px") > -1) {
                        width = parseInt(attrWidth);
                    } else if (attrWidth.indexOf("%") > -1) {
                        width = (width / parseInt(attrWidth) * 100);
                    }
                }

                var attrHeight = container[0].getAttribute(PROPERTY_HEIGHT);
                if (attrHeight) {
                    if (attrHeight.indexOf("px") > -1) {
                        height = parseInt(attrHeight);
                    } else if (attrHeight.indexOf("%") > -1) {
                        height = (height / parseInt(attrHeight) * 100);
                    }
                }

                var css = {};
                setPosition(container, cumTop, cumLeft, false, css);
                css.width = width + "px";
                css.height = height + "px";
                container.css(css);

                if (footer) {
                    css = {};
                    setPosition(footer, cumTop + height, cumLeft, false, css);
                    footer.css(css);
                }

                $('body').css("overflow", VALUE_SCROLLBAR_POLICY_OFF);

                // DEBUG ---------------------------------------
                DEBUG("START =====");
                DEBUG("[0] " + container.get(0).tagName + " - " + "Left[" + container.css("left") + "] / Top[" + container.css("top") + "]    Width: " + container.css("width") + " / Height: " + container.css("height") + "  - Gap[" + getGapSize(container) + "]");
                // --------------------------------------- DEBUG
            }

            function resizeLayout() {
                var st = (new Date()).getTime();

                var con = null;
                if (reservedContainer) {
                    setLayout(reservedContainer.parent(), getChildren(reservedContainer.parent()), 1);
                    con = reservedContainer.parent();
                } else {
                    initializeBaseContainer(currentContainer);
                    setLayout(currentContainer, getChildren(currentContainer), 1);
                }

                var et = (new Date()).getTime();
                DEBUG("END ====== " + (et - st) + "ms");

                $(window).trigger(EVENT_RESIZE, con);
                $(window).trigger("resize", "not-empty");

                reservedContainer = null;
            }

            function invalidLayout(id) {
                if (invalidDisplay) {
                    return;
                }

                if (id) {
                    reservedContainer = $("#" + id);
                }

                invalidDisplay = true;

                setTimeout(function() {
                    resizeLayout();
                    invalidDisplay = false;
                }, settings.resizeInterval);
            }

            // entry-point
            currentContainer = $(this[0]);
            resizeLayout();

            // namespae
            if (settings.namespace) {
            	var namespace = settings.namespace;
            	if(namespace.layout) {
            		PROPERTY_LAYOUT = namespace.layout;
            	}
            }
            
            // auto-resizing
            if (settings.autoResize == true) {
                $(window).resize(function (event, data) {
                    if (data != null) {
                        return;
                    }

                    if (window != event.target) {
                        reservedContainer = $(event.target);
                    }

                    invalidLayout();

                });
            }

            // functions
            $.invalidLayout = function (id) {
                invalidLayout(id);
            }

            $.validLayout = function (id) {
                if (id) {
                    reservedContainer = $("#" + id);
                }
                resizeLayout();
            }
        }
    });
})(jQuery);