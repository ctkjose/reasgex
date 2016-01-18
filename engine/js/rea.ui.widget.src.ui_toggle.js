
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
