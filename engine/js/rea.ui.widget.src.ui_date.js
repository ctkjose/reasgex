
///@ui_date

ui_widgets.ui_date = new ui_widget("ui_date");
ui_widgets.ui_date.initWithElement = function(o){
	this.init(o);
};

ui_widgets.ui_date.setAttr = function(a, v){
	
	if(a == "ro"){
		if(v=="1"){
			this.o.attr("disabled", "disabled");
		}else if(this.o.attr("disabled")){
			this.o.removeAttr("disabled");
		}
	}
	if(a == "title"){
		this.o.elmKey("o-title", v);
		if(!this.o.attr("title")) this.o.attr("title", v);
	}
	if(a == "placeholder"){
		this.o.attr("placeholder", v);	
	}
}
ui_widgets.ui_date.getValue = function(){
	
	var v = this.o.val();
	var d = rea.types.date.create(v);
	var val = {};
	var n = this.o.elmName();
	
	if(v.length > 0) {
		val["multiple"] = true;
		val["record_type"] = "date";
		val["value"] = d.dateToHumanString();
		val["utc"] = d.toUTCString();
		val["iso"] = d.toISOString();
		val["json"] = d.toJSON();
		val["epoch"] = d.epoch();
		val["mysql"] = d.toMYSQLDateTime();
	
	}else{
		val = null;
	}
	
	return val;
}
ui_widgets.ui_date.setValue = function(value){
	
	var v = '';
	var ty = (typeof value);
	
	if( (ty == "string") ) {
		v = value;
	}
	var d = null;
	
	if( value instanceof Date){
		d = value;
	}else if(typeof value == "string"){
		d = rea.types.date.create(value);
	}
	
	if(!d) return;

	v = (d.getMonth()+1) + '/' + d.getDate() + '/' + d.getFullYear();
	this.o.attr("title", this.o.data("o-title") + "; Value " + v);
	
	this.o.elmKey("date", v);
	
	this.o.val(value);
}

ui_widgets.ui_date.register = function(){
	return {
		"provide-expand": [".date"],
		"privide-data": true,
		"expand-needs": ["ui_table"],
	};
}
ui_widgets.ui_date.expandElement = function(o){
	var n = o.attr("name");
	var scope = "default";
	if( o.attr("scope") ) { scope = o.attr("scope"); o.removeAttr("scope"); }
		
	if (o.attr('data-calendar')) {
		//t.attr("maxlength", 14);	
	}
	
	if (o.attr('class')) {
		data_class = o.attr('class');
	}
	
	var d = o;
	var t = o;
				
	if (!o.attr('placeholder')) o.attr('placeholder', 'M/D/YYYY');
	if (!o.attr('title')) o.attr('title', o.attr('placeholder'));
	o.elmKey("o-title", o.attr('title'));
	o.attr("extended", 1);
	
	t.addClass("uiw").addClass("ui_date").addClass("field");
	t.elmKey("uiw", "ui_date");
	
	if(o.hasClass("without-calendar")){
		
	}else{
		var d = $('<div class="input-group ui_date_frame" name="' + n + '_frame">');
		d.css({"max-width": "200px"});
		
		var bttn = $('<span class="input-group-addon cmd-ui-cal-show" data-field1="' + n + '"><i class="fa fa-calendar"></i></span>');
		t = o.clone();
		
		d.addClass("input-group");
		d.append(t);
		d.append(bttn);
		
		o.replaceWith( d );
	}
	
	//client_interactions.installEvents(n, t);	
}