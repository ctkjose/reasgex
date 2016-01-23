
///@ui_hidden

ui_widgets.ui_hidden = new ui_widget("ui_hidden");
ui_widgets.ui_hidden.initWithElement = function(o){
	this.init(o);
};
ui_widgets.ui_hidden.getValue = function(){
	if( this.o.attr('data-ignore') && (this.o.data('ignore')=='1')) return null;
	return this.o.val();
}
ui_widgets.ui_hidden.setValue = function(value){
	this.o.val(value);
}
ui_widgets.ui_hidden.register = function(){
	return {
		"provide-expand": ["input[type=hidden]","input.hidden"],
		"privide-data": true,
		"expand-needs": null,
	};
}
ui_widgets.ui_hidden.expandElement = function(o){
	var n = o.attr("name");

	var scope = "default";
	if(o.elmKey("expanded")) return;
	

	if( o.attr("scope") ) { scope = o.attr("scope"); o.removeAttr("scope"); }

	o.addClass("uiw").addClass("hidden").addClass("ui_hidden");
	
	if(o.hasClass("hidden")){
		o.attr("type", "hidden");
	}
	
	o.elmKey("uiw", "ui_hidden");
	if(scope != "default") o.elmKey("scope", scope);
	
	
}

///@ui_textbox
ui_widgets.ui_textbox = new ui_widget("ui_textbox");
ui_widgets.ui_textbox.initWithElement = function(o){
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
	if( this.o.attr('data-ignore') && (this.o.data('ignore')=='1')) return null;
	return this.o.val();
}
ui_widgets.ui_textbox.setValue = function(value){
	this.o.elmKey("value", value);
	this.o.val(value);
}


ui_widgets.ui_textbox.register = function(){
	return {
		"provide-expand": ["input.field"], //array with selectors I can expand
		"privide-data": true, //bool indicating if this widget provides data
		"expand-needs": ["ui_table"], //array of widgets I need before we expand
	};
}
ui_widgets.ui_textbox.expandElement = function(o){
	//console.log("@ui.checkbox.uiExpandTextBox()");			
	var n = o.attr("name");

	if(o.data("ignore") && (o.data("ignore") == "1")) return;
	
	var scope = "default";
	if( o.attr("scope") ) { scope = o.attr("scope"); o.removeAttr("scope"); }


	o.addClass("field");
	
	if(o.hasClass("email")){
		o.attr("type", "email");
	}else if(o.hasClass("password")){
		o.attr("type", "password");
	}else{
		o.attr("type", "text");
	}
	
	
	o.addClass("uiw");
	o.addClass("ui_textbox");
	o.elmKey("uiw", "ui_textbox");
	o.attr("extended", 1);
	
	if(scope != "default") o.elmKey("scope", scope);
	
	
	var wg = ui_widgets.ui_textbox.instanceWithElement(o);
	wg.installEvents();
}
