
///@ui_date

ui_widgets.ui_date = new ui_widget("ui_date");
ui_widgets.ui_date.initWithElement = function(o){
	console.log("@ui_date.initWithElement()");
	
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
	console.log(d);
	if(!d) return;

	v = (d.getMonth()+1) + '/' + d.getDate() + '/' + d.getFullYear();
	this.o.attr("title", o.data("o-title") + "; Value " + v);
	
	this.o.elmKey("date", v);
	
	this.o.val(value);
}
