
///@ui_textbox

ui_widgets.ui_textbox = new ui_widget("ui_textbox");
ui_widgets.ui_textbox.initWithElement = function(o){
	console.log("@ui_textbox.initWithElement()");
	
	this.init(o);
};
ui_widgets.ui_textbox.setAttr = function(a, v){
	
	if(a == "ro"){
		if(v=="1"){
			this.o.addClass("disabled");
			this.o.attr("disabled", "disabled");
		}else if(this.o.attr("disabled")){
			this.o.removeClass("disabled");
			this.o.removeAttr("disabled");
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
ui_widgets.ui_textbox.getValue = function(){
	return this.o.val();
}
ui_widgets.ui_textbox.setValue = function(value){
	this.o.elmKey("value", value);
	this.o.val(value);
}
