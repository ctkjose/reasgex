
///@ui_select

ui_widgets.ui_select = new ui_widget("ui_select");
ui_widgets.ui_select.initWithElement = function(o){
	console.log("@ui_select.initWithElement()");
	
	this.init(o);
};
ui_widgets.ui_select.setAttr = function(a, v){
	
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
ui_widgets.ui_select.getValue = function(){
	return this.o.val();
}
ui_widgets.ui_select.setValue = function(value){
	this.o.elmKey("value", value);
	this.o.val(value);
}
ui_widgets.ui_select.setOptions = function(options){	
	var sc = (this.o.attr("data-with-code") && (this.o.attr("data-with-code") == "1") ) ? 1: 0;
	var v = this.o.val();
	if(!v){
		v = this.o.elmKey('value');
	}
	
	this.o.find("option").remove();
	
	var keys = Object.keys(options);
	for(var i=0; i<keys.length; i++){
		var k = keys[i];
		var caption = options[k];
		var selected = (v == k) ? ' selected ' : '';
		if (sc) caption = "(" + k + ") " + caption;
		var s = "<option value='" + k + "'" + selected + "> " + caption + "</option>";
		this.o.append(s);
	}
}
ui_widgets.ui_select.setOptionsWithDS = function(ds){
	//console.log("@ui_select.setOptionsWithDS()");
	if( (typeof ds != "object") || (!ds.hasOwnProperty("items")) ) return;
	if(!ds.items.hasOwnProperty("options")) return;
	
	this.setOptions(ds.items.options);
}