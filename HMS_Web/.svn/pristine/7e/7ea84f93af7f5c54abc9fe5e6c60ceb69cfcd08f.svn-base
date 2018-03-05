/* ---------------------------------------
	Filename: common.js
	Description : HMS
	Author	: mobigen
	date	: 2017-07-11
	비고 : UI기능용
   --------------------------------------- */ 
var	ck_mnu_idx = "1"//sequence number 값

// load시 on 상태 체크
$(document).ready(function () {
	$("#gnb > ul > li").eq(ck_mnu_idx).addClass("on");
});

jQuery(function(){	

	//nav	
	var $gnb = $("#gnb"),
		$gnbList = $("#gnb > ul > li");

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
	});


	//Datepicker
	$(function() {
		$( ".date" ).datepicker({
				showOn:"both", //이미지로 사용 button , both : 엘리먼트와 이미지 동시사용
				buttonText: "",
				dateFormat: 'yy-mm-dd'//2017-03-31 MOD ko용
		});
	});
	
//SelectBox 2017-07-13 DEL /2017-12-13 ADD

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
//			if(Multi != true){
				setTimeout(function(){select_root.removeClass(option.onClass);}, 2);
//			}
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




