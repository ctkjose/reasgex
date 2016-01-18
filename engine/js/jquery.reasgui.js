/** @module reasg/js/jqueryui extensions */
/** @author Jose Cuevas */


//A basic Popover/Modal Plugin
jQuery.fn.uiPopup = function(options){
	var e = this;	
	
	if (typeof options == "string"){
		var ops = e.data("popup-options");
		if(options == "close"){
			var mb = $("#modal-background");
			if(mb.length > 0) mb.removeClass("active");
			e.removeClass("in");
		}
		
		return;
	}
	var ops = $.extend({
		'title' : null,
		'content' : '',
		'template' : '',
		'target' : null,
		'center' : false,
		'classcontent' : 'dialog',
		'modal': false,
	}, options );
	
	if(ops.modal){
		var mb = $("#modal-background");
		if(mb.length == 0){
			mb = $('<div id="modal-background"></div>');
			$('body').prepend(mb);
		}
		mb.addClass("active");
	}
	
	e.data("popup-options", ops);
	if( e.hasClass("in") ){
		e.removeClass("in");
		return;
	}
	
	e.css("position","absolute");
	//e.show();
	e.addClass("in").addClass(ops.classcontent);
	
	e.uiPosition(ops);
	
	
}

jQuery.fn.uiPosition = function(options) {
		var e = this;
		
		var ops = $.extend({
			'target' : null,
			'center' : false,
			'modal': false,
		}, options );
		
		
		var h = e.outerHeight();
		var w = e.outerWidth();
		
		var $w = $(window);
		var $d = $(document);
		var fc = (ops.center || ($w.width() < 768)) ? true : false; //force center
		
		if(fc || !ops.target){
			var p  = {'top': 0, 'left': 0 };
			p.top = Math.max(0, (($w.height() - h) / 2) + $d.scrollTop());
			p.left = Math.max(0, (($w.width() - w) / 2) + $d.scrollLeft())
			
			e.animate({top: p.top + 'px', left: p.left + 'px'}, 0);
		}else if(ops.target){
			console.log(ops.target);
			var p = ops.target.offset();
			e.animate({top: (p.top + ops.target.outerHeight())+ 'px', left: p.left + 'px'}, 0);
		}
		
}
