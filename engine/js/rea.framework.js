/** @module reasg/js/framework */

var rea = function(){
	return {
		version : '1.0',
		controller : {},
		lang : 'en',
		ui : {},
		components : {},
		components_registered : [],
		
		getLang : function(){
			var l = (""+document.documentElement.lang).toLowerCase();
			var o = l.split("-");
			l = ( o.length > 0 ) ? o[0] : l;
			if( l.length == 0) return "en";
			return l;
		},
		initialize : function(){
			this.lang = this.getLang();
			
			
		},
		registerComponent : function( scope, name, needs, obj) {
			var e ={'scope': scope, 'name': name, 'needs':needs,'instance': obj};
			//console.log("rea.registerComponent(" + scope + "." + name + ")");
			
			this.components_registered.push( e );
		},
		loadComponents : function(){
			var mt = this.components_registered.length + 1;
			while(this.components_registered.length >= 1){
				//console.log("Components to load=" + this.components_registered.length);
				var e = this.components_registered[0];
				//console.log("evaluating::" + e.scope+"::"+ e.name );
				
				if( this.components.hasOwnProperty(e.scope) && this.components[e.scope].hasOwnProperty(e.name) ){
					//console.log("remove::" + e.name);
					this.components_registered.shift();
					continue;
				}
				
				var dc = (e.needs && Array.isArray(e.needs)) ? e.needs.length : 0;
				var dep_ok = 0;
				if(dc > 0){
					for(var i=0; i< dc; i++){
						var p = e.needs[i].split(".");
						//console.log("rea.component checking dependency " + p[0] + "::" + p[1]);
						if( this.components.hasOwnProperty(p[0]) && this.components[p[0]].hasOwnProperty(p[1]) ) dep_ok++;
					}

					//console.log(e.name + "::needs::"+dc+"::dependencies::found::" + dep_ok);
					if( dep_ok < dc ){
						if(!e.hasOwnProperty("tries")){
							e.tries = 0;
							this.components_registered.shift();
							this.components_registered.push(e);
						}
						
						if(++e.tries > mt){
							//console.log("Unable to load dependancies for::" + e.name + "::load aborted");
							this.components_registered.shift();
						}
						
						continue;
					}
				}
				
				console.log("rea.components." + e.scope + "." + e.name + " loaded...");
				//console.log("index =" + i);
				if(!this.components.hasOwnProperty(e.scope)) this.components[e.scope] = {};
				this.components[e.scope][e.name] = e.instance;
				this.components_registered.shift();
				
				rea_controller.dispatchEvent("component_loaded", e);
			}	
			
		}
		
		
	};
}();

rea.types = function(){
	return {
		
		
		
	}
}();

//Function Helpers
/**
* Invoke callbacks with any number of arguments
* 
* @param {Object} fn - A function or an Array with [obj, "fn_name"]
*/
rea.types.callback = function(fn){
	var args = Array.prototype.slice.call(arguments, 1);
	if(fn && Array.isArray(fn)){
		var cfn = (typeof fn[1] === 'string') ? fn[0][fn[1]] : fn[1];
		return cfn.apply(fn[0], args);
	}else if(typeof fn == "function"){
		return fn.apply(fn, args);
	}
	return undefined;
}

/**
* Invoke callbacks with an array of arguments
* 
* @param {Object} fn - A function or an Array with [obj, "fn_name"]
* @param {Array} args - An Array of arguments
*/
rea.types.callbackWithArguments = function(fn, args){
	var a = [fn];
	Array.prototype.push.apply(a, args);
	rea.types.callback.apply(null, a );
}
