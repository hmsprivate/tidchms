/**
  Copyright (c) <2015> <SeJong, Park (rhcpn@mobigen.com)>, <Mobigen.com>

  jquery.mdi.js

  dependency
    jquery.layout.js 필수

  history
    2015/04/13  최초생성
    2015/05/20  팝업창을 띄우는 기능 추가
    2015/05/21  getWindow 함수 추가
    2015/08/18  mdi-close 이벤트 추가
                   closeWindow, getCurrentWindow 함수 추가
    2015/08/20  창이 선택 되었을때의 CLASS_SUB_TOP_SELECT 추가
                   창이 최소화, 원복 되는 이벤트 추가
    2015/08/25  taskBar 옵션이 추가되어 이제 임의의 위치에 taskBar를 추가 할 수 있게 함
    2015/09/18  taskBar에 화면 너비 보다 넒은 버튼 숫자가 추가되면 summary 버튼이 나타나는 기능 추가
                   전체 화면 전환을 width 계산 방식에서 % 방식으로 변경
    2015/12/10  창이 선택 되었을때의 CLASS_SUB_WINDOW_SELECT 추가
    2016/01/22  창이 이미 focus 상태일때 ,계속 focus 이벤트를 발생 시키지 않도록 수정
                   sub-Window 속성에 status 를 추가함
    2016/10/25  모든 창을 닫는 기능 추가
    2016/10/27  일부 javascript 컴포넌트들 중에 layout attribute를 사용하는 경우가 있어서, 옵션으로 바꿀수 있도록 처리
    
  version
    2015/04/13  1.0
    2015/05/20  1.1
    2015/05/21  1.2
    2015/08/18  1.3
    2015/08/20  1.4
    2015/08/25  1.5
    2015/09/18  1.6
    2015/12/10  1.6.1
    2016/01/22  1.6.2
    2016/10/25  1.6.3
    2016/10/27  1.6.4

  option
    currentWidth: mdi-dialog 기본 크기 (너비)
    currentHeight: mdi-dialog 기본 크기 (높이)
    currentTaskBarHeight: 작업바 기본 크기 (높이)
    verticalScrollbarPolicy: mdi 창의 세로 스크롤 사용 여부 (auto/on/off)
    horizontalScrollbarPolicy: mdi 창의 가로 스크롤 사용 여부 (auto/on/off)
    showMode: mdi-dialog 추가 모드 (normal: 기본크기 / max: 최대 크기)
    taskBar: taskBar로 따로 지정하고자 하는 div 영역의 id
    maxWindows: 추가 가능한 최대 갯수

  method
    addWindowByHtml(id, title, html, data, width, height, modal, sub): HTML 코드를 바탕으로 창을 추가
        인자값
        - id: 추가할 창의 id
        - title: 추가할 창의 타이틀명
        - html: 추가할 창의 내용에 들어갈 HTML 코드
        - (옵션) data: 창을 띄울때 추가적으로 필요한 데이터
        - (옵션) width: 추가할 창 너비
        - (옵션) height: 추가할 창 높이
        - (옵션) modal: 모달로 띄울것인가?
        - (옵션) sub: 서브 팝업을 띄울 것인가?

    addWindowByUrl(id, title, url, data, width, height, modal, sub): url의 내용을 바탕으로 창을 추가
        인자값
        - id: 추가할 창의 id
        - title: 추가할 창의 타이틀명
        - url: 추가할 창의 내용을 가져올 url
        - (옵션) data: 창을 띄울때 추가적으로 필요한 데이터
        - (옵션) width: 추가할 창 너비
        - (옵션) height: 추가할 창 높이
        - (옵션) modal: 모달로 띄울것인가?
        - (옵션) sub: 서브 팝업을 띄울 것인가?

    getWindow(id) : 현재 MDI에 등록된 윈도우 정보를 반환
        인자값
        - id: 찾고자 하는 창의 ID

        반환값
            object (subWindow)
            - id: 윈도우 아이디
            - title: 윈도우 타이틀 명
            - window: subWindow (JQuery)
            - modal: 모달 여부
            - data: 창 띄울때 추가한 데이터
            - status: 윈도우 상태 normal / hide / focus

    getCurrentWindow() : 현재 가장 상위에 있는 윈도우 정보를 반환
        반환값
            object (subWindow)
            - id: 윈도우 아이디
            - title: 윈도우 타이틀 명
            - window: subWindow (JQuery)
            - modal: 모달 여부
            - data: 창 띄울때 추가한 데이터
            - status: 윈도우 상태 normal / hide / focus

    getWindowCount() : 현재 MDI에 등록된 창의 갯수를 반환
        반환값
            int (MDI윈도우 갯수)
            
    closeAllWindow() : 현재 떠있는 모든 MDI 창을 닫음
    
            
  event
    mdi-close: 창을 닫으면 발생
    mdi-set-focus: 특정 mdi가 최상위로 올라왔을때
    mdi-hide: 창이 숨김 상태 이면 발생
    mdi-restore: 창이 숨김 상태에서 다시 나타남
    mdi-ready: mdi 준비 완료
    
  style
    minimize-window: 최소 버튼
    normal-window: 최대화/일반 중 일반 버튼
    maximize-window: 최대화/일반 중 최대화 버튼
    close-window: 창 닫기 버튼
    resize-point: 청 리사이즈 포인트
    sub-window: 다이얼로그 창 본체
    sub-top: 다이얼로그 타이틀 영역
    sub-body: 다이얼로그 본체 영역
    sub-bottom: 다이얼로그 리사이징 영역
    mid-taskbar: 작업바 본체
    taskbar-button-normal: 작업바 버튼 일반
    taskbar-button-hidden: 작업바 버튼 눌렸을때
 **/
