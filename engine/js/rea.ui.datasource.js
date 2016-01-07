var rea_command = {
	
	getViewTarget : function(a){
		
		var vn = "";
		var ve = "";
		if(a.indexOf(":") >= 0){
			var ps = a.split(":");
			vn = ps[0];
			ve = ps[1];
		}else{
			vn = a;
		}
		
		return {"name" : vn, 'o': $("[name='" + vn + "']"), "items" : [ve] };
	}
	
}
var ui_values_ = {
	"uiwd-text" : {
		"set" : function(o, value, attr){
			
			var v = '';
			var ty = (typeof value);
	
			if ( Array.isArray(value) && (value.hasOwnProperty(1)) ) {
				v = '';
			}else if( (ty == "string") || (ty == "number") ) {
				v = value;
			}else if( (ty == "boolean") ) {
				v = (value) ? '1' : '0';
			}
			
			if(attr && attr.hasOwnProperty('ro') && attr.ro){
				o.attr("disabled", "disabled");
			}else if(o.attr("disabled")){
				o.removeAttr("disabled");
			}
			if(attr && attr.hasOwnProperty('ph')){
				o.attr("placeholder", attr.ph);
			}
			if(attr && attr.hasOwnProperty('dc')){
				var p = o.closest(".input-group[name='" + o.attr("name") + "']");
				if(p && (p.length > 0)){
					var d = p.find(".input-group-addon");
					if(d && (d.length > 0)) d.html( attr.dc );
				}
			}
			
			o.val(v);
		}
	},
	"uiwd-checkbox" : {
		"set" : function(o, value, attr){
			
		}
	},
	"uiwd-radio" : {
		"set" : function(o, value, attr){
			
		}
	}
}
var ui_ds = function(){
	this.name = "";
	this.uid = "";
	this.def = {'source': 'ajax', 'source_pull':'static', 'url':'', 'url_find':'', 'bind': {} };
	this.items = [];
	this.attr = {};
	this.ready = false;
	console.log("@ui_ds.constructor(" + arguments.length + ")" );
	
	if(arguments.length == 1){
		var o = arguments[0];
		if( (typeof o == "object") && (o.hasOwnProperty("def") || o.hasOwnProperty("items") || o.hasOwnProperty("attr"))){
			//console.log(o);
			if(o.hasOwnProperty("def")) $.extend(this.def, o.def);
			
			if( o.hasOwnProperty("name") ) this.name = o.name;
			if( o.hasOwnProperty("uid") ) this.uid = o.uid;
			
			if( o.hasOwnProperty("items") ){
				this.items = o.items;
				this.ready = true;
			}
			if( o.hasOwnProperty("attr") ){
				this.attr = o.attr;	
			}
		}else if( (typeof o == "string") ){
			this.name = arguments[0];
		}
	}else if(arguments.length == 2){
		this.name = arguments[0];
		$.extend(this.def, arguments[1]);
	}else if(arguments.length == 3){
		this.name = arguments[0];
		$.extend(this.def, arguments[1]);
		this.items = arguments[2];
		this.ready = true;
	}else if(arguments.length == 4){
		this.name = arguments[0];
		$.extend(this.def, arguments[1]);
		this.items = arguments[2];
		this.attr = arguments[3];
		this.ready = true;
	}
	
	return this;
}
ui_ds.prototype.itemsChanged = function(){
	console.log("@ds[" + this.name + "].itemsChanged()-----");
	rea_controller.dispatchEvent( "ds_changed_" + this.name , this );
	
}
ui_ds.prototype.ajaxSuccess = function(data){
	console.log("@ds[" + this.name + "].ajaxSuccess()-----");
	console.log(data);
	
	if( (typeof data == "object") && (data.hasOwnProperty("items") || data.hasOwnProperty("attr")) ){
		if( data.hasOwnProperty("items") ){
			this.items = data.items;
			
		}
		if( data.hasOwnProperty("attr") ){
			this.attr = data.attr;	
		}
	}
	
	this.ready = true;
	this.itemsChanged();  
}
ui_ds.prototype.ajaxFailure = function(data){
	console.log("@ds[" + this.name + "].ajaxFailure()-----");
}
ui_ds.prototype.ajaxPopulate = function(){
	
	var a = null;
	if(this.def.action.length > 0){
		a = new client_action( this.def.action );
	}else if(this.def.url.length > 0){
		a = new client_action( '@(' + this.def.url + ')');
	}else{
		return;
	}
	
	var ds = this;
	var fnSuccess = function(data){
		ds.ajaxSuccess(data);
		//rea.types.callback(fnDone);
	}
	rea_controller.backend.sendAction(a, {},[this,"ajaxSuccess"],[this,"ajaxFailure"] );
}
/**
* Loads a datasource
*/
ui_ds.prototype.makeAvailable = function(){
	if ( (this.def.source == 'ajax') && (this.def.url.length == 0) && (this.def.action.length == 0) ) return this;
	
	var up = false;
	if ( (this.def.source == 'ajax') ){
		up = (this.def.source_pull != 'static') ? true : (!this.ready);
	}
	
	if(up){
		this.ajaxPopulate();
		return this;
	}
		
	this.ready = true;
	//if (fnDone) {
	//	rea.types.callbackWithArguments(fn, [this]);
	//}
	this.itemsChanged();
	return this;
}

