

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


///@ui_masked_text

ui_widgets.ui_masked_text = new ui_widget("ui_masked_text");	
ui_widgets.ui_masked_text.initWithElement = function(o){
	console.log("@ui_masked_text.initWithElement()");
	
	this.init(o);
	this.buffer = "";
	
	var $this = this;
	var t = this.o.find(".edit-area");
	
	
	
};
ui_widgets.ui_masked_text.setAttr = function(a, v){
	
	if(a == "ro"){
		var s = (v=="1") ? true : false;
		this.o.find(".edit-area").each(function(){
			if(s){
				$(this).addClass("disabled");
			}else{
				$(this).removeClass("disabled");
			}
		});
	}
	if(a == "text-sizes"){
		var text_sizes = v.split(","); var sr = -1;
		this.o.find(".edit-area").each(function(){
			sr++;
			if(typeof text_sizes[sr] !== "undefined"){
				$(this).css({"min-width":text_sizes[sr]});
			}
		});
	}
	
	if(a == "title"){
		this.o.elmKey("o-title", v);	
	}
	if(a == "placeholder"){
		this.o.attr("placeholder", v);	
	}
}
ui_widgets.ui_masked_text.buildComponents = function(src){
	var m = null;
	var r = /\{([A-Za-z0-9_\.\/\$\:\,\-\@\*\ \[\]\#\+]*)\}/mg;
	var comp = [];
	
	var $this = this;
	$this.matching = false;
	$this.selection = null;
	
	var text_sizes = [];
	if(this.o.attr("text-sizes")){
		var s = this.o.attr("text-sizes");
		text_sizes = s.split(",");
	}
	
	var sr = -1;
	while ((m = r.exec(src)) !== null) {
		
		var s = m[1];
		var e = {"t":"fixed", "s" : s, "r":""};
		var span = "";
		
		
		if(s.indexOf("[") === 0){
			var n = /\[[\<\>]*([A-Za-z0-9_\.\/\$\:\,\-\@\*\ \#\+]*)\]/.exec(s);
			if(n){
				e.t = "edit"; e.s = "";
				e.r = n[0];
			}
			
			s = "<span class=\"edit-area\" contenteditable=\"true\"></span>";
			var span =$(s);
			span.attr("name", "edit-area-" + this.o.attr("name"));
			span.data("mask", e.r);
			
			sr++;
			
			if(typeof text_sizes[sr] !== "undefined"){
				span.css({"min-width":text_sizes[sr]});
			}
			
			span.data("mask", e.r);
			span.on('change', function(event) {
				var t = $(this);
				
				$this.broadcast("change", event, []);
			});
			span.on("click touchend", function(e){
				$this.broadcast("click", e, []);
			}).on("focus", function(e){
				$this.broadcast("focus", e, []);
			});
			
			this.o.append(span);
			
			ui_support.CreateMasked(span);
			
		}else{
			s = rea.types.strings.getSafeHTML(e.s);
			s = "<span class=\"edit-fixed\">" + s + "</span>";
			var span =$(s);
			this.o.append(span);
		}
		
		
	}
	
	
};

