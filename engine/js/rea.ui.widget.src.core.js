var ui_widgets = {
	expanders: [],
	createInstanceForElement: function(widgetName, o){
		var a = this[name].instanceWithElement(o);
		return a;
	},
	registerWidgets : function(){
		var keys = Object.keys(this);
		
		
		for(var i=0;i<keys.length;i++){
			var k = keys[i];
			var o = this[k];
			if(!(o instanceof ui_widget)) continue;
			if(!o.hasOwnProperty("register")) continue;
			var m = o.register();
		
			if(!m.hasOwnProperty("provide-expand")) m["provide-expand"] = [];
			if(!m.hasOwnProperty("privide-data")) m["privide-data"] = [];
			if(!m.hasOwnProperty("expand-needs")) m["expand-needs"] = null;
			
			o.behavior = m;
			
			if( m["provide-expand"].length > 0){
				this.expanders.push( {"obj": k, "selectors": m["provide-expand"], "need":m["expand-needs"] } );
			}
		}
		
		var el = [];
		var c = this.expanders.length-1;
		for(var i=0;i<=c;i++){
			var e = this.expanders[i];
			console.log("checking[" + i + "]=" + e.obj + "============");
			if(!Array.isArray(e.need)){
				console.log("keep[" + i + "]=" + e.obj + "");
				el.push(e.obj);
				continue;
			}
			
			ok = true;
			for(var j=0;j<e.need.length;j++){
				if(el.indexOf(e.need[j]) < 0){
					ok = false;
					if(i == c) break;
					this.expanders.splice(i, 1);
					this.expanders.push(e);
					console.log("push back[" + i + "]=" + e.obj + ", missing [" + e.need[j] + "]");
					i--;
					break;
				}
			}
			
			if((i==c) && !ok) {
				console.log("skip[" + i + "]=" + e.obj + " missing dependencies");
			}
			if(ok) el.push(e.obj);
			if(ok) console.log("keep[" + i + "]=" + e.obj + "");
		}
	},
	expandDefaults : function(){
			
		var defaults = [".extend"];
		for(var i in defaults){
			this.expandForSelector(defaults[i]);	
		}
	},
	expandForSelector : function(selector){
		var o = (typeof selector == "string") ? $(selector) : selector;
		
		if(!o || (o.length <= 0)) return;
		
		if(o.hasClass("extended")) return;
		
		if(!o.hasClass("view")) o.addClass("view");
		if(o.hasClass("extend")) o.removeClass("extend");
		
		o.addClass("extended");
		
		for(var i=0;i<this.expanders.length;i++){
			var def = this.expanders[i];
			console.log(def);
			for(j=0;j<def.selectors.length;j++){
				var sel = def.selectors[j];
				o.find(sel).each(function(){
					var o = $( this );
					ui_widgets[def.obj].expandElement(o);
				});
			}
		}
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