var ui_datasource_controller = function(){
	var a = {
		uiDataProviders : {},
		uiDataProvidersKeys : [],
		uiDS: {},
		getDatsourceWithName : function(name){
			if(!this.uiDS.hasOwnProperty(name)){
				return new ui_ds(name);
			}
			
			return this.uiDS[name];
		},
		createDataSourceWithDefinition : function(name, def){	
			this.uiDS[name] = new ui_ds(name,def);
			return this.uiDS[name];
		},
		createDataSourceWithObject : function(name, obj){
			
			var o = new ui_ds(obj);
			o.name = name;
			console.log("createDataSourceWithObject------");
			
			this.uiDS[name] = o;
			console.log(this.uiDS[name]);
			return this.uiDS[name];
		},
		
		registerDataProvider: function(classes, fnSet, fnGet){
			
			if(!Array.isArray(classes)) return;
			
			for(var i in classes){
				var n = classes[i];
				console.log("registerDataProvider[" + n +"]");
				this.uiDataProviders[n]={ wd: n, set:fnSet, get:fnGet};
				this.uiDataProvidersKeys.push(n);
			}
		},
		componentLoaded : function(e){
			console.log("@ui_datasource_controller.componentLoaded()");
			console.log(e);
			//console.log("@rea_helper_ui_extender.componentLoaded(" + e.scope + "." + e.name + ")");
			if( !e.instance ) return;
			if( !e.instance.hasOwnProperty("uiDataProvider") ) return;
			
			console.log("ui_datasource_controller.componentLoaded():: " + e.scope + "." + e.name + ".uiDataProvider()");
			e.instance.uiDataProvider( this );
		},
		initialize : function(){
			
			rea_controller.on("component_loaded", [this,"componentLoaded"]);
			console.log("@ui_datasource_controller.constructor()");
		},
		matchValue : function(a, b){
			var ok = false;
			var t = Array.isArray(a) ? 'array' : (typeof a);
			
			//console.log("matchValue(" + b + ", " + t + ") =============================");
			
			if ( t == 'array' ) {
				for(var i = 0; i< a.length; i++){
					if (this.matchValue( a[i], b )){ ok = true; break; }
				}
			}else if( t == "string" ) {
				ok = (b == a);
			}else if( t == "number" ) {
				ok = ( (b*1) == a);
			}else if( t == "boolean" ) {
				ok = a ? (b == '1') : (b == '0');
			}else{
				ok = (a == b);
			}
			
			return ok;
		},
		/**
		 * implements the populate verb
		 */
		populate : function(ops){
			if( !ops.hasOwnProperty("view") ){	
				return;
			}
			
			var vn = ops.view;
			var view = null;
			view = rea_command.getViewTarget(ops.view);
			
			console.log(view);
			//this.datasetUseWithSelector()
			
		},
		createDatasetFromSelector : function(sel, akeys, scope){
			var o = (typeof sel == "string") ? $(sel) : sel;
			if(!o || (o.length <= 0)) return;
		
			var dsu = []; //used
			var data = {};
			var ukeys = null;
			if ( Array.isArray(akeys) && (akeys.length > 0) ){
				ukeys = akeys;
			}
			
			var fnpush = function(v){
				if( data.hasOwnProperty( v.name )){
					console.log("already has 1 " + v.name + " must create array");
					if ( Array.isArray(data[v.name] ) ){
						console.log("already has " + v.name + " is an array");
						data[v.name].push( v.value );
					}else{
						console.log("already has " + v.name + " creating array");
						var r = $.extend({}, data[v.name]);
						data[v.name] = [r, v.value];
					}
				}else{
					data[v.name] = v.value;
				}
			};
			
			console.log("@createDatasetFromSelector(" + sel + ")======================================");
			
			var uiw = o.find(".uiw");
			uiw.each(function(){
				var e = $( this );
				var comp_name = e.elmKey("uiw");
				var n = e.elmName();
				
				console.log("createDatasetFromSelector(" + sel + ") found element [" + n + "]");
				
				if( ukeys && (ukeys.indexOf(n) < 0) ){
					console.log("skip [" + sel +"] for [" + n + "]");
					return;
				}
				
				if(e.is("[data-ignore=1]")) return;
				if(e.elmHasKey("scope")){
					if (!scope) return;
					if (e.elmKey('scope') != scope) return;
				}
				
				if( dsu.indexOf(n) >= 0 ) return;
				
				console.log("createDatasetFromSelector(" + sel + ") found element [" + n + "] looking for def");
				var def = ui_datasource_controller.getDataProvider(e);
				if(!def) return;
				if(!def.get || (typeof def.get == "undefined") || (def.get == null) ) return;
				
				console.log("createDatasetFromSelector(" + sel + ") found element [" + n + "] wd [" + def.wd + "]---------------------");
				
				var v = rea.types.callback(def.get, e);
				console.log(v);
				if(!v || (typeof v == "undefined") || (v == null) ){
					return;
				}
				
				if(v.hasOwnProperty("multiple") && (Array.isArray(v.multiple))){
					console.log("has multiple...");
					for(var x=0; x<v.multiple.length; x++){
						var v1 = v.multiple[x];
						console.log(v1);
						fnpush(v1);
					}
				}else{
					fnpush(v);
				}
			});
			
			console.log("datset created ----------------------");
			console.log(data);
			
			return data;
			
		},
		getDataProvider : function(e){
			var def = null;
			
			for(i=0;i<this.uiDataProvidersKeys.length;i++){
				var wd = this.uiDataProvidersKeys[i];
				if(!e.hasClass(wd)) continue;
				def = this.uiDataProviders[wd];
				break;
			}
			return def;
		},
		populateSelectorWithDataset : function(sel, ds, akeys){
			var o = (typeof sel == "string") ? $(sel) : sel;
			if(!o || (o.length <= 0)) return;
		
			var dsu = []; //used
			var ukeys = null;
			if ( Array.isArray(akeys) && (akeys.length > 0) ){
				ukeys = akeys;
			}
			
			var uiw = o.find(".uiw");
			console.log("populateSelectorWithDataset(" + sel + ") searching for elements ---------------------");
			uiw.each(function(){
				var e = $( this );
				var comp_name = e.elmKey("uiw");
				var n = e.elmName();
				
				if( ukeys && (ukeys.indexOf(n) < 0) ){
					console.log("skip [" + sel +"] for [" + n + "]");
					return;
				}
				
				if( dsu.indexOf(n) >= 0 ) return;
				
				if ( !ds.items.hasOwnProperty(n) ) {
					return;
				}
				
				var def = ui_datasource_controller.getDataProvider(e);
				if(!def) return;
				if(!def.set || (typeof def.set == "undefined") || (def.set == null) ) return;
				
				console.log("populateSelectorWithDataset(" + sel + ") found element [" + n + "] wd [" + def.wd + "]---------------------");
					
				var attr = {};
				if(ds.attr && ds.attr.hasOwnProperty(n)){
					var attr_defaults = {"ro":0};
					$.extend(attr, attr_defaults,ds.attr[n]);
				}
					
				var value = ds.items[n];
				rea.types.callback(def.set, e, value, attr);
				
			});
		},
	}
	
	a.initialize();
	return a;
}();



