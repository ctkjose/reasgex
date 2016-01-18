///@ui_options

ui_widgets.ui_options = new ui_widget("ui_options");
ui_widgets.ui_options.initWithElement = function(o){
	this.init(o);	
	
	
}
ui_widgets.ui_options.setAttr = function(a, v){
	
	if(a == "ro"){
		if(v == "1"){
			this.o.addClass("disabled");
		}else{
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
ui_widgets.ui_options.getValue = function(){
	var v = this.o.elmKey("value");
	if(!v || (typeof v != "string")) return [];
	return v.split(",");
}
ui_widgets.ui_options.setValue = function(value){
	
	var v = [];
	if( Array.isArray(value) ){
		v = value;
	}else if(typeof value == "string"){
		v = value.split(",");
	}
	
	var out = [];
	var mc = 9999; var mi = 0;
	if(this.o.attr("max-options")) mc = this.o.attr("max-options");
	this.o.find(".edit-option").each(function(){
		var op = $(this);
		
		var opv = op.attr("value");
		if((v.indexOf(opv) >= 0) && (mi < mc)){
			mi++;
			op.addClass("active");
			out.push(opv);
		}else{
			op.removeClass("active");
		}
	});
	
	this.o.elmKey("value", out.join(","));
}