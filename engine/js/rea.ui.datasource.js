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
var ui_datasource_controller = function(){
	var a = {
		uiDataProviders : [],
		uiDS: {},
		createDataSourceWithName : function(name, def){
			this.uiDS[name] = {"name":name, "def": def, "items":[], "attr":{}};
			return this.uiDS[name];
		},
		registerDataProvider: function(sel, fnSet, fnGet){
			this.uiDataProviders.push( {sel: sel, set:fnSet, get:fnGet} );
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
		datasetUseWithSelector : function(ds, sel, akeys){
			var o = (typeof sel == "string") ? $(sel) : sel;
			if(!o || (o.length <= 0)) return;
		
			var dsu = []; //used
			var ukeys = null;
			if ( Array.isArray(akeys) && (akeys.length > 0) ){
				ukeys = akeys;
			}
			
			for(i=0;i<this.uiDataProviders.length;i++){
				var def = this.uiDataProviders[i];
				o.find(def.sel).each(function(){
					var o = $( this );
					var ns = o.elmName();
					var scope = '';
					var n = ns;
					
					if(n.indexOf(".") >= 0){
						var ps = n.split(".");
						n = ps[1];
						scope = ps[0];
						
						if((scope.length > 0) && (scope != ds.name)){
							console.log("[" + scope + "::" + n + "] does not belong with [" + ds.name + "]");
							return;
						}
					}
					
					//var k = n;
					var k = (ds.items.hasOwnProperty(n)) ? n : (ds.items.hasOwnProperty(ns) ? ns: null);
					
					if( ukeys && (ukeys.indexOf(k) < 0) ){
						console.log("skip [" + k +"] for [" + scope + "::" + n + "]");
						return;
					}
					
					if ( !k ) {
						if (o.is("[data-ignore=1]")) return;
						o.val('');
						return;
					}
					
					if( dsu.indexOf(k) >= 0 ) return;

					console.log("setting [" + k +"] for [" + scope + "::" + n + "]");
					dsu.push(k);

					var attr = {"ro":0, "m":0};
					if(ds.attr && ds.attr.hasOwnProperty(k)){
						$.extend(attr, ds.attr[k]);
						console.log(attr);
					}
					
					var value = ds.items[k];
					rea.types.callback(def.set, o, value, attr);
				});
			}
		
		},
	}
	
	a.initialize();
	return a;
}();



rea.registerComponent( "ui", "ds", ["ui.panel"],
function(){
	var ui_ds = {
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
			console.log("herrrr----------------------");
			var ds = ui_datasource_controller.createDataSourceWithName(n, def);
			
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
			
			
			o.remove();
		}
	}
	return ui_ds;
}() );