rea.registerComponent( "ui", "ds", ["ui.panel"],
function(){
	var a = {
		initialize : function(){
			
		},
		
		uiExtender : function(extender){
			extender.registerGlobalExpandHelper( "datasource", [this, "uiExpandElement"] );
		},
		uiExpandElement: function(o){
			console.log("@ui.ds.uiExpandElement()");			
			var n = o.attr("name");
	
			var def = {"source":"json","source_pull":"static","url":"","url_find":"","bind":[] };
			
			if (o.attr("href")) {
				def.source = 'ajax';
				def.url = o.attr("href");
				
				if (o.attr("source_pull")) {
					def.source_pull=o.attr("source_pull");
				}else{
					def.source_pull='static';
				}
			}
			if (o.attr("src")) {
				def.source = 'ajax';
				def.action = o.attr("src");
				
				if (o.attr("source_pull")) {
					def.source_pull=o.attr("source_pull");
				}else{
					def.source_pull='static';
				}
			}
			var ds = ui_datasource_controller.createDataSourceWithDefinition(n, def);
			
			var ops = o.find('option');
			ops.each( function(x) {
				var op = $(this);
				var e = {};
				e[op.attr('value')]= op.html();
				ds.items.push(e);
			});
			
			var sitems = o.find("script[name='" + n + ".items']");
			if(sitems && (sitems.length)){
				console.log("evaluating script items----------------------");
				var s = "ds.items = " + sitems.html();
				eval(s);
				console.log(ds);
			}
			
			var sattr = o.find("script[name='" + n + ".attr']");
			if(sattr && (sattr.length)){
				console.log("evaluating script attr----------------------");
				var items = [];
				var s = "ds.attr = " + sattr.html();
				eval(s);
				console.log(ds);
			}
			
			ds.makeAvailable();
			
			o.remove();
		}
	}
	return a;
}() );

