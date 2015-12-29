var ui_datasource_controller = function(){
	var a = {
		uiDataProviders : [],
		uiSet1: [],
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
		datasetUseWithSelector : function(ds, sel){
			var o = (typeof sel == "string") ? $(sel) : sel;
			if(!o || (o.length <= 0)) return;
		
			var dsu = []; //used
			
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
					
					var k = (ds.items.hasOwnProperty(n)) ? n : (ds.items.hasOwnProperty(ns) ? ns: null);
					if ( !k ) {
						if (o.is("[data-ignore=1]")) return;
						o.val('');
						return;
					}
					
					if( dsu.indexOf(k) >= 0 ) return;

					console.log("setting [" + k +"] for [" + scope + "::" + n + "]");
					dsu.push(k);

					var attr = {ro:0, m:1};
					if(ds.attr.hasOwnProperty(k)){
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