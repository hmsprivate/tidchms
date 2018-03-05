var _spinner = null;
var _spinnerTarget = null;

function makeSpin() {
    if (_spinner != null) return;

    var opts = {
        lines: 12, // The number of lines to draw
        length: 19, // The length of each line
        width: 10, // The line thickness
        radius: 30, // The radius of the inner circle
        corners: 1, // Corner roundness (0..1)
        rotate: 0, // The rotation offset
        direction: 1, // 1: clockwise, -1: counterclockwise
        color: '#000', // #rgb or #rrggbb or array of colors
        speed: 1, // Rounds per second
        trail: 60, // Afterglow percentage
        shadow: false, // Whether to render a shadow
        hwaccel: true, // Whether to use hardware acceleration
        className: 'spinner', // The CSS class to assign to the spinner
        zIndex: 2e9, // The z-index (defaults to 2000000000)
        top: '50%', // Top position relative to parent
        left: '50%', // Left position relative to parent
        scale: 0.5
    };

    _spinnerTarget = document.getElementById('indicator');
    _spinner = new Spinner(opts).spin(_spinnerTarget);
}

var _indicatorCount = [];
var _indicatorTime = null;
var _blockUI = null;
function showIndicator() {
	if (_indicatorCount.length == 0) {
	    
	    if (!_blockUI) {
    	    _blockUI = $.blockUI({
    	        message: null,
    	        overlayCSS:  { 
    	            opacity: 0
    	        }   	   
    	    });
	    }
	    
	    makeSpin();

	    _spinner.spin(_spinnerTarget);
	    
	    _indicatorTime = setInterval(function() {
	    	_indicatorCount = [];
	    	console.log("TIMEOUT INDICATOR",  _indicatorCount.length);
	        hideIndicator();
	    }, 90000);	    
	}
	
    _indicatorCount.push(new Date());
}

function hideIndicator() {	
	clearInterval(_indicatorTime);
	
	_indicatorCount.pop();
	
	if (_indicatorCount.length != 0) {
		return;
	}
	
    $.unblockUI();
    _blockUI = null;
    _spinner.stop(_spinnerTarget);
}

function lazyHideIndicator() {
    setTimeout(function() {
        hideIndicator();
    }, 300);
}

function sel(parentID, childID) {
    var id = "#" + parentID;
    if (childID != undefined && childID != "")
    id += " #" + childID;

    return $(id);
}

function __ap($scope) {
    try {
        $scope.$digest();
    } catch(e) {}
}

function ap($scope) {
    __ap($scope);
}

function camelCase( s ) {
	  return s.replace(/\-(\w)/g, function(i, m) {
		return m.toUpperCase();
	});
}

function camelToUnderscore(s) {
	return s.replace(/([A-Z])/g, function($1){return "_"+$1.toLowerCase();});
}

function objectJoin(obj, sep) {
    var arr = [], p, i = 0;
    for (p in obj)
        arr[i++] = obj[p];
    return arr.join(sep);
}

function getStyleSheetPropertyValue(selectorText, propertyName) {
    for (var s= document.styleSheets.length - 1; s >= 0; s--) {
        var cssRules = document.styleSheets[s].cssRules ||
                document.styleSheets[s].rules || [];
        for (var c=0; c < cssRules.length; c++) {
            if (cssRules[c].selectorText === selectorText) 
                return cssRules[c].style[propertyName];
        }
    }
    return null;
}

function changeObjectValue(source, target) {
	if (!source || !target) {
		return source;
	}
	
	for (var key in source) {
		if (!target.hasOwnProperty(key)) {
			continue;
		}
		
		source[key] = target[key];
	}
	
	return source;
}

function lowerCaseToUpperCase(list, field) {
	if (!list || list.lenght ==0) {
		return list;
	}
	
	for (var i=0, l=list.length; i < l; i++) {
		var v = list[i][field];
		if (!v || v == "") {
			continue;
		}
		
		list[i][field] = v.toUpperCase();
	}
	
	return list;
}

function isParent(parentID, child) {
    var p = child.parentNode
    if (!p || p.tagName == "BODY") {
        return false;
    }

    var ret = false;
    if (p.id == parentID) {
        ret =  true;
    } else {
        ret = isParent(parentID, p);
    }
    
    return ret
}

function fastParseNumber(value) {
	return +value;
}

