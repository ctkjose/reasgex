
///@ui_select

ui_widgets.ui_select = new ui_widget("ui_select");
ui_widgets.ui_select.initWithElement = function(o){
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
ui_widgets.ui_select.register = function(){
	return {
		"provide-expand": ["div.select"],
		"privide-data": true,
		"expand-needs": ["ui_table"],
	};
}
ui_widgets.ui_select.expandElement = function(o){
	var n = o.attr("name");
	var v = '';
	
	
	if(o.attr("extended") ) return;
	if(o.data("ignore") && (o.data("ignore") == "1")) return;
	
	if (o.hasClass('multiple')) {
		in_type = "select multiple";
	}
	
	if (o.attr("default")) {
		v = o.attr("default");
	}
	
	var m_options = {};
	
	if (o.attr("options")) {
		var ops = JSON.parse(o.attr("options"));
		for (var k in ops) {
			
			m_options[k] = ops[k];
		}
	}else if (o.attr("datasource")) {
		
	}
	
	var d = o;
	if( o.elmType() != "select" ){
		d = $('<select class="field" name="' + n + '"></select>');
		if (o.attr('data-with-code')) d.attr('data-with-code', o.attr('data-with-code'));
	}
	
	d.removeClass("select");
	
	d.addClass("uiw").addClass("ui_select");
	d.elmKey("uiw", "ui_select");
	
	var wg = ui_widgets.ui_select.instanceWithElement(d);
	
	d.attr('default', v);
	d.attr("extended", 1);

	
	wg.setOptions(m_options);
	
	
	if( o.attr("datasource") && ( o.elmType() != "select" ) ){
		
		var dsn = o.attr("datasource");
		
		var ds = ui_datasource_controller.getDatsourceWithName(dsn);
		
		if( (typeof ds != "undefined") && (ds.ready) ){
			wg.setOptionsWithDS(ds);
		}
		
		var fn = function(ds){
			wg.setOptionsWithDS(ds);
		};
		
		rea_controller.on("ds_changed_" + dsn, fn);
		d.elmKey("ds", o.attr("datasource"));
		o.removeAttr("datasource");
		
	}
	
	if( o.attr("scope") ) { d.elmKey("scope", o.attr("scope")); }
	
	wg.installEvents();

	if( o.elmType() != "select" ){
		o.replaceWith( d );	
	}
}