;
(function($) {
    $.fn.extend({
        mdi: function(options) {
            "use strict";

            this.defaultOptions = {
                currentWidth: 400,
                currentHeight: 500,
                currentTaskBarHeight: 40,
                verticalScrollbarPolicy: 'none',
                horizontalScrollbarPolicy: 'none',
                showMode: 'normal',
                taskBar: '',
                maxWindows: 7
            };
            
            var PROPERTY_LAYOUT = "layout";
            
            var CLASS_MAXIMIZE_WINDOW = "maximize-window";
            var CLASS_NORMAL_WINDOW = "normal-window";
            var CLASS_MINIMIZE_WINDOW = "minimize-window";
            var CLASS_CLOSE = "close-window";
            var CLASS_RESIZE = "resize-window";
            var CLASS_RESIZE_POINT = "resize-point";

            var CLASS_SUB_WINDOW = "sub-window";
            var CLASS_SUB_WINDOW_SELECT = "sub-window-select";
            var CLASS_SUB_TOP = "sub-top";
            var CLASS_SUB_TOP_SELECT = "sub-top-select";
            var CLASS_SUB_BODY = "sub-body";
            var CLASS_SUB_BOTTOM = "sub-bottom";

            var CLASS_TASKBAR = "mdi-taskbar";
            var CLASS_TASKBAR_BUTTON_NORMAL = "taskbar-button-normal";
            var CLASS_TASKBAR_BUTTON_SELECT = "taskbar-button-select";
            var CLASS_TASKBAR_BUTTON_HIDDEN = "taskbar-button-hidden";
            var CLASS_TASKBAR_BUTTON_LABEL = "taskbar-button-label";
            var CLASS_TASKBAR_BUTTON_CLOSE = "taskbar-button-close";
            var CLASS_TASKBAR_BUTTON_SUMMARY = "taskbar-button-summary";
            var CLASS_TASKBAR_CONTEXT_MENU = "taskbar-context-menu";
            var CLASS_TASKBAR_CONTEXT_MENU_LIST = "taskbar-context-menu-list";

            var NORMAL_Z_INDEX = 10;
            var CURRENT_Z_INDEX = 20;
            var OVERALY_Z_INDEX = 30;
            
            var DEFAULT_POSITION_LEFT = 10;
            var DEFAULT_POSITION_TOP = 10;

            var OPTION_SHOWMODE_MAX = "max";
            var OPTION_SHOWMODE_NORMAL = "normal";
            
            var STATUS_NORMAL = "normal";
            var STATUS_HIDE = "hide";
            var STATUS_MAXIMIZE = "maximize";

            var EVENT_CLOSE = "mdi-close";
            var EVENT_CLOSE_ALL = "mdi-close-all";
            var EVENT_SET_FOCUS = "mdi-set-focus";
            var EVENT_HIDE = "mdi-hide";
            var EVENT_RESTORE = "mdi-restore";
            var EVENT_RESIZE = "mdi-resize";

            // options
            var settings = $.extend({}, this.defaultOptions, options);

            var currentWindow = null;
            var currentContainer = null;

            var windowMap = {};
            var windowList = [];

            var modalCount = 0;
            
            var lock = false;

            function invalidLayout(id) {
                if (id)
                    $.invalidLayout(id);
                else
                    $.invalidLayout(currentContainer.attr("id"));
            }

            function validLayout(id) {
                if (id)
                    $.validLayout(id);
                else
                    $.validLayout(currentContainer.attr("id"));
            }

            function getWindowIndex(id) {
                var l = windowList.length;
                for (var i = 0; i < l; i++) {
                    var subWindow = windowList[i];
                    if (subWindow.attr("id") == id)
                        return i;
                }

                return -1;
            }

            function setCurrentWindow(id) {
                if (currentWindow && currentWindow.attr("id") == id) {
                    return;
                }
                
                var l = windowList.length;
                var oldCurrent = currentWindow;
                
                for (var i = 0; i < l; i++) {
                    var subWindow = windowList[i];
                    if (subWindow.attr("id") != id) {
                        if (currentWindow == subWindow) {
                            subWindow.css("z-index", NORMAL_Z_INDEX + 10);
                        } else {
                            subWindow.css("z-index", NORMAL_Z_INDEX);
                        }
                    } else {
                        if (windowMap[id].modal == true) {
                            subWindow.css("z-index", OVERALY_Z_INDEX + modalCount + 5);
                        } else {
                            subWindow.css("z-index", CURRENT_Z_INDEX + modalCount);
                        }
                    
                        currentWindow = subWindow;
                        if ($("#" + id + CLASS_RESIZE).attr('class').indexOf(CLASS_NORMAL_WINDOW) > -1) {
                            windowMap[id].status = STATUS_MAXIMIZE;
                        } else {
                            windowMap[id].status = STATUS_NORMAL;
                        }
                    }

                    subWindow.attr("disabled", true);
                }

                setCurrentWindowStyle(currentWindow);              
                invalidLayout();
                
                if (oldCurrent != currentWindow) {
                    $(currentWindow).trigger(EVENT_SET_FOCUS, currentWindow);
                }
            }

            function setHideCurrentWindow(subWindow) {
                currentWindow = null;

                var taskBarButton = null;
                var t = null;
                var index = getWindowIndex(subWindow.id);
                if (index == 0 && windowList.length == 1) {
                    currentWindow = null;
                } else {
                    var f = 0;
                    var ff = 0;
                    var id = "";
                    for (var i = 0, l = windowList.length; i < l; i++) {
                        id =  windowList[i].attr("id");
                        if (f == 0 && id == subWindow.id) {
                            f = 1;
                        } else {
                            taskBarButton = $("#" + id + CLASS_TASKBAR_BUTTON_NORMAL);
                            if (taskBarButton.attr("class") == CLASS_TASKBAR_BUTTON_NORMAL) {
                                setCurrentWindow(id);
                                ff = 1;
                                break;
                            }
                        }
                    }

                    if (ff == 0) {
                        for (var i = 0; i < index + 1; i++) {
                            id =  windowList[i].attr("id");
                            
                            taskBarButton = $("#" + id + CLASS_TASKBAR_BUTTON_NORMAL);
                            if (taskBarButton.attr("class") == CLASS_TASKBAR_BUTTON_NORMAL) {
                                setCurrentWindow(id);
                                break;
                            }
                        }
                    }
                }

                subWindow.status = STATUS_HIDE;
                subWindow.window.trigger(EVENT_HIDE, subWindow.window);
                
                taskBarButton = $("#" + subWindow.id + CLASS_TASKBAR_BUTTON_NORMAL);
                taskBarButton.attr('class', CLASS_TASKBAR_BUTTON_HIDDEN);
            }

            function setCurrentWindowStyle(currentWindow) {
                $("." + CLASS_SUB_TOP).removeClass(CLASS_SUB_TOP_SELECT);
                $("." + CLASS_SUB_WINDOW).removeClass(CLASS_SUB_WINDOW_SELECT);

                currentWindow.addClass(CLASS_SUB_WINDOW_SELECT);
                
                $(currentWindow).children("." + CLASS_SUB_TOP).addClass(CLASS_SUB_TOP_SELECT);
                $("." + CLASS_TASKBAR_BUTTON_SELECT).attr("class", CLASS_TASKBAR_BUTTON_NORMAL);
                $("#" + currentWindow.attr("id") + CLASS_TASKBAR_BUTTON_NORMAL).attr("class", CLASS_TASKBAR_BUTTON_SELECT);
            }

            function getWindowPosition(size, sub) {
                if (sub == true) { 
                    return {
                        left: (currentContainer.outerWidth() / 2) - (size.width / 2),
                        top: (currentContainer.outerHeight() / 2) - (size.height / 2)
                    }; 
                }

                if (settings.showMode == OPTION_SHOWMODE_MAX) {
                    return {
                        left: 0,
                        top: 0
                    };
                }

                var l = windowList.length;
                if (l == 0) { 
                    return {
                        left: DEFAULT_POSITION_LEFT,
                        top: DEFAULT_POSITION_TOP
                    }; 
                }

                var window = windowList[l - 1];
                return {
                    left: parseInt(window.css("left")) + DEFAULT_POSITION_LEFT,
                    top: parseInt(window.css("top")) + DEFAULT_POSITION_TOP
                }
            }

            function getWindowSize(width, height, sub) {
                if (isNaN(width) || width == null || width == 0)
                    width = settings.currentWidth;

                if (isNaN(height) || height == null || height == 0)
                    height = settings.currentHeight;

                if (settings.showMode == OPTION_SHOWMODE_MAX && !sub) {
                    width = currentContainer.outerWidth() - 1;
                    height = currentContainer.outerHeight() - 1;
                }

                return {
                    width: width,
                    height: height
                }
            }

            function getResizeButtonClass() {
                if (settings.showMode == OPTION_SHOWMODE_MAX) {
                    return CLASS_NORMAL_WINDOW; 
                }

                return CLASS_MAXIMIZE_WINDOW;
            }

            function addOveray() {
                modalCount++;
                if (modalCount != 1)
                    return;

                var overlay = $("<div id='overlay' style='position: fixed; z-index:" + OVERALY_Z_INDEX
                                + "; top: 0px; left: 0px; height:100%; width:100%; background: #000; display: none;'></div>");
                $("body").append(overlay);
                $('#overlay').css({
                    'display': 'block',
                    opacity: 0
                });

                $('#overlay').fadeTo(200, 0.5);
            }

            function removeOverlay() {
                modalCount--;

                if (modalCount != 0)
                    return;

                $('#overlay').fadeOut("fast", function() {
                    $('#overlay').remove();
                });
            }

            function makeWindowByHtml(id, title, html, width, height, modal, sub) {
                var resizeButtonClass = getResizeButtonClass();
                var top = ["<div class='", CLASS_SUB_TOP, "' " + PROPERTY_LAYOUT + "='horizontal' vertical-align='middle' horizontal-align='right' width='100%'>",
                        "<h3 width='100%' id='", id, "title' class='title' style='text-overflow: ellipsis; white-space: nowrap; overflow: hidden;'>", title, "</h3>", 
                        "<button id='", id, CLASS_MINIMIZE_WINDOW, "' class='sub-button ",
                        CLASS_MINIMIZE_WINDOW, "'></button>", "<button id='", id, CLASS_RESIZE, "' class='sub-button ", resizeButtonClass, "'></button>",
                        "<button id='", id, CLASS_CLOSE, "' class='sub-button ", CLASS_CLOSE, "'></button>", "<span width='2px'></span>" + "</div>"];

                var body = ["<div id='", id, CLASS_SUB_BODY, "' class='sub-body' width='100%' height='100%' gap='2px' style='overflow-x:auto; overflow-y:hidden'></div>"];

                var bottom = ["<div class='sub-bottom' " + PROPERTY_LAYOUT + "='horizontal' vertical-align='middle' horizontal-align='right' width='100%' gap='0px'>",
                        "<span class='ui-resizable-se' id='", id, CLASS_RESIZE_POINT, "' width='16px' height='16px'></span>" + "</div>"];
                if (sub) {
                    bottom = [];
                }

                var size = getWindowSize(width, height, sub);
                var position = getWindowPosition(size, sub);

                var subWindow = ["<div class='", CLASS_SUB_WINDOW, "' id='" + id, "' " + PROPERTY_LAYOUT + "='vertical' gap='0px' width='", size.width + "px' height='" + size.height,
                        "px' " + "style='left:" + position.left, "px;top:" + position.top + "px'>", top.join(""), body.join(""), bottom.join(""), "</div>"];

                currentContainer.append(subWindow.join(""));
                $("#" + id + CLASS_SUB_BODY).append(html);

                if (sub == true) {
                    $("#" + id + CLASS_MINIMIZE_WINDOW).remove();
                    $("#" + id + CLASS_RESIZE).remove();
                    $("#" + id + CLASS_RESIZE_POINT).remove();
                }

                windowMap[id].window = $("#" + id);
                windowMap[id].title = title;
                windowMap[id].modal = modal;
                windowMap[id].window.css("position", "absolute");

                validLayout(id);
              
                return windowMap[id];
            }

            function draggableSubwindow(subWindow) {
                subWindow.window.draggable({
                    containment: currentContainer,
                    scroll: true,
                    handle: 'div.sub-top',
                    stop: function(e, ui) {
                        var css = {};
                        if (ui.offset.top < 0)
                            css["top"] = "0px";
                        if (ui.offset.left < 0)
                            css["left"] = "0px";
                        
                        subWindow.window.css(css);
                    }
                });
            }

            function resizableSubWindow(subWindow) {
                subWindow.window.resizable({
                    handles: {
                        se: $("#" + subWindow.id + CLASS_RESIZE_POINT)
                    },
                    minWidth: 200,
                    minHeight: 200,
                    delay: 150,
                    start: function(e, ui) {
                        ui.helper.css("z-index", 999999);
                    },
                    resize: function(e, ui) {
                        if (ui.helper.outerHeight() > currentContainer.outerHeight())
                            ui.helper.outerHeight(currentContainer.outerHeight());

                        if (ui.helper.outerWidth() > currentContainer.outerWidth())
                            ui.helper.outerWidth(currentContainer.outerWidth());
                    },
                    stop: function(e, ui) {
                    	var h = ui.helper.outerHeight();
                    	var w = ui.helper.outerWidth();
                    	if (h > currentContainer.outerHeight()) {
                    		h = currentContainer.outerHeight();
                    	}
                    	if (w > currentContainer.outerWidth()) {
                    		w = currentContainer.outerWidth();
                    	}
                        $(this).attr({"height": h+ "px", "width": w + "px"});
                        
                        invalidLayout(subWindow.id);
                        
                        lock = true;
                        $(window).resize();
                    },
                    helper: "ui-resizable-helper"
                });
            }

            function setWindowMax(subWindow) {
                subWindow.window.attr({"height": "99%", "width": "99%"});
                subWindow.window.css({"left": "0px", "top": "0px"});

                subWindow.window.draggable("disable");
                subWindow.window.resizable("disable");
                subWindow.status = STATUS_MAXIMIZE;

                var sc = $("#" + subWindow.id + CLASS_RESIZE_POINT);
                sc.css("display", "none");
                sc.hide();
                
                var sr = $("#" + subWindow.id + CLASS_RESIZE)
                sr.attr('class', sr.attr('class').replace(CLASS_MAXIMIZE_WINDOW, CLASS_NORMAL_WINDOW));

                subWindow.window.trigger(EVENT_RESIZE, subWindow.window);
                validLayout(subWindow.id);

                lock = true;
                $(window).resize();
            }

            function setWindowNormal(subWindow) {
                subWindow.window.draggable("enable");
                subWindow.window.resizable("enable");
                subWindow.status = STATUS_NORMAL;

                var sp = $("#" + subWindow.id + CLASS_RESIZE_POINT);
                sp.css("display", "block");
                sp.show();
                
                var sr = $("#" + subWindow.id + CLASS_RESIZE);
                sr.attr('class', sr.attr('class').replace(CLASS_NORMAL_WINDOW, CLASS_MAXIMIZE_WINDOW));

                subWindow.window.trigger(EVENT_RESIZE, subWindow.window);
                validLayout(subWindow.id);

                lock = true;
                $(window).resize();
            }

            function maxizableSubWindow(subWindow) {
                var resize = $("#" + subWindow.id + CLASS_RESIZE);

                resize.click(function() {
                    if ($(this).attr('class').indexOf(CLASS_MAXIMIZE_WINDOW) > -1) {
                        subWindow.preWidth = subWindow.window.outerWidth();
                        subWindow.preHeight = subWindow.window.outerHeight();
                        subWindow.preLeft = subWindow.window.css("left");
                        subWindow.preTop = subWindow.window.css("top");

                        setWindowMax(subWindow);
                    } else {
                        subWindow.window.attr({"width": subWindow.preWidth + "px", "height": subWindow.preHeight + "px"});
                        subWindow.window.css({"left": subWindow.preLeft  + "px", "top": subWindow.preTop + "px"});                   
                        setWindowNormal(subWindow);
                    }
                });
            }

            function minimizableSubWindow(subWindow) {
                var minimize = $("#" + subWindow.id + CLASS_MINIMIZE_WINDOW);

                minimize.click(function() {
                    subWindow.window.fadeOut("fast");
                    setHideCurrentWindow(subWindow);

                    var taskBarButton = $("#" + subWindow.id + CLASS_TASKBAR_BUTTON_NORMAL);
                    taskBarButton.attr('class', CLASS_TASKBAR_BUTTON_HIDDEN);
                });
            }

            function closableSubWindow(subWindow, modal) {
                $("#" + subWindow.id + CLASS_CLOSE).click(function() {
                    closeWindow(subWindow, modal);
                });
            }

            function bringFrontableSubWindow(subWindow) {
                subWindow.window.mousedown(function() {
                    setCurrentWindow(subWindow.id);
                });
            }

            function addTaskBarSummary() {
                if (windowList.length == 0)
                    return;
                
                var taskBar = $("#" + CLASS_TASKBAR);
                if (!taskBar)
                    return;

                var refreshFlag = false;
                
                var btnID = CLASS_TASKBAR + "_summary";
                var summaryBtn = $("#" + btnID);                
                if (summaryBtn && summaryBtn.length > 0) {
                    summaryBtn.remove();
                    refreshFlag = true;
                }
                
                var list = getSummaryContextMenu(taskBar);
                if (list.length > 0) {
                    addSummaryContextMenu(taskBar, list);
                    refreshFlag = true;
                }

                if (refreshFlag) {
                    validLayout(CLASS_TASKBAR);
                }
            }
            
            function getSummaryVislbleCount(taskBar, children) {
                var taskBarWidth = taskBar.outerWidth();
                var gap = parseInt(taskBar.attr("gap"));
                if (isNaN(gap))
                    gap = 0;
                
                taskBarWidth -= (parseInt(getStyleSheetPropertyValue("." + CLASS_TASKBAR_BUTTON_SUMMARY, 'width')) + gap);
                
                var totalSize = 0;
                var visibleSize = 0;
                for (var i = 0, l = children.length; i < l; i++) {
                    var element = $(children[i]);
                    
                    totalSize += (element.outerWidth() + gap);
                    if (taskBarWidth > totalSize)
                        visibleSize++;

                    element.show();
                    element.removeAttr("use-layout");
                }
                
                return visibleSize;
            }
            
            function getSummaryContextMenu(taskBar, children) { 
                var children = taskBar.children();
                var length = children.length;

                var visibleSize = getSummaryVislbleCount(taskBar, children);
                if (visibleSize == length)
                    return [];
                
                for (var q = 0; q < length; q++) {
                   if ($(children[q]).attr("class") == CLASS_TASKBAR_BUTTON_SELECT && q > visibleSize-1) {                      
                       for (var g=0; g < length - visibleSize; g++) {
                           var firstElement = $(children[0]); 
                           var d = $("<div id='swap_dummy'></div>").insertAfter($(children[length-1]));
                           d.replaceWith(firstElement);
                           
                           children = taskBar.children();
                       }
                       break;
                   }
                }
                
                children = taskBar.children();
                
                var list = [];
                var showList = [];
                var hideList = [];
                for (var j = 0; j < length; j++) {
                    var element = $(children[j]);
                    if (j < visibleSize) {
                        showList.push("<li data-id='" + element.attr("id") + "'><a href=''>" + element.text() + "</a></li>");
                    } else {
                        element.hide();
                        element.attr({"use-layout":"false", "left": "0px"});
                        hideList.push("<li data-id='" + element.attr("id") + "'><a href='' data-id='" + element.attr("id") + "' style='font-weight:bold'>" + element.text() + "</a></li>");
                    }
                }  
                
                list = hideList.concat(showList);
                
                return list;
            }
            
            function addSummaryContextMenu(taskBar, list) {
                var btnID = CLASS_TASKBAR + "_summary";
                var btn = ["<button id='", btnID, "' class='", CLASS_TASKBAR_BUTTON_SUMMARY, "'>", "</button>"];
                taskBar.append(btn.join(""));

                var summaryBtn = $("#" + btnID);
                summaryBtn.click(function() {
                    var cc = $("#summary-context");
                    if (!cc || cc.length > 0)
                        cc.remove();

                    var c = ["<div id='summary-context' class='", CLASS_TASKBAR_CONTEXT_MENU, 
                             "' use-layout='false' style='z-index:999999999'>", "<ul class='", 
                             CLASS_TASKBAR_CONTEXT_MENU_LIST, "'>",
                            list.join(""), "</ul>", "</div>"];

                    $("body").append(c.join(""));

                    var t = summaryBtn.offset().top;
                    var l = summaryBtn.offset().left;

                    cc = $("#summary-context");
                    cc.offset({
                        top: t + (summaryBtn.outerHeight() + 5),
                        left: l - (cc.outerWidth() / 2) + summaryBtn.outerWidth() / 2
                    });
                    
                    $("body").on("click", onRemoveContextMenu);
                    $("#summary-context li").click(onSelectContextMenu);
                });    
                
                validLayout(CLASS_TASKBAR);
            }
            
            function onSelectContextMenu(e) {
                e.preventDefault();
                e.stopPropagation();
                
                var cc = $("#summary-context");
                if (!cc || cc.length > 0)
                    cc.remove();
                
                var a = e.currentTarget;
                var id = $(a).attr("data-id");
                if (!id)
                    return;
                
                id = id.replace(CLASS_TASKBAR_BUTTON_NORMAL, "");
                setCurrentWindow(id);
                addTaskBarSummary();
            }
            
            function onRemoveContextMenu(e) {
                if ($(e.target).attr("id") == CLASS_TASKBAR + "_summary")
                    return;
                
                var cc = $("#summary-context");
                if (!cc || cc.length > 0)
                    cc.remove();
                
                $("body").off("click", onRemoveContextMenu);
            }
            
            function addTaskBarButton(subWindow) {
                var button = ["<div id='" + subWindow.id, CLASS_TASKBAR_BUTTON_NORMAL, "' class='", CLASS_TASKBAR_BUTTON_NORMAL, "'>", "<button title='",
                        subWindow.title, "' id='", subWindow.id, CLASS_TASKBAR_BUTTON_LABEL, "' class='", CLASS_TASKBAR_BUTTON_LABEL, "'>" + subWindow.title,
                        "</button>" + "<button id='", subWindow.id, CLASS_TASKBAR_BUTTON_CLOSE, "' class='", CLASS_TASKBAR_BUTTON_CLOSE,
                        "'></button>" + "</div>"];

                $("#" + CLASS_TASKBAR).append(button.join(""));

                var taskBarButton = $("#" + subWindow.id + CLASS_TASKBAR_BUTTON_NORMAL);
                taskBarButton.click(function(e) {
                    // close button
                    if (e.target.id == (subWindow.id + CLASS_TASKBAR_BUTTON_CLOSE)) {
                        closeWindow(subWindow, subWindow.modal);
                        return;
                    }

                    // taskbar button
                    if (taskBarButton.attr('class') == CLASS_TASKBAR_BUTTON_HIDDEN) {
                        subWindow.window.fadeIn("fast");
                        taskBarButton.attr('class', CLASS_TASKBAR_BUTTON_NORMAL);
                        setCurrentWindow(subWindow.id);
                        invalidLayout(subWindow.id);
                        subWindow.window.trigger(EVENT_RESTORE, subWindow.window);
                    } else {
                        if (currentWindow == subWindow.window) {
                            subWindow.window.fadeOut("fast");
                            taskBarButton.attr('class', CLASS_TASKBAR_BUTTON_HIDDEN);
                            setHideCurrentWindow(subWindow);
                            subWindow.window.trigger(EVENT_HIDE, subWindow.window);
                        } else {
                            setCurrentWindow(subWindow.id);
                        }
                    }
                });

                invalidLayout(CLASS_TASKBAR);
            }

            function removeTaskBarButton(id) {
                $("#" + id + CLASS_TASKBAR_BUTTON_NORMAL).remove();
                invalidLayout(CLASS_TASKBAR);
            }

            function addWindowList(id) {
                if (windowMap[id] != undefined)
                    return false;

                var subWindow = {
                    id: id,
                    title: '',
                    window: null,
                    layout: null,
                    modal: null,
                    data: null,
                    status: STATUS_NORMAL,
                    preWidth: settings.currentWidth,
                    preHeight: settings.currentHeight,
                    preLeft: 0,
                    preTop: 0
                };

                windowMap[id] = subWindow;
                return true;
            }

            function removeWindowList(id) {
                delete windowMap[id];
                var l = windowList.length;
                for (var i = 0; i < l; i++) {
                    if (windowList[i].attr('id') == id) {
                        delete windowList[i];
                        windowList.splice(i, 1);
                        break;
                    }
                }
            }

            // 창을 닫는다
            function closeWindow(subWindow, modal) {
                setHideCurrentWindow(subWindow);

                removeWindowList(subWindow.id);
                removeTaskBarButton(subWindow.id);

                if (modal == true) {
                    removeOverlay();
                }
                
                addTaskBarSummary();
                
                $(subWindow.window).trigger(EVENT_CLOSE, subWindow.window);
                subWindow.window.fadeOut("fast", function() {
                    subWindow.window.remove();
                });
            }
            
            function addWindow(id, title, html, width, height, modal, sub) {
                if (settings.maxWindows < windowList.length + 1)
                    return null;
                
                if (!addWindowList(id)) {
                    setCurrentWindow(id);
                    return null;
                }

                var subWindow = makeWindowByHtml(id, title, html, width, height, modal, sub);
                draggableSubwindow(subWindow);
                closableSubWindow(subWindow, modal);
                bringFrontableSubWindow(subWindow);

                windowList.push(subWindow.window);

                if (sub != true) {
                    resizableSubWindow(subWindow);
                    maxizableSubWindow(subWindow);
                    minimizableSubWindow(subWindow);
                    addTaskBarButton(subWindow);
                    
                    if (settings.showMode == OPTION_SHOWMODE_MAX) {
                        setWindowMax(subWindow);
                    } 
                }

                if (modal == true) {
                    addOveray();
                }

                setCurrentWindow(subWindow.id);
               
                addTaskBarSummary();
                
                return subWindow;
            }

            function onResizeLayoutComplete(e, data) {
                if (data == null) {
                    $(window).unbind("resize-layout-complete", onResizeLayoutComplete);
                    addTaskBarSummary();
                }
            }
            
            function onResizeContainer(e, data) {
                if (lock) {
                    lock = false;
                    return;
                }
                
                $(window).bind("resize-layout-complete", onResizeLayoutComplete);
            }

            function initialize(baseContainer) {
                var container = ["<div id='mdi-container' width='100%' height='100%'",
                        "vertical-scrollbar-policy='auto' horizontal-scrollbar-policy='auto' min-width='", settings.currentWidth, "' min-height='",
                        (settings.currentHeight + settings.currentTaskBarHeight), "'></div>"];
                baseContainer.append(container.join(""));

                if (settings.taskBar) {
                    CLASS_TASKBAR = settings.taskBar;
                    settings.currentTaskBarHeight = 0;
                } else {
                    var taskBar = ["<div id='", CLASS_TASKBAR, "' width='100%' height='", settings.currentTaskBarHeight, "px' vertical-scrollbar-policy='",
                            settings.verticalScrollbarPolicy, "horizontal-scrollbar-policy='", settings.horizontalScrollbarPolicy,
                            "' " + PROPERTY_LAYOUT + "='horizontal' vertical-align='bottom' gap='3px' style='margin-left: -3px'></div>"];
                    baseContainer.append(taskBar.join(""));
                }

                baseContainer.attr("layout", "vertical");
                currentContainer = $("#mdi-container");
                
                $(window).resize(onResizeContainer);               
                
                invalidLayout();
            }

            // HTML 코드를 내장한 윈도우 생성
            function addWindowByHtml(id, title, html, data, width, height, modal, sub) {
                var subWindow = addWindow(id, title, html, width, height, modal, sub);
                if (subWindow == null) {
                    return null;
                }
                
                subWindow.data = data;
                return subWindow;
            }

            // 주소를 통해서 값을 받아오는 윈도우 생성
            function addWindowByUrl(id, title, url, data, width, height, modal, sub) {
                var subWindow = addWindow(id, title, "", width, height, modal, sub);
                if (subWindow == null) {
                    return null;
                }
                
                subWindow.data = data;

                $.get(url, null).done(function(data) {
                    $("#" + id + CLASS_SUB_BODY).append(data);
                    validLayout(id);
                }).fail(function() {
                    alert("error");
                });

                return subWindow;
            }

            // 윈도우 정보를 반환 한다
            function getWindow(id) {
                var subWindow = windowMap[id];
                return subWindow;
            }
            
            // 모든 MDI 창을 닫는다
            function closeAll() {
                var l = windowList.length;
                for (var i = 0; i < l; i++) {
                	var id = windowList[i].attr('id');
                	removeTaskBarButton(id);
                	windowList[i].remove();
                }     
                
                windowList = [];
                windowMap = {};
                
                $("#" + CLASS_TASKBAR + "_summary").remove();
                $("#" + CLASS_TASKBAR_CONTEXT_MENU).remove();
                
                $(window).trigger(EVENT_CLOSE_ALL);
            }

            // namespae
            if (settings.namespace) {
            	var namespace = settings.namespace;
            	if(namespace.layout) {
            		PROPERTY_LAYOUT = namespace.layout;
            	}
            }
            
            initialize($(this[0]));
            
            // functions
            $.addWindowByHtml = function(id, title, html, data, width, height, modal, sub) {
                return addWindowByHtml(id, title, html, data, width, height, modal, sub);
            }
            $.addWindowByUrl = function(id, title, url, data, width, height, modal, sub) {
                return addWindowByUrl(id, title, url, data, width, height, modal, sub);
            }
            $.getWindow = function(id) {
                return getWindow(id);
            }
            $.getCurrentWindow = function() {
                if (!currentWindow) {
                    return null;
                }
                
                return getWindow(currentWindow.attr("id"));
            }
            $.closeWindow = function(id) {
                var subWindow = getWindow(id);
                if (subWindow == undefined) {
                    return;
                }

                closeWindow(subWindow, subWindow.modal);
            }
            $.getWindowCount = function() {
                return windowList.length;
            }
            $.setWindowTitle = function(id, title) {
                var window = getWindow(id);
                if (!window) {
                    return;
                }
                
                // mdi-titlebar
                window.title = title;
                $("#" + window.id + "title").text(title);

                // mdi-taskbutton
                var t = $("#" + window.id + CLASS_TASKBAR_BUTTON_LABEL);
                t.attr("title", title);
                t.html(title);
            }
            $.setFocusWindow = function(id) {
                setCurrentWindow(id);
            }
            $.closeAllWindow = function() {
            	closeAll();
            }
        }
    });
})(jQuery);