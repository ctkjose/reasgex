/** @module reasg/js/jquery extensions */

//JQUERY Extensions
jQuery.elm = function(e){
	
	var o = $( "[id=" + e +"]" );
	if (o.length) return o;
	
	o = $( "[name='" + e +"']" );
	if (o.length) return o;
	
	o = $( "[name^='" + e +"_']" );
	if (o.length) return o;
	
	return null;
}
jQuery.fn.elmForm = function(){
	return this.parents('form:first');
}
jQuery.fn.elmName = function(){
	var n = this.attr("name");
	if ((typeof n === typeof undefined) || (n === false)) {
		n = this.attr("id");
	}
	return n;
}
jQuery.fn.elmType = function(){
	if (this.attr("data-type")) return this.data("type").toLowerCase();
	if (this.attr("type")) return this.attr("type").toLowerCase();
	return this[0].tagName.toLowerCase();
};
jQuery.fn.elmTag = function(){
	return this.prop("tagName").toLowerCase();
};
jQuery.fn.elmKey = function(attr, val) {
	if(val){
		return this.attr('data-' + attr, val);
	}else{
		return this.attr('data-' + attr);
	}
	
};
jQuery.fn.elmHasKey = function(n){
	//return (typeof this.data(n) == "undefined") ? false : true;
	return (typeof this.attr('data-' + n) == "undefined") ? false : true;
};
jQuery.fn.elmHasOptions = function(){
	var t = this.elmType();
	if ( (t == "select") || (t == "checkbox") || (t == "radio") || (t == "check_yesno" ) || (t == "check_bool" )) {
		return true;
	}
	return false;
};
jQuery.fn.elmOptionsGet = function(){
	if(!this.elmHasOptions() ) return [];
	
	var t = this.elmType();
	var n = this.elmName();
	var a = [];
	
	if ( t == "select" ){
		var selected =this.o.find('option');
	}else{	
		var selected = $("input[name='" + n + "']"); //fix this, n could be an id
	}
	
	selected.each( function() {
		var ck = $(this);
		a.push(ck);
	});
	
	return a;
};


//Plugins for UI interactions

//A basic Popover/Modal Plugin
jQuery.fn.ui_popup = function(options){
	var e = this;	
	
	if (typeof options == "string"){
		var ops = e.data("popup-options");
		if(options == "close"){
			var mb = $("#modal-background");
			if(mb.length > 0) mb.removeClass("active");
			e.removeClass("in");
			e.hide();
		}
		
		return;
	}
	var ops = $.extend({
		'title' : null,
		'content' : '',
		'template' : '',
		'target' : null,
		'center' : false,
		'cssclass' : 'dialog',
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
		e.hide();
		return;
	}
	
	e.css("position","absolute");
	e.show();
	e.addClass("in").addClass(ops.cssclass);
	
	var h = e.outerHeight();
	var w = e.outerWidth();
	
	var $w = $(window);
	var fc = (ops.center || ($w.width() < 768)) ? true : false; //force center
	
	if(fc || !ops.target){
		var p  = {'top': 0, 'left': 0 };
		p.top = Math.max(0, (($w.height() - h) / 2) + $w.scrollTop());
		p.left = Math.max(0, (($w.width() - w) / 2) + $w.scrollLeft())
		
		e.animate({top: p.top + 'px', left: p.left + 'px'}, 0);
	}else{
		var p = ops.target.offset();
		e.animate({top: (p.top + ops.target.outerHeight())+ 'px', left: p.left + 'px'}, 0);
	}
}

jQuery.fn.ui_screenCenter = function() {
		var e = this;
		
		var $window = $(window);
		var $document = $(document);
		var winWidth = $window.width();
		var winHeight = $window.height();
		var scrollLeft = $document.scrollLeft();
		var scrollTop = $document.scrollTop();
		var boxWidth = e.outerWidth(true);
		var boxHeight = e.outerHeight(true);		

		e.css ({ left: (winWidth-boxWidth)/2+scrollLeft, top: (winHeight-boxHeight)/2+scrollTop });
}