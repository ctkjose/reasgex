/**
 * @module Client Interactions
 * Provide support for client interactions
 *
 */

/** Wrapper for an element/widget with some interactions helpers */
var client_interactions_element = function(o){
	this.o = o;
	this.name = this.o.elmName();
	this.def = ui_datasource_controller.getDataProvider(o); //private
	
	this.cmd_stopEvents = false; //private, use to indicate when to stop loop event
	
	//target is a primitive element, while this.o may also be the container and not the actual elm
	this.target = o; 
	
	return this;
}
client_interactions_element.prototype.getValue = function(){
	if(!this.def){
		if(o && (o.length > 0)) return o.val();
	}
	
	if(!this.def.get || (typeof this.def.get == "undefined") || (this.def.get == null) ) return;
	var v = rea.types.callback(this.def.get, this.o);
	
	if(!v || (typeof v == "undefined") || (v == null) ) return null;
	
	var value = null;
	if(v.hasOwnProperty("multiple") && (Array.isArray(v.multiple))){
		value = v.multiple;
	}else{
		value = v.value;
	}

	return value;
}
client_interactions_element.prototype.setValue = function(v){
	if(!this.def){
		if(o && (o.length > 0)) o.val(v);
		return;
	}
	if(!this.def.set || (typeof this.def.set == "undefined") || (this.def.set == null) ) return;
	rea.types.callback(this.def.set, this.o, v, {});
}
/** When in an event callback, it stops other events after the current one from executing */
client_interactions_element.prototype.stopOtherEvents = function(){
	this.cmd_stopEvents = true;
}

var client_interactions = function(){
	var a = {
		listeners : {},
		initialize : function(){		
			rea_controller.on("uiw_event", [this,"handleEvent"]);
		},
		handleEvent : function(msg){
			
			if(!this.listeners.hasOwnProperty(msg.name)) return;
			var listener = this.listeners[msg.name];
			
			if(!listener.events.hasOwnProperty(msg.action)) return;
			
			var shouldStop = false;
			var sel = ".uiw[name='" + msg.name + "']";
			var $o = $(sel);
			var cie = new client_interactions_element($o);
			
			cie.target = msg.node;
			cie.cmd_stopEvents = false;
			
			for(var i=0;i<listener.events[msg.action].length;i++){
				
				var handler = listener.events[msg.action][i];
				var r = null;
				
				var fn = handler[2];
				r = fn.apply(cie, msg);
				
				if( r != null ) msg.rvalue = r;
				if( cie.cmd_stopEvents ) break;
			}
		},
		installEvents : function(name, sel){
			
			var o = (typeof sel == "string") ? $(sel) : sel;
			
			var ciOnEvent = function(evt, name, o, e){
				console.log("@ciOnEvent(" + evt + "," + name + "," + o + ") =======================================");
				var rvalue = null;
				rea_controller.dispatchEvent("uiw_event", {"action": evt,"name": name, "event": e, "node": o, "rvalue":rvalue} );
				if( rvalue != null ) return rvalue;
			};
			o.on("change", function(e){
				ciOnEvent("change", name, o, e);
			});
		
			o.on("click touchend", function(e){
				ciOnEvent("click", name, o, e);
			});
			o.on("blur", function(e){
				ciOnEvent("blur", name, o, e);
			});
			o.on("focus", function(e){
				ciOnEvent("focus", name, o, e);
			});
		
		},
		installController : function(obj){
			var keys = Object.keys(obj);
			console.log(keys);
			revt = [
				{n:'change', r:"onChange\\_([A-Z|a-z|0-9|\\.\\-\\_]+)"},
				{n:'click',r:"onClick\\_([A-Z|a-z|0-9|\\.\\-\\_]+)"},
				{n:'focus',r:"onFocus\\_([A-Z|a-z|0-9|\\.\\-\\_]+)"},
				{n:'blur',r:"onBlur\\_([A-Z|a-z|0-9|\\.\\-\\_]+)"},
			];
			for(var i=0;i<keys.length;i++){
				var fn_name = keys[i];
				var evt = null;
				var sel = '';
				
				revt.forEach(function(e){
					console.log(e);
					var r = new RegExp(e.r, "i");
					var m = r.exec(fn_name);
					console.log(m);
					if(m){
						evt = e.n;
						sel = m[1];
					}
				});
				
				if(evt !== null){
					this.createHandler(evt, sel, obj, fn_name);
				}
			}
		},
		createHandler : function(evt, name, obj, fn_name){
			var sel = ".uiw[name='" + name + "']";
			
			if(this.listeners.hasOwnProperty(name)){
				var listener = this.listeners[name];
			}else{
				var listener = {"name" : name, "sel": sel, "events" : {"change" :[], "click": [], "focus":[], "blur":[], "keydown":[] }};
				this.listeners[name] = listener;
			}
			
			var handler = [obj, fn_name, obj[fn_name] ];
			
			listener.events[evt].push(handler);
			console.log("@ciCreateHandler(" + evt + "," + sel + "," + fn_name + ")");
			
			console.log(this.listeners);
			
			//this.onEvent(sel, evt, obj[fn_name]);
			
		},
		onEvent : function(name,evt, fn){
			var sel = ".uiw[name='" + name + "']";
			
			var $o = $(sel);
			var cie = new client_interactions_element($o);
			
			$o.on(evt, function(e){
				fn.apply(cie, e);
			});
		},
		ciGetValue : function(sel){
			var $o = $(sel);
			var n = $o.elmName();
			var def = ui_datasource_controller.getDataProvider($o);
			if(!def) return null;
			
			if(!def.get || (typeof def.get == "undefined") || (def.get == null) ) return;
			var v = rea.types.callback(def.get, $o);
			
			if(!v || (typeof v == "undefined") || (v == null) ) return null;
			
			var value = null;
			if(v.hasOwnProperty("multiple") && (Array.isArray(v.multiple))){
				value = v.multiple;
			}else{
				value = v.value;
			}
	
			return value;
		},
		ciSetValue : function(sel, v){
			var e = $(sel);
			var comp_name = e.elmKey("uiw");
			var n = e.elmName();	
			
			var def = ui_datasource_controller.getDataProvider(e);
			if(!def) return;
			if(!def.set || (typeof def.set == "undefined") || (def.set == null) ) return;
			
			rea.types.callback(def.set, e, v, {});
		}
	};
	a.initialize();
	return a;
}();



function test(){
	client_interactions.installController(myController);
	
}