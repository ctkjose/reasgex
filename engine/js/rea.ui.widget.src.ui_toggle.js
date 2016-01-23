
///@ui_toggle

ui_widgets.ui_toggle = new ui_widget("ui_toggle");
ui_widgets.ui_toggle.initWithElement = function(o){
	this.init(o);	
	var $this = this;
	var t = this.o.find(".edit-area");
	
}
ui_widgets.ui_toggle.setAttr = function(a, v){
	
	if(a == "ro"){
		if(v=="1"){
			this.o.addClass("disabled");
		}else if(this.o.attr("disabled")){
			this.o.removeClass("disabled");
		}
	}
	if(a == "title"){
		this.o.elmKey("o-title", v);
		this.o.attr("title", v);
	}
	if(a == "placeholder"){
		this.o.attr("placeholder", v);	
	}
}
ui_widgets.ui_toggle.getValue = function(){
	return this.o.elmKey("value");
}
ui_widgets.ui_toggle.setValue = function(value){
	var v = 0;
	v = (value) ? 1: 0;

	var tz = '0';
	if(v){
		this.o.removeClass("active");
		v = "0";
	}else{
		this.o.addClass("active");
		v = "1";
		tz = '44';
	}
	
	this.o.find(".toggle-handle").css({"transform": "translate3d(" + tz + "px, 0px, 0px)"} );
	this.o.elmKey("value", v);
}	
ui_widgets.ui_toggle.register = function(){
	return {
		"provide-expand": ["div.toggle"],
		"privide-data": true,
		"expand-needs": ["ui_table"],
	};
}
ui_widgets.ui_toggle.expandElement = function(o){
	var v = 0;
	var n = o.elmName();
	
	var scope = "default";
	if( o.attr("scope") ) { scope = o.attr("scope"); o.removeAttr("scope"); }
	
	if (o.attr("default")) {
		v = o.attr("default");
	}
	
	
	o.addClass("field").addClass("ui_toggle").addClass("uiw");
	o.elmKey("uiw", "ui_toggle");
	o.attr("extended", 1);
	
	var tz = '0';
	if(v == "1"){
		o.addClass("active");
		tz = '44';
	}
	
	o.elmKey("value", v);
	var th = $("<div class=\"toggle-handle\" style=\"transform: translate3d(" + tz + "px, 0px, 0px);\"></div>");
	
	o.append(th);
		
	
	var fn = function(e){
		var o = $(e.target);
		if(!o.hasClass("toggle")) o = o.closest(".toggle");
		
		
		var v = (o.elmKey("value")=="1") ? 1 : 0;
		
		var tz = '0';
		if(v){
			o.removeClass("active");
			v = "0";
		}else{
			o.addClass("active");
			v = "1";
			tz = '44';
		}
		
		o.find(".toggle-handle").css({"transform": "translate3d(" + tz + "px, 0px, 0px)"} );
		o.elmKey("value", v);
		
		var rvalue = false;
		rea_controller.dispatchEvent("uiw_event", {"action": "change","name": n, "event": e, "node": o, "rvalue":rvalue} );
	}
	
	o.on("click", fn);
}