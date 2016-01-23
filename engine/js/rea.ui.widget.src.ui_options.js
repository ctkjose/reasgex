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
ui_widgets.ui_options.register = function(){
	return {
		"provide-expand": ["div.options"],
		"privide-data": true,
		"expand-needs": ["ui_table"],
	};
}
ui_widgets.ui_options.expandElement = function(o){
	var v = "";
	var n = o.elmName();
	
	var scope = "default";
	if( o.attr("scope") ) { scope = o.attr("scope"); o.removeAttr("scope"); }
	
	if (o.attr("default")) {
		v = o.attr("default");
	}
	
	o.attr("extended", 1);
	o.addClass("field").addClass("ui_options").addClass("uiw");
	o.elmKey("uiw", "ui_options");
	
	var tz = '0';
	if(v == "1"){
		o.addClass("active");
		tz = '44';
	}
	
	o.elmKey("value", v);
	
	var options = {};
	if (o.attr("options")) {
		var ops = JSON.parse(o.attr("options"));
		for (var k in ops) {
			options[k] = ops[k];
		}
	}else if (o.hasClass("yesno")) {
		options = { "0":"No", "1": "Yes" };
		o.removeAttr("max-options").attr("max-options", 1);
	}
	
	var i = 0;
	for (var k in options) {
		i++;
		var opn = n + "_" + i;
		
		var op = $("<span class=\"edit-option\" value=\"\" onclick=\"void(0);\"></span>");
		op.attr("value", k);
		op.attr("name", opn);
		op.addClass("unselectable");
		op.html(options[k]);
		
		if(o.hasClass("yesno")) {
			if(k=="1"){ op.addClass("yes");	} else {op.addClass("no");}
		}
		
		if(Array.isArray(v)){
			
		}else if(v == k){
			op.addClass("active");
		}
		o.append(op);
	}
	
	var fno = function(p,e){
		var out = [];
		p.find(".edit-option.active").each(function(){out.push($(this).attr("value"));});
		p.elmKey("value", out.join(","));
		
		var rvalue = false;
		rea_controller.dispatchEvent("uiw_event", {"action": "change","name": n, "event": e, "node": p, "rvalue":rvalue} );
	}
	var fn = function(e){
		var o = $(e.target);
		if(!o.hasClass("edit-option")) return;
		
		var p = o.closest(".ui_options");
		if(p.hasClass("disabled")) return;
		
		if(o.hasClass("active")){
			o.removeClass("active");
			fno(p,e);
			return;
		}
		
		if(p.attr("max-options")){
			var mc = p.attr("max-options");
			if(mc == 1){
				p.find(".edit-option.active").each(function(){$(this).removeClass("active");});
			}else{
				var c = p.find(".edit-option.active").length;
				if(c+1>mc) return;
			}
		}
		
		o.addClass("active");
		
		fno(p,e);
		
		
	}
	
	o.on("click", fn);
}