function abbreviateNum(number, decPlaces) {
   if (isNaN(number)) {
       return 0;
   }
    
	decPlaces = Math.pow(10,decPlaces);
    var abbrev = [ "k", "m", "b", "t", "K", "M", "B", "T"];

    for (var i=abbrev.length-1; i>=0; i--) {
        var size = Math.pow(10,(i+1)*3);
        if(size <= number) {
             number = Math.round(number*decPlaces/size)/decPlaces;
             if((number == 1000) && (i < abbrev.length - 1)) {
                 number = 1;
                 i++;
             }
             number += abbrev[i];
             break;
        }
    }
    return number;
}

function releaseNum(abbrNum) {
	if(abbrNum == null || abbrNum == "")
		return 0;
	
	abbrNum = abbrNum.toString();

    var abbrev = {
    	'k': '000',
    	'm': '000000',
    	'b': '000000000',
    	't': '000000000000',
        'K': '000',
        'M': '000000',
        'B': '000000000',
        'T': '000000000000'    	
    };
    
    var s = abbrNum.match(/[A-Za-z]/);
    if(abbrev.hasOwnProperty(s)) {
        abbrNum = abbrNum.replace(s, abbrev[s]);
    }
    return parseFloat(abbrNum);
}

function serializeData(data) {
    if (!angular.isObject(data)) { return ((data == null) ? "" : data.toString()); }

	var buffer = [];
	for ( var name in data) {
		if (!data.hasOwnProperty(name)) {
			continue;
		}
		
		var value = data[name];
		buffer.push(encodeURIComponent(name) + "=" + encodeURIComponent((value == null) ? "" : value));
	}
	
	var source = buffer.join("&").replace(/%20/g, "+");
    return (source);
}

