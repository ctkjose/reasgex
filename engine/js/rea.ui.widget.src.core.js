var ui_widgets = {
	createInstanceForElement: function(widgetName, o){
		var a = this[name].instanceWithElement(o);
		return a;
	}
};

var ui_widget = function(type) {
	
	
	this.type = type;
	this.o = undefined;
	this.target = undefined;
	
	return this;
}
ui_widget.prototype.instance = function(){
	console.log("@instance");
	var a = new ui_widget(this.type);
	
	a.type = this.type;
	a.o = undefined;
	a.target = undefined;
	
	var keys = Object.keys(this);
	for(var i=0;i<keys.length;i++){
		var k = keys[i];
		if(a.hasOwnProperty(k)) continue;
		a[k] = this[k];
	}
	
	return a;
};
ui_widget.prototype.instanceWithElement = function(o){
	var a = this.instance();
	a.initWithElement(o);
	return a;
}
ui_widget.prototype.initWithElement = function(o){
	this.init(o);	
}
ui_widget.prototype.init = function(o){
	if( o instanceof jQuery ){
		this.o = o;
	}else{
		this.o = $(o);
	}
	
	
	console.log("@ui_widget." + this.type + ".init()");
}
ui_widget.prototype.installEvents = function(){
	var $this = this;
	this.o.on("change", function(e){
		$this.broadcast("change", e, []);
	});

	this.o.on("click touchend", function(e){
		$this.broadcast("click", e, []);
	});
	this.o.on("blur", function(e){
		$this.broadcast("blur", e, []);
	});
	this.o.on("focus", function(e){
		$this.broadcast("focus", e, []);
	});
};
ui_widget.prototype.broadcast = function(evt, e, args){
	
	var n = this.o.elmName();
	var msg = {"event_name": evt, "name" : n, "widget": this, "event": e };
	
	var action = n + "_" + evt;
	rea_controller.dispatchEvent(action, msg );
}
ui_widget.prototype.triggerChange = function(){
	this.broadcast("change", null,{});
}
ui_widget.prototype.triggerFocus = function(){
	this.broadcast("focus", null,{});
}

