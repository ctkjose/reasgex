/**
 * @module Client Interactions
 * Provide support for client interactions
 *
 */

/** Wrapper for an element/widget with some interactions helpers */
var client_interactions_element = function(o){
	this.o = o;
	this.name = this.o.elmName();
	this.actions = {};
	this.def = ui_datasource_controller.getDataProvider(o); //private
	
	this.cmd_stopEvents = false; //private, use to indicate when to stop loop event
	
	//target is a primitive element, while this.o may also be the container and not the actual elm
	this.target = o; 
	
	return this;
}
client_interactions_element.prototype.focus = function(v){
	this.target.focus();
}
client_interactions_element.prototype.attr = function(s, val) {
	if(val){
		return this.target.attr(s, val);
	}else{
		return this.target.attr(s);
	}
}
client_interactions_element.prototype.html = function(val) {
	if(val){
		return this.target.html(val);
	}else{
		return this.target.html();
	}
}
client_interactions_element.prototype.val = function(val) {
	if(val){
		return this.target.val(val);
	}else{
		return this.target.val();
	}
}
client_interactions_element.prototype.preventDefault = function(){
	this.e.stopImmediatePropagation();
	this.e.preventDefault();
}
client_interactions_element.prototype.appendAction = function(evt, fn){
	if(!this.actions.hasOwnProperty(evt)) this.actions[evt] = [];
	
	this.actions[evt].push(fn);
}
client_interactions_element.prototype.installEvent = function(event){
	var n = this;
	var evt = event;
	this.o.on(evt, function(e){
		console.log("client_interactions_element event " + evt);
		return n.executeAction(evt, e);
	});
}
client_interactions_element.prototype.executeAction = function(evt, e){
	if(!this.actions.hasOwnProperty(evt)) return;
	
	this.e = e;
	var r = true;
	this.cmd_stopEvents = false;
	
	for(var i=0; i< this.actions[evt].length;i++){
		var fn = this.actions[evt][i];
		r = fn.apply(this);
		if(this.cmd_stopEvents) break;
	}
	
	return;
}
client_interactions_element.prototype.getValue = function(){
	if(!this.def){
		if(this.o && (this.o.length > 0)) return this.o.val();
		return "";
	}
	console.log(this.def);
	
	if(!this.def.get || (typeof this.def.get == "undefined") || (this.def.get == null) ){
		if(this.o && (this.o.length > 0)) return this.o.val();
		return "";
	}
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



var client_action = function(v){
	this.url = "";
	this.type = "backend1";
	this.action = client_interactions.backend.action;
	this.controller = client_interactions.backend.controller;
	this.scope = client_interactions.backend.scope;
	this.params = {};
	
	if(typeof v == "string") this.parse(v);
	return this;
}
client_action.prototype.getURL = function(){
	
	if(this.type == "url") return this.url;
	
	var url = "";
	if(this.type == "backend"){
		var u = new URI(location.href);
		u.segment([client_interactions.backend.root_url,"app",client_interactions.backend.location.toLowerCase(),this.scope,this.controller,this.action,""]);
		u.query(URI.buildQuery(this.params));
		
		url = u.toString();
	}
	
	return url;
}
client_action.prototype.parse = function(v){
	if(typeof v != "string") return;
	
	var s = "" + v.toLocaleString();
	this.action = "";
	this.controller = client_interactions.backend.controller;
	this.scope = client_interactions.backend.scope;
	this.url = "";
	
	var m = /\@\(([A-Za-z0-9_\.\-\/]+)\)/.exec(s);
	if( m ){ //is a backend action
		this.type = "backend";
		s = m[1];
		
		var p = s.split("\/");
		var c = p.length; var i = 0;
		if( p[0].length == 0 ){ c--; i++ }
		
		if(c == 3){
			this.action = p[i+2];
			this.controller = p[i+1];
			this.scope = p[i];
		}else if(c==2){
			this.action = p[i+1];
			this.controller = p[i];
		}else if(c==1){
			this.action = p[i];
		}
		
		return;
	}
	
	m = /url\(([A-Za-z0-9_\.\-\/\?\+\=\&\:\@]+)\)/.exec(s);
	if( m ){ //is an url
		this.type = "url";
		this.url = m[1];
		return;
	}
};


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
			
			cie.cmd_stopEvents = false;
		},
		installEvents : function(name, sel){
			
			var o = (typeof sel == "string") ? $(sel) : sel;
			
			var ciOnEvent = function(evt, name, o, e){
				//console.log("@ciOnEvent(" + evt + "," + name + "," + o + ") =======================================");
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
					var r = new RegExp(e.r, "i");
					var m = r.exec(fn_name);
					if(m){
						evt = e.n;
						sel = m[1];
						sel = sel.toLocaleLowerCase();
					}
				});
				
				if(evt !== null){
					this.createHandler(evt, sel, obj, fn_name);
				}
			}
		},
		attachHandler : function(evt, sel, fn){
			var o = {action:fn};
			this.createHandler(evt, sel, o, "action");
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
			//console.log("@ciCreateHandler(" + evt + "," + sel + "," + fn_name + ")");
			//console.log(this.listeners);	
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
			return "";
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
			return;
		
			var e = $(sel);
			var comp_name = e.elmKey("uiw");
			var n = e.elmName();	
			
			var def = ui_datasource_controller.getDataProvider(e);
			if(!def) return;
			if(!def.set || (typeof def.set == "undefined") || (def.set == null) ) return;
			
			rea.types.callback(def.set, e, v, {});
		},
		displayAlert : function(type, msg){
			s = '<div class="alert alert-' + type + '" role="alert">';
			s+= '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>'
			s+= msg + '</div>';
				
			//$('.place-alerts').append(s);
			ui_support.createNotification(msg, type);
		},
		displayMsg : function(msg){
			alert(msg);
		},
		js : function(code){
			var fn = null;
			eval(code);
			
			if( typeof fn !== "function") return;
			fn();
		}
	};
	a.initialize();
	return a;
}();