//unixtime 변환
function convertUnixTime(timestamp){
	var date = new Date(timestamp*1000);
	var year = date.getFullYear();
	var mm = ('0' + (date.getMonth() + 1)).slice(-2);
	var dd = ('0' + date.getDate()).slice(-2);
	var hours = date.getHours();
	var minutes = "0" + date.getMinutes();
	var seconds = "0" + date.getSeconds();
	var formattedTime = year + "/" + mm + "/" + dd + " " + hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
	
	return formattedTime;
}



	jQuery(function(){
		
		var	ck_mnu_idx = "99"//sequence number 값

		// load시 on 상태 체크
		$(document).ready(function () {
			//alert("ready="+ck_mnu_idx);
			$("#gnb > ul > li").eq(ck_mnu_idx).addClass("on");
		});
		
		$(document).keydown(function (e) {
           /* if (e.which === 116) {
                if (typeof event == "object") {
                	//$(this).addClass("on")
                	ck_mnu_idx = ck_mnu_idx;
                	alert("1="+ck_mnu_idx);
                    //event.keyCode = 0;
                }
                //return false;
            } else if (e.which === 82 && e.ctrlKey) {
            	//$(this).addClass("on").siblings().removeClass("on");
            	alert("2="+ck_mnu_idx);
                //return false;
            }*/
		}); 
		

		//nav	
		var $gnb = $("#gnb"),
			$gnbList = $("#gnb > ul > li"),
			$main = $("#main");

	    $gnbList.on({
	        mouseover: function() {
	        	//자식 없는것때문에 안보였다 보이게
	        	$gnbList.find(".gnb-menu").css("display", "none");
	        	$(this).find(".gnb-menu").css("display", "block");
	            //$(this).find(".gnb-menu").slideDown("200").end().siblings().find(".gnb-menu").slideUp("100");
	            $(this).addClass("on").siblings().removeClass("on");
	        },
	        click: function() {
	            $(this).addClass("on").siblings().removeClass("on");
	            ck_mnu_idx = $(this).index();// 클릭된 값을 지정
	        }
	    });

	    $gnb.on({
	        mouseleave: function() {
	        	$gnbList.find(".gnb-menu").css("display", "none");
	            //$gnbList.find(".gnb-menu").slideUp("100");
	            $gnbList.removeClass("on");
	            $gnbList.eq(ck_mnu_idx).addClass("on");// 현재
	        }
	    });
	    
	    $main.on({
	        click: function() {
	        	$gnbList.removeClass("on");
	            ck_mnu_idx = 99;// 클릭된 값을 지정
	        }
	    });

		//util 분리	
		var $util = $(".util"),
			$utilList = $(".util > ul > li");

	    $utilList.on({
	        mouseover: function() {
	        	//자식 없는것때문에 안보였다 보이게
	        	$utilList.find(".util-menu").css("display", "none");
	        	$(this).find(".util-menu").css("display", "block");
	            $(this).addClass("on").siblings().removeClass("on");
	        },
	        click: function() {
	            $(this).addClass("on").siblings().removeClass("on");
	        }
	    });

	    $util.on({
	        mouseleave: function() {
	        	$utilList.find(".util-menu").css("display", "none");
	            $utilList.removeClass("on");
	        }
	    });
		
		//grid
		$(".grid-tbl-body table tr td").on("click", function() {
			$(this).parent().addClass("on").siblings().removeClass("on");
		});

		//tabmenu
		$(function() { 
			var tabs = $(".tab-menu li a");
			var conts = $(".tab-cont");

			$(conts).eq(0).show();
			
			$(tabs).on("click" , function(){
				$(conts).hide();
				$(conts).eq($(this).parent().index()).show();
				$(this).parent().addClass("on").siblings().removeClass("on");
			});	
		})


		//Datepicker
		$(function() {
			$( ".date" ).datepicker({
					showOn:"both", //이미지로 사용 button , both : 엘리먼트와 이미지 동시사용
					buttonText: "",
					dateFormat: 'yy-mm-dd'//2017-03-31 MOD ko용
			});
		});
		
		//SelectBox
		var sct_index = 1;	
		$.fn.onmSelect = function(option){
			var option = $.extend({}, $.fn.onmSelect.option, option); 
			return this.each(function(idx){
			var select_root = $(this),
				select_ul = $('ul', select_root),
				select_curr = $('.'+option.currentClass, select_root),
				select_open = $('.'+option.openClass, select_root),
				select_a = $('li>a', select_root),
				select_input = $('li>input', select_root),
				select_label = $('li>label', select_root);
			if(select_root.hasClass('multi')) var Multi = true;
			if(select_root.hasClass('clicked')) var clicked = true;
			
			function currIn(){
				select_root.addClass(option.focusClass);
			}
			function currOut(){
				select_root.removeClass(option.focusClass);
			}
			function hoverOpt(){
				$(this).parent('li').toggleClass(option.overClass).siblings().removeClass(option.overClass);
			}
			function showOpt(){
				select_a.parent('li').removeClass(option.overClass);
				select_root.toggleClass(option.onClass);
				return false;
			}
			function hideOpt(){
//				if(Multi != true){
					setTimeout(function(){select_root.removeClass(option.onClass);}, 2);
//				}
			}
			function choiceOpt(){
				var curr_txt = (select_label.size()>0) ? $(this).siblings('label').text() : $(this).text();
			
				if(Multi != true){
					$('.'+option.currentClass, select_root).text(curr_txt).removeClass(option.focusClass);
					$(this).parent('li').addClass(option.onClass).siblings().removeClass(option.onClass);
				}else {
					if($(this).attr('disabled') != 'disabled'){
						$(this).parent('li').toggleClass(option.onClass);
					}
				}
			}

			//select option tab을 하면 select를 닫기
			select_ul.keydown(function(){
				if(event.keyCode==9){
					if(sct_index == select_a.length){
						currOut();select_root.removeClass(option.onClass);
						sct_index = 1;
					}else{
						sct_index += 1;
					}
					
				}
			})
			
			select_root.mouseleave(function(){
				if(clicked != true) {
					currOut();select_root.removeClass(option.onClass);
				}
			});
			select_open.on({click:showOpt});
			// Link select 
			//select_curr.on({click:showOpt, focusin:currIn, focusout:currOut});		
			//dis
			if (select_curr.parent().hasClass('dis') == false)	 {
				select_curr.on({click:showOpt, focusin:currIn, focusout:currOut});
				}else{
				select_curr.on({click:hideOpt, focusin:currIn, focusout:currOut});
			}
			select_a.click(choiceOpt).click(hideOpt).focus(hoverOpt).hover(hoverOpt);
			// Form select
			select_input.change(choiceOpt).focusin(currIn).focusout(currOut);
			select_label.hover(hoverOpt).click(choiceOpt).click(hideOpt);
			});
		};
		$.fn.onmSelect.option = {
			currentClass	: 'current',
			openClass	: 'arrow',
			onClass		: 'on',
			overClass	: 'over',	
			//focusClass	: 'focus'
		};
		$('div[class^=selectbox]').onmSelect();

		var br_type = null;

		
	});